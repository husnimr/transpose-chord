// src/App.jsx
import { useEffect, useRef, useState } from "react";
import ChordInput from "./components/ChordInput";
import ChordOutput from "./components/ChordOutput";
import KeySelector from "./components/KeySelector";
import {
  keys,
  getKeyByName,
  buildDisplayHtmlFromText,
  transposeHtmlSpans,
} from "./utils/transposeUtils";

const defaultSample = `[Tulis lirik & chord atau hanya chordnya saja]
Demo Chord [Contoh] 

Intro 
G

          G          Em
I found a love.. for me
             C
Darling just dive right in
              D
and follow my lead
               G
Well I found a girl..
      Em
beautiful and sweet
        C
I never knew you were the someone
            D
waiting for me

      D
Cause we were just kids
        G
when we fell in love
            Em
Not knowing what it was
           C                G   D
I will not give you up this ti..me
                 G
But darling just kiss me slow
              Em
your heart is all I own
            C                   D
And in your eyes you're holding mine

Reff: 
       Em   C             G
 Baby, I'm dancing in the dark
      D              Em
 With you between my arms
 C               G
 Barefoot on the grass
 D                 Em
 Listening to our favourite song
          C                 G
 When you said you looked a mess
             D               Em
 I whispered underneath my breath
         C
 But you heard it
          G        D          G
 Darling, you look perfect tonight`;

export default function App() {
  const [textareaValue, setTextareaValue] = useState("");
  const [displayHtml, setDisplayHtml] = useState(buildDisplayHtmlFromText(defaultSample, "G"));
  const [currentKey, setCurrentKey] = useState(getKeyByName("G")); // object with name,value,...
  const htmlRef = useRef(null);

  // initialize display with default sample (like plugin's auto-run)
  useEffect(() => {
    setDisplayHtml(buildDisplayHtmlFromText(defaultSample, "G"));
    setCurrentKey(getKeyByName("G"));
  }, []);

  // Transpose when a key is selected
  function handleSelectKey(newKeyName) {
    const newKey = getKeyByName(newKeyName);
    if (!newKey) return;
    if (currentKey.name === newKey.name) return;
    const delta = newKey.value - currentKey.value;
    const newHtml = transposeHtmlSpans(displayHtml, delta);
    setDisplayHtml(newHtml);
    setCurrentKey(newKey);
  }

  // Action for "Click to Transpose" (convert textarea to interactive display)
  function handleTransposeClick() {
    const txt = textareaValue.trim();
    if (!txt) {
      alert("Silakan masukkan teks chord terlebih dahulu!");
      return;
    }
    const newHtml = buildDisplayHtmlFromText(txt, "C");
    setDisplayHtml(newHtml);
    setCurrentKey(getKeyByName("C"));
    // ❌ hapus baris setTextareaValue("") biar input tetap ada
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
          🎶 Transpose Chord App
        </h1>

        <ChordInput value={textareaValue} onChange={setTextareaValue} onTranspose={handleTransposeClick} />

        <KeySelector currentKey={currentKey.name} onSelect={handleSelectKey} />

        <ChordOutput html={displayHtml} />
      </div>
    </div>
  );
}
