import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand shadow-glow">
        <span className="text-base font-black text-primary-foreground">C</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-bold tracking-tight">Caldeira</span>
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Workshop Guide
        </span>
      </div>
    </Link>
  );
}
