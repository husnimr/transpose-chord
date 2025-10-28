// src/utils/transposeUtils.js
// Logic ported from your original jQuery plugin (names and behavior preserved)

export const keys = [
  { name: 'Ab', value: 0, type: 'F' }, { name: 'A', value: 1, type: 'N' },
  { name: 'A#', value: 2, type: 'S' }, { name: 'Bb', value: 2, type: 'F' },
  { name: 'B', value: 3, type: 'N' }, { name: 'C', value: 4, type: 'N' },
  { name: 'C#', value: 5, type: 'S' }, { name: 'Db', value: 5, type: 'F' },
  { name: 'D', value: 6, type: 'N' }, { name: 'D#', value: 7, type: 'S' },
  { name: 'Eb', value: 7, type: 'F' }, { name: 'E', value: 8, type: 'N' },
  { name: 'F', value: 9, type: 'N' }, { name: 'F#', value: 10, type: 'S' },
  { name: 'Gb', value: 10, type: 'F' }, { name: 'G', value: 11, type: 'N' },
  { name: 'G#', value: 0, type: 'S' }
];

// same defaults from your plugin
export const chordRegex = /^[A-G][b\#]?(2|4|5|6|7|9|11|13|6\/9|7b5|7b9|7sus2|7sus4|add9|aug|dim|dim7|m|maj7|sus4)*(\/[A-G][b\#]*)*$/;
export const chordReplaceRegex = /([A-G][b\#]?(2|4|5|6|7|9|11|13|6\/9|7b5|7b9|7sus2|7sus4|add9|aug|dim|dim7|m|maj7|sus4)*)/g;

export function getKeyByName(name) {
  if (!name) return keys.find(k => k.name === 'C');
  if (name.charAt(name.length-1) === 'm') name = name.substring(0, name.length-1);
  return keys.find(k => k.name === name) || keys.find(k => k.name === 'C');
}

export function getChordRoot(input) {
  if (!input || input.length === 0) return '';
  return (input.length > 1 && (input[1] === 'b' || input[1] === '#')) ? input.substr(0,2) : input.substr(0,1);
}

export function getNewKey(oldKey, delta) {
  const base = getKeyByName(oldKey);
  if (!base) return { name: oldKey };
  let keyValue = base.value + delta;
  if (keyValue > 11) keyValue -= 12;
  else if (keyValue < 0) keyValue += 12;

  // deteksi apakah chord aslinya pakai flat atau sharp
  const prefersSharp = oldKey.includes("#");
  const prefersFlat = oldKey.includes("b");

  let result;
  if (prefersSharp) {
    result = keys.find(k => k.value === keyValue && k.type === "S");
  } else if (prefersFlat) {
    result = keys.find(k => k.value === keyValue && k.type === "F");
  } else {
    // kalau natural, prioritaskan sharp supaya G → G#
    result = keys.find(k => k.value === keyValue && k.type === "S")
      || keys.find(k => k.value === keyValue && k.type === "N")
      || keys.find(k => k.value === keyValue);
  }

  return result || keys.find(k => k.value === keyValue);
}


export function getDelta(oldIndex, newIndex) {
  return newIndex - oldIndex;
}

// transpose a single chord text (e.g. "C#m7" or "Am")
export function transposeChordText(chordText, delta) {
  const root = getChordRoot(chordText);
  if (!root) return chordText;
  const newRoot = getNewKey(root, delta);
  if (!newRoot) return chordText;
  return newRoot.name + chordText.substr(root.length);
}

// transpose HTML string that has <span class="chord-output">CHORD</span>
// returns new HTML string with inner chord texts replaced
export function transposeHtmlSpans(htmlString, delta) {
  if (!htmlString || delta === 0) return htmlString;
  // match spans containing chord text (non-greedy)
  return htmlString.replace(/<span class="chord-output">([^<]*)<\/span>/g, (m, chord) => {
    const newChord = transposeChordText(chord, delta);
    return `<span class="chord-output">${newChord}</span>`;
  });
}

// create display HTML from a raw textarea input (wrap chords in chord-output spans)
// This mirrors behavior of plugin: it splits lines, detects chord-lines using isChordLine, and wraps chords via chordReplaceRegex
export function buildDisplayHtmlFromText(text, startKey = 'C') {
  if (typeof text !== 'string') return '';
  const lines = text.split(/\r?\n/);
  const start = getKeyByName(startKey);
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // replicate plugin's isChordLine behavior:
    let tokens = line.replace(/\s+/, " ").split(" ");
    let allChord = true;
    for (let j = 0; j < tokens.length; j++) {
      if (tokens[j].trim().length && !tokens[j].match(chordRegex)) {
        allChord = false;
        break;
      }
    }
    if (allChord && line.trim().length) {
      // wrap chords in span using chordReplaceRegex (same as plugin)
      const wrapped = line.replace(chordReplaceRegex, "<span class=\"chord-output\">$1</span>");
      out.push(`<span>${wrapped}</span>`);
    } else {
      // non-chord line — escape HTML to preserve text and wrap in span
      out.push(`<span>${escapeHtml(line)}</span>`);
    }
  }

  return out.join("\n");
}

function escapeHtml(s) {
  if (!s) return s;
  return s.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
}
