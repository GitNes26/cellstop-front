import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios, AxiosFiles, Response } from "../utils/Api";
import Toast from "../utils/Toast";
import { useAuthContext } from "./AuthContext";
import { ROLE_ADMIN } from "./GlobalContext";
import to from "await-to-js";

const ProductContext = createContext();

// export const formDataInitialState = {
//    folio: "",
//    active: ""
// };
const prefixPath = "/products";

export default function ProductContextProvider({ children }) {
   const params = useParams();
   const singularName = "Producto", //Escribirlo siempre letra Capital
      pluralName = "Productos"; //Escribirlo siempre letra Capital

   // const { counters, setCounters } = useGlobalContext();
   const { auth } = useAuthContext();

   const [product, setProduct] = useState(null);
   const [allProducts, setAllProducts] = useState([]);
   const [productsSelect, setProductsSelect] = useState([]);
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSubmit] = useState("REGISTRAR");
   const [formData, setFormData] = useState(null);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);
   const [isEdit, setIsEdit] = useState(false);

   //#region CRUD
   const getAllProducts = async () => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}`));
      // console.log("🚀 ~ getAllProducts ~ error:", error);
      // console.log("🚀 ~ getAllProducts ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllProducts ~ error:", error);
         const message = error.response.data.message || "getAllProducts ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllProducts(res.result);

      return res;
   };

   const getSelectIndexProducts = async () => {
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
      // console.log("🚀 ~ getSelectIndexProducts ~ error:", error);
      // console.log("🚀 ~ getSelectIndexProducts ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSelectIndexProducts ~ error:", error);
         const message = error.response.data.message || "getSelectIndexProducts ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setProductsSelect(res.result);

      return res;
   };

   const createOrUpdateProduct = async (data) => {
      // console.log("🚀 ~ createOrUpdateProduct ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const id = data.id > 0 ? `update/${data.id}` : "store";
      const [error, response] = await to(Axios.post(`${prefixPath}/${id}`, data));
      // console.log("🚀 ~ createOrUpdateProduct ~ error:", error);
      // console.log("🚀 ~ createOrUpdateProduct ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateProduct ~ error:", error);
         const message = error.response.data.message || "createOrUpdateProduct ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllProducts();

      return res;
   };

   const getProduct = async (id) => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
      // console.log("🚀 ~ getProduct ~ error:", error);
      // console.log("🚀 ~ getProduct ~ response:", response);
      if (error) {
         console.log("🚀 ~ getProduct ~ error:", error);
         const message = error.response.data.message || "getProduct ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setProduct(res.result);

      return res;
   };

   const deleteProduct = async (id) => {
      // console.log("🚀 ~ deleteProduct ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
      // console.log("🚀 ~ deleteProduct ~ error:", error);
      // console.log("🚀 ~ deleteProduct ~ response:", response);
      if (error) {
         console.log("🚀 ~ deleteProduct ~ error:", error);
         const message = error.response.data.message || "deleteProduct ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllProducts();

      return res;
   };

   const disEnableProduct = async (id, active) => {
      // console.log("🚀 ~ disEnableProduct ~ data:", data);
      // await checkLoggedIn();
      const strActive = active ? "reactivar" : "desactivar";
      const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
      // console.log("🚀 ~ disEnableProduct ~ error:", error);
      // console.log("🚀 ~ disEnableProduct ~ response:", response);
      if (error) {
         console.log("🚀 ~ disEnableProduct ~ error:", error);
         const message = error.response.data.message || "disEnableProduct ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllProducts();

      return res;
   };
   //#endregion CRUD

   const importProducts = async (data) => {
      // console.log("🚀 ~ createOrUpdateProduct ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      // const formData = new FormData();
      // formData.append("file", file);
      const [error, response] = await to(Axios.post(`${prefixPath}/import`, data));
      // const [error, response] = await to(AxiosFiles.post(`${prefixPath}/import`, formData, { headers: { "Content-Type": "multipart/form-data" } }));
      // console.log("🚀 ~ createOrUpdateProduct ~ error:", error);
      // console.log("🚀 ~ createOrUpdateProduct ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateProduct ~ error:", error);
         const message = error.response.data.message || "createOrUpdateProduct ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllProducts();

      return res;
   };

   const preActivationProducts = async (data) => {
      // console.log("🚀 ~ createOrUpdateProduct ~ data:", data);

      const [error, response] = await to(Axios.post(`${prefixPath}/preActivation`, data));
      // console.log("🚀 ~ createOrUpdateProduct ~ error:", error);
      // console.log("🚀 ~ createOrUpdateProduct ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateProduct ~ error:", error);
         const message = error.response.data.message || "createOrUpdateProduct ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllProducts();

      return res;
   };

   const updateLoteAssignment = async (data) => {
      // console.log("🚀 ~ createOrUpdateProduct ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.post(`loteDetails/updateLoteAssignment`, data));
      console.log("🚀 ~ createOrUpdateProduct ~ error:", error);
      console.log("🚀 ~ createOrUpdateProduct ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateProduct ~ error:", error);
         const message = error.response.data.message || "createOrUpdateProduct ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllProducts();

      return res;
   };

   // useEffect(() => {
   //    // console.log("el useEffect de ProductContext");
   //    // getProduct();
   // });

   return (
      <ProductContext.Provider
         value={{
            singularName,
            pluralName,
            product,
            setProduct,
            allProducts,
            setAllProducts,
            productsSelect,
            setProductsSelect,
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
            getAllProducts,
            getSelectIndexProducts,
            createOrUpdateProduct,
            getProduct,
            deleteProduct,
            disEnableProduct,
            importProducts,
            updateLoteAssignment,
            preActivationProducts
         }}
      >
         {children}
      </ProductContext.Provider>
   );
}
export const useProductContext = () => useContext(ProductContext);
