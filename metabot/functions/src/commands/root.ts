import * as exec from './exec'
import * as invite from './invite'
import * as install from './install'

export const command = '%{botNickname} <subcommand> [args..]'
export const desc = 'commands'
export async function handler({ args, context }) { /*nop*/ }
export const subcommands = {
  exec, invite, install
}
