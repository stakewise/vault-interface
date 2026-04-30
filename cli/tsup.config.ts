import { defineConfig } from 'tsup'


export default defineConfig({
  entry: [ 'src/index.ts' ],
  format: [ 'esm' ],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  shims: false,
  banner: { js: '#!/usr/bin/env node' },
})
