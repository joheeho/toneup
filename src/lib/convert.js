import OpenAI from "openai";
import { BASE_RULE, TONES } from "../prompts/tones.js";

// true로 두면 실제 API를 호출하지 않고 가짜 결과를 돌려줍니다.
// API 키가 없어도 화면 전체를 테스트할 수 있습니다.
// 실제 AI 연결을 확인할 때는 false로 바꾸세요.
const USE_MOCK = true;

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";
const MODEL = "gemini-2.0-flash";

function getMockResult(rawText, tone) {
  const toneInfo = TONES.find((t) => t.id === tone);
  const label = toneInfo ? toneInfo.label : tone;
  return {
    subject: `[모의 결과] ${label} 메일 제목`,
    body: `(이것은 USE_MOCK = true 상태의 가짜 결과입니다)\n\n안녕하세요, [이름]입니다.\n\n말씀 주신 내용 전달드립니다: "${rawText.trim()}"\n\n확인 부탁드립니다. 감사합니다.`,
  };
}

function buildPrompt(rawText, tone) {
  const toneInfo = TONES.find((t) => t.id === tone);
  if (!toneInfo) {
    throw new Error("알 수 없는 톤입니다.");
  }

  return `${BASE_RULE}

[말투 지침]
${toneInfo.instruction}

[거친 메모]
${rawText}

아래 JSON 형식으로만 답변하세요. 다른 설명은 붙이지 마세요.
{"subject": "이메일 제목", "body": "이메일 본문"}`;
}

function parseResponse(content) {
  try {
    const parsed = JSON.parse(content);
    if (typeof parsed.subject === "string" && typeof parsed.body === "string") {
      return { subject: parsed.subject, body: parsed.body };
    }
  } catch {
    // JSON이 아니면 아래에서 에러를 던집니다.
  }
  throw new Error("AI 응답을 이해할 수 없습니다. 다시 시도해주세요.");
}

export async function convertEmail({ rawText, tone, apiKey }) {
  if (!rawText || !rawText.trim()) {
    throw new Error("변환할 메모를 입력해주세요.");
  }

  if (USE_MOCK) {
    return getMockResult(rawText, tone);
  }

  if (!apiKey) {
    throw new Error("API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.");
  }

  const client = new OpenAI({
    apiKey,
    baseURL: GEMINI_BASE_URL,
    dangerouslyAllowBrowser: true,
  });

  let response;
  try {
    response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: buildPrompt(rawText, tone) }],
      response_format: { type: "json_object" },
    });
  } catch {
    throw new Error("AI 호출에 실패했습니다. 네트워크와 API 키를 확인해주세요.");
  }

  const content = response?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI가 빈 응답을 반환했습니다. 다시 시도해주세요.");
  }

  return parseResponse(content);
}
