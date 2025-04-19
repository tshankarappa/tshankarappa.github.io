const express = require("express");
const mqtt = require("mqtt");

const app = express();
app.use(express.json());

const PORT = 5000;
const MQTT_BROKER = "mqtt://localhost";
const client = mqtt.connect(MQTT_BROKER);

let sprinklerConfigs = {}; // Store configs by MAC address

// MQTT Connection
client.on("connect", () => {
    console.log("Connected to MQTT Broker");
});

// Register a new ESP32 sprinkler
app.post("/register", (req, res) => {
    const { mac, userId } = req.body;
    if (!mac || !userId) return res.status(400).json({ error: "MAC and User ID required" });
    
    if (!sprinklerConfigs[mac]) {
        sprinklerConfigs[mac] = { userId, config: {} };
    }
    
    res.json({ message: "Device registered", mac, userId });
});

// Update sprinkler configuration
app.post("/config/:mac", (req, res) => {
    const { mac } = req.params;
    const config = req.body;
    
    if (!sprinklerConfigs[mac]) return res.status(404).json({ error: "Device not registered" });
    
    sprinklerConfigs[mac].config = config;
    
    // Publish new config to MQTT
    client.publish(`sprinkler/config/${mac}`, JSON.stringify(config));
    
    res.json({ message: "Configuration updated and sent to device" });
});

// Get current config
app.get("/config/:mac", (req, res) => {
    const { mac } = req.params;
    if (!sprinklerConfigs[mac]) return res.status(404).json({ error: "Device not found" });
    res.json(sprinklerConfigs[mac].config);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
