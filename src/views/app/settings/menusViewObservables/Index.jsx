import Grid from "@mui/material/Grid";
import MenuForm from "./Form";
import { useCallback, useEffect } from "react";
import MenuDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import { useMenuContext } from "../../../../context/MenuContext";
import { Typography } from "@mui/material";
import * as Menu from "../../../../models/Menu";
import useFetchObservable from "../../../../hooks/useFetchObservable";

const MenusView = ({}) => {
   // const { ObservableSet } = useObservable();

   const pluralName = Menu.pluralName;
   const { data: allMenus, res, error, refetch } = useFetchObservable("Menu.all", Menu.GetAllMenus, true);
   useFetchObservable("Menu.select", Menu.GetSelectMenusToRoles, true);

   // useEffect(() => {}, []);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()}
         </Typography>
         <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ mb: 3 }}>
               <MenuForm refetchDataTable={refetch} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 9 }} sx={{ mb: 3 }}>
               <MenuDT refetch={refetch} />
            </Grid>
         </Grid>
      </>
   );
};

export default MenusView;
