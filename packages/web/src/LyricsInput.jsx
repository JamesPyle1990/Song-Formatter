import React from 'react';
import { Container, Box, TextField, Button } from '@mui/material';

const LyricsInput = ({ setLyrics, handleButtonClick }) => {

  return (
    <>
      <Container maxWidth="xl">
        <Box sx={{ '& > :not(style)': { m: 1, width: '180ch' }, }}>
          <TextField
            label="Enter Lyrics"
            variant="outlined"
            multiline
            rows={20}
            onChange={(event) => setLyrics(event.target.value)}
          />
        </Box>
        <Box
          m={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button variant="contained" color="secondary" sx={{ height: 40 }} onClick={handleButtonClick}>
            Format
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default LyricsInput;

