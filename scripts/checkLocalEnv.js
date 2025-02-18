const fs = require('fs')
const path = require('path')


const appDir = path.resolve(__dirname, `../`)
const localEnvFileName = '.env.local'

const getEnvList = (filePath) => {
  const file = fs.readFileSync(filePath, 'utf8')

  return file
    .split('\n')
    .filter((line) => !/^#/.test(line))
    .map((envLine) => envLine.split('='))
}

const setEnvList = (filePath, list) => {
  const file = list.map((envLine) => envLine.join('=')).join('\n')

  fs.writeFileSync(filePath, file, 'utf8')
}

const getEnvKeys = (list) => {
  return list.filter(([ key ]) => key && !/^#|\s/.test(key)).map(([ key ]) => key)
}

const getEmptyEnvKeys = (envPath) => {
  const envList = getEnvList(envPath).filter(([ key ]) => key && !/^#|\s/.test(key))

  return envList.filter(([ key, value ]) => !value).map(([ key ]) => key)
}

const validateEnv = (env) => {
  const isEnvExist = fs.existsSync(env.values)
  const envExampleList = getEnvList(env.example)

  if (isEnvExist) {
    const envList = getEnvList(env.values)
    const envExampleKeys = getEnvKeys(envExampleList)
    const envKeys = getEnvKeys(envList)

    const missedEnvs = envExampleKeys.filter((key) => !envKeys.includes(key))

    if (missedEnvs.length) {
      throw new Error(`Add missed env to "${env.values}":\n${missedEnvs.join(', ')}`)
    }
  }
  else {
    setEnvList(env.values, envExampleList)
    console.log(`Added ${env.values}`)
  }

  const emptyEnvLocalKeys = getEmptyEnvKeys(env.values)

  if (emptyEnvLocalKeys.length) {
    throw new Error(`Add value to env "${env.values}":\n${emptyEnvLocalKeys.join(', ')}`)
  }
}

validateEnv({
  example: path.resolve(appDir, '.env.example'),
  values: path.resolve(appDir, localEnvFileName),
})
