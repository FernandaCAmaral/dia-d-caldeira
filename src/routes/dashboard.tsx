import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Clock, MapPin, MessageCircle, Navigation, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-store";
import { getGuia, getSala, getWorkshop, evento } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Meu Guia · Caldeira Workshop Guide" }],
  }),
  component: () => (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ),
});

function DashboardPage() {
  const user = useAuth();
  if (!user) return null;
  const workshop = getWorkshop(user.workshop_id)!;
  const sala = getSala(workshop.sala_id)!;
  const guia = getGuia(workshop.guia_id)!;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome */}
        <section className="overflow-hidden rounded-3xl bg-gradient-brand p-6 text-primary-foreground shadow-elevated md:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <Avatar className="h-16 w-16 ring-2 ring-white/40">
              <AvatarImage src={user.foto} />
              <AvatarFallback className="bg-white/15 text-primary-foreground">
                {user.nome[0]}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm/none opacity-80">{evento.nome}</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                Olá, {user.nome.split(" ")[0]} 👋
              </h1>
              <p className="mt-1 text-sm opacity-90">
                Aqui está tudo o que você precisa para hoje.
              </p>
            </div>
            <Badge className="rounded-full border-0 bg-white/15 text-primary-foreground backdrop-blur">
              {user.status_confirmacao === "confirmado" ? "Inscrição confirmada" : "Pendente"}
            </Badge>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Workshop card */}
          <Card>
            <CardHeader icon={Calendar} title="Seu workshop" tone="primary" />
            <h3 className="mt-3 text-lg font-semibold">{workshop.nome}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{workshop.descricao}</p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {workshop.horario_inicio} – {workshop.horario_fim}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Capacidade: {workshop.capacidade} pessoas
            </div>
          </Card>

          {/* Local card */}
          <Card>
            <CardHeader icon={MapPin} title="Local" tone="secondary" />
            <h3 className="mt-3 text-lg font-semibold">{sala.nome}</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <Info label="Bloco" value={sala.bloco} />
              <Info label="Andar" value={sala.andar} />
              <Info label="Distância" value={sala.distancia} />
              <Info label="Tempo a pé" value={sala.tempo_estimado} />
            </div>
            <Link
              to="/rota"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <Navigation className="h-4 w-4" />
              Como chegar
            </Link>
          </Card>

          {/* Guia card */}
          <Card className="md:col-span-2">
            <CardHeader icon={Users} title="Seu guia responsável" tone="primary" />
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                <AvatarImage src={guia.foto} />
                <AvatarFallback>{guia.nome[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-semibold">{guia.nome}</h3>
                <p className="text-sm text-muted-foreground">{guia.cargo}</p>
              </div>
              <a
                href={`https://wa.me/${guia.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-success px-5 py-2.5 text-sm font-semibold text-success-foreground shadow-soft hover:opacity-95"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-3xl border border-border/60 bg-card p-6 shadow-soft ${className}`}
    >
      {children}
    </section>
  );
}

function CardHeader({
  icon: Icon,
  title,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tone: "primary" | "secondary";
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`grid h-10 w-10 place-items-center rounded-xl ${
          tone === "primary" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-semibold">{value}</p>
    </div>
  );
}
