<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ISS UPA Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="dist/assets/main.css" />
  </head>
  <body class="min-h-screen bg-white text-black font-display">

    <div class="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">

      <!-- Header -->
      <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
        <div>
          <p class="text-[11px] tracking-[0.5em] uppercase text-black/40 mb-2">International Space Station</p>
          <h1 class="text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight text-black">
            Urine Processor<br/>Assembly
          </h1>
        </div>
        <div id="status" class="status-pill status-searching">SEARCHING FOR SIGNAL</div>
      </header>

      <!-- Tanks -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        <!-- Urine Tank -->
        <div>
          <div class="tank-frame h-[400px] mb-6">
            <div id="liquid-urine" class="tank-liquid liquid-yellow"></div>
          </div>
          <p class="text-[11px] tracking-[0.5em] uppercase text-black/40 mb-1">Urine (UPA)</p>
          <p id="percentage-urine" class="text-6xl md:text-8xl font-extrabold tracking-tighter text-black leading-none">—</p>
          <p class="text-sm text-black/40 mt-2">NODE3000005</p>
        </div>

        <!-- Waste Water Tank -->
        <div>
          <div class="tank-frame h-[400px] mb-6">
            <div id="liquid-waste" class="tank-liquid liquid-green"></div>
          </div>
          <p class="text-[11px] tracking-[0.5em] uppercase text-black/40 mb-1">Waste Water</p>
          <p id="percentage-waste" class="text-6xl md:text-8xl font-extrabold tracking-tighter text-black leading-none">—</p>
          <p class="text-sm text-black/40 mt-2">NODE3000008</p>
        </div>

      </section>

      <!-- Footer -->
      <footer class="border-t border-black/10 pt-8 flex flex-wrap gap-x-12 gap-y-4 text-sm text-black/40">
        <span>NASA Lightstreamer</span>
        <span>Adapter: ISSLIVE</span>
        <span>Realtime telemetry</span>
        <span>ISS: <strong class="text-black" id="iss-coords">—</strong></span>
        <span>Altitude: <strong class="text-black" id="iss-alt">—</strong></span>
        <span>Velocity: <strong class="text-black" id="iss-vel">—</strong></span>
        <span>NASA: <strong class="text-black" id="nasa-title">—</strong></span>
        <span class="ml-auto">WebSocket: <strong class="text-black" id="ws-status">—</strong></span>
        <span id="debug" class="w-full text-xs text-black/25"></span>
      </footer>

    </div>

    <script type="module" src="dist/assets/main.js"></script>
  </body>
</html>
