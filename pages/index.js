import Head from "next/head";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Main from "../components/Main";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Only import and connect socket on client
    const socket = require("socket.io-client")("https://fixkaput.vercel.app", {
      path: "/api/socketio",
    });

    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });

    socket.on("testEvent", (data) => {
      console.log("📩 Received test event:", data);
    });

    socket.on("orderStatusChanged", (data) => {
      console.log("🛠️ Order status changed:", data);
    });

    return () => {
      socket.disconnect();
      console.log("❌ Disconnected from server");
    };
  }, []);

  return (
    <div>
      <Head>
        <title>fixKaput</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/fklogo.png" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/flickity@2/dist/flickity.min.css"
        />
      </Head>
      <Main />
    </div>
  );
}
