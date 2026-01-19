import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios, Response } from "../utils/Api";
import Toast from "../utils/Toast";
import { useAuthContext } from "./AuthContext";
import { ROLE_ADMIN } from "./GlobalContext";
import to from "await-to-js";

const DepartmentContext = createContext();

// export const formDataInitialState = {
//    folio: "",
//    active: ""
// };
const prefixPath = "/departments";

export default function DepartmentContextProvider({ children }) {
   const params = useParams();
   const singularName = "Departamento", //Escribirlo siempre letra Capital
      pluralName = "Departamentos"; //Escribirlo siempre letra Capital

   // const { counters, setCounters } = useGlobalContext();
   const { auth } = useAuthContext();

   const [department, setDepartment] = useState(null);
   const [allDepartments, setAllDepartments] = useState([]);
   const [departmentsSelect, setDepartmentsSelect] = useState([]);
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSubmit] = useState("REGISTRAR");
   const [formData, setFormData] = useState(null);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);
   const [isEdit, setIsEdit] = useState(false);

   //#region CRUD
   const getAllDepartments = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}`));
      // console.log("🚀 ~ getAllDepartments ~ error:", error);
      // console.log("🚀 ~ getAllDepartments ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllDepartments ~ error:", error);
         const message = error.response.data.message || "getAllDepartments ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllDepartments(res.result);

      return res;
   };

   const getSelectIndexDepartments = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
      // console.log("🚀 ~ getSelectIndexDepartments ~ error:", error);
      // console.log("🚀 ~ getSelectIndexDepartments ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSelectIndexDepartments ~ error:", error);
         const message = error.response.data.message || "getSelectIndexDepartments ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setDepartmentsSelect(res.result);

      return res;
   };

   const createOrUpdateDepartment = async (data) => {
      // console.log("🚀 ~ createOrUpdateDepartment ~ data:", data);

      const id = data.id > 0 ? `/${data.id}` : "";
      const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
      // console.log("🚀 ~ createOrUpdateDepartment ~ error:", error);
      // console.log("🚀 ~ createOrUpdateDepartment ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateDepartment ~ error:", error);
         const message = error.response.data.message || "createOrUpdateDepartment ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllDepartments();

      return res;
   };

   const getDepartment = async (id) => {
      const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
      // console.log("🚀 ~ getDepartment ~ error:", error);
      // console.log("🚀 ~ getDepartment ~ response:", response);
      if (error) {
         console.log("🚀 ~ getDepartment ~ error:", error);
         const message = error.response.data.message || "getDepartment ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setDepartment(res.result);

      return res;
   };

   const deleteDepartment = async (id) => {
      // console.log("🚀 ~ deleteDepartment ~ data:", data);

      const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
      // console.log("🚀 ~ deleteDepartment ~ error:", error);
      // console.log("🚀 ~ deleteDepartment ~ response:", response);
      if (error) {
         console.log("🚀 ~ deleteDepartment ~ error:", error);
         const message = error.response.data.message || "deleteDepartment ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllDepartments();

      return res;
   };

   const disEnableDepartment = async (id, active) => {
      // console.log("🚀 ~ disEnableDepartment ~ data:", data);
      
      const strActive = active ? "reactivar" : "desactivar";
      const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
      // console.log("🚀 ~ disEnableDepartment ~ error:", error);
      // console.log("🚀 ~ disEnableDepartment ~ response:", response);
      if (error) {
         console.log("🚀 ~ disEnableDepartment ~ error:", error);
         const message = error.response.data.message || "disEnableDepartment ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllDepartments();

      return res;
   };
   //#endregion CRUD

   // useEffect(() => {
   //    // console.log("el useEffect de DepartmentContext");
   //    // getDepartment();
   // });

   return (
      <DepartmentContext.Provider
         value={{
            singularName,
            pluralName,
            department,
            setDepartment,
            allDepartments,
            setAllDepartments,
            departmentsSelect,
            setDepartmentsSelect,
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
            getAllDepartments,
            getSelectIndexDepartments,
            createOrUpdateDepartment,
            getDepartment,
            deleteDepartment,
            disEnableDepartment
         }}
      >
         {children}
      </DepartmentContext.Provider>
   );
}
export const useDepartmentContext = () => useContext(DepartmentContext);
