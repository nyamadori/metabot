export const command = 'exec <bot> [args..]'
export const desc = 'Exec a bot'

export function execute({ args }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        response_type: "in_channel",
        text: `Exec ${args.bot} ${args.args}`,
      })
    }, 16)
  })
}
