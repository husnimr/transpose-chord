import { useEffect, useRef, useState } from "react";
import ChordInput from "./components/ChordInput";
import ChordOutput from "./components/ChordOutput";
import KeySelector from "./components/KeySelector";
import {
  keys,
  getKeyByName,
  getNewKey,
  getChordRoot,
  chordRegex,
  buildDisplayHtmlFromText,
  transposeHtmlSpans,
} from "./utils/transposeUtils";

const defaultSample = `Demo Chord [Contoh] 

Intro 
G Em C D G

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
  const [displayHtml, setDisplayHtml] = useState(
    buildDisplayHtmlFromText(defaultSample, "G")
  );
  const [currentKey, setCurrentKey] = useState(getKeyByName("G"));
  const [activeTab, setActiveTab] = useState("output");
  useEffect(() => {
    setDisplayHtml(buildDisplayHtmlFromText(defaultSample, "G"));
    setCurrentKey(getKeyByName("G"));
  }, []);

  function handleSelectKey(newKeyName) {
    const newKey = getKeyByName(newKeyName);
    if (!newKey || currentKey.name === newKey.name) return;
    const delta = newKey.value - currentKey.value;
    setDisplayHtml((prev) => transposeHtmlSpans(prev, delta));
    setCurrentKey(newKey);
  }

  // 🧠 Auto detect key dari input user
  function detectFirstChordKey(text) {
    const match = text.match(chordRegex);
    if (match && match[0]) {
      const root = getChordRoot(match[0]);
      return getKeyByName(root);
    }
    return getKeyByName("C"); // default
  }

  function handleTransposeClick() {
    const txt = textareaValue.trim();
    if (!txt) {
      alert("Silakan masukkan teks chord terlebih dahulu!");
      return;
    }

    const detectedKey = detectFirstChordKey(txt);
    setCurrentKey(detectedKey);

    const newHtml = buildDisplayHtmlFromText(txt, detectedKey.name);
    setDisplayHtml(newHtml);
  }

  function handleTransposeUp() {
    const nextKey = getNewKey(currentKey.name, 1);
    const delta = nextKey.value - currentKey.value;
    setDisplayHtml((prev) => transposeHtmlSpans(prev, delta));
    setCurrentKey(nextKey);
  }

  function handleTransposeDown() {
    const prevKey = getNewKey(currentKey.name, -1);
    const delta = prevKey.value - currentKey.value;
    setDisplayHtml((prev) => transposeHtmlSpans(prev, delta));
    setCurrentKey(prevKey);
  }

  function handleClear() {
    setTextareaValue("");
    setDisplayHtml("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
          🎶 Transpose Chord Guitar App
        </h1>

        <ChordInput
          value={textareaValue}
          onChange={setTextareaValue}
          onTranspose={handleTransposeClick}
          onUp={handleTransposeUp}
          onDown={handleTransposeDown}
          onClear={handleClear}
          hasText={!!textareaValue.trim()}
        />

        <KeySelector currentKey={currentKey.name} onSelect={handleSelectKey} />

        {/* --- Tabs Section --- */}
        <div className="mt-5">
          {/* Tab Buttons */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`px-4 py-2 text-m font-semibold transition ${
                activeTab === "output"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("output")}
            >
              Result
            </button>
            <button
              className={`px-4 py-2 text-m font-semibold transition ${
                activeTab === "cara"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("cara")}
            >
              Cara Penggunaan
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "output" ? (
            <ChordOutput html={displayHtml} />
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-gray-700 leading-relaxed shadow-sm">
              {/* <h2 className="text-m font-semibold text-blue-600 mb-3">
                💡 Cara Menggunakan Fitur Transpose Chord
              </h2> */}
              <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base">
                <li>
                  Tentukan nada dasar (key) dari lagu yang ingin kamu
                  ubah. <br />
                  <span className="text-gray-600">
                    Contoh: Jika pada bagian intro tertulis <b>D E A F#m</b>,
                    maka pilih atau masukkan chord awal <b>D</b>.
                  </span>
                </li>
                <li>
                  Masukkan chord dan lirik lagu (jika ada) ke dalam
                  kolom input di atas.
                </li>
                <li>
                  Klik tombol <kbd>Transpose</kbd> untuk menampilkan hasil
                  perubahan chord.
                </li>
                <li>
                  Ubah nada dengan mudah menggunakan tombol{" "}
                  <kbd>+</kbd> atau <kbd>–</kbd> untuk menaikkan/menurunkan setengah
                  nada, atau pilih langsung nada dari daftar chord di atas.
                </li>
                <li>
                  Jika ingin memulai ulang, klik tombol <kbd>Clear</kbd> untuk
                  menghapus input dan hasil sebelumnya.
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}