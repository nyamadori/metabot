import Router from 'express-promise-router'
import * as functions from 'firebase-functions'
import * as yargs from 'yargs'
import * as commands from '../../../commands'

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

export const router = Router()

// POST /slack/command/messages
router.post('/', (request, response) => {
  const messageText = request.body.text
  const token = request.body.token

  return new Promise((resolve, reject) => {
    if (token !== functions.config().slack.token) {
      reject({ status: 403, res: { text: 'Invalid token' } })
      return
    }

    console.log(request.body)

    const args = toArgs(messageText)

    yargs
      .strict()
      .command(commands.exec)
      .command(commands.invite)
      .help()
      .version()
      .recommendCommands()
      .showHelpOnFail(false)
      .wrap(72)
      .parse(args, (err, parsedArgs, output) => {
        console.log(parsedArgs)
        const commandPath = parsedArgs._

        if (err || output) {
          response.send(buildMessageForCmdHelp(messageText, output))
          resolve()
          return
        }

        const { execute } = require(`../../../commands/${commandPath.join('/')}`)

        execute({ message: request.body, args: parsedArgs, request })
          .catch(reject)
          .then(resolve)
      })
  })
    .then((reply) => {
      response.send(reply)
    })
    .catch((reason) => {
      console.error(reason)
      response.status(reason.status || '500').json(reason.res)
    })
})
