import { file } from 'bun'
import { describe, expect, it } from 'bun:test'
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
    const fileExists = file('logs/log-000.log')
    if (await fileExists.exists()) {
      const content = await fileExists.text()
      expect(content.endsWith('Hello World!"}\n')).toBe(true)
    } else {
      throw new Error('File not found')
    }
    await rmdir('logs', { recursive: true })
    const fileExists1 = file('logs/log-001.log')
    expect(await fileExists1.exists()).toBe(false)
  })
})
