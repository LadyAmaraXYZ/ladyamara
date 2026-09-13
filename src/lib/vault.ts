import { HOOK, RPC_URL, VAULT_CA, POOL_ID } from "./site";

const SEL = {
  harvest: "0x4641257d",
  pull: "0xf2d5d56b",
  ops: "0x8da5cb5b",
  token: "0xfc0c546a",
  claimer: "0xd379be23",
  poolId: "0x3e0dc34e",
  pending: "0x51cff8d9",
};

async function rpc(method: string, params: unknown[]): Promise<unknown> {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = (await res.json()) as { result?: unknown; error?: { message: string } };
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

export async function readEthBalance(addr: string): Promise<bigint> {
  const hex = (await rpc("eth_getBalance", [addr, "latest"])) as string;
  return BigInt(hex);
}

export function encodeHarvest(): `0x${string}` {
  return SEL.harvest as `0x${string}`;
}

export function encodePull(to: string, wei: bigint): `0x${string}` {
  const addr = to.slice(2).toLowerCase().padStart(64, "0");
  const amt = wei.toString(16).padStart(64, "0");
  return (`${SEL.pull}${addr}${amt}`) as `0x${string}`;
}

export async function readNest(): Promise<{
  eth: bigint;
  pending: bigint;
} | null> {
  if (!VAULT_CA) return null;
  const eth = await readEthBalance(VAULT_CA);
  let pending = 0n;
  if (POOL_ID) {
    try {
      const data = `${SEL.pending}${POOL_ID.slice(2).padStart(64, "0")}`;
      const hex = (await rpc("eth_call", [{ to: HOOK, data }, "latest"])) as string;
      pending = BigInt(hex || "0x0");
    } catch {
      pending = 0n;
    }
  }
  return { eth, pending };
}

export function fmtEth(wei: bigint, digits = 4): string {
  const n = Number(wei) / 1e18;
  if (!Number.isFinite(n)) return "0";
  return n.toFixed(digits).replace(/\.?0+$/, "") || "0";
}
