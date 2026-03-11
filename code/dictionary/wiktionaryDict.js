// async function getDictText(text, from, to, axios, t, config) {
//   text = decodeURIComponent(encodeURIComponent(text));
//   const res = await axios.get(
//     `https://${to}.wiktionary.org/w/api.php?action=query&titles=${text}&prop=extracts&format=json&origin=*`
//   );
//   let html = `<p class="wiki-text">${res.data.query.pages[Object.keys(res.data.query.pages)[0]].extract
//     }</p><p class="dict-learn-more">${t("Learn more")}</p>`;
//   window.learnMoreUrl = "https://" + to + ".wiktionary.org/wiki/" +
//     text;
//   return html
// };
// window.getDictText = getDictText

async function getWiktionaryLanguages() {
  const url = "https://en.wiktionary.org/w/api.php";
  const params = new URLSearchParams({
    action: "query",
    meta: "siteinfo",
    siprop: "languages|statistics",
    format: "json",
    origin: "*" // This is required to avoid CORS issues
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`);
    const data = await response.json();

    const languages = data.query.languages;
    const statistics = data.query.statistics;

    // Extract language and article count
    const languageStats = languages.map(lang => {
      const langCode = lang.code;
      const langName = lang['*'];
      const articleCount = statistics[langCode]?.articles || 0;
      return { langName, articleCount };
    });

    // Sort by article count in descending order
    languageStats.sort((a, b) => b.articleCount - a.articleCount);

    return languageStats;
  } catch (error) {
    console.error("Error fetching Wiktionary languages:", error);
  }
}

getWiktionaryLanguages().then(languages => {
  if (languages) {
    languages.forEach(({ langName, articleCount }) => {
      console.log(`${langName}: ${articleCount} articles`);
    });
  }
});