import { execa } from 'execa'
import pc from 'picocolors'

import { log, hasCommand } from '../helpers'


const installDependencies = async (targetDir: string): Promise<boolean> => {
  if (!(await hasCommand('pnpm'))) {
    log(pc.yellow('pnpm not found — skipping install. See https://pnpm.io/installation'))

    return false
  }

  log(pc.dim('Installing dependencies with pnpm...'))

  await execa('pnpm', [ 'install' ], { cwd: targetDir, stdio: 'inherit' })

  return true
}


export default installDependencies
