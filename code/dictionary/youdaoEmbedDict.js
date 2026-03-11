async function getDictText(text, from, to, axios, t, config) {
  let transUrl = "https://dict.youdao.com/result?word="
  return transUrl + `${encodeURIComponent(text)}&lang=${to}`
};
window.getDictText = getDictText