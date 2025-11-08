import { useEffect, useState, useCallback } from "react";
import Toast from "../utils/Toast";
import useObservable, { ObservableKeys } from "../hooks/useObservable";
import { useGlobalContext } from "../context/GlobalContext";

/**
 * Hook avanzado para consumir servicios + observables
 * @param {string} key Identificador único del observable (ej. "menus/all")
 * @param {Function} serviceFn Función asíncrona que ejecuta la petición (debe retornar la respuesta)
 * @param {boolean} autoFetch Indica si se ejecuta automáticamente al montar
 */

const useFetchObservable = (key: ObservableKeys, serviceFn: () => Promise<any>, autoFetch: boolean = true) => {
   const { setIsLoading } = useGlobalContext();
   const { ObservableGet, ObservableSet } = useObservable();

   const [data, setData] = useState([]);
   const [res, setRes] = useState(null);
   const [error, setError] = useState(null);

   const fetchData = useCallback(async () => {
      setIsLoading(true);
      try {
         const response = await serviceFn();
         if (!response) return;
         setRes(response);
         setData(response.result);
         ObservableSet(key, response.result); // 🔹 Guardamos en el observable
      } catch (err: any) {
         console.error("🚀 ~ useFetchObservable error:", err);
         Toast.Error(err.message || "Error al obtener los datos");
         setError(err);
      } finally {
         setIsLoading(false);
      }
   }, [serviceFn, key]); // ✅ Memoizamos el callback

   useEffect(() => {
      if (autoFetch) fetchData(); // ✅ Solo una vez al montar
   }, [autoFetch, fetchData]);

   const refetch = useCallback(() => {
      fetchData();
   }, [fetchData]);

   const observableData = ObservableGet(key); // 🔹 Permite obtener la data en otros componentes

   return { data: observableData || data, res, error, refetch };
};

export default useFetchObservable;

// import { useEffect, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useGlobalContext } from "../context/GlobalContext";
// import useObservable from "../hooks/useObservable";
// import Toast from "../utils/Toast";
// import to from "await-to-js";

// /**
//  * Hook para manejar peticiones con observables, loaders y refetch.
//  * @param {Function} fn - Servicio a ejecutar (async).
//  * @param {String} key - Nombre del observable a actualizar.
//  * @param {Boolean} autoFetch - Si la petición debe ejecutarse automáticamente.
//  *
//  * Hook avanzado para consumir servicios con react-query + observables
//  *
//  * ✅ Soporta Axios y AxiosFile (detección automática)
//  * ✅ Sincroniza con Observables globales
//  * ✅ Permite refetch manual
//  * ✅ Integra setIsLoading global
//  * ✅ Muestra errores con Toast
//  */
// export default function useFetchObservable<T = any>(queryKey: string, serviceFn: () => Promise<any>, observableKey: string, autoFetch: boolean = true) {
//    const { ObservableSet } = useObservable();
//    const { setIsLoading } = useGlobalContext();

//    // const [data, setData] = useState([]);
//    const [res, setRes] = useState(null);

//    const { data, error, isFetching, refetch, isError, isSuccess } = useQuery({
//       queryKey: [queryKey],
//       queryFn: async () => {
//          setIsLoading(true);

//          const [err, response] = await to(serviceFn());
//          if (err) {
//             console.error(`❌ Error en ${queryKey}:`, err);
//             const message = err.response?.data?.message || err.message || "Ocurrió un error al obtener la información.";
//             Toast?.Error?.(message);
//             throw err;
//          }
//          // OPCION 2
//          // const response = await serviceFn();
//          // if (!response) return;
//          // setRes(response);
//          // setData(response.result ?? response);
//          // ObservableSet(key, response.result ?? response);

//          const result = response?.data?.data?.result ?? response?.result ?? response;
//          setRes(response?.data?.data ?? response);
//          ObservableSet(observableKey, result);

//          return result as T;
//       },
//       refetchOnWindowFocus: false,
//       enabled: autoFetch
//    });

//    useEffect(() => {
//       setIsLoading(isFetching);
//    }, [isFetching]);

//    return {
//       data,
//       res,
//       error,
//       isFetching,
//       refetch,
//       isError,
//       isSuccess
//    };
// }
