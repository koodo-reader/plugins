const getAudioPath = async (text, speed, dirPath, config) => {
  const path = require("path");
  const fs = require("fs");
  let audioName = new Date().getTime() + ".mp3";
  if (!fs.existsSync(path.join(dirPath, "tts"))) {
    fs.mkdirSync(path.join(dirPath, "tts"));
  }
  fs.writeFileSync(
    path.join(dirPath, "tts", audioName),
    await getTTSAudio(text, speed, config),
  );
  return path.join(dirPath, "tts", audioName);
};

const mapSpeedToSpeechRate = (speed) => {
  if (!speed || speed === 1.0) return 0;
  return Math.min(100, Math.max(-50, Math.round((speed - 1) * 100)));
};

const parseChunkedResponse = (responseText) => {
  const audioChunks = [];
  const lines = responseText.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const obj = JSON.parse(trimmed);
      const code = obj.code || 0;
      if (code === 20000000) continue;
      if (code !== 0) {
        throw new Error(obj.message || `TTS error code ${code}`);
      }
      if (obj.data) {
        audioChunks.push(Buffer.from(obj.data, "base64"));
      }
    } catch (err) {
      if (err.message && err.message.startsWith("TTS error")) throw err;
    }
  }
  return Buffer.concat(audioChunks);
};

const getTTSAudio = async (text, speed, config) => {
  const apiKey = config.apiKey || "";
  if (!apiKey) {
    return Promise.reject("Missing API Key");
  }

  const voiceName = config.voiceName || "zh_female_vv_uranus_bigtts";
  const resourceId = config.resourceId || "seed-tts-2.0";
  const url = "https://openspeech.bytedance.com/api/v3/tts/unidirectional";
  const axios = require("axios");

  const audioParams = {
    format: "mp3",
    sample_rate: 24000,
  };
  const speechRate = mapSpeedToSpeechRate(speed);
  if (speechRate !== 0) {
    audioParams.speech_rate = speechRate;
  }

  const payload = {
    req_params: {
      text: text,
      speaker: voiceName,
      audio_params: audioParams,
    },
  };

  return new Promise((resolve, reject) => {
    axios
      .post(url, payload, {
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/json",
          "X-Api-Resource-Id": resourceId,
        },
        responseType: "text",
        timeout: 60000,
      })
      .then((response) => {
        const audioBuffer = parseChunkedResponse(response.data);
        if (!audioBuffer.length) {
          reject("No audio data in response");
          return;
        }
        resolve(audioBuffer);
      })
      .catch((error) => {
        console.log(error);
        reject("");
      });
  });
};

const getTTSVoice = async (config) => {
  const voices = [
    {
      name: "zh_female_shuangkuaisisi_uranus_bigtts",
      displayName: "爽快思思 2.0",
      gender: "female",
      locale: "zh-CN",
    },
    {
      name: "zh_female_cancan_uranus_bigtts",
      displayName: "知性灿灿 2.0",
      gender: "female",
      locale: "zh-CN",
    },
    {
      name: "zh_female_tianmeixiaoyuan_uranus_bigtts",
      displayName: "甜美小源 2.0",
      gender: "female",
      locale: "zh-CN",
    },
    {
      name: "zh_female_vv_uranus_bigtts",
      displayName: "Vivi 2.0",
      gender: "female",
      locale: "zh-CN",
    },
    {
      name: "zh_female_xiaohe_uranus_bigtts",
      displayName: "小何 2.0",
      gender: "female",
      locale: "zh-CN",
    },
    {
      name: "zh_male_m191_uranus_bigtts",
      displayName: "云舟 2.0",
      gender: "male",
      locale: "zh-CN",
    },
    {
      name: "zh_male_taocheng_uranus_bigtts",
      displayName: "小天 2.0",
      gender: "male",
      locale: "zh-CN",
    },
    {
      name: "zh_female_kefunvsheng_uranus_bigtts",
      displayName: "暖阳女声 2.0",
      gender: "female",
      locale: "zh-CN",
    },
    {
      name: "en_female_dacey_uranus_bigtts",
      displayName: "Dacey",
      gender: "female",
      locale: "en-US",
    },
    {
      name: "en_male_tim_uranus_bigtts",
      displayName: "Tim",
      gender: "male",
      locale: "en-US",
    },
  ];

  return Promise.resolve(
    voices.map((voice) => ({
      name: voice.name,
      gender: voice.gender,
      locale: voice.locale,
      displayName: `Volcengine TTS - ${voice.displayName} (${voice.locale})`,
      plugin: "volcengine-tts-voice-plugin",
      config: {
        ...config,
        voiceName: voice.name,
      },
    })),
  );
};

global.getAudioPath = getAudioPath;
global.getTTSVoice = getTTSVoice;
