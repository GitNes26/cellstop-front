import ProductForm from "./Form";
import { useEffect } from "react";
import ProductDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import { useProductContext } from "../../../../context/ProductContext";
import { Typography } from "@mui/material";
import { useGlobalContext } from "../../../../context/GlobalContext";

const ProductsView = ({}) => {
   const { openDialog, setOpenDialog } = useGlobalContext();
   const { pluralName, allProducts, setAllProducts, getAllProducts } = useProductContext();

   // CARGA DE LISTADOS
   useFetch(getAllProducts, setAllProducts);

   useEffect(() => {}, [allProducts]);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <ProductDT />
         <ProductForm container={"drawer"} refreshSelect={getAllProducts} openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </>
   );
};

export default ProductsView;
