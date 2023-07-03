import { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Slider,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import NavBar from "./NavBar";

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
  const splitLyrics = (lyrics) => {
    let sections = {
      verse: [],
      chorus: [],
      bridge: [],
      intro: [],
      outro: [],
      pre: [],
    };

    let lines = lyrics.split("\n");
    let currentSection = "";

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (
        line.startsWith("[Verse") ||
        line.startsWith("[Chorus") ||
        line.startsWith("[Bridge") ||
        line.startsWith("[Intro") ||
        line.startsWith("[Outro") ||
        line.startsWith("[Pre") ||
        line.startsWith("[Interlude")
      ) {
        currentSection = line.substring(1, line.indexOf("]")).toLowerCase();
      } else {
        let words = line
          .split(" ")
          .map((word) => ({ text: word, isChord: isChord(word) }));

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

  const processLine = (line) => {
    return line.split(" ").map((word, index) => {
      if (isChord(word)) {
        return (
          <span key={index}>
            {word}
          </span>
        );
      } else {
        return (
          <span key={index}>
            {word}
          </span>
        );
      }
    });
  };

  const result = splitLyrics(lyrics);

  const [fontSize, setFontSize] = useState(1);
  const [lineHeight, setLineHeight] = useState(5);

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
            <Grid container spacing={4}>
              <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: `${fontSize}em`,
                      marginTop: 2,
                      color: "deeppink",
                      lineHeight: `${lineHeight}px`,
                    }}
                  >
                    Intro:
                    {result.intro.map((line, index) => (
                      <p key={index}>
                        {line.map((word, wordIndex) =>
                          word.isChord ? (
                            <span style={{ color: "red" }} key={wordIndex}>
                              {word.text}
                            </span>
                          ) : (
                            <span
                              style={{ marginRight: "4px" }}
                              key={wordIndex}
                            >
                              {word.text}
                            </span>
                          )
                        )}
                      </p>
                    ))}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: `${fontSize}em`,
                      marginTop: 2,
                      color: "blue",
                      lineHeight: `${lineHeight}px`,
                    }}
                  >
                    Verse:
                    {result.verse.map((line, index) => (
                      <p key={index}>
                        {line.map((word, wordIndex) =>
                          word.isChord ? (
                            <span style={{ color: "red" }} key={wordIndex}>
                              {word.text}
                            </span>
                          ) : (
                            <span
                              style={{ marginRight: "4px" }}
                              key={wordIndex}
                            >
                              {word.text}
                            </span>
                          )
                        )}
                      </p>
                    ))}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: `${fontSize}em`,
                      marginTop: 2,
                      color: "green",
                      lineHeight: `${lineHeight}px`,
                    }}
                  >
                    Chorus:
                    {result.chorus.map((line, index) => (
                      <p key={index}>
                        {line.map((word, wordIndex) =>
                          word.isChord ? (
                            <span style={{ color: "red" }} key={wordIndex}>
                              {word.text}
                            </span>
                          ) : (
                            <span
                              style={{ marginRight: "4px" }}
                              key={wordIndex}
                            >
                              {word.text}
                            </span>
                          )
                        )}
                      </p>
                    ))}
                  </Typography>
               
              </Grid>
              <Grid item xs={6}>
                <Typography
  variant="subtitle1"
  sx={{
    fontSize: `${fontSize}em`,
    marginTop: 2,
    color: "purple",
    lineHeight: `${lineHeight}px`
  }}
>
  Bridge:
  {result.bridge.map((line, index) => (
    <p key={index}>
      {line.map((word, wordIndex) =>
        word.isChord ? (
          <span style={{ color: "red" }} key={wordIndex}>{word.text}</span>
        ) : (
          <span
            style={{ marginRight: "4px" }}
            key={wordIndex}
          >
            {word.text}
          </span>
        )
      )}
    </p>
  ))}
</Typography>
<Typography
  variant="subtitle1"
  sx={{
    fontSize: `${fontSize}em`,
    marginTop: 2,
    color: "orange",
    lineHeight: `${lineHeight}px`
  }}
>
  Outro:
  {result.outro.map((line, index) => (
    <p key={index}>
      {line.map((word, wordIndex) =>
        word.isChord ? (
          <span style={{ color: "red" }} key={wordIndex}>{word.text}</span>
        ) : (
          <span
            style={{ marginRight: "4px" }}
            key={wordIndex}
          >
            {word.text}
          </span>
        )
      )}
    </p>
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
              <Slider
                value={fontSize}
                min={0.5}
                max={2}
                step={0.1}
                onChange={handleFontSizeChange}
                aria-labelledby="font-size-slider"
                sx={{ width: 200, marginLeft: 2, color: "white" }}
              />
              <Slider
                defaultValue={20}
                getAriaValueText={(value) => `${value}px`}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={2}
                max={50}
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
