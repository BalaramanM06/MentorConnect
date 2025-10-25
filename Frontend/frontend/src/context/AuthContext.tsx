"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";
import { getCurrentUser, loginUser, signupUser, logoutUser } from "@/utils/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: "MENTOR" | "MENTEE") => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      // const token = localStorage.getItem("token");
      const token = "1234" ;
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Token is present, try fetching user profile
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        localStorage.setItem("userEmail" , currentUser.email) ;
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ✅ Login: Save token → Fetch user → Redirect
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { token } = await loginUser(email, password);
      localStorage.setItem("token", token);

      const userProfile = await getCurrentUser();
      setUser(userProfile);

      if (userProfile.role === "MENTOR") router.push("/mentor/dashboard");
      else router.push("/mentee/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Signup: Save token → Fetch user → Redirect
  const signup = async (name: string, email: string, password: string, role: "MENTOR" | "MENTEE") => {
    try {
      setLoading(true);
      const { token } = await signupUser(name, email, password, role);
      localStorage.setItem("token", token);

      const userProfile = await getCurrentUser();
      setUser(userProfile);

      if (userProfile.role === "MENTOR") router.push("/mentor/dashboard");
      else router.push("/mentee/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout: clear token → clear user → redirect
  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Backend logout failed (continuing locally):", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
