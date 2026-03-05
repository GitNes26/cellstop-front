import { createContext, useContext, useState } from "react";
import env from "../constant/env";
import Toast from "../utils/Toast";
//mis colores
export const gpcLight = "#E9ECEF";
export const gpcDark = "#1E2126";
export const gpcDark100 = "#566173";
export const gpcDarkContrast = "#E9ECEF";
export const gpcBlue = "#1455CB";
export const gpcText = "#1455CB";
export const colorPrimaryMain = "#debb9a";
export const colorPrimaryDark = "#a46c38";
export const colorSecondaryMain = "#ad4432";
export const colorSecondaryDark = "#923929";
export const colorSecondaryLight = "#fdf3f1";
export const colorTableHeader = {
   bg: "#034AAB",
   text: "#f8fafc"
};

export const ROLE_SUPER_ADMIN = 1;
export const ROLE_ADMIN = 2;
export const ROLE_SELLER = 3;

export const GlobalContext = createContext();

const initialStateCounters = {
   requestAll: 0,
   requestByUser: 0,
   requestFinished: 0,
   requestInReview: 0,
   requestInEvaluate: 0,
   requestApproved: 0,
   requestPayed1: 0,
   requestPayed2: 0,
   requestPayed3: 0,
   requestPayed: 0,
   requestDelivered: 0,
   requestRejected: 0,
   requestCanceled: 0
};
export const API_EVENTS = `${env.API_URL}/events`;

export const GlobalContextProvider = ({ children }) => {
   // const [themeActive, setThemeActive] = useState(false);
   // const [colorTableHeader, setColorTableHeader] = useState(false);
   const [openDrawerSidebar, setOpenDrawerSidebar] = useState(true);
   const [openDrawer, setOpenDrawer] = useState(true);

   const [isLoading, setIsLoading] = useState(true);
   const [cursorLoading, setCursorLoading] = useState(false);
   const [openDialog, setOpenDialog] = useState(false);
   const [openDialogRegister, setOpenDialogRegister] = useState(false);
   const [openDialogFirm, setOpenDialogFirm] = useState(false);

   const [formTitle, setFormTitle] = useState("REGISTRAR OBJETO | EDITAR OBJETO");
   const [textBtnSubmit, setTextBtnSubmit] = useState("AGREGAR | GUARDAR");

   // #region INPUTS-COMMUNITY-COMPONENT
   const [disabledState, setDisabledState] = useState(true);
   const [disabledCity, setDisabledCity] = useState(true);
   const [disabledColony, setDisabledColony] = useState(true);
   const [showLoading, setShowLoading] = useState(false);
   const [dataStates, setDataStates] = useState([]);
   const [dataCities, setDataCities] = useState([]);
   const [dataColonies, setDataColonies] = useState([]);
   const [dataCP, setDataCP] = useState([]);
   //#endregion INPUTS-COMMUNITY-COMPONENT

   const [counters, setCounters] = useState(initialStateCounters);
   const resetCounters = () => {
      setCounters(initialStateCounters);
   };

   return (
      <GlobalContext.Provider
         value={{
            // themeActive,
            // setThemeActive,
            // colorTableHeader,
            // setColorTableHeader,
            openDrawerSidebar,
            setOpenDrawerSidebar,
            openDrawer,
            setOpenDrawer,
            isLoading,
            setIsLoading,
            cursorLoading,
            setCursorLoading,
            openDialog,
            setOpenDialog,
            openDialogRegister,
            setOpenDialogRegister,
            openDialogFirm,
            setOpenDialogFirm,
            formTitle,
            setFormTitle,
            disabledState,
            setDisabledState,
            disabledCity,
            setDisabledCity,
            disabledColony,
            setDisabledColony,
            showLoading,
            setShowLoading,
            dataStates,
            setDataStates,
            dataCities,
            setDataCities,
            dataColonies,
            setDataColonies,
            dataCP,
            setDataCP,
            counters,
            setCounters,
            resetCounters
         }}
      >
         {children}
      </GlobalContext.Provider>
   );
};
export const useGlobalContext = () => useContext(GlobalContext);
