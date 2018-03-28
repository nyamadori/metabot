import { PositionalOptions } from "yargs"

export const command = 'invite <bot>'
export const desc = 'Invite a bot'
export const params = {
  bot: <PositionalOptions>{
    desc: 'bot name to invite',
    type: 'string'
  }
}

export async function handler({ args }) {
  return {
    response_type: "in_channel",
    text: `Invited ${args.bot}`,
  }
}
