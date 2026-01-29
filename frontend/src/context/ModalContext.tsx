import { createContext, useContext, useState, type ReactNode } from "react";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface ConfirmOptions {
  title: string;
  description: string;
  variant?: "destructive" | "default";
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
}

interface ModalContextData {
  confirm: (options: ConfirmOptions) => void;
  close: () => void;
}

const ModalContext = createContext({} as ModalContextData);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirm = (newOptions: ConfirmOptions) => {
    setOptions(newOptions);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setTimeout(() => {
        setOptions(null);
    }, 300);
  };

  const handleConfirmAction = async () => {
    if (!options) return;

    try {
      const result = options.onConfirm();
      if (result instanceof Promise) {
        setIsLoading(true);
        await result;
      }
      close();
    } catch (error) {
      console.error("Erro na ação do modal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalContext.Provider value={{ confirm, close }}>
      {children}
      
      {/* O Modal fica "vivo" aqui no Provider, disponível pro app todo */}
      {options && (
        <ConfirmModal
          isOpen={isOpen}
          onClose={close}
          onConfirm={handleConfirmAction}
          title={options.title}
          description={options.description}
          variant={options.variant}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          isLoading={isLoading}
        />
      )}
    </ModalContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ModalContext);
}