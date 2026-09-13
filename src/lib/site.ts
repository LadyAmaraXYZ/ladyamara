/** Public constants. Empty CAs until launch — never fake a live token. */

export const NAME = "Lady AMARA";
export const TICKER = "AMARA";
export const DOLLAR = "$AMARA";
export const SLOGAN = "Bring them home before the moon sets.";
export const LINE = "Mom. Three kittens. One moon.";
export const BIO =
  "Play as Amara. Unite Ivy, Splashy, and Moony before darkness. Every swap feeds the Nest. $AMARA on Robinhood Chain · ladyamara.xyz";

export const SITE_URL = "https://ladyamara.xyz";
export const X_URL = "https://x.com/AmaraCatXYZ";
export const X_HANDLE = "@AmaraCatXYZ";
export const GITHUB_URL = "https://github.com/LadyAmaraXYZ/ladyamara";
export const LETSCASH_LAUNCH = "https://letscash.fun/launch";

export const CHAIN_ID = 4663;
export const CHAIN_HEX = "0x1237";
export const CHAIN_NAME = "Robinhood Chain";
export const RPC_URL = "https://rpc.mainnet.chain.robinhood.com";
export const EXPLORER = "https://robinhoodchain.blockscout.com";
export const NATIVE = "ETH";

export const HOOK = "0x75A54357D9C78a2Db19004a5FDc76c50F9242AEC";
export const POOL_MANAGER = "0x8366a39CC670B4001A1121B8F6A443A643e40951";
export const FACTORY = "0x5bd1Fbe78a78fe8236fa00CF48fbEBA74ae34661";
export const WETH = "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73";

/** Filled after Remix + letscash. Empty = pending on the site. */
export const TOKEN_CA: string = "";
export const VAULT_CA: string = "0x3aAF9d82fadEEf6a1f8d311bD206bDEEAC0Dd4ff";
export const OPS_EOA: string = "0x9945849a08119faebC71bF177FfCA75558b04D7B";
export const POOL_ID: string = "";
export const LAUNCH_BLOCK = 0;

export const TAX_BPS = 300;
export const PLATFORM_BPS = 30;
export const NEST_BPS = 270;

export const KITTENS = [
  {
    id: "ivy",
    name: "Ivy",
    hue: "ivy",
    line: "The climber. She circles the tree.",
  },
  {
    id: "splashy",
    name: "Splashy",
    hue: "splash",
    line: "The rascal. She runs for water.",
  },
  {
    id: "moony",
    name: "Moony",
    hue: "moony",
    line: "The dreamer. She follows the moon.",
  },
] as const;

export function tokenUrl(): string | null {
  if (!TOKEN_CA) return null;
  return `https://letscash.fun/token/${TOKEN_CA}`;
}

export function explorerAddress(addr: string): string {
  return `${EXPLORER}/address/${addr}`;
}

export function shortCa(addr: string, size = 4): string {
  if (!addr || addr.length < 10) return addr || "pending";
  return `${addr.slice(0, 2 + size)}…${addr.slice(-size)}`;
}

export function isLive(): boolean {
  return Boolean(TOKEN_CA && VAULT_CA && POOL_ID);
}
