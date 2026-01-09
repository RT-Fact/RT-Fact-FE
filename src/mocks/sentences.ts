import type { Sentence } from "@/types/factcheck";

export const mockEditorText = `지구는 평평하다는 주장이 있습니다. 그러나 과학적으로 지구는 타원형의 구체입니다. 이것은 개인적인 생각일 뿐입니다. 물은 100도에서 끓습니다.

인공지능이 곧 인류를 지배할 것이라는 우려가 있습니다. 하지만 현재 AI는 범용 인공지능(AGI) 수준에 도달하지 못했습니다. 개인적으로 AI의 발전이 기대됩니다. 첫 번째 컴퓨터 프로그래머는 에이다 러브레이스입니다.

비타민 C는 감기를 예방한다고 알려져 있습니다. 그러나 연구에 따르면 비타민 C는 감기 예방 효과가 미미합니다. 건강은 가장 중요한 자산이라고 생각합니다. 인간의 몸은 약 60%가 수분으로 구성되어 있습니다.

커피를 마시면 키가 안 큰다는 속설이 있습니다. 이는 과학적 근거가 없는 미신입니다. 커피 향은 정말 매력적입니다. 카페인의 반감기는 약 5-6시간입니다.

달에는 공기가 없어서 소리가 전달되지 않습니다. 최초의 달 착륙은 1969년 아폴로 11호에 의해 이루어졌습니다. 우주 탐사는 인류의 가장 위대한 도전입니다. 달의 중력은 지구의 약 1/6입니다.

지구는 평평하다는 주장이 있습니다. 이것은 반복되는 주장입니다. 물은 100도에서 끓습니다. 지구는 평평하다는 주장이 있습니다. 다시 한번 강조하지만, 물은 100도에서 끓습니다.`;

export const mockSentences: Sentence[] = [
  // 첫 번째 단락 - 지구 관련
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

  // 두 번째 단락 - AI 관련
  {
    id: "sentence-5",
    type: "claim",
    text: "인공지능이 곧 인류를 지배할 것이라는 우려가 있습니다.",
    position: 4,
    verdict: "FALSE",
    sources: [
      { title: "MIT Technology Review", url: "https://technologyreview.com/ai-safety" },
      { title: "Nature AI Research", url: "https://nature.com/ai-research" },
    ],
    suggestion: "현재 AI 기술은 특정 작업에 특화되어 있으며, 자율적 의사결정 능력이 제한적입니다.",
    status: "pending",
  },
  {
    id: "sentence-6",
    type: "claim",
    text: "현재 AI는 범용 인공지능(AGI) 수준에 도달하지 못했습니다.",
    position: 5,
    verdict: "TRUE",
    sources: [{ title: "OpenAI Research Blog", url: "https://openai.com/research" }],
    suggestion: null,
    status: "pending",
  },
  {
    id: "sentence-7",
    type: "opinion",
    text: "개인적으로 AI의 발전이 기대됩니다.",
    position: 6,
    reason: "개인적 기대감을 표현한 주관적 문장",
  },
  {
    id: "sentence-8",
    type: "claim",
    text: "첫 번째 컴퓨터 프로그래머는 에이다 러브레이스입니다.",
    position: 7,
    verdict: "TRUE",
    sources: [
      { title: "Computer History Museum", url: "https://computerhistory.org/ada-lovelace" },
    ],
    suggestion: null,
    status: "pending",
  },

  // 세 번째 단락 - 건강/비타민 관련
  {
    id: "sentence-9",
    type: "claim",
    text: "비타민 C는 감기를 예방한다고 알려져 있습니다.",
    position: 8,
    verdict: "FALSE",
    sources: [
      { title: "Cochrane Review", url: "https://cochrane.org/vitamin-c-cold" },
      { title: "Harvard Health", url: "https://health.harvard.edu/cold-prevention" },
    ],
    suggestion:
      "비타민 C는 감기 예방에 뚜렷한 효과가 없으며, 증상 지속 기간을 약간 줄일 수 있습니다.",
    status: "pending",
  },
  {
    id: "sentence-10",
    type: "claim",
    text: "연구에 따르면 비타민 C는 감기 예방 효과가 미미합니다.",
    position: 9,
    verdict: "TRUE",
    sources: [{ title: "PubMed Central", url: "https://ncbi.nlm.nih.gov/pmc/vitamin-c" }],
    suggestion: null,
    status: "pending",
  },
  {
    id: "sentence-11",
    type: "opinion",
    text: "건강은 가장 중요한 자산이라고 생각합니다.",
    position: 10,
    reason: "가치 판단이 포함된 주관적 의견",
  },
  {
    id: "sentence-12",
    type: "claim",
    text: "인간의 몸은 약 60%가 수분으로 구성되어 있습니다.",
    position: 11,
    verdict: "TRUE",
    sources: [{ title: "USGS Water Science", url: "https://usgs.gov/water-science" }],
    suggestion: null,
    status: "pending",
  },

  // 네 번째 단락 - 커피 관련
  {
    id: "sentence-13",
    type: "claim",
    text: "커피를 마시면 키가 안 큰다는 속설이 있습니다.",
    position: 12,
    verdict: "FALSE",
    sources: [
      { title: "Harvard Health Publishing", url: "https://health.harvard.edu/coffee-myths" },
    ],
    suggestion: "커피 섭취와 성장 저해 사이에는 과학적 연관성이 없습니다.",
    status: "pending",
  },
  {
    id: "sentence-14",
    type: "claim",
    text: "이는 과학적 근거가 없는 미신입니다.",
    position: 13,
    verdict: "TRUE",
    sources: [{ title: "Scientific American", url: "https://scientificamerican.com/coffee" }],
    suggestion: null,
    status: "pending",
  },
  {
    id: "sentence-15",
    type: "opinion",
    text: "커피 향은 정말 매력적입니다.",
    position: 14,
    reason: "개인적 선호도를 표현한 주관적 문장",
  },
  {
    id: "sentence-16",
    type: "claim",
    text: "카페인의 반감기는 약 5-6시간입니다.",
    position: 15,
    verdict: "TRUE",
    sources: [
      { title: "Sleep Foundation", url: "https://sleepfoundation.org/caffeine" },
      { title: "FDA", url: "https://fda.gov/caffeine-facts" },
    ],
    suggestion: null,
    status: "pending",
  },

  // 다섯 번째 단락 - 우주 관련
  {
    id: "sentence-17",
    type: "claim",
    text: "달에는 공기가 없어서 소리가 전달되지 않습니다.",
    position: 16,
    verdict: "TRUE",
    sources: [{ title: "NASA Moon Facts", url: "https://nasa.gov/moon" }],
    suggestion: null,
    status: "pending",
  },
  {
    id: "sentence-18",
    type: "claim",
    text: "최초의 달 착륙은 1969년 아폴로 11호에 의해 이루어졌습니다.",
    position: 17,
    verdict: "TRUE",
    sources: [
      { title: "NASA Apollo 11", url: "https://nasa.gov/apollo-11" },
      { title: "Smithsonian Air and Space", url: "https://airandspace.si.edu/apollo-11" },
    ],
    suggestion: null,
    status: "pending",
  },
  {
    id: "sentence-19",
    type: "opinion",
    text: "우주 탐사는 인류의 가장 위대한 도전입니다.",
    position: 18,
    reason: "가치 판단이 포함된 주관적 의견",
  },
  {
    id: "sentence-20",
    type: "claim",
    text: "달의 중력은 지구의 약 1/6입니다.",
    position: 19,
    verdict: "TRUE",
    sources: [{ title: "NASA Science", url: "https://science.nasa.gov/moon-gravity" }],
    suggestion: null,
    status: "pending",
  },

  // 여섯 번째 단락 - 중복 문장 테스트
  {
    id: "sentence-21",
    type: "claim",
    text: "지구는 평평하다는 주장이 있습니다.",
    position: 20,
    verdict: "FALSE",
    sources: [{ title: "NASA - Earth", url: "https://nasa.gov/earth" }],
    suggestion: "지구는 둥글다는 것이 과학적으로 증명되었습니다.",
    status: "pending",
  },
  {
    id: "sentence-22",
    type: "opinion",
    text: "이것은 반복되는 주장입니다.",
    position: 21,
    reason: "주관적 표현이 포함된 문장",
  },
  {
    id: "sentence-23",
    type: "claim",
    text: "물은 100도에서 끓습니다.",
    position: 22,
    verdict: "TRUE",
    sources: [{ title: "물리학 교과서", url: "https://example.com/physics" }],
    suggestion: null,
    status: "pending",
  },
  {
    id: "sentence-24",
    type: "claim",
    text: "지구는 평평하다는 주장이 있습니다.",
    position: 23,
    verdict: "FALSE",
    sources: [{ title: "NASA - Earth", url: "https://nasa.gov/earth" }],
    suggestion: "지구는 둥글다는 것이 과학적으로 증명되었습니다.",
    status: "pending",
  },
  {
    id: "sentence-25",
    type: "claim",
    text: "물은 100도에서 끓습니다.",
    position: 24,
    verdict: "TRUE",
    sources: [{ title: "물리학 교과서", url: "https://example.com/physics" }],
    suggestion: null,
    status: "ignored",
  },
];
