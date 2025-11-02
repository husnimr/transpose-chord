import { useState } from "react";
import { CHORDS } from "../data/chords";

export default function ChordOutput({ html, darkMode, fontSize }) {
  const [hoveredChord, setHoveredChord] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const wrappedHtml = (html || "")
    .replace(
      /(^|[\s>])([A-G](?:#|b)?(?:maj7|Maj7|m7|m|sus2|sus4|add9|dim7|dim|aug|7|6|9|11|13)?(?:\/[A-G](?:#|b)?)?)(?=$|[\s<])/g,
      (match, prefix, chord) =>
        `${prefix}<span class="chord-span cursor-pointer font-semibold ${
          darkMode ? "text-pink-400" : "text-pink-600"
        }" data-chord="${chord}">${chord}</span>`
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
        className={`p-4 border rounded-md whitespace-pre-wrap font-mono text-sm transition-colors duration-300 ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-200"
            : "bg-gray-50 border-gray-200 text-gray-900"
        }`}
        onMouseOver={handleMouseEnter}
        onMouseOut={handleMouseLeave}
        style={{ fontSize: `${fontSize}px` }}
        dangerouslySetInnerHTML={{ __html: wrappedHtml }}
      />

      {hoveredChord && (
        <div
          className={`fixed z-50 rounded-md shadow-md p-2 transition-colors duration-300 ${
            darkMode
              ? "bg-gray-900 border border-gray-600 text-gray-100"
              : "bg-white border border-gray-400 text-gray-900"
          }`}
          style={{
            top: tooltipPos.y,
            left: tooltipPos.x,
          }}
        >
          <ChordDiagram chord={hoveredChord} darkMode={darkMode} />
        </div>
      )}
    </div>
  );
}

function ChordDiagram({ chord, darkMode }) {
  const data = CHORDS[chord];
  if (!data)
    return (
      <div className={darkMode ? "text-red-400" : "text-red-600"}>
        Diagram not found
      </div>
    );

  const strings = ["E", "A", "D", "G", "B", "E"];
  const fretCount = 5;
  const frets = data.fret;

  // grid default
  const grid = Array.from({ length: strings.length }, () =>
    Array.from({ length: fretCount }, () => "---")
  );

  frets.forEach((pos, i) => {
    if (pos > 0 && pos <= fretCount) {
      const idx = fretCount - pos;
      grid[i][idx] = "-●-";
    }
  });

  const lines = strings.map((s, i) => {
    const row = "|" + grid[i].join("|") + "|";
    const pos = frets[i];
    let suffix;
    if (pos === -1) suffix = `X ${s}`;
    else if (pos === 0) suffix = `O ${s}`;
    else suffix = `| ${s}`;
    return `${row} ${suffix}`;
  });

  return (
    <div>
      {data.note && (
        <div
          className={`text-[12px] text-center font-mono mb-1 transition-colors duration-300 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {data.note}
        </div>
      )}
      <pre
        className={`text-[10px] font-mono leading-[10px] whitespace-pre transition-colors duration-300 ${
          darkMode ? "text-gray-100" : "text-black"
        }`}
      >
        {lines.join("\n")}
      </pre>
    </div>
  );
}
