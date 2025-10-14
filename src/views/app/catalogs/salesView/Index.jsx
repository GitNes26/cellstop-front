import { useEffect } from "react";
import SaleDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import { useSaleContext } from "../../../../context/SaleContext";
import { Typography } from "@mui/material";
import { useGlobalContext } from "../../../../context/GlobalContext";
import SaleForm from "./Form";

const SalesView = ({}) => {
   const { openDialog, setOpenDialog } = useGlobalContext();
   const { pluralName, allSales, setAllSales, getAllSales } = useSaleContext();

   // CARGA DE LISTADOS
   useFetch(getAllSales, setAllSales);

   useEffect(() => {}, [allSales]);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <SaleForm container="none" refreshSelect={getAllSales} openDialog={openDialog} setOpenDialog={setOpenDialog} />
         <SaleDT />
      </>
   );
};

export default SalesView;
