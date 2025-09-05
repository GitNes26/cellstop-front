import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import isBetween from "dayjs/plugin/isBetween";
import dayjs from "dayjs";
dayjs.extend(isBetween);

import { GlobalContextProvider } from "./context/GlobalContext";
import AuthContextProvider from "./context/AuthContext";
import MenuContextProvider from "./context/MenuContext";

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <GlobalContextProvider>
         <AuthContextProvider>
            <MenuContextProvider>
               <App  />
            </MenuContextProvider>
         </AuthContextProvider>
      </GlobalContextProvider>
   </React.StrictMode>,
);
