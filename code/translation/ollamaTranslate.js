async function translate(text, from, to, axios, config) {
  if (config.url === "") {
    return "Error happened";
  }
  let transUrl = config.url;
  let headers = {
    "Content-Type": "application/json"
  };
  let transRes = await axios.post(transUrl, {
    "model": config.model || "llama3",
    "prompt": `${text} \ntranslate the above sentence to ${to === "en" || to === "Automatic" ? "English" : to}, and only return the content translated. no explanation.`,
    "stream": false
  }, {
    headers,
  });
  console.log(transRes)
  if (transRes.status === 200) {
    return transRes.data.response;
  } else {
    return "Error happened";
  }

};
window.translate = translate