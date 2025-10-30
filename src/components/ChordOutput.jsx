// ChordOutput.jsx
import { useState } from "react";

const CHORDS = {
  A: { fret: [-1, 0, 2, 2, 2, 0], note: "" },
  Am: { fret: [-1, 0, 2, 2, 1, 0], note: "" },
  "A#": { fret: [-1, 1, 3, 3, 3, 1], note: "" },
  "A#m": { fret: [-1, 1, 3, 3, 2, 1], note: "" },
  B: { fret: [-1, 2, 4, 4, 4, 2], note: "" },
  Bm: { fret: [-1, 2, 4, 4, 3, 2], note: "" },
  C: { fret: [-1, 3, 2, 0, 1, 0], note: "" },
  Cm: { fret: [-1, 3, 5, 5, 4, 3], note: "" },
  "C#": { fret: [-1, 1, 3, 3, 3, 1], note: "Mulai dari fret 4" },
  "C#m": { fret: [-1, 1, 3, 3, 2, 1], note: "Mulai dari fret 4" },
  D: { fret: [-1, -1, 0, 2, 3, 2], note: "" },
  Dm: { fret: [-1, -1, 0, 2, 3, 1], note: "" },
  "D#": { fret: [-1, -1, 1, 3, 4, 3], note: "" },
  "D#m": { fret: [-1, -1, 1, 3, 4, 2], note: "" },
  E: { fret: [0, 2, 2, 1, 0, 0], note: "" },
  Em: { fret: [0, 2, 2, 0, 0, 0], note: "" },
  F: { fret: [1, 3, 3, 2, 1, 1], note: "" },
  Fm: { fret: [1, 3, 3, 1, 1, 1], note: "" },
  "F#": { fret: [2, 4, 4, 3, 2, 2], note: "" },
  "F#m": { fret: [2, 4, 4, 2, 2, 2], note: "" },
  G: { fret: [3, 2, 0, 0, 3, 3], note: "" },
  Gm: { fret: [3, 5, 5, 3, 3, 3], note: "" },
  "G#": { fret: [1, 3, 3, 2, 1, 1], note: "Mulai dari fret 4" },
  "G#m": { fret: [1, 3, 3, 1, 1, 1], note: "Mulai dari fret 4" },
  "A#": { fret: [-1, 1, 3, 3, 3, 1], note: "" },
  "A#m": { fret: [-1, 1, 3, 3, 2, 1], note: "" },
};

export default function ChordOutput({ html }) {
  const [hoveredChord, setHoveredChord] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const wrappedHtml = (html || "")
    .replace(
      /([A-G](?:#|b)?m?(?:maj7|dim7|sus4|sus2|7|6|9|add9|aug|dim)?)/g,
      `<span class="chord-span cursor-pointer text-pink-600 font-semibold" data-chord="$1">$1</span>`
    )
    .replace(/\n/g, "<br/>");

  function handleMouseEnter(e) {
    const chord = e.target.getAttribute("data-chord");
    if (chord && CHORDS[chord]) {
      const rect = e.target.getBoundingClientRect();
      setTooltipPos({
        x: rect.right + 8,
        y: rect.top - 5,
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
        className="p-4 bg-gray-50 border rounded-md whitespace-pre-wrap font-mono text-sm"
        onMouseOver={handleMouseEnter}
        onMouseOut={handleMouseLeave}
        dangerouslySetInnerHTML={{ __html: wrappedHtml }}
      />

      {hoveredChord && (
        <div
          className="fixed z-50 bg-white border border-gray-400 rounded-md shadow-md p-2"
          style={{
            top: tooltipPos.y,
            left: tooltipPos.x,
          }}
        >
          <ChordDiagram chord={hoveredChord} />
        </div>
      )}
    </div>
  );
}

function ChordDiagram({ chord }) {
  const data = CHORDS[chord];
  if (!data) return <div className="text-red-600">Diagram not found</div>;

  const strings = ["E", "A", "D", "G", "B", "E"];
  const fretCount = 5;
  const frets = data.fret;

  // grid default --- per kolom
  const grid = Array.from({ length: strings.length }, () =>
    Array.from({ length: fretCount }, () => "---")
  );

  // isi titik sesuai aturan: index = fretCount - fret (fret1 => idx = 4)
  frets.forEach((pos, i) => {
    if (pos > 0 && pos <= fretCount) {
      const idx = fretCount - pos;
      grid[i][idx] = "-●-";
    }
    // pos === 0 atau -1 akan ditangani di suffix
  });

  // format baris: leading | + kolom + trailing | + suffix
  const lines = strings.map((s, i) => {
    const row = "|" + grid[i].join("|") + "|";
    const pos = frets[i];
    let suffix;
    if (pos === -1) suffix = `X ${s}`; // mute di akhir
    else if (pos === 0) suffix = `O ${s}`; // open di akhir
    else suffix = `| ${s}`; // normal -> tampilkan pipe + spasi + nota
    return `${row} ${suffix}`;
  });

  return (
    <div>
      {data.note && (
        <div className="text-[9px] text-center font-mono mb-1 text-gray-700">
          {data.note}
        </div>
      )}
      <pre className="text-[10px] font-mono leading-[10px] whitespace-pre text-black">
        {lines.join("\n")}
      </pre>
    </div>
  );
}