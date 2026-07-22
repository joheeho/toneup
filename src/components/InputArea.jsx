const EXAMPLES = [
  "내일까지 자료 보내주세요 빨리요",
  "회의 시간 바꿔야 되는데 가능한지 확인 좀",
  "그 건 못 도와드릴 것 같아요 바빠서",
  "발표자료 검토 부탁드려요 급해요",
];

// 단일 출처(Single Source of Truth)로 관리하기 위해 export
export const MAX_LENGTH = 500;

export default function InputArea({ value, onChange }) {
  const isAtLimit = value.length >= MAX_LENGTH;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ink">거친 메모</h2>
          <p className="mt-1 text-xs text-ink-soft">
            다듬고 싶은 문장을 편하게 적어주세요.
          </p>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="예: 내일까지 자료 보내주세요 빨리요"
          rows={10}
          maxLength={MAX_LENGTH}
          className={`flex-1 resize-none rounded-lg border bg-white/60 p-4 pb-8 text-sm leading-relaxed text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-1 ${
            isAtLimit
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-paper-line focus:border-seal focus:ring-seal"
          }`}
        />

        {/* 실시간 글자 수 카운터 */}
        <div className="absolute bottom-3 right-3 text-xs font-medium">
          <span className={isAtLimit ? "font-bold text-red-500" : "text-ink-soft"}>
            {value.length.toLocaleString()}
          </span>
          <span className="text-ink-soft/60"> / {MAX_LENGTH.toLocaleString()}자</span>
        </div>
      </div>

      {/* 예시 문장 목록 */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onChange(example)}
            className="rounded-full border border-paper-line bg-white/50 px-3 py-1 text-xs text-ink-soft transition-colors hover:border-seal hover:text-seal"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}