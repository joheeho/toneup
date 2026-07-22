import { useState, useEffect } from "react";

const STORAGE_KEY = "openai_api_key"; // 필요시 키 이름 변경

export default function ApiKeyManager() {
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
    }
  }, []);

  const handleSave = () => {
    if (!inputValue.trim()) {
      setMessage("키를 입력해주세요.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, inputValue.trim());
    setApiKey(inputValue.trim());
    setMessage("저장되었습니다.");
  };

  const handleLoad = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setApiKey(saved);
      setInputValue(saved);
      setMessage("불러왔습니다.");
    } else {
      setMessage("저장된 키가 없습니다.");
    }
  };

  const handleDelete = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey("");
    setInputValue("");
    setMessage("삭제되었습니다.");
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <h3 style={{ marginBottom: 8 }}>API 키 설정</h3>

      <input
        type={showKey ? "text" : "password"}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="API 키를 입력하세요"
        style={{
          width: "100%",
          padding: "8px 10px",
          boxSizing: "border-box",
          border: "1px solid #ccc",
          borderRadius: 6,
          marginBottom: 8,
        }}
      />

      <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <input
          type="checkbox"
          checked={showKey}
          onChange={(e) => setShowKey(e.target.checked)}
        />
        키 표시
      </label>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={handleSave} style={btnStyle}>저장</button>
        <button onClick={handleLoad} style={btnStyle}>불러오기</button>
        <button onClick={handleDelete} style={{ ...btnStyle, background: "#e74c3c" }}>삭제</button>
      </div>

      {message && <p style={{ fontSize: 13, color: "#555" }}>{message}</p>}

      {!apiKey && (
        <p style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
          키를 입력하면 실제 변환이 됩니다.
        </p>
      )}
    </div>
  );
}

const btnStyle = {
  padding: "8px 14px",
  border: "none",
  borderRadius: 6,
  background: "#3498db",
  color: "#fff",
  cursor: "pointer",
  fontSize: 13,
};