import { LightstreamerClient, Subscription } from "lightstreamer-client-web";
import "./style.css";

const statusEl = document.getElementById("status");
const liquidUrineEl = document.getElementById("liquid-urine");
const percentageUrineEl = document.getElementById("percentage-urine");
const liquidWasteEl = document.getElementById("liquid-waste");
const percentageWasteEl = document.getElementById("percentage-waste");

const client = new LightstreamerClient(
  "https://push.lightstreamer.com",
  "ISSLIVE"
);

client.connectionDetails.setAdapterSet("ISSLIVE");

const urineSubscription = new Subscription("MERGE", "NODE3000005", ["Value"]);
urineSubscription.setDataAdapter("ISSLIVE");
urineSubscription.setRequestedSnapshot("yes");

const wasteSubscription = new Subscription("MERGE", "NODE3000008", ["Value"]);
wasteSubscription.setDataAdapter("ISSLIVE");
wasteSubscription.setRequestedSnapshot("yes");

const updateLevel = (rawValue, liquidTarget, percentageTarget) => {
  const cleanedValue = rawValue?.toString().replace(/%/g, "").trim();
  const numericValue = Number.parseFloat(cleanedValue);
  if (Number.isNaN(numericValue)) {
    return;
  }

  const clamped = Math.max(0, Math.min(100, numericValue));
  liquidTarget.style.height = `${clamped}%`;
  percentageTarget.textContent = `${clamped.toFixed(1)}%`;
};

const setStatus = (status) => {
  const isConnected = status.startsWith("CONNECTED");
  statusEl.textContent = isConnected ? "CONNECTED" : "SEARCHING FOR SIGNAL";
  statusEl.classList.toggle("status-connected", isConnected);
  statusEl.classList.toggle("status-searching", !isConnected);
};

client.addListener({
  onStatusChange: (status) => {
    setStatus(status);
  },
});

urineSubscription.addListener({
  onItemUpdate: (updateInfo) => {
    const value = updateInfo.getValue("Value") ?? updateInfo.getValue("value") ?? updateInfo.getValue(1);
    updateLevel(value, liquidUrineEl, percentageUrineEl);
  },
  onSubscriptionError: (code, message) => {
    statusEl.textContent = `SIGNAL ERROR ${code}`;
    statusEl.classList.add("status-searching");
    statusEl.classList.remove("status-connected");
    console.warn(message);
  },
});

wasteSubscription.addListener({
  onItemUpdate: (updateInfo) => {
    const value = updateInfo.getValue("Value") ?? updateInfo.getValue("value") ?? updateInfo.getValue(1);
    updateLevel(value, liquidWasteEl, percentageWasteEl);
  },
  onSubscriptionError: (code, message) => {
    statusEl.textContent = `SIGNAL ERROR ${code}`;
    statusEl.classList.add("status-searching");
    statusEl.classList.remove("status-connected");
    console.warn(message);
  },
});

client.subscribe(urineSubscription);
client.subscribe(wasteSubscription);
client.connect();
