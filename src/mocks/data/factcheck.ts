import type { FactCheckResponse, HistoryItem, Sentence } from "@/types/factcheck";

export const mockTestSentences: Sentence[] = [
  {
    id: "claim-false-1",
    type: "claim",
    text: "지구는 평평하다.",
    position: 0,
    verdict: "FALSE",
    sources: [{ title: "NASA", url: "https://nasa.gov" }],
    suggestion: "지구는 둥글다.",
    status: "pending",
  },
  {
    id: "claim-true-1",
    type: "claim",
    text: "물은 100도에서 끓는다.",
    position: 1,
    verdict: "TRUE",
    sources: [{ title: "과학 교과서", url: "https://example.com" }],
    suggestion: null,
    status: "pending",
  },
  {
    id: "opinion-1",
    type: "opinion",
    text: "개인적으로 여름이 좋다.",
    position: 2,
    reason: "주관적 판단이 포함된 문장",
  },
];

export const mockTestEditorText = mockTestSentences.map((s) => s.text).join(" ");

export const mockFactCheckResponse: FactCheckResponse = {
  id: "test-factcheck-id",
  title: "테스트 팩트체크",
  originalText: mockTestEditorText,
  sentences: mockTestSentences,
  summary: {
    total: 3,
    true: 1,
    false: 1,
    opinion: 1,
  },
  createdAt: "2026-01-10T00:00:00Z",
};

export const mockHistoryItems: HistoryItem[] = [
  {
    id: "history-1",
    title: "첫 번째 팩트체크",
    preview: "지구는 평평하다. 물은 100도에서 끓는다.",
    checkedCount: 3,
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "history-2",
    title: "두 번째 팩트체크",
    preview: "태양은 지구 주위를 돈다.",
    checkedCount: 1,
    createdAt: "2026-01-09T00:00:00Z",
  },
  {
    id: "history-3",
    title: "세 번째 팩트체크",
    preview: "빛의 속도는 초속 30만km이다.",
    checkedCount: 2,
    createdAt: "2026-01-08T00:00:00Z",
  },
];
