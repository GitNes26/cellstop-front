import React, { useCallback, useEffect } from "react";
import { Button, ButtonGroup, ToggleButton, Tooltip, Typography } from "@mui/material";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Toast from "../../../../utils/Toast";
import { useAuthContext } from "../../../../context/AuthContext";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext";
import { useMenuContext } from "../../../../context/MenuContext";
import { CancelRounded, CheckCircleRounded } from "@mui/icons-material";
import { formatDatetime } from "../../../../utils/Formats";
import * as MuiIcons from "@mui/icons-material";
import useObservable from "../../../../hooks/useObservable";
import { DataTableComponent } from "../../../../components";

const MenuDT = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const { singularName, setFormTitle, setTextBtnSubmit, allMenus, setIsItem, formikRef, deleteMenu, disEnableMenu, getAllMenus, getMenu } = useMenuContext();

   const mySwal = withReactContent(Swal);

   //#region COLUMNAS
   const fontSizeTable = { text: "sm", subtext: "xs" };
   const globalFilterFields = ["menu", "caption", "patern", "order", "url", "counter_name", "others_permissions", "active", "created_at"];

   // #region BodysTemplate
   const MenuBodyTemplate = (obj) => {
      // console.log("🚀 ~ MenuDT ~ params:", obj);
      // console.log("🚀 ~ MenuBodyTemplate ~ data:", data);
      // const obj = data.filter((obj) => obj.id === params.id)[0];
      // const IconComponent = MuiIcons[obj.icon];

      const renderMuiIcon = (iconName, type) => {
         if (!iconName) return type === "group" ? <MuiIcons.TokenRounded /> : <MuiIcons.BlurOnRounded />;
         const IconComponent = MuiIcons[iconName];
         return IconComponent != undefined ? <IconComponent /> : type === "group" ? <MuiIcons.TokenRounded /> : <MuiIcons.BlurOnRounded />;
      };

      return (
         <div className="flex flex-col items-center justify-center h-full">
            {renderMuiIcon(obj.icon, "icon")}
            <Typography textAlign={"center"} size={fontSizeTable.text}>
               {obj.menu}
            </Typography>
            {obj.caption && (
               <Typography textAlign={"center"} size={fontSizeTable.subtext} className="italic opacity-65">
                  {obj.caption}
               </Typography>
            )}
         </div>
      );
   };
   const InfoBodyTemplate = (obj) => (
      <>
         {obj.belongs_to > 0 ? (
            <Typography textAlign={"center"} size={fontSizeTable.text}>
               Pertence a: <b>{obj.patern ?? "-"}</b>
               <br />
               Orden: <b>{obj.order ?? "-"}</b>
               <br />
               Path: <b>{obj.url ?? "-"}</b>
               <br />
               Nombre del Contador: <b>{obj.counter_name ?? "-"}</b>
               <br />
               <span className="flex items-center justify-center text-center">
                  Solo lectura en permisos: &nbsp;
                  <span>{obj.read_only ? <CheckCircleRounded style={{ color: "green" }} /> : <CancelRounded style={{ color: "red" }} />}</span>
               </span>
            </Typography>
         ) : (
            <div className="flex flex-col items-center justify-center h-full">
               <Typography textAlign={"center"} size={fontSizeTable.subtext}>
                  <b>{"***** MENÚ PADRE *****"}</b>
               </Typography>
               <Typography textAlign={"center"} size={fontSizeTable.subtext}>
                  Orden: <b>{obj.order ?? "-"}</b>
               </Typography>
            </div>
         )}
      </>
   );
   const OthersPermissionsTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.others_permissions}
      </Typography>
   );

   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"} className="flex justify-center">
         {obj.active ? <CheckCircleRounded style={{ color: "green" }} size={32} /> : <CancelRounded style={{ color: "red" }} size={32} />}
      </Typography>
   );
   const CreatedAtBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatDatetime(obj.created_at, true)}</Typography>;

   // #endregion BodysTemplate

   //#region COLUMNAS MUI
   // const columns = [
   //    { field: "id", headerName: "ID", width: 90, ediable: false },
   //    // { field: "icon", headerName: "Icono", sortable: true, functionEdit: null, renderCell: (params) => <IconBodyTemplate {...params.row} />, filter: true, filterField: null },
   //    {
   //       field: "menu",
   //       headerName: "Menu",
   //       /* width: 90 */ sortable: true,
   //       functionEdit: null,
   //       renderCell: (params) => <MenuBodyTemplate {...params.row} key={`menu-${params.row.id}`} />,
   //       filter: true,
   //       filterField: null
   //    },
   //    {
   //       field: "level",
   //       headerName: "Info",
   //       /* width: 90 */ sortable: true,
   //       functionEdit: null,
   //       renderCell: (params) => <InfoBodyTemplate {...params.row} key={`info-${params.row.id}`} />,
   //       filter: true,
   //       filterField: null
   //    },
   //    {
   //       field: "others_permissions",
   //       headerName: "Otros Permisos" /* width: 90 */,
   //       sortable: true,
   //       functionEdit: null,
   //       renderCell: (params) => <OthersPermissionsTemplate {...params.row} key={`others-permissions-${params.row.id}`} />,
   //       filter: true,
   //       filterField: null
   //    }
   // ];
   // auth.role_id === ROLE_SUPER_ADMIN &&
   //    columns.push(
   //       {
   //          field: "active",
   //          headerName: "Activo",
   //          /* width: 90 */ sortable: true,
   //          functionEdit: null,
   //          renderCell: (params) => <ActiveBodyTemplate {...params.row} key={`active-${params.row.id}`} />,
   //          filter: false,
   //          filterField: null
   //       },
   //       {
   //          field: "created_at",
   //          headerName: "Fecha de registro",
   //          sortable: true,
   //          functionEdit: null,
   //          renderCell: (params) => <CreatedAtBodyTemplate {...params.row} key={`created-at-${params.row.id}`} />,
   //          filter: false,
   //          filterField: null
   //       }
   //    );
   //#endregion COLUMNAS MUI

   // #region COLUMNAS PRIMEREACT
   const columns = [
      { field: "id", header: "ID", sortable: true },
      { field: "menu", header: "Menu", sortable: true, filter: true, body: MenuBodyTemplate },
      { field: "level", header: "Info", sortable: true, filter: true, body: InfoBodyTemplate },
      { field: "others_permissions", header: "Otros Permisos", sortable: true, body: OthersPermissionsTemplate }
   ];

   if (auth.role_id === ROLE_SUPER_ADMIN) {
      columns.push(
         { field: "active", header: "Activo", sortable: true, body: ActiveBodyTemplate },
         { field: "created_at", header: "Fecha de registro", sortable: true, width: "120px", body: CreatedAtBodyTemplate }
      );
   }
   // #endregion COLUMNAS PRIMEREACT
   //#endregion COLUMNAS

   const handleClickAdd = () => {
      try {
         formikRef.current.resetForm();
         formikRef.current.setValues(formikRef.current.initialValues);
         // setOpenDialog(true);
         setTextBtnSubmit("AGREGAR");
         setIsItem(false);
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         // setOpenDialog(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      try {
         setIsLoading(true);
         setTextBtnSubmit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         const res = await getMenu(id);
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

         setIsItem(res.result.type == "item" ? true : false);
         if (res.result.description) res.result.description == null && (res.result.description = "");
         formikRef.current.setValues(res.result);
         if (res.alert_text) Toast.Success(res.alert_text);
         setIsLoading(false);
         // setOpenDialog(true);
      } catch (error) {
         // setOpenDialog(false);
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDisEnable = async (id, name, active) => {
      try {
         setTimeout(async () => {
            setIsLoading(true);
            const res = await disEnableMenu(id, !active);
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
         // console.log("cargar listado", allMenus);
         await allMenus.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            // register.actions = <ButtonsAction id={obj.id} name={obj.menu} active={obj.active} />;
            register.actions = [
               {
                  label: "Editar",
                  iconName: "pi-pen-to-square",
                  tooltip: "",
                  handleOnClick: () => handleClickEdit(obj.id),
                  color: "blue",
                  permission: auth.permissions.update
               }
               // { label: "Eliminar", iconName: "pi-trash", tooltip: "", handleOnClick: () => handleClickDelete(obj.id, obj.menu) }
            ];
            data.push(register);
         });
      } catch (error) {
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };
   formatData();

   useEffect(() => {}, []);

   return (
      <DataTableComponent
         columns={columns}
         data={data}
         globalFilterFields={globalFilterFields}
         headerFilters={true}
         btnAdd={auth.permissions.create}
         handleClickAdd={handleClickAdd}
         rowEdit={false}
         btnDeleteMultiple={true}
         refreshTable={getAllMenus}
         scrollHeight="64vh"
         btnsExport={true}
         fileNameExport={`Listado de ${singularName} - ${formatDatetime(new Date(), true, "DD-MM-YYYY")}`}
         singularName={singularName}
         indexColumnName={1}
         // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
         // positionBtnsToolbar="center"
         // toolbarContentCenter={toolbarContentCenter}
         // toolbarContentEnd={toolbarContentEnd}
      />
      // <DataTableComponent
      //    dataColumns={columns}
      //    data={data}
      //    // setData={setRequestBecas}
      //    // globalFilterFields={globalFilterFields}
      //    headerFilters={true}
      //    btnAdd={false}
      //    handleClickAdd={handleClickAdd}
      //    handleClickEdit={handleClickEdit}
      //    handleClickDisEnable={handleClickDisEnable}
      //    singularName={singularName}
      //    indexColumnName={2}
      //    rowEdit={false}
      //    refreshTable={getAllMenus}
      //    btnsExport={false}
      //    scrollHeight="79vh" //56vh
      //    // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
      //    // positionBtnsToolbar="center"
      //    // toolbarContentCenter={toolbarContentCenter}
      //    // toolbarContentEnd={toolbarContentEnd}
      // />
   );
};
export default MenuDT;
