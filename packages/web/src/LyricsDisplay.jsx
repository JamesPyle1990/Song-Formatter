import { useState } from "react";
import { Container, Grid, Typography, Box, Button, Slider, AppBar, Toolbar } from "@mui/material";
import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#513466",
    },
    secondary: {
      main: "#0f0f12",
    },
    text: {
      secondary: "#ffffff",
    },
  },
  props: {
    MuiAppBar: {
      color: "secondary",
    },
  },
});
theme = responsiveFontSizes(theme);

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

  const splitLyrics = (lyrics) => {
    let sections = {
      verse: [],
      verse2: [],
      verse3: [],
      chorus1: [],
      bridge: [],
      intro: [],
      outro: [],
      pre: [],
    };
    let chorusCount = 0;
    let lines = lyrics.split("\n");
    let currentSection = "";

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      let match = line.match(/\[(.*?)\]/);
      if (match) {
        currentSection = match[1].toLowerCase().replace(" ", "");
        console.log(currentSection);

        if (currentSection === "chorus") {
          chorusCount++;
          currentSection += chorusCount;
          console.log(currentSection);

          if (currentSection === "chorus1") {
            let words = line
              .split(" ")
              .map((word) => ({ text: word, isChord: isChord(word) }));
            sections[currentSection].push(words);
          }
        }
      }
      else {
        let words = line
          .split(" ")
          .map((word) => ({ text: word, isChord: isChord(word) }));

        if (!sections[currentSection]) {
          sections[currentSection] = [];
        }

        sections[currentSection].push(words);
      }
    }
    return sections;
  };

  const isChord = (str) => {
    const chordRegex =
      /\b[A-G][#b.]?(maj7#11|13|sus2|sus4|m7|#11|maj7|min7|dim7|maj9|min9|m9|dim9|maj13|min13|dim13|maj|min|dim|sus|m|7|9|11|13|add9)?\b/;
    return chordRegex.test(str);
  };

  const result = splitLyrics(lyrics);
  return (
    <>
      <ThemeProvider theme={theme}>
        <Box m={1} display="flex" justifyContent="right" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            sx={{ height: 40 }}
            onClick={handleEditClick}
          >
            Go Back
          </Button>
        </Box>
        <Box sx={{ height: "100vh", overflowY: "auto" }}>
          <Container maxWidth="xl">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: `${fontSize}em`,
                    marginTop: 2,
                    color: "deeppink",
                    lineHeight: "1.5em",
                  }}
                >
                  <Typography sx={{marginBottom: 4}}>
                  {result.intro.map((line, index) => (
                    <p key={index}>
                      {line.map((word, wordIndex) =>
                        word.isChord ? (
                          <span style={{ color: "red" }} key={wordIndex}>
                            {word.text}
                          </span>
                        ) : (
                          <Typography key={wordIndex}>
                            {word.text}
                          </Typography>
                        )
                      )}
                    </p>
                  ))}
                  </Typography>
                </Typography>
                <Typography sx={{marginBottom: 4}}>
                {result.verse.map((line, index) => (
                  <Typography variant="subtitle1" 
                  key={index} sx={{ 
                  fontSize: `${fontSize}em`, 
                  color: "blue", 
                  maxWidth: "80%", 
                  lineHeight: `${lineHeight}px`,
                  }}>
                    {line.map((word, wordIndex) => (
                        word.isChord ? (
                          <span style={{ color: "red", marginRight: 50 }} key={wordIndex}>
                            {word.text}
                          </span>
                        ) :
                      <span key={wordIndex}>
                        {word.text}{' '}
                      </span>
                    ))}
                  </Typography>
                ))}
                </Typography>
                <Typography sx={{marginBottom: 4}}>
                  {result.chorus1.map((line, index) => (
                  <Typography variant="subtitle1" 
                  key={index} sx={{ 
                  fontSize: `${fontSize}em`, 
                  color: "green", 
                  maxWidth: "80%", 
                  lineHeight: `${lineHeight}px`,
                  }}>
                    {line.map((word, wordIndex) => (
                        word.isChord ? (
                          <span style={{ color: "red", marginRight: 50 }} key={wordIndex}>
                            {word.text}
                          </span>
                        ) :
                      <span key={wordIndex}>
                        {word.text}{' '}
                      </span>
                    ))}
                  </Typography>
                ))}
                </Typography>
              </Grid>
              <Grid item xs={6}>
             <Typography sx={{marginBottom: 4}}>
                       {result.verse2.map((line, index) => (
                  <Typography variant="subtitle1" 
                  key={index} sx={{ 
                  fontSize: `${fontSize}em`, 
                  color: "blue", 
                  maxWidth: "80%", 
                  lineHeight: `${lineHeight}px`,
                  }}>
                    {line.map((word, wordIndex) => (
                        word.isChord ? (
                          <span style={{ color: "red", marginRight: 50 }} key={wordIndex}>
                            {word.text}
                          </span>
                        ) :
                      <span key={wordIndex}>
                        {word.text}{' '}
                      </span>
                    ))}
                  </Typography>
                ))}
                </Typography>
                <Typography sx={{marginBottom: 4}}>
                        {result.verse3.map((line, index) => (
                  <Typography variant="subtitle1" 
                  key={index} sx={{ 
                  fontSize: `${fontSize}em`, 
                  color: "blue", 
                  maxWidth: "80%", 
                  lineHeight: `${lineHeight}px`,
                  }}>
                    {line.map((word, wordIndex) => (
                        word.isChord ? (
                          <span style={{ color: "red", marginRight: 50 }} key={wordIndex}>
                            {word.text}
                          </span>
                        ) :
                      <span key={wordIndex}>
                        {word.text}{' '}
                      </span>
                    ))}
                  </Typography>
                ))}
                </Typography>
              <Typography sx={{marginBottom: 4}}>
                       {result.bridge.map((line, index) => (
                  <Typography variant="subtitle1" 
                  key={index} sx={{ 
                  fontSize: `${fontSize}em`, 
                  color: "purple", 
                  maxWidth: "80%", 
                  lineHeight: `${lineHeight}px`,
                  }}>
                    {line.map((word, wordIndex) => (
                        word.isChord ? (
                          <span style={{ color: "red", marginRight: 50 }} key={wordIndex}>
                            {word.text}
                          </span>
                        ) :
                      <span key={wordIndex}>
                        {word.text}{' '}
                      </span>
                    ))}
                  </Typography>
                ))}
                </Typography>
            <Typography sx={{marginBottom: 4}}>
                        {result.interlude.map((line, index) => (
                  <Typography variant="subtitle1" 
                  key={index} sx={{ 
                  fontSize: `${fontSize}em`, 
                  color: "cadetblue", 
                  maxWidth: "80%", 
                  lineHeight: `${lineHeight}px`,
                  }}>
                    {line.map((word, wordIndex) => (
                        word.isChord ? (
                          <span style={{ color: "red", marginRight: 50 }} key={wordIndex}>
                            {word.text}
                          </span>
                        ) :
                      <span key={wordIndex}>
                        {word.text}{' '}
                      </span>
                    ))}
                  </Typography>
                ))}
                </Typography>
              <Typography sx={{marginBottom: 4}}>
                         {result.outro.map((line, index) => (
                  <Typography variant="subtitle1" 
                  key={index} sx={{ 
                  fontSize: `${fontSize}em`, 
                  color: "orange", 
                  maxWidth: "80%", 
                  lineHeight: `${lineHeight}px`,
                  }}>
                    {line.map((word, wordIndex) => (
                        word.isChord ? (
                          <span style={{ color: "red", marginRight: 50 }} key={wordIndex}>
                            {word.text}
                          </span>
                        ) :
                      <span key={wordIndex}>
                        {word.text}{' '}
                      </span>
                    ))}
                  </Typography>
                ))}
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
      </ThemeProvider>
    </>
  );
};
export default LyricsDisplay;
