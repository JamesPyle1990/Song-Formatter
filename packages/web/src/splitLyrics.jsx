import Typography from "@mui/material/Typography";
export const splitLyrics = (lyrics, fontSize = 1, lineHeight = 15,) => {
    const isChord = (str) => {
      const chordRegex =
        /\b[A-G][#b.]?(maj7#11|13|sus2|sus4|m7|#11|maj7|min7|dim7|maj9|min9|m9|dim9|maj13|min13|dim13|maj|min|dim|sus|m|7|9|11|13|add9)?\b/;
      return chordRegex.test(str);
    };
  
    let sections = {};
    let lines = lyrics.split("\n");
    let currentSection = "";
  
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
  
      let match = line.match(/\[(.*?)\]/);
      if (match) {
        currentSection = match[1].toLowerCase().replace(" ", "");
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

    const colors = ["pink", "blue", "green", "orange", "purple"]; 

    const sectionKeys = Object.keys(sections);
    const midpoint = Math.ceil(sectionKeys.length / 2);
  
    const firstHalf = sectionKeys.slice(0, midpoint);
    console.log("First Half " + firstHalf);
    const secondHalf = sectionKeys.slice(midpoint);

    const renderSection = (sectionKeys, color) => (
        <>
          {sectionKeys.map((sectionKey, index) => (
            <div key={index}>
              <span>This is the {sectionKey} section</span>
              {sections[sectionKey].map((line, lineIndex) => (
                <Typography 
                  variant="subtitle1" 
                  key={lineIndex} 
                  sx={{ 
                    fontSize: `${fontSize}em`, 
                    color: color, 
                    lineHeight: `${lineHeight}px`
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
          ))}
        </>
      );

    return (
        <>
        {Object.keys(sections).map((section, index) => (
          <div key={index}>
            <span>This is the {section} section</span>
            {sections[section].map((line, lineIndex) => (
              <Typography 
                variant="subtitle1" 
                key={lineIndex} 
                sx={{ 
                  fontSize: `${fontSize}em`, 
                  color: colors[index % colors.length], 
                  lineHeight: `${lineHeight}px`
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
        ))}
      </>
    );
  };
  