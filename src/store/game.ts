import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type GameState,
  type TurnMove,
  CHALLENGES,
  TUTORIAL,
  initialState,
  play,
  setupFromCode,
  randomSetup,
  won,
  lost,
  xpForWin,
  hintMove,
  isLegal,
} from "@/lib/amara/engine";

type Mode = "idle" | "playing" | "won" | "lost";

type GameStore = {
  yarn: number;
  muted: boolean;
  tutorialStep: number;
  retries: number;
  challengeIndex: number;
  state: GameState | null;
  mode: Mode;
  hint: TurnMove | null;
  lastMeowAt: number;
  setMuted: (v: boolean) => void;
  startTutorial: (step?: number) => void;
  startChallenge: (index?: number) => void;
  startRandom: () => void;
  loadCode: (code: string) => void;
  move: (m: TurnMove) => boolean;
  retry: () => void;
  skipTutorial: () => void;
  buyHint: () => TurnMove | null;
  collectYarn: (n: number) => void;
};

function fromTutorial(step: number): GameState {
  const t = TUTORIAL[Math.min(step, TUTORIAL.length - 1)]!;
  return initialState(setupFromCode(t.code, t.size, t.label, false));
}

export const useGame = create<GameStore>()(
  persist(
    (set, get) => ({
      yarn: 0,
      muted: false,
      tutorialStep: 0,
      retries: 0,
      challengeIndex: 0,
      state: null,
      mode: "idle",
      hint: null,
      lastMeowAt: 0,

      setMuted: (v) => set({ muted: v }),

      startTutorial: (step) => {
        const s = step ?? get().tutorialStep;
        set({
          tutorialStep: s,
          retries: 0,
          hint: null,
          state: fromTutorial(s),
          mode: "playing",
        });
      },

      skipTutorial: () => {
        set({ tutorialStep: TUTORIAL.length });
        get().startRandom();
      },

      startChallenge: (index) => {
        const i = ((index ?? get().challengeIndex) + CHALLENGES.length) % CHALLENGES.length;
        const ch = CHALLENGES[i]!;
        set({
          challengeIndex: i,
          retries: 0,
          hint: null,
          tutorialStep: TUTORIAL.length,
          state: initialState(setupFromCode(ch.code, 5, ch.label)),
          mode: "playing",
        });
      },

      startRandom: () => {
        set({
          retries: 0,
          hint: null,
          tutorialStep: TUTORIAL.length,
          state: initialState(randomSetup(5)),
          mode: "playing",
        });
      },

      loadCode: (code) => {
        const cleaned = code.trim();
        if (!cleaned) return;
        set({
          retries: 0,
          hint: null,
          tutorialStep: TUTORIAL.length,
          state: initialState(setupFromCode(cleaned)),
          mode: "playing",
        });
      },

      move: (m) => {
        const cur = get().state;
        if (!cur || get().mode !== "playing") return false;
        if (!isLegal(cur, m)) return false;
        const next = play(cur, m);
        if (next === cur) return false;
        const w = won(next);
        const l = lost(next);
        set({
          state: next,
          hint: null,
          lastMeowAt: m === 8 ? Date.now() : get().lastMeowAt,
          mode: w ? "won" : l ? "lost" : "playing",
        });
        if (w) {
          const gained = xpForWin(next, get().retries);
          set({ yarn: get().yarn + gained });
          if (get().tutorialStep < TUTORIAL.length) {
            set({ tutorialStep: get().tutorialStep + 1 });
          }
        }
        return true;
      },

      retry: () => {
        const cur = get().state;
        if (!cur) return;
        set({
          retries: get().retries + 1,
          hint: null,
          state: initialState(cur.setup),
          mode: "playing",
        });
      },

      buyHint: () => {
        const cur = get().state;
        if (!cur || get().yarn < 5) return null;
        const h = hintMove(cur);
        if (h == null) return null;
        set({ yarn: get().yarn - 5, hint: h });
        return h;
      },

      collectYarn: (n) => set({ yarn: Math.max(0, get().yarn + n) }),
    }),
    {
      name: "lady-amara",
      partialize: (s) => ({
        yarn: s.yarn,
        muted: s.muted,
        tutorialStep: s.tutorialStep,
        challengeIndex: s.challengeIndex,
      }),
    },
  ),
);
