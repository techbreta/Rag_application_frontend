"use client";

import { QueryProvider } from "@/lib/queryClient";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid #334155",
              borderRadius: "12px",
            },
            success: {
              iconTheme: {
                primary: "#8b5cf6",
                secondary: "#f1f5f9",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#f1f5f9",
              },
            },
          }}
        />
      </AuthProvider>
    </QueryProvider>
  );
}
