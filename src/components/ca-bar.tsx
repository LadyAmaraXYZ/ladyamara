import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { TOKEN_CA, VAULT_CA, explorerAddress, shortCa } from "@/lib/site";
import { Button } from "./ui/button";

function Row({ label, value }: { label: string; value: string }) {
  const [ok, setOk] = useState(false);
  const pending = !value;
  return (
    <div className="border-line flex items-center justify-between gap-3 rounded-md border bg-grove/40 px-3 py-2">
      <div className="min-w-0">
        <div className="text-mute text-[10px] tracking-[0.2em] uppercase">{label}</div>
        <div className="font-mono truncate text-sm">
          {pending ? "Pending" : shortCa(value, 6)}
        </div>
      </div>
      {!pending && (
        <div className="flex gap-1">
          <Button
            variant="mute"
            size="icon"
            aria-label={`Copy ${label}`}
            onClick={async () => {
              await navigator.clipboard.writeText(value);
              setOk(true);
              setTimeout(() => setOk(false), 1200);
            }}
          >
            {ok ? <Check className="size-4 text-ivy" /> : <Copy className="size-4" />}
          </Button>
          <a
            href={explorerAddress(value)}
            target="_blank"
            rel="noreferrer"
            className="text-mute hover:text-mom grid size-10 place-items-center text-xs"
          >
            ↗
          </a>
        </div>
      )}
    </div>
  );
}

export function CaBar() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Row label="Token" value={TOKEN_CA} />
      <Row label="The Nest" value={VAULT_CA} />
    </div>
  );
}
