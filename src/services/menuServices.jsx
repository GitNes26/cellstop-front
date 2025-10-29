// services/menuServices.js
import useObservable from "../hooks/useObservable";
import { Axios, AxiosFiles } from "../utils/Api";
import { hasFiles } from "../utils/Formats";
import Toast from "../utils/Toast";
import to from "await-to-js";

export const prefixPath = "/menus";
export const singularName = "Menú", //Escribirlo siempre letra Capital
   pluralName = "Menús"; //Escribirlo siempre letra Capital

/**
 * Wrapper general para manejar peticiones con Axios o AxiosFiles según corresponda
 */
const requestHandler = async (method, url, data = null, handleSuccess) => {
   const client = hasFiles(data) ? AxiosFiles : Axios;
   const [error, response] = await to(client[method](url, data));

   if (error) {
      console.error(`❌ Error en ${url}`, error);
      const message = error.response?.data?.message || `Error en ${url}`;
      Toast.Error(message);
      throw new Error(message);
   }

   if (handleSuccess) handleSuccess();
   return response.data.data;
};

/* ----------------------------- CRUD MENUS ----------------------------- */

export const GetAllMenus = async () => {
   return await requestHandler("get", `${prefixPath}`);
};

export const GetMenu = async (id) => {
   return await requestHandler("get", `${prefixPath}/id/${id}`);
};

export const CreateOrUpdateMenu = async (data) => {
   const id = data.id > 0 ? `/${data.id}` : "";
   return await requestHandler("post", `${prefixPath}/createOrUpdate${id}`, data);
};

export const DisEnableMenu = async (id, active) => {
   const strActive = active ? "reactivar" : "desactivar";
   return await requestHandler("get", `${prefixPath}/disEnable/${id}/${strActive}`);
};

/* ----------------------------- AUXILIARES ----------------------------- */

export const GetMenusByRole = async (readPermissions) => {
   return await requestHandler("get", `${prefixPath}/getMenusByRole/${readPermissions}`);
};

export const GetHeadersMenusSelect = async () => {
   return await requestHandler("get", `${prefixPath}/getHeadersMenusSelect`);
};

export const GetSelectMenusToRoles = async () => {
   return await requestHandler("get", `${prefixPath}/selectIndexToRoles`);
};
