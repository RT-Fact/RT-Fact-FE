import { Link, NavLink } from "react-router";

import { CheckSquare, Home, LogIn, LogOut, Moon, Settings, Sun } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Header = () => {
  // TODO(FE-12): Auth Store 연동 - 현재는 UI 테스트용 Mock
  const isLoggedIn = false;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center pl-4 pr-4">
        {/* Logo */}
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <CheckSquare className="h-6 w-6 text-blue-600" />
            <span className="hidden font-bold sm:inline-block">FactCheck Editor</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-2 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-foreground"
                : "text-foreground/60 transition-colors hover:text-foreground/80"
            }
          >
            <Button variant="ghost" size="sm" className="h-8 w-8 px-0 sm:w-auto sm:px-4">
              <Home className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? "text-foreground"
                : "text-foreground/60 transition-colors hover:text-foreground/80"
            }
          >
            <Button variant="ghost" size="sm" className="h-8 w-8 px-0 sm:w-auto sm:px-4">
              <Settings className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </NavLink>
        </nav>

        {/* Right Side Utility */}
        <div className="ml-auto flex items-center space-x-2">
          <Badge
            variant="secondary"
            className="hidden md:flex h-7 items-center gap-1 rounded-md px-2 text-xs"
          >
            <span className="text-muted-foreground">게스트</span>
          </Badge>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isLoggedIn ? (
            <Button size="sm" variant="ghost" className="h-8 px-3">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">로그아웃</span>
            </Button>
          ) : (
            <Link to="/login">
              <Button size="sm" className="h-8 px-3">
                <LogIn className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">로그인</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
