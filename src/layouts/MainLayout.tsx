import { Outlet } from "react-router";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const MainLayout = () => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background font-sans text-foreground antialiased">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
