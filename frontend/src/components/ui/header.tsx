"use client";

import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  PawPrint, 
  Users, 
  LayoutGrid,
  Sparkles
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  userName?: string;
  userAvatar?: string; // Adicionei suporte a avatar opcional
  onSignOut?: () => void;
}

export function Header({ userName = "Usuário", userAvatar, onSignOut }: HeaderProps) {
  const location = useLocation();

  // Função para verificar se a rota está ativa
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
    <header className="sticky top-0 z-50 w-full mb-6">
      {/* Efeito de Vidro (Glassmorphism) */}
      <div className="absolute inset-0 bg-white/70 dark:bg-stone-950/70 backdrop-blur-lg border-b border-white/20 dark:border-white/5 shadow-sm" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* --- 1. LOGO & BRANDING --- */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
              <DogIcon className="w-6 h-6 text-white" />
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-200 animate-pulse" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-black bg-gradient-to-r from-stone-800 to-stone-600 dark:from-stone-100 dark:to-stone-400 bg-clip-text text-transparent">
                PetManager
              </h1>
            </div>
          </Link>

          {/* --- 2. NAVEGAÇÃO CENTRAL (PAGINAÇÃO DE ROTAS) --- */}
          {/* Aqui você sabe em qual "página" do sistema está */}
          <nav className="flex items-center gap-1 p-1 bg-stone-100/50 dark:bg-stone-900/50 rounded-full border border-stone-200 dark:border-stone-800 backdrop-blur-md">
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
                    {/* Fundo Animado do Item Ativo */}
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

          <div className="flex items-center gap-3">
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

// Mantive o DogIcon original como SVG para não quebrar caso não tenha lucide, 
// mas recomendo substituir pelo <Dog /> do Lucide se possível.
function DogIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
      <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
      <path d="M8 14v.5" />
      <path d="M16 14v.5" />
      <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
      <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
    </svg>
  );
}