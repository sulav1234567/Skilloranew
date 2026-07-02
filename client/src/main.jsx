
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GlobalMessageProvider } from "./Globalmessage/components/globalmessage.jsx";
import UserContextProvider from "./userinfo/userinfo.jsx";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ConfirmationMessageContextProvider from "./forms/components/confirmationmessage.jsx";

createRoot(document.getElementById("root")).render(

    
    <GlobalMessageProvider>
      <ConfirmationMessageContextProvider>

      <UserContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
       </UserContextProvider>
      </ConfirmationMessageContextProvider>
    </GlobalMessageProvider>

);
