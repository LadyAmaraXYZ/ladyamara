import { createFileRoute } from "@tanstack/react-router";
import { CaBar } from "@/components/ca-bar";
import {
  CHAIN_ID,
  CHAIN_NAME,
  DOLLAR,
  EXPLORER,
  FACTORY,
  GITHUB_URL,
  HOOK,
  LETSCASH_LAUNCH,
  NEST_BPS,
  PLATFORM_BPS,
  POOL_MANAGER,
  RPC_URL,
  SITE_URL,
  TAX_BPS,
  TOKEN_CA,
  X_HANDLE,
  X_URL,
  tokenUrl,
} from "@/lib/site";

export const Route = createFileRoute("/token")({ component: TokenPage });

function TokenPage() {
  const trade = tokenUrl();
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10">
      <header>
        <p className="text-mom font-mono text-xs tracking-[0.3em] uppercase">{DOLLAR}</p>
        <h1 className="mt-2 text-4xl font-extrabold">Token</h1>
        <p className="text-mute mt-3">
          Robinhood Chain {CHAIN_ID}. LetsCash. Uniswap v4. LP locked on launch.
        </p>
      </header>

      <CaBar />

      <dl className="border-line grid gap-3 rounded-lg border p-5 font-mono text-sm">
        <Row k="Chain" v={`${CHAIN_NAME} (${CHAIN_ID})`} />
        <Row k="Quote" v="ETH" />
        <Row k="Supply" v="1,000,000,000" />
        <Row k="Pad" v={`${TAX_BPS / 100}% · ${PLATFORM_BPS / 100} platform / ${NEST_BPS / 100} Nest`} />
        <Row k="RPC" v={RPC_URL} />
        <Row k="Explorer" v={EXPLORER} href={EXPLORER} />
        <Row k="Hook" v={HOOK} href={`${EXPLORER}/address/${HOOK}`} />
        <Row k="Pool manager" v={POOL_MANAGER} />
        <Row k="Factory" v={FACTORY} />
        <Row k="Site" v={SITE_URL} href={SITE_URL} />
        <Row k="X" v={X_HANDLE} href={X_URL} />
        <Row k="GitHub" v="LadyAmaraXYZ/ladyamara" href={GITHUB_URL} />
      </dl>

      <div className="flex flex-wrap gap-3">
        {trade ? (
          <a
            className="bg-mom text-night inline-flex h-11 items-center rounded-md px-5 font-semibold"
            href={trade}
            target="_blank"
            rel="noreferrer"
          >
            Trade on LetsCash
          </a>
        ) : (
          <a
            className="border-line text-mute inline-flex h-11 items-center rounded-md border px-5"
            href={LETSCASH_LAUNCH}
            target="_blank"
            rel="noreferrer"
          >
            Pad
          </a>
        )}
        {TOKEN_CA ? (
          <a
            className="border-line inline-flex h-11 items-center rounded-md border px-5"
            href={`${EXPLORER}/address/${TOKEN_CA}`}
            target="_blank"
            rel="noreferrer"
          >
            Explorer
          </a>
        ) : null}
      </div>
    </main>
  );
}

function Row({ k, v, href }: { k: string; v: string; href?: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
      <dt className="text-mute">{k}</dt>
      <dd className="break-all">
        {href ? (
          <a href={href} className="text-mom hover:underline" target="_blank" rel="noreferrer">
            {v}
          </a>
        ) : (
          v
        )}
      </dd>
    </div>
  );
}
