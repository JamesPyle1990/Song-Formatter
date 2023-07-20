import { useState } from "react";
import { Container, Grid, Typography, Box, Button, Slider, AppBar, Toolbar, TextField } from "@mui/material";


const LyricsDisplay = ({ lyrics, showLyrics }) => {
  const [fontSize, setFontSize] = useState(1);
  const [lineHeight, setLineHeight] = useState(20);
  const [editMode, setEditMode] = useState(false);  // Add state for edit mode
  const [editedLyricsLeft, setEditedLyricsLeft] = useState(lyrics.slice(0, lyrics.length / 2));  
  const [editedLyricsRight, setEditedLyricsRight] = useState(lyrics.slice(lyrics.length / 2));  
  let newLyrics = editedLyricsLeft + '\n' + editedLyricsRight;
  

  const handleLineHeightChange = (event, newValue) => {
    setLineHeight(newValue);
  };

  const handleFontSizeChange = (event, newValue) => {
    setFontSize(newValue);
  };
  const handleEditClick = () => {
    setEditMode(true);  // Switch to edit mode when Edit button is clicked
  };

  const handleSaveClick = () => {
    setEditMode(false);
    setLyrics(editedLyricsLeft + '\n' + editedLyricsRight);
  };

  const handleLyricsChangeLeft = (event) => {
    const newValue = event.target.value.replace(/\n{2,}/g, '\n');  // Replace multiple newlines with a single newline
    setEditedLyricsLeft(newValue);
  };

  const handleLyricsChangeRight = (event) => {
    const newValue = event.target.value.replace(/\n{2,}/g, '\n');  // Replace multiple newlines with a single newline
    setEditedLyricsRight(newValue);
  };



  if (!showLyrics) {
    return null; // Don't render anything if showLyrics is false
  }

  

  const splitLyrics = (lyrics) => {
    const isChord = (str) => {
      const chordRegex =
        /\b[A-G][#b.]?(maj7#11|13|sus2|sus4|m7|#11|maj7|min7|dim7|maj9|min9|m9|dim9|maj13|min13|dim13|maj|min|dim|sus|m|7|9|11|13|add9)?\b/;
      return chordRegex.test(str);
    };

    let sections = {};
    let lines = lyrics.split("\n");
    let currentSection = "";
    let matchesArray = [];
    let sectionCounts = {};

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      let match = line.match(/\[(.*?)\]/);


      if (match) {
        currentSection = match[1].toLowerCase().replace(" ", "");
        // If the section has already been encountered, append an index to it
        if (sections[currentSection]) {
          if (sectionCounts[currentSection]) {
            sectionCounts[currentSection] += 1;
          } else {
            sectionCounts[currentSection] = 1;
          }
          currentSection += sectionCounts[currentSection];
        }
      } else {
        let words = line
          .split(" ")
          .map((word) => ({ text: word, isChord: isChord(word) }));

        if (!sections[currentSection]) {
          sections[currentSection] = [];
        }
        sections[currentSection].push(words);
      }
    }

    const colors = ["pink", "blue", "green", "orange", "purple"];

    const sectionKeys = Object.keys(sections);
    const midpoint = Math.ceil(sectionKeys.length / 2);

    const firstHalf = sectionKeys.slice(0, midpoint);
    console.log("First Half " + firstHalf);
    const secondHalf = sectionKeys.slice(midpoint);

    const renderedSections = {};

    let sectionColors = {
      verse: "DarkSlateBlue",
      chorus: "DarkGreen",
      pre: "DeepPink",
      bridge: "DarkViolet",
    };


    let defaultColors = ["DarkOrange", "DarkCyan"];
    let defaultColorIndex = 0;

    const renderSection = (sectionKeys, color) => (
      <>
      {sectionKeys.map((sectionKey, index) => {
      // Split the sectionKey to get the actual section name without the index
      const [actualSectionKey] = sectionKey.split(/\d/);

      // Get the content of the current section as a string
      const sectionContent = sections[sectionKey].map(line => line.map(word => word.text).join(' ')).join('\n');

      // If this is a section that contains "pre" or equals "chorus" and has already been rendered with the same content, skip it
      if ((actualSectionKey === "chorus" || actualSectionKey.includes("pre")) && renderedSections[actualSectionKey] && renderedSections[actualSectionKey] === sectionContent) {
        return null;
      }

      // Store the section and its content
      renderedSections[actualSectionKey] = sectionContent;

      // Get the color for the section type, default to the next color in the default colors array if the section type isn't in the object
      let sectionColor;
      if (sectionColors[actualSectionKey]) {
        sectionColor = sectionColors[actualSectionKey];
      } else {
        sectionColor = defaultColors[defaultColorIndex];
        defaultColorIndex = (defaultColorIndex + 1) % defaultColors.length;  // Increment the index, wrap back to 0 if it's past the end of the array
      }

      
          return (
            <div key={index}>
              <Typography variant="subtitle2" >
                {actualSectionKey.charAt(0).toUpperCase() + actualSectionKey.slice(1)}
              </Typography>
              {sections[sectionKey].map((line, lineIndex) => (
                <Typography
                  variant="h2"
                  key={lineIndex}
                  sx={{
                    fontSize: `${fontSize}em`,
                    color: sectionColor,
                    lineHeight: `${lineHeight}px`,
                  }}
                >
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
            </div>
          );
                    
        })}
      </>
    );


    return (
      <>
      
        <Box m={1} display="flex" justifyContent="right" alignItems="center">
        </Box>
        <Box sx={{ height: "100vh", overflowY: "auto" }}>
          <Container maxWidth="xl">
            <Grid container spacing={2}>
            { !editMode &&
              <Grid item xs={6}>
                <Typography sx={{ marginBottom: 4 }}>
                  {renderSection(firstHalf)}
                </Typography>
              </Grid>
  }
              { !editMode &&
              <Grid item xs={6}>
                {renderSection(secondHalf)}
              </Grid>
              }
              <Grid />
            </Grid>
  
            
      {editMode && (
        <Box display="flex">
          <TextField
            multiline
            value={editedLyricsLeft}
            onChange={handleLyricsChangeLeft}
          sx={{
            flex: 1,
              marginTop: 2, // Margin for the TextField
              marginBottom: 2, // Margin for the TextField
              '& .MuiInputBase-input': { // Styles for the input
                color: 'darkslateblue', // Text color
                fontSize: `${fontSize}em`, // Font size
                lineHeight: `${lineHeight}px` // Line height
              },
            }}
          />
          <TextField
            multiline
            value={editedLyricsRight}
            onChange={handleLyricsChangeRight}
            sx={{
              flex: 1,
              marginTop: 2, // Margin for the TextField
              marginBottom: 2, // Margin for the TextField
              '& .MuiInputBase-input': { // Styles for the input
                color: 'darkslateblue', // Text color
                fontSize: `${fontSize}em`, // Font size
                lineHeight: `${lineHeight}px` // Line height
              },
            }}
          />
        </Box>
      )}
         
  
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
                defaultValue={lineHeight}
                getAriaValueText={(value) => `${value}px`}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={0.25}
                min={10}
                max={35}
                onChange={handleLineHeightChange}
                sx={{ width: 200, marginLeft: 2, color: "white" }}
              />
              <Button variant="contained" color="primary" sx={{ height: 40, marginLeft:2 }} onClick={handleEditClick}>
            Edit
          </Button>
          <Button variant="contained" color="primary" sx={{ height: 40, marginLeft:2 }} onClick={handleSaveClick}>
            Save
          </Button>
            </Toolbar>
          </AppBar>
        </Box>
      </>
    );
  };

  const sectionComponent = splitLyrics(newLyrics);


  return (
    <>
      {sectionComponent}
    </>
  );
};
export default LyricsDisplay;
