import open from "open";

import { startUrl, region, clientName } from "./params.js";

import {
  SSOClient,
  ListAccountsCommand,
  ListAccountRolesCommand,
  GetRoleCredentialsCommand,
} from "@aws-sdk/client-sso";
import {
  SSOOIDCClient,
  RegisterClientCommand,
  StartDeviceAuthorizationCommand,
  CreateTokenCommand,
} from "@aws-sdk/client-sso-oidc";

const clientSso = new SSOClient({ region: region });
const clientDevice = new SSOOIDCClient({ region: region });

export async function registerClient() {
  const registerClientCommand = new RegisterClientCommand({
    clientName: clientName,
    clientType: "public",
  });
  return await clientDevice.send(registerClientCommand);
}

export async function authorizeDevice(clientId, clientSecret) {
  const startDeviceAuthorizationCommand = new StartDeviceAuthorizationCommand({
    clientId: clientId,
    clientSecret: clientSecret,
    startUrl: startUrl,
  });
  const { verificationUri, deviceCode, userCode } = await clientDevice.send(
    startDeviceAuthorizationCommand
  );

  open(`${verificationUri}?user_code=${userCode}`);
  console.info("Waiting for login, to cancel press CTRL+C");

  return {
    deviceCode: deviceCode,
    userCode: userCode,
  };
}

export async function getAccessToken(
  clientId,
  clientSecret,
  deviceCode,
  userCode
) {
  const createTokenCommand = new CreateTokenCommand({
    clientId: clientId,
    clientSecret: clientSecret,
    grantType: "urn:ietf:params:oauth:grant-type:device_code",
    deviceCode: deviceCode,
    code: userCode,
  });
  return await clientDevice.send(createTokenCommand);
}

export async function getAccounts(accessToken) {
  const listAccountsCommand = new ListAccountsCommand({
    accessToken: accessToken,
  });
  return await clientSso.send(listAccountsCommand);
}

export async function getAccountRoles(accessToken, accountId) {
  const listAccountRolesCommand = new ListAccountRolesCommand({
    accessToken: accessToken,
    accountId: accountId,
  });
  return await clientSso.send(listAccountRolesCommand);
}

export async function getAccountRoleCredentials(
  accessToken,
  accountId,
  roleName
) {
  const getRoleCredentialsCommand = new GetRoleCredentialsCommand({
    accessToken: accessToken,
    accountId: accountId,
    roleName: roleName,
  });
  const { roleCredentials } = await clientSso.send(getRoleCredentialsCommand);
  return roleCredentials;
}
