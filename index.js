import mqtt from "mqtt";
import { W3bstreamClient } from "w3bstream-client-js";


var mqttClient;

// Change this to point to your MQTT broker or DNS name
const mqttHost = "104.198.23.192";
const protocol = "mqtt";
const port = "1883";
const topic = "eth_0x1800c91c3839fc5ba554d2c2777099cd7f239bb4_iotbrlabs_";
const topic_env = "eth_0x1800c91c3839fc5ba554d2c2777099cd7f239bb4_iotbrlabs";


const URL = "https://dev.w3bstream.com/api/w3bapp/event/eth_0x1800c91c3839fc5ba554d2c2777099cd7f239bb4_iotbrlabs";
const API_KEY = "w3b_MV8xNjkwMjI0ODc3XzlRXTM5RU4nK1l8Jw";
const client = new W3bstreamClient(URL, API_KEY);


const header = {
    device_id: "device_001",
    event_type: "DEFAULT",
    timestamp: Date.now(),
};
  
  // payload can be an object
  const payload = {
    temperature: 25,
};


function connectToBroker() {
  const clientId = "iotbrlabs-gw2023"

  // Change this to point to your MQTT broker
  const hostURL = `${protocol}://${mqttHost}:${port}`;

  const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  };

  mqttClient = mqtt.connect(hostURL, options);

  mqttClient.on("error", (err) => {
    console.log("Error: ", err);
    mqttClient.end();
  });

  mqttClient.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  mqttClient.on("connect", () => {
    console.log("Client connected:" + clientId);
  });

  // Received Message
  mqttClient.on("message", (topic, message, packet) => {
    console.log(
      "Received Message: " + message.toString() + "\nOn topic: " + topic
    );
  // publishMessage(message);
  //payload = message;  
  publishMessage_(message); 
})}

function subscribeToTopic() {
    console.log(`Subscribing to Topic: ${topic}`);
  
    mqttClient.subscribe(topic, { qos: 0 });
}

function publishMessage(message) {
    console.log(`Sending Topic: ${topic_env}, Message: ${message}`);
    mqttClient.publish(topic_env, message, {
      qos: 0,
      retain: false,
    });
}

 async function publishMessage_(message) {
  try {
    payload = JSON.parse(message);
    const res = await client.publishDirect(header, payload);

    console.log(JSON.stringify(res.data, null, 2));
  } catch (error) {
    console.error(error);
  }
}

connectToBroker();
subscribeToTopic();


