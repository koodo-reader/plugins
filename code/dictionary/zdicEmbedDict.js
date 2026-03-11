async function getDictText(text, from, to, axios, t, config) {
  return `https://www.zdic.net/hans/${encodeURIComponent(text)}`
};
window.getDictText = getDictText