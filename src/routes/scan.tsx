import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import jsQR from "jsqr";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Compass,
  MapPin,
  Navigation,
  QrCode,
  ScanLine,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-store";
import { getGuia, getSala, getWorkshop, salas } from "@/lib/mock-data";
import {
  buildRotaEntreSalas,
  buildSalaCode,
  parseSalaFromQr,
} from "@/lib/qr-utils";

type ScanSearch = { codigo?: string };

export const Route = createFileRoute("/scan")({
  head: () => ({ meta: [{ title: "Escanear QR · Caldeira Workshop Guide" }] }),
  validateSearch: (search: Record<string, unknown>): ScanSearch => ({
    codigo: typeof search.codigo === "string" ? search.codigo : undefined,
  }),
  component: () => (
    <RequireAuth>
      <ScanPage />
    </RequireAuth>
  ),
});

function ScanPage() {
  const user = useAuth();
  const { codigo } = useSearch({ from: "/scan" });
  const navigate = useNavigate();
  const [detectedSalaId, setDetectedSalaId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Se o link/QR já trouxe ?codigo=... resolve imediatamente
  useEffect(() => {
    if (!codigo) return;
    const sala = parseSalaFromQr(codigo);
    if (sala) {
      setDetectedSalaId(sala.id);
      toast.success(`QR identificado: ${sala.nome}`);
    } else {
      setError("Não reconhecemos esse QR Code.");
    }
  }, [codigo]);

  if (!user) return null;

  const workshop = getWorkshop(user.workshop_id)!;
  const salaCorreta = getSala(workshop.sala_id)!;
  const salaLida = detectedSalaId ? getSala(detectedSalaId) : null;

  const handleDetected = useCallback(
    (raw: string) => {
      const sala = parseSalaFromQr(raw);
      if (!sala) {
        setError(`Código não reconhecido: "${raw.slice(0, 40)}"`);
        toast.error("QR Code não reconhecido");
        return;
      }
      setError(null);
      setDetectedSalaId(sala.id);
      toast.success(`Sala identificada: ${sala.nome}`);
      navigate({ to: "/scan", search: { codigo: buildSalaCode(sala.id) } });
    },
    [navigate],
  );

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
          <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <ScanLine className="h-4 w-4" />
            Confirmação na porta
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Estou na sala certa?
          </h1>
          <p className="mt-1 text-muted-foreground">
            Aponte a câmera para o QR Code colado na porta do workshop. Nós
            confirmamos se é o seu — e, se não for, mostramos como chegar.
          </p>
        </header>

        {!salaLida && (
          <Scanner onDetected={handleDetected} onError={setError} />
        )}

        {error && !salaLida && (
          <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Não conseguimos ler</p>
              <p className="opacity-90">{error}</p>
            </div>
          </div>
        )}

        {salaLida && (
          <ResultPanel
            salaLida={salaLida}
            salaCorreta={salaCorreta}
            workshopNome={workshop.nome}
            workshopHorario={`${workshop.horario_inicio} – ${workshop.horario_fim}`}
            guiaNome={getGuia(workshop.guia_id)?.nome ?? ""}
            onReset={() => {
              setDetectedSalaId(null);
              setError(null);
              navigate({ to: "/scan", search: {} });
            }}
          />
        )}

        {!salaLida && <ManualPanel onSelect={handleDetected} />}
      </div>
    </AppShell>
  );
}

/* --------------------------------- Scanner -------------------------------- */

function Scanner({
  onDetected,
  onError,
}: {
  onDetected: (raw: string) => void;
  onError: (msg: string | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [starting, setStarting] = useState(false);

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setActive(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const tick = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const img = ctx.getImageData(0, 0, w, h);
    const code = jsQR(img.data, img.width, img.height, {
      inversionAttempts: "dontInvert",
    });
    if (code && code.data) {
      stop();
      onDetected(code.data);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [onDetected, stop]);

  const start = useCallback(async () => {
    onError(null);
    setStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      video.setAttribute("playsinline", "true");
      await video.play();
      setActive(true);
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : "Não foi possível acessar a câmera do dispositivo.";
      onError(
        `${msg} Você ainda pode digitar o código manualmente abaixo.`,
      );
    } finally {
      setStarting(false);
    }
  }, [onError, tick]);

  return (
    <section className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
      <div className="relative aspect-square w-full bg-black">
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${active ? "opacity-100" : "opacity-0"}`}
          muted
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />

        {!active && (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/15 to-secondary/20">
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/90 text-primary shadow-glow">
                <QrCode className="h-8 w-8" />
              </div>
              <p className="mt-4 max-w-xs text-sm text-foreground/80">
                Toque para abrir a câmera e ler o QR Code da porta.
              </p>
              <button
                onClick={start}
                disabled={starting}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
              >
                <ScanLine className="h-4 w-4" />
                {starting ? "Abrindo câmera..." : "Iniciar leitura"}
              </button>
            </div>
          </div>
        )}

        {active && (
          <>
            {/* moldura de mira */}
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="relative h-2/3 w-2/3 rounded-2xl">
                <Corner className="-left-1 -top-1 border-l-4 border-t-4" />
                <Corner className="-right-1 -top-1 border-r-4 border-t-4" />
                <Corner className="-bottom-1 -left-1 border-b-4 border-l-4" />
                <Corner className="-bottom-1 -right-1 border-b-4 border-r-4" />
                <div className="absolute inset-x-0 top-1/2 h-0.5 animate-pulse bg-primary/80" />
              </div>
            </div>
            <button
              onClick={stop}
              className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-xs font-semibold text-foreground shadow-soft backdrop-blur"
            >
              <XCircle className="h-4 w-4" />
              Parar câmera
            </button>
          </>
        )}
      </div>
    </section>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <span
      className={`absolute h-6 w-6 rounded-md border-primary ${className}`}
    />
  );
}

/* ------------------------------- Manual entry ------------------------------ */

function ManualPanel({ onSelect }: { onSelect: (raw: string) => void }) {
  return (
    <section className="rounded-3xl border border-dashed border-border bg-card/60 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Compass className="h-4 w-4 text-primary" />
        Sem câmera? Simule a leitura
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Útil para demonstração — selecione qual porta você está visitando.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {salas.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(buildSalaCode(s.id))}
            className="rounded-2xl border border-border/70 bg-background p-3 text-left text-sm transition hover:border-primary/60 hover:bg-accent/50"
          >
            <p className="font-semibold leading-tight">{s.nome}</p>
            <p className="text-xs text-muted-foreground">
              {s.bloco} · {s.andar}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- Result --------------------------------- */

function ResultPanel({
  salaLida,
  salaCorreta,
  workshopNome,
  workshopHorario,
  guiaNome,
  onReset,
}: {
  salaLida: ReturnType<typeof getSala>;
  salaCorreta: ReturnType<typeof getSala>;
  workshopNome: string;
  workshopHorario: string;
  guiaNome: string;
  onReset: () => void;
}) {
  if (!salaLida || !salaCorreta) return null;
  const acertou = salaLida.id === salaCorreta.id;

  if (acertou) {
    return (
      <section className="overflow-hidden rounded-3xl border border-success/30 bg-success/5 p-6 shadow-soft">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-success text-success-foreground shadow-glow">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-success">
              É aqui mesmo!
            </p>
            <h2 className="mt-1 text-xl font-bold">{salaLida.nome}</h2>
            <p className="mt-1 text-sm text-foreground/80">
              Você está na porta certa para <strong>{workshopNome}</strong>{" "}
              ({workshopHorario}). Pode entrar — {guiaNome} está te esperando.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Ir para meu guia
          </Link>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-accent"
          >
            <ScanLine className="h-4 w-4" />
            Escanear outro
          </button>
        </div>
      </section>
    );
  }

  const passos = buildRotaEntreSalas(salaLida, salaCorreta);

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-destructive/30 bg-destructive/5 p-6 shadow-soft">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-destructive text-destructive-foreground shadow-soft">
            <XCircle className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-destructive">
              Sala errada
            </p>
            <h2 className="mt-1 text-xl font-bold">Você não está no lugar certo</h2>
            <p className="mt-1 text-sm text-foreground/80">
              Esta porta é da <strong>{salaLida.nome}</strong> — seu workshop é
              em outra sala. Sem stress, segue o caminho abaixo.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card title="Você está aqui" tone="muted" sala={salaLida} />
        <Card title="Seu destino" tone="primary" sala={salaCorreta} />
      </div>

      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Navigation className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Como chegar ao seu workshop
            </p>
            <h3 className="text-lg font-semibold">
              De {salaLida.bloco} → {salaCorreta.nome}
            </h3>
          </div>
        </div>
        <ol className="mt-5 space-y-4">
          {passos.map((p, i) => (
            <li key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                    i === passos.length - 1
                      ? "bg-gradient-brand text-primary-foreground shadow-glow"
                      : "bg-accent text-accent-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                {i < passos.length - 1 && (
                  <div className="mt-1 h-full w-px flex-1 bg-border" />
                )}
              </div>
              <p
                className={`pb-2 pt-1.5 text-sm ${
                  i === passos.length - 1 ? "font-semibold" : ""
                }`}
              >
                {p}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/rota"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <MapPin className="h-4 w-4" />
            Ver mapa do destino
          </Link>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-accent"
          >
            <ScanLine className="h-4 w-4" />
            Escanear de novo
          </button>
        </div>
      </section>
    </section>
  );
}

function Card({
  title,
  tone,
  sala,
}: {
  title: string;
  tone: "muted" | "primary";
  sala: NonNullable<ReturnType<typeof getSala>>;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-soft ${
        tone === "primary"
          ? "border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10"
          : "border-border/60 bg-muted/40"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <p className="mt-1 font-semibold leading-tight">{sala.nome}</p>
      <p className="text-xs text-muted-foreground">
        {sala.bloco} · {sala.andar}
      </p>
    </div>
  );
}
