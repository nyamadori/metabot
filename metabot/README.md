# metabot
## setup

Set config for Slack verification token.

```
$ firebase functions:config:set slack.token=SLACK_VERIFICATION_TOKEN
```

Set config for exector API endpoint

```
$ firebase functions:config:set exector.api.endpoint='https://us-central1-exector.cloudfunctions.net'
```

Add service account credential for generating custom token of Firebase Authentication.
see: https://firebase.google.com/docs/auth/admin/create-custom-tokens

```
$ mkdir src/credentials
$ vi src/credentials/service-account.ts
export default {
  projectId: "metabot-187207",
  privateKey: "private key",
  clientEmail: "client email",
}
```
