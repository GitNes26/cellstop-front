import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios, Response } from "../utils/Api";
import Toast from "../utils/Toast";
import { useAuthContext } from "./AuthContext";
import { ROLE_ADMIN } from "./GlobalContext";
import to from "await-to-js";

const LoteContext = createContext();

export const formDataInitialState = {
   folio: "",
   active: ""
};
const prefixPath = "/lotes";

export default function LoteContextProvider({ children }) {
   const params = useParams();
   const singularName = "Lote", //Escribirlo siempre letra Capital
      pluralName = "Lotes"; //Escribirlo siempre letra Capital

   // const { counters, setCounters } = useGlobalContext();
   const { auth } = useAuthContext();

   const [lote, setLote] = useState(null);
   const [allLotes, setAllLotes] = useState([]);
   const [lotesSelect, setLotesSelect] = useState([]);
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSubmit] = useState("REGISTRAR");
   const [formData, setFormData] = useState(formDataInitialState);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);
   const [isEdit, setIsEdit] = useState(false);
   const [imgAvatar, setImgAvatar] = useState([]);
   const [imgFirm, setImgFirm] = useState([]);
   const [allLoteDetailsByLote, setAllLoteDetailsByLote] = useState([]);

   //#region CRUD
   const getAllLotes = async (data) => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = data ? await to(Axios.post(`${prefixPath}`, data)) : await to(Axios.get(`${prefixPath}`));
      // console.log("🚀 ~ getAllLotes ~ error:", error);
      // console.log("🚀 ~ getAllLotes ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllLotes ~ error:", error);
         const message = error.response.data.message || "getAllLotes ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllLotes(res.result);

      return res;
   };

   const getSelectIndexLotes = async () => {
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
      // console.log("🚀 ~ getSelectIndexLotes ~ error:", error);
      // console.log("🚀 ~ getSelectIndexLotes ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSelectIndexLotes ~ error:", error);
         const message = error.response.data.message || "getSelectIndexLotes ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setLotesSelect(res.result);

      return res;
   };

   const createOrUpdateLote = async (data) => {
      // console.log("🚀 ~ createOrUpdateLote ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const id = data.id > 0 ? `/${data.id}` : "";
      const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
      // console.log("🚀 ~ createOrUpdateLote ~ error:", error);
      // console.log("🚀 ~ createOrUpdateLote ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateLote ~ error:", error);
         const message = error.response.data.message || "createOrUpdateLote ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllLotes();

      return res;
   };

   const getLote = async (id) => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
      // console.log("🚀 ~ getLote ~ error:", error);
      // console.log("🚀 ~ getLote ~ response:", response);
      if (error) {
         console.log("🚀 ~ getLote ~ error:", error);
         const message = error.response.data.message || "getLote ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setLote(res.result);

      return res;
   };

   const deleteLote = async (id) => {
      // console.log("🚀 ~ deleteLote ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
      // console.log("🚀 ~ deleteLote ~ error:", error);
      // console.log("🚀 ~ deleteLote ~ response:", response);
      if (error) {
         console.log("🚀 ~ deleteLote ~ error:", error);
         const message = error.response.data.message || "deleteLote ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllLotes();

      return res;
   };

   const disEnableLote = async (id, active) => {
      // console.log("🚀 ~ disEnableLote ~ data:", data);
      // await checkLoggedIn();
      const strActive = active ? "reactivar" : "desactivar";
      const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
      // console.log("🚀 ~ disEnableLote ~ error:", error);
      // console.log("🚀 ~ disEnableLote ~ response:", response);
      if (error) {
         console.log("🚀 ~ disEnableLote ~ error:", error);
         const message = error.response.data.message || "disEnableLote ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllLotes();

      return res;
   };
   //#endregion CRUD

   const getLoteDetailsByLote = async (loteId) => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`loteDetails/showByLote/${loteId}`));
      // console.log("🚀 ~ getLoteDetailsByLote ~ error:", error);
      // console.log("🚀 ~ getLoteDetailsByLote ~ response:", response);
      if (error) {
         console.log("🚀 ~ getLoteDetailsByLote ~ error:", error);
         const message = error.response.data.message || "getLoteDetailsByLote ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllLoteDetailsByLote(res.result);

      return res;
   };

   // useEffect(() => {
   //    // console.log("el useEffect de LoteContext");
   //    // getLote();
   // });

   return (
      <LoteContext.Provider
         value={{
            singularName,
            pluralName,
            lote,
            setLote,
            allLotes,
            setAllLotes,
            lotesSelect,
            setLotesSelect,
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
            imgAvatar,
            setImgAvatar,
            imgFirm,
            setImgFirm,
            getAllLotes,
            getSelectIndexLotes,
            createOrUpdateLote,
            getLote,
            deleteLote,
            disEnableLote,
            getLoteDetailsByLote,
            allLoteDetailsByLote,
            setAllLoteDetailsByLote
         }}
      >
         {children}
      </LoteContext.Provider>
   );
}
export const useLoteContext = () => useContext(LoteContext);
