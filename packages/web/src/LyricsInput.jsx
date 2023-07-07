import React from "react";
import { useState } from "react";
import { Container, Box, TextField, Button } from "@mui/material";

const LyricsInput = ({ setLyrics, handleButtonClick }) => {
  const [songName, setSongName] = useState(""); // new state for song name

  // function to handle search
  const handleSearch = () => {
    const encodedSearchTerm = encodeURIComponent(songName + " chords");
    window.open(
      `https://www.google.com/search?q=${encodedSearchTerm}`,
      "_blank"
    );
  };

  return (
    <>
      <Container maxWidth="xl">
        <Box>
          <a
            class="bookmarklet"
            href="javascript:(function()%7Bnavigator.clipboard.writeText(document.querySelector(%22code%22).innerText)%7D)()"
          >
            Copy Lyrics
          </a>
          <Box m={1} display="flex" justifyContent="center" alignItems="center">
            <TextField // new TextField for song name
              label="Enter Song Name"
              variant="outlined"
              onChange={(event) => setSongName(event.target.value)}
              sx={{ marginTop: 2 }}
            />
            <Button // new button to initiate search
              variant="contained"
              color="secondary"
              sx={{ height: 40, marginLeft: 2 }}
              onClick={handleSearch}
            >
              Search Songs
            </Button>
          </Box>
          <TextField
            label="Enter Lyrics"
            variant="outlined"
            multiline
            rows={20}
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
    </>
  );
};

export default LyricsInput;
