import { useEffect, useState } from "react";
import Toast from "../utils/Toast";
import { useGlobalContext } from "../context/GlobalContext";

/**
 *
 * @param {*} fn Pasar la peticion a ejectutar (service)
 * @param {*} setDataStore Funcion Set par asignar aqui mismo el resultado
 * @param {true | false} autoFetch Indiica si la petición se iniciara al montar el componente
 * @returns
 */
const useFetch = (fn, setDataStore = null, autoFetch = true) => {
   const { isLoading, setIsLoading } = useGlobalContext();

   const [res, setRes] = useState({});
   const [data, setData] = useState([]);
   // const [isLoading, setIsLoading] = useState(true);

   const fetchData = async () => {
      setIsLoading(true);
      try {
         const response = await fn();
         if (!response) return setIsLoading(false);
         // if (response.alert_text) Toast.Success(response.alert_text);
         setRes(response);
         setData(response.result);
         // console.log("🚀 ~ fetchData ~ response.result:", response.result);
         if (setDataStore) setDataStore(response.result);
      } catch (error) {
         console.log("🚀 ~ fetchData ~ error:", error);
         Toast.Error(error.message);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      if (autoFetch) fetchData();
   }, []);

   const refetch = () => fetchData();

   return { data, res, isLoadingFetch: isLoading, refetch };
};

export default useFetch;
