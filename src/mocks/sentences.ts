import type { Sentence } from "@/types/sentence";

export const mockEditorText = `지구는 평평하다는 주장이 있습니다. 그러나 과학적으로 지구는 타원형의 구체입니다. 이것은 개인적인 생각일 뿐입니다. 물은 100도에서 끓습니다.`;

export const mockSentences: Sentence[] = [
  {
    id: "sentence-1",
    type: "claim",
    text: "지구는 평평하다는 주장이 있습니다.",
    position: 0,
    verdict: "FALSE",
    sources: [{ title: "NASA - Earth", url: "https://nasa.gov/earth" }],
    suggestion: "지구는 둥글다는 것이 과학적으로 증명되었습니다.",
    status: "pending",
  },
  {
    id: "sentence-2",
    type: "claim",
    text: "지구는 타원형의 구체입니다.",
    position: 1,
    verdict: "TRUE",
    sources: [{ title: "NASA - Earth Facts", url: "https://nasa.gov/earth-facts" }],
    suggestion: null,
    status: "pending",
  },
  {
    id: "sentence-3",
    type: "opinion",
    text: "이것은 개인적인 생각일 뿐입니다.",
    position: 2,
    reason: "주관적 판단이 포함된 문장",
  },
  {
    id: "sentence-4",
    type: "claim",
    text: "물은 100도에서 끓습니다.",
    position: 3,
    verdict: "TRUE",
    sources: [{ title: "물리학 교과서", url: "https://example.com/physics" }],
    suggestion: null,
    status: "pending",
  },
];
