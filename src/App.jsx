import { useState, useEffect } from "react";
import InputArea, { MAX_LENGTH } from "./components/InputArea.jsx";
import ToneSelector from "./components/ToneSelector.jsx";
import ResultCard from "./components/ResultCard.jsx";
import { convertEmail } from "./lib/convert.js";

const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export default function App() {
  const [rawText, setRawText] = useState("");
  const [toneId, setToneId] = useState("boss");
  const [language, setLanguage] = useState("ko"); // 언어 상태: "ko" | "en"
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isOverLimit = rawText.length > MAX_LENGTH;
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("toneup-favorites");

    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("toneup-history");

    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

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

      const newHistory = [
        {
          id: Date.now(),
          date: new Date().toLocaleString(),
          tone: toneId,
          rawText,
          result: converted,
        },
        ...history,
      ].slice(0, 10);

      setHistory(newHistory);

      localStorage.setItem(
        "toneup-history",
        JSON.stringify(newHistory)
      );

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 히스토리 제거
  const clearHistory = () => {
    localStorage.removeItem("toneup-history");
    setHistory([]);
  };

  // 즐겨찾기 저장 함수
  const addFavorite = () => {
    const text = rawText.trim();

    if (!text) return;

    if (favorites.includes(text)) return;

    const newFavorites = [text, ...favorites].slice(0, 10);

    setFavorites(newFavorites);

    localStorage.setItem(
      "toneup-favorites",
      JSON.stringify(newFavorites)
    );
  };

  // 즐겨찾기 제거 함수
  const removeFavorite = (text) => {
    const newFavorites = favorites.filter(
      (item) => item !== text
    );

    setFavorites(newFavorites);

    localStorage.setItem(
      "toneup-favorites",
      JSON.stringify(newFavorites)
    );
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
            <InputArea
              value={rawText}
              onChange={setRawText}
              addFavorite={addFavorite}
              favorites={favorites}
              removeFavorite={removeFavorite}
            />

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
              disabled={loading || !rawText.trim() || isOverLimit}
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
            />

            <div className="mt-6 border-t border-paper-line pt-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-ink">
                  최근 변환 내역
                </h2>

                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="rounded-lg border border-paper-line px-3 py-1 text-xs"
                  >
                    전체 삭제
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <p className="text-sm text-ink-soft">
                  아직 저장된 변환 내역이 없습니다.
                </p>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setResult(item.result)}
                      className="w-full rounded-lg border border-paper-line p-3 text-left transition hover:bg-paper"
                    >
                      <div className="text-xs text-ink-soft">
                        {item.date}
                      </div>

                      <div className="mt-1 font-medium">
                        {item.result.subject}
                      </div>

                      <div className="mt-1 text-sm text-ink-soft line-clamp-2">
                        {item.rawText}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
