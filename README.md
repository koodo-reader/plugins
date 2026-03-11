# Koodo Reader Plugins

[中文文档](./README_CN.md)

This repository contains the official plugins for [Koodo Reader](https://github.com/koodo-reader/koodo-reader), including translation plugins, dictionary plugins, and text-to-speech (TTS) voice plugins.

## Repository Structure

```
├── code/
│   ├── translation/   # Translation plugin source code
│   ├── dictionary/    # Dictionary plugin source code
│   └── voice/         # Voice (TTS) plugin source code
├── plugins/
│   ├── translation/   # Compiled translation plugin JSON files
│   ├── dictionary/    # Compiled dictionary plugin JSON files
│   └── voice/         # Compiled voice (TTS) plugin JSON files
├── utils/             # Utility scripts (e.g., SHA256 hash generation)
├── index.js           # Entry point / helper runtime
└── package.json       # Node.js project manifest
```

## Plugin JSON Format

Each plugin is defined as a JSON file with the following structure:

**Translation plugins:**

```json
{
  "identifier": "plugin-identifier",
  "type": "translation",
  "displayName": "Display Name",
  "icon": "icon-name",
  "version": "1.0.0",
  "autoValue": "auto",
  "config": {},
  "langList": { "en": "English", "...": "..." },
  "scriptSHA256": "<sha256 of the script field>",
  "script": "<minified JavaScript function>"
}
```

**Dictionary plugins:**

```json
{
  "identifier": "plugin-identifier",
  "type": "dictionary",
  "displayName": "Display Name",
  "icon": "icon-name",
  "version": "1.0.0",
  "config": {},
  "langList": [{ "lang": "English", "code": "en", "nativeLang": "English" }],
  "scriptSHA256": "<sha256 of the script field>",
  "script": "<minified JavaScript function>"
}
```

**Voice plugins:**

```json
{
  "identifier": "plugin-identifier",
  "type": "voice",
  "displayName": "Display Name",
  "icon": "speaker",
  "version": "1.0.0",
  "config": {},
  "voiceList": [
    {
      "name": "voice-id",
      "gender": "female | male",
      "locale": "zh-CN",
      "displayName": "Voice Display Name",
      "plugin": "plugin-identifier",
      "config": {}
    }
  ],
  "scriptSHA256": "<sha256 of the script field>",
  "script": "<minified JavaScript function>"
}
```

## Script API

### Translation Script

The `script` field must expose a `translate` function:

```javascript
async function translate(text, from, to, axios, config) {
  // text   - the text to translate
  // from   - source language code
  // to     - target language code
  // axios  - axios instance for HTTP requests
  // config - user-provided configuration object
  return "translated text"; // or a URL string for embed-type plugins
}
window.translate = translate;
```

### Dictionary Script

The `script` field must expose a `getDictText` function:

```javascript
async function getDictText(text, from, to, axios, t, config) {
  // text   - the word or phrase to look up
  // from   - source language code
  // to     - target language code
  // axios  - axios instance for HTTP requests
  // t      - i18n translation function (e.g. t("Learn more"))
  // config - user-provided configuration object
  return "<p>HTML content</p>"; // or a URL string for embed-type plugins
}
window.getDictText = getDictText;
```

### Voice Script

The `script` field must expose a `getAudioPath` function:

```javascript
const getAudioPath = async (text, speed, dirPath, config) => {
  // text    - text to synthesize
  // speed   - playback speed
  // dirPath - directory path to save the audio file
  // config  - user-provided configuration object
  return "/path/to/audio.wav"; // absolute path to the generated audio file
};
global.getAudioPath = getAudioPath;
```

## Utilities

### `utils/getCodeSHA256.js`

A helper script that computes the SHA-256 hash of the `script` field in a plugin JSON file. This hash is stored in the `scriptSHA256` field and is used by Koodo Reader to verify plugin integrity.

```bash
node utils/getCodeSHA256.js
```

## Development

### Prerequisites

- Node.js >= 16
- npm

### Install dependencies

```bash
npm install
```

### Adding a New Plugin

1. Write the plugin source code in `code/<plugin-type>/<plugin-name>.js`.
2. Write the plugin template in `plugins/<plugin-type>/<plugin-name>.json`.
3. Minify and unescape the plugin source code. Recommended tools: [Online JavaScript Minifier Tool and Compressor](https://www.toptal.com/developers/javascript-minifier), [JSON Escape / Unescape](https://www.freeformatter.com/json-escape.html#before-output)
4. Write the processed script into the `script` field of script template.
5. Update the file path in `utils/getCodeSHA256.js` and run it. Fill the output hash value into the `scriptSHA256` field.

## License

This project is licensed under the [AGPL v3](./LICENSE) license.
