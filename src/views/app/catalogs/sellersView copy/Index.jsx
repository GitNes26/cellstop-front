import SellerForm from "./Form";
import { useEffect } from "react";
import SellerDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import { useSellerContext } from "../../../../context/SellerContext";
import { Typography } from "@mui/material";
import { useGlobalContext } from "../../../../context/GlobalContext";

const SellersView = ({}) => {
   const { openDialog, setOpenDialog } = useGlobalContext();
   const { pluralName, allSellers, setAllSellers, getAllSellers } = useSellerContext();

   // CARGA DE LISTADOS
   useFetch(getAllSellers, setAllSellers);

   useEffect(() => {}, [allSellers]);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <SellerDT />
         <SellerForm container={"drawer"} refreshSelect={getAllSellers} openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </>
   );
};

export default SellersView;
