import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Clock, Coffee, Mic, PartyPopper, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { agenda, evento, type AgendaItem } from "@/lib/mock-data";

export const Route = createFileRoute("/agenda")({
  head: () => ({ meta: [{ title: "Agenda · Caldeira Workshop Guide" }] }),
  component: () => (
    <RequireAuth>
      <AgendaPage />
    </RequireAuth>
  ),
});

const ICON: Record<AgendaItem["tipo"], React.ComponentType<{ className?: string }>> = {
  credenciamento: Sparkles,
  workshop: Mic,
  intervalo: Coffee,
  encerramento: PartyPopper,
  extra: Calendar,
};

function AgendaPage() {
  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-sm font-medium text-primary">Agenda do evento</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{evento.nome}</h1>
        <p className="mt-1 text-muted-foreground">{evento.data}</p>
      </header>

      <ol className="relative space-y-4 border-l-2 border-dashed border-border pl-6 md:pl-8">
        {agenda.map((item) => {
          const Icon = ICON[item.tipo];
          return (
            <li key={item.id} className="relative">
              <span className="absolute -left-[34px] md:-left-[42px] grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-primary-foreground shadow-glow">
                <Icon className="h-4 w-4" />
              </span>
              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Clock className="h-4 w-4" />
                  {item.horario}
                </div>
                <h3 className="mt-1.5 text-lg font-semibold">{item.titulo}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.descricao}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </AppShell>
  );
}
