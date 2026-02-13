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

const subscription = new Subscription(
  "MERGE",
  ["NODE3000005", "NODE3000008"],
  ["Value"]
);
subscription.setRequestedSnapshot("yes");

const updateLevel = (rawValue, liquidTarget, percentageTarget) => {
  const numericValue = Number.parseFloat(rawValue);
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

subscription.addListener({
  onItemUpdate: (updateInfo) => {
    const value = updateInfo.getValue("Value");
    const itemName = updateInfo.getItemName();
    if (itemName === "NODE3000005") {
      updateLevel(value, liquidUrineEl, percentageUrineEl);
    } else if (itemName === "NODE3000008") {
      updateLevel(value, liquidWasteEl, percentageWasteEl);
    }
  },
});

client.subscribe(subscription);
client.connect();
