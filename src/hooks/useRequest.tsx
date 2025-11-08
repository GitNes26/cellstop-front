import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import to from "await-to-js";
import useObservable from "./useObservable";
import { useGlobalContext } from "../context/GlobalContext";
import { Axios } from "../utils/Api";
import Toast from "../utils/Toast";

interface RequestConfig {
   key: string; // clave base ("employees", "roles", etc.)
   baseUrl: string; // endpoint base ("/employees")
   queries?: { [key: string]: string }; // endpoints adicionales
}

/**
 * Hook base CRUD: obtiene, guarda, actualiza y elimina datos,
 * sincronizados con observables y control global de carga/errores.
 */
export const useRequest = ({ key, baseUrl, queries }: RequestConfig) => {
   const { ObservableSet, ObservableGet } = useObservable();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const [error, setError] = useState<any>(null);

   // 🔹 Peticiones GET simultáneas (index, selectIndex, etc.)
   const queryKeys = queries ? Object.keys(queries) : ["index"];
   const queryArray = queryKeys.map((subKey) => ({
      queryKey: [`${key}/${subKey}`],
      queryFn: async () => {
         setIsLoading(true);
         setOpenDialog(true);
         const [err, res] = await to(Axios.get(`${baseUrl}${queries?.[subKey] || ""}`));
         setIsLoading(false);
         setOpenDialog(false);

         if (err) {
            const message = err.response?.data?.message || `Ocurrió un error en ${key}/${subKey}.`;
            Toast.Error(message);
            setError(err);
            throw err;
         }

         const data = res?.data?.data || [];
         await ObservableSet(`${key}_${subKey}`, data);
         return data;
      },
      refetchOnWindowFocus: false
   }));

   const queriesResult = useQueries({ queries: queryArray });

   // 🔹 CRUD helpers
   const createOrUpdate = async (data: any) => {
      setIsLoading(true);
      const id = data.id ? `/${data.id}` : "";
      const [err, res] = await to(Axios.post(`${baseUrl}/createOrUpdate${id}`, data));
      setIsLoading(false);

      if (err) {
         Toast.Error(err.response?.data?.message || `Error al guardar ${key}`);
         throw err;
      }

      Toast.Success(`${key} guardado correctamente`);
      await refetchAll();
      return res.data.data;
   };

   const remove = async (id: number) => {
      setIsLoading(true);
      const [err, res] = await to(Axios.get(`${baseUrl}/delete/${id}`));
      setIsLoading(false);

      if (err) {
         Toast.Error(err.response?.data?.message || `Error al eliminar ${key}`);
         throw err;
      }

      Toast.Success(`${key} eliminado correctamente`);
      await refetchAll();
      return res.data.data;
   };

   const getOne = async (id: number) => {
      setIsLoading(true);
      const [err, res] = await to(Axios.get(`${baseUrl}/id/${id}`));
      setIsLoading(false);

      if (err) {
         Toast.Error(err.response?.data?.message || `Error al obtener ${key}`);
         throw err;
      }

      const data = res.data.data;
      await ObservableSet(`${key}_one`, data);
      return data;
   };

   const refetchAll = async () => {
      await Promise.all(queriesResult.map((q) => q.refetch?.()));
   };

   return {
      error,
      refetchAll,
      createOrUpdate,
      remove,
      getOne,
      queriesResult,
      // acceso rápido por key
      get: (subKey: string) => ObservableGet(`${key}_${subKey}`)
   };
};
