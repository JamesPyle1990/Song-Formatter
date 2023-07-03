import React from 'react';
import { Container, Box, TextField, Button } from '@mui/material';

const LyricsInput = ({ setLyrics, handleButtonClick }) => {

  return (
    <>
      <Container maxWidth="xl">
        <Box>
          <TextField
            label="Enter Lyrics"
            variant="outlined"
            multiline
            rows={20}
            onChange={(event) => setLyrics(event.target.value)}
            fullWidth={true}
            sx={{marginTop: 2}}
          />
        </Box>
        <Box
          m={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button variant="contained" color="primary" sx={{ height: 40 }} onClick={handleButtonClick}>
            Format
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default LyricsInput;

