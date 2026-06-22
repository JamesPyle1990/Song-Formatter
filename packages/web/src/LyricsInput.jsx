import React, { useEffect, useState } from "react";
import { Container, Box, TextField, Button, Alert } from "@mui/material";

const UG_ORIGIN = "https://www.ultimate-guitar.com";

const LyricsInput = ({ lyrics, setLyrics, handleButtonClick }) => {
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [status, setStatus] = useState("");

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
