import build from 'pino-abstract-transport'
import { RotateFileStream, type RotateFileTransportOptions } from './RotateFileStream'

// biome-ignore lint/style/noDefaultExport: This is a factory function
export default (opts: RotateFileTransportOptions) => {
  const destination = new RotateFileStream(opts)
  return build(
    source => {
      source.pipe(destination)
    },
    {
      close(err, cb) {
        destination.on('close', cb.bind(null, err))
        destination.end()
      },
      parse: 'lines',
      parseLine: line => line
    }
  )
}
