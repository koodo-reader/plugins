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
const getTTSAudio = async (text, rate, config) => {
  let host = config.host || "127.0.0.1";
  let port = config.url || "8774";
  let api = "http://" + host + ":" + port + "/forward";
  let pitch = config.pitch || "50";
  let speed = rate * 50 || "50";
  let volume = config.volume || "50";
  let voice = config.voice || "";
  const axios = require("axios");
  return new Promise((resolve, reject) => {
    axios.get(api + "?" + objectToQueryString({
      volume,
      pitch,
      speed,
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
const getTTSVoice = async (config) => {
  let host = config.host || "127.0.0.1";
  let port = config.url || "8774";
  let api = "http://" + host + ":" + port + "/voices";
  const axios = require("axios");
  return new Promise((resolve, reject) => {
    axios.get(api)
      .then(response => {
        console.log(response)
        let result = response.data;
        console.log(result, 'result');
        if (result.success) {
          let voices = Object.values(result.data.catalog).flat();
          resolve(voices.map(voice => {
            return {
              "name": voice.id,
              "gender": voice.gender,
              "locale": voice.locale,
              "displayName": voice.name,
              "plugin": "multitts-voice-plugin",
              "config": config
            }
          })
          );
        } else {
          resolve([])
        }


      })
      .catch(error => {
        console.log(error)
        reject("");
      });
  })
}
// getAudioPath("喜欢的话", 1, __dirname, {
//   "host": "192.168.28.41",
//   "port": "8774",
//   "voice": "microsoft_zh-CN-XiaoxiaoNeural",
// }).then(console.log).catch(console.error)

getTTSVoice({
  "host": "192.168.28.41",
  "port": "8774",
  "voice": "microsoft_zh-CN-XiaoxiaoNeural",
}).then(console.log).catch(console.error)