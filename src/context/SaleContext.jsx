import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios, AxiosFiles, Response } from "../utils/Api";
import Toast from "../utils/Toast";
import { useAuthContext } from "./AuthContext";
import to from "await-to-js";

const SaleContext = createContext();

export const formDataInitialState = {
   chip_id: "",
   buyer_name: "",
   buyer_phone: "",
   ubication: "",
   evidence_photo: ""
};

const prefixPath = "/sales";

export default function SaleContextProvider({ children }) {
   const params = useParams();
   const singularName = "Venta",
      pluralName = "Ventas";

   const { auth } = useAuthContext();

   const [sale, setSale] = useState(null);
   const [allSales, setAllSales] = useState([]);
   const [salesSelect, setSalesSelect] = useState([]);
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSubmit] = useState("REGISTRAR");
   const [formData, setFormData] = useState(formDataInitialState);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);
   const [isEdit, setIsEdit] = useState(false);

   //#region CRUD
   const getAllSales = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}`));
      if (error) {
         console.log("🚀 ~ getAllSales ~ error:", error);
         const message = error.response?.data?.message || "Ocurrió un error, intenta de nuevo :c";
         Toast.Error(message);
         return;
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllSales(res.result);
      return res;
   };

   const getSelectIndexSales = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
      if (error) {
         console.log("🚀 ~ getSelectIndexSales ~ error:", error);
         const message = error.response?.data?.message || "Ocurrió un error, intenta de nuevo :c";
         Toast.Error(message);
         return;
      }

      Response.success = response.data.data;
      const res = Response.success;
      setSalesSelect(res.result);
      return res;
   };

   const createOrUpdateSale = async (data) => {
      const id = data.id > 0 ? `/${data.id}` : "";
      const [error, response] = await to(AxiosFiles.post(`${prefixPath}/createOrUpdate${id}`, data));
      if (error) {
         console.log("🚀 ~ createOrUpdateSale ~ error:", error);
         const message = error.response?.data?.message || "Ocurrió un error, intenta de nuevo :c";
         Toast.Error(message);
         return;
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllSales();
      return res;
   };

   const getSale = async (id) => {
      const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
      if (error) {
         console.log("🚀 ~ getSale ~ error:", error);
         const message = error.response?.data?.message || "Ocurrió un error, intenta de nuevo :c";
         Toast.Error(message);
         return;
      }

      Response.success = response.data.data;
      const res = Response.success;
      setSale(res.result);
      return res;
   };

   const deleteSale = async (id) => {
      const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
      if (error) {
         console.log("🚀 ~ deleteSale ~ error:", error);
         const message = error.response?.data?.message || "Ocurrió un error, intenta de nuevo :c";
         Toast.Error(message);
         return;
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllSales();
      return res;
   };

   const disEnableSale = async (id, active) => {
      const strActive = active ? "reactivar" : "desactivar";
      const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
      if (error) {
         console.log("🚀 ~ disEnableSale ~ error:", error);
         const message = error.response?.data?.message || "Ocurrió un error, intenta de nuevo :c";
         Toast.Error(message);
         return;
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllSales();
      return res;
   };
   //#endregion CRUD

   return (
      <SaleContext.Provider
         value={{
            singularName,
            pluralName,
            sale,
            setSale,
            allSales,
            setAllSales,
            salesSelect,
            setSalesSelect,
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
            getAllSales,
            getSelectIndexSales,
            createOrUpdateSale,
            getSale,
            deleteSale,
            disEnableSale
         }}
      >
         {children}
      </SaleContext.Provider>
   );
}

export const useSaleContext = () => useContext(SaleContext);
