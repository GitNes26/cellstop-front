import to from "await-to-js";
import { Axios, Response } from "../utils/Api";
import Toast from "../utils/Toast";
// import useAuthStore from "../stores/authStore";
// import useMenuStore from "../stores/menuStore";
import { useAuthContext } from "../context/AuthContext";
import useObservable from "../hooks/useObservable";
import { useQueries } from "@tanstack/react-query";
import { useEffect } from "react";
// import { checkLoggedIn } from "./authService";

const prefixPath = "/menus";

// export const getMenusByRole = async () => {
//    // const auth = useAuthStore.getState().auth;
//    const { auth } = useAuthContext();
//

//    const pages_read = auth.read;
//    const [error, response] = await to(Axios.get(`${prefixPath}/getMenusByRole/${pages_read}`));
//    // console.log("🚀 ~ getMenusByRole ~ error:", error);
//    // console.log("🚀 ~ getMenusByRole ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getMenusByRole ~ error:", error);
//       const message = error.response.data.message || "getMenusByRole ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;

//    return res;
// };

// export const getHeadersMenusSelect = async () => {
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/getHeadersMenusSelect`));
//    // console.log("🚀 ~ getHeadersMenusSelect ~ error:", error);
//    // console.log("🚀 ~ getHeadersMenusSelect ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getHeadersMenusSelect ~ error:", error);
//       const message = error.response.data.message || "getHeadersMenusSelect ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//    }

//    Response.success = response.data.data;
//    const res = Response.success;

//    return res;
// };

// export const getSelectMenusToRoles = async () => {
//    const setMenusSelect = useMenuStore.getState().setMenusSelect;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/selectIndexToRoles`));
//    // console.log("🚀 ~ getSelectMenusToRoles ~ error:", error);
//    // console.log("🚀 ~ getSelectMenusToRoles ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getSelectMenusToRoles ~ error:", error);
//       const message = error.response.data.message || "getSelectMenusToRoles ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    const Observable = Observable;
//    await setMenusSelect(res.result);

//    return res;
// };

//#region CRUD
// export const getAllMenus = async () => {
//    const { ObservableSet } = useObservable();

//    // const setAllMenus = useMenuStore.getState().setAllMenus;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}`));
//    // console.log("🚀 ~ getAllMenus ~ error:", error);
//    // console.log("🚀 ~ getAllMenus ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getAllMenus ~ error:", error);
//       const message = error.response.data.message || "getAllMenus ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    // const res = Response.success;
//    await ObservableSet("AllMenus", Response.success.result).finally((res) => {
//       console.log("🚀OBSERVABLES ~ getAllMenus ~ res:", res);
//       // setAllMenus(res.result);
//    });

//    return res;
// };
export const GetAllMenus = async () => {
   const { ObservableSet } = useObservable();

   // const setAllMenus = useMenuStore.getState().setAllMenus;

   const [menus] = useQueries({
      queries: [
         {
            queryKey: ["menus/index"],
            queryFn: () => Axios.get("/menus"),
            refetchOnWindowFocus: true
         }

         // Puedes agregar más peticiones aquí
      ]
   });
   console.log("🚀 ~ getAllMenus ~ menus:", menus);
   // const [error, response] = await to(Axios.get(`${prefixPath}`));
   // console.log("🚀 ~ getAllMenus ~ error:", error);
   // console.log("🚀 ~ getAllMenus ~ response:", response);
   // if (error) {
   //    console.log("🚀 ~ getAllMenus ~ error:", error);
   //    const message = error.response.data.message || "getAllMenus ~ Ocurrio algun error, intenta de nuevo :c";
   //    Toast.Error(message);
   //    return;
   //    // throw new Error("que sale aqui?");
   // }

   // Response.success = response.data.data;
   // const res = Response.success;
   // await ObservableSet("AllMenus", Response.success.result).finally((res) => {
   //    console.log("🚀OBSERVABLES ~ getAllMenus ~ res:", res);
   //    // setAllMenus(res.result);
   // });
   useEffect(() => {
      if (menus.isSuccess) {
         ObservableSet("allMenusObj", menus);
         ObservableSet("allMenus", menus.data?.data.data || []);
      }
      // useObservable().ObservableSet("AllMenus", menus.data?.data || []).finally(() => {{
      //    console.log("🚀 ~ MenusView ~ useEffect ~ menus.data:", menus.data);
      // }});
   }, [menus.isSuccess]);

   // return menus;
};

export const getAllMenus = async () => {
   console.log("🚀 ~ getAllMenus ~ menus:", menus);
   const [error, response] = await to(Axios.get(`${prefixPath}`));
   console.log("🚀 ~ getAllMenus ~ error:", error);
   console.log("🚀 ~ getAllMenus ~ response:", response);
   if (error) {
      console.log("🚀 ~ getAllMenus ~ error:", error);
      const message = error.response.data.message || "getAllMenus ~ Ocurrio algun error, intenta de nuevo :c";
      Toast.Error(message);
      return Response.error(message);
      // throw new Error("que sale aqui?");
   }

   Response.success = response.data.data;
   const res = Response.success;

   return res;
};

// export const createOrUpdateMenu = async (data) => {
//    // console.log("🚀 ~ createOrUpdateMenu ~ data:", data);
//

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
//    // console.log("🚀 ~ createOrUpdateMenu ~ error:", error);
//    // console.log("🚀 ~ createOrUpdateMenu ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ createOrUpdateMenu ~ error:", error);
//       const message = error.response.data.message || "createOrUpdateMenu ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllMenus();

//    return res;
// };

// export const getMenu = async (id) => {
//    const setMenu = useMenuStore.getState().setMenu;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
//    // console.log("🚀 ~ getMenu ~ error:", error);
//    // console.log("🚀 ~ getMenu ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getMenu ~ error:", error);
//       const message = error.response.data.message || "getMenu ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setMenu(res.result);

//    return res;
// };

// export const disEnableMenu = async (id, active) => {
//    // console.log("🚀 ~ disEnableMenu ~ data:", data);
//

//    const strActive = active ? "reactivar" : "desactivar";
//    const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
//    // console.log("🚀 ~ disEnableMenu ~ error:", error);
//    // console.log("🚀 ~ disEnableMenu ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ disEnableMenu ~ error:", error);
//       const message = error.response.data.message || "disEnableMenu ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllMenus();

//    return res;
// };
//#endregion CRUD
