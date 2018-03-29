import { PositionalOptions } from "yargs"
import * as functions from 'firebase-functions'
import { api } from '../utils/config'
import * as got from 'got'
import { firestore } from '../utils/firebase'

export const command = 'install <repositoryPath>'
export const desc = 'Install a bot from Git repository'
export const params = {
  repositoryPath: <PositionalOptions>{
    desc: 'GitHub arepository which contains the bot',
    type: 'string'
  }
}

export async function handler({ args }) {
  const { repositoryPath } = args

  const isValid = await validateSource(repositoryPath)

  if (!isValid) {
    return {
      response_type: "in_channel",
      text: `Invalid or undefined repository`,
    }
  }

  const sourceUrl = sourceUrlFromRepo(repositoryPath)
  console.log('installing bot', sourceUrl)

  const botsRef = await firestore.collection('bots').where('repositoryPath', '==', repositoryPath).limit(1).get()

  if (!botsRef.empty) {
    return {
      response_type: "in_channel",
      text: `Already installed bot`,
    }
  }

  const manifestUrl = packageJsonUrlFromRepo(repositoryPath)
  const botRef = await firestore.collection('bots').add({ sourceUrl, repositoryPath, manifestUrl })

  return {
    response_type: "in_channel",
    text: `Installed`,
  }
}

async function validateSource(repositoryPath: string): Promise<boolean> {
  console.log('validating repository', repositoryPath)

  const url = packageJsonUrlFromRepo(repositoryPath)

  let packageJsonRes

  try {
    packageJsonRes = await got.get(url)
  } catch (error) {
    console.error(error)
    return false
  }

  let packageJson: { }

  try {
    packageJson = JSON.parse(packageJsonRes.body)
  } catch {
    return false
  }

  if (!packageJson['metabot']) return false

  const sourceUrl = sourceUrlFromRepo(repositoryPath)
  const sourceRes = await got.head(sourceUrl)

  if (sourceRes.statusCode !== 200) return false

  return true
}

function sourceUrlFromRepo(repositoryPath) {
  return `https://raw.githubusercontent.com/${repositoryPath}/master/dist/index.js`
}

function packageJsonUrlFromRepo(repositoryPath) {
  return `https://raw.githubusercontent.com/${repositoryPath}/master/package.json`
}
