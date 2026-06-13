import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, LifeBuoy, MapPin, MessageCircle, Phone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/suporte")({
  head: () => ({ meta: [{ title: "Suporte · Caldeira Workshop Guide" }] }),
  component: () => (
    <RequireAuth>
      <SuportePage />
    </RequireAuth>
  ),
});

const FAQ = [
  {
    q: "Como sei qual é meu workshop?",
    a: "Após o login, sua tela inicial mostra o workshop em que você está inscrito, com horário, sala e guia responsável.",
  },
  {
    q: "E se eu chegar atrasado?",
    a: "Procure imediatamente a recepção ou entre em contato com seu guia pelo WhatsApp.",
  },
  {
    q: "Posso trocar de workshop?",
    a: "Trocas dependem de disponibilidade. Fale com a organização na recepção principal.",
  },
  {
    q: "Onde fica a recepção?",
    a: "Logo na entrada principal do Instituto Caldeira, no térreo.",
  },
];

function SuportePage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-sm font-medium text-primary">Suporte</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Precisa de ajuda?</h1>
        <p className="mt-1 text-muted-foreground">
          Estamos aqui para garantir que sua experiência seja incrível.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Action
          icon={MessageCircle}
          title="WhatsApp oficial"
          desc="Resposta em minutos"
          href="https://wa.me/5551999990000"
        />
        <Action
          icon={Phone}
          title="Telefone"
          desc="(51) 99999-0000"
          href="tel:+5551999990000"
        />
        <Action
          icon={MapPin}
          title="Recepção"
          desc="Entrada principal · Térreo"
        />
      </div>

      <section className="mt-8 rounded-3xl border border-border/60 bg-card p-2 shadow-soft md:p-4">
        <h2 className="px-4 pt-4 text-lg font-semibold">Perguntas frequentes</h2>
        <ul className="mt-2 divide-y divide-border/60">
          {FAQ.map((f, i) => (
            <li key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-4 text-left hover:bg-accent/40"
              >
                <span className="font-medium">{f.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Botão fixo de ajuda */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-24 right-4 z-20 h-14 rounded-full bg-gradient-brand px-5 text-primary-foreground shadow-glow md:bottom-8">
            <LifeBuoy className="h-5 w-5" />
            Preciso de Ajuda
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Estamos a postos</DialogTitle>
            <DialogDescription>
              Vá até a recepção principal ou chame nosso time pelos contatos abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-2">
            <a
              href="https://wa.me/5551999990000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-success/10 p-4 text-sm font-medium text-success hover:bg-success/15"
            >
              <MessageCircle className="h-5 w-5" />
              Abrir conversa no WhatsApp
            </a>
            <a
              href="tel:+5551999990000"
              className="flex items-center gap-3 rounded-2xl bg-accent p-4 text-sm font-medium hover:bg-accent/70"
            >
              <Phone className="h-5 w-5" />
              Ligar agora
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Action({
  icon: Icon,
  title,
  desc,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  href?: string;
}) {
  const Tag = (href ? "a" : "div") as "a";
  return (
    <Tag
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="block rounded-2xl border border-border/60 bg-card p-5 shadow-soft transition-transform hover:-translate-y-0.5"
    >
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </Tag>
  );
}
