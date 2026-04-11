import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GlobalMessageProvider } from "./Globalmessage/components/globalmessage.jsx";
import UserContextProvider from "./userinfo/userinfo.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    
    <GlobalMessageProvider>
      <UserContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
       </UserContextProvider>
    </GlobalMessageProvider>
  </StrictMode>,
);
