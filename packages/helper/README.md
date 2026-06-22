# Song Formatter Helper

Local server that downloads a song's audio from YouTube as an mp3 (backing
track) and streams it to the app. It runs on **your** machine so YouTube
doesn't bot-block it the way it blocks cloud/Lambda IPs.

## One-time setup

The helper is cross-platform (Node only) but runs **on each machine** you use,
so install the two tools it shells out to on every computer.

**Windows** (PowerShell):

```powershell
winget install yt-dlp.yt-dlp
winget install Gyan.FFmpeg
```

**macOS** (Homebrew):

```bash
brew install yt-dlp ffmpeg
```

Restart the terminal afterward so they're on `PATH`. Verify:

```
yt-dlp --version
ffmpeg -version
```

## Run

```powershell
cd packages/helper
npm start
```

You should see `yt-dlp: found` and `ffmpeg: found`. Leave it running while
you use the app **locally** (http://localhost:5173). The prod https site can't
call this http helper (browser mixed-content block), so use the dev server for
mp3 downloads.

## Endpoints

- `GET /health` → `{ ok, tools }`
- `POST /download` with JSON `{ url }` or `{ artist, song }` → streams mp3.
  A `url` wins; otherwise it searches YouTube for the top hit.

## Legal note

For personal use (your own backing tracks). Downloading YouTube content can
conflict with YouTube's Terms of Service — use responsibly.
