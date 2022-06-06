# AWS SSO Credentials Tool

##### (couldn't find a better name)

This **AWS SSO Credentials Tool** is a script in nodejs to (almost)automatically update your local credentials file of aws.

I say _almost_ because at some point you'll need to click a button (or two in the worst scenario).

_Disclaimer: this is NOT intended to use as a dependency, it is just a script. The only reason it's published is for it to be more easy to find._

## Motivation

The SSO credentials expires every day, so I did not want to update this file manually.

## Requirements

- Node.js 16+ - [Install Node.js](https://nodejs.org/en/), including the npm package management tool.

## How to use

### Update config.json file with the correct params

When running for the first time, a config.json file will be created on path:

```
~/.config/aws-sso-creds-tool-nodejs/config.json
```

Then you need to change its parameters:

It is required to set the sso url like this:

```shell
{
    ssoUrl: "https://<your-project>.awsapps.com/start#/"
}
```

The credentials will be stored as **[account-name_AWSRoleName]**.
If you want to store it as **[123456789098_AWSRoleName]** add this:

```json
{
  "useAccountId": true
}
```

_if you want a different profile name pattern update the code..._

It uses _us-east-1_ as default aws region and searches for the credentials file in the default path.
If you want to change it, add this:

```json
{
    region: "us-east-1"
    ssoUrl: "https://<your-project>.awsapps.com/start#/"
    awsCredentialsPath: "/home/<user>/.aws/credentials" // Optional
    useAccountId: true
    defaultSection: "<account_id>_<role_name>" // section to be used to create a [default] section in credentials
    accounts: "account1,account2,account3"
}
```

### First time use

1. Run `npm install` in this folder
2. Update the `~/.config/aws-sso-creds-tool-nodejs/config.json` with the correct values
3. Run `node app.js` or create an alias
4. At some point the aws webpage will popup
   1. Log in to aws if you are not already
   2. The code for device authentication will be auto filled
   3. Click on Sign In

<img width="346" alt="Screen Shot 2021-06-25 at 11 59 23" src="https://user-images.githubusercontent.com/7031690/123454656-2e73bb00-d5b7-11eb-8db7-a79fda950bc5.png">

5. When the success alert shows then come back to the terminal

<img width="346" alt="Screen Shot 2021-06-25 at 11 59 36" src="https://user-images.githubusercontent.com/7031690/123454778-52cf9780-d5b7-11eb-9081-c2a08c2430b0.png">

7. Done!

For consecuents runs just start from step 3.

# Authors

- Leandro Salomon
- Rafael Nascimento
