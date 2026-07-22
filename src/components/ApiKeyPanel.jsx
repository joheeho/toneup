import { useState, useEffect } from "react";

const STORAGE_KEY = "toneup_api_key"; // 필요시 키 이름 변경

export default function ApiKeyPanel({ onKeyChange }) {
  const [apiKey, setApiKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [message, setMessage] = useState("");

  // 새로고침 시 localStorage에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setApiKey(saved);
      setInputValue(saved);
      onKeyChange?.(saved);
    }
  }, []);

  const handleSave = () => {
    if (!inputValue.trim()) {
        setMessage("키를 입력해주세요.");
        return;
    }
    const trimmed = inputValue.trim();
    localStorage.setItem(STORAGE_KEY, trimmed);
    setApiKey(trimmed);
    onKeyChange?.(trimmed);   
    setMessage("저장되었습니다.");
};

  const handleLoad = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setApiKey(saved);
      setInputValue(saved);
      onKeyChange?.(saved);
      setMessage("불러왔습니다.");
    } else {
      setMessage("저장된 키가 없습니다.");
    }
  };

  const handleDelete = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey("");
    setInputValue("");
    onKeyChange?.("");   
    setMessage("삭제되었습니다.");
};

  return (
    <div className="max-w-md mx-auto p-5 bg-paper rounded-xl border border-paper-line">
      <h3 className="mb-2 font-semibold text-base text-ink">API 키 설정</h3>

      <input
        type="password"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="API 키를 입력하세요"
        className="w-full px-3 py-2 mb-3 border border-paper-line rounded-lg text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-seal"
       />

      <div className="flex gap-2 mb-3">
      <button
        onClick={handleSave}
        className="px-4 py-2 rounded-lg bg-seal text-paper text-sm hover:opacity-90"
      >
        저장
      </button>
      <button
        onClick={handleDelete}
        className="px-4 py-2 rounded-lg border border-paper-line text-ink text-sm hover:bg-paper-line/20"
      >
        삭제
      </button>
    </div>

    {message && <p className="text-sm text-ink/60">{message}</p>}

    {!apiKey && (
      <p className="text-sm text-ink/40 mt-2">
        키를 입력하면 실제 변환이 됩니다.
      </p>
    )}
</div>
  );
}

