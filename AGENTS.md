# utility-sunmoonsolar AGENTS.md

## Project: utility-sunmoonsolar
Static offline PWA — Sun, Moon & Solar calculator.
Stack: React + Vite + TypeScript. No backend.

## Dev Container
- Container name: `utility-sunmoonsolar-dev`
- Image: `localhost/utility-sunmoonsolar-dev:latest`
- Port: host `1026` → container `1026`

## After ANY source change — ONLY rebuild and restart dev

```bash
podman build -t localhost/utility-sunmoonsolar-dev:latest -f Containerfile.dev .
podman rm -f utility-sunmoonsolar-dev 2>/dev/null || true
podman run -d --name utility-sunmoonsolar-dev -p 1026:1026 localhost/utility-sunmoonsolar-dev:latest
```

**NEVER** build or restart any prod container unless the user explicitly says so.

## Dev server URL
http://localhost:1026

## Logs
```bash
podman logs -f utility-sunmoonsolar-dev
```
