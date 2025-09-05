import { useCallback, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import RoleForm from "./Form";
import RoleDT from "./DataTable";
import useFetch from "../../../../hooks/useFetch";
import HeaderForm from "./HeaderForm";
import MenuCards from "./MenuCards";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useRoleContext } from "../../../../context/RoleContext";
import { useMenuContext } from "../../../../context/MenuContext";
import { Typography } from "@mui/material";

const RolesView = ({}) => {
   const { openDialog, setOpenDialog } = useGlobalContext();
   const { pluralName, allRoles, setAllRoles, setRolesSelect, getAllRoles, getSelectIndexRoles } = useRoleContext();
   const { setMenusSelect, allMenus, setAllMenus, getMenusByRole, getSelectMenusToRoles } = useMenuContext();

   const [openDialogTable, setOpenDialogTable] = useState(false);
   const [loadPermissions, setLoadPermissions] = useState(false);

   useFetch(getAllRoles, setAllRoles);
   useFetch(getMenusByRole, setAllMenus);

   useEffect(() => {
      // console.log("🚀 Index ~ useEffect ~ allRoles:", allRoles);
      // (async () => {
      // })();
   }, [allRoles, allMenus]);

   return (
      <>
         <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
            {pluralName.toUpperCase()} Y PERMISOS
         </Typography>
         <Grid container>
            <Grid size={{ md: 12 }}>
               <HeaderForm setOpenDialogTable={setOpenDialogTable} setLoadPermissions={setLoadPermissions} />
            </Grid>
            <Grid size={{ md: 12 }}>
               <MenuCards loadPermissions={loadPermissions} setLoadPermissions={setLoadPermissions} />
            </Grid>
         </Grid>
         <RoleDT openDialogTable={openDialogTable} setOpenDialogTable={setOpenDialogTable} />
         <RoleForm openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </>
   );
};

export default RolesView;
