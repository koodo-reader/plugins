async function getDictText(text, from, to, axios, t, config) {
  //https://dict.eudic.net/dicts/en/hello
  return `https://dict.eudic.net/dicts/en/${encodeURIComponent(text)}`
};
window.getDictText = getDictText