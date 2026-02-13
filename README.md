# ISS Urine Processor Assembly Dashboard

Real-time visualization of the International Space Station's wastewater tank levels using live NASA telemetry.

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **PHP** ≥ 8.0 (with built-in server or Apache/Nginx)
- **Composer** ≥ 2.5

## Installation

```bash
git clone <your-repo-url>
cd pissmeternasa
npm install
composer install
```

## Build

Compile the JavaScript and CSS into the `dist/` folder:

```bash
npm run build
```

## Run

Start a local PHP server:

```bash
php -S localhost:8000
```

Then open [http://localhost:8000/index.php](http://localhost:8000/index.php) in your browser.

## Development

For hot-reload during development:

```bash
npm run dev
```

> Note: In dev mode the built assets in `dist/` are not updated. The `index.php` file references `dist/assets/main.js` and `dist/assets/main.css`, so for the PHP page to work you need to run `npm run build` first.

## Data Source

Live telemetry is streamed from NASA's public Lightstreamer server:

| Parameter    | Value                              |
| ------------ | ---------------------------------- |
| Server       | `https://push.lightstreamer.com`   |
| Adapter Set  | `ISSLIVE`                          |
| Urine Tank   | `NODE3000005`                      |
| Waste Water  | `NODE3000008`                      |
| Field        | `Value` (fill percentage)          |

## Backend Utilities

The PHP backend endpoint at `/api/telemetry.php` demonstrates:

- **Guzzle** API calls (ISS position)
- **cURL** for a simple web crawl (NASA homepage title)
- **JSON parsing** with `json_decode`
- **WebSocket** client on the frontend for status (echo server)

## Project Structure

```
pissmeternasa/
├── index.php              # Main page (served by PHP)
├── src/
│   ├── main.js            # Lightstreamer connection & DOM updates
│   └── style.css          # Tailwind CSS + custom animations
├── dist/                  # Vite build output (git-ignored)
│   └── assets/
│       ├── main.js
│       └── main.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## License

ISC

---

## Reflectie: Betrouwbaarheid & Beveiliging

- **API down?** — Alles zit in aparte `try/catch` blokken. Als één API faalt draait de rest gewoon door. Geen data = streepje (`—`) in de UI, geen crash.
- **Stale data** — De Lightstreamer status ("CONNECTED" / "SEARCHING FOR SIGNAL") en WebSocket status ("LIVE" / "RECONNECTING") geven aan of er nog verse data binnenkomt.
- **Fallback values** — Tanks beginnen op `—`, ISS-coördinaten op `—`, NASA titel valt terug op "NASA.gov". De gebruiker ziet altijd iets.
- **Geen secrets in JS** — Alle API's zijn publiek, er staan geen keys in de frontend. Mocht dat ooit nodig zijn, dan loopt het via de PHP backend.
- **Input sanitization** — We gebruiken `textContent` ipv `innerHTML` (geen XSS), en PHP output gaat altijd door `json_encode`.
- **Trust boundaries** — Drie zones: externe API's (niet te vertrouwen), PHP backend (jouw server), browser (publiek). Vertrouw nooit data van buiten.

---

## AI-code die fout bleek

1. **`setDataAdapter("ISSLIVE")`** — "ISSLIVE" is de adapter *set*, niet de data adapter. Subscriptions werden stil geweigerd, geen errors, gewoon geen data. Pas na meerdere pogingen gevonden en verwijderd.
2. **PHP gaf HTML errors ipv JSON** — Geen error handling rond `require autoload.php`. Als Composer niet geïnstalleerd was kreeg de frontend `<br /><b>Fatal error...` terug. Gefixed met `error_reporting(0)` en `file_exists()` check.
3. **WebSocket URL offline** — `wss://echo.websocket.events` bestond niet meer. Vervangen door `wss://ws.postman-echo.com/raw` met auto-reconnect.
4. **DOMDocument miste** — PHP `dom` extensie niet overal beschikbaar. Vervangen door simpele `preg_match` op `<title>`.

**Les:** AI-code ziet er syntactisch correct uit maar kan semantisch fout zijn. Altijd zelf testen en documentatie checken.

---

## Gebruikte technologieën

| Technologie | Wat het is | Waar in het project |
|---|---|---|
| **cURL** | Low-level PHP HTTP client, zit standaard in PHP | `api/telemetry.php` — crawlt nasa.gov |
| **Guzzle** | High-level PHP HTTP client bovenop cURL (via Composer) | `api/telemetry.php` — ISS positie API |
| **JSON parser** | `json_decode`/`json_encode` (PHP), `.json()`/`JSON.parse` (JS) | Overal voor API communicatie |
| **WebSockets** | Tweezijdige open verbinding tussen browser en server | `src/main.js` — live verbindingsstatus |
| **Crawler** | Script dat een webpagina ophaalt en data eruit parst | `api/telemetry.php` — NASA homepage title |
| **API calls** | HTTP requests naar endpoints die JSON teruggeven | PHP (Guzzle → wheretheiss.at) + JS (fetch) |
