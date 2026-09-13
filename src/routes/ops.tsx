import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OPS_EOA, VAULT_CA, explorerAddress } from "@/lib/site";
import { encodeHarvest, encodePull, fmtEth, readNest } from "@/lib/vault";
import { connectWallet, sendTx } from "@/lib/wallet";

export const Route = createFileRoute("/ops")({ component: OpsPage });

function OpsPage() {
  const [addr, setAddr] = useState("");
  const [eth, setEth] = useState<bigint>(0n);
  const [pending, setPending] = useState<bigint>(0n);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  async function refresh() {
    const n = await readNest();
    if (!n) return;
    setEth(n.eth);
    setPending(n.pending);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function onConnect() {
    try {
      const a = await connectWallet();
      setAddr(a);
      setTo(a);
      setMsg("");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "connect failed");
    }
  }

  async function onHarvest() {
    if (!VAULT_CA || !addr) return;
    try {
      const hash = await sendTx({ from: addr, to: VAULT_CA, data: encodeHarvest() });
      setMsg(hash);
      await refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "harvest failed");
    }
  }

  async function onPull() {
    if (!VAULT_CA || !addr || !to) return;
    const wei = BigInt(Math.round(Number(amount) * 1e18));
    if (wei <= 0n) {
      setMsg("amount in ETH");
      return;
    }
    try {
      const hash = await sendTx({ from: addr, to: VAULT_CA, data: encodePull(to, wei) });
      setMsg(hash);
      await refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "pull failed");
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Kiln desk</h1>
      <p className="text-mute text-sm">
        Harvest is public. ETH stays in The Nest. Pull is ops only. Not in the
        nav on purpose.
      </p>
      {!VAULT_CA && <p className="text-moony">Nest CA pending.</p>}
      <div className="border-line grid gap-2 rounded-md border p-4 font-mono text-sm">
        <div>Nest {fmtEth(eth)} ETH</div>
        <div>Hook pending {fmtEth(pending)} ETH</div>
        {VAULT_CA && (
          <a className="text-mom" href={explorerAddress(VAULT_CA)} target="_blank" rel="noreferrer">
            {VAULT_CA}
          </a>
        )}
        <div className="text-mute">ops {OPS_EOA || "—"}</div>
      </div>
      <Button onClick={onConnect}>{addr ? addr : "Connect"}</Button>
      <Button variant="ghost" disabled={!VAULT_CA || !addr} onClick={onHarvest}>
        Harvest
      </Button>
      <label className="grid gap-1 text-sm">
        Pull to
        <input
          className="border-line rounded-md border bg-grove px-3 py-2 font-mono"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </label>
      <label className="grid gap-1 text-sm">
        Amount ETH
        <input
          className="border-line rounded-md border bg-grove px-3 py-2 font-mono"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.01"
        />
      </label>
      <Button variant="ghost" disabled={!VAULT_CA || !addr} onClick={onPull}>
        Pull
      </Button>
      {msg && <p className="text-mute break-all font-mono text-xs">{msg}</p>}
    </main>
  );
}
