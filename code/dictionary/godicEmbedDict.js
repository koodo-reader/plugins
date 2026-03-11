async function getDictText(text, from, to, axios, t, config) {
  //https://www.godic.net/dicts/de/dein
  return `https://www.godic.net/dicts/de/${encodeURIComponent(text)}`
};
window.getDictText = getDictText