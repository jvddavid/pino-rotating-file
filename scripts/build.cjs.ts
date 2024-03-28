import { build } from 'esbuild'
import { resolve } from 'node:path'

const entryPoint = 'src/index.ts'

async function main() {
  const result = await build({
    entryPoints: [entryPoint],
    bundle: true,
    tsconfig: 'tsconfig.json',
    platform: 'node',
    format: 'cjs',
    minify: true,
    outfile: 'dist/index.cjs',
    absWorkingDir: resolve(__dirname, '..'),
    allowOverwrite: true
  })
  return result
}

main()
  .then(result => {
    if (result.errors.length === 0) {
      console.info('Build succeeded 🎉')
    } else {
      console.dir(result, { depth: null })
      console.error('Build failed 😢')
    }
  })
  .catch(error => {
    console.error('Build failed', error)
  })
