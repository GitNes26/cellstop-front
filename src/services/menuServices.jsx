import to from "await-to-js";
import { Axios, Response } from "../utils/Api";
import Toast from "../utils/Toast";
// import useAuthStore from "../stores/authStore";
// import useMenuStore from "../stores/menuStore";
import { useAuthContext } from "../context/AuthContext";
import useObservable from "../hooks/useObservable";
import { useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
// import { checkLoggedIn } from "./authService";

const prefixPath = "/menus";
const key = "menus";

import { useRequest } from "./../hooks/useRequest";

export const useMenuServices = () =>
   useRequest({
      key: `${key}`,
      baseUrl: `${prefixPath}`,
      queries: {
         index: "",
         selectIndex: "/selectIndex"
      }
   });

export const GetAllMenus = async () => {
   const { ObservableSet } = useObservable();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const [result, setResult] = useState(null);
   const [error, setError] = useState(null);

   const [menus] = useQueries({
      queries: [
         {
            queryKey: ["menus/index"],
            queryFn: async () => {
               setOpenDialog(true);
               const [err, response] = await to(Axios.get(`${prefixPath}`));
               setOpenDialog(false);

               if (err) {
                  console.error("❌ Error en GetAllMenus:", err);
                  const message = err.response?.data?.message || "Ocurrió un error al obtener los menús.";
                  Toast?.Error?.(message);
                  setError(err);
                  throw err; // react-query necesita que el error se lance para manejar estados correctamente
               }

               // console.log("🚀 ~ GetAllMenus ~ response:", response);
               // const res = response?.data?.data || [];

               // await ObservableSet("allMenus", response);
               // await ObservableSet("allMenus", data);
               Response.success = response?.data?.data;
               const res = Response.success;
               setResult(res);
               return res;
            },
            refetchOnWindowFocus: true
         }
      ]
   });
   // console.log("🚀 ~ GetAllMenus ~ menus:", menus);

   // Efecto para observar resultados actualizados (opcional)
   useEffect(() => {
      if (menus.isSuccess && menus.data) {
         setResult(menus.data);
      }
      if (menus.isError) {
         setError(menus.error);
      }
      ObservableSet("allMenus", menus);
      // ObservableSet("allMenus", data);
   }, [menus.isSuccess, menus.isError]);

   // console.log("🚀 ~ GetAllMenus ~ result:", result);
   return {
      result,
      error,
      refetch: menus.refetch // puedes reejecutar manualmente
   };
};

// export const createOrUpdateMenu = async (data) => {
//    // console.log("🚀 ~ createOrUpdateMenu ~ data:", data);
//    // // if (!(await checkLoggedIn())) return;

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
//    // if (!(await checkLoggedIn())) return;

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
//    // // if (!(await checkLoggedIn())) return;

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
