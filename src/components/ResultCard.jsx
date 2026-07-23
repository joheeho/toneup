import { useState, useEffect, useMemo } from "react";

export default function ResultCard({ result, loading, error }) {
  const [copied, setCopied] = useState(false);
  const [fillValues, setFillValues] = useState({});

  // 1. result에서 대괄호 [ ... ] 패턴 추출 (중복 제거)
  const placeholders = useMemo(() => {
    if (!result) return [];
    const combinedText = `${result.subject || ""}\n${result.body || ""}`;
    const matches = combinedText.match(/\[(.*?)\]/g);
    return matches ? [...new Set(matches)] : [];
  }, [result]);

  // 2. 새로운 result가 들어오면 입력 폼 state 초기화
  useEffect(() => {
    if (placeholders.length > 0) {
      const initialValues = {};
      placeholders.forEach((p) => {
        initialValues[p] = "";
      });
      setFillValues(initialValues);
    } else {
      setFillValues({});
    }
  }, [placeholders]);

  // 3. 입력값 변경 처리
  const handleInputChange = (placeholder, value) => {
    setFillValues((prev) => ({
      ...prev,
      [placeholder]: value,
    }));
  };

  // 4. 대괄호를 입력값으로 치환해주는 함수
  const getReplacedText = (text) => {
    if (!text) return "";
    let updatedText = text;
    Object.entries(fillValues).forEach(([placeholder, value]) => {
      if (value.trim() !== "") {
        updatedText = updatedText.replaceAll(placeholder, value);
      }
    });
    return updatedText;
  };

  // 치환된 최종 제목과 본문
  const finalSubject = getReplacedText(result?.subject);
  const finalBody = getReplacedText(result?.body);

  // 5. 복사하기 (치환된 최종 텍스트 복사)
  const handleCopy = async () => {
    if (!result) return;
    const text = `제목: ${finalSubject}\n\n${finalBody}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 접근이 막힌 환경에서는 조용히 무시
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
          <div className="space-y-4">
            {/* 대괄호 빈칸 입력 폼 (대괄호가 존재할 때만 노출) */}
            {placeholders.length > 0 && (
              <div className="rounded-md border border-paper-line bg-white/80 p-3 shadow-sm">
                <div className="mb-2 text-xs font-semibold text-ink">
                  💡 빈칸 채우기 ({placeholders.length}개)
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {placeholders.map((placeholder) => (
                    <div
                      key={placeholder}
                      className="flex items-center gap-2 rounded border border-paper-line bg-white px-2 py-1"
                    >
                      <span className="shrink-0 text-xs font-medium text-seal">
                        {placeholder}
                      </span>
                      <input
                        type="text"
                        placeholder="내용 입력"
                        value={fillValues[placeholder] || ""}
                        onChange={(e) =>
                          handleInputChange(placeholder, e.target.value)
                        }
                        className="w-full bg-transparent text-xs text-ink focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 완성된 메일 출력 */}
            <div className="space-y-3">
              <div>
                <div className="text-xs font-medium text-ink-soft">제목</div>
                <div className="mt-1 text-sm font-semibold text-ink">
                  {finalSubject}
                </div>
              </div>
              <div className="border-t border-paper-line pt-3">
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                  {finalBody}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
