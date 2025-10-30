// ChordOutput.jsx
import { useState } from "react";
import { CHORDS } from "../data/chords";

export default function ChordOutput({ html }) {
  const [hoveredChord, setHoveredChord] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // 🔥 regex: support A#, Ab, Amaj7, Am7, A/C#, G#m7b5, dll
  const wrappedHtml = (html || "")
    .replace(
      /(?<![A-Za-z\/])([A-G](?:#|b)?(?:maj7|m7|m|sus2|sus4|add9|dim7|dim|aug|7|6|9)?(?:\/[A-G](?:#|b)?)?)(?![A-Za-z\/])/g,
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
        <div className="text-[12px] text-center font-mono mb-1 text-gray-700">
          {data.note}
        </div>
      )}
      <pre className="text-[10px] font-mono leading-[10px] whitespace-pre text-black">
        {lines.join("\n")}
      </pre>
    </div>
  );
}