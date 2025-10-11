const SuccessRes = {
   status: 200,
   result: [],
   message: "",
   alert_icon: "success",
   alert_title: "",
   alert_text: ""
};
const ErrorRes = {
   status: 500,
   result: null,
   message: "",
   alert_icon: "error",
   alert_title: "",
   alert_text: ""
};
const Response = {
   success: SuccessRes,
   error: ErrorRes
};

import axios from "axios";
// import { useAuthContext } from "../context/AuthContext";
import env from "../constant/env";
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
      return config;
   },
   (error) => {
      console.error("🚀 ~ error:", error);
      if (error.response?.status === 401) {
         console.warn("⚠️ No autenticado, redirigiendo a login o cerrando sesión...");
         localStorage.removeItem("token"); // o dispatch logout, etc.
         // Redireccionar si aplica
         window.location.href = "/login";
      } else if (error.response?.status === 403) {
         console.warn("❌ No tienes permisos suficientes.");
      } else if (error.response?.status >= 500) {
         console.error("💥 Error del servidor.");
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

export { Response, Axios, AxiosAuth, AxiosFiles, AxiosCP };
