import ProductForm from "./Form";
import { useEffect } from "react";
import ProductDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import { useProductContext } from "../../../../context/ProductContext";
import { Typography } from "@mui/material";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useParams } from "react-router-dom";

const ProductsView = ({}) => {
   const { status } = useParams();
   console.log("🚀 ~ ProductsView ~ status:", status);
   const { openDialog, setOpenDialog } = useGlobalContext();
   const { pluralName, allProducts, setAllProducts, getAllProducts } = useProductContext();

   // CARGA DE LISTADOS
   useFetch(getAllProducts, setAllProducts);

   useEffect(() => {
      if (status === "en-stock") setAllProducts(allProducts.filter((product) => product.location_status === "Stock"));
      else if (status === "asignados") setAllProducts(allProducts.filter((product) => product.location_status === "Asignado"));
   }, [/* allProducts */ status]);

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
