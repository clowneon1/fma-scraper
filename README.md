---
# FMA Scraper

A lightweight **Node.js scraper and downloader for Free Music Archive (FMA)** that fetches publicly available tracks from search pages and downloads the corresponding MP3 files.

The tool extracts track metadata from the page’s `data-track-info` attributes and retrieves the direct `fileUrl` pointing to the MP3 hosted on the FMA CDN.

This project is designed to be **simple, scriptable, and reusable** for building music ingestion pipelines, research datasets, or personal music libraries. It expands on the earlier version described in the original README with improved CLI controls and concurrent downloads.
---

# Features

- Scrapes tracks from **Free Music Archive search pages**
- Automatically downloads MP3 files
- **Concurrent downloads** for faster scraping
- **Auto-pagination** support
- Fully configurable **CLI flags**
- License filtering (**Public Domain / CC BY**)
- Environment-based configuration
- Structured logging
- Safe download limits to prevent excessive scraping

---

# How It Works

The scraper follows this pipeline:

```
FMA search page
      ↓
extract `data-track-info`
      ↓
collect track page URLs
      ↓
open track page
      ↓
extract `fileUrl`
      ↓
download MP3
```

Each MP3 file is downloaded directly from the FMA CDN:

```
https://files.freemusicarchive.org/storage-freemusicarchive-org/music/...
```

---

# Installation

You can install the scraper via **npm** or by cloning the repository.

## Install via npm

```bash
npm install @codepenguin/fma-scraper
```

## Install via GitHub

```bash
git clone https://github.com/clowneon1/fma-scraper.git
cd fma-scraper
npm install
```

---

# Configuration

Create a `.env` file in the project root:

```env
FMA_DEFAULT_GENRE=Jazz
FMA_FETCH_PAGES=2
FMA_FETCH_LIMIT=5
FMA_CONCURRENCY=5
```

| Variable            | Description                       |
| ------------------- | --------------------------------- |
| `FMA_DEFAULT_GENRE` | Default genre if none is provided |
| `FMA_FETCH_PAGES`   | Default number of pages           |
| `FMA_FETCH_LIMIT`   | Maximum number of downloads       |
| `FMA_CONCURRENCY`   | Worker concurrency                |

---

# CLI Usage

Run the scraper using the CLI:

```bash
node cli.js [options]
```

If installed globally or via npm:

```bash
npx @codepenguin/fma-scraper [options]
```

---

# CLI Options

| Flag             | Description                              |
| ---------------- | ---------------------------------------- |
| `--search`       | Quick search keyword                     |
| `--genre`        | Filter by genre                          |
| `--pageSize`     | Results per page                         |
| `--pages`        | Number of pages to scrape                |
| `--limit`        | Maximum downloads                        |
| `--auto`         | Automatically paginate until results end |
| `--sort`         | Sorting field                            |
| `--direction`    | Sort direction (`0` desc, `1` asc)       |
| `--concurrency`  | Number of concurrent downloads           |
| `--publicDomain` | Include Public Domain tracks             |
| `--ccby`         | Include CC BY tracks                     |
| `--instrumental` | Only instrumental tracks                 |
| `--help`         | Show CLI help                            |

---

# CLI Help

Display help information:

```bash
node cli.js --help
```

Example output:

```
FMA Scraper CLI

Usage:
  node cli.js [options]

Options:
  --search
  --genre
  --pages
  --pageSize
  --limit
  --auto
  --sort
  --direction
  --concurrency
  --publicDomain
  --ccby
  --instrumental
```

---

# Examples

## Basic Search

```bash
node cli.js --search=lofi
```

---

## Download 30 Tracks

```bash
node cli.js --search=lofi --limit=30
```

---

## Concurrent Downloads

```bash
node cli.js --search=lofi --limit=30 --concurrency=5
```

Recommended values:

| Concurrency | Use Case    |
| ----------- | ----------- |
| 3           | Very safe   |
| 5           | Recommended |
| 10          | Aggressive  |

---

## Auto Pagination

```bash
node cli.js --search=lofi --auto --limit=100
```

The scraper will automatically continue until:

- no more tracks are found
- or the download limit is reached

---

## Genre Filter

```bash
node cli.js --search=lofi --genre=Classical
```

---

## Sorting Example

```bash
node cli.js --search=lofi --sort=artist --direction=1
```

---

# License Filters

Filter tracks by Creative Commons license.

Example flags:

```bash
--publicDomain
--ccby
```

Example command:

```bash
node cli.js --search=lofi --publicDomain --ccby
```

These licenses allow **commercial usage and streaming**.

---

# Full Example Command

```bash
node cli.js \
--search=lofi \
--genre=Classical \
--pageSize=20 \
--sort=_score \
--direction=0 \
--publicDomain \
--ccby \
--auto \
--limit=50 \
--concurrency=5
```

---

# Output

Downloaded files are saved to:

```
/music
```

Logs are written to:

```
/logs
```

Example output:

```
info: Starting FMA scraper
info: Opening search page
info: Found 20 track pages
info: Saved track1.mp3
info: Download limit reached
info: Scraping finished
```

---

# Available Genres

Common FMA genres include:

```
Ambient
Blues
Classical
Country
Electronic
Experimental
Folk
Hip-Hop
Instrumental
International
Jazz
Noise
Old-Time
Pop
Punk
Rock
Singer-Songwriter
Soul-RnB
Soundtrack
Spoken
```

---

# Sorting Options

Supported sort fields:

```
_score
artist
track_title
track_date_published
duration
```

Sort direction:

```
d=0  (descending)
d=1  (ascending)
```

Example:

```
?sort=artist&d=1
```

---

# Logging

Logging is implemented using **Winston**.

Features:

- structured logs
- rotating log files
- configurable log levels

Logs are stored in:

```
/logs
```

---

# Limitations

- Scraping depends on the HTML structure of Free Music Archive
- Changes to the website may require updates
- Only tracks with publicly accessible `fileUrl` can be downloaded

Always respect the licensing terms associated with each track.

---

# License

MIT License

---

# Disclaimer

This tool downloads publicly available audio files from Free Music Archive.

Users are responsible for ensuring that downloaded content complies with the original licensing terms provided by the artists.

#### ~ clowneon1
