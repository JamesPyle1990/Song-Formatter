import { Container, Grid, Typography, Box} from '@mui/material';

const LyricsDisplay = ({ lyrics, showLyrics, setShowLyrics}) => {
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

    const handleEditClick = () => {
      setShowLyrics(false); // Hide lyrics and show text field when Edit button is clicked
    };
  
    if (!showLyrics) {
      return null; // Don't render anything if showLyrics is false
    }
  
    return (
      <Box>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography variant="h6" color="deeppink" sx={{ marginTop: 2 }}>Intro: {result.intro.lyrics}</Typography>
              <Typography variant="h6" color="cadetblue" sx={{ marginTop: 2 }}>Verse: {result.verse.lyrics}</Typography>
              <Typography variant="h6" color="green" sx={{ marginTop: 2 }}>Pre-Chorus: {result.pre.lyrics}</Typography>
              <Typography variant="h6" color="green" sx={{ marginTop: 2 }}>Chorus: {result.chorus.lyrics}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" color="purple" sx={{ marginTop: 2 }}>Bridge: {result.bridge.lyrics}</Typography>
              <Typography variant="h6" color="orange" sx={{ marginTop: 2 }}>Outro: {result.outro.lyrics}</Typography>
            </Grid>
            <Grid />
          </Grid>
          <button type="button" onClick={handleEditClick}>Edit</button>
        </Container>
      </Box>
    );
  };
  export default LyricsDisplay;