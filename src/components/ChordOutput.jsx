export default function ChordOutput({ html }) {
  const hasChord = !!html;

  return (
    <div className="bg-blue-50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm border border-blue-100">
      {hasChord ? (
        // tampilkan HTML hasil transpose
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        // placeholder kalau belum ada chord
        <pre className="text-gray-500">
[Tulis lirik & chord atau hanya chordnya saja]
Demo Chord [Contoh]

Intro :
F  G  C  Am  F  G  C  C7
F  G  C  A  F  G  C

C                 F
Ku tuliskan kenangan tentang
        G            C
Caraku menemukan dirimu
 Am                   Dm
tentang apa yang membuatku mudah
     G              C
Berikan hatiku padamu...

C               F
Takkan habis sejuta lagu
          G              C
Untuk menceritakan cantikmu
        </pre>
      )}
    </div>
  );
}
