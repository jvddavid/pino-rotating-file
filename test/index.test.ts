import { existsSync, readFileSync } from 'node:fs'
import { rmdir } from 'node:fs/promises'
import logger from 'pino'

function makeSut() {
  return logger(
    logger.transport({
      target: '@jvddavid/pino-rotating-file',
      options: {
        path: 'logs',
        pattern: 'log-%N.log'
      }
    })
  )
}

describe('Pino rotating file', () => {
  it('Should be write a message', async () => {
    const logger = makeSut()
    logger.info('Hello World!')
    await new Promise(resolve => setTimeout(resolve, 200))
    const fileExists = existsSync('logs/log-000.log')
    if (fileExists) {
      const content = readFileSync('logs/log-000.log', 'utf-8')
      expect(content.endsWith('Hello World!"}\n')).toBe(true)
    } else {
      throw new Error('File not found')
    }
    await rmdir('logs', { recursive: true })
    const fileExists1 = existsSync('logs/log-001.log')
    expect(fileExists1).toBe(false)
  })
})
