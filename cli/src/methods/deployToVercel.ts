import { execa } from 'execa'
import pc from 'picocolors'

import { log } from '../helpers'


const deployToVercel = async (targetDir: string): Promise<void> => {
  log(pc.dim('Launching Vercel CLI...'))

  await execa('npx', [ '--yes', 'vercel' ], { cwd: targetDir, stdio: 'inherit' })
}


export default deployToVercel
