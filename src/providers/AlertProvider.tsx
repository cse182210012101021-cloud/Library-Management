"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, AlertCircleIcon, X } from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "error";
  title: string;
  description?: string;
}

interface ToastContextType {
  showSuccessToast: (title: string, description?: string) => void;
  showErrorToast: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const removeToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback(
    (type: "success" | "error", title: string, description?: string) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const id = Math.random().toString(36).substring(7);
      const newToast: Toast = { id, type, title, description };

      setToast(newToast);

      const newTimeoutId = setTimeout(() => removeToast(), 5000);
      setTimeoutId(newTimeoutId);
    },
    [timeoutId, removeToast]
  );

  const showSuccessToast = useCallback(
    (title: string, description?: string) => {
      showToast("success", title, description);
    },
    [showToast]
  );

  const showErrorToast = useCallback(
    (title: string, description?: string) => {
      showToast("error", title, description);
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showSuccessToast, showErrorToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed left-1/2 top-4 translate-x-[-50%] z-[100] max-w-md w-full pointer-events-none">
        {toast && (
          <div className="pointer-events-auto animate-in slide-in-from-top-5 fade-in duration-300">
            <Alert
              variant={toast.type === "error" ? "destructive" : "default"}
              className="relative pr-12 shadow-lg"
            >
              {toast.type === "success" ? (
                <CheckCircle2Icon
                  color="#7bf1a8"
                  className="h-4 w-4 text-green-300"
                />
              ) : (
                <AlertCircleIcon className="h-4 w-4" />
              )}
              <AlertTitle
                className={toast.type === "success" ? "text-green-300" : ""}
              >
                {toast.title}
              </AlertTitle>
              {toast.description && (
                <AlertDescription
                  className={toast.type === "success" ? "text-green-300" : ""}
                >
                  {toast.description}
                </AlertDescription>
              )}

              <button
                type="button"
                onClick={removeToast}
                className="absolute top-3 right-3 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </Alert>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
