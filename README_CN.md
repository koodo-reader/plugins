# Koodo Reader 插件

[English](./README.md)

本仓库包含 [Koodo Reader](https://github.com/koodo-reader/koodo-reader) 所使用的官方插件，涵盖翻译插件、词典插件以及文字转语音（TTS）插件。

## 仓库结构

```
├── code/          # 插件源代码（可读的未压缩格式）
├── plugins/       # 编译后的插件 JSON 文件（供 Koodo Reader 调用）
├── utils/         # 工具脚本（如 SHA256 哈希生成）
├── index.js       # 入口文件 / 辅助运行时
└── package.json   # Node.js 项目配置文件
```

## 插件类型

- **翻译插件** — 对选中文本进行翻译，支持嵌入式网页视图或直接调用 API 两种方式。
- **词典插件** — 通过嵌入式网页视图在在线词典中查词。
- **语音插件（TTS）** — 使用各类本地或远程 TTS 引擎朗读文字。

## 插件 JSON 格式

每个插件以 JSON 文件定义，结构如下：

**翻译 / 词典插件：**

```json
{
  "identifier": "插件标识符",
  "type": "translation | dictionary",
  "displayName": "显示名称",
  "icon": "图标名称",
  "version": "1.0.0",
  "autoValue": "auto",
  "config": {},
  "langList": { "en": "English", "...": "..." },
  "scriptSHA256": "<script 字段的 SHA256 哈希>",
  "script": "<压缩后的 JavaScript 函数>"
}
```

**语音插件：**

```json
{
  "identifier": "插件标识符",
  "type": "voice",
  "displayName": "显示名称",
  "icon": "speaker",
  "version": "1.0.0",
  "config": {},
  "voiceList": [
    {
      "name": "音色 ID",
      "gender": "female | male",
      "locale": "zh-CN",
      "displayName": "音色显示名称",
      "plugin": "插件标识符",
      "config": {}
    }
  ],
  "scriptSHA256": "<script 字段的 SHA256 哈希>",
  "script": "<压缩后的 JavaScript 函数>"
}
```

## 脚本 API

### 翻译脚本

`script` 字段须暴露 `translate` 函数：

```javascript
async function translate(text, from, to, axios, config) {
  // text   - 待翻译文本
  // from   - 源语言代码
  // to     - 目标语言代码
  // axios  - 用于 HTTP 请求的 axios 实例
  // config - 用户配置对象
  return "翻译后的文本"; // 嵌入类插件可返回 URL 字符串
}
window.translate = translate;
```

### 语音脚本

`script` 字段须暴露 `getAudioPath` 函数：

```javascript
const getAudioPath = async (text, speed, dirPath, config) => {
  // text    - 待合成文本
  // speed   - 播放速度
  // dirPath - 音频文件保存目录
  // config  - 用户配置对象
  return "/path/to/audio.wav"; // 生成的音频文件绝对路径
};
global.getAudioPath = getAudioPath;
```

## 工具脚本

### `utils/getCodeSHA256.js`

用于计算插件 JSON 文件中 `script` 字段的 SHA-256 哈希值，该哈希值存储在 `scriptSHA256` 字段中，供 Koodo Reader 验证插件完整性。

```bash
node utils/getCodeSHA256.js
```

## 开发指南

### 环境要求

- Node.js >= 16
- npm

### 安装依赖

```bash
npm install
```

### 添加新插件

1. 在 `code/<插件名>.js` 中编写可读的未压缩插件源代码。
2. 将脚本压缩后写入 `plugins/` 目录下对应 JSON 文件的 `script` 字段。
3. 修改 `utils/getCodeSHA256.js` 中的文件路径后运行，将输出的哈希值填入 `scriptSHA256` 字段。
4. 正确填写 `identifier`、`type`、`displayName`、`langList` / `voiceList` 等字段。

## 开源许可

本项目基于 [AGPL v3](./LICENSE) 协议开源。
