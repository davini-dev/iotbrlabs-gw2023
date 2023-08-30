import { W3bstreamClient } from "w3bstream-client-js";


const URL = "http://192.168.0.58:8889/srv-applet-mgr/v0/event/eth_0x3cf5a7c2b39632a841bb0f91df2ba3c4142fa8ab_iotbrlabs";
const API_KEY = "w3b_MV8xNjkyNjI1MDI4XyswbWFpcC5-YGk6cg";
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


const main = async () => {
    try {
      const res = await client.publishDirect(header, payload);
  
      console.log(JSON.stringify(res.data, null, 2));
    } catch (error) {
      console.error(error);
    }
  };
  
main();