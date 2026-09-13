import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CatSvg } from "@/components/amara/cat-svg";
import { NEST_BPS, PLATFORM_BPS, TAX_BPS } from "@/lib/site";

export const Route = createFileRoute("/how")({ component: HowPage });

function HowPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10">
      <header>
        <p className="text-mom font-mono text-xs tracking-[0.3em] uppercase">Manual</p>
        <h1 className="mt-2 text-4xl font-extrabold">How the grove works</h1>
      </header>

      <section className="grid gap-6">
        <Rule
          title="You are Amara"
          body="Move with the pad or WASD / arrows. Kittens on your cell travel with you. You cannot step into the puddle or the tree."
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <KittenCard id={2} name="Ivy" body="Circles the tree, always clockwise." />
          <KittenCard id={1} name="Splashy" body="Runs for water. A meow is the way out." />
          <KittenCard id={3} name="Moony" body="Walks toward the moon each turn." />
        </div>
        <Rule
          title="Meow and wait"
          body="Meow pulls every stray kitten one step closer. It rests for three turns. Wait lets the litter move without you."
        />
        <Rule
          title="The moon"
          body="It walks one column each move. When it leaves the board, darkness falls — finish if you can; the night still counts."
        />
        <Rule
          title="United"
          body="All three kittens on Amara's cell. Yarn for a clean night. Hints cost five yarn."
        />
      </section>

      <section className="border-line rounded-lg border p-6">
        <h2 className="text-2xl font-bold">The Nest</h2>
        <p className="text-mute mt-3">
          LetsCash quotes ETH. {TAX_BPS / 100}% on the pad — {PLATFORM_BPS / 100}%
          platform, {NEST_BPS / 100}% to The Nest. Harvest is permissionless; ETH
          stays in the Nest. Ops pull. The board does not mint bricks. Trade is
          the chart; this site is the grove.
        </p>
      </section>

      <Button asChild size="lg">
        <Link to="/play">Play a night</Link>
      </Button>
    </main>
  );
}

function Rule({ title, body }: { title: string; body: string }) {
  return (
    <article>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-mute mt-2">{body}</p>
    </article>
  );
}

function KittenCard({ id, name, body }: { id: 1 | 2 | 3; name: string; body: string }) {
  return (
    <article className="border-line rounded-lg border p-4">
      <div className="mx-auto h-20 w-20">
        <CatSvg catId={id} />
      </div>
      <h3 className="mt-2 text-center font-bold">{name}</h3>
      <p className="text-mute mt-1 text-center text-sm">{body}</p>
    </article>
  );
}
