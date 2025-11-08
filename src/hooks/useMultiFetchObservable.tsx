import { useQueries } from "@tanstack/react-query";
import { useGlobalContext } from "../context/GlobalContext";
import useObservable from "../hooks/useObservable";
import Toast from "../utils/Toast";
import to from "await-to-js";
import { useEffect } from "react";

interface FetchItem {
   key: string;
   fn: () => Promise<any>;
   observable: string;
}

/**
 * Hook para ejecutar múltiples peticiones simultáneamente y sincronizar sus observables
 * @param {FetchItem[]} requests Arreglo de objetos con key, fn y observable
 */
export default function useMultiFetchObservable(requests: FetchItem[]) {
   const { ObservableSet } = useObservable();
   const { setIsLoading } = useGlobalContext();

   const results = useQueries({
      queries: requests.map((r) => ({
         queryKey: [r.key],
         queryFn: async () => {
            setIsLoading(true);
            const [err, response] = await to(r.fn());
            if (err) {
               console.error(`❌ Error en ${r.key}:`, err);
               Toast.Error(err.response?.data?.message || err.message);
               throw err;
            }
            const result = response?.data?.data ?? response?.result ?? response;
            ObservableSet(r.observable, result);
            return result;
         },
         refetchOnWindowFocus: false
      }))
   });

   const isFetching = results.some((r) => r.isFetching);
   const refetchAll = () => results.forEach((r) => r.refetch());

   useEffect(() => {
      setIsLoading(isFetching);
   }, [isFetching]);

   return {
      results,
      isFetching,
      refetchAll
   };
}
