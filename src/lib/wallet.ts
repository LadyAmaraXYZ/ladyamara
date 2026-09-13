import { CHAIN_HEX, CHAIN_ID, CHAIN_NAME, EXPLORER, NATIVE, RPC_URL } from "./site";

export type EthProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (ev: string, fn: (...a: unknown[]) => void) => void;
  removeListener?: (ev: string, fn: (...a: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EthProvider;
  }
}

export async function getInjected(): Promise<EthProvider | null> {
  if (typeof window === "undefined") return null;
  const found: EthProvider[] = [];
  const onAnnounce = (ev: Event) => {
    const detail = (ev as CustomEvent<{ provider?: EthProvider }>).detail;
    if (detail?.provider) found.push(detail.provider);
  };
  window.addEventListener("eip6963:announceProvider", onAnnounce);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  window.removeEventListener("eip6963:announceProvider", onAnnounce);
  return found[0] ?? window.ethereum ?? null;
}

export async function connectWallet(): Promise<string> {
  const eth = await getInjected();
  if (!eth) throw new Error("No wallet found. Install MetaMask or OKX.");
  const accs = (await eth.request({ method: "eth_requestAccounts" })) as string[];
  const addr = accs[0];
  if (!addr) throw new Error("No account");
  await ensureChain(eth);
  return addr;
}

export async function ensureChain(eth: EthProvider): Promise<void> {
  const id = (await eth.request({ method: "eth_chainId" })) as string;
  if (id.toLowerCase() === CHAIN_HEX.toLowerCase()) return;
  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_HEX }],
    });
  } catch {
    await eth.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: CHAIN_HEX,
          chainName: CHAIN_NAME,
          nativeCurrency: { name: NATIVE, symbol: NATIVE, decimals: 18 },
          rpcUrls: [RPC_URL],
          blockExplorerUrls: [EXPLORER],
        },
      ],
    });
  }
}

export async function sendTx(params: {
  from: string;
  to: string;
  data: string;
  value?: string;
}): Promise<string> {
  const eth = await getInjected();
  if (!eth) throw new Error("No wallet");
  await ensureChain(eth);
  const hash = (await eth.request({
    method: "eth_sendTransaction",
    params: [
      {
        from: params.from,
        to: params.to,
        data: params.data,
        value: params.value ?? "0x0",
        chainId: CHAIN_HEX,
      },
    ],
  })) as string;
  return hash;
}

export { CHAIN_ID };
