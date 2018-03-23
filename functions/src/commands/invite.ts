export const command = 'invite <bot>'
export const desc = 'Invite a bot'
export const builder = {
  bot: {
    desc: 'bot name to invite',
    type: 'string'
  }
}

export async function execute({ args }) {
  return {
    response_type: "in_channel",
    text: `Invited ${args.bot}`,
  }
}
