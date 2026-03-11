const translate = async (text, from, to, axios, translateConfig) => {
  let data = qsStringify({
    source_lang: from,
    target_lang: to,
    text: text,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url:
      "https://translate.yandex.net/api/v1/tr.json/translate?id=" +
      generateUUID().replace(/-/g, "") +
      "-0-0" +
      "&srv=android",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  let transRes = await axios.request(config);
  console.log(transRes);
  let result = transRes.data;
  if (result && result.text) {
    return result.text[0].trim();
  } else {
    return "Error happens";
  }
};
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
const qsStringify = (obj, sep = "&", eq = "=") => {
  const encode = encodeURIComponent;

  const pairs = Object.keys(obj).map((key) => {
    const val = obj[key];
    if (val === undefined || val === null) {
      return encode(key);
    }
    if (Array.isArray(val)) {
      return val.map((v) => encode(key) + eq + encode(v)).join(sep);
    }
    return encode(key) + eq + encode(val);
  });

  return pairs.filter((p) => p.length > 0).join(sep);
};
window.translate = translate