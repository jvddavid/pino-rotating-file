import closeWithGrace from 'close-with-grace'
import build from 'pino-abstract-transport'
import { RotateFileStream, type RotateFileTransportOptions } from './RotateFileStream'

export default (opts: RotateFileTransportOptions) => {
  const destination = new RotateFileStream(opts)
  closeWithGrace(() => {
    destination.end()
  })
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
