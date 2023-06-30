import { useState } from 'react';
import { Container, Grid, Typography, Box, Button, Slider, AppBar, Toolbar } from '@mui/material';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import NavBar from './NavBar';


let theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1024, // our custom breakpoint
      xl: 1920,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#513466',
    },
    secondary: {
      main: '#0f0f12',
    },
    text: {
      secondary: '#ffffff',
    },
  },
  props: {
    MuiAppBar: {
      color: 'secondary',
    },
  },
});
theme = responsiveFontSizes(theme);

const LyricsDisplay = ({ lyrics, showLyrics, setShowLyrics }) => {
  const splitLyrics = (lyrics) => {
    let sections = {
      verse: { chords: "", lyrics: "" },
      chorus: { chords: "", lyrics: "" },
      bridge: { chords: "", lyrics: "" },
      intro: { chords: "", lyrics: "" },
      outro: { chords: "", lyrics: "" },
      pre: { chords: "", lyrics: "" },
    };

    let lines = lyrics.split("\n");
    let currentSection = "";

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (line.startsWith("[Verse") || line.startsWith("[Chorus") || line.startsWith("[Bridge") ||
        line.startsWith("[Intro") || line.startsWith("[Outro") || line.startsWith("[Pre")) {
        currentSection = line;
      } else {
        let chordMatch = line.match(/((\b[A-GN][#b.]?(maj7#11|13|sus2|sus4|m7|#11|maj7|min7|dim7|maj9|min9|m9|dim9|maj13|min13|dim13|maj|min|dim|sus|m|7|9|11|13|add9)?)+(?:[ \t]*))+$/gm);

        let chords = chordMatch ? chordMatch.join(" ") : "";
        let lyrics = line.replace(chords, '').trim();

        switch (true) {
          case currentSection.startsWith("[Verse"):
            sections.verse.chords += chords + "\n";
            sections.verse.lyrics += lyrics + "\n";
            break;
          case currentSection.startsWith("[Chorus"):
            sections.chorus.chords += chords + "\n";
            sections.chorus.lyrics += lyrics + "\n";
            break;
          case currentSection.startsWith("[Bridge"):
            sections.bridge.chords += chords + "\n";
            sections.bridge.lyrics += lyrics + "\n";
            break;
          case currentSection.startsWith("[Intro"):
            sections.intro.chords += chords + "\n";
            sections.intro.lyrics += lyrics + "\n";
            break;
          case currentSection.startsWith("[Outro"):
            sections.outro.chords += chords + "\n";
            sections.outro.lyrics += lyrics + "\n";
            break;
          case currentSection.startsWith("[Pre"):
            sections.pre.chords += chords + "\n";
            sections.pre.lyrics += lyrics + "\n";
            break;
        }
      }
    }

    return sections;
  };

  const result = splitLyrics(lyrics);

  const [fontSize, setFontSize] = useState(1);

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
        <Box
          m={1}
          display="flex"
          justifyContent="right"
          alignItems="center"
        >
          <Button variant="contained" color="primary" sx={{ height: 40 }} onClick={handleEditClick}>
            Go Back
          </Button>
        </Box>
        <Box>
          <Container maxWidth="xl">
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Box>
                  <Typography variant="subtitle1" sx={{
                    fontSize: `${fontSize}em`,
                    marginTop: 2,
                    color: "deeppink"
                  }}>Intro: {result.intro.lyrics}</Typography>
                  <Typography variant="subtitle1" color="cadetblue" sx={{
                    fontSize: `${fontSize}em`,
                    marginTop: 2
                  }}>Verse: {result.verse.lyrics}</Typography>
                  <Typography variant="subtitle1" color="green" sx={{
                    fontSize: `${fontSize}em`,
                    marginTop: 2
                  }}>Pre-Chorus: {result.pre.lyrics}</Typography>
                  <Typography variant="subtitle1" color="green" sx={{
                    fontSize: `${fontSize}em`,
                    marginTop: 2
                  }}>Chorus: {result.chorus.lyrics}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="purple" sx={{
                  fontSize: `${fontSize}em`,
                  marginTop: 2
                }}>Bridge: {result.bridge.lyrics}</Typography>
                <Typography variant="subtitle1" color="orange" sx={{
                  fontSize: `${fontSize}em`,
                  marginTop: 2
                }}>Outro: {result.outro.lyrics}</Typography>
              </Grid>
              <Grid />
            </Grid>
          </Container>
        </Box>
     
      <Box>
        <AppBar position="fixed" color="secondary" sx={{ top: 'auto', bottom: 0 }}>
          <Toolbar>
            <Slider
              value={fontSize}
              min={0.5}
              max={2}
              step={0.1}
              onChange={handleFontSizeChange}
              aria-labelledby="font-size-slider"
              sx={{ width: 200, marginLeft: 2, color: 'white' }}
            />
          </Toolbar>
        </AppBar>
      </Box>
      </ThemeProvider>
    </>
  );
};
export default LyricsDisplay;