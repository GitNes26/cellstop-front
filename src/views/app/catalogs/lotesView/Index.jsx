import { useEffect } from "react";
import LoteDT from "./DataTable";
import LoteForm from "./Form";
import useFetch from "../../../../hooks/useFetch";
import { useLoteContext } from "../../../../context/LoteContext";
import { Typography } from "@mui/material";
import { useGlobalContext } from "../../../../context/GlobalContext";

const LotesView = ({}) => {
   const { openDialog, setOpenDialog } = useGlobalContext();
   const { pluralName, allLotes, setAllLotes, getAllLotes } = useLoteContext();

   // CARGA DE LISTADOS
   useFetch(getAllLotes, setAllLotes);

   useEffect(() => {}, [allLotes]);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <LoteDT />
         <LoteForm container={"drawer"} refreshSelect={getAllLotes} openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </>
   );
};

export default LotesView;
