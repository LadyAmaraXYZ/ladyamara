import { useEffect, type ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, MessageCircle, Moon, Pause } from "lucide-react";
import {
  Direction,
  TUTORIAL,
  Tool,
  type TurnMove,
  DIR_LABEL,
  toolRecovery,
} from "@/lib/amara/engine";
import { useGame } from "@/store/game";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { meowSound, unlockAudio } from "@/lib/amara/audio";

const KEYS: Record<string, TurnMove | "hint"> = {
  ArrowUp: Direction.UP,
  ArrowDown: Direction.DOWN,
  ArrowLeft: Direction.LEFT,
  ArrowRight: Direction.RIGHT,
  w: Direction.UP,
  a: Direction.LEFT,
  s: Direction.DOWN,
  d: Direction.RIGHT,
  e: Tool.MEOW,
  q: Tool.WAIT,
  F1: "hint",
};

export function Pad() {
  const state = useGame((s) => s.state);
  const mode = useGame((s) => s.mode);
  const hint = useGame((s) => s.hint);
  const move = useGame((s) => s.move);
  const buyHint = useGame((s) => s.buyHint);
  const yarn = useGame((s) => s.yarn);
  const muted = useGame((s) => s.muted);
  const tutorialStep = useGame((s) => s.tutorialStep);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = KEYS[e.key] ?? KEYS[e.key.toLowerCase()];
      if (k == null) return;
      e.preventDefault();
      unlockAudio();
      if (k === "hint") buyHint();
      else {
        const ok = move(k);
        if (ok && k === Tool.MEOW && !muted) meowSound();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, buyHint, muted]);

  function fire(m: TurnMove) {
    unlockAudio();
    const ok = move(m);
    if (ok && m === Tool.MEOW && !muted) meowSound();
  }

  const rec = state ? toolRecovery(state, Tool.MEOW) : 0;
  const playing = mode === "playing";
  const pulse = hint ?? (tutorialStep < TUTORIAL.length ? TUTORIAL[tutorialStep]?.hint : undefined);

  const padBtn = (m: Direction, icon: ReactNode, extra: string) => (
    <button
      type="button"
      disabled={!playing}
      onClick={() => fire(m)}
      aria-label={DIR_LABEL[m]}
      className={cn(
        "grid size-14 place-items-center rounded-full border border-line bg-grove text-mom transition-colors hover:bg-mom hover:text-night disabled:opacity-30 touch-manipulation",
        extra,
        pulse === m && "hint-pulse bg-mom text-night",
      )}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 grid-rows-3 place-items-center">
        <span />
        {padBtn(Direction.UP, <ArrowUp className="size-6" />, "col-start-2")}
        <span />
        {padBtn(Direction.LEFT, <ArrowLeft className="size-6" />, "")}
        <span />
        {padBtn(Direction.RIGHT, <ArrowRight className="size-6" />, "")}
        <span />
        {padBtn(Direction.DOWN, <ArrowDown className="size-6" />, "col-start-2")}
      </div>

      <div className="grid w-full max-w-56 gap-2">
        <Button
          variant="ghost"
          disabled={!playing || rec > 0}
          onClick={() => fire(Tool.MEOW)}
          className={cn("relative touch-manipulation", pulse === Tool.MEOW && "hint-pulse border-mom")}
        >
          <MessageCircle className="size-4" />
          Meow
          {rec > 0 && (
            <span className="font-mono text-mute absolute inset-0 grid place-items-center bg-night/80">
              {rec}
            </span>
          )}
          <kbd className="text-mute font-mono ml-auto text-[10px]">E</kbd>
        </Button>
        <Button
          variant="ghost"
          disabled={!playing}
          onClick={() => fire(Tool.WAIT)}
          className={cn("touch-manipulation", pulse === Tool.WAIT && "hint-pulse border-mom")}
        >
          <Pause className="size-4" />
          Wait
          <kbd className="text-mute font-mono ml-auto text-[10px]">Q</kbd>
        </Button>
        <Button variant="mute" size="sm" disabled={!playing || yarn < 5} onClick={() => buyHint()}>
          <Moon className="size-3.5" />
          Hint · 5 yarn
        </Button>
      </div>
    </div>
  );
}