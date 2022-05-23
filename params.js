// env variables
const os = require("os");
const Conf = require("conf");
const config = new Conf({
  defaults: {
    region: "us-east-1",
    ssoUrl: "https://<your-project>.awsapps.com/start#/",
    useAccountId: true,
    defaultSection: "<account-id>_<role-name>",
    accounts: "account1, account2, account3",
  },
});

module.exports = Object.freeze({
  startUrl:
    config.get("ssoUrl") ?? console.error("please set the sso default url"),
  awsCredentialsPath:
    config.get("awsCredentialsPath") ?? `${os.homedir()}/.aws/credentials`,
  useAccountId: config.get("useAccountId") === "true",
  sso_accounts: config.get("accounts")?.split(","),
  region: config.get("region") ?? "us-east-1",
  clientName: os.hostname(),
  defaultSection: config.get("defaultSection") ?? "ViewOnlyAccess",
});
