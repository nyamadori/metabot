import * as functions from 'firebase-functions'
import * as yargs from 'yargs'

function toArgs(str: string): string[] {
  return str.split(/\s+/)
}

function buildMessageForCmdHelp(cmd, message) {
  return {
    text: `/meta ${cmd}`,
    attachments: [
      {
        text: "```" + message + "```"
      }
    ]
  }
}

export const slackCommand = functions.https.onRequest((request, response) => {
  const messageText = request.body.text
  const args = toArgs(messageText)

  yargs
    .strict()
    .commandDir('commands')
    .help()
    .version()
    .recommendCommands()
    .showHelpOnFail(false)
    .wrap(72)
    .parse(args, (err, argv, output) => {
      if (output) {
        response.send(buildMessageForCmdHelp(messageText, output))
      } else {
        response.send(argv._reply)
      }
    })
})
