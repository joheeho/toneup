import { useState } from "react";
import InputArea from "./components/InputArea.jsx";
import ToneSelector from "./components/ToneSelector.jsx";
import ResultCard from "./components/ResultCard.jsx";
import { convertEmail } from "./lib/convert.js";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function App() {
  const [rawText, setRawText] = useState("");
  const [toneId, setToneId] = useState("boss");
  const [language, setLanguage] = useState("ko"); // 언어 상태: "ko" | "en"
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const converted = await convertEmail({
        rawText,
        tone: toneId,
        language,
        apiKey: API_KEY,
      });
      setResult(converted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-ink">ToneUp</h1>
          <p className="mt-1 text-sm text-ink-soft">
            거친 메모 한 줄을 정중한 한국어 비즈니스 메일로 바꿔드립니다.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-6 rounded-xl border border-paper-line bg-white/40 p-5 shadow-sm">
            <InputArea value={rawText} onChange={setRawText} />

            {/* 언어 선택 토글 영역 */}
            <div className="flex items-center justify-between rounded-lg border border-paper-line bg-white/60 p-3">
              <span className="text-xs font-semibold text-ink">출력 언어</span>
              <div className="flex rounded-md bg-paper p-1 border border-paper-line">
                <button
                  type="button"
                  onClick={() => setLanguage("ko")}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    language === "ko"
                      ? "bg-seal text-white font-bold"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  한국어 🇰🇷
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    language === "en"
                      ? "bg-seal text-white font-bold"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  English 🇺🇸
                </button>
              </div>
            </div>

            <ToneSelector toneId={toneId} onChange={setToneId} />

            <button
              type="button"
              onClick={handleConvert}
              disabled={loading || !rawText.trim()}
              className="w-full rounded-lg bg-seal py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "변환 중..." : "정중한 메일로 바꾸기"}
            </button>
          </div>

          <div className="rounded-xl border border-paper-line bg-white/40 p-5 shadow-sm">
            <ResultCard
              result={result}
              loading={loading}
              error={error}
              rawText={rawText}
            />
          </div>
        </div>
      </div>
    </div>
  );
}