import React, { useState } from 'react';
import LyricsInput from './LyricsInput'; 
import LyricsDisplay from './LyricsDisplay';
import NavBar from './NavBar';
import { Button } from '@mui/material';

const FormatPage = () => {
  const [lyrics, setLyrics] = useState("");
  const [showLyrics, setShowLyrics] = useState(false);

  const handleButtonClick = () => {
    setShowLyrics(true); 
  };

  const showLyricsInput = () => {
    setShowLyrics(false);
  };

  return (
    <>
    <NavBar showLyricsInput={showLyricsInput}/>
    {!showLyrics && <LyricsInput setLyrics={setLyrics} handleButtonClick={handleButtonClick} />}
    {showLyrics && <LyricsDisplay lyrics={lyrics} showLyrics={showLyrics} setShowLyrics={setShowLyrics} />}
  </>
  );
};

export default FormatPage;
