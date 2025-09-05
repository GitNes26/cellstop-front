import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { env } from "../constant";

window.Pusher = Pusher;
console.log("🚀 ~ window:", window);

// const echo = new Echo({
// broadcaster: "pusher",
// key: env.APP_KEY, // Clave para WebSocket
// // wsHost: env.API_URL, //"localhost", // o tu dominio
// wsHost: window.location.origin,
// wsPort: 6001, // puerto websockets
// forceTLS: false,
// disableStats: true
// });

const echo = new Echo({
   broadcaster: "pusher",
   key: env.APP_KEY, // Clave para WebSocket
   wsHost: window.location.origin, // o tu dominio
   wsPort: 6001, // puerto websockets
   forceTLS: false,
   disableStats: true,
   enabledTransports: ["ws", "wss"]
});
console.log("🚀 ~ echo:", echo);
export default echo;
