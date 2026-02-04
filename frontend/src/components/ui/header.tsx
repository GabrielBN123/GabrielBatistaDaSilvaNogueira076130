"use client";

import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  PawPrint,
  Users,
  Sparkles,
  Dog,
  Sun,
  Moon
} from "lucide-react";

interface HeaderProps {
  onSignOut?: () => void;
}

export function Header({ onSignOut }: HeaderProps) {
  const location = useLocation();

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { label: "Meus Pets", path: "/pets", icon: PawPrint },
    { label: "Tutores", path: "/tutores", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full mb-0">
      <div className="absolute inset-0 bg-white/70 dark:bg-stone-950/70 backdrop-blur-lg border-b border-white/20 dark:border-white/5 shadow-sm transition-colors duration-500" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
              <Dog className="w-6 h-6 text-white" />
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-200 animate-pulse" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-black bg-gradient-to-r from-stone-800 to-stone-600 dark:from-stone-100 dark:to-stone-400 bg-clip-text text-transparent">
                PetManager
              </h1>
            </div>
          </Link>

          <nav className="flex items-center gap-1 p-1 bg-stone-100/50 dark:bg-stone-900/50 rounded-full border border-stone-200 dark:border-stone-800 backdrop-blur-md transition-colors duration-300">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;

              return (
                <Link key={item.path} to={item.path}>
                  <div
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer select-none
                      ${active
                        ? "text-white shadow-md"
                        : "text-stone-500 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800"
                      }
                    `}
                  >
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full -z-10 animate-in fade-in zoom-in duration-300" />
                    )}

                    <Icon className={`w-4 h-4 ${active ? "animate-bounce-subtle" : ""}`} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-stone-500 dark:bg-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
            >
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-white rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              ) : (
                <Moon className="w-5 h-5 text-blue-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              )}
            </Button>

            <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 mx-1" />

            {onSignOut && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onSignOut}
                className="text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                title="Sair do sistema"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}