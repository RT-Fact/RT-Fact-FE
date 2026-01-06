import EditorSection from "@/components/Editor/EditorSection";

export const HomePage = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* Editor Column */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <EditorSection />
      </div>

      {/* Results/History Mock Column */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-l border-border p-6 lg:flex-none">
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
