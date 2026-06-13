import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Users, Calendar, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { evento } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Caldeira Workshop Guide — Encontre seu workshop" },
      {
        name: "description",
        content:
          "App de orientação para participantes de eventos do Instituto Caldeira. Descubra sua sala, seu guia e o caminho até lá.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <Logo />
        <Link
          to="/identificar"
          className="hidden rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-background md:inline-flex"
        >
          Entrar
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {evento.nome} · {evento.data}
          </span>
          <h1 className="mt-6 text-balance text-4xl font-black tracking-tight md:text-6xl">
            Seu guia pessoal dentro do{" "}
            <span className="text-gradient-brand">Instituto Caldeira</span>
          </h1>
          <p className="mt-5 text-balance text-lg text-muted-foreground md:text-xl">
            Identifique-se com o e-mail da inscrição e descubra em segundos seu workshop,
            seu guia responsável, sua sala e como chegar até lá.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/identificar"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] sm:w-auto"
            >
              Encontrar Meu Guia
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background/70 px-6 py-3.5 text-base font-medium backdrop-blur hover:bg-background"
            >
              Como funciona
            </a>
          </div>
        </div>

        <div id="como-funciona" className="mx-auto mt-20 grid max-w-5xl gap-4 md:grid-cols-3">
          {[
            { icon: Users, t: "Identifique-se", d: "Use o e-mail da inscrição e confirme com o código enviado." },
            { icon: MapPin, t: "Encontre sua sala", d: "Veja o nome do espaço, andar, bloco e horário." },
            { icon: Calendar, t: "Siga sua agenda", d: "Acompanhe o cronograma e seu guia responsável." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Instituto Caldeira · Workshop Guide
      </footer>
    </div>
  );
}
