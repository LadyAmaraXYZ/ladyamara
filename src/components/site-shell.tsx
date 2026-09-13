import { Link, useRouterState } from "@tanstack/react-router";
import { Volume2, VolumeX } from "lucide-react";
import { X_HANDLE, X_URL } from "@/lib/site";
import { useGame } from "@/store/game";
import { cn } from "@/lib/utils";
import { CatSvg } from "./amara/cat-svg";

const NAV = [
  { to: "/", label: "Nest" },
  { to: "/play", label: "Play" },
  { to: "/how", label: "How" },
  { to: "/token", label: "Token" },
] as const;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const yarn = useGame((s) => s.yarn);
  const muted = useGame((s) => s.muted);
  const setMuted = useGame((s) => s.setMuted);
  const hideChrome = pathname === "/ops";

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      {!hideChrome && (
        <header className="border-line sticky top-0 z-20 border-b bg-night/90 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-5xl items-center gap-2 px-3 py-2 sm:px-4 sm:py-3">
            <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2" aria-label="Home">
              <span className="size-8 shrink-0">
                <CatSvg catId={0} />
              </span>
              <span className="font-display text-mom text-base font-extrabold tracking-wide sm:text-lg">
                <span className="hidden sm:inline">Lady </span>AMARA
              </span>
            </Link>
            <nav className="flex min-w-0 flex-1 items-center justify-end gap-0 text-xs sm:gap-1 sm:text-sm">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "rounded-md px-2 py-1.5 font-medium sm:px-3 sm:py-2",
                    pathname === n.to ? "text-mom" : "text-mute hover:text-ink",
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="font-mono text-mute hidden text-xs tabular-nums sm:inline">
                {yarn} yarn
              </span>
              <button
                type="button"
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={() => setMuted(!muted)}
                className="text-mute hover:text-ink grid size-9 place-items-center"
              >
                {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
              <a
                href={X_URL}
                target="_blank"
                rel="noreferrer"
                className="text-mute hover:text-mom hidden font-mono text-xs sm:inline"
              >
                {X_HANDLE}
              </a>
            </div>
          </div>
        </header>
      )}
      <div className="min-w-0 flex-1">{children}</div>
      {!hideChrome && (
        <footer className="border-line text-mute border-t px-4 py-6 text-center text-xs">
          Unofficial puzzle. Not affiliated with any other AMARA. Play is free. The
          chart feeds the Nest.
        </footer>
      )}
    </div>
  );
}