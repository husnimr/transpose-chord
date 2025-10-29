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
};


export default function ChordOutput({ html }) {
  const [hoveredChord, setHoveredChord] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const wrappedHtml = (html || "")
    .split("\n")
    .map((line) =>
      line.replace(
        /\b([A-G][#b]?m?(?:maj7|dim7|sus4|sus2|7|6|9|add9|aug|dim)?)\b/g,
        `<span class="chord-output" data-chord="$1">$1</span>`
      )
    )
    .join("<br/>");

  function handleMouseEnter(e) {
    const chord = e.target.getAttribute("data-chord");
    if (chord && CHORDS[chord]) {
      const rect = e.target.getBoundingClientRect();
      setTooltipPos({
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
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
            top: tooltipPos.y - 70,
            left: tooltipPos.x,
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
  const strings = ["E", "A", "D", "G", "B", "E"]; // kiri -> kanan
  const frets = CHORDS[chord];
  if (!frets) return null;

  const fretCount = 5; // kita tampilkan 5 fret: kolom 0..4 (kiri->kanan = fret5..fret1)

  // buat grid 6 x 5, default '---'
  const grid = Array.from({ length: strings.length }, () =>
    Array.from({ length: fretCount }, () => "---")
  );

  // tempatkan titik sesuai aturan: kolom = fretCount - fret
  frets.forEach((fret, stringIndex) => {
    if (fret === null) {
      // mute: tampilkan " X " di posisi paling kanan (opsional); contohmu tidak menampilkan X, jadi kita biarkan '-' saja
      // jika mau X di kiri/kanan, uncomment baris di bawah:
      // grid[stringIndex][fretCount - 1] = " X ";
    } else if (fret === 0) {
      // open string: sesuai permintaan, biarkan tetap '-' (tidak menaruh O)
      // kalau mau tampilkan O di kolom paling kanan: grid[stringIndex][fretCount - 1] = " O ";
    } else if (fret > 0 && fret <= fretCount) {
      const idx = fretCount - fret; // <--- kunci: fret1 -> idx = 4, fret3 -> idx = 2
      grid[stringIndex][idx] = "-●-";
    }
    // fret > fretCount kita abaikan (tidak tampil)
  });

  // gabungkan tiap baris menjadi string horizontal dan tambahkan label senar di kanan
  const lines = grid.map((row, i) => {
    // gabung dengan '|' di antaranya lalu sisipkan spasi + '|' + space + label
    return `${row.join("|")}|| ${strings[i]}`;
  });

  return (
    <pre className="text-[10px] font-mono text-black leading-[10px] whitespace-pre">
      {lines.join("\n")}
    </pre>
  );
}


