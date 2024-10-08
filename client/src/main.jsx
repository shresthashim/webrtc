import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import { SocketProvider } from "./context/SocketProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <SocketProvider>
        <App />
      </SocketProvider>
    </Router>
  </StrictMode>
);
