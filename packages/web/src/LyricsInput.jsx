import React from "react";
import { useState, useEffect } from "react";
import { Container, Box, TextField, Button } from "@mui/material";
import axios from 'axios';



const LyricsInput = ({ setLyrics, handleButtonClick }) => {
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [parsedUrl, setParsedUrl] = useState("");
  
  //function to fetch data
  const fetchData = async (songName, artistName) => {
    try {
      const response = await axios.get(`https://jclmcptdl1.execute-api.us-east-2.amazonaws.com/?artist=${artistName}&song=${songName}`);
      setParsedUrl(response.data);
      console.log('parsedUrl: ', parsedUrl.parsedUrl);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };
  
  // function to handle search
  const handleSearch = () => {
    fetchData(songName, artistName);
    
    // if parsedUrl is not yet set (still an empty string), do nothing
    if (!parsedUrl) return;
  
    const encodedSearchTerm = encodeURIComponent(songName + " chords");
    window.open(`${parsedUrl.parsedUrl}`, "_blank");
    
    let codeElement = document.querySelector('code');
    if (codeElement) {
      navigator.clipboard.writeText(codeElement.innerText);
    }

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
