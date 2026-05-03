# Sun Moon Solar

A fully offline Progressive Web App (PWA) for sun position, moon phase, and solar panel optimisation. All calculations run on-device using your browser — no server, no API calls, no data sent anywhere.

<a id="toc"></a>

## Contents

- [Features](#features)
- [Getting Started (Development)](#getting-started-development)
- [Deploying / Hosting](#deploying--hosting)
- [Usage](#usage)
  - [Setting Your Location](#setting-your-location)
  - [☀️ Sun Tab](#sun-tab)
  - [🌕 Moon Tab](#moon-tab)
  - [⚡ Solar Tab](#solar-tab)
- [Solar Declination Explained](#solar-declination-explained)
- [Glossary](#glossary)
- [Technical Notes](#technical-notes)

---

## Features

- **☀️ Sun** — live azimuth and elevation with compass rose and elevation arc instruments; 7-day sunrise, solar midpoint, and sunset table
- **🌕 Moon** — live azimuth, elevation, phase name, and illumination percentage; 7-day moonrise/midpoint/moonset table; next 6 full moon dates
- **⚡ Solar** — optimal solar panel face direction, summer/winter/year-round tilt angles, visual angle diagram, and a 12-month optimal tilt table based on solar declination
- **📍 Location** — search 130+ cities by name or country; enter any latitude/longitude manually; save, rename, and remove named favourites (persisted in `localStorage`)
- Fully offline after first load — installable as a PWA on desktop and mobile
- Clock updates every 30 seconds; all times displayed in the location's local timezone

[↑ Back to contents](#toc)

---

## Getting Started (Development)

### Prerequisites

- [Podman](https://podman.io/) (rootless, no Docker required)
- No Node.js or Bun required on the host — everything runs inside the container

### Build and run

Use the provided `dev.sh` script — it handles everything in one command:

```bash
bash dev.sh
```

`dev.sh` performs these steps in order:

1. Builds the dev container image from `Containerfile.dev`
2. Removes the old `utility-sunmoonsolar-dev` container (if running)
3. Starts a new container on port **1026**
4. Runs the production build (`tsc && vite build`) inside the container
5. Copies the fresh `dist/` folder to the project root on the host

The app is then available at **http://localhost:1026** and `dist/` is ready to deploy.

### After any source change

Run `bash dev.sh` again. It always does a full rebuild and refreshes `dist/` automatically.

### View logs

```bash
podman logs -f utility-sunmoonsolar-dev
```

### Stop the container

```bash
podman rm -f utility-sunmoonsolar-dev
```

[↑ Back to contents](#toc)

---

## Deploying / Hosting

This is a fully static app — no server-side runtime is required. You only need a web server that can serve static files.

### 1. Build the production bundle

Run the build inside the dev container:

```bash
podman exec utility-sunmoonsolar-dev bun run build
```

This runs `tsc && vite build` and writes the output to the `dist/` folder in the project root.

### 2. Copy `dist/` to your web server

The **`dist/`** folder is the only thing you need to deploy. Copy its entire contents to your web server's document root (e.g. `/var/www/html/` or the equivalent for your host):

```bash
rsync -av dist/ user@yourserver:/var/www/html/
```

`dist/` contains the compiled HTML, JS bundles, CSS, service worker, PWA manifest, and icons — everything needed to run the app offline after the first load.

### 3. Configure your web server for SPA routing

Because the app uses client-side routing, your web server must serve `index.html` for any path that does not match a real file. Without this, direct URL access and page refreshes will return 404 errors.

**nginx**

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache** (`.htaccess` in document root)

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

**Netlify / Vercel / GitHub Pages**

SPA fallback is handled automatically — no extra configuration needed.

[↑ Back to contents](#toc)

---

## Usage

### Setting Your Location

The **Location** card appears at the top of the page and controls all calculations across every tab.

**City search**
Type any city name or country into the search box. A dropdown shows up to 12 matching cities with their coordinates. Click a result to select it. Over 130 major cities are included with pre-configured IANA timezones — no network lookup needed.

**Manual latitude / longitude**
Enter a latitude (−90 to +90) and longitude (−180 to +180) in decimal degrees and press **Go**. The timezone is resolved automatically from the coordinates using a bundled offline lookup table.

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
- **Phase name** — one of the eight standard phases based on the moon's ecliptic longitude:

| Phase | Ecliptic longitude | Description |
|---|---|---|
| New Moon | 0° | Moon is between Earth and Sun; dark side faces Earth |
| Waxing Crescent | 0°–90° | A growing sliver visible in the western evening sky |
| First Quarter | 90° | Right half illuminated (Northern hemisphere); rising at noon, setting at midnight |
| Waxing Gibbous | 90°–180° | More than half lit and growing towards full |
| Full Moon | 180° | Moon is opposite the Sun; fully illuminated |
| Waning Gibbous | 180°–270° | More than half lit and shrinking |
| Last Quarter | 270° | Left half illuminated; rising at midnight, setting at noon |
| Waning Crescent | 270°–360° | A shrinking sliver visible in the eastern morning sky |

**7-day table** — moonrise, midpoint, and moonset per day. Dashes appear when there is no rise or set on a given day (the moon can skip a day, unlike the sun).

**Full moon list** — the exact date and local time of the next six full moons for the selected location.

[↑ Back to contents](#toc)

---

### ⚡ Solar Tab

Provides solar panel orientation guidance for the selected location based on its latitude and hemisphere.

**Face direction**

Solar panels should always face the equator to maximise exposure to the sun's arc across the sky:
- **Northern hemisphere** (latitude > 5°) → face **South**
- **Southern hemisphere** (latitude < −5°) → face **North**
- **Equatorial zone** (−5° to +5°) → face South if north of equator, North if south

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

where **N** is the day of the year (1 = 1 January, 365 = 31 December) and **δ** is the declination in degrees. The constant 284 shifts the sine wave so that it peaks near day 172 (21 June) and troughs near day 355 (21 December), matching observed solar behaviour to within about 0.3° — more than sufficient for practical panel-tilt purposes.

The declination directly determines the optimal tilt for a solar panel on any given day. Because the sun's noon elevation angle at a given latitude is `90° − |latitude − δ|`, the angle at which a panel must be tilted from horizontal to face the sun perpendicularly at solar noon is simply `|latitude − δ|`. This is the value shown in the Monthly Optimal Tilt table. For a location at 51.5°N (London) the optimal tilt ranges from about 28° in mid-summer (sun high, shallow tilt) to around 75° in mid-winter (sun low, steep tilt) — a swing of nearly 47° across the year. For locations close to the equator the range is much smaller because the declination swing of ±23.45° represents a proportionally larger share of the total sun angle.

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
This app classifies locations as Northern (latitude > 5°), Southern (latitude < −5°), or Equatorial (within 5° of the equator). The classification determines which direction a solar panel should face.

**Illumination**
The percentage of the moon's visible face currently lit by reflected sunlight. 0% at new moon, 100% at full moon. Note that illumination alone does not tell you whether the moon is waxing or waning — the phase name provides that context.

**Midpoint (solar / lunar)**
The moment halfway in time between rise and set for a given day. For the sun this is close to solar noon (the moment the sun reaches its highest point) but may differ slightly due to the equation of time. For the moon the midpoint is the moment of highest elevation for that day's passage.

**Optimal tilt**
The angle from horizontal at which a solar panel should be tilted to receive sunlight perpendicularly at solar noon. Calculated as `|latitude − solar declination|` for a panel facing the equator. Ranges from close to 0° (equatorial summer) to around 75°–80° (high-latitude winter).

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
| Timezone resolution | [tz-lookup](https://github.com/darkskyapp/tz-lookup) — offline IANA timezone lookup from coordinates; no network call required |
| PWA | Vite PWA plugin with service worker; installable on desktop and mobile |
| Clock | React state updated every 30 seconds; all instruments and position data re-render automatically |
| Storage | Browser `localStorage` only — favourites are stored as JSON; nothing is sent to any server |
| Default location | London, UK (51.5074°N, 0.1278°W, `Europe/London`) |
| Container | Rootless Podman; Bun runtime inside container; host requires only Podman and a POSIX shell |
| Offline | Fully functional without network after initial load; no external fonts, no CDN resources, no analytics |

[↑ Back to contents](#toc)
