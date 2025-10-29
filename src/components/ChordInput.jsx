// src/components/ChordInput.jsx
export default function ChordInput({ value, onChange, onTranspose }) {
  return (
    <div className="TransposeChordHusni bg-blue-50 p-4 rounded-md mb-4">
      <textarea
        className="oldchord-area w-full h-44 border border-blue-300 rounded-md p-3 focus:outline-none resize-vertical"
        placeholder="Paste the old chord you want to change here .."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="mt-3 flex gap-2">
        <button
          onClick={onTranspose}
          className="ExTranspose bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Transpose
        </button>
      </div>
    </div>
  );
}
