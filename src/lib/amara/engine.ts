/** Lady AMARA puzzle engine — mom unites three personality kittens. */

export const CatId = {
  MOTHER: 0,
  SPLASHY: 1,
  IVY: 2,
  MOONY: 3,
} as const;
export type CatId = (typeof CatId)[keyof typeof CatId];

export const ObjectId = {
  MOON: 4,
  TREE: 5,
  PUDDLE: 6,
} as const;
export type ObjectId = (typeof ObjectId)[keyof typeof ObjectId];

export const Direction = {
  UP: 4,
  DOWN: 5,
  LEFT: 6,
  RIGHT: 7,
} as const;
export type Direction = (typeof Direction)[keyof typeof Direction];

export const Tool = {
  MEOW: 8,
  WAIT: 9,
} as const;
export type Tool = (typeof Tool)[keyof typeof Tool];

export type TurnMove = Direction | Tool;

export const Difficulty = { EASY: 1, MEDIUM: 2, HARD: 3 } as const;
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export type Cell = { row: number; col: number };
export type ElementId = CatId | ObjectId;
export type Positions = Record<number, Cell | null>;

export type GameSetup = {
  size: number;
  start: Positions;
  solutions: TurnMove[][];
  difficulty?: Difficulty;
  label?: string;
};

export type GameState = {
  setup: GameSetup;
  pos: Positions;
  moves: TurnMove[];
};

export const ALL_CATS: CatId[] = [CatId.MOTHER, CatId.SPLASHY, CatId.IVY, CatId.MOONY];
export const KITTENS: CatId[] = [CatId.SPLASHY, CatId.IVY, CatId.MOONY];
export const ALL_OBJECTS: ObjectId[] = [ObjectId.MOON, ObjectId.TREE, ObjectId.PUDDLE];
export const ALL_ELEMENTS: ElementId[] = [...ALL_CATS, ...ALL_OBJECTS];
export const DIRS: Direction[] = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
export const TOOLS: Tool[] = [Tool.MEOW, Tool.WAIT];
export const ALL_MOVES: TurnMove[] = [...DIRS, ...TOOLS];

export const DELTA: Record<Direction, [number, number]> = {
  [Direction.UP]: [-1, 0],
  [Direction.DOWN]: [1, 0],
  [Direction.LEFT]: [0, -1],
  [Direction.RIGHT]: [0, 1],
};

const ORTHO: [number, number][] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];
const RING: [number, number][] = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
];

export const MAX_PAR = 5;
export const MEOW_RECOVERY = 3;
const FALLBACK_PAR = 42;

export const EMOJI: Record<number, string> = {
  [CatId.MOTHER]: "🟣",
  [CatId.SPLASHY]: "🔵",
  [CatId.IVY]: "🟢",
  [CatId.MOONY]: "🟡",
  [ObjectId.MOON]: "🌙",
  [ObjectId.TREE]: "🌳",
  [ObjectId.PUDDLE]: "💧",
};

export const CAT_NAME: Record<CatId, string> = {
  [CatId.MOTHER]: "Amara",
  [CatId.SPLASHY]: "Splashy",
  [CatId.IVY]: "Ivy",
  [CatId.MOONY]: "Moony",
};

export const CAT_TONE: Record<CatId, string> = {
  [CatId.MOTHER]: "mom",
  [CatId.SPLASHY]: "splash",
  [CatId.IVY]: "ivy",
  [CatId.MOONY]: "moony",
};

export function same(a: Cell | null, b: Cell | null): boolean {
  return !!a && !!b && a.row === b.row && a.col === b.col;
}

export function add(c: Cell, d: [number, number]): Cell {
  return { row: c.row + d[0], col: c.col + d[1] };
}

export function dirFrom(a: Cell, b: Cell): Direction | null {
  const dr = b.row - a.row;
  const dc = b.col - a.col;
  for (const d of DIRS) {
    const [r, c] = DELTA[d];
    if (r === dr && c === dc) return d;
  }
  return null;
}

export function inBounds(c: Cell, size: number): boolean {
  return c.row >= 0 && c.col >= 0 && c.row < size && c.col < size;
}

export function emptyPositions(): Positions {
  const p: Positions = {};
  for (const id of ALL_ELEMENTS) p[id] = null;
  return p;
}

export function copyPos(p: Positions): Positions {
  const n: Positions = {};
  for (const id of ALL_ELEMENTS) n[id] = p[id] ? { ...p[id]! } : null;
  return n;
}

export function isMom(id: ElementId): boolean {
  return id === CatId.MOTHER;
}

export function isCat(id: ElementId): id is CatId {
  return (ALL_CATS as number[]).includes(id);
}

export function isDir(m: TurnMove): m is Direction {
  return (DIRS as number[]).includes(m);
}

export function isTool(m: TurnMove): m is Tool {
  return (TOOLS as number[]).includes(m);
}

export function isValidCell(state: GameState, cell: Cell, id: ElementId): boolean {
  if (!inBounds(cell, state.setup.size)) return false;
  const tree = state.pos[ObjectId.TREE];
  if (tree && same(cell, tree)) return false;
  const puddle = state.pos[ObjectId.PUDDLE];
  if (puddle && same(cell, puddle) && isMom(id)) return false;
  return true;
}

export function kittensOn(state: GameState, cell: Cell): CatId[] {
  return KITTENS.filter((id) => same(state.pos[id], cell));
}

export function kittensOff(state: GameState, cell: Cell): CatId[] {
  return KITTENS.filter((id) => !same(state.pos[id], cell));
}

export function toolRecovery(state: GameState, tool: Tool): number {
  const last = state.moves.lastIndexOf(tool);
  if (last < 0) return 0;
  const rec = tool === Tool.MEOW ? MEOW_RECOVERY : 0;
  return Math.max(0, rec - (state.moves.length - last));
}

export function moveLimit(state: GameState): number {
  const moon = state.setup.start[ObjectId.MOON];
  if (!moon) return FALLBACK_PAR;
  return state.setup.size - moon.col;
}

export function won(state: GameState): boolean {
  const mom = state.pos[CatId.MOTHER];
  if (!mom) return false;
  return KITTENS.every((id) => same(state.pos[id], mom));
}

export function lost(state: GameState): boolean {
  const limit = moveLimit(state);
  if (limit >= FALLBACK_PAR) return false;
  return state.moves.length >= limit && !won(state);
}

export function moonSet(state: GameState): boolean {
  const moon = state.pos[ObjectId.MOON];
  if (!moon) return false;
  return !inBounds(moon, state.setup.size) && !won(state);
}

function stepToward(state: GameState, from: Cell, target: Cell, id: ElementId): Cell {
  if (same(from, target)) return from;
  const opts = ORTHO.map((d) => add(from, d)).filter((c) => isValidCell(state, c, id));
  if (!opts.length) return from;
  opts.sort((a, b) => {
    const da = Math.abs(a.row - target.row) + Math.abs(a.col - target.col);
    const db = Math.abs(b.row - target.row) + Math.abs(b.col - target.col);
    if (da !== db) return da - db;
    const ma = Math.max(Math.abs(a.row - target.row), Math.abs(a.col - target.col));
    const mb = Math.max(Math.abs(b.row - target.row), Math.abs(b.col - target.col));
    if (ma !== mb) return ma - mb;
    return a.row - b.row || a.col - b.col;
  });
  return opts[0] ?? from;
}

function ivyNext(state: GameState, ivy: Cell): Cell {
  const tree = state.pos[ObjectId.TREE];
  if (!tree) return ivy;
  const ring = RING.map((d) => add(tree, d));
  const idx = ring.findIndex((c) => same(c, ivy));
  if (idx >= 0) {
    const nxt = ring[(idx + 1) % ring.length]!;
    if (isValidCell(state, nxt, CatId.IVY)) return nxt;
  }
  return stepToward(state, ivy, tree, CatId.IVY);
}

function personality(state: GameState, id: CatId, momOld: Cell, momNew: Cell): Cell {
  const cur = state.pos[id];
  if (!cur) return cur as unknown as Cell;
  let next = cur;
  if (id === CatId.MOONY) {
    const moon = state.pos[ObjectId.MOON];
    next = moon ? stepToward(state, cur, moon, id) : cur;
  } else if (id === CatId.IVY) {
    next = ivyNext(state, cur);
  } else if (id === CatId.SPLASHY) {
    const puddle = state.pos[ObjectId.PUDDLE];
    next = puddle ? stepToward(state, cur, puddle, id) : cur;
  }
  if (same(next, momOld) && same(cur, momNew)) return cur;
  return next;
}

export function isLegal(state: GameState, move: TurnMove): boolean {
  const mom = state.pos[CatId.MOTHER];
  if (!mom) return false;
  if (isTool(move)) {
    if (move === Tool.MEOW) return toolRecovery(state, Tool.MEOW) === 0;
    return true;
  }
  return isValidCell(state, add(mom, DELTA[move]), CatId.MOTHER);
}

export function applyMove(state: GameState, move: TurnMove): Positions {
  const mom = state.pos[CatId.MOTHER];
  if (!mom) return copyPos(state.pos);
  const next = copyPos(state.pos);

  if (move === Tool.MEOW) {
    for (const id of kittensOff(state, mom)) {
      const cur = state.pos[id];
      if (cur) next[id] = stepToward(state, cur, mom, id);
    }
  } else {
    let momNew = mom;
    if (isDir(move)) {
      const dest = add(mom, DELTA[move]);
      momNew = isValidCell(state, dest, CatId.MOTHER) ? dest : mom;
      next[CatId.MOTHER] = momNew;
      for (const id of kittensOn(state, mom)) next[id] = { ...momNew };
    }
    for (const id of kittensOff(state, mom)) {
      next[id] = personality({ ...state, pos: state.pos }, id, mom, momNew);
    }
  }

  const moon = state.pos[ObjectId.MOON];
  if (moon && moon.col < state.setup.size) {
    next[ObjectId.MOON] = { row: moon.row, col: moon.col + 1 };
  }

  return next;
}

export function play(state: GameState, move: TurnMove): GameState {
  if (!isLegal(state, move) || won(state) || lost(state)) return state;
  return {
    setup: state.setup,
    pos: applyMove(state, move),
    moves: [...state.moves, move],
  };
}

export function initialState(setup: GameSetup): GameState {
  return { setup, pos: copyPos(setup.start), moves: [] };
}

function keyOf(pos: Positions, recovery: number): string {
  const bits: string[] = [];
  for (const id of ALL_CATS) {
    const c = pos[id];
    bits.push(c ? `${c.row}${c.col}` : "--");
  }
  const moon = pos[ObjectId.MOON];
  bits.push(moon ? String(moon.col) : "-");
  bits.push(String(recovery));
  return bits.join(".");
}

function recoveryAfter(moves: TurnMove[]): number {
  const last = moves.lastIndexOf(Tool.MEOW);
  if (last < 0) return 0;
  return Math.max(0, MEOW_RECOVERY - (moves.length - last));
}

export function solve(setup: GameSetup, all = false): {
  par: number;
  solutions: TurnMove[][];
  difficulty: Difficulty;
} {
  const start = initialState(setup);
  if (won(start)) return { par: 0, solutions: [[]], difficulty: Difficulty.EASY };

  const limit = Math.min(MAX_PAR, setup.start[ObjectId.MOON] ? setup.size - setup.start[ObjectId.MOON]!.col : MAX_PAR);
  type Node = { pos: Positions; moves: TurnMove[] };
  const q: Node[] = [{ pos: copyPos(setup.start), moves: [] }];
  const seen = new Set<string>([keyOf(setup.start, 0)]);
  const solutions: TurnMove[][] = [];
  let best = FALLBACK_PAR;

  while (q.length) {
    const node = q.shift()!;
    if (node.moves.length >= best) continue;
    if (node.moves.length >= limit) continue;
    const st: GameState = { setup, pos: node.pos, moves: node.moves };
    for (const mv of ALL_MOVES) {
      if (!isLegal(st, mv)) continue;
      const pos = applyMove(st, mv);
      const moves = [...node.moves, mv];
      const nxt: GameState = { setup, pos, moves };
      if (won(nxt)) {
        if (moves.length < best) {
          best = moves.length;
          solutions.length = 0;
        }
        if (moves.length === best) solutions.push(moves);
        if (!all) return { par: best, solutions, difficulty: grade(solutions.length) };
        continue;
      }
      const rec = recoveryAfter(moves);
      const k = keyOf(pos, rec);
      if (seen.has(k)) continue;
      seen.add(k);
      q.push({ pos, moves });
    }
  }

  return {
    par: best,
    solutions,
    difficulty: grade(solutions.length),
  };
}

function grade(n: number): Difficulty {
  if (n <= 1) return Difficulty.HARD;
  if (n < 8) return Difficulty.MEDIUM;
  return Difficulty.EASY;
}

export function serialize(setup: GameSetup): string {
  return ALL_ELEMENTS.map((id) => {
    const c = setup.start[id];
    return c ? `${EMOJI[id]}${c.row}${c.col}` : "";
  }).join("");
}

export function deserialize(code: string): GameSetup {
  const start = emptyPositions();
  const re = /(🟣|🔵|🟢|🟡|🌙|🌳|💧)(\d)(\d)/gu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    const emoji = m[1]!;
    const id = Number(Object.entries(EMOJI).find(([, v]) => v === emoji)?.[0]);
    if (Number.isFinite(id)) start[id] = { row: +m[2]!, col: +m[3]! };
  }
  let size = 5;
  for (const id of ALL_ELEMENTS) {
    const c = start[id];
    if (c) size = Math.max(size, c.row + 1, c.col + 1);
  }
  return { size, start, solutions: [] };
}

export function cells(size: number): Cell[] {
  const out: Cell[] = [];
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) out.push({ row: r, col: c });
  return out;
}

function occupied(start: Positions): Cell[] {
  return ALL_ELEMENTS.map((id) => start[id]).filter((c): c is Cell => !!c);
}

function isFree(start: Positions, cell: Cell): boolean {
  return !occupied(start).some((c) => same(c, cell));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export const TUTORIAL: { code: string; size: number; label: string; hint?: TurnMove }[] = [
  { code: "🟣11🟡21🟢21🔵21", size: 3, label: "Call them close", hint: Direction.DOWN },
  { code: "🟣12🟡32🟢31🔵32🌳22💧21", size: 4, label: "Tree and water" },
  { code: "🟣11🟡32🟢31🔵33🌳23💧21🌙12", size: 5, label: "Before the moon sets" },
];

export const CHALLENGES: { code: string; label: string }[] = [
  { code: "🟣04🔵03🟢43🟡30🌙00🌳32💧34", label: "Grove" },
  { code: "🟣24🔵43🟢03🟡40🌙00🌳21💧20", label: "Split" },
  { code: "🟣02🔵31🟢32🟡33🌙00🌳12💧13", label: "Cluster" },
  { code: "🟣30🔵02🟢11🟡41🌙00🌳23💧24", label: "Corners" },
  { code: "🟣30🔵03🟢41🟡33🌙00🌳13💧21", label: "Drift" },
  { code: "🟣22🔵23🟢33🟡14🌙00🌳32💧21", label: "Knot" },
  { code: "🟣21🔵20🟢24🟡03🌙00🌳22💧31", label: "Cross" },
  { code: "🟣03🔵34🟢04🟡21🌙01🌳11💧22", label: "Late moon" },
  { code: "🟣22🔵20🟢31🟡11🌙02🌳32💧14", label: "Short fuse" },
  { code: "🟣14🔵22🟢04🟡44🌙02🌳13💧24", label: "Trap" },
  { code: "🟣22🔵24🟢11🟡42🌙03🌳21💧23", label: "Short" },
  { code: "🟣21🔵24🟢13🟡02🌙32🌳12💧22", label: "Upside down" },
  { code: "🟣12🔵32🟢23🟡21🌙40🌳22💧04", label: "Long night" },
];

export function setupFromCode(code: string, size?: number, label?: string, withSolve = true): GameSetup {
  const raw = deserialize(code);
  const setup: GameSetup = { ...raw, size: size ?? raw.size, label };
  if (!withSolve) return setup;
  const info = solve(setup, true);
  return { ...setup, solutions: info.solutions, difficulty: info.difficulty };
}

export function randomSetup(size = 5): GameSetup {
  for (let i = 0; i < 13; i++) {
    const start = emptyPositions();
    const all = cells(size);
    const interior = all.filter((c) => c.row > 0 && c.col > 0 && c.row < size - 1 && c.col < size - 1);
    const nonTop = all.filter((c) => c.row > 0);
    const tree = pick(interior.length ? interior : all);
    const puddle = pick(nonTop.filter((c) => !same(c, tree)));
    const desiredPar = Math.random() < 0.2 ? MAX_PAR - 1 : MAX_PAR;
    const moonCol = Math.max(0, size - desiredPar);
    const moon: Cell = { row: 0, col: moonCol };
    start[ObjectId.TREE] = tree;
    start[ObjectId.PUDDLE] = puddle;
    start[ObjectId.MOON] = moon;
    const free = shuffle(all.filter((c) => isFree(start, c) && !same(c, moon)));
    ALL_CATS.forEach((id, idx) => {
      start[id] = free[idx] ?? pick(all);
    });
    const setup: GameSetup = { size, start, solutions: [] };
    const info = solve(setup, true);
    if (info.par >= 3 && info.par <= MAX_PAR && info.solutions.length > 0) {
      return { ...setup, solutions: info.solutions, difficulty: info.difficulty, label: "Wild night" };
    }
  }
  const fallback = pick(CHALLENGES);
  return setupFromCode(fallback.code, 5, fallback.label);
}

export function hintMove(state: GameState): TurnMove | null {
  const remain = state.setup.solutions
    .filter((sol) => sol.length >= state.moves.length && state.moves.every((m, i) => sol[i] === m))
    .map((sol) => sol[state.moves.length])
    .filter((m): m is TurnMove => m !== undefined);
  if (!remain.length) return null;
  const tally = new Map<TurnMove, number>();
  for (const m of remain) tally.set(m, (tally.get(m) ?? 0) + 1);
  return [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export function xpForWin(state: GameState, retries: number): number {
  const diff = state.setup.difficulty ?? Difficulty.EASY;
  const bonus = diff === Difficulty.HARD ? 3 : diff === Difficulty.MEDIUM ? 1 : 0;
  const leftover = Math.max(0, moveLimit(state) - state.moves.length);
  const cap = moveLimit(state) >= FALLBACK_PAR ? 0 : leftover;
  return Math.max(0, 10 - retries + bonus + cap);
}

export const DIR_LABEL: Record<Direction, string> = {
  [Direction.UP]: "up",
  [Direction.DOWN]: "down",
  [Direction.LEFT]: "left",
  [Direction.RIGHT]: "right",
};
