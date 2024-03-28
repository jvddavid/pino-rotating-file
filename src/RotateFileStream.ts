import { EventEmitter } from 'node:events'
import { join } from 'node:path'
import { SonicBoom } from 'sonic-boom'

interface RotateFileOptions {
  path: string
  pattern: string
  maxSize: number
  sync: boolean
  fsync: boolean
  append: boolean
  mkdir: boolean
}

export type RotateFileTransportOptions = Partial<RotateFileOptions>

export class RotateFileStream extends EventEmitter {
  private currentFile = 0
  private currentSize = 0
  private currentStream: SonicBoom
  private options: RotateFileOptions

  public writable = true

  constructor(options: Partial<RotateFileOptions>) {
    super()
    this.options = {
      maxSize: 1024 * 1024 * 10,
      path: 'logs',
      pattern: 'log-%Y-%M-%d-%H-%m-%s-%l-%N.log',
      sync: false,
      fsync: false,
      append: true,
      mkdir: true,
      ...options
    } as RotateFileOptions
    this.currentStream = this.createStream()
  }

  private createStream() {
    const { path, pattern, maxSize, sync, fsync, mkdir, append } = this.options
    const date = new Date()
    const filename = join(
      path,
      pattern.replace(/%[a-zA-Z]/g, substring => {
        switch (substring) {
          case '%Y':
            return date.getFullYear().toString()
          case '%M':
            return (date.getMonth() + 1).toString().padStart(2, '0')
          case '%d':
            return date.getDate().toString().padStart(2, '0')
          case '%H':
            return date.getHours().toString().padStart(2, '0')
          case '%m':
            return date.getMinutes().toString().padStart(2, '0')
          case '%s':
            return date.getSeconds().toString().padStart(2, '0')
          case '%l':
            return date.getMilliseconds().toString().padStart(3, '0')
          case '%N':
            return this.currentFile.toString().padStart(3, '0')
          default:
            return substring
        }
      })
    )
    const stream = new SonicBoom({
      dest: filename,
      append: append ?? true,
      mkdir: mkdir ?? true,
      sync: sync ?? false,
      contentMode: 'utf8',
      fsync: fsync,
      maxWrite: maxSize
    })
    this.currentFile++
    stream.on('error', err => this.emit('error', err))
    return stream
  }

  private rotateStream() {
    if (this.currentStream) {
      this.currentStream.removeAllListeners()
      this.currentStream.flush(err => {
        if (err) {
          this.emit('error', err)
        }
        this.currentStream.end()
      })
    }
    this.currentStream = this.createStream()
  }

  flush(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.currentStream.flush(err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  write(string: string): boolean {
    if (!this.writable) {
      return false
    }
    this.currentSize += string.length
    if (this.currentSize >= this.options.maxSize) {
      this.rotateStream()
      this.currentSize = string.length
    }
    return this.currentStream.write(`${string}\n`)
  }

  close(): Promise<void> {
    this.writable = false
    return new Promise((resolve, reject) => {
      this.currentStream.once('close', resolve)
      this.currentStream.once('error', reject)
      this.currentStream.flush(err => {
        if (err) {
          reject(err)
        } else {
          this.currentStream.end()
        }
      })
    })
  }

  end(): this {
    this.writable = false
    this.currentStream.once('close', () => this.emit('close'))
    this.currentStream.once('error', err => this.emit('error', err))
    this.currentStream.flush(err => {
      if (err) {
        this.emit('error', err)
      }
      this.currentStream.end()
    })
    return this
  }
}
