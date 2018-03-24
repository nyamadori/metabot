import Router from 'express-promise-router'
import * as slackCommandMessages from './apis/slack/command/messages'

export const router = Router()

router.use('/slack/command/messages', slackCommandMessages.router)
