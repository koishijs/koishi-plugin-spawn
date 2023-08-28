import { Context } from 'koishi'
import mock from '@koishijs/plugin-mock'
import spawn from '../src'

const ctx = new Context()
ctx.plugin(mock)
ctx.plugin(spawn)

const client = ctx.mock.client('123')

describe('koishi-plugin-spawn', () => {
  before(() => ctx.start())
  after(() => ctx.stop())

  it('basic support', async () => {
    await client.shouldReply('spawn echo hello', [
      '[SPAWN] $ echo hello',
      'hello',
      /^\[SPAWN\] 命令执行完毕/,
    ])
  })
})
