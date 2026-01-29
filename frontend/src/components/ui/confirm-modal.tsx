import { X, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "destructive" | "default";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
  variant = "destructive"
}: ConfirmModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={!isLoading ? onClose : undefined} 
      />

      <div className="relative bg-white dark:bg-stone-900 w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 animate-in fade-in zoom-in-95 duration-200">
        
        {!isLoading && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:flex-row gap-4">
          
          <div className={`p-3 rounded-full shrink-0 ${
            variant === 'destructive' 
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500' 
              : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {title}
            </h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>

          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto ${
               variant === 'destructive' 
               ? 'bg-red-600 hover:bg-red-700 text-amber-900 dark:text-stone-200' 
               : 'bg-amber-500 hover:bg-amber-600 text-amber-900 dark:text-stone-200'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}