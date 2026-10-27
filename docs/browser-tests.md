# Browser regression tests

Run `npm run test:e2e` against a local test database. Set `TEST_SUPABASE_URL`
for a non-default local port. The runner rejects remote database URLs and starts
its own server instead of reusing an unknown preview server. GitHub Actions creates a
fresh disposable Supabase instance and applies the repository migrations first.
A restored developer database may have an older schema: use a separate test
instance rather than resetting a database containing work you need to keep.

The Playwright web server supplies a non-secret placeholder map token. Browser
fixtures intercept the map provider, terrain, and telemetry requests and return
small synthetic images. Tests can exercise rendering and camera behaviour
without external credentials, provider traffic, or access to the live website.
The historical asset fixture is explicitly synthetic and exists only in browser
route responses; no fixture is imported into the application catalogue.

Funding UI tests use a synthetic programme response. Backend privacy tests still
call the real local application and disposable database: their authentication,
ownership, deletion, cross-origin, and private-file assertions are not mocked.
Renderer checks run in CI as well as locally; they do not require a paid map
account. Production imagery, source integrity, and delivery-path smoke checks
remain separate checks against the deployed configuration.
