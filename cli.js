#!/usr/bin/env node
require("dotenv").config();

const logger = require("./src/utils/logger");
const { scrape } = require("./src/services/fma-scraper.service");

async function run() {
  try {
    const genre = process.argv[2] || process.env.FMA_DEFAULT_GENRE || "Jazz";

    const pages =
      Number(process.argv[3]) || Number(process.env.FMA_FETCH_PAGES) || 1;

    const limit =
      Number(process.argv[4]) || Number(process.env.FMA_FETCH_LIMIT) || 5;

    logger.info(`Starting FMA scraper`);

    logger.info(`Genre: ${genre}`);
    logger.info(`Pages: ${pages}`);
    logger.info(`Download limit: ${limit}`);

    const result = await scrape({
      genre,
      pages,
      limit,
    });

    logger.info(`Scraping finished`);
    logger.info(`Downloaded ${result.downloaded} tracks`);

    process.exit(0);
  } catch (err) {
    logger.error("CLI execution failed", err);

    process.exit(1);
  }
}

run();
