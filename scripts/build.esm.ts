import { build } from 'bun'
import { resolve } from 'node:path'
import pkg from '../package.json'

const entryPoint = 'index.ts'

async function main() {
  const result = await build({
    entrypoints: [entryPoint],
    format: 'esm',
    minify: true,
    root: resolve(__dirname, '..', 'src'),
    outdir: 'dist',
    sourcemap: 'none',
    target: 'node',
    external: Object.keys(pkg.dependencies),
    conditions: 'production',
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    splitting: true
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
