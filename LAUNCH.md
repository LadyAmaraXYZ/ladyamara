# Lady AMARA launch — Robinhood Chain 4663

Pad: https://letscash.fun/launch
Hook: `0x75A54357D9C78a2Db19004a5FDc76c50F9242AEC`

## Remix

Solidity 0.8.24 · optimizer 200 · EVM Cancun

1. Deploy `contracts/Nest.sol` with `ops_` = your EOA.
2. Note `VAULT_CA`. Paste into `src/lib/site.ts` as `VAULT_CA` + `OPS_EOA`.

## LetsCash form

```
Name:        Lady AMARA
Ticker:      AMARA
Description: Bring them home before the moon sets. Every swap feeds the Nest.
Website:     https://ladyamara.xyz
X:           https://x.com/AmaraCatXYZ
GitHub:      https://github.com/LadyAmaraXYZ/ladyamara
Pair:        ETH
Supply:      1B
Tax:         3%
Fee recipient: OPS EOA (not the Nest yet)
Image:       public/letscash.png
```

Do not put the Nest as fee recipient on the form.

## After launch

1. Copy token CA and pool id (bytes32 from TokenLaunched, not an address).
2. Ops on hook: `updateCreator(poolId, VAULT_CA)`.
3. Nest: `setTokenCA`, `setPoolId`, `setClaimer(0x75A54357D9C78a2Db19004a5FDc76c50F9242AEC)`.
4. Put CAs in `src/lib/site.ts` + `public/token.json`. Push `main`.
5. Anyone: `harvest()` — ETH stays in the Nest. Ops: `pull(to, wei)`.

Kiln desk: https://ladyamara.xyz/ops (not in nav).
