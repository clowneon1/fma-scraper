const fs = require("fs");
const path = require("path");

const axios = require("../config/axios.config");
const logger = require("../utils/logger");

const MUSIC_DIR = path.join(process.cwd(), "music");

if (!fs.existsSync(MUSIC_DIR)) {
  fs.mkdirSync(MUSIC_DIR, { recursive: true });
}

async function downloadFile(url) {
  const filename = url.split("/").pop();
  const filepath = path.join(MUSIC_DIR, filename);

  if (fs.existsSync(filepath)) {
    logger.info(`Skipping existing ${filename}`);

    return false;
  }

  const res = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  const writer = fs.createWriteStream(filepath);

  res.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      logger.info(`Saved ${filename}`);

      resolve(true);
    });

    writer.on("error", reject);
  });
}

module.exports = { downloadFile };
