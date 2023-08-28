import { exec, ExecOptions } from 'child_process'
import { Context, h, Schema, Service, Time } from 'koishi'
import path from 'path'

const encodings = ['utf8', 'utf16le', 'latin1', 'ucs2'] as const

declare module 'koishi' {
  export interface Context {
    shell: ShellService
  }
}

export interface Config extends ExecOptions {}

export const Config: Schema<Config> = Schema.object({
  root: Schema.string().description('工作路径。'),
  shell: Schema.string().description('运行命令的程序。'),
  encoding: Schema.union(encodings).description('输出内容编码。').default('utf8'),
  timeout: Schema.number().description('最长运行时间。').default(Time.minute),
})

export interface State {
  command: string
  output: string
  code?: number
  signal?: NodeJS.Signals
  timeUsed?: string
}

export class ShellService extends Service {
  constructor(public ctx: Context) {
    super(ctx, 'shell')
  }
  makeProcess(cmd: string, options?: ExecOptions) {
    return exec(cmd, {
      cwd: this.ctx.baseDir,
      windowsHide: true,
      encoding: 'utf-8',
      timeout: 1 * Time.minute,
      ...options,
    })
  }
  exec(
    cmd: string,
    onStdout?: (data: string) => void,
    options?: ExecOptions
  ): Promise<{ code: number; signal: NodeJS.Signals; output: string }> {
    return new Promise((resolve, reject) => {
      const process = this.makeProcess(cmd, options)
      let output = ''
      process.stdout?.on('data', (data) => {
        output += data
        onStdout?.(data)
      })
      process.on('exit', (code, signal) => {
        ;(code === 0 ? resolve : reject)({ code, signal, output })
      })
    })
  }
}

export default class PluginSpawn {
  readonly name = 'spawn'

  constructor(ctx: Context, options?: ExecOptions) {
    ctx.plugin(ShellService)
    ctx.i18n.define('zh', require('./locales/zh'))

    ctx
      .command('admin/spawn <command:text>', '执行终端命令', { authority: 4 })
      .alias('sh', 'exec')
      .action(async ({ session }, command) => {
        if (!command) return session?.execute('spawn -h')
        
        const state: State = {
          command,
          timeUsed: '',
          code: 0,
          signal: undefined!,
          output: '',
        }
        await session.send(session.text('.started', state))

        const startTime = Date.now()
        const res = await ctx.shell.exec(
          command,
          (data) => {
            state.output += data
            session?.sendQueued(data)
          },
          options
        )
        state.code = res.code
        state.signal = res.signal
        state.timeUsed = `${((Date.now() - startTime) / 1000).toFixed(2)}s`
        return session.text('.finished', state)
      })
  }
}
