import { execa } from 'execa'
import pc from 'picocolors'

import { log, hasCommand, ask } from '../helpers'
import installPnpm from './installPnpm'


const installDependencies = async (targetDir: string): Promise<boolean> => {
  if (!(await hasCommand('pnpm'))) {
    const { install } = await ask<'install'>({
      type: 'toggle',
      name: 'install',
      message: 'pnpm is not installed — install it globally now?',
      initial: false,
      active: 'yes',
      inactive: 'no',
    }) as { install: boolean }

    if (!install) {
      log(pc.yellow('Skipping dependency install. Install pnpm: https://pnpm.io/installation'))

      return false
    }

    const installed = await installPnpm()

    if (!installed) {
      log(pc.yellow('pnpm install failed — skipping dependency install'))

      return false
    }
  }

  log(pc.dim('Installing dependencies with pnpm...'))

  await execa('pnpm', [ 'install' ], { cwd: targetDir, stdio: 'inherit' })

  return true
}


export default installDependencies
