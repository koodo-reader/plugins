async function translate(text, from, to, axios, config) {
  //https://quillbot.com/translate?sl=en-US&tl=zh&tone=auto&text=hello+world
  let transUrl = "https://quillbot.com/translate"
  return transUrl + `?sl=${from || "auto"}&tl=${to || "zh"}&tone=auto&text=${encodeURIComponent(text)}`
};
window.translate = translate