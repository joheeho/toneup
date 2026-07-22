# ToneUp — AI에게 붙여넣을 컨텍스트

이 파일은 A와 B가 각자 AI(예: Claude, ChatGPT)에게 질문할 때, **맨 앞에 통째로 복사해서
붙여넣는 파일**입니다. 이 내용을 안 붙이고 질문하면 AI가 이 프로젝트와 안 맞는 코드
(TypeScript, 다른 라이브러리, 다른 상태 이름 등)를 만들어낼 수 있습니다.

---

## 1. 프로젝트 한 줄 설명

**ToneUp**: 거친 메모 한 줄을 정중한 한국어 비즈니스 메일로 바꿔주는 웹 앱.

---

## 2. 기술 스택

`package.json`, `vite.config.js` 기준 실제 버전입니다. 이 목록에 없는 것은 쓰지 않습니다.

- **React** `^18.3.1` + **react-dom** `^18.3.1`
- **Vite** `^5.4.8` (`@vitejs/plugin-react` `^4.3.1`)
- **TailwindCSS v4** (`tailwindcss` `^4.0.0`, `@tailwindcss/vite` `^4.0.0`)
  - `vite.config.js`에서 `@tailwindcss/vite`의 `tailwindcss()` 플러그인을 그대로 씁니다.
    별도의 `tailwind.config.js`나 PostCSS 설정 파일이 없습니다. (v4 방식)
  - 색상 등 테마 값은 `src/index.css`의 `@theme` 블록에서 CSS 변수로 정의되어 있습니다
    (`--color-paper`, `--color-ink`, `--color-seal` 등). 새 색을 쓸 때도 이 팔레트를
    우선 사용합니다.
- **JavaScript만 사용** — 모든 파일이 `.jsx` / `.js`입니다. **TypeScript(`.ts`, `.tsx`) 쓰지 않음.**
- **상태 관리는 `useState`만** 사용합니다. Redux, Zustand, Context API 등 다른 상태 관리
  라이브러리는 쓰지 않습니다.
- **백엔드 없음.** 서버 코드, API 라우트, DB가 없는 순수 프론트엔드(Vite) 앱입니다.
- **Gemini 호출은 `openai` SDK(`^4.68.0`)로 합니다.** Google의 공식 SDK가 아니라, Gemini가
  제공하는 OpenAI 호환 엔드포인트(`https://generativelanguage.googleapis.com/v1beta/openai/`)를
  `openai` 패키지의 `OpenAI` 클라이언트로 호출하는 방식입니다. (`src/lib/convert.js` 참고)

---

## 3. 파일 오너십

| 담당 | 경로 |
|---|---|
| **A** | `src/components/` (`InputArea.jsx`, `ToneSelector.jsx`, `ResultCard.jsx`) |
| **B** | `src/lib/` (`convert.js`), `src/prompts/` (`tones.js`) |
| **팀장** | `src/App.jsx`, 설정 파일 전반 (`package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/index.css`, `CONTRIBUTING.md`, `.github/` 등) |

작업할 때는 내가 담당한 경로의 파일만 고칩니다. 다른 사람 담당 파일을 고쳐야 할 일이 생기면
먼저 팀장/담당자와 상의하세요.

---

## 4. 데이터 약속 (반드시 이 이름 그대로 쓸 것)

아래 이름들은 `src/App.jsx`와 `src/lib/convert.js`에 실제로 쓰여 있는 이름입니다.
**AI에게 코드를 만들어달라고 할 때, 이 이름을 절대 바꾸지 말라고 알려주세요.**

### `App.jsx`의 state (전부 `useState`)

```js
const [rawText, setRawText] = useState("");   // 입력창 텍스트
const [toneId, setToneId] = useState("boss"); // 선택된 말투 id
const [result, setResult] = useState(null);   // 변환 결과 { subject, body } | null
const [loading, setLoading] = useState(false);// 변환 중 여부
const [error, setError] = useState(null);     // 에러 메시지 문자열 | null
```

### `convert.js`의 함수 시그니처

```js
// src/lib/convert.js
export async function convertEmail({ rawText, tone, apiKey }) {
  // 반환값: { subject: string, body: string }
  // 실패 시 Error를 throw (message는 사용자에게 그대로 보여줄 한국어 문장)
}
```

- 입력: `rawText`(원문 메모), `tone`(톤 id 문자열), `apiKey`(Gemini API 키)
- 출력: `{ subject, body }` 형태의 객체 (Promise)
- `App.jsx`에서 `convertEmail({ rawText, tone: toneId, apiKey: API_KEY })` 형태로 호출됩니다.

### `TONES`의 id 6개 (`src/prompts/tones.js`)

```js
export const TONES = [
  { id: "boss", label: "상사", ... },
  { id: "professor", label: "교수님", ... },
  { id: "clients", label: "고객사", ... },
  { id: "teammate", label: "팀원", ... },
  { id: "senior", label: "선배 / 멘토", ... },
  { id: "general", label: "기타 (일반 비즈니스)", ... },
];
```

톤을 추가/삭제하는 게 아니라면 이 6개의 `id` 값(`boss`, `professor`, `clients`, `teammate`,
`senior`, `general`)은 그대로 유지합니다. `ToneSelector.jsx`, `App.jsx`의 기본값(`"boss"`) 등
여러 곳에서 이 문자열을 그대로 참조하고 있기 때문에, id를 바꾸면 다른 파일이 깨집니다.

---

## 5. AI에게 붙일 규칙

아래 문단을 AI에게 그대로 전달하세요.

> 이 프로젝트는 React + Vite + TailwindCSS v4 + JavaScript(.jsx)로만 되어 있고,
> 상태 관리는 `useState`만 씁니다. 백엔드가 없고, Gemini는 `openai` SDK로 호출합니다.
> 위 스택을 벗어나는 제안(TypeScript, 다른 상태 관리 라이브러리, 다른 UI 프레임워크,
> 백엔드 서버 추가 등)은 하지 마세요. **새로운 라이브러리(npm 패키지)를 추가하지 마세요.**
> 이미 있는 것만으로 해결하세요. 코드를 고칠 때는 **파일 전체를 다시 쓰지 말고, 바뀐 부분만**
> 알려주세요. 코드를 준 뒤에는 **무엇을 왜 바꿨는지 3줄 이내로** 설명해주세요. 새 UI를 만들
> 때는 기존 컴포넌트(`src/components/`)와 같은 Tailwind 클래스 스타일(색상은
> `src/index.css`의 `@theme`에 정의된 `paper`, `ink`, `seal` 계열 색상 토큰 사용, 둥근
> 모서리 `rounded-lg`/`rounded-xl`, 옅은 테두리 `border-paper-line` 등)을 그대로 따라주세요.

---

## 6. 브랜치 규칙

`CONTRIBUTING.md`와 동일합니다. 요약하면:

- 브랜치 이름: `feature/<작업내용>` (영어 소문자 + 하이픈)
- 사이클: `main` pull → `feature/...` 브랜치 생성 → 작업/커밋 → push → PR 생성 → 팀장이 병합 →
  병합된 브랜치는 즉시 삭제하고 다음 작업은 다시 `main`에서 새로 브랜치를 팜
- **PR 하나 = 작업 하나.** 상관없는 변경은 섞지 않습니다.
- `rebase`, `push --force`, `reset --hard`는 이 프로젝트에서 쓰지 않습니다.
- PR의 Merge 버튼은 팀장만 누릅니다.

자세한 이유와 단계별 설명은 저장소 루트의 `CONTRIBUTING.md`를 참고하세요.

---

## 7. API 키

- Gemini API 키는 **각자 Google AI Studio에서 직접 발급**받습니다.
- 발급받은 키는 **다른 사람과 공유하지 않습니다.**
- 키는 `.env.local` 파일에 `VITE_GEMINI_API_KEY=발급받은키` 형태로 저장합니다
  (형식은 `.env.example` 참고).
- **`.env.local` 파일은 절대 커밋하지 않습니다.** `git status`에서 이 파일이 보이면 `git add`
  대상에서 빼세요. 실수로 커밋/push했다면 `CONTRIBUTING.md`의 "실수했을 때 대처법"을 따라
  즉시 키를 폐기하고 새로 발급받으세요.
