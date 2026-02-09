"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const { data } = await api.get("/v1/users/me");
      console.log("[API] GET /v1/users/me - Response:", data);
      setUser(data.user);
    } catch {
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    console.log("[API] POST /v1/auth/login - Payload:", {
      email,
      password: "***",
    });
    const { data } = await api.post("/v1/auth/login", { email, password });
    console.log("[API] POST /v1/auth/login - Response:", data);
    localStorage.setItem("accessToken", data.tokens.access.token);
    localStorage.setItem("refreshToken", data.tokens.refresh.token);
    setUser(data.user);
    router.push("/dashboard");
  };

  const register = async (email: string, password: string, name: string) => {
    console.log("[API] POST /v1/auth/register - Payload:", {
      email,
      password: "***",
      name,
    });
    const { data } = await api.post("/v1/auth/register", {
      email,
      password,
      name,
    });
    console.log("[API] POST /v1/auth/register - Response:", data);
    localStorage.setItem("accessToken", data.tokens.access.token);
    localStorage.setItem("refreshToken", data.tokens.refresh.token);
    setUser(data.user);
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/v1/auth/logout", { refreshToken });
        console.log("[API] POST /v1/auth/logout - Done");
      }
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      router.push("/login");
    }
  };

  const forgotPassword = async (email: string) => {
    console.log("[API] POST /v1/auth/forgot-password - Payload:", { email });
    await api.post("/v1/auth/forgot-password", { email });
    console.log("[API] POST /v1/auth/forgot-password - Done");
  };

  const resetPassword = async (token: string, password: string) => {
    console.log("[API] POST /v1/auth/reset-password - Payload:", {
      token: "***",
      password: "***",
    });
    await api.post(`/v1/auth/reset-password?token=${token}`, { password });
    console.log("[API] POST /v1/auth/reset-password - Done");
  };

  const verifyEmail = async (token: string) => {
    console.log("[API] POST /v1/auth/verify-email");
    await api.post(`/v1/auth/verify-email?token=${token}`);
    console.log("[API] POST /v1/auth/verify-email - Done");
  };

  const sendVerificationEmail = async () => {
    console.log("[API] POST /v1/auth/send-verification-email");
    await api.post("/v1/auth/send-verification-email");
    console.log("[API] POST /v1/auth/send-verification-email - Done");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        sendVerificationEmail,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
