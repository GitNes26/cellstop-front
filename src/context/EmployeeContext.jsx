import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios, Response } from "../utils/Api";
import Toast from "../utils/Toast";
import { useAuthContext } from "./AuthContext";
import { ROLE_ADMIN } from "./GlobalContext";
import to from "await-to-js";

const EmployeeContext = createContext();

export const formDataInitialState = {
   folio: "",
   active: ""
};
const prefixPath = "/employees";

export default function EmployeeContextProvider({ children }) {
   const params = useParams();
   const singularName = "Empleado", //Escribirlo siempre letra Capital
      pluralName = "Empleados"; //Escribirlo siempre letra Capital

   // const { counters, setCounters } = useGlobalContext();
   const { auth } = useAuthContext();

   const [employee, setEmployee] = useState(null);
   const [allEmployees, setAllEmployees] = useState([]);
   const [employeesSelect, setEmployeesSelect] = useState([]);
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSubmit] = useState("REGISTRAR");
   const [formData, setFormData] = useState(formDataInitialState);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);
   const [isEdit, setIsEdit] = useState(false);
   const [imgAvatar, setImgAvatar] = useState([]);
   const [imgFirm, setImgFirm] = useState([]);

   //#region CRUD
   const getAllEmployees = async () => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}`));
      // console.log("🚀 ~ getAllEmployees ~ error:", error);
      // console.log("🚀 ~ getAllEmployees ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllEmployees ~ error:", error);
         const message = error.response.data.message || "getAllEmployees ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllEmployees(res.result);

      return res;
   };

   const getSelectIndexEmployees = async () => {
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
      // console.log("🚀 ~ getSelectIndexEmployees ~ error:", error);
      // console.log("🚀 ~ getSelectIndexEmployees ~ response:", response);
      
      if (error) {
         console.log("🚀 ~ getSelectIndexEmployees ~ error:", error);
         const message = error.response.data.message || "getSelectIndexEmployees ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setEmployeesSelect(res.result);

      return res;
   };

   const createOrUpdateEmployee = async (data) => {
      // console.log("🚀 ~ createOrUpdateEmployee ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const id = data.id > 0 ? `/${data.id}` : "";
      const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
      // console.log("🚀 ~ createOrUpdateEmployee ~ error:", error);
      // console.log("🚀 ~ createOrUpdateEmployee ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateEmployee ~ error:", error);
         const message = error.response.data.message || "createOrUpdateEmployee ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllEmployees();

      return res;
   };

   const getEmployee = async (id) => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
      // console.log("🚀 ~ getEmployee ~ error:", error);
      // console.log("🚀 ~ getEmployee ~ response:", response);
      if (error) {
         console.log("🚀 ~ getEmployee ~ error:", error);
         const message = error.response.data.message || "getEmployee ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setEmployee(res.result);

      return res;
   };

   const deleteEmployee = async (id) => {
      // console.log("🚀 ~ deleteEmployee ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
      // console.log("🚀 ~ deleteEmployee ~ error:", error);
      // console.log("🚀 ~ deleteEmployee ~ response:", response);
      if (error) {
         console.log("🚀 ~ deleteEmployee ~ error:", error);
         const message = error.response.data.message || "deleteEmployee ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllEmployees();

      return res;
   };

   const disEnableEmployee = async (id, active) => {
      // console.log("🚀 ~ disEnableEmployee ~ data:", data);
      // await checkLoggedIn();
      const strActive = active ? "reactivar" : "desactivar";
      const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
      // console.log("🚀 ~ disEnableEmployee ~ error:", error);
      // console.log("🚀 ~ disEnableEmployee ~ response:", response);
      if (error) {
         console.log("🚀 ~ disEnableEmployee ~ error:", error);
         const message = error.response.data.message || "disEnableEmployee ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllEmployees();

      return res;
   };
   //#endregion CRUD

   // useEffect(() => {
   //    // console.log("el useEffect de EmployeeContext");
   //    // getEmployee();
   // });

   return (
      <EmployeeContext.Provider
         value={{
            singularName,
            pluralName,
            employee,
            setEmployee,
            allEmployees,
            setAllEmployees,
            employeesSelect,
            setEmployeesSelect,
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
            getAllEmployees,
            getSelectIndexEmployees,
            createOrUpdateEmployee,
            getEmployee,
            deleteEmployee,
            disEnableEmployee
         }}
      >
         {children}
      </EmployeeContext.Provider>
   );
}
export const useEmployeeContext = () => useContext(EmployeeContext);
