import { useState, useRef } from "react";
import { Container, Grid, Typography, Box, Button, Slider, AppBar, Toolbar, TextField, Select, MenuItem, IconButton } from "@mui/material";
import html2pdf from 'html2pdf.js'

// --- pitch model (module scope) ---------------------------------------
const SHARP_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_NOTES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const NOTE_INDEX = {
  C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, "E#": 5, Fb: 4,
  F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10,
  B: 11, "B#": 0, Cb: 11,
};
// pitch classes whose conventional key spelling uses flats (Db Eb F Ab Bb)
const FLAT_PITCH_CLASSES = new Set([1, 3, 5, 8, 10]);
const mod12 = (n) => ((n % 12) + 12) % 12;

const LyricsDisplay = ({ lyrics, showLyrics }) => {
  // --- hooks (must run unconditionally, before any early return) ---
  const [fontSize, setFontSize] = useState(1);
  const [lineHeight, setLineHeight] = useState(20);
  const [editMode, setEditMode] = useState(false);
  const [songText, setSongText] = useState(lyrics);
  const [transpose, setTranspose] = useState(0); // semitone display offset
  const lyricsRef = useRef();

  const handleLineHeightChange = (event, newValue) => setLineHeight(newValue);
  const handleFontSizeChange = (event, newValue) => setFontSize(newValue);
  const handleEditClick = () => setEditMode(true);
  const handleSaveClick = () => setEditMode(false);
  const handleTextChange = (event) => setSongText(event.target.value);

  const handleDownloadClick = () => {
    const opt = {
      margin: 1,
      filename: 'myfile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().from(lyricsRef.current).set(opt).save();
  };

  if (!showLyrics) {
    return null;
  }

  // --- chord detection -------------------------------------------------
  // A single whitespace-delimited token that is a chord, optionally a slash
  // (inversion) chord like G/B. Anchored so the WHOLE token must be a chord.
  const isChordToken = (tok) =>
    /^[A-G][#b]?(maj7#11|maj7|min7|dim7|maj9|min9|m9|dim9|maj13|min13|dim13|sus2|sus4|sus|add9|m7|m|dim|maj|min|13|11|9|7)?(\/[A-G][#b]?)?$/.test(tok);

  // A line is a "chord line" if every token on it is a chord (UG puts these
  // directly above the lyric line they apply to, aligned by column).
  const isChordLine = (line) => {
    const toks = line.trim().split(/\s+/).filter(Boolean);
    return toks.length > 0 && toks.every(isChordToken);
  };

  // --- parse raw UG text into sections of rows -------------------------
  // Each row is { chords, lyric, blank }. A chord line is paired with the
  // following lyric line so they can be stacked (chord above lyric) while
  // preserving the original column positions via a monospace render.
  const parseSections = (text) => {
    const lines = text.split("\n");
    const sections = [];
    let current = null;
    const ensure = (name) => {
      current = { key: name, rows: [] };
      sections.push(current);
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const headerMatch = line.match(/\[(.*?)\]/);

      if (headerMatch) {
        ensure(headerMatch[1].toLowerCase().replace(/\s+/g, ""));
        continue;
      }

      if (!current) ensure(""); // stray content before any header

      if (line.trim() === "") {
        current.rows.push({ chords: "", lyric: "", blank: true });
        continue;
      }

      if (isChordLine(line)) {
        const next = lines[i + 1];
        const nextIsLyric =
          next !== undefined &&
          next.trim() !== "" &&
          !next.match(/\[(.*?)\]/) &&
          !isChordLine(next);
        if (nextIsLyric) {
          current.rows.push({ chords: line, lyric: next });
          i++; // consume the paired lyric line
        } else {
          current.rows.push({ chords: line, lyric: "" }); // instrumental
        }
      } else {
        current.rows.push({ chords: "", lyric: line }); // lyric, no chords above
      }
    }
    return sections;
  };

  // --- colors ----------------------------------------------------------
  const sectionColors = {
    verse: "DarkSlateBlue",
    chorus: "DarkGreen",
    pre: "DeepPink",
    bridge: "DarkViolet",
  };
  const defaultColors = ["DarkOrange", "DarkCyan", "SaddleBrown", "Teal"];
  const colorMap = {};
  let defaultColorIndex = 0;
  const colorFor = (base) => {
    if (sectionColors[base]) return sectionColors[base];
    if (!colorMap[base]) {
      colorMap[base] = defaultColors[defaultColorIndex % defaultColors.length];
      defaultColorIndex += 1;
    }
    return colorMap[base];
  };

  // base section name without trailing index ("verse1" -> "verse")
  const baseKey = (key) => key.split(/\d/)[0] || key;
  // human label ("verse1" -> "Verse 1", "chorus" -> "Chorus")
  const labelFor = (key) => {
    const spaced = key.replace(/(\d+)/, " $1");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  // --- build sections + balanced columns -------------------------------
  const sections = parseSections(songText);
  const totalRows = sections.reduce((n, s) => n + s.rows.length, 0);

  const leftSections = [];
  const rightSections = [];
  let acc = 0;
  for (const s of sections) {
    if (acc < totalRows / 2) {
      leftSections.push(s);
      acc += s.rows.length;
    } else {
      rightSections.push(s);
    }
  }

  // --- transpose -------------------------------------------------------
  // Original key = root of the first chord in the song (heuristic).
  const detectOriginalPc = () => {
    for (const s of sections) {
      for (const r of s.rows) {
        if (r.chords && r.chords.trim()) {
          const first = r.chords.trim().split(/\s+/)[0];
          const mm = first.match(/^([A-G][#b]?)/);
          if (mm && NOTE_INDEX[mm[1]] !== undefined) return NOTE_INDEX[mm[1]];
        }
      }
    }
    return 0;
  };
  const originalPc = detectOriginalPc();
  const targetPc = mod12(originalPc + transpose);
  // accidental spelling follows the target key's conventional signature
  const spell = FLAT_PITCH_CLASSES.has(targetPc) ? FLAT_NOTES : SHARP_NOTES;

  const transposeNote = (note) => spell[mod12(NOTE_INDEX[note] + transpose)];

  // transpose a single chord token, including a slash/inversion bass note
  const transposeToken = (tok) => {
    const m = tok.match(/^([A-G][#b]?)(.*)$/);
    if (!m || NOTE_INDEX[m[1]] === undefined) return tok;
    let [, root, rest] = m;
    let bass = null;
    const slash = rest.match(/^(.*)\/([A-G][#b]?)$/);
    if (slash && NOTE_INDEX[slash[2]] !== undefined) {
      rest = slash[1];
      bass = slash[2];
    }
    let out = transposeNote(root) + rest;
    if (bass) out += "/" + transposeNote(bass);
    return out;
  };

  // Re-emit a chord line, keeping each chord anchored to its original column
  // so it stays above the right syllable; only push right to avoid collisions.
  const transposeChordLine = (line) => {
    if (transpose === 0 || !line) return line;
    const re = /\S+/g;
    let m;
    let result = "";
    while ((m = re.exec(line)) !== null) {
      let target = m.index;
      if (result.length > 0 && target < result.length + 1) {
        target = result.length + 1; // keep at least one space between chords
      }
      while (result.length < target) result += " ";
      result += transposeToken(m[0]);
    }
    return result;
  };

  // dedup state — shared across both columns for a single render pass.
  // Repeated chorus / pre-chorus with identical lyrics are collapsed to a
  // marker so the song structure stays visible without eating page space.
  const seenContent = {};

  const renderRow = (row, rowIndex, color) => {
    if (row.blank) {
      return <div key={rowIndex} style={{ height: `${lineHeight * 0.5}px` }} />;
    }
    return (
      <div
        key={rowIndex}
        style={{
          fontFamily: "monospace",
          whiteSpace: "pre",
          fontSize: `${fontSize}em`,
          lineHeight: `${lineHeight}px`,
        }}
      >
        {row.chords !== "" && <div style={{ color: "red" }}>{transposeChordLine(row.chords)}</div>}
        {row.lyric !== "" && <div style={{ color }}>{row.lyric}</div>}
      </div>
    );
  };

  const renderSection = (section, index) => {
    const base = baseKey(section.key);
    const color = colorFor(base);
    const signature = section.rows.map((r) => r.lyric).join("\n").trim();
    const dedupable = base === "chorus" || base.includes("pre");

    if (dedupable && signature !== "" && seenContent[base] === signature) {
      // identical repeat — render a compact marker instead of the full block
      return (
        <div key={index}>
          <Typography variant="subtitle2" sx={{ color, fontStyle: "italic" }}>
            {labelFor(section.key)} ↻
          </Typography>
        </div>
      );
    }
    if (dedupable) seenContent[base] = signature;

    return (
      <div key={index}>
        <Typography variant="subtitle2">{labelFor(section.key)}</Typography>
        {section.rows.map((row, rowIndex) => renderRow(row, rowIndex, color))}
      </div>
    );
  };

  const renderColumn = (cols) => <>{cols.map((s, i) => renderSection(s, i))}</>;

  return (
    <>
      <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ padding: "1rem" }}>
        <Container maxWidth="xl">
          {!editMode && (
            <div ref={lyricsRef}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ marginBottom: 4 }}>{renderColumn(leftSections)}</Box>
                </Grid>
                <Grid item xs={6}>
                  {renderColumn(rightSections)}
                </Grid>
              </Grid>
            </div>
          )}

          {editMode && (
            <TextField
              multiline
              fullWidth
              value={songText}
              onChange={handleTextChange}
              sx={{
                marginTop: 2,
                marginBottom: 2,
                '& .MuiInputBase-input': {
                  fontFamily: 'monospace',
                  whiteSpace: 'pre',
                  color: 'darkslateblue',
                  fontSize: `${fontSize}em`,
                  lineHeight: `${lineHeight}px`,
                },
              }}
            />
          )}
        </Container>
      </Box>

      <Box>
        <AppBar position="fixed" color="secondary" sx={{ top: "auto", bottom: 0 }}>
          <Toolbar>
            <Typography variant="subtitle1"> Font Size</Typography>
            <Slider
              value={fontSize}
              min={0.5}
              max={2}
              step={0.1}
              onChange={handleFontSizeChange}
              aria-labelledby="font-size-slider"
              sx={{ width: 200, marginLeft: 2, marginRight: 5, color: "white" }}
            />
            <Typography variant="subtitle1"> Line Height</Typography>
            <Slider
              value={lineHeight}
              getAriaValueText={(value) => `${value}px`}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={0.25}
              min={10}
              max={35}
              onChange={handleLineHeightChange}
              sx={{ width: 200, marginLeft: 2, color: "white" }}
            />
            <Typography variant="subtitle1" sx={{ marginLeft: 4 }}> Key</Typography>
            <IconButton
              size="small"
              onClick={() => setTranspose((t) => Math.max(-11, t - 1))}
              sx={{ color: "white", marginLeft: 1 }}
              aria-label="transpose down"
            >
              &#9837;
            </IconButton>
            <Select
              value={targetPc}
              onChange={(e) => setTranspose(mod12(e.target.value - originalPc))}
              size="small"
              sx={{ color: "white", minWidth: 70, height: 36, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '& .MuiSvgIcon-root': { color: 'white' } }}
            >
              {spell.map((name, pc) => (
                <MenuItem key={pc} value={pc}>{name}</MenuItem>
              ))}
            </Select>
            <IconButton
              size="small"
              onClick={() => setTranspose((t) => Math.min(11, t + 1))}
              sx={{ color: "white", marginRight: 1 }}
              aria-label="transpose up"
            >
              &#9839;
            </IconButton>
            <Typography variant="caption" sx={{ minWidth: 32 }}>
              {transpose > 0 ? `+${transpose}` : transpose}
            </Typography>

            <Button variant="contained" color="primary" sx={{ height: 40, marginLeft: 2 }} onClick={handleEditClick}>
              Edit
            </Button>
            <Button variant="contained" color="primary" sx={{ height: 40, marginLeft: 2 }} onClick={handleSaveClick}>
              Save
            </Button>
            <Button variant="contained" color="primary" sx={{ height: 40, marginLeft: 2 }} onClick={handleDownloadClick}>
              Download
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default LyricsDisplay;
