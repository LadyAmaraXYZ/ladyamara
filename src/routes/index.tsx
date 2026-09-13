import { createFileRoute, Link } from "@tanstack/react-router";
import { FamilyMark } from "@/components/amara/cat-svg";
import { Button } from "@/components/ui/button";
import { CaBar } from "@/components/ca-bar";
import { DOLLAR, KITTENS, LINE, NAME, SLOGAN, tokenUrl } from "@/lib/site";

export const Route = createFileRoute("/")({ component: Home });

const HUE: Record<string, string> = {
  ivy: "text-ivy",
  splash: "text-splash",
  moony: "text-moony",
};

function Home() {
  const trade = tokenUrl();
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-10">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <p className="text-mom font-mono text-xs tracking-[0.35em] uppercase">{DOLLAR}</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight sm:text-6xl">{NAME}</h1>
          <p className="text-mute mt-4 text-lg">{SLOGAN}</p>
          <p className="mt-2 text-ink/80">{LINE}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/play">Play</Link>
            </Button>
            {trade ? (
              <Button asChild variant="ghost" size="lg">
                <a href={trade} target="_blank" rel="noreferrer">
                  Trade
                </a>
              </Button>
            ) : (
              <Button variant="ghost" size="lg" disabled>
                Trade · pending
              </Button>
            )}
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <FamilyMark />
        </div>
      </section>

      <CaBar />

      <section className="grid gap-4 sm:grid-cols-3">
        {KITTENS.map((k) => (
          <article key={k.id} className="border-line rounded-lg border bg-grove/30 p-5">
            <div className={`font-display text-lg font-bold ${HUE[k.hue]}`}>{k.name}</div>
            <p className="text-mute mt-2 text-sm">{k.line}</p>
          </article>
        ))}
      </section>

      <section className="border-line rounded-lg border p-6">
        <h2 className="text-2xl font-bold">The grove is the game.</h2>
        <p className="text-mute mt-3 max-w-2xl">
          You are Amara. Ivy circles the tree. Splashy runs for water. Moony chases
          the moon. Unite them on your cell before the moon walks off the sky. Meow
          pulls them close — once every three moves.
        </p>
        <p className="text-mute mt-3 max-w-2xl">
          Swaps on LetsCash feed The Nest. Play is free. No keeper. No stamp.
        </p>
        <div className="mt-5">
          <Button asChild variant="ghost">
            <Link to="/how">Read the night</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
