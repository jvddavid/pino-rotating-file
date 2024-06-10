import { build } from 'bun'
import pkg from '../package.json'

async function main() {
  const result = await build({
    entrypoints: ['index.ts'],
    external: [...Object.keys(pkg.dependencies), 'node:fs'],
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    format: 'esm',
    conditions: ['production'],
    publicPath: undefined,
    outdir: 'dist',
    minify: true,
    root: 'src',
    splitting: true,
    target: 'node',
    sourcemap: 'none',
    naming: {
      entry: '[dir]/[name].m[ext]',
      chunk: '[name]-[hash].[ext]',
      asset: '[name]-[hash].[ext]'
    }
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
