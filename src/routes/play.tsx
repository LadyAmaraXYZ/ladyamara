import { createFileRoute } from "@tanstack/react-router";
import { PlayDesk } from "@/components/amara/play-desk";

export const Route = createFileRoute("/play")({ component: PlayPage });

function PlayPage() {
  return (
    <main>
      <PlayDesk />
    </main>
  );
}
