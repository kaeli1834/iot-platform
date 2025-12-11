import mqtt from "mqtt";
import dotenv from "dotenv";

dotenv.config();

// ----------------------------------------------------
// Configuration
// ----------------------------------------------------
const MQTT_URL = process.env.MQTT_URL || "mqtt://mosquitto:1883"; // Default to local Mosquitto broker
const SENSORS = (process.env.SENSORS || "0001").split(",");
const INTERVAL = Number(process.env.PUBLISH_INTERVAL || 3000);
const METRICS = (process.env.METRICS || "temperature").split(",");
// Example: METRICS="temperature,humidity"
const MESSAGE_MODE = process.env.MESSAGE_MODE || "both";
// "single", "multi", "both"

// ----------------------------------------------------
// MQTT Client Setup
// ----------------------------------------------------
console.log("--------------------------------------------------");
console.log("IoT Simulator Starting...");
console.log("MQTT Broker:", MQTT_URL);
console.log("Sensors:", SENSORS.join(", "));
console.log("Metrics:", METRICS.join(", "));
console.log("Message Mode:", MESSAGE_MODE);
console.log("Publish Interval:", INTERVAL + "ms");
console.log("--------------------------------------------------");

const client = mqtt.connect(MQTT_URL);
console.log("Connecting to MQTT broker...");

// ----------------------------------------------------
// Simulator Loop
// ----------------------------------------------------
client.on("connect", () => {
  console.log("Connected to MQTT broker");

  setInterval(() => {
    SENSORS.forEach((sensorId) => {
      const values = METRICS.map((metric) => ({
        typeId: metric,
        value: Number(generateValue(metric)),
      }));

      // Send aggregated JSON (mode: single or both)
      if (MESSAGE_MODE === "single" || MESSAGE_MODE === "both") {
        const fullPayload = {
          sensorId,
          values,
          timestamp: new Date().toISOString(),
        };

        const topic = `iot/${sensorId}/data`;
        client.publish(topic, JSON.stringify(fullPayload));

        //console.log(`[AGGREGATED] ${sensorId} → ${topic}`);
      }

      // Send individual MQTT messages (mode: multi or both)
      if (MESSAGE_MODE === "multi" || MESSAGE_MODE === "both") {
        values.forEach((valueObj) => {
          const topic = `iot/${sensorId}/${valueObj.typeId}`;
          const payload = JSON.stringify({
            sensorId,
            typeId: valueObj.typeId,
            value: valueObj.value,
            timestamp: new Date().toISOString(),
          });

          client.publish(topic, payload);

          //console.log(
          //  `[METRIC] ${sensorId} → ${valueObj.typeId} = ${valueObj.value}`,
          //);
        });
      }
    });
  }, INTERVAL);
});

// ----------------------------------------------------
// Generate realistic sensor values
// ----------------------------------------------------
function generateValue(metric) {
  switch (metric) {
    case "temperature":
      return (20 + Math.random() * 15).toFixed(2); // 20–35°C
    case "humidity":
      return (40 + Math.random() * 30).toFixed(2); // 40–70%
    case "pressure":
      return (990 + Math.random() * 20).toFixed(2); // hPa
    case "co2":
      return (300 + Math.random() * 500).toFixed(0); // ppm
    case "light":
      return (100 + Math.random() * 900).toFixed(0); // lux
    default:
      return (Math.random() * 100).toFixed(2);
  }
}

// ----------------------------------------------------
// Graceful Shutdown (CTRL+C)
// ----------------------------------------------------
process.on("SIGINT", () => {
  console.log("\nStopping simulator...");
  client.end();
  process.exit(0);
});
