import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useGame } from "@/store/game";
import { TUTORIAL, won } from "@/lib/amara/engine";
import { Board } from "./board";
import { Pad } from "./controls";
import { Hud } from "./hud";
import { Button } from "@/components/ui/button";
import { loseSound, unlockAudio, winSound } from "@/lib/amara/audio";

export function PlayDesk() {
  const state = useGame((s) => s.state);
  const mode = useGame((s) => s.mode);
  const startTutorial = useGame((s) => s.startTutorial);
  const startRandom = useGame((s) => s.startRandom);
  const startChallenge = useGame((s) => s.startChallenge);
  const skipTutorial = useGame((s) => s.skipTutorial);
  const retry = useGame((s) => s.retry);
  const tutorialStep = useGame((s) => s.tutorialStep);
  const muted = useGame((s) => s.muted);
  const challengeIndex = useGame((s) => s.challengeIndex);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persist = useGame.persist;
    if (!persist?.hasHydrated) {
      setHydrated(true);
      return;
    }
    if (persist.hasHydrated()) setHydrated(true);
    return persist.onFinishHydration(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated || state) return;
    if (tutorialStep >= TUTORIAL.length) startChallenge(0);
    else startTutorial(tutorialStep);
  }, [hydrated, state, tutorialStep, startChallenge, startTutorial]);

  useEffect(() => {
    if (mode === "won" && !muted) winSound();
    if (mode === "lost" && !muted) loseSound();
  }, [mode, muted]);

  if (!state) {
    return (
      <div className="text-mute grid min-h-[50vh] place-items-center font-mono text-sm">
        Gathering the litter…
      </div>
    );
  }

  const teaching = tutorialStep < TUTORIAL.length;

  return (
    <div
      className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start"
      onPointerDown={() => unlockAudio()}
    >
      <div className="grid gap-4">
        <Hud />
        <Board state={state} />
      </div>
      <div className="relative grid gap-4">
        <Pad />
        {teaching && mode === "playing" && (
          <p className="text-mute text-center text-sm">
            {TUTORIAL[Math.min(tutorialStep, TUTORIAL.length - 1)]?.label}. Arrows or
            the pad. E meows. Q waits.
          </p>
        )}
        {teaching && mode === "playing" && (
          <Button variant="mute" size="sm" onClick={skipTutorial}>
            Skip tutorial
          </Button>
        )}

        {(mode === "won" || mode === "lost") && (
          <div className="border-line absolute inset-x-0 top-4 z-10 grid gap-2 rounded-md border bg-night/95 p-4 text-center">
            <div className="font-display text-xl font-bold">
              {mode === "won" ? "United." : "The moon set."}
            </div>
            {mode === "won" && won(state) && (
              <p className="text-mute text-sm">The litter is home.</p>
            )}
            <div className="mt-2 grid gap-2">
              {mode === "won" && teaching ? (
                <Button onClick={() => startTutorial(tutorialStep)}>Next night</Button>
              ) : (
                <Button onClick={startRandom}>New night</Button>
              )}
              {mode === "lost" && (
                <Button variant="ghost" onClick={retry}>
                  Try again
                </Button>
              )}
              <Button variant="ghost" onClick={() => startChallenge(challengeIndex + 1)}>
                Challenge
              </Button>
            </div>
          </div>
        )}

        {mode === "playing" && !teaching && (
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="ghost" size="sm" onClick={startRandom}>
              Shuffle
            </Button>
            <Button variant="ghost" size="sm" onClick={() => startChallenge(challengeIndex + 1)}>
              Next challenge
            </Button>
          </div>
        )}

        <Link to="/how" className="text-mute hover:text-mom text-center text-xs">
          How the grove works
        </Link>
      </div>
    </div>
  );
}
