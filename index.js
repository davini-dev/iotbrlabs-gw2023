import mqtt from "mqtt";
import { W3bstreamClient } from "w3bstream-client-js";
import axios from 'axios';

var mqttClient;

// Change this to point to your MQTT broker or DNS name
const mqttHost = "192.168.0.58";
const protocol = "mqtt";
const port = "1883";
const topic = "eth_0x3cf5a7c2b39632a841bb0f91df2ba3c4142fa8ab_iotbrlabs_";
const topic_env = "eth_0x3cf5a7c2b39632a841bb0f91df2ba3c4142fa8ab_iotbrlabs";
const url = "http://192.168.0.58:80/message?token=AfCDSPrP5h0Is-X";

const URL = "http://192.168.0.58:8889/srv-applet-mgr/v0/event/eth_0x3cf5a7c2b39632a841bb0f91df2ba3c4142fa8ab_iotbrlabs";
const API_KEY = "w3b_MV8xNjkyNjI1MDI4XyswbWFpcC5-YGk6cg";
const client = new W3bstreamClient(URL, API_KEY);


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
    reconnectPeriod: 10000,
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

    const pkt = JSON.parse(message);    
    const header = pkt['header'];

    const theader = {
      device_id: "device_001",
      event_type: header['event_type'],
      timestamp: Date.now(),
    };

    const payload = {
      temperature: 25,
    };

    console.log(JSON.stringify(pkt, null, 2));
    const res = await client.publishDirect(theader, payload);

    const bodyFormData = {
      title: "iotbrlabs-alert",
      message: JSON.stringify(payload),
      priority: 7,
    };

    axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: url,
      data: bodyFormData,
    })
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err.response ? error.response.data : err));

  } catch (error) {
    console.error(error);
  }
}

connectToBroker();
subscribeToTopic();


