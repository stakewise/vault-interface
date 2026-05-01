import { execa } from 'execa'
import pc from 'picocolors'

import { log, hasCommand } from '../helpers'


const installPnpm = async (): Promise<boolean> => {
  if (!(await hasCommand('npm'))) {
    log(pc.yellow('npm not found — cannot install pnpm automatically. See https://pnpm.io/installation'))

    return false
  }

  log(pc.dim('Installing pnpm globally via npm...'))

  try {
    await execa('npm', [ 'install', '-g', 'pnpm' ], { stdio: 'inherit' })

    return await hasCommand('pnpm')
  }
  catch {
    return false
  }
}


export default installPnpm
