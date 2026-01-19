import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuthContext } from "./AuthContext";
import Toast from "../utils/Toast";
// import * as tablerIcons from "@tabler/icons";
import { useGlobalContext } from "./GlobalContext";
import to from "await-to-js";
import { Axios } from "../utils/Api";

const MenuContext = createContext();

const formDataInitialState = {
   id: 0,
   menu: "",
   caption: "",
   type: "group",
   belongs_to: 0,
   url: "",
   icon: "",
   order: "",
   show_counter: false,
   counter_name: "",
   others_permissions: "",
   read_only: false,

   active: true
};
const prefixPath = "/menus";

export default function MenuContextProvider({ children }) {
   const singularName = "Menú", //Escribirlo siempre letra Capital
      pluralName = "Menús"; //Escribirlo siempre letra Capital

   const { counters, setCounters } = useGlobalContext();
   const { auth } = useAuthContext();

   const [menu, setMenu] = useState(null);
   const [allMenus, setAllMenus] = useState([]);
   const [menusSelect, setMenusSelect] = useState([]);
   const [formData, setFormData] = useState(formDataInitialState);
   const [menuItems, setMenuItems] = useState({ items: [] });
   const [headersMenus, setHeadersMenus] = useState([]);
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSubmit] = useState("AGREGAR");
   const [permissionsByMenu, setPermissionsByMenu] = useState([]);
   const [checkMaster, setCheckMaster] = useState(false);
   const [checkMenus, setCheckMenus] = useState([]);
   const [isItem, setIsItem] = useState(false);
   const formikRef = useRef();

   const getMenusByRole = async () => {
      // const auth = useAuthStore.getState().auth;
      // const { auth } = useAuthContext();

      // console.log("🚀 ~ getMenusByRole ~ Axios:", Axios);
      // console.log("el token: ", localStorage.getItem("token"));
      const pages_read = auth.read;
      const [error, response] = await to(Axios.get(`${prefixPath}/getMenusByRole/${pages_read}`));
      // console.log("🚀 ~ getMenusByRole ~ error:", error);
      // console.log("🚀 ~ getMenusByRole ~ response:", response);
      if (error) {
         console.log("🚀 ~ getMenusByRole ~ error:", error);
         const message = error.response.data.message || "getMenusByRole ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;

      return res;
   };

   const getHeadersMenusSelect = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}/getHeadersMenusSelect`));
      // console.log("🚀 ~ getHeadersMenusSelect ~ error:", error);
      // console.log("🚀 ~ getHeadersMenusSelect ~ response:", response);
      if (error) {
         console.log("🚀 ~ getHeadersMenusSelect ~ error:", error);
         const message = error.response.data.message || "getHeadersMenusSelect ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
      }

      Response.success = response.data.data;
      const res = Response.success;
      setHeadersMenus(res.result);

      return res;
   };

   const getSelectMenusToRoles = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndexToRoles`));
      // console.log("🚀 ~ getSelectMenusToRoles ~ error:", error);
      // console.log("🚀 ~ getSelectMenusToRoles ~ response:", response);
      if (error) {
         console.log("🚀 ~ getSelectMenusToRoles ~ error:", error);
         const message = error.response.data.message || "getSelectMenusToRoles ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
      }

      Response.success = response.data.data;
      const res = Response.success;
      setMenusSelect(res.result);

      return res;
   };

   //#region CRUD
   const getAllMenus = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}`));
      // console.log("🚀 ~ getAllMenus ~ error:", error);
      // console.log("🚀 ~ getAllMenus ~ response:", response);
      if (error) {
         console.log("🚀 ~ getAllMenus ~ error:", error);
         const message = error.response.data.message || "getAllMenus ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllMenus(res.result);

      return res;
   };

   const createOrUpdateMenu = async (data) => {
      // console.log("🚀 ~ createOrUpdateMenu ~ data:", data);

      const id = data.id > 0 ? `/${data.id}` : "";
      const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
      // console.log("🚀 ~ createOrUpdateMenu ~ error:", error);
      // console.log("🚀 ~ createOrUpdateMenu ~ response:", response);
      if (error) {
         console.log("🚀 ~ createOrUpdateMenu ~ error:", error);
         const message = error.response.data.message || "createOrUpdateMenu ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllMenus();

      return res;
   };

   const getMenu = async (id) => {
      const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
      // console.log("🚀 ~ getMenu ~ error:", error);
      // console.log("🚀 ~ getMenu ~ response:", response);
      if (error) {
         console.log("🚀 ~ getMenu ~ error:", error);
         const message = error.response.data.message || "getMenu ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      setMenu(res.result);

      return res;
   };

   const disEnableMenu = async (id, active) => {
      // console.log("🚀 ~ disEnableMenu ~ data:", data);

      const strActive = active ? "reactivar" : "desactivar";
      const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
      // console.log("🚀 ~ disEnableMenu ~ error:", error);
      // console.log("🚀 ~ disEnableMenu ~ response:", response);
      if (error) {
         console.log("🚀 ~ disEnableMenu ~ error:", error);
         const message = error.response.data.message || "disEnableMenu ~ Ocurrio algun error, intenta de nuevo :c";
         Toast.Error(message);
         return;
         // throw new Error("que sale aqui?");
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllMenus();

      return res;
   };
   //#endregion CRUD

   // useEffect(() => {
   //    console.log("el useEffect de MenuContext");
   //    getMenus();
   // });

   return (
      <MenuContext.Provider
         value={{
            singularName,
            pluralName,
            menu,
            setMenu,
            allMenus,
            setAllMenus,
            menusSelect,
            setMenusSelect,
            formData,
            setFormData,
            menuItems,
            setMenuItems,
            headersMenus,
            setHeadersMenus,
            formTitle,
            setFormTitle,
            textBtnSubmit,
            setTextBtnSubmit,
            permissionsByMenu,
            setPermissionsByMenu,
            checkMaster,
            setCheckMaster,
            checkMenus,
            setCheckMenus,
            isItem,
            formikRef,
            setIsItem,
            getMenusByRole,
            getHeadersMenusSelect,
            getSelectMenusToRoles,
            getAllMenus,
            createOrUpdateMenu,
            getMenu,
            disEnableMenu
         }}
      >
         {children}
      </MenuContext.Provider>
   );
}
export const useMenuContext = () => useContext(MenuContext);
