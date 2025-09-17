import ChipForm from "./Form";
import { useEffect } from "react";
import ChipDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import { useChipContext } from "../../../../context/ChipContext";
import { Typography } from "@mui/material";
import { useGlobalContext } from "../../../../context/GlobalContext";

const ChipsView = ({}) => {
   const { openDialog, setOpenDialog } = useGlobalContext();
   const { pluralName, allChips, setAllChips, getAllChips } = useChipContext();

   // CARGA DE LISTADOS
   useFetch(getAllChips, setAllChips);

   useEffect(() => {}, [allChips]);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <ChipDT />
         <ChipForm container={"drawer"} refreshSelect={getAllChips} openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </>
   );
};

export default ChipsView;
