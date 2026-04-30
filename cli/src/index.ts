import degit from 'degit'
import pc from 'picocolors'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { writeFile, rm } from 'node:fs/promises'

import {
  gitInit,
  buildEnv,
  applyTheme,
  deployToVercel,
  collectAnswers,
  installDependencies,
} from './methods'
import { log } from './helpers'
import { repo } from './constants'


const main = async (): Promise<void> => {
  log([
    pc.bold(pc.cyan('StakeWise Vault Interface')),
    pc.dim('Create a new vault frontend ready for Vercel.'),
  ])

  const config = await collectAnswers()

  log([
    '',
    pc.dim(`Cloning ${repo}...`),
  ])

  const emitter = degit(repo, {
    verbose: false,
    cache: false,
    force: false,
  })

  await emitter.clone(config.targetDir)

  const cliDir = join(config.targetDir, 'cli')

  if (existsSync(cliDir)) {
    await rm(cliDir, { recursive: true, force: true })
  }

  if (config.customizeTheme) {
    log(pc.dim('Applying theme colors...'))

    await applyTheme(config.targetDir, config.lightPrimary, config.darkPrimary)
  }

  const envPath = join(config.targetDir, '.env')
  await writeFile(envPath, buildEnv(config), 'utf8')

  await gitInit(config.targetDir)

  let installed = false
  if (config.installDeps) {
    installed = await installDependencies(config.targetDir)
  }

  if (config.deployVercel) {
    if (!installed && config.installDeps) {
      log(pc.yellow('Skipping Vercel deploy — dependencies were not installed'))
    }
    else {
      await deployToVercel(config.targetDir)
    }
  }

  const logItems: string[] = [
    '',
    pc.green('  Done!'),
    '',
    '  Next steps:',
    pc.cyan(`    cd ${config.projectName}`),
  ]

  if (!config.installDeps || !installed) {
    logItems.push(pc.cyan('    pnpm install'))
  }

  logItems.push(pc.cyan('    pnpm dev'))

  if (!config.deployVercel) {
    logItems.push(
      '',
      '  Deploy:',
      pc.cyan('    npx vercel              # one-click deploy via Vercel CLI'),
      pc.cyan('    https://vercel.com/new  # or import from GitHub')
    )
  }

  log(logItems)
}

main().catch((err: Error) => {
  console.error(pc.red('Error:'), err.message)
  process.exit(1)
})
