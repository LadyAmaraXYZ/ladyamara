import { useMemo } from "react";
import {
  type Direction,
  type GameState,
  ALL_CATS,
  ALL_OBJECTS,
  CatId,
  ObjectId,
  Tool,
  applyMove,
  dirFrom,
  moonSet,
  won,
} from "@/lib/amara/engine";
import { CatSvg } from "./cat-svg";
import { cn } from "@/lib/utils";

function Tree() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <span className="bg-wood absolute bottom-[10%] left-[40%] h-[35%] w-[20%] rounded-[15%/10%]" />
      <span className="bg-ivy absolute bottom-[35%] left-[20%] h-[60%] w-[60%] rounded-full brightness-75" />
    </div>
  );
}

function Puddle() {
  return (
    <div
      className="bg-water pointer-events-none absolute top-[10%] left-[10%] h-[80%] w-[80%]"
      style={{ borderRadius: "55% 45% 62% 38% / 48% 60% 40% 52%" }}
      aria-hidden
    />
  );
}

function Moon({ hidden }: { hidden: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute top-[5%] left-1/2 z-[1] h-1/2 w-1/2 -translate-x-1/2 rounded-full bg-moon transition-opacity",
        hidden && "opacity-0",
      )}
      aria-hidden
    >
      <span className="amara-moon-cut absolute h-[90%] w-[90%] translate-x-[40%] rounded-full" />
    </div>
  );
}

const ARROW_DEG: Record<Direction, number> = {
  4: 270,
  7: 0,
  5: 90,
  6: 180,
};

function GhostArrow({ dir }: { dir: Direction }) {
  return (
    <svg
      viewBox="0 0 256 256"
      className="pointer-events-none absolute inset-[8%] z-0 text-ink/25"
      style={{ transform: `rotate(${ARROW_DEG[dir]}deg)` }}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M133 231a8 8 0 0 1-5-7v-40H48a16 16 0 0 1-16-16V88a16 16 0 0 1 16-16h80V32a8 8 0 0 1 14-6l96 96a8 8 0 0 1 0 12l-96 96a8 8 0 0 1-9 1Z"
      />
    </svg>
  );
}

export function Board({ state }: { state: GameState }) {
  const size = state.setup.size;
  const dark = moonSet(state);
  const victory = won(state);
  const waitPos = useMemo(() => applyMove(state, Tool.WAIT), [state]);

  const occupancy = useMemo(() => {
    const map = new Map<string, { cats: CatId[]; objects: ObjectId[] }>();
    const key = (r: number, c: number) => `${r}:${c}`;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) map.set(key(r, c), { cats: [], objects: [] });
    }
    for (const id of ALL_OBJECTS) {
      const p = state.pos[id];
      if (!p) continue;
      const slot = map.get(key(p.row, p.col));
      if (slot) slot.objects.push(id);
    }
    for (const id of ALL_CATS) {
      const p = state.pos[id];
      if (!p) continue;
      const slot = map.get(key(p.row, p.col));
      if (slot) slot.cats.push(id);
    }
    return map;
  }, [state, size]);

  const intent = useMemo(() => {
    const m = new Map<CatId, Direction>();
    for (const id of ALL_CATS) {
      if (id === CatId.MOTHER) continue;
      const cur = state.pos[id];
      const nxt = waitPos[id];
      if (!cur || !nxt) continue;
      const d = dirFrom(cur, nxt);
      if (d) m.set(id, d);
    }
    return m;
  }, [state, waitPos]);

  return (
    <div
      className={cn("amara-grid", dark && "amara-dark", victory && "amara-won")}
      style={{ ["--s-cnt" as string]: String(size) }}
      role="grid"
      aria-label="Amara grove"
    >
      {Array.from({ length: size * size }, (_, i) => {
        const row = Math.floor(i / size);
        const col = i % size;
        const slot = occupancy.get(`${row}:${col}`)!;
        const hasMom = slot.cats.includes(CatId.MOTHER);
        const kittens = slot.cats.filter((c) => c !== CatId.MOTHER);
        const ghost = kittens.map((id) => intent.get(id)).find(Boolean);
        return (
          <div key={i} className="amara-cell" role="gridcell">
            {slot.objects.includes(ObjectId.TREE) && <Tree />}
            {slot.objects.includes(ObjectId.PUDDLE) && <Puddle />}
            {slot.objects.includes(ObjectId.MOON) && <Moon hidden={dark && !victory} />}
            {ghost && !hasMom && <GhostArrow dir={ghost} />}
            {hasMom && (
              <div className="relative z-10 h-full w-full">
                <CatSvg catId={CatId.MOTHER} />
              </div>
            )}
            {kittens.map((id, idx) => (
              <div
                key={id}
                className="absolute z-10 h-full w-full origin-bottom"
                style={{
                  transform: `scale(0.65) translate(${idx === 0 ? "-35%" : idx === 1 ? "35%" : "0"}, 27%)`,
                }}
              >
                <CatSvg catId={id} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}