import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin, Navigation, Route as RouteIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-store";
import { getSala, getWorkshop } from "@/lib/mock-data";

export const Route = createFileRoute("/rota")({
  head: () => ({ meta: [{ title: "Como chegar · Caldeira Workshop Guide" }] }),
  component: () => (
    <RequireAuth>
      <RotaPage />
    </RequireAuth>
  ),
});

function RotaPage() {
  const user = useAuth();
  if (!user) return null;
  const workshop = getWorkshop(user.workshop_id)!;
  const sala = getSala(workshop.sala_id)!;

  return (
    <AppShell>
      <div className="space-y-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao guia
        </Link>

        <header>
          <p className="text-sm font-medium text-primary">Como chegar</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{sala.nome}</h1>
          <p className="mt-1 text-muted-foreground">
            {sala.bloco} · {sala.andar}
          </p>
        </header>

        {/* Mapa simplificado */}
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
          <SimpleMap />
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Entrada principal
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Destino
            </span>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4">
          <Metric icon={Clock} label="Tempo estimado" value={sala.tempo_estimado} />
          <Metric icon={Navigation} label="Distância" value={sala.distancia} />
        </div>

        {/* Stepper */}
        <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <RouteIcon className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">Passo a passo</h2>
          </div>
          <ol className="mt-5 space-y-4">
            {sala.descricao_rota.map((passo, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                      i === sala.descricao_rota.length - 1
                        ? "bg-gradient-brand text-primary-foreground shadow-glow"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < sala.descricao_rota.length - 1 && (
                    <div className="mt-1 h-full w-px flex-1 bg-border" />
                  )}
                </div>
                <p
                  className={`pb-2 pt-1.5 text-sm ${
                    i === sala.descricao_rota.length - 1 ? "font-semibold" : "text-foreground"
                  }`}
                >
                  {passo}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </AppShell>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function SimpleMap() {
  return (
    <svg viewBox="0 0 400 220" className="h-auto w-full">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="oklch(0.62 0.18 250)" />
          <stop offset="1" stopColor="oklch(0.52 0.22 290)" />
        </linearGradient>
      </defs>
      {/* edifício */}
      <rect x="20" y="20" width="360" height="180" rx="16" fill="oklch(0.965 0.008 280)" stroke="oklch(0.92 0.01 280)" />
      {/* salas */}
      <rect x="40" y="40" width="100" height="60" rx="8" fill="oklch(0.95 0.03 290)" />
      <text x="90" y="75" textAnchor="middle" fontSize="10" fill="oklch(0.48 0.02 280)">Hall</text>
      <rect x="160" y="40" width="100" height="60" rx="8" fill="oklch(0.95 0.03 290)" />
      <text x="210" y="75" textAnchor="middle" fontSize="10" fill="oklch(0.48 0.02 280)">Corredor A</text>
      <rect x="280" y="40" width="80" height="60" rx="8" fill="oklch(0.95 0.03 290)" />
      <text x="320" y="75" textAnchor="middle" fontSize="10" fill="oklch(0.48 0.02 280)">Bloco B</text>
      <rect x="40" y="120" width="320" height="60" rx="8" fill="oklch(0.97 0.02 280)" />
      <text x="200" y="155" textAnchor="middle" fontSize="10" fill="oklch(0.48 0.02 280)">Recepção</text>

      {/* caminho */}
      <path
        d="M 80 170 L 80 130 L 210 130 L 210 70 L 320 70"
        fill="none"
        stroke="url(#g)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="6 6"
      />
      {/* início */}
      <circle cx="80" cy="170" r="8" fill="oklch(0.62 0.18 250)" />
      <circle cx="80" cy="170" r="14" fill="oklch(0.62 0.18 250)" opacity="0.25" />
      {/* destino */}
      <circle cx="320" cy="70" r="9" fill="oklch(0.52 0.22 290)" />
      <MapPinSvg x={320} y={70} />
    </svg>
  );
}

function MapPinSvg({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 6} ${y - 22})`}>
      <path
        d="M6 0C2.7 0 0 2.7 0 6c0 4.5 6 10 6 10s6-5.5 6-10C12 2.7 9.3 0 6 0z"
        fill="oklch(0.52 0.22 290)"
        opacity="0"
      />
    </g>
  );
}

// unused import guard
void MapPin;
