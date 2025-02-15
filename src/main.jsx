import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Zoom,ToastContainer } from "react-toastify";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <ToastContainer
      position="top-center"
      autoClose={2000}
      // hideProgressBar={false}
      // newestOnTop={false}
      // closeOnClick={false}
      // rtl={false}
      // pauseOnFocusLoss
      // draggable 
    
      transition={Zoom}
    />
  </StrictMode>
);
