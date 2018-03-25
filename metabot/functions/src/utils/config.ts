import * as functions from 'firebase-functions'

const config = functions.config()
export const { slack, exector } = config
