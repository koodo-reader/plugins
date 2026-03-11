async function getDictText(text, from, to, axios, t, config) {
  //https://www.collinsdictionary.com/dictionary/english-spanish/hello
  return `https://www.collinsdictionary.com/dictionary/english${to === "en" ? "" : "-" + to}/${encodeURIComponent(text)}`
};
window.getDictText = getDictText