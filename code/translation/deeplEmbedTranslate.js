async function translate(text, from, to, axios, config) {
  let transUrl = "https://www.deepl.com/en/translator"
  return transUrl + `#${from || "en"}/${to || "en"}/${encodeURIComponent(text)}`
};
window.translate = translate