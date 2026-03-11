async function translate(text, from, to, axios, config) {
  //https://translate.volcengine.com/?category=&home_language=zh&source_language=detect&target_language=zh&text=hello%20world
  let transUrl = "https://translate.volcengine.com/"
  return transUrl + `?category=&home_language=zh&source_language=${from}&target_language=${to}&text=${encodeURIComponent(text)}`
};
window.translate = translate