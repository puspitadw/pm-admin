import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import App from "./App"; // ← INI IMPORT DEFAULT

ReactDOM.createRoot(document.getElementById("root")).render(
    <HeroUIProvider>
      <BrowserRouter>
        <App /> {/* ← PASTIKAN KOMponen App digunakan */}
      </BrowserRouter>
    </HeroUIProvider>
);