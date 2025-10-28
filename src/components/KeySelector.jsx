// src/components/KeySelector.jsx
import { keys as KEYS } from "../utils/transposeUtils";

export default function KeySelector({ currentKey, onSelect }) {
  return (
    <div className="chord-husni flex flex-wrap gap-2 my-4 justify-center">
      {KEYS.map(key => (
        <button
          key={key.name}
          onClick={() => onSelect(key.name)}
          className={`px-3 py-1 rounded text-sm font-semibold shadow-sm transition ${
            currentKey === key.name ? "bg-pink-600 text-white" : "bg-pink-100 text-pink-700 hover:bg-pink-200"
          }`}
        >
          {key.name}
        </button>
      ))}
    </div>
  );
}
