async function getDictText(text, from, to, axios, t, config) {
  let transUrl = "https://www.google.com/search?q=define+"
  return transUrl + `${encodeURIComponent(text)}`
};
window.getDictText = getDictText