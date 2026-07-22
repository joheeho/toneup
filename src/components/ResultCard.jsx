import { useState } from "react";

export default function ResultCard({ result, loading, error }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    const text = `제목: ${result.subject}\n\n${result.body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 접근이 막힌 환경에서는 조용히 무시합니다.
    }
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ink">완성된 메일</h2>
          <p className="mt-1 text-xs text-ink-soft">
            정중하게 다듬어진 결과가 여기에 표시됩니다.
          </p>
        </div>
        {result && (
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full border border-seal px-3 py-1 text-xs font-medium text-seal transition-colors hover:bg-seal-soft"
          >
            {copied ? "복사됨" : "복사하기"}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto rounded-lg border border-paper-line bg-white/60 p-4">
        {loading && (
          <div className="flex h-full items-center justify-center text-sm text-ink-soft">
            메일을 다듬는 중입니다...
          </div>
        )}

        {!loading && error && (
          <div className="flex h-full items-center justify-center text-center text-sm text-seal">
            {error}
          </div>
        )}

        {!loading && !error && !result && (
          <div className="flex h-full items-center justify-center text-center text-sm text-ink-soft">
            왼쪽에 메모를 적고 말투를 고른 뒤 변환해보세요.
          </div>
        )}

        {!loading && !error && result && (
          <div className="space-y-3">
            <div>
              <div className="text-xs font-medium text-ink-soft">제목</div>
              <div className="mt-1 text-sm font-semibold text-ink">
                {result.subject}
              </div>
            </div>
            <div className="border-t border-paper-line pt-3">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                {result.body}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
