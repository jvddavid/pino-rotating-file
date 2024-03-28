import { build } from 'bun'
import { resolve } from 'node:path'

const entryPoint = 'index.ts'

async function main() {
  const result = await build({
    entrypoints: [entryPoint],
    format: 'esm',
    minify: true,
    root: resolve(__dirname, '..', 'src'),
    outdir: 'dist',
    sourcemap: 'none',
    publicPath: '/',
    target: 'node'
  })
  return result
}

main()
  .then(result => {
    if (result.success) {
      console.info('Build succeeded 🎉')
    } else {
      console.dir(result, { depth: null })
      console.error('Build failed 😢')
    }
  })
  .catch(error => {
    console.error('Build failed', error)
  })
