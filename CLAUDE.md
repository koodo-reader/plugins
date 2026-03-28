# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Koodo Reader 的官方插件仓库，提供翻译 (translation)、词典 (dictionary)、语音合成 (voice/TTS) 三类插件。每个插件以独立 JSON 发布，内含压缩后的 JS 脚本，由主程序运行时加载并通过 SHA-256 校验完整性。

## Commands

```bash
npm install                      # 安装依赖
npm start                        # 本地测试语音插件（修改 index.js 中的调用参数）
node utils/getCodeSHA256.js      # 计算插件 script 字段的 SHA-256 哈希（需先修改文件中路径）
```

无自动化测试框架、无 lint 配置、无构建系统。压缩和转义通过外部在线工具手动完成。

## Architecture

```
code/                 -- 插件可读源码 (.js)
  translation/        -- 翻译插件
  dictionary/         -- 词典插件
  voice/              -- 语音插件
plugins/              -- 发布用 JSON（压缩脚本 + SHA256 哈希）
  translation/
  dictionary/
  voice/
utils/getCodeSHA256.js -- SHA-256 哈希生成工具
index.js              -- 语音插件本地调试入口
```

`code/` 与 `plugins/` 一一对应。修改插件时必须同时更新两处。

## Plugin Runtime Environments

- **翻译/词典插件**：浏览器环境，挂载到 `window`（`window.translate`、`window.getDictText`）
- **语音插件**：Node.js 环境，挂载到 `global`（`global.getAudioPath`），可使用 `require()`

## Plugin Function Signatures

```js
// 翻译：返回翻译文本或 URL（embed 模式）
async function translate(text, from, to, axios, config)
window.translate = translate

// 词典：返回 HTML 或 URL，t 为 i18n 函数
async function getDictText(text, from, to, axios, t, config)
window.getDictText = getDictText

// 语音：返回生成的音频文件绝对路径
async function getAudioPath(text, speed, dirPath, config)
global.getAudioPath = getAudioPath

// 语音可选：动态获取语音列表（当 voiceList 为空数组时调用）
async function getTTSVoice(config)
global.getTTSVoice = getTTSVoice
```

## Plugin JSON Structure

关键字段：`identifier`、`type`、`displayName`、`icon`、`version`、`config`（用户配置项）、`script`（压缩转义后的代码）、`scriptSHA256`（完整性校验）。

类型专有字段：
- translation: `autoValue`、`langList`（对象映射）
- dictionary: `langList`（数组，含 `lang`/`code`/`nativeLang`）
- voice: `voiceList`（数组或空数组表示动态获取）

## Plugin Patterns

- **API 模式**：调用第三方 API 返回结果
- **Embed 模式**：仅构造 URL 返回，由主程序内嵌展示，无需 API 调用
- `axios` 和 `config` 通过参数注入（翻译/词典），语音插件自行 `require('axios')`
- 错误处理统一返回 `"Error happened"` 字符串
- 语音插件在 `dirPath/tts/` 下生成音频文件，文件名为时间戳
- AWS 插件自行实现 Signature V4 签名

## Naming Conventions

- 源码文件：camelCase（`deeplTranslate.js`）
- JSON 文件：kebab-case + `-plugin` 后缀（`deepl-translate-plugin.json`）
- `identifier` 字段与 JSON 文件名一致（不含 `.json`）

## Adding a New Plugin

1. 在 `code/<type>/<pluginName>.js` 编写源码，参考同类型已有插件
2. 在 `plugins/<type>/<plugin-name>-plugin.json` 编写 JSON 模板
3. 压缩源码（外部工具）→ JSON 转义 → 填入 `script` 字段
4. 运行 `node utils/getCodeSHA256.js`（需修改路径）→ 填入 `scriptSHA256` 字段
5. `config` 占位值应说明期望格式（如 `"[Your API Key]"`）

## License

AGPL v3
