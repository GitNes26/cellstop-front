import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios, AxiosFiles, Response } from "../utils/Api";
import Toast from "../utils/Toast";
import { useAuthContext } from "./AuthContext";
import { ROLE_ADMIN } from "./GlobalContext";
import to from "await-to-js";

const PointOfSaleContext = createContext();

export const formDataInitialState = {
   folio: "",
   active: ""
};
const prefixPath = "/pointsOfSale";

export default function PointOfSaleContextProvider({ children }) {
   const params = useParams();
   const singularName = "Punto de Venta", //Escribirlo siempre letra Capital
      pluralName = "Puntos de Venta"; //Escribirlo siempre letra Capital

   // const { counters, setCounters } = useGlobalContext();
   const { auth } = useAuthContext();

   const [pointOfSale, setPointOfSale] = useState(null);
   const [allPointsOfSale, setAllPointsOfSale] = useState([]);
   const [pointsOfSaleSelect, setPointsOfSaleSelect] = useState([]);
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSubmit] = useState("REGISTRAR");
   const [formData, setFormData] = useState(formDataInitialState);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);
   const [imgImg, setImgImg] = useState([]);
   const [isEdit, setIsEdit] = useState(false);

   //#region CRUD
   const getAllPointsOfSale = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}`));
      // console.log("🚀 ~ getAllPointsOfSale ~ error:", error);
      // console.log("🚀 ~ getAllPointsOfSale ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllPointsOfSale ~ error:", error);
         const message = error.response.data.message || "getAllPointsOfSale ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllPointsOfSale(res.result);

      return res;
   };

   const getSelectIndexPointsOfSale = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
      // console.log("🚀 ~ getSelectIndexPointsOfSale ~ error:", error);
      // console.log("🚀 ~ getSelectIndexPointsOfSale ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSelectIndexPointsOfSale ~ error:", error);
         const message = error.response.data.message || "getSelectIndexPointsOfSale ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setPointsOfSaleSelect(res.result);

      return res;
   };

   const createOrUpdatePointOfSale = async (data) => {
      // console.log("🚀 ~ createOrUpdatePointOfSale ~ data:", data);

      const id = data.id > 0 ? `/${data.id}` : "";
      const [error, response] = await to(AxiosFiles.post(`${prefixPath}/createOrUpdate${id}`, data));
      // console.log("🚀 ~ createOrUpdatePointOfSale ~ error:", error);
      // console.log("🚀 ~ createOrUpdatePointOfSale ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdatePointOfSale ~ error:", error);
         const message = error.response.data.message || "createOrUpdatePointOfSale ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllPointsOfSale();

      return res;
   };

   const getPointOfSale = async (id) => {
      const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
      // console.log("🚀 ~ getPointOfSale ~ error:", error);
      // console.log("🚀 ~ getPointOfSale ~ response:", response);
      if (error) {
         console.log("🚀 ~ getPointOfSale ~ error:", error);
         const message = error.response.data.message || "getPointOfSale ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setPointOfSale(res.result);

      return res;
   };

   const deletePointOfSale = async (id) => {
      // console.log("🚀 ~ deletePointOfSale ~ data:", data);

      const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
      // console.log("🚀 ~ deletePointOfSale ~ error:", error);
      // console.log("🚀 ~ deletePointOfSale ~ response:", response);
      if (error) {
         console.log("🚀 ~ deletePointOfSale ~ error:", error);
         const message = error.response.data.message || "deletePointOfSale ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllPointsOfSale();

      return res;
   };

   const disEnablePointOfSale = async (id, active) => {
      // console.log("🚀 ~ disEnablePointOfSale ~ data:", data);

      const strActive = active ? "reactivar" : "desactivar";
      const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
      // console.log("🚀 ~ disEnablePointOfSale ~ error:", error);
      // console.log("🚀 ~ disEnablePointOfSale ~ response:", response);
      if (error) {
         console.log("🚀 ~ disEnablePointOfSale ~ error:", error);
         const message = error.response.data.message || "disEnablePointOfSale ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllPointsOfSale();

      return res;
   };
   //#endregion CRUD

   // useEffect(() => {
   //    // console.log("el useEffect de PointOfSaleContext");
   //    // getPointOfSale();
   // });

   return (
      <PointOfSaleContext.Provider
         value={{
            singularName,
            pluralName,
            pointOfSale,
            setPointOfSale,
            allPointsOfSale,
            setAllPointsOfSale,
            pointsOfSaleSelect,
            setPointsOfSaleSelect,
            formTitle,
            setFormTitle,
            textBtnSubmit,
            setTextBtnSubmit,
            formData,
            setFormData,
            openDialog,
            setOpenDialog,
            formikRef,
            imgImg,
            setImgImg,
            isEdit,
            setIsEdit,
            getAllPointsOfSale,
            getSelectIndexPointsOfSale,
            createOrUpdatePointOfSale,
            getPointOfSale,
            deletePointOfSale,
            disEnablePointOfSale
         }}
      >
         {children}
      </PointOfSaleContext.Provider>
   );
}
export const usePointOfSaleContext = () => useContext(PointOfSaleContext);
