import ProductTypeForm from "./Form";
import { useEffect } from "react";
import ProductTypeDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import { useProductTypeContext } from "../../../../context/ProductTypeContext";
import { Typography } from "@mui/material";
import { useGlobalContext } from "../../../../context/GlobalContext";

const ProductTypesView = ({}) => {
   const { openDialog, setOpenDialog } = useGlobalContext();
   const { pluralName, allProductTypes, setAllProductTypes, getAllProductTypes } = useProductTypeContext();

   // CARGA DE LISTADOS
   useFetch(getAllProductTypes, setAllProductTypes);

   useEffect(() => {}, [allProductTypes]);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <ProductTypeDT />
         <ProductTypeForm container="drawer" refreshSelect={getAllProductTypes} openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </>
   );
};

export default ProductTypesView;
