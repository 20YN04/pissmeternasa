import { LightstreamerClient, Subscription } from "lightstreamer-client-web";
import "./style.css";

const statusEl = document.getElementById("status");
const liquidUrineEl = document.getElementById("liquid-urine");
const percentageUrineEl = document.getElementById("percentage-urine");
const liquidWasteEl = document.getElementById("liquid-waste");
const percentageWasteEl = document.getElementById("percentage-waste");
const debugEl = document.getElementById("debug");

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
