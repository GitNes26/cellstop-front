import { useEffect, useState } from "react";
import useGlobalStore from "../stores/globalStore";
import useAuthStore from "../stores/authStore";

const useSSE = (url) => {
   const auth = useAuthStore.getState().auth;
   const setIsLoading = useGlobalStore((state) => state.setIsLoading);
   const setDataNotification = useGlobalStore(
      (state) => state.setDataNotification,
   );

   const [data, setData] = useState(null);
   const [error, setError] = useState(null);
   const [open, setOpen] = useState(false);
   // const [message,setMeesage]= useState()
   useEffect(() => {
      // setIsLoading(true);

      console.log("Conectando a SSE en:", url);
      const eventSource = new EventSource(`${url}`);

      eventSource.onmessage = (event) => {
         try {
            const parsedData = JSON.parse(event.data);
            console.log("Evento recibido:", parsedData);
            if (parsedData.message) {
               setData(parsedData);
               setDataNotification(parsedData);
            } else {
               console.log("no existe mensaje");
            }
         } catch (err) {
            console.error("Error parsing SSE data:", err);
            setError("Error parsing data from server");
         } finally {
            setIsLoading(false);
         }
      };

      eventSource.onerror = (error) => {
         console.error("Error en SSE:", error);
         setError("Connection error");
         setIsLoading(false);
         eventSource.close(); // La reconexión es automática, así que se puede cerrar
      };

      // return () => {
      //    console.log("Cerrando conexión SSE");
      //    eventSource.close();
      // };
   }, [open]);

   return { data, error, open, setOpen };
};

export default useSSE;
