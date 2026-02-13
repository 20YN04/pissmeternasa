<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ISS UPA Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="dist/assets/main.css" />
  </head>
  <body class="min-h-screen flex items-center justify-center px-6 py-12 bg-black text-white">
    <main class="w-full max-w-6xl rounded-3xl border border-white/15 bg-white p-8 md:p-12 grid gap-10 shadow-2xl text-black">
      <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span class="text-xs tracking-[0.4em] uppercase text-black/50">ISS UPA</span>
          <h1 class="text-3xl md:text-4xl font-semibold text-black">Urine Processor Assembly</h1>
        </div>
        <div id="status" class="status-pill status-searching">SEARCHING FOR SIGNAL</div>
      </header>

      <section class="grid gap-8 lg:grid-cols-2">
        <div class="grid gap-6">
          <div class="tank-frame h-[360px] bg-white">
            <div id="liquid-urine" class="tank-liquid liquid-yellow"></div>
          </div>
          <div class="grid gap-2">
            <div class="text-xs tracking-[0.4em] uppercase text-black/50">URINE (UPA)</div>
            <div id="percentage-urine" class="text-4xl md:text-5xl text-black">--%</div>
            <div class="text-sm text-black/60">Sensor: NODE3000005</div>
          </div>
        </div>

        <div class="grid gap-6">
          <div class="tank-frame h-[360px] bg-white">
            <div id="liquid-waste" class="tank-liquid liquid-green"></div>
          </div>
          <div class="grid gap-2">
            <div class="text-xs tracking-[0.4em] uppercase text-black/50">WASTE WATER</div>
            <div id="percentage-waste" class="text-4xl md:text-5xl text-black">--%</div>
            <div class="text-sm text-black/60">Sensor: NODE3000008</div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-black/10 bg-white px-5 py-4">
          <div class="text-xs tracking-[0.3em] uppercase text-black/50">Feed</div>
          <div class="text-base text-black">NASA Lightstreamer</div>
        </div>
        <div class="rounded-2xl border border-black/10 bg-white px-5 py-4">
          <div class="text-xs tracking-[0.3em] uppercase text-black/50">Adapter</div>
          <div class="text-base text-black">ISSLIVE</div>
        </div>
        <div class="rounded-2xl border border-black/10 bg-white px-5 py-4">
          <div class="text-xs tracking-[0.3em] uppercase text-black/50">Items</div>
          <div class="text-base text-black">NODE3000005 · NODE3000008</div>
        </div>
      </section>
    </main>

    <script type="module" src="dist/assets/main.js"></script>
  </body>
</html>
