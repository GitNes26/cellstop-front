import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios, Response } from "../utils/Api";
import Toast from "../utils/Toast";
import { useAuthContext } from "./AuthContext";
import { ROLE_ADMIN } from "./GlobalContext";
import to from "await-to-js";

const SellerContext = createContext();

// export const formDataInitialState = {
//    folio: "",
//    active: ""
// };
const prefixPath = "/sellers";

export default function SellerContextProvider({ children }) {
   const params = useParams();
   const singularName = "Vendedor", //Escribirlo siempre letra Capital
      pluralName = "Vendedores"; //Escribirlo siempre letra Capital

   // const { counters, setCounters } = useGlobalContext();
   const { auth } = useAuthContext();

   const [seller, setSeller] = useState(null);
   const [allSellers, setAllSellers] = useState([]);
   const [sellersSelect, setSellersSelect] = useState([]);
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSubmit] = useState("REGISTRAR");
   const [formData, setFormData] = useState(null);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);
   const [isEdit, setIsEdit] = useState(false);

   //#region CRUD
   const getAllSellers = async () => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}`));
      // console.log("🚀 ~ getAllSellers ~ error:", error);
      // console.log("🚀 ~ getAllSellers ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllSellers ~ error:", error);
         const message = error.response.data.message || "getAllSellers ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllSellers(res.result);

      return res;
   };

   const getSelectIndexSellers = async () => {
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
      // console.log("🚀 ~ getSelectIndexSellers ~ error:", error);
      // console.log("🚀 ~ getSelectIndexSellers ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSelectIndexSellers ~ error:", error);
         const message = error.response.data.message || "getSelectIndexSellers ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setSellersSelect(res.result);

      return res;
   };

   const createOrUpdateSeller = async (data) => {
      // console.log("🚀 ~ createOrUpdateSeller ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const id = data.id > 0 ? `/${data.id}` : "";
      const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
      // console.log("🚀 ~ createOrUpdateSeller ~ error:", error);
      // console.log("🚀 ~ createOrUpdateSeller ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateSeller ~ error:", error);
         const message = error.response.data.message || "createOrUpdateSeller ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllSellers();

      return res;
   };

   const getSeller = async (id) => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
      // console.log("🚀 ~ getSeller ~ error:", error);
      // console.log("🚀 ~ getSeller ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSeller ~ error:", error);
         const message = error.response.data.message || "getSeller ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setSeller(res.result);

      return res;
   };

   const deleteSeller = async (id) => {
      // console.log("🚀 ~ deleteSeller ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
      // console.log("🚀 ~ deleteSeller ~ error:", error);
      // console.log("🚀 ~ deleteSeller ~ response:", response);
      if (error) {
         console.log("🚀 ~ deleteSeller ~ error:", error);
         const message = error.response.data.message || "deleteSeller ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllSellers();

      return res;
   };

   const disEnableSeller = async (id, active) => {
      // console.log("🚀 ~ disEnableSeller ~ data:", data);
      // await checkLoggedIn();
      const strActive = active ? "reactivar" : "desactivar";
      const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
      // console.log("🚀 ~ disEnableSeller ~ error:", error);
      // console.log("🚀 ~ disEnableSeller ~ response:", response);
      if (error) {
         console.log("🚀 ~ disEnableSeller ~ error:", error);
         const message = error.response.data.message || "disEnableSeller ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllSellers();

      return res;
   };
   //#endregion CRUD

   // useEffect(() => {
   //    // console.log("el useEffect de SellerContext");
   //    // getSeller();
   // });

   return (
      <SellerContext.Provider
         value={{
            singularName,
            pluralName,
            seller,
            setSeller,
            allSellers,
            setAllSellers,
            sellersSelect,
            setSellersSelect,
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
            getAllSellers,
            getSelectIndexSellers,
            createOrUpdateSeller,
            getSeller,
            deleteSeller,
            disEnableSeller
         }}
      >
         {children}
      </SellerContext.Provider>
   );
}
export const useSellerContext = () => useContext(SellerContext);
