# utility-sunmoonsolar AGENTS.md

## Project: utility-sunmoonsolar
Static offline PWA — Sun, Moon & Solar calculator.
Stack: React + Vite + TypeScript. No backend.

## Production deploy (source of truth)
Live site updates happen **only via GitHub Actions after a PR is merged into `main`**.

1. Work on a feature branch; open a PR into `main`.
2. `ci.yml` runs on the PR (install, test, build).
3. After merge, `deploy.yml` builds on the runner and FTPs `dist/` to InfinityFree.

Do **not** treat a local `dist/` folder as the live deploy path. Do **not** push commits straight to `main` as the normal workflow.

## Optional local preview (Podman only)
No Node/Bun on the host. Container name: `utility-sunmoonsolar-dev`. Port: host `1026` → container `1026`.

After ANY source change for local preview — ONLY rebuild and restart the **dev** container:

```bash
podman build -t localhost/utility-sunmoonsolar-dev:latest -f Containerfile.dev .
podman rm -f utility-sunmoonsolar-dev 2>/dev/null || true
podman run -d --name utility-sunmoonsolar-dev -p 1026:1026 localhost/utility-sunmoonsolar-dev:latest
```

**NEVER** build or restart any prod container unless the user explicitly says so.

Dev server URL: http://localhost:1026

```bash
podman logs -f utility-sunmoonsolar-dev
```
