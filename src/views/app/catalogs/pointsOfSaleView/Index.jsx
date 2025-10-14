import PointOfSaleForm from "./Form";
import { useEffect } from "react";
import PointOfSaleDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import { usePointOfSaleContext } from "../../../../context/PointOfSaleContext";
import { Typography } from "@mui/material";
import { useGlobalContext } from "../../../../context/GlobalContext";

const PointsOfSaleView = ({}) => {
   const { openDialog, setOpenDialog } = useGlobalContext();
   const { pluralName, allPointsOfSale, setAllPointsOfSale, getAllPointsOfSale } = usePointOfSaleContext();

   // CARGA DE LISTADOS
   useFetch(getAllPointsOfSale, setAllPointsOfSale);

   useEffect(() => {}, [allPointsOfSale]);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <PointOfSaleDT />
         <PointOfSaleForm container="drawer" refreshSelect={getAllPointsOfSale} openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </>
   );
};

export default PointsOfSaleView;
