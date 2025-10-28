// src/components/ChordOutput.jsx
import { useMemo } from "react";

export default function ChordOutput({ html }) {
  // html is expected to be the display HTML with <span class="chord-output"> inside
  const safeHtml = useMemo(() => {
    return html || `<pre class="OutputChordHusni" data-key="C">
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
 Am                 Dm
Kan teramat panjang puisi
       G               C
Tuk menyuratkan cinta ini..

Reff:
                 F         G
  Telah habis sudah cinta ini
                C     G      A
  Tak lagi tersisa untuk dunia
                     Dm
  Karena telah ku habiskan
           G              C  F C F
  Sisa cintaku hanya untukmu..
</pre>`;
  }, [html]);

  return (
    <div
      className="OutputChordHusni bg-blue-50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm border border-blue-100"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
