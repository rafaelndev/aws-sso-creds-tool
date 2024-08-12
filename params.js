// env variables
import { homedir, hostname } from "os";
import Conf from "conf";
const config = new Conf({
  defaults: {
    region: "us-east-1",
    ssoUrl: "https://<your-project>.awsapps.com/start#/",
    useAccountId: true,
    defaultSection: "<account-id>_<role-name>",
    accounts: "account1, account2, account3",
  },
});

export const startUrl =
  config.get("ssoUrl") ?? console.error("please set the sso default url");
export const awsCredentialsPath =
  config.get("awsCredentialsPath") ?? `${homedir()}/.aws/credentials`;
export const useAccountId = config.get("useAccountId");
export const sso_accounts = config.get("accounts")?.split(",");
export const region = config.get("region") ?? "us-east-1";
export const clientName = hostname();
export const defaultSection = config.get("defaultSection") ?? "ViewOnlyAccess";
