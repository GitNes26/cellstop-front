const SuccessRes = {
   status: 200,
   result: [],
   message: "",
   alert_icon: "success",
   alert_title: "",
   alert_text: ""
};
const ErrorRes = (message) => ({
   status: 500,
   result: null,
   message: message || "Ocurrio un error inesperado, intenta de nuevo más tarde.",
   alert_icon: "error",
   alert_title: "",
   alert_text: ""
});
const Response = {
   success: SuccessRes,
   error: ErrorRes
};

import axios from "axios";
// import { useAuthContext } from "../context/AuthContext";
import env from "../constant/env";
import { hasFiles } from "./Formats";
import Toast from "./Toast";
import to from "await-to-js";
// import useAuthStore from "../stores/authStore";

const AxiosAuth = axios.create({
   baseURL: env.API_URL,
   responseType: "json",
   // withCredentials: true,
   headers: { Accept: "application/json", "Content-Type": "application/json" }
});

const Axios = axios.create({
   baseURL: env.API_URL,
   responseType: "json",
   withCredentials: true,
   headers: { Accept: "application/json", "Content-Type": "application/json" }
});

Axios.interceptors.request.use(
   (config) => {
      // const token = useAuthStore.getState().token;
      const token = localStorage.getItem("token") || "";
      config.headers = {
         Authorization: `Bearer ${token}`
      };
      // Puedes guardar meta info si quieres usarla luego
      config.meta = { startTime: new Date() };
      return config;
   },
   (error) => {
      console.error("🚀 ~ error:", error);
      if (error.response?.status === 401) {
         console.warn("⚠️ No autenticado, redirigiendo a login o cerrando sesión...");
         localStorage.removeItem("token"); // o dispatch logout, etc.
         // Redireccionar si aplica
         window.location.href = "#/login";
      } else if (error.response?.status === 403) {
         console.warn("❌ No tienes permisos suficientes.");
      } else if (error.response?.status >= 500) {
         console.error("💥 Error del servidor.");
      }
      return Promise.reject(error);
   }
);
Axios.interceptors.response.use(
   (response) => {
      // Calcular tiempo de respuesta (si guardaste el meta)
      const end = new Date();
      if (response.config.meta?.startTime) {
         const diff = end - response.config.meta.startTime;
         console.log(`⏱️ ${response.config.url} → ${diff}ms`);
      }

      // Puedes transformar la data si lo deseas
      if (response.data?.result) {
         return response.data.result; // devolver solo lo útil
      }

      return response;
   },
   (error) => {
      const status = error?.response?.status;

      if (status === 401) {
         console.warn("⚠️ Sesión expirada. Cerrando sesión...");
         localStorage.removeItem("token");
         if (window.location.pathname !== "#/login") {
            window.location.href = "#/login";
         }
      } else if (status === 403) {
         console.warn("🚫 No tienes permisos suficientes.");
      } else if (status >= 500) {
         console.error("💥 Error interno del servidor:", error.response?.data);
      }

      return Promise.reject(error);
   }
);

const AxiosFiles = axios.create({
   baseURL: env.API_URL,
   responseType: "json",
   withCredentials: true,
   headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data"
   }
});
AxiosFiles.interceptors.request.use(
   (config) => {
      // const token = useAuthStore.getState().token;
      const token = localStorage.getItem("token") || "";

      config.headers = {
         Authorization: `Bearer ${token}`,
         "Content-Type": "multipart/form-data"
      };
      // Puedes guardar meta info si quieres usarla luego
      config.meta = { startTime: new Date() };
      return config;
   },
   (error) => {
      console.error("🚀 ~ error:", error);
      // if (error.response?.status === 401) {
      //    console.warn("⚠️ No autenticado, redirigiendo a login o cerrando sesión...");
      //    localStorage.removeItem("token"); // o dispatch logout, etc.
      //    // Redireccionar si aplica
      //    window.location.href = "/login";
      // } else if (error.response?.status === 403) {
      //    console.warn("❌ No tienes permisos suficientes.");
      // } else if (error.response?.status >= 500) {
      //    console.error("💥 Error del servidor.");
      // }
      // return Promise.reject(error);
   }
);
AxiosFiles.interceptors.response.use(
   (response) => {
      // Calcular tiempo de respuesta (si guardaste el meta)
      const end = new Date();
      if (response.config.meta?.startTime) {
         const diff = end - response.config.meta.startTime;
         console.log(`⏱️ ${response.config.url} → ${diff}ms`);
      }

      // Puedes transformar la data si lo deseas
      if (response.data?.result) {
         return response.data.result; // devolver solo lo útil
      }

      return response;
   },
   (error) => {
      const status = error?.response?.status;

      if (status === 401) {
         console.warn("⚠️ Sesión expirada. Cerrando sesión...");
         localStorage.removeItem("token");
         if (window.location.pathname !== "#/login") {
            window.location.href = "#/login";
         }
      } else if (status === 403) {
         console.warn("🚫 No tienes permisos suficientes.");
      } else if (status >= 500) {
         console.error("💥 Error interno del servidor:", error.response?.data);
      }

      return Promise.reject(error);
   }
);

const AxiosCP = axios.create({
   baseURL: env.API_CP,
   responseType: "json",
   headers: { Accept: "application/json", "Content-Type": "application/json" }
});
// AxiosCP.interceptors.request.use((config) => {
//    const token = useAuthStore.getState().token;
//    config.headers = {
//       Authorization: `Bearer ${token}`
//    };
//    return config;
// });

const apiRequest = async (method, url, data = null, setResult = null) => {
   const useFile = hasFiles(data);
   const instance = useFile ? AxiosFiles : Axios;

   const [error, response] = data ? await to(instance[method](url, data)) : await to(instance[method](url));

   if (error) {
      console.error(`❌ Error en ${method.toUpperCase()} ${url}:`, error);
      Toast.Error(error.response?.data?.message || "Ocurrió un error en la solicitud");
      Response.error = error.response?.data;
      return null;
   }

   Response.success = response.data?.data;
   const res = response.data?.data?.result || [];
   setResult(res);
   return res;
};

export { Response, Axios, AxiosAuth, AxiosFiles, AxiosCP, apiRequest };
