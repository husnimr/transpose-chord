import { useState } from "react";

export const CHORDS = {
  C: [0, 3, 2, 0, 1, 0],
  Cm: [null, 3, 1, 0, 1, 3],
  C7: [0, 3, 2, 3, 1, 0],

  D: [null, null, 0, 2, 3, 2],
  Dm: [null, null, 0, 2, 3, 1],
  D7: [null, null, 0, 2, 1, 2],

  E: [0, 2, 2, 1, 0, 0],
  Em: [0, 2, 2, 0, 0, 0],
  E7: [0, 2, 0, 1, 0, 0],

  F: [1, 3, 3, 2, 1, 1],
  Fm: [1, 3, 3, 1, 1, 1],
  F7: [1, 3, 1, 2, 1, 1],

  G: [3, 2, 0, 0, 0, 3],
  Gm: [3, 1, 0, 0, 3, 3],
  G7: [3, 2, 0, 0, 0, 1],

  A: [null, 0, 2, 2, 2, 0],
  Am: [null, 0, 2, 2, 1, 0],
  A7: [null, 0, 2, 0, 2, 0],

  B: [null, 2, 4, 4, 4, 2],
  Bm: [null, 2, 4, 4, 3, 2],
  B7: [null, 2, 1, 2, 0, 2],

  // Chord gantung / #
  "C#": [null, 4, 6, 6, 6, 4],
  "C#m": [null, 4, 6, 6, 5, 4],
  "D#": [null, 6, 8, 8, 8, 6],
  "D#m": [null, 6, 8, 8, 7, 6],
  "F#": [2, 4, 4, 3, 2, 2],
  "F#m": [2, 4, 4, 2, 2, 2],
  "G#": [4, 6, 6, 5, 4, 4],
  "G#m": [4, 6, 6, 4, 4, 4],
  "A#": [null, 1, 3, 3, 3, 1],
  "A#m": [null, 1, 3, 3, 2, 1],
};

export default function ChordOutput({ html }) {
  const [hoveredChord, setHoveredChord] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // ✅ FIXED regex — hilangkan \b supaya # tidak diputus
  const wrappedHtml = (html || "")
    .split("\n")
    .map((line) =>
      line.replace(
        /([A-G](?:#|b)?m?(?:maj7|dim7|sus4|sus2|7|6|9|add9|aug|dim)?)/g,
        `<span class="chord-output cursor-pointer text-pink-600 font-semibold" data-chord="$1">$1</span>`
      )
    )
    .join("<br/>");

  function handleMouseEnter(e) {
    const chord = e.target.getAttribute("data-chord");
    if (chord && CHORDS[chord]) {
      const rect = e.target.getBoundingClientRect();
      setTooltipPos({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
      setHoveredChord(chord);
    }
  }

  function handleMouseLeave() {
    setHoveredChord(null);
  }

  return (
    <div className="relative">
      <div
        className="OutputChordHusni bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm border border-gray-300"
        onMouseOver={handleMouseEnter}
        onMouseOut={handleMouseLeave}
        dangerouslySetInnerHTML={{ __html: wrappedHtml }}
      />

      {hoveredChord && (
        <div
          className="fixed z-50 bg-white border border-gray-400 rounded-md shadow-md p-2 text-[10px] leading-[10px] font-mono text-black"
          style={{
            top: tooltipPos.y - 5,
            left: tooltipPos.x + 15, // geser dikit kanan
            transform: "translate(-50%, -100%)",
          }}
        >
          <ChordDiagram chord={hoveredChord} />
        </div>
      )}
    </div>
  );
}

function ChordDiagram({ chord }) {
  const strings = ["E", "A", "D", "G", "B", "E"];
  const frets = CHORDS[chord];
  if (!frets) return null;

  const fretCount = 5;
  const grid = Array.from({ length: strings.length }, () =>
    Array.from({ length: fretCount }, () => "---")
  );

  frets.forEach((fret, i) => {
    if (fret > 0 && fret <= fretCount) {
      const idx = fretCount - fret;
      grid[i][idx] = "-●-";
    }
  });

  const lines = grid.map((row, i) => `${row.join("|")}|| ${strings[i]}`);

  const playable = frets.filter((f) => f !== null && f > 0);
  const minFret = Math.min(...playable);
  const showLabel = minFret > 3;

  return (
    <div>
      {showLabel && (
        <div className="text-[9px] font-mono text-center mb-1">
          Mulai dari fret {minFret}
        </div>
      )}
      <pre className="text-[10px] font-mono text-black leading-[10px] whitespace-pre">
        {lines.join("\n")}
      </pre>
    </div>
  );
}
