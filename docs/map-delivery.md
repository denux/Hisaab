# Historical map delivery

At zoom levels below 6, the historical layer displays count summaries. Clicking a
summary zooms into its source bounds. From zoom 6 onward, individual locations
and their original receipts remain available. Summaries are historical source
records and do not establish spending or present-day site condition.

`node scripts/build-map-overview.mjs` rebuilds the small public overview files
from the read-only local asset database. Every level must sum to 812,976, with
unchanged category totals. Original geography files and records are retained.

## Separate static map hosting

`node scripts/export-r2-map.mjs` exports a package under the ignored private
acquisition directory. Its allowlist contains only already-public boundaries,
count summaries, and historical vector tiles. All 812,976 source points are
retained at every detailed encoded zoom, 6 through 9. Source names and IDs stay
in detailed tiles so search can run locally in the browser.

Create a dedicated R2 bucket and connect a production custom domain before
switching traffic. Cloudflare's `r2.dev` development endpoint is rate limited and
is unsuitable for production map delivery. Activation/billing terms must be
completed by the account owner. Do not migrate the website's root domain or DNS
nameservers merely to enable this optional delivery path.

Create a bucket-scoped Object Read & Write S3 credential. Keep credentials in
ignored `.env.r2.local`, never in browser variables or Git:

```dotenv
R2_ACCOUNT_ID=
R2_BUCKET=hisaab-public-map
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
```

Run `node scripts/upload-r2-map.mjs` for a local checksum audit, then
`node scripts/upload-r2-map.mjs --upload` to upload to the existing dedicated
bucket. The uploader preserves immutable object hashes. Configure browser
read-only CORS for Hisaab in the bucket dashboard; the optional
`--configure-cors` flag requires separate bucket-configuration permission, which
the temporary object-only upload key does not have. It never uploads source originals, private intake,
payment records, or authentication files.

Check the public domain with an `Origin: https://adiram.me` header, verify its
CORS headers and the sample file checksums, and then set the Netlify build
variable `NEXT_PUBLIC_HISAAB_MAP_TILE_BASE_URL` to the immutable package prefix,
for example `https://maps.example.com/edition-<package-hash>`. Rebuild once after
verification. Boundaries and summaries fall back to the website on a host
failure; detailed tiles fall back to the original route on a non-404 error.
Missing tiles in empty areas are normal and do not trigger a full fallback.

Leave this variable empty until the external package is verified. Without it,
the clustered overview works and detailed tiles continue through the original
delivery path. Disabling the variable and rebuilding restores origin delivery.

## Production deployment cost

Keep related work on a branch until checked, then merge/push one batch. The
Netlify ignore command skips documentation/test-only changes and builds any
change that affects website inputs. GitHub validation remains independent.
