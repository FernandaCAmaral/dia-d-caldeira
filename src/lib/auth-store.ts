import { useEffect, useState } from "react";
import { findParticipanteByEmail, type Participante } from "./mock-data";

const KEY = "caldeira:participante";
const OTP_KEY = "caldeira:otp";

type Listener = () => void;
const listeners = new Set<Listener>();
function emit() {
  listeners.forEach((l) => l());
}

export const authStore = {
  getCurrent(): Participante | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Participante) : null;
  },
  requestOtp(email: string): { ok: boolean; code?: string; error?: string } {
    const p = findParticipanteByEmail(email);
    if (!p) return { ok: false, error: "E-mail não encontrado na base de inscrições." };
    const code = String(Math.floor(100000 + Math.random() * 900000));
    sessionStorage.setItem(OTP_KEY, JSON.stringify({ email, code }));
    // Em produção isso seria enviado por e-mail. No mock retornamos o código.
    return { ok: true, code };
  },
  verifyOtp(email: string, code: string): { ok: boolean; error?: string } {
    const raw = sessionStorage.getItem(OTP_KEY);
    if (!raw) return { ok: false, error: "Solicite um novo código." };
    const parsed = JSON.parse(raw) as { email: string; code: string };
    if (parsed.email.toLowerCase() !== email.toLowerCase()) {
      return { ok: false, error: "E-mail divergente." };
    }
    if (parsed.code !== code.trim()) return { ok: false, error: "Código inválido." };
    const p = findParticipanteByEmail(email)!;
    localStorage.setItem(KEY, JSON.stringify(p));
    sessionStorage.removeItem(OTP_KEY);
    emit();
    return { ok: true };
  },
  logout() {
    localStorage.removeItem(KEY);
    emit();
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useAuth() {
  const [user, setUser] = useState<Participante | null>(() => authStore.getCurrent());
  useEffect(() => {
    setUser(authStore.getCurrent());
    return authStore.subscribe(() => setUser(authStore.getCurrent()));
  }, []);
  return user;
}
