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
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: "#7c3aed",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </AuthProvider>
    </QueryProvider>
  );
}

export default Providers;

