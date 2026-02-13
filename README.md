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
