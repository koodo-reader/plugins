const getAudioPath = async (text, speed, dirPath, config) => {
  const path = require("path");
  const fs = require("fs");
  let audioName = new Date().getTime() + ".wav";
  if (!fs.existsSync(path.join(dirPath, "tts"))) {
    fs.mkdirSync(path.join(dirPath, "tts"));
    fs.writeFileSync(path.join(dirPath, "tts", audioName), await getTTSAudio(text, speed, config));
    console.log("folder created successfully");
  } else {
    fs.writeFileSync(path.join(dirPath, "tts", audioName), await getTTSAudio(text, speed, config));
    console.log("folder already exists");
  }
  return path.join(dirPath, "tts", audioName);
}
const objectToQueryString = (obj) => {
  const queryParams = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      queryParams.push(`${encodedKey}=${encodedValue}`);
    }
  }

  return queryParams.join("&");
}
const getTTSAudio = async (text, speed, config) => {
  let host = config.host || "127.0.0.1";
  let url = config.url || "";
  let params = parseUrlParams(url);
  let api = params.api || "http://localhost:1221/api/tts";
  let engine = params.engine || "com.github.jing332.tts_server_android";
  let pitch = params.pitch || "100";
  let rate = params.rate || "50";
  let voice = params.voice || "";
  api = api.replace("localhost", host)
  const axios = require("axios");
  return new Promise((resolve, reject) => {
    axios.get(api + "?" + objectToQueryString({
      engine,
      pitch,
      rate,
      voice,
      text
    }), { responseType: "arraybuffer" })
      .then(response => {
        console.log(response)
        resolve(response.data)
      })
      .catch(error => {
        console.log(error)
        reject("");
      });
  })
}
function parseUrlParams(url) {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = decodeURIComponent(value); // 解码参数值
  }
  return result;
}
global.getAudioPath = getAudioPath