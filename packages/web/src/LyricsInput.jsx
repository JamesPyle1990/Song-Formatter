import React, { useEffect, useState } from "react";
import { Container, Box, TextField, Button, Alert, CircularProgress } from "@mui/material";

const UG_ORIGIN = "https://www.ultimate-guitar.com";
const HELPER_URL = "http://localhost:3001";

const LyricsInput = ({ lyrics, setLyrics, handleButtonClick }) => {
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [status, setStatus] = useState("");
  const [ytUrl, setYtUrl] = useState("");
  const [mp3Loading, setMp3Loading] = useState(false);
  const [mp3Status, setMp3Status] = useState("");

  // Listen for the bookmarklet posting scraped chords back from the UG tab.
  useEffect(() => {
    const onMessage = (event) => {
      let host = "";
      try {
        host = new URL(event.origin).hostname;
      } catch {
        return;
      }
      const fromUG =
        host === "ultimate-guitar.com" || host.endsWith(".ultimate-guitar.com");
      if (!fromUG) return;
      if (event.data?.type !== "SONG_FORMATTER_LYRICS") return;
      if (typeof event.data.content === "string") {
        setLyrics(event.data.content);
        setStatus("Chords received from Ultimate Guitar.");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [setLyrics]);

  // Open UG search in a new tab (the user's browser clears Cloudflare).
  const handleSearch = () => {
    if (!songName || !artistName) {
      setStatus("Enter both an artist and a song name.");
      return;
    }
    const value = encodeURIComponent(`${artistName} ${songName}`);
    // sf=1 tells the Song Formatter extension to auto-pick + grab the chords.
    window.open(
      `${UG_ORIGIN}/search.php?search_type=title&value=${value}&sf=1`,
      "_blank"
    );
    setStatus(
      "Searching Ultimate Guitar… with the extension installed this fills in automatically. Otherwise pick a chords version and click the bookmarklet."
    );
  };

  // Ask the local helper to download YouTube audio as mp3, then save it.
  const handleDownloadMp3 = async () => {
    if (!ytUrl && !(artistName && songName)) {
      setMp3Status("Paste a YouTube URL, or fill in artist and song above.");
      return;
    }
    setMp3Loading(true);
    setMp3Status("Downloading and converting… this can take a bit.");
    try {
      const res = await fetch(`${HELPER_URL}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: ytUrl, artist: artistName, song: songName }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMp3Status(err.error ? `Failed: ${err.error}` : `Failed (${res.status}).`);
        return;
      }
      const blob = await res.blob();
      // Pull filename from Content-Disposition, else build one.
      const disp = res.headers.get("Content-Disposition") || "";
      const match = disp.match(/filename="?([^"]+)"?/);
      const filename = match
        ? decodeURIComponent(match[1])
        : `${artistName} - ${songName}.mp3`.trim();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      setMp3Status(`Saved ${filename}`);
    } catch (e) {
      setMp3Status(
        "Couldn't reach the helper. Is it running? (cd packages/helper && npm start)"
      );
    } finally {
      setMp3Loading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box>
        <Box m={1} display="flex" justifyContent="center" alignItems="center" gap={2}>
          <TextField
            label="Enter Artist Name"
            variant="outlined"
            value={artistName}
            onChange={(event) => setArtistName(event.target.value)}
            sx={{ marginTop: 2 }}
          />
          <TextField
            label="Enter Song Name"
            variant="outlined"
            value={songName}
            onChange={(event) => setSongName(event.target.value)}
            sx={{ marginTop: 2 }}
          />
          <Button
            variant="contained"
            color="secondary"
            sx={{ height: 40, marginTop: 2 }}
            onClick={handleSearch}
          >
            Search Songs
          </Button>
        </Box>
        {status && (
          <Box m={1} display="flex" justifyContent="center">
            <Alert severity="info">{status}</Alert>
          </Box>
        )}
        <TextField
          label="Enter Lyrics"
          variant="outlined"
          multiline
          rows={10}
          value={lyrics}
          onChange={(event) => setLyrics(event.target.value)}
          fullWidth={true}
          sx={{ marginTop: 2 }}
        />
      </Box>

      <Box m={1} display="flex" justifyContent="center" alignItems="center" gap={2}>
        <TextField
          label="YouTube URL (optional)"
          variant="outlined"
          value={ytUrl}
          onChange={(event) => setYtUrl(event.target.value)}
          sx={{ marginTop: 2, minWidth: 320 }}
          helperText="Leave blank to auto-search by artist + song"
        />
        <Button
          variant="outlined"
          color="secondary"
          sx={{ height: 40, marginTop: 2 }}
          onClick={handleDownloadMp3}
          disabled={mp3Loading}
        >
          {mp3Loading ? <CircularProgress size={20} color="inherit" /> : "Download MP3"}
        </Button>
      </Box>
      {mp3Status && (
        <Box m={1} display="flex" justifyContent="center">
          <Alert severity="info">{mp3Status}</Alert>
        </Box>
      )}

      <Box m={1} display="flex" justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          sx={{ height: 40 }}
          onClick={handleButtonClick}
        >
          Format
        </Button>
      </Box>
    </Container>
  );
};

export default LyricsInput;
