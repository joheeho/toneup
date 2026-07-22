import Anthropic from "@anthropic-ai/sdk";
import { BASE_RULE, TONES } from "../prompts/tones.js";

// true로 두면 실제 API를 호출하지 않고 가짜 결과를 돌려줍니다.
// API 키가 없어도 화면 전체를 테스트할 수 있습니다.
// 실제 AI 연결을 확인할 때는 false로 바꾸세요.
const USE_MOCK = false;

const MODEL = "claude-opus-4-8";

const RESULT_SCHEMA = {
  type: "object",
  properties: {
    subject: { type: "string" },
    body: { type: "string" },
  },
  required: ["subject", "body"],
  additionalProperties: false,
};

function getMockResult(rawText, tone, language) {
  const toneInfo = TONES.find((t) => t.id === tone);
  const label = toneInfo ? toneInfo.label : tone;

  if (language === "en") {
    return {
      subject: `[Mock Result] ${label} Email Subject`,
      body: `(This is a mock result with USE_MOCK = true)\n\nDear recipient,\n\nRegarding your note: "${rawText.trim()}"\n\nPlease let me know if you have any questions.\n\nBest regards,`,
    };
  }

  return {
    subject: `[모의 결과] ${label} 메일 제목`,
    body: `(이것은 USE_MOCK = true 상태의 가짜 결과입니다)\n\n안녕하세요, [이름]입니다.\n\n말씀 주신 내용 전달드립니다: "${rawText.trim()}"\n\n확인 부탁드립니다. 감사합니다.`,
  };
}

function buildPrompt(rawText, tone, language) {
  const toneInfo = TONES.find((t) => t.id === tone);
  if (!toneInfo) {
    throw new Error("알 수 없는 톤입니다.");
  }

  const languageInstruction =
    language === "en"
      ? "[언어 지침]\n최종 결과물(제목 및 본문)은 반드시 격식 있는 비즈니스 영어(Formal Business English)로 작성하세요."
      : "[언어 지침]\n최종 결과물(제목 및 본문)은 정중한 한국어로 작성하세요.";

  return `${BASE_RULE}

[말투 지침]
${toneInfo.instruction}

${languageInstruction}

[거친 메모]
${rawText}`;
}

export async function convertEmail({ rawText, tone, language = "ko", apiKey }) {
  if (!rawText || !rawText.trim()) {
    throw new Error("변환할 메모를 입력해주세요.");
  }

  if (USE_MOCK) {
    return getMockResult(rawText, tone, language);
  }

  if (!apiKey) {
    throw new Error("API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.");
  }

  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  let response;
  try {
    response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      output_config: { format: { type: "json_schema", schema: RESULT_SCHEMA } },
      messages: [{ role: "user", content: buildPrompt(rawText, tone, language) }],
    });
  } catch {
    throw new Error("AI 호출에 실패했습니다. 네트워크와 API 키를 확인해주세요.");
  }

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock) {
    throw new Error("AI가 빈 응답을 반환했습니다. 다시 시도해주세요.");
  }

  const parsed = JSON.parse(textBlock.text);
  return { subject: parsed.subject, body: parsed.body };
}
