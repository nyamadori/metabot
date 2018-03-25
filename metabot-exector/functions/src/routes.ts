import Router from 'express-promise-router'
import * as requests from './apis/requests'

export const router = Router()

router.use('/requests', requests.router)
