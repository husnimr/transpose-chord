export default function ChordInput({
  value,
  onChange,
  onTranspose,
  onUp,
  onDown,
  onClear,
  hasText,
}) {
  return (
    <div className="TransposeChordHusni bg-blue-50 p-4 rounded-md mb-4">
      <textarea
        className="oldchord-area w-full h-44 border border-blue-300 rounded-md p-3 focus:outline-none resize-vertical"
        placeholder="Tulis lirik & chord atau hanya chordnya saja"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="mt-1 flex gap-2 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={onTranspose}
            className="ExTranspose bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Transpose
          </button>
          <button
            onClick={onDown}
            disabled={!hasText}
            className={`px-4 py-2 rounded-md font-bold ${
              hasText
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            –
          </button>
          <button
            onClick={onUp}
            disabled={!hasText}
            className={`px-4 py-2 rounded-md font-bold ${
              hasText
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            +
          </button>
        </div>

        <button
          onClick={onClear}
          disabled={!hasText}
          title="Clear text and output"
          className={`px-3 py-2 rounded-md font-bold ${
            hasText
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
