async function getDictText(text, from, to, axios, t, config) {
  //https://www.hanyuguoxue.com/zidian/search?words=你&type=all
  return `https://www.hanyuguoxue.com/zidian/search?words=${encodeURIComponent(text)}&type=all`
};
window.getDictText = getDictText