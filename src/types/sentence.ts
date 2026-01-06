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

export type SentenceWithPosition = Sentence & {
  startIndex: number;
  endIndex: number;
};

export const isClaim = (sentence: Sentence): sentence is ClaimSentence => sentence.type === "claim";

export const isOpinion = (sentence: Sentence): sentence is OpinionSentence =>
  sentence.type === "opinion";
