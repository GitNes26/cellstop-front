import Grid from "@mui/material/Grid";
import MenuForm from "./Form";
import { useCallback, useEffect } from "react";
import MenuDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import { useMenuContext } from "../../../../context/MenuContext";
import { Typography } from "@mui/material";
import * as menuServices from "../../../../services/menuServices";
import useObservable from "../../../../hooks/useObservable";
import useFetchObservable from "./../../../../hooks/useFetchObservable";

const MenusView = ({}) => {
   // const { ObservableSet } = useObservable();

   // const { pluralName, setMenusSelect, setHeadersMenus, getAllMenus, getHeadersMenusSelect, getSelectMenusToRoles } = useMenuContext();

   // useFetch(getAllMenus);

   // // useFetch(getAllMenus, setMenusSelect);
   // useFetch(getSelectMenusToRoles);
   // useFetch(getHeadersMenusSelect);

   // const { allMenus, error, refetch } = menuServices.GetAllMenus();
   // console.log("🚀 ~ MenusView ~ allMenus:", allMenus);
   const pluralName = menuServices.pluralName;
   const { data: allMenus, res, error, refetch } = useFetchObservable("Menu.all", menuServices.GetAllMenus, true);
   useFetchObservable("Menu.select", menuServices.GetSelectMenusToRoles, false);
   useFetchObservable("Menu.headers", menuServices.GetHeadersMenusSelect, false);

   // useEffect(() => {}, []);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ mb: 3 }}>
               <MenuForm />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 9 }} sx={{ mb: 3 }}>
               <MenuDT refetch={refetch} />
            </Grid>
         </Grid>
      </>
   );
};

export default MenusView;
