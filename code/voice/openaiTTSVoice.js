const getAudioPath = async (text, speed, dirPath, config) => {
  const path = require("path");
  const fs = require("fs");
  let audioName = new Date().getTime() + ".mp3";
  if (!fs.existsSync(path.join(dirPath, "tts"))) {
    fs.mkdirSync(path.join(dirPath, "tts"));
    fs.writeFileSync(
      path.join(dirPath, "tts", audioName),
      await getTTSAudio(text, speed, config),
    );
    console.log("folder created successfully");
  } else {
    fs.writeFileSync(
      path.join(dirPath, "tts", audioName),
      await getTTSAudio(text, speed, config),
    );
    console.log("folder already exists");
  }
  return path.join(dirPath, "tts", audioName);
};
const getTTSAudio = async (text, speed, config) => {
  let apiKey = config.apiKey || "";
  let baseUrl = config.baseUrl || "https://api.openai.com";
  let model = config.model || "gpt-4o-mini-tts";
  let voiceName = config.voiceName || "coral";
  // speed range: 0.25 ~ 4.0, default 1.0
  let speedValue = speed ? Math.min(4.0, Math.max(0.25, speed)) : 1.0;
  let url = `${baseUrl}/v1/audio/speech`;
  const axios = require("axios");
  return new Promise((resolve, reject) => {
    axios
      .post(
        url,
        {
          model: model,
          input: text,
          voice: voiceName,
          speed: speedValue,
          response_format: "mp3",
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        },
      )
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject("");
      });
  });
};
const getTTSVoice = async (config) => {
  const voices = [
    { name: "alloy", gender: "female" },
    { name: "ash", gender: "male" },
    { name: "ballad", gender: "male" },
    { name: "coral", gender: "female" },
    { name: "echo", gender: "male" },
    { name: "fable", gender: "male" },
    { name: "nova", gender: "female" },
    { name: "onyx", gender: "male" },
    { name: "sage", gender: "female" },
    { name: "shimmer", gender: "female" },
    { name: "verse", gender: "male" },
    { name: "marin", gender: "female" },
    { name: "cedar", gender: "male" },
  ];
  return Promise.resolve(
    voices.map((voice) => ({
      name: voice.name,
      gender: voice.gender,
      locale: "en",
      displayName: `OpenAI TTS - ${voice.name}`,
      plugin: "openai-tts-voice-plugin",
      config: {
        ...config,
        voiceName: voice.name,
      },
    })),
  );
};
global.getAudioPath = getAudioPath;
global.getTTSVoice = getTTSVoice;
