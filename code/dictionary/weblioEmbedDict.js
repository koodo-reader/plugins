async function getDictText(text, from, to, axios, t, config) {
  return `https://${to === "en" ? "ejje" : to}.weblio.jp/content/${encodeURIComponent(text)}`
};
window.getDictText = getDictText