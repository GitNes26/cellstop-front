import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios, Response } from "../utils/Api";
import Toast from "../utils/Toast";
import { useAuthContext } from "./AuthContext";
import { ROLE_ADMIN } from "./GlobalContext";
import to from "await-to-js";

const UserContext = createContext();

export const formDataInitialState = {
   folio: "",
   active: ""
};
const prefixPath = "/users";

export default function UserContextProvider({ children }) {
   const params = useParams();
   const singularName = "Usuario", //Escribirlo siempre letra Capital
      pluralName = "Usuarios"; //Escribirlo siempre letra Capital

   // const { counters, setCounters } = useGlobalContext();
   const { auth } = useAuthContext();

   const [user, setUser] = useState(null);
   const [allUsers, setAllUsers] = useState([]);
   const [usersSelect, setUsersSelect] = useState([]);
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSubmit] = useState("REGISTRAR");
   const [formData, setFormData] = useState(formDataInitialState);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);
   const [isEdit, setIsEdit] = useState(false);
   const [changePassword, setChangePassword] = useState(false);

   //#region CRUD
   const getAllUsers = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}`));
      // console.log("🚀 ~ getAllUsers ~ error:", error);
      // console.log("🚀 ~ getAllUsers ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllUsers ~ error:", error);
         const message = error.response.data.message || "getAllUsers ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllUsers(res.result);

      return res;
   };

   const getSelectIndexUsersByRole = async (role_id) => {
      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndexByRole/${role_id}`));
      // console.log("🚀 ~ getSelectIndexUsers ~ error:", error);
      // console.log("🚀 ~ getSelectIndexUsers ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSelectIndexUsers ~ error:", error);
         const message = error.response.data.message || "getSelectIndexUsers ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setUsersSelect(res.result);

      return res;
   };

   const getSelectIndexUsers = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
      // console.log("🚀 ~ getSelectIndexUsers ~ error:", error);
      // console.log("🚀 ~ getSelectIndexUsers ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSelectIndexUsers ~ error:", error);
         const message = error.response.data.message || "getSelectIndexUsers ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setUsersSelect(res.result);

      return res;
   };

   const createOrUpdateUser = async (data) => {
      // console.log("🚀 ~ createOrUpdateUser ~ data:", data);

      const id = data.id > 0 ? `/${data.id}` : "";
      const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
      // console.log("🚀 ~ createOrUpdateUser ~ error:", error);
      // console.log("🚀 ~ createOrUpdateUser ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateUser ~ error:", error);
         const message = error.response.data.data.message || "createOrUpdateUser ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllUsers();

      return res;
   };

   const getUser = async (id) => {
      const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
      // console.log("🚀 ~ getUser ~ error:", error);
      // console.log("🚀 ~ getUser ~ response:", response);
      if (error) {
         console.log("🚀 ~ getUser ~ error:", error);
         const message = error.response.data.message || "getUser ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setUser(res.result);

      return res;
   };

   const deleteUser = async (id) => {
      // console.log("🚀 ~ deleteUser ~ data:", data);

      const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
      // console.log("🚀 ~ deleteUser ~ error:", error);
      // console.log("🚀 ~ deleteUser ~ response:", response);
      if (error) {
         console.log("🚀 ~ deleteUser ~ error:", error);
         const message = error.response.data.message || "deleteUser ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllUsers();

      return res;
   };

   const deleteMultipleUser = async (ids) => {
      // console.log("🚀 ~ deleteUser ~ data:", data);

      const [error, response] = await to(Axios.post(`${prefixPath}/destroyMultiple`, { ids }));
      // console.log("🚀 ~ deleteUser ~ error:", error);
      // console.log("🚀 ~ deleteUser ~ response:", response);
      if (error) {
         console.log("🚀 ~ deleteUser ~ error:", error);
         const message = error.response.data.message || "deleteUser ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllUsers();

      return res;
   };

   const disEnableUser = async (id, active) => {
      // console.log("🚀 ~ disEnableUser ~ data:", data);

      const strActive = active ? "reactivar" : "desactivar";
      const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
      // console.log("🚀 ~ disEnableUser ~ error:", error);
      // console.log("🚀 ~ disEnableUser ~ response:", response);
      if (error) {
         console.log("🚀 ~ disEnableUser ~ error:", error);
         const message = error.response.data.message || "disEnableUser ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllUsers();

      return res;
   };
   //#endregion CRUD

   // useEffect(() => {
   //    // console.log("el useEffect de UserContext");
   //    // getUser();
   // });

   return (
      <UserContext.Provider
         value={{
            singularName,
            pluralName,
            user,
            setUser,
            allUsers,
            setAllUsers,
            usersSelect,
            setUsersSelect,
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
            changePassword,
            setChangePassword,
            getAllUsers,
            getSelectIndexUsersByRole,
            getSelectIndexUsers,
            createOrUpdateUser,
            getUser,
            deleteUser,
            deleteMultipleUser,
            disEnableUser
         }}
      >
         {children}
      </UserContext.Provider>
   );
}
export const useUserContext = () => useContext(UserContext);
