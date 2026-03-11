const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// 定义文件路径
const filePath = path.join(
  __dirname,
  "../plugins/voice/azure-tts-voice-plugin.json",
);

try {
  // 同步读取文件内容
  const fileContents = fs.readFileSync(filePath, "utf8");
  // 解析JSON字符串
  const data = JSON.parse(fileContents);
  function getSHA256Hash(string) {
    // 创建一个SHA-256哈希对象
    const hash = crypto.createHash("sha256");
    // 更新哈希对象的内容
    hash.update(string);
    // 获取哈希结果的十六进制字符串
    return hash.digest("hex");
  }

  // 使用示例
  const myString = data.script;
  const hashedString = getSHA256Hash(myString);
  console.log(hashedString); // 输出：a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e
} catch (err) {
  console.error("读取或解析文件时出错:", err);
}
