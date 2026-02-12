import { HttpResponse, http } from "msw";

import { mockFactCheckResponse, mockHistoryItems, mockTestSentences } from "./data/factcheck";

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

  http.get(`${BASE_URL}/factcheck`, ({ request }) => {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
    const limit = Math.max(1, Number(url.searchParams.get("limit") ?? "5") || 5);

    const total = mockHistoryItems.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = mockHistoryItems.slice(start, end);

    return HttpResponse.json({
      items,
      pagination: { page, limit, total, totalPages },
    });
  }),

  http.get(`${BASE_URL}/factcheck/:id`, ({ params }) => {
    const item = mockHistoryItems.find((i) => i.id === params.id);
    if (!item) {
      return HttpResponse.json({ message: "Not Found" }, { status: 404 });
    }
    return HttpResponse.json({
      ...mockFactCheckResponse,
      id: params.id,
      title: item.title,
    });
  }),

  http.delete(`${BASE_URL}/factcheck/:id`, () => {
    return HttpResponse.json({ success: true });
  }),
];
