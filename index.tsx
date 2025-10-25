import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import App from "./example/App";
import RouteExample from "./example/RouteExample"; // 🆕

createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
        <BrowserRouter>
            <nav
                style={{
                    position: "fixed",
                    top: 10,
                    left: 10,
                    zIndex: 1000,
                    background: "white",
                    padding: 8,
                    borderRadius: 4,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    display: "flex",
                    gap: 8,
                }}
            >
                <Link to="/">🏠 Markers</Link>
                <Link to="/route">🧭 Route</Link>
            </nav>

            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/route" element={<RouteExample />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
