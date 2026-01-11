import { HttpResponse, http } from "msw";

import { mockFactCheckResponse, mockTestSentences } from "./data/factcheck";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export const handlers = [
  http.post(`${BASE_URL}/factcheck`, () => {
    return HttpResponse.json(mockFactCheckResponse);
  }),

  http.patch(`${BASE_URL}/factcheck/:factcheckId/claims/:claimId/apply`, ({ params }) => {
    const claim = mockTestSentences.find((s) => s.id === params.claimId);
    const appliedText = claim?.type === "claim" ? (claim.suggestion ?? "") : "";

    return HttpResponse.json({
      id: params.claimId,
      status: "applied",
      appliedText,
      updatedAt: new Date().toISOString(),
    });
  }),

  http.patch(`${BASE_URL}/factcheck/:factcheckId/claims/:claimId/ignore`, ({ params }) => {
    return HttpResponse.json({
      id: params.claimId,
      status: "ignored",
      updatedAt: new Date().toISOString(),
    });
  }),
];
