import Router from 'express-promise-router'
import * as slackCommandMessages from './apis/slack/command/messages'
import * as exectorAuth from './apis/exector/sessions'

export const router = Router()

router.use('/slack/command/messages', slackCommandMessages.router)
router.use('/exector/sessions', exectorAuth.router)
