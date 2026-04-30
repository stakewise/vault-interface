import { execa } from 'execa'
import pc from 'picocolors'

import { log, hasCommand } from '../helpers'


const gitInit = async (targetDir: string): Promise<void> => {
  if (!(await hasCommand('git'))) {
    log(pc.yellow('  git not found — skipping repository init'))

    return
  }

  try {
    await execa('git', [ 'init', '--quiet' ], { cwd: targetDir })
    await execa('git', [ 'add', '.' ], { cwd: targetDir })
    await execa('git', [ 'commit', '-m', 'Initial commit', '--quiet' ], { cwd: targetDir })
  }
  catch (error) {
    const msg = error instanceof Error ? error.message : String(error)

    log(pc.yellow(`  git init failed: ${msg}`))
  }
}


export default gitInit
