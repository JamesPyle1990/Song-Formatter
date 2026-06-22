// Song Formatter local helper.
//
// Runs on the user's machine (residential IP) so YouTube doesn't bot-block it
// the way it blocks datacenter/Lambda IPs. Shells out to yt-dlp + ffmpeg to
// pull a song's audio as mp3 and streams it back to the app.
//
// Start: node server.js   (or: npm start in packages/helper)
// Needs: yt-dlp and ffmpeg on PATH.

const http = require("http");
const { spawn, spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const PORT = process.env.PORT || 3001;

// --- tool detection --------------------------------------------------------
function hasTool(cmd) {
  const r = spawnSync(cmd, ["--version"], { encoding: "utf8" });
  return !r.error;
}
const tools = { ytdlp: hasTool("yt-dlp"), ffmpeg: hasTool("ffmpeg") };

// --- helpers ---------------------------------------------------------------
function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, code, obj) {
  cors(res);
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}

// Download + convert, then stream the resulting mp3 back to the browser.
function handleDownload(req, res, body) {
  if (!tools.ytdlp || !tools.ffmpeg) {
    return sendJson(res, 503, {
      error: "Missing tools",
      ytdlp: tools.ytdlp,
      ffmpeg: tools.ffmpeg,
      hint: "Install yt-dlp and ffmpeg, then restart the helper.",
    });
  }

  const url = (body.url || "").trim();
  const artist = (body.artist || "").trim();
  const song = (body.song || "").trim();

  // URL wins; otherwise search YouTube for the top hit.
  let target;
  if (url) {
    target = url;
  } else if (artist || song) {
    target = `ytsearch1:${artist} ${song} audio`.trim();
  } else {
    return sendJson(res, 400, { error: "Provide a url, or an artist and song." });
  }

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "sf-mp3-"));
  const args = [
    target,
    "-x",
    "--audio-format",
    "mp3",
    "--audio-quality",
    "0",
    "--no-playlist",
    "-o",
    path.join(tmp, "%(title)s.%(ext)s"),
  ];

  const proc = spawn("yt-dlp", args);
  let stderr = "";
  proc.stderr.on("data", (d) => (stderr += d));
  proc.stdout.on("data", (d) => console.log(String(d).trim()));

  proc.on("close", (code) => {
    if (code !== 0) {
      cleanup(tmp);
      return sendJson(res, 502, {
        error: "yt-dlp failed",
        detail: stderr.split("\n").slice(-5).join("\n"),
      });
    }
    const mp3 = fs.readdirSync(tmp).find((f) => f.toLowerCase().endsWith(".mp3"));
    if (!mp3) {
      cleanup(tmp);
      return sendJson(res, 502, { error: "No mp3 produced." });
    }
    const filePath = path.join(tmp, mp3);
    const stat = fs.statSync(filePath);
    cors(res);
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": stat.size,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(mp3)}"`,
    });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on("close", () => cleanup(tmp));
  });
}

function cleanup(dir) {
  fs.rm(dir, { recursive: true, force: true }, () => {});
}

// --- server ----------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    cors(res);
    res.writeHead(204);
    return res.end();
  }
  if (req.method === "GET" && req.url === "/health") {
    return sendJson(res, 200, { ok: true, tools });
  }
  if (req.method === "POST" && req.url === "/download") {
    const body = await readBody(req);
    return handleDownload(req, res, body);
  }
  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Song Formatter helper on http://localhost:${PORT}`);
  console.log(`  yt-dlp: ${tools.ytdlp ? "found" : "MISSING"}`);
  console.log(`  ffmpeg: ${tools.ffmpeg ? "found" : "MISSING"}`);
  if (!tools.ytdlp || !tools.ffmpeg) {
    console.log("  Install both, then restart. See packages/helper/README.md");
  }
});
