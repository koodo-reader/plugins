function decodeHtmlEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

async function translate(text, from, to, axios, config) {
  const apiKey = (config && config.apiKey) || "";
  const endpoint =
    (config && config.endpoint) ||
    "https://translation.googleapis.com/language/translate/v2";
  const targetLanguage = to || "zh-CN";

  if (!apiKey) {
    return "Missing Google Cloud apiKey";
  }

  if (!text) {
    return "";
  }

  if (from && from === targetLanguage) {
    return text;
  }

  const payload = {
    q: text,
    target: targetLanguage,
    format: "text",
  };

  if (from && from !== "") {
    payload.source = from;
  }

  try {
    const response = await axios.post(endpoint, payload, {
      params: {
        key: apiKey,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (
      response.status === 200 &&
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data.translations) &&
      response.data.data.translations[0] &&
      typeof response.data.data.translations[0].translatedText === "string"
    ) {
      return decodeHtmlEntities(
        response.data.data.translations[0].translatedText,
      );
    }

    return "Error happened";
  } catch (error) {
    if (error.response && error.response.data) {
      const data = error.response.data;

      if (typeof data === "string") {
        return data;
      }

      if (data.error) {
        if (typeof data.error.message === "string") {
          return data.error.message;
        }

        return JSON.stringify(data.error);
      }
    }

    return error.message || "Error happened";
  }
}

window.translate = translate;
