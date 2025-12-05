// views/VisitsView/index.tsx
import { useEffect } from "react";
import VisitDT from "./DataTable";
import VisitForm from "./Form";
import useFetch from "../../../../hooks/useFetch";
import { useVisitContext } from "../../../../context/VisitContext";
import { Typography } from "@mui/material";
import { useGlobalContext } from "../../../../context/GlobalContext";

const VisitsView = ({}) => {
   const { openDialog, setOpenDialog } = useGlobalContext();
   const { pluralName, allVisits, setAllVisits, getAllVisits } = useVisitContext();

   // CARGA DE LISTADOS
   useFetch(getAllVisits, setAllVisits);

   useEffect(() => {}, [allVisits]);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <VisitDT />
         <VisitForm container={"modal"} refreshSelect={getAllVisits} openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </>
   );
};

export default VisitsView;
