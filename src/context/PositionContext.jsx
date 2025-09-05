import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios, Response } from "../utils/Api";
import Toast from "../utils/Toast";
import { useAuthContext } from "./AuthContext";
import { ROLE_ADMIN } from "./GlobalContext";
import to from "await-to-js";

const PositionContext = createContext();

export const formDataInitialState = {
   folio: "",
   active: ""
};
const prefixPath = "/positions";

export default function PositionContextProvider({ children }) {
   const params = useParams();
   const singularName = "Puesto", //Escribirlo siempre letra Capital
      pluralName = "Puestos"; //Escribirlo siempre letra Capital

   // const { counters, setCounters } = useGlobalContext();
   const { auth } = useAuthContext();

   const [position, setPosition] = useState(null);
   const [allPositions, setAllPositions] = useState([]);
   const [positionsSelect, setPositionsSelect] = useState([]);
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSubmit] = useState("REGISTRAR");
   const [formData, setFormData] = useState(formDataInitialState);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);
   const [isEdit, setIsEdit] = useState(false);

   //#region CRUD
   const getAllPositions = async () => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}`));
      // console.log("🚀 ~ getAllPositions ~ error:", error);
      // console.log("🚀 ~ getAllPositions ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllPositions ~ error:", error);
         const message = error.response.data.message || "getAllPositions ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllPositions(res.result);

      return res;
   };

   const getSelectIndexPositions = async () => {
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
      // console.log("🚀 ~ getSelectIndexPositions ~ error:", error);
      // console.log("🚀 ~ getSelectIndexPositions ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSelectIndexPositions ~ error:", error);
         const message = error.response.data.message || "getSelectIndexPositions ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setPositionsSelect(res.result);

      return res;
   };

   const createOrUpdatePosition = async (data) => {
      // console.log("🚀 ~ createOrUpdatePosition ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const id = data.id > 0 ? `/${data.id}` : "";
      const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
      // console.log("🚀 ~ createOrUpdatePosition ~ error:", error);
      // console.log("🚀 ~ createOrUpdatePosition ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdatePosition ~ error:", error);
         const message = error.response.data.message || "createOrUpdatePosition ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllPositions();

      return res;
   };

   const getPosition = async (id) => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
      // console.log("🚀 ~ getPosition ~ error:", error);
      // console.log("🚀 ~ getPosition ~ response:", response);
      if (error) {
         console.log("🚀 ~ getPosition ~ error:", error);
         const message = error.response.data.message || "getPosition ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setPosition(res.result);

      return res;
   };

   const deletePosition = async (id) => {
      // console.log("🚀 ~ deletePosition ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
      // console.log("🚀 ~ deletePosition ~ error:", error);
      // console.log("🚀 ~ deletePosition ~ response:", response);
      if (error) {
         console.log("🚀 ~ deletePosition ~ error:", error);
         const message = error.response.data.message || "deletePosition ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllPositions();

      return res;
   };

   const disEnablePosition = async (id, active) => {
      // console.log("🚀 ~ disEnablePosition ~ data:", data);
      // await checkLoggedIn();
      const strActive = active ? "reactivar" : "desactivar";
      const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
      // console.log("🚀 ~ disEnablePosition ~ error:", error);
      // console.log("🚀 ~ disEnablePosition ~ response:", response);
      if (error) {
         console.log("🚀 ~ disEnablePosition ~ error:", error);
         const message = error.response.data.message || "disEnablePosition ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllPositions();

      return res;
   };
   //#endregion CRUD

   // useEffect(() => {
   //    // console.log("el useEffect de PositionContext");
   //    // getPosition();
   // });

   return (
      <PositionContext.Provider
         value={{
            singularName,
            pluralName,
            position,
            setPosition,
            allPositions,
            setAllPositions,
            positionsSelect,
            setPositionsSelect,
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
            getAllPositions,
            getSelectIndexPositions,
            createOrUpdatePosition,
            getPosition,
            deletePosition,
            disEnablePosition
         }}
      >
         {children}
      </PositionContext.Provider>
   );
}
export const usePositionContext = () => useContext(PositionContext);
