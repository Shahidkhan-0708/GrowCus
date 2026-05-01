"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export type UserRole = "student" | "teacher" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  batch?: string; // For students
  assignedBatches?: string[]; // For teachers
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await apiFetch<User>("/api/me");
        setUser(currentUser);
        localStorage.setItem("growcus_user", JSON.stringify(currentUser));
      } catch {
        setUser(null);
        localStorage.removeItem("growcus_user");
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("growcus_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("growcus_user");
    router.push("/");
  };

  const isAdmin = user?.role === "admin";
  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAdmin,
        isTeacher,
        isStudent,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
