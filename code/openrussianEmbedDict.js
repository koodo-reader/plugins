async function getDictText(text, from, to, axios, t, config) {
  return `https://${to}.openrussian.org/ru/${encodeURIComponent(removeAccents(text))}`
};
function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
window.getDictText = getDictText