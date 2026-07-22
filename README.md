# ToneUp

거친 메모 한 줄을 정중한 한국어 비즈니스 메일로 바꿔주는 도구입니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 안내되는 주소(기본 http://localhost:5173)로 접속하세요.

## 실제 AI 연결하기

기본 상태에서는 `src/lib/convert.js`의 `USE_MOCK`이 `true`로 설정되어 있어
API 키 없이도 화면과 흐름을 전부 테스트할 수 있습니다 (가짜 결과 반환).

실제 Gemini API를 연결하려면:

1. `.env.example`을 복사해 `.env.local` 파일을 만듭니다.
2. [Google AI Studio](https://aistudio.google.com/)에서 발급받은 API 키를
   `.env.local`의 `VITE_GEMINI_API_KEY`에 입력합니다.
3. `src/lib/convert.js`에서 `USE_MOCK`을 `false`로 바꿉니다.
4. 개발 서버를 다시 시작합니다.

## 보안 주의사항

- 이 앱은 백엔드 없이 **브라우저에서 직접** Gemini API를 호출합니다.
- 따라서 API 키가 브라우저 네트워크 요청과 번들 안에 그대로 노출됩니다.
- `.env.local` 파일은 절대 git에 커밋하거나 공개 저장소에 올리지 마세요
  (`.gitignore`에 이미 포함되어 있습니다).
- 실제 서비스로 배포할 때는 반드시 서버를 통해 API 키를 감추는 구조로
  바꿔야 합니다. 이 프로젝트는 워크숍/학습용 프로토타입입니다.

## 말투(프롬프트) 수정하기

코딩을 몰라도 `src/prompts/tones.js` 파일의 한국어 문장만 수정하면
AI가 만드는 메일의 말투를 바꿀 수 있습니다. 파일 맨 위 안내를 참고하세요.
