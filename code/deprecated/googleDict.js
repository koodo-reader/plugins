async function googleTranslate(text, from, to, axios, config) {
  function objectToQueryString(obj) {
    const queryParams = [];

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(value);
        queryParams.push(`${encodedKey}=${encodedValue}`);
      }
    }

    return queryParams.join("&");
  }
  let res = await axios.get(
    `https://translate.google.com/translate_a/single?dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&${objectToQueryString(
      {
        client: "gtx",
        sl: from,
        tl: to,
        hl: to,
        ie: "UTF-8",
        oe: "UTF-8",
        otf: "1",
        ssel: "0",
        tsel: "0",
        kc: "7",
        q: text,
      }
    )}`,
    { headers: { "content-type": "application/json" } }
  );

  let result = res.data;
  if (result[1]) {
    let target = {
      pronunciations: [],
      explanations: [],
      associations: [],
      sentence: [],
      audios: [],
    };
    if (result[0][1][3]) {
      target.pronunciations.push({ symbol: result[0][1][3], voice: "" });
    }
    for (let i of result[1]) {
      target.explanations.push({
        trait: i[0],
        explains: i[2].map((x) => {
          return x[0];
        }),
      });
    }
    if (result[13]) {
      for (let i of result[13][0]) {
        target.sentence.push({ source: i[0] });
      }
    }
    return target;
  } else {
    let target = "";
    for (let r of result[0]) {
      if (r[0]) {
        target = target + r[0];
      }
    }
    return target.trim();
  }
}
async function getDictText(text, from, to, axios, t, config) {
  let res = await googleTranslate(text, from, to, axios, config);
  if (!res.explanations) {
    return `<p>${res}</p>`
  }
  window.learnMoreUrl = "https://www.google.com/search?q=define+" + text;
  return (
    `<p class="dict-word-type">[${t("Pronunciations")}]</p></p>` +
    res.pronunciations
      .map((item) => {
        return `<span style="font-weight: bold">${item.region ? item.region : ""
          }</span> [${item.symbol}]`;
      })
      .join(" ") +
    res.audios.map((item) => {
      return `<br/><div class="audio-container"><audio controls class="audio-player" controlsList="nodownload noplaybackrate"><source src="${item.url}" type="audio/mpeg"></audio></div></p>`;
    }) +
    `<p class="dict-word-type">[${t("Explanations")}]</p>` +
    res.explanations
      .map((item) => {
        return `<p><span style="font-weight: bold">${item.trait
          }</span> ${item.explains.join(", ")}</p>`;
      })
      .join("") +
    `<p class="dict-word-type">[${t("Associations")}]</p></p>` +
    res.associations
      .map((item) => {
        return item;
      })
      .join(", ") +
    `<p class="dict-word-type">[${t("Sentence")}]</p><ul>` +
    res.sentence
      .map(
        (item) =>
          `<li>${item.source}${item.translation ? " " + item.translation : ""
          }</li>`
      )
      .join("") +
    "</ul>" +
    `<p class="dict-learn-more">${t("Learn more")}</p>`
  );
};
window.getDictText = getDictText