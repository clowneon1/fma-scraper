---
# FMA Scraper

A lightweight **Node.js scraper and downloader for Free Music Archive (FMA)** that fetches publicly available tracks from search pages and downloads the corresponding MP3 files.

The tool extracts track metadata from the page’s `data-track-info` attributes and retrieves the direct `fileUrl` pointing to the MP3 hosted on the FMA CDN.

This project is designed to be **simple, scriptable, and reusable** for building music ingestion pipelines, research datasets, or personal music libraries.
---

# Features

- Scrapes tracks from **Free Music Archive search pages**
- Downloads MP3 files automatically
- Configurable scraping parameters
- CLI usage for easy automation
- Structured logging with rotating logs
- Environment-based configuration
- Safe download limits to avoid excessive scraping

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

The `fileUrl` field points directly to the FMA CDN:

```
https://files.freemusicarchive.org/storage-freemusicarchive-org/music/...
```

This allows downloading the track without authentication.

---

# Installation

You can install the scraper either via **npm** or by cloning the repository.

### Install via npm

```
npm install @codepenguin/fma-scraper
```

### Install via GitHub

```
git clone https://github.com/clowneon1/fma-scraper.git
cd fma-scraper
npm install
```

---

# Configuration

Create a `.env` file:

```
FMA_DEFAULT_GENRE=Jazz
FMA_FETCH_PAGES=2
FMA_FETCH_LIMIT=5
```

| Variable          | Description                          |
| ----------------- | ------------------------------------ |
| FMA_DEFAULT_GENRE | Default genre if none is provided    |
| FMA_FETCH_PAGES   | Number of search pages to crawl      |
| FMA_FETCH_LIMIT   | Maximum number of tracks to download |

---

# Usage

Run the scraper using the CLI:

```
node cli.js
```

This will use values from `.env`.

You can also override them:

```
node cli.js Jazz 5 20
```

Meaning:

```
genre = Jazz
pages = 5
download limit = 20 tracks
```

If installed via npm, you can also run:

```
npx @codepenguin/fma-scraper Jazz 5 20
```

Example output:

```
info: Starting FMA scraper
info: Opening search page
info: Collected 20 track pages
info: Saved The_Great_Red_Spot.mp3
info: Scraping finished
info: Downloaded 5 tracks
```

Downloaded files are saved to:

```
/music
```

Logs are written to:

```
/logs
```

---

# Search Parameters

The scraper uses the FMA search endpoint:

```
https://freemusicarchive.org/search
```

Example request:

```
https://freemusicarchive.org/search?search-genre=Hip-Hop&pageSize=20&page=1&sort=_score&d=0
```

Supported parameters:

| Parameter    | Description      |
| ------------ | ---------------- |
| search-genre | Genre filter     |
| pageSize     | Results per page |
| page         | Page number      |
| sort         | Sorting method   |
| d            | Sort direction   |

Default sorting:

```
sort=_score
d=0
```

---

# Available Genres

Common genres available on FMA include:

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

Additional subgenres may exist depending on search filters.

---

# Available Sorting Options

Sorting parameters supported by the search endpoint:

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

Logging is implemented using Winston.

Features:

- structured logs
- rotating log files
- configurable log levels
- protection against excessively large logs

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

# Future Improvements

Planned features include:

### Concurrent Downloads

Current downloads are sequential.

Future versions will support **parallel downloads with configurable concurrency limits**, which will significantly improve scraping performance while still respecting remote servers.

Example concept:

```
maxConcurrentDownloads = 5
```

This allows downloading multiple tracks simultaneously without overwhelming the site.

---

### Single Track Download

Currently the scraper focuses on **genre-based scraping**.

Future support will include:

```
node cli.js --track https://freemusicarchive.org/music/.../track
```

This will download a **single track directly** without scanning genre pages.

---

### Pagination Automation

Automatically crawl large result sets:

```
page 1 → page N
```

allowing large dataset collection.

---

### CLI Improvements

Future CLI flags:

```
--genre
--pages
--limit
--sort
--track
```

---

# License

MIT License

---

# Disclaimer

This tool downloads publicly available audio files from Free Music Archive.

Users are responsible for ensuring that downloaded content complies with the original licensing terms provided by the artists.

---
