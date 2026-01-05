export const HomePage = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Editor Mock Column */}
      <div className="rounded-lg border bg-card p-6 shadow-sm min-h-[300px]">
        <h2 className="mb-4 text-xl font-semibold">Editor Area</h2>
        <p className="text-muted-foreground">
          좌측(데스크톱) 또는 상단(모바일) 영역입니다.
          <br />
          여기에 에디터가 들어갑니다.
        </p>
      </div>

      {/* Results/History Mock Column */}
      <div className="rounded-lg border bg-card p-6 shadow-sm min-h-[300px]">
        <h2 className="mb-4 text-xl font-semibold">Results / History</h2>
        <p className="text-muted-foreground">
          우측(데스크톱) 또는 하단(모바일) 영역입니다.
          <br />
          여기에 검증 결과나 기록이 들어갑니다.
        </p>
      </div>
    </div>
  );
};
