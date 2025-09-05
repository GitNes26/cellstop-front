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
      // if (!(await checkLoggedIn())) return;

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
      // // if (!(await checkLoggedIn())) return;

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
      // // if (!(await checkLoggedIn())) return;

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
      // if (!(await checkLoggedIn())) return;

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
      // // if (!(await checkLoggedIn())) return;

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
      // if (!(await checkLoggedIn())) return;

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
      // // if (!(await checkLoggedIn())) return;

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

   //#region VERSION 1
   // const resetFormData = () => {
   //    try {
   //       setFormData(formDataInitialState);
   //    } catch (error) {
   //       console.log("Error en resetFormData:", error);
   //       Toast.Error(error);
   //    }
   // };

   // const resetMenu = () => {
   //    try {
   //       setMenu(formDataInitialState);
   //    } catch (error) {
   //       console.log("Error en resetMenu:", error);
   //       Toast.Error(error);
   //    }
   // };

   // const getIdByUrl = async (dataPost) => {
   //    try {
   //       // setMenu([]);
   //       let res = CorrectRes;
   //       const axiosData = await Axios.post(`/menus/getIdByUrl`, dataPost);
   //       // console.log("axiosData", axiosData);

   //       res = axiosData.data.data;
   //       // console.log(res);
   //       return res;
   //    } catch (error) {
   //       console.log(error);
   //       res.message = error;
   //       res.alert_text = error;
   //       Toast.Error(error);
   //    }
   // };

   // const MenusByRole = async (role_id) => {
   //    try {
   //       let res = CorrectRes;
   //       const axiosData = await Axios.get(`/menus/MenusByRole/${role_id}`);
   //       // console.log("axiosData", axiosData.status);

   //       res = axiosData.data.data;
   //       // await setMenu(res.result);
   //       setMenu(res.result);
   //       console.log(res.result);

   //       return res;
   //    } catch (error) {
   //       console.log(error);
   //       res.message = error;
   //       res.alert_text = error;
   //       Toast.Error(error);
   //    }
   // };

   // const showMyMenus = async () => {
   //    // console.log("cargando mis menussss");
   //    let res = CorrectRes;
   //    try {
   //       if (auth !== null) {
   //          const pages_read = auth.read;
   //          const axiosResponse = await Axios.get(`/menus/MenusByRole/${pages_read}`);
   //          const axiosCurrentSettings = await Axios.get(`/settings/current`);
   //          const resCurrentSettings = axiosCurrentSettings.data.data.result;
   //          const total_payments = resCurrentSettings?.total_payments ?? 0;
   //          // console.log("axiosResponse", axiosResponse);
   //          let menus = axiosResponse.data.data.result;
   //          if (total_payments > 0 && total_payments < 3) menus = await removePagePayments(menus, total_payments);
   //          const HeaderMenus = menus.filter((menu) => menu.belongs_to == 0);
   //          // console.log("HeaderMenus", HeaderMenus);
   //          const items = [];
   //          HeaderMenus.map((hm) => {
   //             const item = {
   //                id: hm.id,
   //                title: hm.menu,
   //                caption: hm.caption,
   //                type: hm.type,
   //                children: []
   //             };

   //             const childrenMenus = menus.filter((chm) => chm.belongs_to == hm.id);
   //             // console.log("childrenMenus", childrenMenus);
   //             childrenMenus.map((iCh) => {
   //                const child = {
   //                   id: iCh.id,
   //                   title: iCh.menu,
   //                   type: iCh.type,
   //                   url: iCh.url,
   //                   show_counter: iCh.show_counter,
   //                   counter_name: iCh.counter_name,
   // //                   icon: tablerIcons[`${iCh.icon}`]
   //                };
   //                item.children.push(child);
   //             });

   //             items.push(item);
   //          });
   //          // console.log("items", items);
   //          setMenuItems({ items: items });
   //          // setAuth({ ...auth, menus: "cambiados" });
   //       }

   //       async function removePagePayments(values, total_payments) {
   //          const cleanedObj = values.filter((item) => (total_payments == 1 ? !["Pago 1", "Pago 2"].includes(item.menu) : item.menu != "Pago 2"));
   //          return cleanedObj;
   //       }
   //    } catch (error) {
   //       console.log("🚀 ~ showMyMenus ~ error:", error);
   //       if (error.response.status === 401) {
   //          // console.log("no AUUUUTH!");
   //          localStorage.removeItem("token");
   //          localStorage.removeItem("auth");
   //          const token = localStorage.getItem("token") || null;
   //          Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
   //          setAuth(false);
   //          location.hash = "/login";
   //          return;
   //       }
   //       res.message = error;
   //       res.alert_text = error;
   //       Toast.Error(error);
   //    }
   // };

   // const DisEnableMenu = async (id, active) => {
   //    try {
   //       let res = CorrectRes;
   //       const axiosData = await Axios.get(`/menus/${id}/DisEnableMenu/${active ? "1" : "0"}`);
   //       // console.log("deleteUser() axiosData", axiosData.data);
   //       getMenus();
   //       res = axiosData.data.data;
   //       // console.log("res", res);
   //       return res;
   //    } catch (error) {
   //       const res = ErrorRes;
   //       console.log(error);
   //       res.message = error;
   //       res.alert_text = error;
   //       Toast.Error(error);
   //    }
   // };

   // const getHeaderMenusSelectIndex = async () => {
   //    try {
   //       const res = CorrectRes;
   //       const axiosData = await Axios.get(`/menus/headers/selectIndex`);
   //       // console.log("el selectedDeLevels", axiosData);
   //       res.result.headersMenus = axiosData.data.data.result;
   //       // res.result.headersMenus.unshift({ id: 0, label: "Selecciona una opción..." });
   //       setHeadersMenus(axiosData.data.data.result);
   //       // console.log("headersMenus", headersMenus);

   //       return res;
   //    } catch (error) {
   //       const res = ErrorRes;
   //       console.log(error);
   //       res.message = error;
   //       res.alert_text = error;
   //    }
   // };

   // const counterOfMenus = async () => {
   //    try {
   //       let res = CorrectRes;
   //       const axiosData = await Axios.get(`/menus/counterOfMenus`);
   //       res = axiosData.data.data;
   //       // console.log("counterOfMenus()->res", res);

   //       return res;
   //    } catch (error) {
   //       console.log(error);
   //       res.message = error;
   //       res.alert_text = error;
   //       Toast.Error(error);
   //    }
   // };

   // // #region CRUD
   // const getMenus = async (getItems = false) => {
   //    try {
   //       // setMenu([]);
   //       const res = CorrectRes;
   //       const axiosData = await Axios.get(`/menus`);
   //       res.result.menus = axiosData.data.data.result;
   //       // console.log(res.result);

   //       if (getItems) {
   //          let _headersMenus = [];
   //          let _checkMenus = []; // #permisos
   //          _headersMenus = res.result.menus.filter((menu) => menu.belongs_to == 0);
   //          const items = [];

   //          await _headersMenus.map((hm) => {
   //             let _childrenMenus = [];
   //             const item = {
   //                id: hm.id,
   //                title: hm.menu,
   //                // caption: hm.caption,
   //                // type: hm.type,
   //                children: []
   //             };

   //             // #permisos
   //             _checkMenus.push({
   //                id: hm.id,
   //                isChecked: false,
   //                others_permissions: [],
   //                permissions: {
   //                   read: false,
   //                   create: false,
   //                   update: false,
   //                   delete: false,
   //                   more_permissions: []
   //                }
   //             });
   //             // #permisos

   //             _childrenMenus = res.result.menus.filter((chm) => chm.belongs_to == hm.id);
   //             _childrenMenus.map((iCh) => {
   //                let others_permissions = iCh.others_permissions == null ? [] : iCh.others_permissions.split(",");
   //                others_permissions = others_permissions.map((op) => op.trim());
   //                const child = {
   //                   id: iCh.id,
   //                   title: iCh.menu,
   //                   others_permissions: others_permissions,
   //                   readOnly: Boolean(iCh.read_only)
   //                   // type: iCh.type,
   //                   // url: iCh.url,
   // //                   // icon: tablerIcons[`${iCh.icon}`]
   //                };
   //                item.children.push(child);

   //                // #permisos
   //                _checkMenus.push({
   //                   id: iCh.id,
   //                   isChecked: false,
   //                   others_permissions: others_permissions,
   //                   permissions: {
   //                      read: false,
   //                      create: false,
   //                      update: false,
   //                      delete: false,
   //                      more_permissions: []
   //                   },
   //                   readOnly: false
   //                });
   //                // #permisos
   //             });
   //             items.push(item);
   //          });
   //          // console.log("los items", items);
   //          setMenus(items);
   //          setCheckMenus(_checkMenus);
   //          // console.log("los checkMenus", checkMenus);
   //       } else setMenus(axiosData.data.data.result);
   //       // console.log("menus", menus);
   //       showMyMenus();
   //       return res;
   //    } catch (error) {
   //       console.log(error);
   //       res.message = error;
   //       res.alert_text = error;
   //       Toast.Error(error);
   //    }
   // };

   // const getMenusSelectIndexToRoles = async () => {
   //    try {
   //       const res = CorrectRes;
   //       const axiosData = await Axios.get(`/menus/selectIndexToRoles`);
   //       // console.log("el selectedDeLevels", axiosData);
   //       res.result.menus = axiosData.data.data.result;
   //       // console.log(res.result.menus);
   //       // res.result.menus.unshift({ id: 0, label: "Selecciona una opción..." });
   //       setMenusSelect(axiosData.data.data.result);
   //       // console.log("menus", menus);

   //       return res;
   //    } catch (error) {
   //       const res = ErrorRes;
   //       console.log(error);
   //       res.message = error;
   //       res.alert_text = error;
   //    }
   // };

   // const showMenu = async (id) => {
   //    try {
   //       let res = CorrectRes;
   //       const axiosData = await Axios.get(`/menus/id/${id}`);
   //       // console.log("axiosData", axiosData);
   //       res = axiosData.data.data;
   //       // await setMenu(res.result);
   //       setFormData(res.result);
   //       setMenu(res.result);
   //       // console.log(res);

   //       return res;
   //    } catch (error) {
   //       console.log(error);
   //       res.message = error;
   //       res.alert_text = error;
   //       Toast.Error(error);
   //    }
   // };

   // const showMenuBy = async (searchBy, value) => {
   //    try {
   //       let res = CorrectRes;
   //       const axiosData = await Axios.get(`/menus/${searchBy}/${value}`);
   //       // console.log("axiosData", axiosData);
   //       res = axiosData.data.data;
   //       // await setMenu(res.result);
   //       // setFormData(res.result);
   //       setMenu(res.result);
   //       // console.log(res);

   //       return res;
   //    } catch (error) {
   //       console.log(error);
   //       res.message = error;
   //       res.alert_text = error;
   //       Toast.Error(error);
   //    }
   // };

   // const createMenu = async (menu) => {
   //    let res = CorrectRes;
   //    try {
   //       const axiosData = await Axios.post("/menus/create", menu);
   //       res = axiosData.data.data;
   //       getMenus();
   //       showMyMenus();
   //    } catch (error) {
   //       res = ErrorRes;
   //       console.log(error);
   //       res.message = error;
   //       res.alert_text = error;
   //       Toast.Error(error);
   //    }
   //    return res;
   // };

   // const updateMenu = async (menu) => {
   //    let res = CorrectRes;
   //    try {
   //       const axiosData = await Axios.post(`/menus/update/${menu.id}`, menu);
   //       res = axiosData.data.data;
   //       getMenus();
   //       showMyMenus();
   //    } catch (error) {
   //       res = ErrorRes;
   //       console.log(error);
   //       res.message = error;
   //       res.alert_text = error;
   //       Toast.Error(error);
   //    }
   //    return res;
   // };

   // const deleteMenu = async (id) => {
   //    try {
   //       let res = CorrectRes;
   //       const axiosData = await Axios.post(`/menus/destroy/${id}`);
   //       // console.log("deleteMenu() axiosData", axiosData.data);
   //       getMenus();
   //       showMyMenus();
   //       res = axiosData.data.data;
   //       // console.log("res", res);
   //       return res;
   //    } catch (error) {
   //       const res = ErrorRes;
   //       console.log(error);
   //       res.message = error;
   //       res.alert_text = error;
   //       Toast.Error(error);
   //    }
   // };
   // // #endregion CRUD
   //#endregion VERSION 1

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
