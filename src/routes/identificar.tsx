import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authStore } from "@/lib/auth-store";
import { toast } from "sonner";

export const Route = createFileRoute("/identificar")({
  head: () => ({
    meta: [
      { title: "Identificação · Caldeira Workshop Guide" },
      { name: "description", content: "Acesse com o e-mail da sua inscrição." },
    ],
  }),
  component: Identificar,
});

function Identificar() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = authStore.requestOtp(email);
      setLoading(false);
      if (!res.ok) {
        toast.error(res.error ?? "Erro ao validar e-mail");
        return;
      }
      toast.success(`Código enviado! (demo: ${res.code})`, { duration: 8000 });
      setStep("otp");
    }, 600);
  };

  const handleOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = authStore.verifyOtp(email, otp);
      setLoading(false);
      if (!res.ok) {
        toast.error(res.error ?? "Código inválido");
        return;
      }
      toast.success("Bem-vindo(a)!");
      navigate({ to: "/dashboard" });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <Logo />
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </header>

      <main className="mx-auto flex max-w-md flex-col px-4 py-10">
        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-elevated">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
            {step === "email" ? <Mail className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight">
            {step === "email" ? "Identifique-se" : "Confirme o código"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {step === "email"
              ? "Informe o e-mail usado na inscrição do evento."
              : `Enviamos um código de 6 dígitos para ${email}.`}
          </p>

          {step === "email" ? (
            <form onSubmit={handleEmail} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail da inscrição</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-full bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95"
              >
                {loading ? "Validando…" : "Enviar código"}
              </Button>
              <p className="rounded-xl bg-muted/60 p-3 text-center text-xs text-muted-foreground">
                Demo: use <span className="font-mono font-semibold">lucas@exemplo.com</span>,{" "}
                <span className="font-mono font-semibold">ana@exemplo.com</span> ou{" "}
                <span className="font-mono font-semibold">pedro@exemplo.com</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleOtp} className="mt-6 space-y-5">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button
                type="submit"
                disabled={loading || otp.length < 6}
                className="h-11 w-full rounded-full bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95"
              >
                {loading ? "Verificando…" : "Acessar guia"}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                }}
                className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
              >
                Usar outro e-mail
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
