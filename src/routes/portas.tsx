import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Printer, QrCode } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { salas } from "@/lib/mock-data";
import { buildSalaCode, qrImageUrl } from "@/lib/qr-utils";

export const Route = createFileRoute("/portas")({
  head: () => ({
    meta: [{ title: "QR Codes das portas · Caldeira Workshop Guide" }],
  }),
  component: PortasPage,
});

function PortasPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <header>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <QrCode className="h-4 w-4" />
            Operação do evento
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            QR Codes das portas
          </h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            Esses códigos devem ser impressos e fixados na porta de cada sala.
            Quando o participante escanear, o app confirma se é a sala certa
            ou orienta o caminho até o destino correto.
          </p>
          <button
            onClick={() => window.print()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <Printer className="h-4 w-4" />
            Imprimir todos
          </button>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {salas.map((s) => {
            const codigo = buildSalaCode(s.id);
            const url =
              typeof window !== "undefined"
                ? `${window.location.origin}/scan?codigo=${encodeURIComponent(codigo)}`
                : codigo;
            return (
              <article
                key={s.id}
                className="flex flex-col items-center gap-3 rounded-3xl border border-border/60 bg-card p-6 text-center shadow-soft"
              >
                <img
                  src={qrImageUrl(url, 240)}
                  alt={`QR Code para ${s.nome}`}
                  width={240}
                  height={240}
                  className="rounded-2xl border border-border/60 bg-white p-2"
                />
                <div>
                  <h2 className="text-base font-semibold">{s.nome}</h2>
                  <p className="text-xs text-muted-foreground">
                    {s.bloco} · {s.andar}
                  </p>
                </div>
                <code className="rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">
                  {codigo}
                </code>
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
