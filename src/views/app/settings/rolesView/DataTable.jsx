import React, { useCallback, useEffect } from "react";
import { Typography, Button, ButtonGroup, Tooltip, Drawer, Switch, Grid } from "@mui/material";

import Toast from "../../../../utils/Toast";
import { formatDatetime } from "../../../../utils/Formats";
import { useAuthContext } from "../../../../context/AuthContext";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext";
import { useRoleContext } from "../../../../context/RoleContext";
import { DataTableComponent } from "../../../../components";
import { CancelRounded, CheckCircleRounded } from "@mui/icons-material";

const RoleDT = ({ openDialogTable, setOpenDialogTable }) => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const { singularName, allRoles, setFormTitle, setTextBtnSubmit, formikRef, setIsEdit, disEnableRole, getAllRoles, getRole } = useRoleContext();

   //#region COLUMNAS
   const fontSizeTable = { text: "sm", subtext: "xs" };
   const globalFilterFields = ["role", "description", "page_index", "active", "created_at"];

   // #region BodysTemplate
   const RoleBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.role}
      </Typography>
   );
   const EmailBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.description}
      </Typography>
   );
   const PageIndexTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.page_index}
      </Typography>
   );

   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"} className="flex justify-center">
         {obj.active ? <CheckCircleRounded style={{ color: "green" }} fontSize={"medium"} /> : <CancelRounded style={{ color: "red" }} fontSize={"medium"} />}
      </Typography>
   );
   const CreatedAtBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {formatDatetime(obj.created_at, true)}
      </Typography>
   );
   // #endregion BodysTemplate

   const columns = [
      {
         field: "role",
         headerName: "Rol",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <RoleBodyTemplate {...params.row} key={`role-${params.row.id}`} />,
         filter: true,
         filterField: null
      },
      {
         field: "description",
         headerName: "Descripción",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <EmailBodyTemplate {...params.row} key={`email-${params.row.id}`} />,
         filter: true,
         filterField: null
      },
      {
         field: "page_index",
         headerName: "Página Principal",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <PageIndexTemplate {...params.row} key={`page_index-${params.row.id}`} />,
         filter: true,
         filterField: null
      }
   ];
   auth.role_id === ROLE_SUPER_ADMIN &&
      columns.push(
         {
            field: "active",
            headerName: "Activo",
            description: "",
            // width: 90,
            sortable: true,
            functionEdit: null,
            renderCell: (params) => <ActiveBodyTemplate {...params.row} key={`active-${params.row.id}`} />,
            filter: false,
            filterField: null
         },
         {
            field: "created_at",
            headerName: "Fecha de alta",
            description: "",
            // width: 90,
            sortable: true,
            functionEdit: null,
            renderCell: (params) => <CreatedAtBodyTemplate {...params.row} key={`created_at-${params.row.id}`} />,
            filter: false,
            filterField: null
         }
      );
   //#endregion COLUMNAS

   const handleClickAdd = () => {
      try {
         if (formikRef.current === null) setOpenDialog(true);
         formikRef?.current?.resetForm();
         formikRef?.current?.setValues(formikRef.current.initialValues);
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         setTextBtnSubmit("AGREGAR");
         setIsEdit(false);
         setOpenDialog(true);
      } catch (error) {
         setOpenDialog(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      try {
         setIsLoading(true);
         if (formikRef.current === null) setOpenDialog(true);
         const res = await getRole(id);
         // console.log("🚀 ~ handleClickLogout ~ res:", res);
         if (!res) return setIsLoading(false);
         if (res.errors) {
            setIsLoading(false);
            Object.values(res.errors).forEach((errors) => {
               errors.map((error) => Toast.Warning(error));
            });
            return;
         } else if (res.status_code !== 200) {
            setIsLoading(false);
            return Toast.Customizable(res.alert_text, res.alert_icon);
         }

         if (res.result.description) res.result.description == null && (res.result.description = "");
         formikRef?.current.setValues(res.result);
         if (res.alert_text) Toast.Success(res.alert_text);
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         setTextBtnSubmit("GUARDAR");
         setIsEdit(true);
         setIsLoading(false);
         setOpenDialog(true);
      } catch (error) {
         setOpenDialog(false);
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDisEnable = async (id, name, active) => {
      try {
         setTimeout(async () => {
            setIsLoading(true);
            const res = await disEnableRole(id, !active);
            // console.log('🚀 ~ handleClickLogout ~ res:', res);
            if (!res) return setIsLoading(false);
            if (res.errors) {
               setIsLoading(false);
               Object.values(res.errors).forEach((errors) => {
                  errors.map((error) => Toast.Warning(error));
               });
               return;
            } else if (res.status_code !== 200) {
               setIsLoading(false);
               return Toast.Customizable(res.alert_text, res.alert_icon);
            }

            if (res.alert_text) Toast.Customizable(res.alert_text, res.alert_icon);
            setIsLoading(false);
         }, 500);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", allRoles);
         await allRoles.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            // register.actions = <ButtonsAction id={obj.id} name={obj.role} active={obj.active} />;
            register.actions = [];
            data.push(register);
         });
      } catch (error) {
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };
   formatData();

   useEffect(() => {}, [openDialogTable]);

   return (
      <Drawer
         // sx={{ zIndex: 9999 }}
         anchor="left"
         id="drawer-table"
         open={openDialogTable}
         setOpen={setOpenDialogTable}
         onClose={() => setOpenDialogTable(false)}
         // nameDrawer="drawer-table"
         width="75%"
      >
         <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"} className="p-3 pb-5 rounded-b-xl" sx={{ backgroundColor: "primary.main" }}>
            <Typography variant="h4">{"Listado de roles".toUpperCase()}</Typography>
         </Grid>
         <DataTableComponent
            dataColumns={columns}
            data={data}
            // setData={setRequestBecas}
            // globalFilterFields={globalFilterFields}
            headerFilters={true}
            btnAdd={false}
            handleClickAdd={handleClickAdd}
            handleClickEdit={handleClickEdit}
            handleClickDisEnable={handleClickDisEnable}
            singularName={singularName}
            indexColumnName={2}
            rowEdit={false}
            refreshTable={getAllRoles}
            btnsExport={false}
            scrollHeight="91vh"
            // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
            // positionBtnsToolbar="center"
            // toolbarContentCenter={toolbarContentCenter}
            // toolbarContentEnd={toolbarContentEnd}
         />
      </Drawer>
   );
};
export default RoleDT;
