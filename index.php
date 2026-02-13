<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ISS UPA Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="dist/assets/main.css" />
  </head>
  <body class="min-h-screen flex items-center justify-center px-6 py-10">
    <main class="relative hud-panel w-full max-w-6xl p-8 md:p-10 grid gap-8">
      <div class="scanlines" aria-hidden="true"></div>

      <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span class="text-xs tracking-[0.5em] uppercase text-sky-300/70">ISS UPA</span>
          <h1 class="text-2xl md:text-3xl font-semibold">Urine Processor Assembly</h1>
        </div>
        <div id="status" class="status-pill status-searching">SEARCHING FOR SIGNAL</div>
      </header>

      <section class="grid gap-8 lg:grid-cols-2">
        <div class="grid gap-6">
          <div class="tank-frame h-[360px]">
            <div id="liquid-urine" class="tank-liquid liquid-yellow"></div>
          </div>
          <div class="grid gap-2">
            <div class="text-xs tracking-[0.4em] uppercase text-sky-300/70">URINE (UPA)</div>
            <div id="percentage-urine" class="text-4xl md:text-5xl text-amber-300">--%</div>
            <div class="text-sm text-slate-300/80">Sensor: NODE3000005</div>
          </div>
        </div>

        <div class="grid gap-6">
          <div class="tank-frame h-[360px]">
            <div id="liquid-waste" class="tank-liquid liquid-green"></div>
          </div>
          <div class="grid gap-2">
            <div class="text-xs tracking-[0.4em] uppercase text-sky-300/70">WASTE WATER</div>
            <div id="percentage-waste" class="text-4xl md:text-5xl text-emerald-300">--%</div>
            <div class="text-sm text-slate-300/80">Sensor: NODE3000008</div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-sky-400/20 bg-hud-panel/70 px-5 py-4">
          <div class="text-xs tracking-[0.3em] uppercase text-sky-300/60">Feed</div>
          <div class="text-base text-slate-100">NASA Lightstreamer</div>
        </div>
        <div class="rounded-2xl border border-sky-400/20 bg-hud-panel/70 px-5 py-4">
          <div class="text-xs tracking-[0.3em] uppercase text-sky-300/60">Adapter</div>
          <div class="text-base text-slate-100">ISSLIVE</div>
        </div>
        <div class="rounded-2xl border border-sky-400/20 bg-hud-panel/70 px-5 py-4">
          <div class="text-xs tracking-[0.3em] uppercase text-sky-300/60">Items</div>
          <div class="text-base text-slate-100">NODE3000005 · NODE3000008</div>
        </div>
      </section>
    </main>

    <script type="module" src="dist/assets/main.js"></script>
  </body>
</html>
