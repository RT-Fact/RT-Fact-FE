import { Outlet } from "react-router";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
