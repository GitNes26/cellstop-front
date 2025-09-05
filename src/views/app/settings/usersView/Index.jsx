import UserForm from "./Form";
import { useEffect } from "react";
import UserDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useUserContext } from "../../../../context/UserContext";
import { Typography } from "@mui/material";

const UsersView = ({}) => {
   // const { auth } = useAuthContext();
   const { openDialog, setOpenDialog } = useGlobalContext();
   const { pluralName, allUsers, setAllUsers, getAllUsers } = useUserContext();
   useFetch(getAllUsers, setAllUsers);

   useEffect(() => {
      // console.log("🚀 Index ~ useEffect ~ allUsers:", allUsers);
      // (async () => {
      //    await handleGetHeadersUsers();
      //    await handleGetAllUsers();
      // })();
      // if(allUsers.length>0){
      //    const eventSource = new EventSource(API_EVENTS);
      // eventSource.onmessage = (event) => {
      //    try {
      //       const parsedData = JSON.parse(event.data);
      //       console.log("Evento recibido:", parsedData);
      //       if(parsedData.message){
      //          setData(parsedData);
      //          setDataNotification(parsedData);
      //       }
      //       else{
      //          console.log("no existe mensaje")
      //       }
      //    } catch (err) {
      //       console.error("Error parsing SSE data:", err);
      //       setError("Error parsing data from server");
      //    } finally {
      //       setIsLoading(false);
      //    }
      // };
      // eventSource.onerror = (error) => {
      //    console.error("Error en SSE:", error);
      //    setError("Connection error");
      //    setIsLoading(false);
      //    eventSource.close();
      // }
      // }
   }, [allUsers]);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <UserDT />
         <UserForm container="drawer" refreshSelect={getAllUsers} openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </>
   );
};

export default UsersView;
