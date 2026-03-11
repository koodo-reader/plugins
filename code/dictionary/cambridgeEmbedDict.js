async function getDictText(text, from, to, axios, t, config) {
  //https://dictionary.cambridge.org/dictionary/english-danish/hello
  let transUrl = "https://dictionary.cambridge.org/dictionary/"
  return transUrl + `english${to === "en" ? "" : "-" + to}/${encodeURIComponent(text)}`
};
window.getDictText = getDictText