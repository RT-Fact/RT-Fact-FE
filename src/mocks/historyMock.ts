import { DEFAULT_PAGE_LIMIT } from "@/constants/pagination";
import type { HistoryItem, Pagination } from "@/types/factcheck";

export const mockHistoryItems: HistoryItem[] = Array.from({ length: 150 }, (_, i) => {
  const index = i % 5;
  const templates = [
    {
      title: "2024년 대선 후보 공약 분석",
      preview: "각 후보의 경제 정책 공약을 팩트체크한 결과입니다...",
      checkedCount: 5,
    },
    {
      title: "기후변화 관련 뉴스 검증",
      preview: "최근 보도된 기후변화 관련 기사의 사실 여부를 검증했습니다...",
      checkedCount: 3,
    },
    {
      title: "코로나19 백신 효과 분석",
      preview: "백신 접종 후 항체 형성률에 대한 주장을 검증했습니다...",
      checkedCount: 7,
    },
    {
      title: "인공지능 윤리 가이드라인 점검",
      preview: "AI 기업들의 윤리 가이드라인 준수 여부를 확인했습니다...",
      checkedCount: 4,
    },
    {
      title: "부동산 정책 효과 팩트체크",
      preview: "최근 발표된 부동산 대책의 실제 효과를 분석했습니다...",
      checkedCount: 6,
    },
  ];

  return {
    id: (i + 1).toString(),
    ...templates[index],
    createdAt: new Date(Date.now() - 86400000 * i * 0.5).toISOString(),
  };
});

export const mockHistoryPagination: Pagination = {
  page: 1,
  limit: DEFAULT_PAGE_LIMIT,
  total: 50,
  totalPages: 5,
};
