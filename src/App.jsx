import { useEffect, useState, useRef } from "react";
import { FiMoon, FiSun, FiType, FiPlus, FiMinus, FiRotateCcw } from "react-icons/fi";
import { MdOutlineInstallMobile } from "react-icons/md";
import ChordInput from "./components/ChordInput";
import ChordOutput from "./components/ChordOutput";
import KeySelector from "./components/KeySelector";
import {
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
And in your eyes you're holding mine`;

export default function App() {
  const [textareaValue, setTextareaValue] = useState("");
  const [displayHtml, setDisplayHtml] = useState(
    buildDisplayHtmlFromText(defaultSample, "G")
  );
  const [currentKey, setCurrentKey] = useState(getKeyByName("G"));
  const [activeTab, setActiveTab] = useState("output");
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [showFontMenu, setShowFontMenu] = useState(false);

  useEffect(() => {
    setDisplayHtml(buildDisplayHtmlFromText(defaultSample, "G"));
    setCurrentKey(getKeyByName("G"));
    clearInterval(scrollInterval.current);
  }, []);

  function handleSelectKey(newKeyName) {
    const newKey = getKeyByName(newKeyName);
    if (!newKey || currentKey.name === newKey.name) return;
    const delta = newKey.value - currentKey.value;
    setDisplayHtml((prev) => transposeHtmlSpans(prev, delta));
    setCurrentKey(newKey);
  }

  function detectFirstChordKey(text) {
    const match = text.match(chordRegex);
    if (match && match[0]) {
      const root = getChordRoot(match[0]);
      return getKeyByName(root);
    }
    return getKeyByName("C");
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

  const [showAutoScroll, setShowAutoScroll] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [speed, setSpeed] = useState(0); // 0 = stop
  const scrollInterval = useRef(null);
  const speedIntervals = [0, 80, 60, 40, 25, 15]; // sebelumnya 400-30

  // mulai autoscroll
  const startScroll = (level) => {
    stopScroll();
    setSpeed(level);
    setScrolling(true);

    scrollInterval.current = setInterval(() => {
      window.scrollBy(0, 1); // makin tinggi level makin cepat scroll-nya (0, 1.5 + level * 0.5);
    }, speedIntervals[level]);
  };

  // fungsi berhenti
  const stopScroll = () => {
    clearInterval(scrollInterval.current);
    setScrolling(false);
    setSpeed(0);
  };


  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-blue-50 to-pink-50 text-gray-800"
      } flex flex-col items-center py-10 px-4`}
    >
      <div
        className={`max-w-3xl w-full p-6 rounded-2xl shadow-lg transition-colors duration-500 ${
          darkMode ? "bg-gray-900 border border-gray-700" : "bg-white"
        }`}
      >
        {/* Header + Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1
            className={`text-3xl font-bold text-center ${
              darkMode ? "text-pink-400" : "text-pink-600"
            }`}
          >
            🎶 Transpose Chord Guitar App
          </h1>

          <div className="flex gap-2">
            {/* Font Control Button */}
            <div className="relative">
              <button
                onClick={() => setShowFontMenu(!showFontMenu)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors duration-300 ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-blue-300"
                    : "bg-blue-100 hover:bg-blue-200 text-gray-700"
                }`}
              >
                <FiType className="text-lg" />
              </button>

              {/* Dropdown */}
{showFontMenu && (
  <div
    className={`absolute right-0 mt-2 p-2 rounded-lg shadow-lg z-10 flex gap-2 ${
      darkMode
        ? "bg-gray-800 border border-gray-700"
        : "bg-white border border-gray-200"
    }`}
  >
    <button
      onClick={() => setFontSize((s) => Math.max(10, s - 1))}
      className={`p-2 rounded transition-colors ${
        darkMode
          ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
      }`}
      title="Perkecil Font"
    >
      <FiMinus size={16} />
    </button>

    <button
      onClick={() => setFontSize((s) => Math.min(24, s + 1))}
      className={`p-2 rounded transition-colors ${
        darkMode
          ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
      }`}
      title="Perbesar Font"
    >
      <FiPlus size={16} />
    </button>

    <button
      onClick={() => setFontSize(14)}
      className={`p-2 rounded transition-colors ${
        darkMode
          ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
      }`}
      title="Reset Font"
    >
      <FiRotateCcw size={16} />
    </button>
  </div>
)}

            </div>

            {/* Tombol Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-yellow-300"
                  : "bg-blue-100 hover:bg-blue-200 text-gray-700"
              }`}
            >
              {darkMode ? 
              <FiSun className="text-yellow-300 text-lg" /> : 
              <FiMoon className="text-blue-600 text-lg" />}
            </button>

            {/* Tombol Autoscroll */}
            <button
              onClick={() => setShowAutoScroll(!showAutoScroll)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-blue-300"
                  : "bg-blue-100 hover:bg-blue-200 text-blue-700"
              }`}
            >
              {darkMode ? 
                <MdOutlineInstallMobile className="text-yellow-600 text-lg" /> :
                <MdOutlineInstallMobile className="text-blue-600 text-lg" />}
            </button>
          </div>
        </div>

        {/* AutoScroll Floating Panel */}
        {showAutoScroll && (
          <div
            className={`fixed right-5 bottom-32 rounded-lg shadow-lg z-50 border transition-colors duration-300 ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-200"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            <div className="p-2 w-24 flex flex-col items-center">
              <p className="text-xs font-semibold mb-2">AutoScroll</p>

              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => startScroll(lvl)}
                  className={`w-full py-1 my-1 text-xs rounded transition-colors duration-200 ${
                    speed === lvl
                      ? "bg-red-500 text-white"
                      : darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Speed {lvl}x
                </button>
              ))}

              <button
                onClick={stopScroll}
                className="w-full mt-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
              >
                Stop
              </button>
            </div>
          </div>
        )}

        {/* Input & Key Selector */}
        <ChordInput
          value={textareaValue}
          onChange={setTextareaValue}
          onTranspose={handleTransposeClick}
          onUp={handleTransposeUp}
          onDown={handleTransposeDown}
          onClear={handleClear}
          hasText={!!textareaValue.trim()}
          darkMode={darkMode} 
        />

        <KeySelector currentKey={currentKey.name} onSelect={handleSelectKey} />

        {/* Tabs Section */}
        <div className="mt-5">
          {/* Tab Buttons */}
          <div
            className={`flex border-b mb-4 ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <button
              className={`px-4 py-2 text-m font-semibold transition ${
                activeTab === "output"
                  ? darkMode
                    ? "border-b-2 border-pink-400 text-pink-400"
                    : "border-b-2 border-blue-600 text-blue-600"
                  : darkMode
                  ? "text-gray-400 hover:text-pink-400"
                  : "text-gray-500 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("output")}
            >
              Result
            </button>
            <button
              className={`px-4 py-2 text-m font-semibold transition ${
                activeTab === "cara"
                  ? darkMode
                    ? "border-b-2 border-pink-400 text-pink-400"
                    : "border-b-2 border-blue-600 text-blue-600"
                  : darkMode
                  ? "text-gray-400 hover:text-pink-400"
                  : "text-gray-500 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("cara")}
            >
              Cara Penggunaan
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "output" ? (
            <ChordOutput 
            html={displayHtml} 
            darkMode={darkMode}
            fontSize={fontSize}
            />
          ) : (
            <div
              className={`rounded-lg p-4 leading-relaxed shadow-sm transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-800 border border-gray-700 text-gray-200"
                  : "bg-blue-50 border border-blue-200 text-gray-700"
              }`}
            >
              <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base transition-colors duration-300">
                <li>
                  Tentukan nada dasar (key) dari lagu yang ingin kamu ubah.{" "}
                  <br />
                    <span>
                      Contoh: Jika pada bagian intro tertulis <b>D E A F#m</b>,
                      maka pilih atau masukkan chord awal <b>D</b>.
                    </span>
                </li>
                <li>
                  Masukkan chord dan lirik lagu (jika ada) ke dalam kolom input
                  di atas.
                </li>
                <li>
                  Klik tombol <kbd>Transpose</kbd> untuk menampilkan hasil
                  perubahan chord.
                </li>
                <li>
                  Gunakan tombol <kbd>+</kbd> atau <kbd>–</kbd> untuk menaikkan
                  atau menurunkan setengah nada, atau pilih langsung dari daftar
                  chord di atas.
                </li>
                <li>
                  Klik tombol <kbd>Clear</kbd> untuk menghapus input dan hasil
                  sebelumnya.
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
