async function getDictText(text, from, to, axios, t, config) {
  return `https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=${encodeURIComponent(text)}`
};
window.getDictText = getDictText