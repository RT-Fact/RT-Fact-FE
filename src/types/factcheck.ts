export interface Source {
  title: string;
  url: string;
}

export type Verdict = "TRUE" | "FALSE";

export type ClaimStatus = "pending" | "applied" | "ignored";

interface BaseSentence {
  id: string;
  text: string;
  position: number;
}

export interface ClaimSentence extends BaseSentence {
  type: "claim";
  verdict: Verdict;
  sources: Source[];
  status: ClaimStatus;
  suggestion: string | null;
}

export interface OpinionSentence extends BaseSentence {
  type: "opinion";
  reason: string;
}

export type Sentence = ClaimSentence | OpinionSentence;

export type SentenceWithIndices = Sentence & {
  startIndex: number;
  endIndex: number;
};

// === FactCheck API 응답 타입 ===

export interface FactCheckSummary {
  total: number;
  true: number;
  false: number;
  opinion: number;
}

export interface FactCheckResponse {
  id: string;
  title: string;
  originalText: string;
  sentences: Sentence[];
  summary: FactCheckSummary;
  createdAt: string;
}

export const isClaim = (sentence: Sentence): sentence is ClaimSentence => sentence.type === "claim";

export const isOpinion = (sentence: Sentence): sentence is OpinionSentence =>
  sentence.type === "opinion";
