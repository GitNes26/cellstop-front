import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import dayjs from "dayjs";
dayjs.extend(isBetween);
dayjs.extend(isToday);

import { GlobalContextProvider } from "./context/GlobalContext";
import AuthContextProvider from "./context/AuthContext";
import MenuContextProvider from "./context/MenuContext";
import DashboardContextProvider from "./context/DashboardContext";

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <GlobalContextProvider>
         <AuthContextProvider>
            <MenuContextProvider>
               <DashboardContextProvider>
                  <App />
               </DashboardContextProvider>
            </MenuContextProvider>
         </AuthContextProvider>
      </GlobalContextProvider>
   </React.StrictMode>
);
