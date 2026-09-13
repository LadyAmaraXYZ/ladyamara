import { Difficulty, moveLimit, serialize } from "@/lib/amara/engine";
import { useGame } from "@/store/game";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";

const DIFF: Record<number, { label: string; cls: string }> = {
  [Difficulty.EASY]: { label: "●", cls: "text-ivy" },
  [Difficulty.MEDIUM]: { label: "●●", cls: "text-moony" },
  [Difficulty.HARD]: { label: "●●●", cls: "text-mom" },
};

export function Hud() {
  const state = useGame((s) => s.state);
  const retries = useGame((s) => s.retries);
  const yarn = useGame((s) => s.yarn);
  const loadCode = useGame((s) => s.loadCode);
  if (!state) return null;
  const limit = moveLimit(state);
  const diff = state.setup.difficulty ? DIFF[state.setup.difficulty] : null;
  const cap = limit >= 42 ? "?" : String(limit);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="font-display text-lg font-bold">{state.setup.label ?? "Night"}</div>
        <div className="text-mute font-mono text-xs tabular-nums">
          Moves {state.moves.length} / {cap}
          {diff && <span className={diff.cls}> · {diff.label}</span>}
          {retries > 0 && <span> · retries {retries}</span>}
          <span> · {yarn} yarn</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const cur = serialize(state.setup);
          const next = window.prompt("Share or load a grove (emoji string)", cur);
          if (next) loadCode(next);
        }}
      >
        <FolderOpen className="size-4" />
        Load
      </Button>
    </div>
  );
}
