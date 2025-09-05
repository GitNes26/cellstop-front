import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios, Response } from "../utils/Api";
import Toast from "../utils/Toast";
import { useAuthContext } from "./AuthContext";
import { ROLE_ADMIN } from "./GlobalContext";
import to from "await-to-js";

const RoleContext = createContext();

export const formDataInitialState = {
   folio: "",
   active: ""
};
const prefixPath = "/roles";

export default function RoleContextProvider({ children }) {
   const params = useParams();
   const singularName = "Rol", //Escribirlo siempre letra Capital
      pluralName = "Roles"; //Escribirlo siempre letra Capital

   // const { counters, setCounters } = useGlobalContext();
   const { auth } = useAuthContext();

   const [role, setRole] = useState(null);
   const [allRoles, setAllRoles] = useState([]);
   const [roleSelect, setRoleSelect] = useState([]);
   const [rolesSelect, setRolesSelect] = useState([]);
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSubmit] = useState("REGISTRAR");
   const [formData, setFormData] = useState(formDataInitialState);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);
   const [isEdit, setIsEdit] = useState(false);
   const [formikHeaderRef, setFormikHeaderRef] = useState(null);
   const [openDialogTable, setOpenDialogTable] = useState(false);
   const [checkMaster, setCheckMaster] = useState([]);
   const [checkMenus, setCheckMenus] = useState([]);
   const [menusItems, setMenusItems] = useState([]);

   const updatePermissions = async (data) => {
      // console.log("🚀 ~ updatePermissions ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.post(`${prefixPath}/updatePermissions`, data));
      // console.log("🚀 ~ updatePermissions ~ error:", error);
      // console.log("🚀 ~ updatePermissions ~ response:", response);
      if (error) {
         console.log("🚀 ~ updatePermissions ~ error:", error);
         const message = error.response.data.message || "updatePermissions ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllRoles();

      return res;
   };

   //#region CRUD
   const getAllRoles = async () => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}`));
      // console.log("🚀 ~ getAllRoles ~ error:", error);
      // console.log("🚀 ~ getAllRoles ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllRoles ~ error:", error);
         const message = error.response.data.message || "getAllRoles ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllRoles(res.result);

      return res;
   };

   const getSelectIndexRoles = async () => {
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
      // console.log("🚀 ~ getSelectIndexRoles ~ error:", error);
      // console.log("🚀 ~ getSelectIndexRoles ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSelectIndexRoles ~ error:", error);
         const message = error.response.data.message || "getSelectIndexRoles ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setRolesSelect(res.result);

      return res;
   };

   const createOrUpdateRole = async (data) => {
      // console.log("🚀 ~ createOrUpdateRole ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const id = data.id > 0 ? `/${data.id}` : "";
      const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
      // console.log("🚀 ~ createOrUpdateRole ~ error:", error);
      // console.log("🚀 ~ createOrUpdateRole ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateRole ~ error:", error);
         const message = error.response.data.message || "createOrUpdateRole ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllRoles();

      return res;
   };

   const getRole = async (id) => {
      // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
      // console.log("🚀 ~ getRole ~ error:", error);
      // console.log("🚀 ~ getRole ~ response:", response);
      if (error) {
         console.log("🚀 ~ getRole ~ error:", error);
         const message = error.response.data.message || "getRole ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setRole(res.result);
      setRoleSelect(res.result);

      return res;
   };

   const deleteRole = async (id) => {
      // console.log("🚀 ~ deleteRole ~ data:", data);
      // // if (!(await checkLoggedIn())) return;

      const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
      // console.log("🚀 ~ deleteRole ~ error:", error);
      // console.log("🚀 ~ deleteRole ~ response:", response);
      if (error) {
         console.log("🚀 ~ deleteRole ~ error:", error);
         const message = error.response.data.message || "deleteRole ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllRoles();

      return res;
   };

   const disEnableRole = async (id, active) => {
      // console.log("🚀 ~ disEnableRole ~ data:", data);
      // await checkLoggedIn();
      const strActive = active ? "reactivar" : "desactivar";
      const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
      // console.log("🚀 ~ disEnableRole ~ error:", error);
      // console.log("🚀 ~ disEnableRole ~ response:", response);
      if (error) {
         console.log("🚀 ~ disEnableRole ~ error:", error);
         const message = error.response.data.message || "disEnableRole ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllRoles();

      return res;
   };
   //#endregion CRUD

   // useEffect(() => {
   //    // console.log("el useEffect de RoleContext");
   //    // getRole();
   // });

   return (
      <RoleContext.Provider
         value={{
            singularName,
            pluralName,
            role,
            setRole,
            allRoles,
            setAllRoles,
            roleSelect,
            setRoleSelect,
            rolesSelect,
            setRolesSelect,
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
            formikHeaderRef,
            setFormikHeaderRef,
            openDialogTable,
            setOpenDialogTable,
            checkMaster,
            setCheckMaster,
            checkMenus,
            setCheckMenus,
            menusItems,
            setMenusItems,
            updatePermissions,
            getAllRoles,
            getSelectIndexRoles,
            createOrUpdateRole,
            getRole,
            deleteRole,
            disEnableRole
         }}
      >
         {children}
      </RoleContext.Provider>
   );
}
export const useRoleContext = () => useContext(RoleContext);
