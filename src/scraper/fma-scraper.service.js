const cheerio = require("cheerio");

const axios = require("../config/axios.config");
const logger = require("../utils/logger");
const downloader = require("../downloader/downloader.service");

async function scrape({
  genre,
  pages,
  limit,
  pageSize = 20,
  sort = "_score",
  d = 0,
}) {
  let downloaded = 0;

  for (let page = 1; page <= pages; page++) {
    const url =
      `https://freemusicarchive.org/search` +
      `?search-genre=${encodeURIComponent(genre)}` +
      `&pageSize=${pageSize}` +
      `&page=${page}` +
      `&sort=${sort}` +
      `&d=${d}`;

    logger.info(`Opening ${url}`);

    const res = await axios.get(url);

    const $ = cheerio.load(res.data);

    const trackPages = [];

    $(".play-item").each((i, el) => {
      const data = $(el).attr("data-track-info");

      if (!data) return;

      try {
        const parsed = JSON.parse(data);

        trackPages.push(parsed.url);
      } catch {
        logger.warn("Invalid track JSON");
      }
    });

    for (const trackPage of trackPages) {
      if (downloaded >= limit) {
        logger.info("Download limit reached");

        return { success: true, downloaded };
      }

      try {
        const res = await axios.get(trackPage);

        const $ = cheerio.load(res.data);

        const data = $(".play-item").attr("data-track-info");

        if (!data) continue;

        const track = JSON.parse(data);

        const mp3 = track.fileUrl;

        if (!mp3) continue;

        const success = await downloader.downloadFile(mp3);

        if (success) downloaded++;
      } catch (err) {
        logger.error(`Failed ${trackPage}`, err);
      }
    }
  }

  return { success: true, downloaded };
}

module.exports = { scrape };
