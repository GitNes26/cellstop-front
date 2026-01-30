import { createContext, useContext, useEffect, useRef, useState } from "react";
import { data, useParams } from "react-router-dom";
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
const prefixPathDetail = "/productDetails";
const prefixPathPortabilities = "/portabilities";

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
   const [foliosSelect, setFoliosSelect] = useState([]);

   const [allProductDetails, setAllProductDetails] = useState([]);
   const [productDetailsByProduct, setProductDetailsByProduct] = useState([]);
   const [allPortabilities, setAllPortabilities] = useState([]);
   const [portabilitiesByProduct, setPortabilitiesByProduct] = useState([]);

   function getFiltersByStatus(statusParam) {
      switch (statusParam) {
         case "en-stock":
            return { destination: "Stock" };
         case "asignados":
            return { destination: "Asignado" };
         case "distribuidos":
            return { destination: "Distribuido" };
         case "activados":
            return { destination: "Activado" };
         case "portados":
            return { destination: "Portado" };
         default:
            return null;
         // case "en-stock":
         //    return { location_status: "Stock", activation_status: "Pre-activado" };
         // case "asignados":
         //    return { location_status: "Asignado" };
         // case "distribuidos":
         //    return { location_status: "Distribuido" };
         // case "activados":
         //    return { activation_status: "Activado" };
         // case "portados":
         //    return { activation_status: "Portado" };
         // default:
      }
   }

   //#region CRUD
   const getAllProductsPagination = async (filters, page = 1, pageSize = 100) => {
      // console.log("🚀 ~ getAllProductsPagination ~ status:", params.status);
      let data = getFiltersByStatus(params.status);
      if (!data) data = {}; // inicializar si viene null

      const paginationParams = new URLSearchParams({
         page: page.toString(),
         per_page: pageSize.toString(),
         ...filters
      });
      // console.log("🚀 ~ getAllProductsPagination ~ data:", data);
      // "http://127.0.0.1:8000/api/products?page=2"
      const [error, response] = data
         ? await to(Axios.post(`${prefixPath}?${paginationParams.toString()}`, data))
         : await to(Axios.get(`${prefixPath}?${paginationParams.toString()}`));
      // console.log("🚀 ~ getAllProductsPagination ~ error:", error);
      console.log("🚀 ~ getAllProductsPagination ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllProductsPagination ~ error:", error);
         const message = error.response.data.message || "getAllProductsPagination ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllProducts(res.result);

      return res;
   };
   const getAllProducts = async (filters) => {
      // console.log("🚀 ~ getAllProducts ~ status:", params.status);
      let data = getFiltersByStatus(params.status);
      if (!data) data = {}; // inicializar si viene null

      if (filters) {
         data = {
            ...data,
            ...filters
         };
      }
      // console.log("🚀 ~ getAllProducts ~ data:", data);

      const [error, response] = data ? await to(Axios.post(`${prefixPath}`, data)) : await to(Axios.get(`${prefixPath}`));
      // console.log("🚀 ~ getAllProducts ~ error:", error);
      console.log("🚀 ~ getAllProducts ~ response:", response);
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

   const getSelectIndexProducts = async (data) => {
      const [error, response] = data ? await to(Axios.post(`${prefixPath}/selectIndex`, data)) : await to(Axios.get(`${prefixPath}/selectIndex`));
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
   const getSelectIndexProductsPagination = async (data, page = 1, pageSize = 10) => {
      const paginationParams = new URLSearchParams({
         page: page.toString(),
         per_page: pageSize.toString(),
         ...data
      });

      const [error, response] = data
         ? await to(Axios.post(`${prefixPath}/selectIndex?${paginationParams.toString()}`, data))
         : await to(Axios.get(`${prefixPath}/selectIndex?${paginationParams.toString()}`));
      // console.log("🚀 ~ getSelectIndexProductsPagination ~ error:", error);
      // console.log("🚀 ~ getSelectIndexProductsPagination ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSelectIndexProductsPagination ~ error:", error);
         const message = error.response.data.message || "getSelectIndexProductsPagination ~ Ocurrio algun error, intenta de nuevo :c";
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
      await getAllProductsPagination(); //getAllProducts();

      return res;
   };

   const getProduct = async (id) => {
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
      await getAllProductsPagination(); //getAllProducts();

      return res;
   };

   const disEnableProduct = async (id, active) => {
      // console.log("🚀 ~ disEnableProduct ~ data:", data);

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
      await getAllProductsPagination(); //getAllProducts();

      return res;
   };
   //#endregion CRUD

   const importProducts = async (data) => {
      // console.log("🚀 ~ createOrUpdateProduct ~ data:", data);

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
      await getAllProductsPagination(); //getAllProducts();

      return res;
   };

   const getSelectIndexFolios = async () => {
      const [error, response] = await to(Axios.post(`${prefixPath}/getFolios`));
      // console.log("🚀 ~ getSelectIndexFolios ~ error:", error);
      // console.log("🚀 ~ getSelectIndexFolios ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSelectIndexFolios ~ error:", error);
         const message = error.response.data.message || "getSelectIndexFolios ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setFoliosSelect(res.result);

      return res;
   };

   const getAvailableFoliosForLote = async () => {
      const [error, response] = await to(Axios.post(`${prefixPath}/getAvailableFoliosForLote`));
      // console.log("🚀 ~ getAvailableFoliosForLote ~ error:", error);
      // console.log("🚀 ~ getAvailableFoliosForLote ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAvailableFoliosForLote ~ error:", error);
         const message = error.response.data.message || "getAvailableFoliosForLote ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setFoliosSelect(res.result);

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
      await getAllProductsPagination(); //getAllProducts();

      return res;
   };

   const updateLoteAssignment = async (data) => {
      // console.log("🚀 ~ createOrUpdateProduct ~ data:", data);

      const [error, response] = await to(Axios.post(`loteDetails/updateLoteAssignment`, data));
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
      await getAllProductsPagination(); //getAllProducts();

      return res;
   };

   const getMovementsByProduct = async (id) => {
      const [error, response] = await to(Axios.get(`${prefixPath}/${id}/movements`));
      // console.log("🚀 ~ getMovementsByProduct ~ error:", error);
      // console.log("🚀 ~ getMovementsByProduct ~ response:", response);
      if (error) {
         console.log("🚀 ~ getMovementsByProduct ~ error:", error);
         const message = error.response.data.message || "getMovementsByProduct ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllProductDetails(res.result);

      return res;
   };

   const selectIndexProductForVisit = async (data = {}) => {
      const [error, response] = await to(Axios.post(`${prefixPath}/selectIndexProductForVisit`, data));
      // console.log("🚀 ~ selectIndexProductForVisit ~ error:", error);
      // console.log("🚀 ~ selectIndexProductForVisit ~ response:", response);
      if (error) {
         console.log("🚀 ~ selectIndexProductForVisit ~ error:", error);
         const message = error.response.data.message || "selectIndexProductForVisit ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setProductsSelect(res.result);

      return res;
   };

   //#region ProductDetails
   const importProductDetails = async (data) => {
      // console.log("🚀 ~ createOrUpdateProduct ~ data:", data);

      // const formData = new FormData();
      // formData.append("file", file);
      const [error, response] = await to(Axios.post(`${prefixPathDetail}/import`, data));
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
      getAllProductsPagination(); //getAllProducts();

      return res;
   };

   const getAllProductDetails = async () => {
      const [error, response] = await to(Axios.get(`${prefixPathDetail}`));
      // console.log("🚀 ~ getAllProductDetails ~ error:", error);
      // console.log("🚀 ~ getAllProductDetails ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllProductDetails ~ error:", error);
         const message = error.response.data.message || "getAllProductDetails ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllProductDetails(res.result);

      return res;
   };

   const getProductDetailsByProduct = async (productId) => {
      const [error, response] = await to(Axios.get(`${prefixPathDetail}/product/${productId}`));
      // console.log("🚀 ~ getProductDetailsByProduct ~ error:", error);
      // console.log("🚀 ~ getProductDetailsByProduct ~ response:", response);
      if (error) {
         console.log("🚀 ~ getProductDetailsByProduct ~ error:", error);
         const message = error.response.data.message || "getProductDetailsByProduct ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setProductDetailsByProduct(res.result);

      return res;
   };
   //#endregion ProductDetails

   //#region Portabilities
   const importPortabilities = async (data) => {
      // console.log("🚀 ~ importPortabilities ~ data:", data);

      // const formData = new FormData();
      // formData.append("file", file);
      const [error, response] = await to(Axios.post(`${prefixPathPortabilities}/import`, data));
      // const [error, response] = await to(AxiosFiles.post(`${prefixPath}/import`, formData, { headers: { "Content-Type": "multipart/form-data" } }));
      // console.log("🚀 ~ importPortabilities ~ error:", error);
      // console.log("🚀 ~ importPortabilities ~ response:", response);
      if (error) {
         console.log("🚀 ~ importPortabilities ~ error:", error);
         const message = error.response.data.message || "importPortabilities ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      getAllProductsPagination(); //getAllProducts();

      return res;
   };

   const getAllPortabilities = async () => {
      const [error, response] = await to(Axios.get(`${prefixPathPortabilities}`));
      // console.log("🚀 ~ getAllPortabilities ~ error:", error);
      // console.log("🚀 ~ getAllPortabilities ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllPortabilities ~ error:", error);
         const message = error.response.data.message || "getAllPortabilities ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllPortabilities(res.result);

      return res;
   };

   const getPortabilitiesByProduct = async (productId) => {
      const [error, response] = await to(Axios.get(`${prefixPathPortabilities}/product/${productId}`));
      // console.log("🚀 ~ getPortabilitiesByProduct ~ error:", error);
      // console.log("🚀 ~ getPortabilitiesByProduct ~ response:", response);
      if (error) {
         console.log("🚀 ~ getPortabilitiesByProduct ~ error:", error);
         const message = error.response.data.message || "getPortabilitiesByProduct ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      // setPortabilitiesByProduct(res.result);

      return res;
   };

   const createMultipleManuallyPortabilities = async (ids, executed_at) => {
      // console.log("🚀 ~ createMultipleManuallyPortabilities ~ data:", data);

      const data = {
         ids,
         executed_at
      };

      const [error, response] = await to(Axios.post(`${prefixPathPortabilities}/createMultipleManually`, data));
      // console.log("🚀 ~ createMultipleManuallyPortabilities ~ error:", error);
      // console.log("🚀 ~ createMultipleManuallyPortabilities ~ response:", response);
      if (error) {
         console.log("🚀 ~ createMultipleManuallyPortabilities ~ error:", error);
         const message = error.response.data.message || "createMultipleManuallyPortabilities ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      getAllProductsPagination(); //getAllProducts();

      return res;
   };
   //#endregion Portabilities

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
            getAllProductsPagination,
            getSelectIndexProducts,
            getSelectIndexProductsPagination,
            createOrUpdateProduct,
            getProduct,
            deleteProduct,
            disEnableProduct,
            importProducts,
            updateLoteAssignment,
            preActivationProducts,

            getMovementsByProduct,
            selectIndexProductForVisit,

            foliosSelect,
            setFoliosSelect,
            getSelectIndexFolios,
            getAvailableFoliosForLote,

            allProductDetails,
            setAllProductDetails,
            importProductDetails,
            getAllProductDetails,
            productDetailsByProduct,
            setProductDetailsByProduct,
            getProductDetailsByProduct,

            allPortabilities,
            setAllPortabilities,
            portabilitiesByProduct,
            setPortabilitiesByProduct,
            importPortabilities,
            getAllPortabilities,
            getPortabilitiesByProduct,
            createMultipleManuallyPortabilities
         }}
      >
         {children}
      </ProductContext.Provider>
   );
}
export const useProductContext = () => useContext(ProductContext);
