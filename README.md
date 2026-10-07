# Sun Moon Solar

A fully offline Progressive Web App (PWA) for sun position, moon phase, and solar panel optimisation. All calculations run on-device using your browser — no server, no API calls, no data sent anywhere.

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![PWA Ready](https://img.shields.io/badge/PWA-ready-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Offline](https://img.shields.io/badge/offline-100%25-brightgreen)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)

<a id="toc"></a>

## Contents

- [Features](#features)
- [Contributing / CI](#contributing--ci)
- [Deploying / Hosting](#deploying--hosting)
- [Optional local preview](#optional-local-preview)
- [Usage](#usage)
  - [Setting Your Location](#setting-your-location)
  - [☀️ Sun Tab](#sun-tab)
  - [🌕 Moon Tab](#moon-tab)
  - [⚡ Solar Tab](#solar-tab)
- [Solar Declination Explained](#solar-declination-explained)
- [Glossary](#glossary)
- [Technical Notes](#technical-notes)
- [License](#license)

---

## Features

- **☀️ Sun** — live azimuth and elevation with compass rose and elevation arc instruments; 7-day sunrise, solar midpoint, and sunset table
- **🌕 Moon** — live azimuth, elevation, phase name, and illumination percentage; 7-day moonrise/midpoint/moonset table; next 6 full moon dates
- **⚡ Solar** — optimal solar panel face direction, summer/winter/year-round tilt angles, visual angle diagram, and a 12-month optimal tilt table based on solar declination
- **📍 Location** — search 28 bundled cities by name or country; enter any latitude/longitude manually (times in UTC); save, rename, and remove named favourites (persisted in `localStorage`)
- Fully offline after first load — installable as a PWA on desktop and mobile (SVG favicon + 192 PNG icon)
- Clock updates every 30 seconds in the **selected location's** timezone (hours and minutes, no frozen seconds)

[↑ Back to contents](#toc)

---

## Contributing / CI

Do **not** install Node.js or Bun on your laptop. Builds run on GitHub Actions.

Normal flow:

1. Create a **feature branch** and push it to GitHub.
2. Open a **pull request** into `main`.
3. Workflow **CI** (`.github/workflows/ci.yml`) runs on the PR: `bun install`, `bun run test`, `bun run build`.
4. **Merge** the PR when CI is green.
5. Workflow **Deploy** (`.github/workflows/deploy.yml`) runs because the merge produces a push to `main`. It builds again and uploads `dist/` to the live host over FTP.

Do not push commits directly to `main` as the normal path.

[↑ Back to contents](#toc)

---

## Deploying / Hosting

The live site is the **contents of `dist/`** only — a static build (HTML, JS, CSS, service worker, manifest, icons, `.htaccess`). Source and containers are never uploaded.

### Automatic (preferred)

After a PR merges into `main`, **Deploy** empties the remote `FTP_SERVER_DIR`, then uploads `dist/` via FTP. Configure these repository secrets (Settings → Secrets and variables → Actions):

| Secret | Purpose |
|---|---|
| `FTP_SERVER` | InfinityFree (or other) FTP hostname |
| `FTP_USERNAME` | FTP username |
| `FTP_PASSWORD` | FTP password |
| `FTP_SERVER_DIR` | Remote directory ending with `/` (e.g. `/htdocs/` or `/htdocs/sunmoonsolar/`) |

`base: './'` in Vite keeps assets working in a subdirectory. `public/.htaccess` is copied into `dist/` for Apache hosts.

Each production build stamps the short git SHA and GMT+2 publish time (`YYYYMMDDHHMM`) into the app footer (e.g. `a1b2c3d · 202610071935`) and writes `dist/version.json` (includes ISO `builtAt` and `builtAtStamp`). After deploy, open `/version.json` on the live site (or check the footer) to see which commit is published.

### What ends up on the server

Whatever is inside `dist/` after `bun run build` on the CI runner — not the git repo root.

[↑ Back to contents](#toc)

---

## Optional local preview

If you want a local UI while developing, use Podman only (no host Node/Bun):

```bash
podman build -t localhost/utility-sunmoonsolar-dev:latest -f Containerfile.dev .
podman rm -f utility-sunmoonsolar-dev 2>/dev/null || true
podman run -d --name utility-sunmoonsolar-dev -p 1026:1026 localhost/utility-sunmoonsolar-dev:latest
```

App: **http://localhost:1026** · Logs: `podman logs -f utility-sunmoonsolar-dev`

Local preview is optional. Production updates still come only from the Deploy workflow after a PR merge.

[↑ Back to contents](#toc)

---

## Usage

### Setting Your Location

The **Location** card appears at the top of the page and controls all calculations across every tab.

**City search**
Type any city name or country into the search box. A dropdown shows up to 12 matching cities with their coordinates. Use the arrow keys and Enter to pick a result, or click it. 28 cities are included with pre-configured IANA timezones — no network lookup needed.

**Manual latitude / longitude**
Enter a latitude (−90 to +90) and longitude (−180 to +180) in decimal degrees and press **Go**. Times for manual coordinates are shown in **UTC**. Pick a bundled city (or a favourite saved from one) for a local IANA timezone.

**Favourites**
- Click **☆ Save as Favourite** next to the current location to open the name form. The field is pre-filled with the location name — edit it to anything you like, then press **Save ★** or hit Enter.
- Saved favourites appear as quick-access chips. Click any chip to jump straight to that location.
- Click **★ Saved** on a saved location to rename it or remove it. The same inline form appears with the saved name pre-filled. Use **Rename ★** to update, **Remove** to delete, or **Cancel** to dismiss.
- Favourites are stored in your browser's `localStorage` and persist across sessions with no account or sync required.

[↑ Back to contents](#toc)

---

### ☀️ Sun Tab

Shows the current position of the sun and a 7-day rise/set table for the selected location.

**Instruments**

| Instrument | What it shows |
|---|---|
| Compass rose | The sun's current horizontal direction (azimuth). The gold dot sits on the rim at the bearing the sun is at right now. N, E, S, W are marked; tick marks every 15°. |
| Elevation arc | The sun's current angle above (or below) the horizon. The gold dot sits on the right-hand arc at the current elevation angle. A dashed arc shows up to 30° below the horizon. The dot turns red when the sun is below the horizon. |

**Position data**

- **Azimuth** — horizontal bearing in degrees clockwise from North (0° = North, 90° = East, 180° = South, 270° = West), plus the nearest compass point (e.g. SSW)
- **Elevation** — angle in degrees above the horizon; negative values mean the sun is below the horizon

**7-day table**

Shows sunrise, solar midpoint, and sunset for today and the next six days. A dash (—) appears when the sun does not rise or set on that day (polar summer/winter). Today's row is highlighted.

[↑ Back to contents](#toc)

---

### 🌕 Moon Tab

Shows the current position of the moon, its phase, illumination, a 7-day rise/set table, and the next six full moon dates.

**Instruments**

The compass rose and elevation arc work identically to the Sun tab. The moon's indicator is rendered in slate-blue; the dot turns red when the moon is below the horizon.

**Phase and illumination**

- **Illumination** — the percentage of the moon's visible face currently lit by the sun. Ranges from 0% (new moon) to 100% (full moon).
- **Phase name** — one of eight names from ~45° sectors of ecliptic longitude, centred on the named phases:

| Phase | Ecliptic longitude (sector centre) | Description |
|---|---|---|
| New Moon | 0° (±22.5°) | Moon is between Earth and Sun; dark side faces Earth |
| Waxing Crescent | 45° | A growing sliver visible in the western evening sky |
| First Quarter | 90° (±22.5°) | Right half illuminated (Northern hemisphere); rising at noon, setting at midnight |
| Waxing Gibbous | 135° | More than half lit and growing towards full |
| Full Moon | 180° (±22.5°) | Moon is opposite the Sun; fully illuminated |
| Waning Gibbous | 225° | More than half lit and shrinking |
| Last Quarter | 270° (±22.5°) | Left half illuminated; rising at midnight, setting at noon |
| Waning Crescent | 315° | A shrinking sliver visible in the eastern morning sky |

**7-day table** — moonrise, midpoint, and moonset per day. Dashes appear when there is no rise or set on a given day (the moon can skip a day, unlike the sun).

**Full moon list** — the date and local time of full moons in the next six months for the selected location.

[↑ Back to contents](#toc)

---

### ⚡ Solar Tab

Provides solar panel orientation guidance for the selected location based on its latitude and hemisphere.

**Face direction (today)**

At solar noon the panel should face the sun. That is towards the equator when `|latitude| > |declination|`. Near the equator, for part of the year the noon sun is on the **poleward** side of zenith, so the monthly table (and today's face direction) switch between North and South.

- **Northern hemisphere** (latitude > 5°) — usually face **South**
- **Southern hemisphere** (latitude < −5°) — usually face **North**
- **Tropics** — follow the monthly Face column; June at ~1°N (e.g. Singapore) faces **North**

**Tilt angles**

Tilt is always measured from horizontal (0° = flat on the ground, 90° = vertical).

| Setting | Angle | When the sun is… |
|---|---|---|
| ☀️ Summer tilt | `\|lat\| − 15°` | High in the sky; a lower tilt catches more direct rays |
| 📅 Year-round tilt | `\|lat\|` | The fixed-angle compromise for a non-adjustable panel |
| ❄️ Winter tilt | `\|lat\| + 15°` | Low on the horizon; a steeper tilt points the panel more directly at the sun |

These are time-of-year seasonal approximations. For a more precise angle on any given date, use the Monthly Optimal Tilt table.

**Angle diagram**

The SVG diagram shows three lines radiating from the bottom-left origin along a horizontal ground line:
- **Blue dashed** — winter tilt
- **Green** — year-round average
- **Yellow** — summer tilt

The arc between the blue and yellow lines illustrates the seasonal adjustment range.

**Monthly Optimal Tilt table**

Shows the theoretically optimal tilt angle for the 1st of each month, calculated from the sun's solar declination on that date. The current month is highlighted. Columns:

| Column | Description |
|---|---|
| Month | Name of the month (1st of that month used for calculation) |
| Declination | The sun's angular position north (+) or south (−) of the celestial equator on that date, in degrees |
| Face | North or South at solar noon that month |
| Optimal Tilt | The ideal panel tilt angle from horizontal for maximum perpendicular exposure on that date |

[↑ Back to contents](#toc)

---

## Solar Declination Explained

Solar declination is the angle between the sun's rays and the plane of Earth's equator — in simpler terms, how far north or south of the celestial equator the sun appears to sit when viewed from Earth. It is expressed in degrees, with positive values meaning the sun is north of the equator and negative values meaning it is south. At the two equinoxes the declination is exactly 0°, meaning the sun is directly above the equator and day and night are of equal length everywhere on Earth.

The root cause of solar declination is Earth's axial tilt of approximately 23.45° relative to the plane of its orbit around the sun (the ecliptic). As Earth travels around the sun over the course of a year, this fixed tilt means that first the Northern hemisphere, then the Southern hemisphere, leans toward the sun. At the June solstice (around 21 June) the Northern hemisphere is tilted maximally toward the sun and the declination reaches its peak of +23.45°. At the December solstice (around 21 December) the situation is reversed and the declination falls to its minimum of −23.45°. Between these extremes the declination changes continuously, passing through zero at the March and September equinoxes.

This app calculates solar declination using the standard approximation formula:

```
δ = 23.45 × sin( (2π / 365) × (284 + N) )
```

where **N** is the day of the year (1 = 1 January, 365 = 31 December) and **δ** is the declination in degrees. The constant 284 shifts the sine wave so that it peaks near day 172 (21 June) and troughs near day 355 (21 December). This is a practical rule of thumb (typically within about 1° of a full VSOP model) — more than sufficient for panel-tilt purposes.

The declination directly determines the optimal tilt for a solar panel on any given day. Because the sun's noon elevation angle at a given latitude is `90° − |latitude − δ|`, the angle at which a panel must be tilted from horizontal to face the sun perpendicularly at solar noon is simply `|latitude − δ|`. Facing is **South** when `latitude > δ` and **North** when `latitude < δ`. This is the value shown in the Monthly Optimal Tilt table.

[↑ Back to contents](#toc)

---

## Glossary

**Altitude / Elevation**
The angle of a celestial body above the horizon, measured in degrees. 0° means the body is exactly on the horizon; 90° means it is directly overhead (zenith). Negative values mean it is below the horizon.

**Azimuth**
The horizontal compass bearing of a celestial body, measured in degrees clockwise from due North. 0° = North, 90° = East, 180° = South, 270° = West.

**Cardinal directions**
The four primary compass points (N, E, S, W) and their intermediates. This app uses 16-point compass notation: N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW.

**Celestial equator**
The projection of Earth's equator onto the celestial sphere. The sun crosses it at the equinoxes.

**Ecliptic longitude**
The moon's angular position along the ecliptic (the plane of Earth's orbit), measured from 0° to 360°. It is used to determine moon phase: 0° = new moon, 90° = first quarter, 180° = full moon, 270° = last quarter.

**Hemisphere classification**
This app classifies locations as Northern (latitude > 5°), Southern (latitude < −5°), or Equatorial (within 5° of the equator). Panel facing at solar noon still follows `sign(latitude − declination)`, which can flip in the tropics.

**Illumination**
The percentage of the moon's visible face currently lit by reflected sunlight. 0% at new moon, 100% at full moon. Note that illumination alone does not tell you whether the moon is waxing or waning — the phase name provides that context.

**Midpoint (solar / lunar)**
The moment the body crosses the observer's meridian and reaches its highest elevation for that passage — the true upper transit. For the sun this is true solar noon; for the moon it is the culmination. This is computed directly from the astronomy engine, not as an arithmetic average of rise and set times. Shows — if no transit occurs within that calendar day (possible for the moon at high latitudes or when the moon's arc straddles midnight).

**Optimal tilt**
The angle from horizontal at which a solar panel should be tilted to receive sunlight perpendicularly at solar noon. Calculated as `|latitude − solar declination|` for a panel facing the noon sun (South if latitude > δ, North if latitude < δ).

**Solar declination**
The angle of the sun north (+) or south (−) of the celestial equator on a given day, ranging from −23.45° at the December solstice to +23.45° at the June solstice. See *Solar Declination Explained* above for full details.

**Solstice / Equinox**
The four key points in the solar year. At the **equinoxes** (≈ 20 March and 23 September) the sun is on the celestial equator and day and night are equal length. At the **solstices** (≈ 21 June and 21 December) the sun is at its maximum north or south declination and days are at their longest or shortest.

**Waxing / Waning**
*Waxing* means the illuminated portion of the moon is growing (new → full). *Waning* means it is shrinking (full → new).

**Crescent / Gibbous**
*Crescent* describes the moon when less than half of its face is illuminated. *Gibbous* describes it when more than half is illuminated.

[↑ Back to contents](#toc)

---

## Technical Notes

| Item | Detail |
|---|---|
| Framework | React 18 + Vite 5 + TypeScript |
| Celestial calculations | [astronomy-engine](https://github.com/cosinekitty/astronomy) — all sun/moon position, rise/set, phase, and illumination computed entirely on-device |
| Timezone | Bundled with each city; last location and favourites store the IANA id; manual lat/lng uses UTC |
| PWA | Vite PWA plugin with service worker; installable on desktop and mobile |
| Clock | React state updated every 30 seconds; header and tables use the location IANA timezone (civil midnight, including 23h/25h DST days) |
| Storage | Browser `localStorage` only — favourites and last location as JSON; invalid entries are dropped; nothing is sent to any server |
| Tests | `bun run test` (Vitest) on CI — timezone civil days, tropical facing, favourites schema |
| Default location | Centurion, South Africa (25.8603°S, 28.1894°E, `Africa/Johannesburg`) |
| CI / deploy | PR to `main` → `ci.yml`; merge → `deploy.yml` builds and FTPs `dist/` (no host Node/Bun) |
| Offline | Fully functional without network after initial load; no external fonts, no CDN resources, no analytics |

[↑ Back to contents](#toc)

---

## License

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**Sun Moon Solar** © 2026

This project is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

You are free to share and adapt this work for non-commercial purposes, provided you give appropriate credit and distribute any derivative works under the same license. See [LICENSE.md](./LICENSE.md) for the full terms.

[↑ Back to contents](#toc)
