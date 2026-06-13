import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-store";

export function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAuth();
  if (typeof window === "undefined") return null;
  if (!user) return <Navigate to="/identificar" />;
  return <>{children}</>;
}
