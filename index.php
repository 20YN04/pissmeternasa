<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ISS UPA Dashboard</title>
    <link rel="stylesheet" href="dist/assets/main.css" />
  </head>
  <body>
    <main class="hud">
      <header class="hud__header">
        <div class="hud__title">
          <span class="hud__label">ISS UPA</span>
          <h1>Urine Processor Assembly</h1>
        </div>
        <div id="status" class="hud__status is-searching">SEARCHING FOR SIGNAL</div>
      </header>

      <section class="tank">
        <div class="tank__frame">
          <div id="liquid" class="tank__liquid"></div>
        </div>
        <div class="tank__readout">
          <div class="readout__label">Urine Tank Level</div>
          <div id="percentage" class="readout__value">--%</div>
          <div class="readout__meta">Sensor: NODE3000005</div>
        </div>
      </section>

      <section class="telemetry">
        <div class="telemetry__card">
          <div class="telemetry__label">Feed</div>
          <div class="telemetry__value">NASA Lightstreamer</div>
        </div>
        <div class="telemetry__card">
          <div class="telemetry__label">Adapter</div>
          <div class="telemetry__value">ISSLIVE</div>
        </div>
        <div class="telemetry__card">
          <div class="telemetry__label">Item</div>
          <div class="telemetry__value">NODE3000005</div>
        </div>
      </section>
    </main>

    <script type="module" src="dist/assets/main.js"></script>
  </body>
</html>
