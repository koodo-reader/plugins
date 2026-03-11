# Koodo Reader Plugins

[中文文档](./README_CN.md)

This repository contains the official plugins for [Koodo Reader](https://github.com/koodo-reader/koodo-reader), including translation plugins, dictionary plugins, and text-to-speech (TTS) voice plugins.

## Repository Structure

```
 code/          # Plugin source code (human-readable, unminified)
 plugins/       # Compiled plugin JSON files (consumed by Koodo Reader)
 utils/         # Utility scripts (e.g., SHA256 hash generation)
 index.js       # Entry point / helper runtime
 package.json   # Node.js project manifest
```

## Plugin JSON Format

Each plugin is defined as a JSON file with the following structure:

**Translation / Dictionary plugins:**

```json
{
  "identifier": "plugin-identifier",
  "type": "translation | dictionary",
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

1. Write the plugin source code in `code/<pluginName>.js` (unminified, readable format).
2. Minify the script and embed it in the `script` field of the plugin JSON file under `plugins/`.
3. Run `utils/getCodeSHA256.js` (update the file path inside) to compute the SHA-256 hash and set it as `scriptSHA256`.
4. Ensure the `identifier`, `type`, `displayName`, `langList` / `voiceList` fields are correctly filled.

## License

This project is licensed under the [AGPL v3](./LICENSE) license.
