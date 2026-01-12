const Footer = () => {
  return (
    <footer className="border-t bg-background py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left w-full">
          AI 기반 팩트체크 에디터 © 2026. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
