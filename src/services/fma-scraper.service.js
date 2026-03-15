const cheerio = require("cheerio");

const { axiosClient: axios } = require("../config/axios.config");
const logger = require("../utils/logger");
const downloader = require("../downloader/downloader.service");
const { normalizeUrl } = require("../utils/normalizer");

function cleanParams(params = {}) {
  const cleaned = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== false) {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

async function scrape({
  params = {},
  pages = 1,
  limit = 50,
  pageSize = 20,
  auto = false,
  concurrency = 5,
}) {
  let downloaded = 0;
  let page = 1;
  let active = 0;

  const queue = [];
  const seenTracks = new Set();
  let paginationFinished = false;

  const baseParams = cleanParams({
    adv: 1,
    ...params,
  });

  async function paginate() {
    while ((auto || page <= pages) && downloaded < limit) {
      const query = new URLSearchParams({
        ...baseParams,
        pageSize,
        page,
      });

      const url = `https://freemusicarchive.org/search?${query.toString()}`;

      logger.info(`Opening ${url}`);

      let res;

      try {
        res = await axios.get(url);
      } catch (err) {
        logger.error("Failed loading search page", err);
        break;
      }

      const $ = cheerio.load(res.data);

      const trackPages = [];

      $(".play-item").each((i, el) => {
        let trackUrl = null;

        const anchorUrl = $(el).find(".ptxt-track a").attr("href");

        if (anchorUrl) {
          trackUrl = anchorUrl;
        }

        if (!trackUrl) {
          const data = $(el).attr("data-track-info");

          if (data) {
            try {
              const parsed = JSON.parse(data);
              trackUrl = parsed.url;
            } catch {
              logger.warn("Invalid track JSON");
            }
          }
        }

        if (!trackUrl) return;

        trackUrl = normalizeUrl(trackUrl);

        if (seenTracks.has(trackUrl)) return;

        seenTracks.add(trackUrl);

        trackPages.push(trackUrl);
      });

      if (trackPages.length === 0) {
        logger.info(`No tracks found on page ${page}, stopping pagination`);
        break;
      }

      logger.info(`Found ${trackPages.length} track pages`);

      queue.push(...trackPages);

      page++;
    }

    paginationFinished = true;
  }

  async function worker() {
    while (true) {
      if (downloaded >= limit) break;

      const trackPage = queue.shift();

      if (!trackPage) {
        if (paginationFinished) break;

        await new Promise((resolve) => setTimeout(resolve, 200));
        continue;
      }

      try {
        logger.info(`Opening track page ${trackPage}`);

        const trackRes = await axios.get(trackPage);

        const $$ = cheerio.load(trackRes.data);

        const data = $$(".play-item").attr("data-track-info");

        if (!data) continue;

        const track = JSON.parse(data);

        const mp3 = track.fileUrl;

        if (!mp3) continue;

        const title = track.title || "unknown-title";
        const artist = track.artistName || "unknown-artist";

        const filename = `${title} - ${artist}`;

        // reserve a slot first
        if (downloaded >= limit) break;

        downloaded++;
        active++;

        const success = await downloader.downloadFile(mp3, filename);
        active--;

        if (!success) {
          downloaded--; // release slot if download failed
        }

        if (downloaded >= limit) {
          logger.info("Download limit reached");
          break;
        }
      } catch (err) {
        logger.error(`Failed ${trackPage}`, err);
      }
    }
  }

  const workers = [];

  for (let i = 0; i < concurrency; i++) {
    workers.push(worker());
  }

  await Promise.all([paginate(), ...workers]);

  return {
    success: true,
    downloaded,
  };
}

module.exports = { scrape };
