import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios, Response } from "../utils/Api";
import Toast from "../utils/Toast";
import { useAuthContext } from "./AuthContext";
import { ROLE_ADMIN } from "./GlobalContext";
import to from "await-to-js";

const DashboardContext = createContext();

// export const formDataInitialState = {
//    folio: "",
//    active: ""
// };
const prefixPath = "/dashboard";

export default function DashboardContextProvider({ children }) {
   const params = useParams();
   const singularName = "Tablero", //Escribirlo siempre letra Capital
      pluralName = "Tableros"; //Escribirlo siempre letra Capital

   // const { counters, setCounters } = useGlobalContext();
   const { auth } = useAuthContext();

   const [dashboard, setDashboard] = useState(null);
   const [sellerDashboard, setSellerDashboard] = useState([]);
   const [sellerDashboardData, setSellerDashboardData] = useState(null);
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSubmit] = useState("REGISTRAR");
   const [formData, setFormData] = useState(null);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);
   const [isEdit, setIsEdit] = useState(false);

   //#region CRUD
   const getSellerDashboard = async () => {
      const [error, response] = await to(Axios.post(`${prefixPath}/by-seller`));
      // console.log("🚀 ~ getSellerDashboard ~ error:", error);
      // console.log("🚀 ~ getSellerDashboard ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSellerDashboard ~ error:", error);
         const message = error.response.data.message || "getSellerDashboard ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setSellerDashboardData(res.result);

      return res;
   };
   //#endregion CRUD

   // useEffect(() => {
   //    // console.log("el useEffect de DashboardContext");
   //    // getDashboard();
   // });

   return (
      <DashboardContext.Provider
         value={{
            singularName,
            pluralName,
            dashboard,
            setDashboard,
            sellerDashboard,
            setSellerDashboard,
            sellerDashboardData,
            setSellerDashboardData,
            formTitle,
            setFormTitle,
            textBtnSubmit,
            setTextBtnSubmit,
            formData,
            setFormData,
            openDialog,
            setOpenDialog,
            formikRef,
            isEdit,
            setIsEdit,
            getSellerDashboard
         }}
      >
         {children}
      </DashboardContext.Provider>
   );
}
export const useDashboardContext = () => useContext(DashboardContext);
