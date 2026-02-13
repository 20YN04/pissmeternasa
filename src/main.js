import { LightstreamerClient, Subscription } from "lightstreamer-client-web";
import "./style.css";

const statusEl = document.getElementById("status");
const liquidUrineEl = document.getElementById("liquid-urine");
const percentageUrineEl = document.getElementById("percentage-urine");
const liquidWasteEl = document.getElementById("liquid-waste");
const percentageWasteEl = document.getElementById("percentage-waste");
const debugEl = document.getElementById("debug");
const issCoordsEl = document.getElementById("iss-coords");
const issAltEl = document.getElementById("iss-alt");
const issVelEl = document.getElementById("iss-vel");
const nasaTitleEl = document.getElementById("nasa-title");
const wsStatusEl = document.getElementById("ws-status");

const log = (msg) => {
  console.log(`[UPA] ${msg}`);
  if (debugEl) debugEl.textContent = msg;
};

const client = new LightstreamerClient(
  "https://push.lightstreamer.com",
  "ISSLIVE"
);

const urineSubscription = new Subscription(
  "MERGE",
  ["NODE3000005"],
  ["Value", "TimeStamp", "Status.Class", "CalibratedData"]
);
urineSubscription.setRequestedSnapshot("yes");

const wasteSubscription = new Subscription(
  "MERGE",
  ["NODE3000008"],
  ["Value", "TimeStamp", "Status.Class", "CalibratedData"]
);
wasteSubscription.setRequestedSnapshot("yes");

const extractValue = (updateInfo) => {
  let raw = null;
  try { raw = updateInfo.getValue("Value"); } catch (_) {}
  if (raw == null) try { raw = updateInfo.getValue("CalibratedData"); } catch (_) {}
  if (raw == null) try { raw = updateInfo.getValue(1); } catch (_) {}
  return raw;
};

const updateLevel = (rawValue, liquidTarget, percentageTarget, label) => {
  if (rawValue == null) return;
  const cleaned = rawValue.toString().replace(/%/g, "").trim();
  const num = Number.parseFloat(cleaned);
  log(`${label} raw=${rawValue} parsed=${num}`);
  if (Number.isNaN(num)) return;

  const clamped = Math.max(0, Math.min(100, num));
  liquidTarget.style.height = `${clamped}%`;
  percentageTarget.textContent = `${clamped.toFixed(1)}%`;
};

const setStatus = (status) => {
  log(`Status: ${status}`);
  const isConnected = status.startsWith("CONNECTED");
  statusEl.textContent = isConnected ? "CONNECTED" : "SEARCHING FOR SIGNAL";
  statusEl.classList.toggle("status-connected", isConnected);
  statusEl.classList.toggle("status-searching", !isConnected);
};

client.addListener({
  onStatusChange: (status) => setStatus(status),
  onServerError: (code, msg) => log(`Server error ${code}: ${msg}`),
});

urineSubscription.addListener({
  onItemUpdate: (updateInfo) => {
    const value = extractValue(updateInfo);
    updateLevel(value, liquidUrineEl, percentageUrineEl, "URINE");
  },
  onSubscription: () => log("Urine subscription active"),
  onSubscriptionError: (code, msg) => log(`Urine sub error ${code}: ${msg}`),
  onUnsubscription: () => log("Urine unsubscribed"),
});

wasteSubscription.addListener({
  onItemUpdate: (updateInfo) => {
    const value = extractValue(updateInfo);
    updateLevel(value, liquidWasteEl, percentageWasteEl, "WASTE");
  },
  onSubscription: () => log("Waste subscription active"),
  onSubscriptionError: (code, msg) => log(`Waste sub error ${code}: ${msg}`),
  onUnsubscription: () => log("Waste unsubscribed"),
});

client.subscribe(urineSubscription);
client.subscribe(wasteSubscription);
client.connect();
log("Connecting...");

const fetchBackendTelemetry = async () => {
  // Direct client-side fetch to ISS API (no PHP dependency)
  try {
    const issRes = await fetch("https://api.wheretheiss.at/v1/satellites/25544", { cache: "no-store" });
    const iss = await issRes.json();

    if (iss?.latitude != null) {
      const lat = Number.parseFloat(iss.latitude).toFixed(2);
      const lon = Number.parseFloat(iss.longitude).toFixed(2);
      const alt = Number.parseFloat(iss.altitude).toFixed(0);
      const vel = Number.parseFloat(iss.velocity).toFixed(0);
      if (issCoordsEl) issCoordsEl.textContent = `${lat}°, ${lon}°`;
      if (issAltEl) issAltEl.textContent = `${alt} km`;
      if (issVelEl) issVelEl.textContent = `${vel} km/h`;
    }
  } catch (err) {
    log(`ISS API error: ${err.message}`);
  }

  // Backend fetch for crawler data (optional, may fail without composer)
  try {
    const res = await fetch("/api/telemetry.php", { cache: "no-store" });
    const text = await res.text();
    const data = JSON.parse(text);
    if (nasaTitleEl) nasaTitleEl.textContent = data?.nasaTitle || "—";
  } catch (_) {
    if (nasaTitleEl) nasaTitleEl.textContent = "NASA.gov";
  }
};

fetchBackendTelemetry();
setInterval(fetchBackendTelemetry, 30000);

const setupWebSocket = () => {
  try {
    const ws = new WebSocket("wss://ws.postman-echo.com/raw");
    wsStatusEl.textContent = "CONNECTING";

    ws.addEventListener("open", () => {
      wsStatusEl.textContent = "CONNECTED";
      ws.send(JSON.stringify({ type: "ping", source: "UPA Dashboard" }));
    });

    ws.addEventListener("message", () => {
      wsStatusEl.textContent = "LIVE";
    });

    ws.addEventListener("close", () => {
      wsStatusEl.textContent = "RECONNECTING";
      setTimeout(setupWebSocket, 5000);
    });

    ws.addEventListener("error", () => {
      wsStatusEl.textContent = "RECONNECTING";
    });
  } catch (error) {
    wsStatusEl.textContent = "UNAVAILABLE";
  }
};

setupWebSocket();
