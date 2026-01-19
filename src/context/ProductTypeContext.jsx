import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios, Response } from "../utils/Api";
import Toast from "../utils/Toast";
import { useAuthContext } from "./AuthContext";
import { ROLE_ADMIN } from "./GlobalContext";
import to from "await-to-js";

const ProductTypeContext = createContext();

export const formDataInitialState = {
   folio: "",
   active: ""
};
const prefixPath = "/productTypes";

export default function ProductTypeContextProvider({ children }) {
   const params = useParams();
   const singularName = "Tipos de Producto", //Escribirlo siempre letra Capital
      pluralName = "Tipos de Producto"; //Escribirlo siempre letra Capital

   // const { counters, setCounters } = useGlobalContext();
   const { auth } = useAuthContext();

   const [productType, setProductType] = useState(null);
   const [allProductTypes, setAllProductTypes] = useState([]);
   const [productTypesSelect, setProductTypesSelect] = useState([]);
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSubmit] = useState("REGISTRAR");
   const [formData, setFormData] = useState(formDataInitialState);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);
   const [isEdit, setIsEdit] = useState(false);

   //#region CRUD
   const getAllProductTypes = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}`));
      // console.log("🚀 ~ getAllProductTypes ~ error:", error);
      // console.log("🚀 ~ getAllProductTypes ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllProductTypes ~ error:", error);
         const message = error.response.data.message || "getAllProductTypes ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllProductTypes(res.result);

      return res;
   };

   const getSelectIndexProductTypes = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
      // console.log("🚀 ~ getSelectIndexProductTypes ~ error:", error);
      // console.log("🚀 ~ getSelectIndexProductTypes ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSelectIndexProductTypes ~ error:", error);
         const message = error.response.data.message || "getSelectIndexProductTypes ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setProductTypesSelect(res.result);

      return res;
   };

   const createOrUpdateProductType = async (data) => {
      // console.log("🚀 ~ createOrUpdateProductType ~ data:", data);

      const id = data.id > 0 ? `/${data.id}` : "";
      const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
      // console.log("🚀 ~ createOrUpdateProductType ~ error:", error);
      // console.log("🚀 ~ createOrUpdateProductType ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateProductType ~ error:", error);
         const message = error.response.data.message || "createOrUpdateProductType ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllProductTypes();

      return res;
   };

   const getProductType = async (id) => {
      const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
      // console.log("🚀 ~ getProductType ~ error:", error);
      // console.log("🚀 ~ getProductType ~ response:", response);
      if (error) {
         console.log("🚀 ~ getProductType ~ error:", error);
         const message = error.response.data.message || "getProductType ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setProductType(res.result);

      return res;
   };

   const deleteProductType = async (id) => {
      // console.log("🚀 ~ deleteProductType ~ data:", data);

      const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
      // console.log("🚀 ~ deleteProductType ~ error:", error);
      // console.log("🚀 ~ deleteProductType ~ response:", response);
      if (error) {
         console.log("🚀 ~ deleteProductType ~ error:", error);
         const message = error.response.data.message || "deleteProductType ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllProductTypes();

      return res;
   };

   const disEnableProductType = async (id, active) => {
      // console.log("🚀 ~ disEnableProductType ~ data:", data);

      const strActive = active ? "reactivar" : "desactivar";
      const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
      // console.log("🚀 ~ disEnableProductType ~ error:", error);
      // console.log("🚀 ~ disEnableProductType ~ response:", response);
      if (error) {
         console.log("🚀 ~ disEnableProductType ~ error:", error);
         const message = error.response.data.message || "disEnableProductType ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllProductTypes();

      return res;
   };
   //#endregion CRUD

   // useEffect(() => {
   //    // console.log("el useEffect de ProductTypeContext");
   //    // getProductType();
   // });

   return (
      <ProductTypeContext.Provider
         value={{
            singularName,
            pluralName,
            productType,
            setProductType,
            allProductTypes,
            setAllProductTypes,
            productTypesSelect,
            setProductTypesSelect,
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
            getAllProductTypes,
            getSelectIndexProductTypes,
            createOrUpdateProductType,
            getProductType,
            deleteProductType,
            disEnableProductType
         }}
      >
         {children}
      </ProductTypeContext.Provider>
   );
}
export const useProductTypeContext = () => useContext(ProductTypeContext);
