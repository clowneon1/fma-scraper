#!/usr/bin/env node
require("dotenv").config();

const minimist = require("minimist");

const logger = require("./src/utils/logger");
const { scrape } = require("./src/services/fma-scraper.service");
const { printHelp } = require("./src/utils/help");

async function run() {
  try {
    const args = minimist(process.argv.slice(2));

    if (args.help) {
      printHelp();
      process.exit(0);
    }

    const auto = args.auto || false;
    const concurrency =
      Number(args.concurrency) || Number(process.env.FMA_CONCURRENCY) || 5;
    const pages = auto
      ? Infinity
      : Number(args.pages) || Number(process.env.FMA_FETCH_PAGES) || 1;

    const limit =
      Number(args.limit) || Number(process.env.FMA_FETCH_LIMIT) || 5;

    const pageSize =
      Number(args.pageSize) || Number(process.env.FMA_PAGE_SIZE) || 20;

    logger.info("Starting FMA scraper");
    logger.info(`Auto pagination: ${auto}`);
    logger.info(`Pages: ${pages}`);
    logger.info(`Concurrency: ${concurrency}`);
    logger.info(`Limit: ${limit}`);
    logger.info(`Page Size: ${pageSize}`);

    const params = {
      adv: 1,

      quicksearch: args.search,
      "search-genre": args.genre,

      "only-instrumental": args.instrumental ? 1 : undefined,

      duration_from: args.durationFrom,
      duration_to: args.durationTo,

      sort: args.sort,
      d: args.direction,

      "music-filter-public-domain": args.publicDomain ? 1 : undefined,
      "music-filter-commercial-allowed": args.commercial ? 1 : undefined,
      "music-filter-remix-allowed": args.remix ? 1 : undefined,

      "music-filter-CC-attribution-only": args.ccby ? 1 : undefined,
      "music-filter-CC-attribution-sharealike": args.ccbysa ? 1 : undefined,
      "music-filter-CC-attribution-noderivatives": args.ccbynd ? 1 : undefined,

      "music-filter-CC-attribution-noncommercial": args.ccbync ? 1 : undefined,
      "music-filter-CC-attribution-noncommercial-sharealike": args.ccbyncsa
        ? 1
        : undefined,
      "music-filter-CC-attribution-noncommercial-noderivatives": args.ccbyncnd
        ? 1
        : undefined,
    };

    const result = await scrape({
      pages,
      limit,
      pageSize,
      params,
      auto,
      concurrency,
    });

    logger.info("Scraping finished");
    logger.info(`Downloaded ${result.downloaded} tracks`);
    process.exit(0);
  } catch (err) {
    logger.error("CLI execution failed", err);
    process.exit(1);
  }
}

run();
