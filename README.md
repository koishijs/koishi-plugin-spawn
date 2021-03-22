# koishi-plugin-shell

使用 koishi 执行终端命令。~~网络安全直呼内行~~

我们十分不建议您在生产环境使用这个插件，它很大程度只是用来好玩。

## 安装

> 参见 [安装插件](https://koishi.js.org/guide/context.html)

```sh
# Using yarn
yarn add koishi-plugin-shell
# Or via npm
npm install koishi-plugin-shell
```

```js
// 如果您是 index.js 玩家
App.plugin(require('koishi-plugin-shell'), {
  // options...
})
```

## 配置项

- `defaultTimeout` {Number}
  - 预设：`30`
  - 预设超时秒数
- `minTimeout` {Number}
  - 预设：`10`
  - 最小超时秒数
- `maxTimeout` {Number}
  - 预设：`180`
  - 最大超时秒数
- `shell` {String}
  - 指定运行指令的程序
  - 例如：`'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe'`
- `encoding`
  - 预设：`utf-8`
  - 输出内容编码，如果您的系统文本编码不是 utf-8，可以修改此项以免《加密通话》

## 自定义输出

> 参见 [模板操作](https://koishi.js.org/api/utils.html#%E6%A8%A1%E6%9D%BF%E6%93%8D%E4%BD%9C)

名字空间：`shell`

**预设文案**

```js
{
  desc: '执行shell命令',
  option_timeout:
    '超时时间，单位秒，最小 {{ minTimeout }} 秒，最大 {{ maxTimeout }} 秒',
  option_cwd: '指定执行的工作路径',
  on_start: '[执行指令] {{ cmd }}\n限时：{{ timeout }} 秒',
  on_close:
    '[执行完毕] {{ cmd }}\n耗时：{{ time }} 秒\n退出码：{{ code }}，终止信号：{{ signal }}',
}
```
