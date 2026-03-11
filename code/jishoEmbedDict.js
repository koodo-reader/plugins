async function getDictText(text, from, to, axios, t, config) {
  //https://jisho.org/search/%E8%B5%B0%E3%82%8B
  return `https://jisho.org/search/${encodeURIComponent(text)}`
};
window.getDictText = getDictText