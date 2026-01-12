import { type Ref, useImperativeHandle, useRef } from "react";

import {
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Search,
  X,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ClaimSentence, Sentence } from "@/types/factcheck";
import { isClaim, isOpinion } from "@/types/factcheck";

export interface ResultsContentHandle {
  scrollToCard: (id: string) => void;
}

interface ResultsContentProps {
  sentences: Sentence[];
  onApply: (id: string) => void;
  onIgnore: (id: string) => void;
  activeSentenceId: string | null;
  onCardClick: (id: string) => void;
  ref: Ref<ResultsContentHandle>;
}

const VERDICT_STYLES = {
  TRUE: {
    badgeVariant: "verdict-true",
    icon: CheckCircle2,
    label: "사실",
    iconColor: "text-green-600",
    cardVariant: "claim",
  },
  FALSE: {
    badgeVariant: "verdict-false",
    icon: XCircle,
    label: "거짓",
    iconColor: "text-red-500",
    cardVariant: "claim",
  },
  APPLIED: {
    badgeVariant: "verdict-applied",
    icon: CheckCircle2,
    label: "수정됨",
    iconColor: "fill-green-500 text-white border-none size-6",
    cardVariant: "verdict-applied",
  },
  IGNORED: {
    badgeVariant: "verdict-ignored",
    icon: XCircle,
    label: "무시됨",
    iconColor: "fill-gray-500 text-white border-none size-6",
    cardVariant: "verdict-ignored",
  },
} as const;

const getClaimStyle = (sentence: ClaimSentence) => {
  if (sentence.status === "applied") return VERDICT_STYLES.APPLIED;
  if (sentence.status === "ignored") return VERDICT_STYLES.IGNORED;
  return VERDICT_STYLES[sentence.verdict];
};

const ResultsContent = ({
  sentences,
  onApply,
  onIgnore,
  activeSentenceId,
  onCardClick,
  ref,
}: ResultsContentProps) => {
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useImperativeHandle(ref, () => ({
    scrollToCard: (id: string) => {
      const card = cardRefs.current.get(id);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
  }));

  const stats = {
    true: sentences.filter((s) => isClaim(s) && s.verdict === "TRUE").length,
    false: sentences.filter((s) => isClaim(s) && s.verdict === "FALSE").length,
    opinion: sentences.filter((s) => isOpinion(s)).length,
  };

  if (sentences.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex size-20 items-center justify-center rounded-full bg-blue-50">
          <Search className="size-10 text-blue-400" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">팩트체크 대기 중</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            텍스트를 입력하고 '전체 검사'를 눌러주세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto pt-4 pl-3 pr-2 pb-4">
      {/* Summary Card */}
      <Card variant="summary" className="flex flex-col gap-4 p-6">
        <h3 className="font-semibold text-foreground">분석 결과</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-green-100/50 p-4">
            <CheckCircle2 className="size-6 text-green-500" />
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.true}</div>
              <div className="text-xs font-medium text-green-600/80">사실</div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-red-100/50 p-4">
            <XCircle className="size-6 text-red-500" />
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{stats.false}</div>
              <div className="text-xs font-medium text-red-500/80">거짓</div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-blue-100/50 p-4">
            <MessageSquare className="size-6 text-blue-500" />
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{stats.opinion}</div>
              <div className="text-xs font-medium text-blue-500/80">의견</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Card List */}
      <div className="flex flex-col gap-4">
        {sentences.map((sentence) => {
          if (isClaim(sentence)) {
            const style = getClaimStyle(sentence);
            const Icon = style.icon;
            const isPending = sentence.status === "pending";

            return (
              <Card
                key={sentence.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(sentence.id, el);
                  else cardRefs.current.delete(sentence.id);
                }}
                variant={style.cardVariant}
                className={cn(
                  "flex flex-col gap-4 transition-all duration-300 cursor-pointer",
                  activeSentenceId === sentence.id && "ring-2 ring-primary",
                )}
                onClick={() => onCardClick(sentence.id)}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("size-5", style.iconColor)} />
                    <Badge variant={style.badgeVariant}>{style.label}</Badge>
                  </div>
                  <p
                    className={cn(
                      "text-base leading-relaxed text-foreground",
                      sentence.status === "ignored" && "line-through text-muted-foreground",
                    )}
                  >
                    {sentence.text}
                  </p>
                </div>

                {isPending && sentence.verdict === "FALSE" && sentence.suggestion && (
                  <div className="flex flex-col gap-2 rounded-lg bg-green-50 p-4">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                      <RefreshCw className="size-4" />
                      <span>수정 제안</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {sentence.suggestion}
                    </p>
                  </div>
                )}

                {sentence.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {sentence.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5
                          text-xs text-muted-foreground transition-colors
                          hover:bg-muted/80 hover:text-foreground
                        `}
                      >
                        <ExternalLink className="size-3" />
                        {source.title}
                      </a>
                    ))}
                  </div>
                )}

                {isPending && sentence.verdict === "FALSE" && (
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      className="flex-1 gap-2 bg-green-500 text-white hover:bg-green-600"
                      onClick={() => onApply(sentence.id)}
                    >
                      <RefreshCw className="size-4" />
                      수정 적용
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => onIgnore(sentence.id)}
                    >
                      <X className="size-4" />
                      무시
                    </Button>
                  </div>
                )}
              </Card>
            );
          }

          if (isOpinion(sentence)) {
            return (
              <Card
                key={sentence.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(sentence.id, el);
                  else cardRefs.current.delete(sentence.id);
                }}
                variant="opinion"
                className={cn(
                  "flex flex-col gap-4 cursor-pointer",
                  activeSentenceId === sentence.id && "ring-2 ring-primary",
                )}
                onClick={() => onCardClick(sentence.id)}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-5 text-blue-500" />
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-600">
                    의견
                  </span>
                </div>
                <p className="text-base leading-relaxed text-foreground">{sentence.text}</p>
                <div className="mt-1 rounded-lg bg-blue-50 p-3 text-sm text-blue-600/90">
                  {sentence.reason}
                </div>
              </Card>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default ResultsContent;
