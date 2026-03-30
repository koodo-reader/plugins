async function translate(text, from, to, axios, config) {
  let secretId = config.secretId || "";
  let secretKey = config.secretKey || "";
  let region = config.region || "ap-beijing";

  let endpoint = "tmt.tencentcloudapi.com";
  let service = "tmt";
  let action = "TextTranslate";
  let version = "2018-03-21";

  // TC3-HMAC-SHA256 signature
  function hmac(key, data, encoding) {
    return crypto.subtle
      .importKey(
        "raw",
        typeof key === "string" ? new TextEncoder().encode(key) : key,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      )
      .then((cryptoKey) =>
        crypto.subtle.sign(
          "HMAC",
          cryptoKey,
          typeof data === "string" ? new TextEncoder().encode(data) : data
        )
      )
      .then((sig) => {
        if (encoding === "hex") {
          return Array.from(new Uint8Array(sig))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        }
        return new Uint8Array(sig);
      });
  }

  async function sha256Hex(data) {
    let buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(data)
    );
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  let now = new Date();
  let timestamp = Math.floor(now.getTime() / 1000).toString();
  let dateStamp = now.toISOString().slice(0, 10);

  let body = JSON.stringify({
    SourceText: text,
    Source: from && from !== "" ? from : "auto",
    Target: to,
    ProjectId: 0,
  });

  let payloadHash = await sha256Hex(body);

  // Canonical headers (sorted)
  let signedHeaders = "content-type;host";
  let canonicalHeaders = `content-type:application/json\nhost:${endpoint}\n`;

  // Canonical request
  let canonicalRequest = [
    "POST",
    "/",
    "", // no query string
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  // String to sign
  let algorithm = "TC3-HMAC-SHA256";
  let credentialScope = `${dateStamp}/${service}/tc3_request`;
  let canonicalRequestHash = await sha256Hex(canonicalRequest);

  let stringToSign = [
    algorithm,
    timestamp,
    credentialScope,
    canonicalRequestHash,
  ].join("\n");

  // Derive signing key
  let kDate = await hmac(`TC3${secretKey}`, dateStamp);
  let kService = await hmac(kDate, service);
  let kSigning = await hmac(kService, "tc3_request");
  let signature = await hmac(kSigning, stringToSign, "hex");

  // Authorization header
  let authorizationHeader =
    `${algorithm} Credential=${secretId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  let requestHeaders = {
    "Content-Type": "application/json",
    Host: endpoint,
    Authorization: authorizationHeader,
    "X-TC-Action": action,
    "X-TC-Version": version,
    "X-TC-Timestamp": timestamp,
    "X-TC-Region": region,
  };

  let transRes = await axios.post(`https://${endpoint}/`, body, {
    headers: requestHeaders,
  });

  console.log(transRes);
  if (transRes.status === 200 && transRes.data.Response) {
    return transRes.data.Response.TargetText;
  } else {
    return "Error happened";
  }
}
window.translate = translate;
