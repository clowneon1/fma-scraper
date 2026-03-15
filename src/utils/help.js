function printHelp() {
  console.log(`
FMA Scraper CLI

Usage:
  node cli.js [options]

Search Options:
  --search=<term>            Quick search keyword
  --genre=<genre>            Filter by genre
  --instrumental             Only instrumental tracks

Duration Filters:
  --durationFrom=<minutes>   Minimum duration
  --durationTo=<minutes>     Maximum duration

License Filters:
  --publicDomain             Public domain tracks
  --ccby                     CC BY license
  --ccbysa                   CC BY-SA license
  --ccbynd                   CC BY-ND license
  --ccbync                   CC BY-NC license
  --ccbyncsa                 CC BY-NC-SA license
  --ccbyncnd                 CC BY-NC-ND license

Sorting:
  --sort=<field>             Sort field (_score, artist, title)
  --direction=<0|1>          Sort direction (0=desc, 1=asc)

Pagination:
  --pages=<n>                Number of pages to scrape
  --pageSize=<n>             Tracks per page (default 20)
  --auto                     Automatically scrape all pages

Limits:
  --limit=<n>                Maximum downloads

Utility:
  --help                     Show this help message

Performance:
  --concurrency=<n>          Number of concurrent downloads (default 5)

Examples:

  Basic search
    node cli.js --search=lofi --limit=10

  Auto pagination
    node cli.js --search=lofi --auto --limit=50

  Full filter example
    node cli.js --search=lofi --genre=Classical --ccby --publicDomain --auto

  Concurrent downloads
    node cli.js --search=lofi --auto --limit=50 --concurrency=5
`);
}

module.exports = { printHelp };
