// src/components/ui/use-toast.tsx
// Inspired by shadcn/ui toast, but simplified to console.log for now as per request.

import * as React from "react";

type ToastVariant = "success" | "destructive" | "default";

interface ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number; // Duration in milliseconds
  action?: React.ReactNode; // Placeholder for future visual toast actions
}

interface ToastContextValue {
  toast: (props: ToastProps) => void;
}

// Context for the toast function (though not strictly necessary for console.log only)
// This sets up a pattern that could be expanded for a visual toaster.
const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

// Hook to access the toast function
function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) {
    // If not within a provider, return a default console.log implementation
    // This makes the hook usable even without a full visual ToastProvider setup for now.
    console.warn(
      "useToast: Component not wrapped in ToastProvider. Using fallback console.log toast."
    );
    return {
      toast: ({ title, description, variant = "default", duration = 5000 }: ToastProps) => {
        const logType = variant === "destructive" ? "error" : variant === "success" ? "info" : "log";
        console[logType](
          `[Toast - ${variant.toUpperCase()}] ${duration/1000}s\nTitle: ${title}\nDescription: ${description}`
        );
      },
    };
  }
  return context;
}

// Provider component (optional for console.log only, but good for structure)
// For a console.log only version, this provider isn't strictly doing much beyond
// providing the context, but it's good practice for future expansion.
const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = React.useCallback(
    ({ title, description, variant = "default", duration = 5000 }: ToastProps) => {
      const logType = variant === "destructive" ? "error" : variant === "success" ? "info" : "log";
      
      // Simple console.log implementation as requested
      console[logType](
        `[Toast - ${variant.toUpperCase()}] ${duration/1000}s\nTitle: ${title}\nDescription: ${description}`
      );

      // In a full implementation, this would trigger showing a visual toast component.
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
    </ToastContext.Provider>
  );
};

// Toaster component (placeholder for where visual toasts would render)
// Not strictly needed for console.log, but completes the typical structure.
const Toaster: React.FC = () => {
  // In a visual implementation, this component would subscribe to toast events
  // (e.g., from a global state or context) and render the toast notifications.
  // For now, it does nothing visually.
  return null; 
};


export { useToast, ToastProvider, Toaster };
export type { ToastProps, ToastVariant };
