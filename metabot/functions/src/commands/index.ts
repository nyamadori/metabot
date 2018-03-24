import * as yargs from 'yargs'
import * as execCommand from './exec'
import * as inviteCommand from './invite'

function instHandler(command): yargs.CommandModule {
  command.handler = (argv) => { /* noop */ }
  return command
}

export const exec = instHandler(execCommand)
export const invite = instHandler(inviteCommand)
