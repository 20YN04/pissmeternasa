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

### Wat als de API down is?

Daar heb ik tijdens het bouwen best veel over nagedacht. Je wilt niet dat je hele dashboard crasht omdat één externe API het even niet doet. Daarom heb ik het zo gebouwd dat alles in aparte `try/catch` blokken zit — zowel in de PHP backend als in de JavaScript. Als de ISS-positie API (`wheretheiss.at`) niet bereikbaar is, blijft de rest van het dashboard gewoon draaien. De Lightstreamer data voor de tanks komt via een compleet andere verbinding, dus die wordt er niet door geraakt. In de frontend staat er gewoon een streepje (`—`) als er geen data binnenkomt, in plaats van dat je een lege pagina of een error krijgt.

### Stale data indicators

Op dit moment is er nog geen expliciete "data is verouderd" melding ingebouwd, maar er zitten wel een paar dingen in die je helpen. De WebSocket status in de footer laat zien of de verbinding nog leeft (`LIVE`, `RECONNECTING`, etc.), en de Lightstreamer status bovenaan zegt `CONNECTED` of `SEARCHING FOR SIGNAL`. Als die op searching blijft staan, weet je dat er iets mis is. In een productie-omgeving zou ik er een timestamp aan toevoegen die laat zien wanneer de laatste update binnenkwam, zodat je kan zien of de data vers is.

### Fallback values

Overal waar data kan missen, staan er fallback waardes. De tank percentages beginnen op `—`, de ISS-coördinaten op `—`, en als de NASA crawler faalt verschijnt er gewoon "NASA.gov" als placeholder. Het idee is dat de gebruiker altijd iets ziet, ook al is de data tijdelijk niet beschikbaar. Niks is erger dan een leeg scherm.

### Security awareness: geen secrets in JS

Hier hoefde ik niet super veel over na te denken voor dit project specifiek, maar het is wel belangrijk om te benoemen. Alle API's die we aanroepen zijn publiek — NASA's Lightstreamer server en de ISS-positie API hebben geen API key nodig. Er staan dus geen geheime tokens of credentials in de JavaScript code. Dat is belangrijk omdat alles wat in je JS zit, door iedereen te lezen is via de browser devtools. Als je ooit wél een API key nodig hebt, moet die altijd via de PHP backend lopen zodat die nooit bij de client terecht komt.

### Input sanitization

De data die binnenkomt van de externe API's wordt niet zomaar in de DOM gegooid. In de JavaScript gebruiken we `textContent` in plaats van `innerHTML`, wat betekent dat eventuele HTML of script-tags in de data gewoon als tekst worden weergegeven en niet worden uitgevoerd. Dat voorkomt XSS-aanvallen. In de PHP backend wordt de output altijd door `json_encode` gehaald, wat automatisch escaping doet.

### Trust boundaries

Er zijn eigenlijk drie "zones" in dit project:

1. **De externe API's** (NASA Lightstreamer, wheretheiss.at, nasa.gov) — hier heb je geen controle over. Je moet er vanuit gaan dat die data onverwacht kan zijn, traag kan zijn, of helemaal niet kan komen.
2. **De PHP backend** — dit is jouw server. Hier verwerk je de data van de externe API's en stuur je het door naar de frontend. PHP errors worden onderdrukt zodat ze niet als HTML in je JSON response terechtkomen.
3. **De browser/frontend** — dit is de client, en die vertrouw je nooit. Alles wat je naar de client stuurt is publiek. Daarom staan er geen secrets in de JS en wordt alle data netjes via `textContent` gerenderd.

Het belangrijkste principe: vertrouw nooit data die van buiten je eigen server komt, en vertrouw nooit de client.
