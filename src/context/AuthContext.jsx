import { createContext, useContext, useState } from "react";
// import sAlert from "../utils/sAlert";
import { useGlobalContext } from "./GlobalContext";
import { useEffect } from "react";
import Toast from "../utils/Toast";
import env from "../constant/env";
import { Axios, AxiosAuth, Response } from "../utils/Api";
import { isNumeric } from "../utils/Validations";
// import { authService } from "../services/authService";
import to from "await-to-js";
import { includesInArray } from "../utils/Formats";

// export const Axios = axios;
// Axios.defaults.baseURL = env.API_URL;
// Axios.defaults.headers.common = {
//    Accept: "application/json", //*/*
//    "Content-Type": "application/json",
//    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
// };

export const AuthContext = createContext();

export let idPage = 0;
const AuthinitialStatate = {
   id: null,
   username: "",
   email: "",
   email_verified_at: null,
   role_id: null,
   employee_id: null,
   active: null,
   created_at: "",
   updated_at: null,
   deleted_at: null,
   role: "",
   read: false,
   create: false,
   update: false,
   delete: false,
   more_permissions: [],
   permissions: {
      read: false,
      create: false,
      update: false,
      delete: false,
      more_permissions: []
   }
};

export default function AuthContextProvider({ children }) {
   const { setIsLoading, counters, setCounters, resetCounters } = useGlobalContext();

   const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")) || AuthinitialStatate);
   // const [token, setToken] = useState(localStorage.getItem("token") || "");
   const [permissionRead, setPermissionRead] = useState(false);
   const [isAuth, setIsAuth] = useState(false);
   // const [idPage, setIdPage] = useState(0);
   const [openModalChangePassword, setOpenModalChangePassword] = useState(false);

   const signup = async (username, email, password, role) => {
      try {
         const { data } = await Axios.post(`/signup`, {
            username,
            email,
            password,
            role
         });
         // console.log("el data signup:", data);
         // if (data.data.status_code == 200) sAlert.Success(data.data.alert_text, 2500);
         return data.data;
      } catch (error) {
         console.log(error);
         // sAlert.Error("Parece que hay un error 🤔, intenta más tarde");
         return error;
      }
   };

   const login = async ({ username, password }) => {
      setIsAuth(false);
      setAuth(null);
      try {
         let postData = {
            username,
            password
         };
         if (username.includes("@"))
            postData = {
               email: username,
               password
            };
         else if (isNumeric(username))
            postData = {
               payroll_number: username,
               password
            };
         const [error, response] = await to(AxiosAuth.post(`/login`, postData));
         // console.log("🚀 ~ login ~ error:", error);
         // console.log("🚀 ~ login ~ response:", response);
         if (error) {
            console.log("🚀 ~ login ~ error:", error);
            const message = error.response.data.message || "login ~ Ocurrio algun error, intenta de nuevo :c";
            Toast.Error(message);
            return;
            // throw new Error("que sale aqui?");
         }

         response.data.data.result.auth.permissions = {
            read: false,
            create: false,
            update: false,
            delete: false,
            more_permissions: []
         };
         localStorage.setItem("auth", JSON.stringify(response.data.data.result.auth));
         localStorage.setItem("token", response.data.data.result.token);
         setAuth(response.data.data.result.auth);
         setIsAuth(true);
         const token = localStorage.getItem("token") || null;

         Response.success = response.data.data;
         const res = Response.success;

         return res;
      } catch (error) {
         console.log(error);
         // sAlert.Error("Parece que hay un error 🤔, intenta más tarde");
      }
   };

   const checkLoggedIn = async () => {
      console.log("🚀 ~ checkLoggedIn ~ a checar:");
      const location = window.location;
      let url = location.hash.split("#").reverse()[0];
      const paths = url.split("/");
      url = paths.length > 2 ? url : "";
      // console.log("🚀 ~ checkLoggedIn ~ paths:", paths);
      // console.log("🚀 ~ checkLoggedIn ~ url:", url);

      let data = { url };
      // console.log("🚀 ~ checkLoggedIn ~ auth:", auth);
      // console.log("🚀 ~ checkLoggedIn ~ data:", data);
      let [error, response] = await to(Axios.post(`checkLoggedIn`, data));
      // console.log("🚀 ~ checkLoggedIn ~ error:", error);
      // console.log("🚀 ~ checkLoggedIn ~ response:", response);

      if (error) {
         console.log("🚀 ~ checkLoggedIn ~ error:", "entro al error?", error);
         await logout(401);
         const message = error.response.data.message || "Tu sesión ha expirado, vuelve a iniciar sesión";
         Toast.Info(message);
         // location.hash = "/";
         return false;
      }
      // ESTA SECCION ES PARA CUANDO TIENEN MAS NIVELES LA URL Y NO ESTAN REGISTRADAS EN MENUS, VAMOS REDUCIENDO LA URL
      while (response.data.data.result == null) {
         paths.pop();
         // console.log("🚀 ~ checkLoggedIn ~ paths:", paths);
         url = paths.join("/");
         data = { url };
         [error, response] = await to(Axios.post(`checkLoggedIn`, data));
         // console.log("🚀 ~ checkLoggedIn ~ while ~ error:", error);
         // console.log("🚀 ~ checkLoggedIn ~ while ~ response:", response);
         if (error) {
            console.log("🚀 ~ checkLoggedIn ~ error:", "entro al error del while?", error);
            await logout();
            const message = error.response.data.message || "Tu sesión ha expirado, vuelve a iniciar sesión";
            Toast.Info(message);
            location.hash = "/";
            return false;
         }
      }
      if (!auth) {
         Toast.Error("Sesión expirada");
         console.log("checkLoggedIn ~ No está autenticado");
         await logout();
         location.hash = "/";
         return false;
      }
      const res = response.data.data;
      if (!res || res.status_code != 200) {
         // await logout();
         const message = "Tu sesión ha expirado, vuelve a iniciar sesión";
         Toast.Info(message);
         location.hash = auth.page_index;
         return false;
      }

      if (url !== "") {
         const idPage = res.result.id;
         // console.log("🚀 ~ checkLoggedIn ~ auth:", auth);
         if (!includesInArray(auth.read.split(","), ["todas", idPage.toString()])) {
            // await logout();
            // const message = "que haces aqui metiche?";
            // Toast.Info(message);
            location.hash = auth.page_index;
            return false;
         }
         // console.log("🚀 ~ checkLoggedIn ~ idPage:", idPage);
         // console.log("🚀 ~ checkLoggedIn ~ auth:", auth);
         auth.permissions = {
            read: auth.read ? includesInArray(auth.read.split(","), ["todas", idPage.toString()]) : false,
            create: auth.create ? includesInArray(auth.create.split(","), ["todas", idPage.toString()]) : false,
            update: auth.update ? includesInArray(auth.update.split(","), ["todas", idPage.toString()]) : false,
            delete: auth.delete ? includesInArray(auth.delete.split(","), ["todas", idPage.toString()]) : false,
            more_permissions: auth.more_permissions
         };
         // console.log("🚀 ~ checkLoggedIn ~ auth:", auth);
         const data = {
            auth,
            // token,
            isAuth
         };
         // console.log("🚀 ~ checkLoggedIn ~ data:", data);
         await setAuth(data.auth);
      }
      return true;
      //#region VERSION 1
      // console.log("🚀 ~ checkLoggedIn ~ checkLoggedIn:");
      // const token = localStorage.getItem("token") || null;
      // console.log("🚀 ~ checkLoggedIn ~ token:", token);
      // console.log("🚀 ~ checkLoggedIn ~ auth:", auth);
      // if (token != null && auth != null) {
      //    let [error, response] = await to(Axios.get(`users/id/${auth.id}`));
      //    // console.log("🚀 ~ checkLoggedIn ~ error:", error);
      //    // console.log("🚀 ~ checkLoggedIn ~ response:", response);

      //    if (error) {
      //       console.log("🚀 ~ checkLoggedIn ~ error: E QUE PUES?", error);
      //       // await logout();
      //       const message = error.response.data.message || "Tu sesión ha expirado, vuelve a iniciar sesión";
      // //       Toast.Info(message);
      //       location.hash = "/";
      //       return false;
      //    }
      //    if (response.data.data.status_code != 200) setAuth(false);
      //    else {
      //       localStorage.setItem("auth", JSON.stringify(response.data.data.result));
      //       setAuth(JSON.parse(localStorage.getItem("auth")));
      //       setIsAuth(true);
      //       // setAuth(response.data.data.result);
      //    }
      // }
      //#endregion VERSION 1
   };

   const logout = async (status = null) => {
      console.log("🚀 ~ logout ~ status:", status);
      try {
         if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("auth");
            const token = localStorage.getItem("token") || null;
            Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            setIsAuth(false);
            setAuth(null);
            location.hash = "/login";
            return;
         }
         const [error, response] = await to(Axios.get(`/logout`));
         // console.log("🚀 ~ login ~ error:", error);
         // console.log("🚀 ~ login ~ response:", response);
         if (error) {
            console.log("🚀 ~ login ~ error:", error);
            const message = error.response.data.message || "logout ~ Ocurrio algun error, intenta de nuevo :c";
            Toast.Error(message);
            return;
         }

         localStorage.removeItem("token");
         localStorage.removeItem("auth");
         const token = localStorage.getItem("token") || null;
         Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
         setIsAuth(false);
         setAuth(null);
         location.hash = "/login";

         Response.success = response.data.data;
         const res = Response.success;

         return res;
      } catch (error) {
         console.log(error);
         localStorage.removeItem("token");
         localStorage.removeItem("auth");
         const token = localStorage.getItem("token") || null;
         Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
         setIsAuth(false);
         setAuth(null);
         location.hash = "/login";
      }
   };

   const counterOfMenus = async () => {
      let res = Response.success;
      try {
         await resetCounters();
         if (["", "#", "#/", "#/login", "#/signup"].includes(window.location.hash)) return;
         counters.requestAll = 0;
         counters.requestInReview = 0;
         // console.log("counterofMenus");
         const axiosData = await Axios.get(`counters/counterOfMenus`);
         res = await axiosData.data.data;
         // console.log("🚀 ~ counterOfMenus ~ res:", res);
         const filterCounters = { ...counters };
         const newCounters = { ...counters };

         newCounters.requestAll = 0;
         filterCounters.requestAll = await res.result.filter((data) =>
            ["ALTA", "TERMINADA", "EN REVISIÓN", "EN EVALUACIÓN", "RECHAZADA", "APROBADA", "PAGO 1", "PAGO 2", "PAGO 3", "PAGADA", "ENTREGADA", "CANCELADA"].includes(
               data.counter
            )
         );
         await filterCounters.requestAll.map((data) => (newCounters.requestAll += data.total));

         // newCounters.requestByUser = 150;
         // if (auth.role_id === ROLE_CIUDADANO) {
         //    console.log("soy ciudadano");
         //    filterCounters.requestByUser = await res.result.filter((data) => console.log(data));
         //    await filterCounters.requestByUser.map((data) => (newCounters.requestByUser += data.total));
         // }

         newCounters.requestInReview = 0;
         filterCounters.requestInReview = await res.result.filter((data) => ["TERMINADA", "EN REVISIÓN"].includes(data.counter));
         await filterCounters.requestInReview.map((data) => (newCounters.requestInReview += data.total));

         newCounters.requestInEvaluation = 0;
         filterCounters.requestInEvaluation = await res.result.filter((data) => ["EN EVALUACIÓN"].includes(data.counter));
         await filterCounters.requestInEvaluation.map((data) => (newCounters.requestInEvaluation += data.total));

         newCounters.requestApproved = 0;
         filterCounters.requestApproved = await res.result.filter((data) => ["APROBADA"].includes(data.counter));
         await filterCounters.requestApproved.map((data) => (newCounters.requestApproved += data.total));

         newCounters.requestPayed1 = 0;
         filterCounters.requestPayed1 = await res.result.filter((data) => ["PAGO 1"].includes(data.counter));
         await filterCounters.requestPayed1.map((data) => (newCounters.requestPayed1 += data.total));

         newCounters.requestPayed2 = 0;
         filterCounters.requestPayed2 = await res.result.filter((data) => ["PAGO 2"].includes(data.counter));
         await filterCounters.requestPayed2.map((data) => (newCounters.requestPayed2 += data.total));

         newCounters.requestPayed3 = 0;
         filterCounters.requestPayed3 = await res.result.filter((data) => ["PAGO 3"].includes(data.counter));
         await filterCounters.requestPayed3.map((data) => (newCounters.requestPayed3 += data.total));

         newCounters.requestPayed = 0;
         filterCounters.requestPayed = await res.result.filter((data) => ["PAGADA"].includes(data.counter));
         await filterCounters.requestPayed.map((data) => (newCounters.requestPayed += data.total));

         newCounters.requestDelivered = 0;
         filterCounters.requestDelivered = await res.result.filter((data) => ["ENTREGADA"].includes(data.counter));
         await filterCounters.requestDelivered.map((data) => (newCounters.requestDelivered += data.total));

         newCounters.requestRejected = 0;
         filterCounters.requestRejected = await res.result.filter((data) => ["RECHAZADA"].includes(data.counter));
         await filterCounters.requestRejected.map((data) => (newCounters.requestRejected += data.total));

         newCounters.requestCanceled = 0;
         filterCounters.requestCanceled = await res.result.filter((data) => ["CANCELADA"].includes(data.counter));
         await filterCounters.requestCanceled.map((data) => (newCounters.requestCanceled += data.total));
         // console.log("newCounters", newCounters);

         setCounters(newCounters);
         // console.log("counters", counters);

         // return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };
   const validateAccessPage = async (updateAuth = false) => {
      // console.log("validateAccessPage->el auth", auth);
      try {
         // console.log("auth.antes", auth);
         if (auth === null) {
            // console.log("al login");
            setIsAuth(false);
            window.location.hash = "/login";
            return;
         }
         if (updateAuth) await updatePermissionsAuth(auth.id);
         // window.addEventListener('hashchange',()=>{console.log('cambie de ruyta Luisao')}) IMPLEMENTARRRRRRR

         // console.log("auth.despues", auth);
         // #region VALIDAR SI TENGO PERMISO PARA ACCEDER A ESTA PAGINA
         const currentPath = location.hash.split("#").reverse()[0];
         const dataPost = { url: currentPath };
         let menu = null;
         const { data } = await Axios.post(`/menus/getIdByUrl`, dataPost);
         menu = data.data.result;
         let pagesRead;
         let idPage;
         if (menu !== null) {
            // console.log("🚀 ~ validateAccessPage ~ menu:", menu);
            // console.log("🚀 ~ validateAccessPage ~ auth:", auth);
            if (auth.read === undefined) return logout(401);
            idPage = menu;
            // console.log("🚀 ~ validateAccessPage ~ auth.read:", auth.read);
            pagesRead = auth.read.split(",");
            // console.log(menu.id);
            idPage = menu.id.toString();
            // console.log(pagesRead);
         }

         // console.log("currentPath", currentPath);
         let permission = false; // tengo permiso para estar en esta pagina?
         let validatePermissions = false; // voy a validar el permiso??? es decir, si estoy auth y no tengo en "read"=todas
         const permissions = {
            read: false,
            create: false,
            update: false,
            delete: false,
            more_permissions: []
         };
         // console.log("QUE TRA DE PERMISOS EL AUTH - 1", auth);
         if (auth.read !== "todas") validatePermissions = true;
         if (currentPath === "/app") validatePermissions = false;

         if (menu) {
            permissions.read = auth.read === "todas" ? true : auth.read.split(",").includes(idPage) ? true : false;
            permissions.create = auth.create === "todas" ? true : auth.create === null ? false : auth.create.split(",").includes(idPage) ? true : false;
            permissions.update = auth.update === "todas" ? true : auth.update === null ? false : auth.update.split(",").includes(idPage) ? true : false;
            permissions.delete = auth.delete === "todas" ? true : auth.delete === null ? false : auth.delete.split(",").includes(idPage) ? true : false;
            permissions.more_permissions = auth.more_permissions === "todas" ? ["todas"] : auth.more_permissions === null ? [] : auth.more_permissions.split(",");
            const more_permissions_trim = permissions.more_permissions.map((p) => p.trim());
            permissions.more_permissions = more_permissions_trim;
            // PASAR PERMISOS AL AUTH
            auth.permissions = permissions;
            // setAuth(true);
         }

         // console.log("QUE TRA DE PERMISOS EL AUTH - 2", auth);

         // console.log("auth Antes", auth);
         // if (location.hash.split("/").length <= 3) {
         //    console.log("conservar los mismos valores del auth");
         //    setAuth(JSON.parse(localStorage.getItem("auth")));
         //    console.log("auth Despues", auth);
         // }

         if (validatePermissions) {
            // console.log("validatePermissions?", menu);
            // console.log("data/getIdByUrl", data);
            if (menu !== null) {
               // console.log("🚀 ~ validateAccessPage ~ menu2:", menu);
               // if (auth.read === undefined) return logout(401);
               permission = pagesRead.includes(idPage) ? true : false;
            } else {
               if (location.hash.split("/").length >= 3) permission = true;
            }
         } else {
            // console.log("no necesita validacion");
            permission = true;
            // setAuth(true);
         }
         // console.log("el permission", permission);
         if (permission) setPermissionRead(permission);
         localStorage.setItem("auth", JSON.stringify(auth));
         // console.log("el permissionRead", permissionRead);
         // console.log(location.hash.split("/"));
         // console.log("🚀 ~ validateAccessPage ~ permission:", permission);
         // console.log("🚀 ~ validateAccessPage ~ location.hash:", location.hash.split("/"));
         if (!permission) {
            // console.log("sigue entrando");
            if (location.hash.split("/").length <= 3) {
               // console.log("y tengo menos de 3 slash");
               window.location.hash = `#${auth.page_index}`;
            }
            // console.log("🚀 ~ validateAccessPage ~ !location.hash.split('/').includes('solicitud-beca'):", !location.hash.split("/").includes("solicitud-beca"));
            if (!location.hash.split("/").includes("solicitud-beca")) {
               // console.log("mandar al page_index", auth.page_index);
               // console.log(window.location.hash);
               window.location.hash = `#${auth.page_index}`;
               // auth.permissions.read = true;
               setIsAuth(true);
               setPermissionRead(true);
               // localStorage.setItem("auth", JSON.stringify(auth));
               // console.log("los permisos del auth", auth);
            }
         }

         // console.log("como quedo el permission?", permission);
         // console.log("auth al final", auth);

         // #endregion VALIDAR SI TENGO PERMISO PARA ACCEDER A ESTA PAGINA
      } catch (error) {
         console.log(error);
         if (error.response?.status === 401) logout(error.response?.status);
      }
   };

   const changePasswordAuth = async ({ password, new_password }) => {
      try {
         const postData = {
            password,
            new_password
         };
         // console.log(postData);
         const { data } = await Axios.post(`/changePasswordAuth`, postData);
         // console.log("el data signup:", data);
         setIsLoading(false);
         const res = data.data;
         if (res.errors) {
            setIsLoading(false);
            Object.values(res.errors).forEach((errors) => {
               errors.map((error) => Toast.Warning(error));
            });
            return;
         }
         if (res.status_code !== 200) {
            setIsLoading(false);
            // return Toast.Customizable(res.alert_text, res.alert_icon);
         }
         Toast.Customizable(res.alert_text, res.alert_icon);
         if (res.status_code == 200 && res.alert_icon == "success") {
            // sAlert.Success(data.data.alert_text, null);
            setOpenModalChangePassword(false);
            logout(401);
         }
         return data.data;
      } catch (error) {
         console.log(error);
         // sAlert.Error("Parece que hay un error, intenta más tarde");
         return error;
      }
   };

   const updatePermissionsAuth = async (id) => {
      try {
         let res = Response.success;
         const axiosData = await Axios.get(`/users/id/${id}`);
         res = axiosData.data.data;
         res.result.permissions = {
            read: auth.permissions.read,
            create: auth.permissions.create,
            update: auth.permissions.update,
            delete: auth.permissions.delete,
            more_permissions: auth.permissions.more_permissions ?? []
         };
         // console.log(res);
         localStorage.setItem("auth", JSON.stringify(res.result));
         // setAuth(data.data.result.auth);
         setAuth(JSON.parse(localStorage.getItem("auth")));

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
         return res;
      }
   };

   useEffect(() => {
      // console.log("el useEffect de AuthContext");
      // validateAccessPage();
      // counterOfMenus();
   }, []);

   return (
      <AuthContext.Provider
         value={{
            auth,
            setAuth,
            signup,
            login,
            isAuth,
            setIsAuth,
            openModalChangePassword,
            setOpenModalChangePassword,
            checkLoggedIn,
            logout,
            permissionRead,
            validateAccessPage,
            changePasswordAuth,
            counterOfMenus
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}
export const useAuthContext = () => useContext(AuthContext);
