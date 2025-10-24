import Grid from "@mui/material/Grid";
import MenuForm from "./Form";
import { useCallback, useEffect } from "react";
import MenuDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import { useMenuContext } from "../../../../context/MenuContext";
import { Typography } from "@mui/material";
import * as menuServices from "../../../../services/menuServices";
import { useQueries } from "@tanstack/react-query";
import useObservable from "../../../../hooks/useObservable";

const MenusView = ({}) => {
   const { ObservableSet } = useObservable();
   const [menus] = useQueries({
      queries: [
         {
            queryKey: ["menus/index"],
            queryFn: () => Axios.get("/menus"),
            refetchOnWindowFocus: true
         }
      ]
   });

   const { pluralName, setAllMenus, setMenusSelect, setHeadersMenus, allMenus, getAllMenus, getHeadersMenusSelect, getSelectMenusToRoles } = useMenuContext();

   useFetch(getAllMenus);

   // useFetch(getAllMenus, setMenusSelect);
   useFetch(getSelectMenusToRoles);
   useFetch(getHeadersMenusSelect);

   menuServices.GetAllMenus();
   // useEffect(() => {
   //    if (menus.isSuccess) {
   //       ObservableSet("AllMenus", menus.data?.data || []);
   //    }
   //    // useObservable().ObservableSet("AllMenus", menus.data?.data || []).finally(() => {{
   //    //    console.log("🚀 ~ MenusView ~ useEffect ~ menus.data:", menus.data);
   //    // }});
   // }, [menus.isSuccess]);

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
               <MenuDT />
            </Grid>
         </Grid>
      </>
   );
};

export default MenusView;
