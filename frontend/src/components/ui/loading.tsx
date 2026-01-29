import { Loader2, PawPrint } from "lucide-react";

export function Loading() {
  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-stone-950 dark:via-neutral-900 dark:to-stone-950">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600 dark:border-stone-800 dark:border-t-amber-500 h-24 w-24" />
        
        <div className="bg-white dark:bg-stone-900 p-4 rounded-full shadow-xl animate-pulse">
          <PawPrint className="h-8 w-8 text-amber-600 dark:text-amber-500" />
        </div>
      </div>
      
      <p className="mt-6 text-lg font-medium text-stone-600 dark:text-stone-400 animate-pulse">
        Carregando sistema...
      </p>
    </div>
  );
}