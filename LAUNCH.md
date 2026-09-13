# Lady AMARA launch — Robinhood Chain 4663

Pad: https://letscash.fun/launch
Hook: `0x75A54357D9C78a2Db19004a5FDc76c50F9242AEC`
Play: https://ladyamara.xyz/play

Do not set the Nest as fee recipient on the form.
Fee recipient = ops EOA. Then `updateCreator(poolId, nest)`.

## 1. Remix — The Nest

Compiler 0.8.24 · optimizer 200 runs · EVM Cancun · chain 4663

1. Paste `contracts/Nest.sol`.
2. Deploy with `ops_` = the EOA you will click LetsCash with.
3. Copy Nest CA. That is `VAULT_CA`.

## 2. LetsCash form

```
Name:          Lady AMARA
Ticker:        AMARA
Description:   Mom. Three kittens. One moon. Unite them before darkness. Every swap feeds the Nest.
Website:       https://ladyamara.xyz
X:             https://x.com/AmaraCatXYZ
GitHub:        https://github.com/LadyAmaraXYZ/ladyamara
Pair:          ETH
Supply:        1B
Tax:           3%
Fee recipient: OPS EOA (the same wallet as Nest ops_)
Image:         https://ladyamara.xyz/letscash.jpg
```

Launch. Do not refresh until the TokenLaunched receipt is saved.

## 3. From the receipt

- Token CA → `TOKEN_CA`
- `poolId` is a **bytes32** from TokenLaunched — not an address. If it looks like `0x` + 40 hex chars, it is wrong.

## 4. Wire the rail (ops EOA)

On hook `0x75A54357D9C78a2Db19004a5FDc76c50F9242AEC`:

- `updateCreator(poolId, VAULT_CA)`

On Nest:

- `setTokenCA(TOKEN_CA)`
- `setPoolId(poolId)`
- `setClaimer(0x75A54357D9C78a2Db19004a5FDc76c50F9242AEC)`

One-shot. Wrong pool id locks the slot.

## 5. Site

Paste `TOKEN_CA`, `VAULT_CA`, `OPS_EOA`, `POOL_ID` into `src/lib/site.ts` + `public/token.json`. Push `main`.

## 6. X

Pin post 2 with CA. Play is already live at /play.

## After

Anyone: `harvest()` — ETH stays in the Nest.
Ops: `pull(to, wei)`.
Kiln: https://ladyamara.xyz/ops (not in nav).
