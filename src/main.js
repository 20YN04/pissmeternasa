import { LightstreamerClient, Subscription } from "lightstreamer-client-web";
import "./style.css";

const statusEl = document.getElementById("status");
const liquidEl = document.getElementById("liquid");
const percentageEl = document.getElementById("percentage");

const client = new LightstreamerClient(
  "https://push.lightstreamer.com",
  "ISSLIVE"
);

client.connectionDetails.setAdapterSet("ISSLIVE");

const subscription = new Subscription("MERGE", "NODE3000005", ["Value"]);
subscription.setRequestedSnapshot("yes");

const updateLevel = (rawValue) => {
  const numericValue = Number.parseFloat(rawValue);
  if (Number.isNaN(numericValue)) {
    return;
  }

  const clamped = Math.max(0, Math.min(100, numericValue));
  liquidEl.style.height = `${clamped}%`;
  percentageEl.textContent = `${clamped.toFixed(1)}%`;
};

const setStatus = (status) => {
  const isConnected = status.startsWith("CONNECTED");
  statusEl.textContent = isConnected ? "CONNECTED" : "SEARCHING FOR SIGNAL";
  statusEl.classList.toggle("is-connected", isConnected);
  statusEl.classList.toggle("is-searching", !isConnected);
};

client.addListener({
  onStatusChange: (status) => {
    setStatus(status);
  },
});

subscription.addListener({
  onItemUpdate: (updateInfo) => {
    const value = updateInfo.getValue("Value");
    updateLevel(value);
  },
});

client.subscribe(subscription);
client.connect();
