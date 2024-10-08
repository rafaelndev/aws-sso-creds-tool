#!/usr/bin/env node

import {
  awsCredentialsPath,
  useAccountId,
  defaultSection,
  sso_accounts,
} from "./params.js";
import ConfigParser from "configparser";
import {
  getAccountRoleCredentials,
  getAccountRoles,
  getAccounts,
  getAccessToken,
  authorizeDevice,
  registerClient,
} from "./aws.js";
import { error } from "./util.js";
const config = new ConfigParser();

async function pollForAccessToken(
  clientId,
  clientSecret,
  deviceCode,
  userCode
) {
  return getAccessToken(clientId, clientSecret, deviceCode, userCode).catch(
    (error) => {
      if (error.name === "AuthorizationPendingException") {
        return new Promise((resolve) => {
          setTimeout(
            () =>
              pollForAccessToken(
                clientId,
                clientSecret,
                deviceCode,
                userCode
              ).then(resolve),
            1000
          );
        });
      }
      console.error(error);
    }
  );
}

const updateCredentials = async () => {
  // search for credentials file first, default: ~/.aws/credentials
  try {
    await config.readAsync(awsCredentialsPath);
  } catch (e) {
    error("cannot open file: " + awsCredentialsPath);
  }

  // start authentication flow
  const { clientId, clientSecret } = await registerClient();
  // needs to the user to be fully logged in
  const { deviceCode, userCode } = await authorizeDevice(
    clientId,
    clientSecret
  );

  // const { accessToken } = await getAccessToken(clientId, clientSecret, deviceCode, userCode);
  const { accessToken } = await pollForAccessToken(
    clientId,
    clientSecret,
    deviceCode,
    userCode
  );
  const { accountList } = await getAccounts(accessToken);

  for (const { accountId, accountName } of accountList) {
    const { roleList } = await getAccountRoles(accessToken, accountId);

    for (const { roleName } of roleList) {
      if (sso_accounts.includes(accountName)) {
        const { accessKeyId, secretAccessKey, sessionToken } =
          await getAccountRoleCredentials(accessToken, accountId, roleName);

        // default format is [account-name_AWSRoleName]
        const account_section_name = useAccountId
          ? accountId + "_" + roleName
          : accountName + "_" + roleName;
        !config.sections().includes(account_section_name)
          ? config.addSection(account_section_name)
          : "";
        config.set(account_section_name, "aws_access_key_id", accessKeyId);
        config.set(
          account_section_name,
          "aws_secret_access_key",
          secretAccessKey
        );
        config.set(account_section_name, "aws_session_token", sessionToken);
        console.log(config.items(account_section_name));

        if (account_section_name === defaultSection) {
          const default_section = "default";
          !config.sections().includes(default_section)
            ? config.addSection(default_section)
            : "";

          config.set(default_section, "aws_access_key_id", accessKeyId);
          config.set(default_section, "aws_secret_access_key", secretAccessKey);
          config.set(default_section, "aws_session_token", sessionToken);
        }
      }
    }
  }

  // saves changes into credentials file
  config.write(awsCredentialsPath);
  console.log("credentials updated");
};

updateCredentials();
