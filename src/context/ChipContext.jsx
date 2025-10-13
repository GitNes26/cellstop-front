import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios, AxiosFiles, Response } from "../utils/Api";
import Toast from "../utils/Toast";
import { useAuthContext } from "./AuthContext";
import { ROLE_ADMIN } from "./GlobalContext";
import to from "await-to-js";

const ChipContext = createContext();

// export const formDataInitialState = {
//    folio: "",
//    active: ""
// };
const prefixPath = "/chips";

export default function ChipContextProvider({ children }) {
   const params = useParams();
   const singularName = "Chip", //Escribirlo siempre letra Capital
      pluralName = "Chips"; //Escribirlo siempre letra Capital

   // const { counters, setCounters } = useGlobalContext();
   const { auth } = useAuthContext();

   const [chip, setChip] = useState(null);
   const [allChips, setAllChips] = useState([]);
   const [chipsSelect, setChipsSelect] = useState([]);
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSubmit] = useState("REGISTRAR");
   const [formData, setFormData] = useState(null);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);
   const [isEdit, setIsEdit] = useState(false);

   //#region CRUD
   const getAllChips = async () => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}`));
      // console.log("🚀 ~ getAllChips ~ error:", error);
      // console.log("🚀 ~ getAllChips ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllChips ~ error:", error);
         const message = error.response.data.message || "getAllChips ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllChips(res.result);

      return res;
   };

   const getSelectIndexChips = async () => {
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
      // console.log("🚀 ~ getSelectIndexChips ~ error:", error);
      // console.log("🚀 ~ getSelectIndexChips ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSelectIndexChips ~ error:", error);
         const message = error.response.data.message || "getSelectIndexChips ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setChipsSelect(res.result);

      return res;
   };

   const createOrUpdateChip = async (data) => {
      // console.log("🚀 ~ createOrUpdateChip ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const id = data.id > 0 ? `update/${data.id}` : "store";
      const [error, response] = await to(Axios.post(`${prefixPath}/${id}`, data));
      // console.log("🚀 ~ createOrUpdateChip ~ error:", error);
      // console.log("🚀 ~ createOrUpdateChip ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateChip ~ error:", error);
         const message = error.response.data.message || "createOrUpdateChip ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllChips();

      return res;
   };

   const getChip = async (id) => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
      // console.log("🚀 ~ getChip ~ error:", error);
      // console.log("🚀 ~ getChip ~ response:", response);
      if (error) {
         console.log("🚀 ~ getChip ~ error:", error);
         const message = error.response.data.message || "getChip ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setChip(res.result);

      return res;
   };

   const deleteChip = async (id) => {
      // console.log("🚀 ~ deleteChip ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
      // console.log("🚀 ~ deleteChip ~ error:", error);
      // console.log("🚀 ~ deleteChip ~ response:", response);
      if (error) {
         console.log("🚀 ~ deleteChip ~ error:", error);
         const message = error.response.data.message || "deleteChip ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllChips();

      return res;
   };

   const disEnableChip = async (id, active) => {
      // console.log("🚀 ~ disEnableChip ~ data:", data);
      // await checkLoggedIn();
      const strActive = active ? "reactivar" : "desactivar";
      const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
      // console.log("🚀 ~ disEnableChip ~ error:", error);
      // console.log("🚀 ~ disEnableChip ~ response:", response);
      if (error) {
         console.log("🚀 ~ disEnableChip ~ error:", error);
         const message = error.response.data.message || "disEnableChip ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllChips();

      return res;
   };
   //#endregion CRUD

   const importChips = async (file) => {
      // console.log("🚀 ~ createOrUpdateChip ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const formData = new FormData();
      formData.append("file", file);
      const [error, response] = await to(AxiosFiles.post(`${prefixPath}/import`, formData, { headers: { "Content-Type": "multipart/form-data" } }));
      // console.log("🚀 ~ createOrUpdateChip ~ error:", error);
      // console.log("🚀 ~ createOrUpdateChip ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateChip ~ error:", error);
         const message = error.response.data.message || "createOrUpdateChip ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllChips();

      return res;
   };

   const updateLoteAssignment = async (data) => {
      // console.log("🚀 ~ createOrUpdateChip ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.post(`loteDetails/updateLoteAssignment`, data));
      console.log("🚀 ~ createOrUpdateChip ~ error:", error);
      console.log("🚀 ~ createOrUpdateChip ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateChip ~ error:", error);
         const message = error.response.data.message || "createOrUpdateChip ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllChips();

      return res;
   };

   // useEffect(() => {
   //    // console.log("el useEffect de ChipContext");
   //    // getChip();
   // });

   return (
      <ChipContext.Provider
         value={{
            singularName,
            pluralName,
            chip,
            setChip,
            allChips,
            setAllChips,
            chipsSelect,
            setChipsSelect,
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
            getAllChips,
            getSelectIndexChips,
            createOrUpdateChip,
            getChip,
            deleteChip,
            disEnableChip,
            importChips,
            updateLoteAssignment
         }}
      >
         {children}
      </ChipContext.Provider>
   );
}
export const useChipContext = () => useContext(ChipContext);
