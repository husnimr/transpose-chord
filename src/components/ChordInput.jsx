import { FiPlus, FiMinus } from "react-icons/fi";
export default function ChordInput({
  value,
  onChange,
  onTranspose,
  onUp,
  onDown,
  onClear,
  hasText,
  darkMode, // 🌓 dapat dari App.jsx
}) {
  return (
    <div
      className={`TransposeChordHusni border rounded-lg p-4 transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-blue-50 border-blue-200 text-gray-800"
      }`}
    >
      <textarea
        className={`oldchord-area w-full h-44 rounded-md p-3 focus:outline-none resize-vertical border transition-colors duration-300 ${
          darkMode
            ? "bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500"
            : "bg-white border-blue-300 text-gray-800 placeholder-gray-400"
        }`}
        placeholder={`G  Em  C  D

                  G            Em
  I found a love.. for me
                     C
  Darling just dive right in..`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="mt-2 flex gap-2 justify-between items-center">
        {/* --- Left Buttons --- */}
        <div className="flex gap-2">
          <button
            onClick={onTranspose}
            className="ExTranspose bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Transpose
          </button>

          <button
            onClick={onDown}
            disabled={!hasText}
            className={`px-4 py-2 rounded-md font-bold transition-colors duration-200 ${
              hasText
                ? "bg-red-500 text-white hover:bg-red-600"
                : darkMode
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            <FiMinus className="text-lg" />
          </button>

          <button
            onClick={onUp}
            disabled={!hasText}
            className={`px-4 py-2 rounded-md font-bold transition-colors duration-200 ${
              hasText
                ? "bg-green-500 text-white hover:bg-green-600"
                : darkMode
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            <FiPlus className="text-lg" />
          </button>
        </div>

        {/* --- Right Clear Button --- */}
        <button
          onClick={onClear}
          disabled={!hasText}
          title="Clear text and output"
          className={`px-3 py-2 rounded-md font-bold transition-colors duration-200 ${
            hasText
              ? "bg-red-500 text-white hover:bg-red-600"
              : darkMode
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
