import { useState } from "react";
import { Container, Grid, Typography, Box, Button, Slider, AppBar, Toolbar } from "@mui/material";
import { splitLyrics } from "./splitLyrics";


const LyricsDisplay = ({ lyrics, showLyrics, setShowLyrics }) => {
  const [fontSize, setFontSize] = useState(1);
  const [lineHeight, setLineHeight] = useState(20);

  const handleLineHeightChange = (event, newValue) => {
    setLineHeight(newValue);
  };

  const handleFontSizeChange = (event, newValue) => {
    setFontSize(newValue);
  };
  const handleEditClick = () => {
    setShowLyrics(false); // Hide lyrics and show text field when Edit button is clicked
  };

  if (!showLyrics) {
    return null; // Don't render anything if showLyrics is false
  }

  const sectionComponent = splitLyrics(lyrics);
 

  return (
    <>
        <Box m={1} display="flex" justifyContent="right" alignItems="center">
          <Button variant="contained" color="primary" sx={{ height: 40 }} onClick={handleEditClick}>
            Go Back
          </Button>
        </Box>
        <Box sx={{ height: "100vh", overflowY: "auto" }}>
          <Container maxWidth="xl">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography sx={{marginBottom: 4}}>
                {sectionComponent}
                </Typography>
              </Grid>
              <Grid />
            </Grid>
          </Container>
        </Box>

        <Box>
          <AppBar
            position="fixed"
            color="secondary"
            sx={{ top: "auto", bottom: 0 }}
          >
            <Toolbar>
              <Typography variant="h6"> Font Size</Typography>
              <Slider
                value={fontSize}
                min={0.5}
                max={2}
                step={0.1}
                onChange={handleFontSizeChange}
                aria-labelledby="font-size-slider"
                sx={{ width: 200, marginLeft: 2, marginRight: 5, color: "white" }}
              />
              <Typography variant="h6"> Line Height</Typography>
              <Slider
                defaultValue={1}
                getAriaValueText={(value) => `${value}px`}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={0.25}
                min={15}
                max={35}
                onChange={handleLineHeightChange}
                sx={{ width: 200, marginLeft: 2, color: "white" }}
              />
            </Toolbar>
          </AppBar>
        </Box>
    </>
  );
};
export default LyricsDisplay;
