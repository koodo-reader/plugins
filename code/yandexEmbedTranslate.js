async function translate(text, from, to, axios, config) {
  let transUrl = "https://translate.yandex.com/"
  return transUrl + `?source_lang=${from}&target_lang=${to}&text=${encodeURIComponent(text)}`
};
window.translate = translate