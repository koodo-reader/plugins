async function getDictText(text, from, to, axios, t, config) {
  //https://www.esdict.cn/dicts/es/a%C3%B1os
  return `https://www.esdict.cn/dicts/es/${encodeURIComponent(text)}`
};
window.getDictText = getDictText