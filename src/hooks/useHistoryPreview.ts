import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { factcheckQueries } from "@/queries/factcheckQueries";
import type { SentenceWithIndices } from "@/types/factcheck";
import { calculateIndices } from "@/utils/calculateIndices";

interface UseHistoryPreviewParams {
  text: string;
  sentences: SentenceWithIndices[];
}

export const useHistoryPreview = ({ text, sentences }: UseHistoryPreviewParams) => {
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  const {
    data: previewData,
    isPending,
    isError,
  } = useQuery(factcheckQueries.detail(selectedHistoryId));

  const isPreviewLoading = selectedHistoryId && isPending;
  const isPreviewError = selectedHistoryId && isError;
  const isPreviewMode = selectedHistoryId && previewData;

  const displayText = isPreviewMode ? previewData.originalText : text;
  const displaySentences = isPreviewMode
    ? calculateIndices(previewData.originalText, previewData.sentences)
    : sentences;

  const cancelPreview = () => {
    setSelectedHistoryId(null);
  };

  return {
    selectedHistoryId,
    setSelectedHistoryId,
    previewData,
    isPreviewLoading: !!isPreviewLoading,
    isPreviewError: !!isPreviewError,
    isPreviewMode: !!isPreviewMode,
    displayText,
    displaySentences,
    cancelPreview,
  };
};
