# Admin Dashboard

The catalog editor at `/admin/products` and the settings page at `/admin/settings`.
Together they are the only part of the app that **writes** to the database —
everything else is read-only.

## Authentication

A single shared password, not user accounts. There is no `User` table and no audit
trail of *who* changed something, only that it changed.

| Piece | File |
| --- | --- |
| Cookie name, TTL, secret accessor | `src/libs/admin/auth/config.ts` |
| HMAC sign/verify (`node:crypto`) | `src/libs/admin/auth/session.ts` |
| Constant-time password check | `src/libs/admin/auth/password.ts` |
| `requireAdminSession()` | `src/libs/admin/auth/guard.ts` |
| Route gate | `src/proxy.ts` |
| Login / logout actions | `src/app/(blank-layout-pages)/login/actions.ts` |

Two env vars are required — see `.env.example`:

```
ADMIN_PASSWORD=              # the shared password
ADMIN_SESSION_SECRET=        # ≥32 chars; node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

The cookie value is `<expiresAtMs>.<hmac>` — no identity is stored, so the only
thing worth signing is the expiry. Sessions last 7 days with no sliding refresh.

### `src/proxy.ts`, not `middleware.ts`

Next 16 renamed `middleware.ts` to `proxy.ts`. The rename is load-bearing here:
**`proxy` always runs on the Node runtime — edge is not supported and cannot be
configured** — which is why the session module can use `node:crypto` directly
instead of Web Crypto.

**It must live at `src/proxy.ts`, not the repo root.** This project has a `src/`
directory, so a root-level `proxy.ts` is silently ignored and every admin route
becomes publicly reachable. This was caught in testing; do not "tidy" it back to
the root.

The `matcher` is an explicit allow-list (`/admin/:path*`, `/home`, `/login`) so the
statically-prerendered storefront never pays for a session check. `/admin/:path*`
covers every admin page including `/admin/settings`; adding a dashboard route
*outside* `/admin` means adding it here.

Every page and every action *also* calls `requireAdminSession()`. That is
deliberate duplication: a matcher is one typo away from exposing the read paths.

## Data flow

```
src/views/admin/products/ProductForm.tsx        client, useActionState
  → src/app/(dashboard)/admin/products/actions.ts   'use server' — guard, parse, upload, redirect
      → src/libs/admin/products/schema.ts            zod validation
      → src/libs/admin/storage/                      file write
      → src/libs/admin/products/mutations.ts         transaction
          → src/libs/prisma.ts
```

- **`read.ts`** is deliberately **uncached and unfiltered**, unlike
  `src/libs/products.ts`. The admin must see inactive products and inactive
  variants, and must never wonder whether it is looking at a cached copy.
- **`mutations.ts`** returns a typed `Result` rather than throwing for expected
  failures. A duplicate slug is not exceptional.
- After every successful mutation, `revalidateProducts()`
  (`src/libs/admin/shared/revalidate.ts`) calls **`updateTag(PRODUCTS_TAG)`**.
  Next 16 deprecated single-argument `revalidateTag`; `updateTag` is the
  Server-Action-native form and gives read-your-own-writes, so the storefront
  reflects a save immediately. If this ever needs to run outside a Server Action,
  switch that one function to `revalidateTag(PRODUCTS_TAG, 'max')`.

New product slugs do **not** need a rebuild: `dynamicParams` defaults to true, so
a slug absent from `generateStaticParams` still renders on first request.

## Form submission shape

Scalars ride as flat `FormData` entries. The three collections — `variants`,
`tastingNotes`, `varietalIds` — ride as **single JSON strings** in hidden inputs,
mirrored from React state. The server does one `JSON.parse` instead of
reconstructing `variants[0][sku]`-style keys.

Booleans are validated as `z.enum(['true','false']).transform(...)`, never
`z.coerce.boolean()` — the latter treats the string `'false'` as `true`.

Field errors are keyed by `issue.path.join('.')`, producing `variants.1.sku`, which
is what lets an error land on the offending row. zod's `flattenError` is not used
because it only reaches one level deep.

## Settings — `/admin/settings`

Two tabs, in `src/views/admin/settings/`:

| Tab | State |
| --- | --- |
| **Perusahaan** | Placeholder. Company details still come from `src/configs/shopConfig.ts`. |
| **Referensi** | Left rail of reference types, right panel of rows to add/edit/delete. |

Only **Varietas** exists as a reference type today. `REFERENCE_TYPES` in
`ReferencesPanel.tsx` is an array precisely so grind options and any other shared
vocabulary become one entry plus one panel rather than a rewrite.

```
SettingsView.tsx            tabs
  └─ ReferencesPanel.tsx    left rail + selected panel
       └─ VarietalTable.tsx table, delete confirmation
            └─ VarietalDialog.tsx   add/edit form, useActionState
                 → app/(dashboard)/admin/settings/actions.ts
                      → libs/admin/varietals/{schema,mutations,read}.ts
```

Field primitives (`optionalText`, `requiredText`, `slugText`) live in
`src/libs/admin/shared/fields.ts` and the Prisma error readers in
`shared/prismaError.ts`, shared with the product schema so the wording of
"wajib diisi" and the slug rule cannot drift between the two forms.

The dialog closes by reacting to a changing `savedAt` timestamp in the action
state — a `ok: true` boolean would not change on a second successful save.

## Two invariants that are easy to break

**Nested row ids are client-controlled.** `variants` and `tastingNotes` arrive
inside a JSON blob the browser supplies, so their `id`s are attacker-controlled.
Updates are therefore scoped by **both** id and `productId`:

```ts
await tx.productVariant.updateMany({ where: { id: variant.id, productId }, data })
```

An unscoped `update({ where: { id } })` would let a forged id overwrite a row
belonging to a different product. A `count !== 1` is treated as an error.

**The existing image path is never accepted from the form.** The client submits
only *intent* (`removeHeroImage`), and `updateProduct` resolves "keep" against the
live row. Trusting a submitted path would let a stale tab write back a path whose
file another admin already deleted.

**Deleting a varietal is gated on its link count.** `ProductVarietal.varietal` is
`onDelete: Cascade`, so an unguarded delete would silently strip the varietal from
every product using it. `deleteVarietal()` counts links and deletes inside one
transaction, refusing with a `conflict` when the count is non-zero. The disabled
delete button in the table is a courtesy — the domain function is the rule.

## Image handling

One image per product, stored in `Product.heroImage`. The `ProductImage` gallery
model exists in the schema but is **unused** — the storefront renders `heroImage`
only.

- Uploads land in `public/images/products/`, named `randomUUID() + extension`. The
  client filename is never used, which sidesteps sanitization entirely.
- Type is decided by **sniffing magic bytes**, not the client-supplied
  `file.type`. JPG, PNG, WebP only; 4 MB cap.
- Server Actions default to a 1 MB body limit, so `next.config.ts` sets
  `experimental.serverActions.bodySizeLimit: '8mb'`. That ceiling is **global to
  every Server Action in the app**.
- Ordering is deliberate: upload before the transaction, delete the old file only
  *after* commit. An orphaned file is harmless; a row pointing at a deleted file is
  a visible broken image. A rejected save deletes anything it just uploaded.
- `src/libs/admin/storage/index.ts` is a one-line seam — swapping to S3 means one
  new `ImageStorage` implementation and one changed export.

> Files written to `public/` are only durable on a persistent filesystem. Under
> `output: 'standalone'` or a serverless target they will not survive a deploy.
> That is the day to use the storage seam.

## Navigation

Menu entries are data. Edit `src/data/navigation/verticalMenuData.tsx` **and**
`horizontalMenuData.tsx` — both, they are not derived from each other.
`GenerateMenu.tsx` renders them. (This path was commented out in the template and
was activated as part of this feature; the hardcoded `<MenuItem>` blocks are gone.)

## Testing

No test framework is configured. This area was verified with ad-hoc Playwright
suites plus two targeted scripts:

| Script | Covers |
| --- | --- |
| `admin_e2e.py` (17 checks) | auth accept/reject, gate coverage, server-side validation, create with upload, duplicate slug/SKU, orphan-upload cleanup, storefront revalidation, edit, delete with cascade and file cleanup |
| `settings_e2e.py` (16 checks) | gate, `/about` gone, nav order, both tabs, varietal create/edit/delete, duplicate + malformed slug, in-use delete disabled |
| `forged_id.py` | cross-product row overwrite is closed |
| `guard-check.ts` | `deleteVarietal()` refuses an in-use row and leaves its links intact |

Those scripts live in the session scratchpad, not the repo — re-create them if this
area changes materially.

Two gotchas if you rewrite them: required fields render their label as `Nama *`
(thin space + asterisk), so `get_by_label(..., exact=True)` misses them — target
`input[name=...]` instead. And MUI's disabled buttons set `pointer-events: none`,
so a forced click cannot exercise a server guard from the UI; test the domain
function directly, as `guard-check.ts` does.

## Known gaps

- **No rate limiting on login.** The shared password is brute-forceable at
  whatever rate the server allows.
- **No audit trail** — see the auth note above.
- `sortOrder` is a plain number input; there is no drag-to-reorder.
- `UserDropdown` still shows the vendor's placeholder identity
  ("John Doe / admin@vuexy.com") and dead profile/settings links.
