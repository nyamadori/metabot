export const command = 'invite <bot>'
export const desc = 'Invite a bot'
export function handler(argv) {
  argv._reply = {
    response_type: "in_channel",
    text: `Invited ${argv.bot}`,
  }
}
