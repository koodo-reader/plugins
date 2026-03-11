async function getDictText(text, from, to, axios, t, config) {
  //https://www.frdic.com/dicts/fr/%C3%A9tait
  return `https://www.frdic.com/dicts/fr/${encodeURIComponent(text)}`
};
window.getDictText = getDictText