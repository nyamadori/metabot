import Router from 'express-promise-router'
import * as metabot from 'metabot-bot'
import { slack } from '../../../utils/config'
import * as exec from '../../../commands/exec'
import * as invite from '../../../commands/invite'

const exector = metabot.defineBot({
  commands: { exec, invite }
})

export const router = Router()

// POST /slack/command/messages
router.post('/', (request, response) => {
  const token = request.body.token

  return new Promise((resolve, reject) => {
    if (token !== slack.token) {
      reject({ status: 403, res: { text: 'Invalid token' } })
      return
    }

    console.log(request.body)

    exector.execute({ message: request.body })
      .then((reply) => {
        response.send(reply)
      })
      .catch((reason) => {
        console.error(reason)
        response.status(reason.status || '500').json(reason.res)
      })
  })
})
