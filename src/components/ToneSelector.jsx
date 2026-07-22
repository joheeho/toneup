import { TONES } from "../prompts/tones.js";

export default function ToneSelector({ toneId, onChange }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-ink">말투 선택</h2>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {TONES.map((tone) => {
          const active = tone.id === toneId;
          return (
            <button
              key={tone.id}
              type="button"
              onClick={() => onChange(tone.id)}
              className={
                "rounded-lg border px-3 py-2 text-left text-sm transition-colors " +
                (active
                  ? "border-seal bg-seal-soft text-seal"
                  : "border-paper-line bg-white/50 text-ink-soft hover:border-seal/50 hover:text-ink")
              }
            >
              <div className="font-medium">{tone.label}</div>
              <div className="mt-0.5 text-xs opacity-80">{tone.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
