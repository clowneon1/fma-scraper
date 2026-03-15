const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");

const { axiosClient: axios } = require("../config/axios.config");
const logger = require("../utils/logger");

const MUSIC_DIR = path.join(process.cwd(), "music");

if (!fs.existsSync(MUSIC_DIR)) {
  fs.mkdirSync(MUSIC_DIR, { recursive: true });
}

function sanitizeFileName(name) {
  return name
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function downloadFile(url, name, retries = 2) {
  const filename = sanitizeFileName(name || url.split("/").pop()) + ".mp3";
  const filepath = path.join(MUSIC_DIR, filename);

  if (fs.existsSync(filepath)) {
    logger.info(`Skipping existing ${filename}`);
    return false;
  }

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const res = await axios({
        url,
        method: "GET",
        responseType: "stream",
        timeout: 30000,
      });

      const writer = fs.createWriteStream(filepath);

      await pipeline(res.data, writer);

      logger.info(`Saved ${filename}`);

      return true;
    } catch (err) {
      logger.warn(`Download failed (${attempt}) for ${filename}`);

      if (attempt > retries) {
        logger.error(`Giving up on ${filename}`);
        return false;
      }
    }
  }
}

module.exports = { downloadFile };
