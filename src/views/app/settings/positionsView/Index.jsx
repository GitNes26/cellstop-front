import PositionForm from "./Form";
import { useEffect } from "react";
import PositionDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import { usePositionContext } from "../../../../context/PositionContext";
import { Typography } from "@mui/material";
import { useGlobalContext } from "../../../../context/GlobalContext";

const PositionsView = ({}) => {
   const { openDialog, setOpenDialog } = useGlobalContext();
   const { pluralName, allPositions, setAllPositions, getAllPositions } = usePositionContext();

   // CARGA DE LISTADOS
   useFetch(getAllPositions, setAllPositions);

   useEffect(() => {}, [allPositions]);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <PositionDT />
         <PositionForm container="drawer" refreshSelect={getAllPositions} openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </>
   );
};

export default PositionsView;
