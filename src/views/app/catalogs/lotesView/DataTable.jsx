import React, { useCallback, useEffect, useState } from "react";

import Toast from "../../../../utils/Toast";
import { DataTableComponent } from "../../../../components";

import { formatDatetime, includesInArray, stringAvatar } from "../../../../utils/Formats";
import { QuestionAlertConfig } from "../../../../utils/sAlert";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { formatPhone } from "../../../../utils/Formats";
import { setObjImg } from "../../../../components/forms/FileInput";
import env from "../../../../constant/env";
import { useAuthContext } from "../../../../context/AuthContext";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext";
import { useLoteContext } from "../../../../context/LoteContext";
import { Avatar, Typography } from "@mui/material";
import { AlternateEmailRounded, AssignmentIndRounded, CancelRounded, CheckCircleRounded, FaxRounded, NumbersRounded, PhoneAndroidRounded } from "@mui/icons-material";
import dayjs from "dayjs";
import { TemplateExport } from "./TemplateExport";
import { useProductContext } from "../../../../context/ProductContext";

const PLANTILLA_PATH = "/plantillas/plantillas_impresion_chip.xlsx";

const LoteDT = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const { singularName, allLotes, setFormTitle, setTextBtnSubmit, formikRef, setIsEdit, deleteLote, disEnableLote, getAllLotes, getLote } = useLoteContext();
   const { allProducts, getAllProducts } = useProductContext();
   const mySwal = withReactContent(Swal);
   const [openDialogTemplateExport, setopenDialogTemplateExport] = useState(false);

   //#region COLUMNAS
   const fontSizeTable = { text: "sm", subtext: "xs" };
   const globalFilterFields = ["lote", "seller.username", "description", "folio", "quantity", "preactivation_date", "active", "created_at"];

   // #region BodysTemplate
   const LoteBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {rowData.lote}
      </Typography>
   );

   const SellerBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text} className="flex items-center justify-center">
         <AssignmentIndRounded fontSize="medium" className="mr-2" />
         {rowData?.seller?.username ?? "Sin asignar"}
      </Typography>
   );

   const DescriptionBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {rowData.description}
      </Typography>
   );

   const FolioBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text} className="flex items-center justify-center">
         {rowData.folio ?? 0}
      </Typography>
   );

   const QuantityBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text} className="flex items-center justify-center">
         {rowData.quantity ?? 0}
      </Typography>
   );

   const LadaBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text} className="flex items-center justify-center">
         {rowData.lada ?? "Sin lada"}
      </Typography>
   );

   const PreactivationDateBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {formatDatetime(rowData.preactivation_date, false)}
      </Typography>
   );

   const ActiveBodyTemplate = (rowData) => (
      <Typography textAlign="center" className="flex justify-center">
         {rowData.active ? <CheckCircleRounded style={{ color: "green" }} fontSize="medium" /> : <CancelRounded style={{ color: "red" }} fontSize="medium" />}
      </Typography>
   );

   const CreatedAtBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {formatDatetime(rowData.created_at, true)}
      </Typography>
   );
   // #endregion BodysTemplate

   const columns = [
      { field: "lote", header: "Lote", sortable: true, filter: true, body: LoteBodyTemplate },
      { field: "seller.username", header: "Vendedor", sortable: true, filter: true, body: SellerBodyTemplate },
      { field: "description", header: "Descripción", sortable: true, filter: true, body: DescriptionBodyTemplate },
      { field: "folio", header: "Folio", sortable: true, filter: true, body: FolioBodyTemplate },
      { field: "quantity", header: "Cantidad", sortable: true, filter: true, body: QuantityBodyTemplate },
      { field: "lada", header: "Lada", sortable: true, filter: true, body: LadaBodyTemplate },
      { field: "preactivation_date", header: "Fecha de Pre-activación", sortable: true, filter: true, body: PreactivationDateBodyTemplate }
   ];

   if (auth.role_id === ROLE_SUPER_ADMIN) {
      columns.push(
         { field: "active", header: "Activo", sortable: true, body: ActiveBodyTemplate },
         { field: "created_at", header: "Fecha de alta", sortable: true, width: "120px", body: CreatedAtBodyTemplate }
      );
   }
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
         const res = await getLote(id);
         res.result.preactivation_date = dayjs(res.result.preactivation_date).format("YYYY-MM-DD");
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

         // if (res.result.description) res.result.description == null && (res.result.description = "");
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

   const handleClickTemplateExport = async (obj) => {
      try {
         setIsLoading(true);
         // if (formikRef.current === null) setopenDialogTemplateExport(true);
         const filters = { folio: obj.folio };
         const res = await getAllProducts(filters);
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

         // if (res.result.description) res.result.description == null && (res.result.description = "");
         if (res.alert_text) Toast.Success(res.alert_text);
         setIsLoading(false);
         setopenDialogTemplateExport(true);
      } catch (error) {
         setopenDialogTemplateExport(false);
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (id, name) => {
      try {
         mySwal.fire(QuestionAlertConfig(`¿Estas seguro de eliminar el lote #${name}?`, "CONFIRMAR")).then(async (result) => {
            if (result.isConfirmed) {
               setIsLoading(true);
               const res = await deleteLote(id);
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
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDisEnable = async (id, name, active) => {
      try {
         setTimeout(async () => {
            setIsLoading(true);
            const res = await disEnableLote(id, !active);
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

   async function formatData() {
      try {
         // console.log("cargar listado", allLotes);
         await allLotes.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            // register.actions = <ButtonsAction id={obj.id} name={obj.lote} active={obj.active} />;
            register.actions = [
               {
                  label: "Editar",
                  iconName: "pi-pen-to-square",
                  tooltip: "",
                  handleOnClick: () => handleClickEdit(obj.id),
                  color: "blue",
                  permission: auth.permissions.update
               },
               {
                  label: "Exportar Plantilla",
                  iconName: "pi-download",
                  tooltip: "",
                  handleOnClick: () => handleClickTemplateExport(obj),
                  color: "primary",
                  permission: includesInArray(auth.permissions.more_permissions, ["todas", "Exportar Plantilla"])
               },
               {
                  label: "Eliminar",
                  iconName: "pi-trash",
                  tooltip: "",
                  handleOnClick: () => handleClickDelete(obj.id, obj.lote),
                  color: "red",
                  permission: auth.permissions.delete
               }
            ];
            data.push(register);
         });
      } catch (error) {
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   }
   formatData();
   useEffect(() => {}, []);

   return (
      <>
         <TemplateExport open={openDialogTemplateExport} onClose={() => setopenDialogTemplateExport(false)} plantillaUrl={PLANTILLA_PATH} data={allProducts} />

         <DataTableComponent
            columns={columns}
            data={data}
            globalFilterFields={globalFilterFields}
            headerFilters={true}
            btnAdd={auth.permissions.create}
            handleClickAdd={handleClickAdd}
            rowEdit={false}
            btnDeleteMultiple={false}
            refreshTable={getAllLotes}
            scrollHeight="64vh"
            btnsExport={true}
            fileNameExport={`Listado de ${singularName} - ${formatDatetime(new Date(), true, "DD-MM-YYYY")}`}
            singularName={singularName}
            indexColumnName={0}
            // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
            // positionBtnsToolbar="center"
            // toolbarContentCenter={toolbarContentCenter}
            // toolbarContentEnd={toolbarContentEnd}
         />
         {/* <DataTableComponent
            dataColumns={columns}
            data={data}
            // setData={setRequestBecas}
            // globalFilterFields={globalFilterFields}
            headerFilters={true}
            btnAdd={auth.permissions.create}
            handleClickAdd={handleClickAdd}
            handleClickEdit={handleClickEdit}
            handleClickDisEnable={handleClickDisEnable}
            singularName={singularName}
            indexColumnName={1}
            rowEdit={false}
            refreshTable={getAllLotes}
            btnsExport={true}
            fileNameExport="Lotes"
            scrollHeight="67vh"
            // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
            // positionBtnsToolbar="center"
            // toolbarContentCenter={toolbarContentCenter}
            // toolbarContentEnd={toolbarContentEnd}
         /> */}
      </>
   );
};
export default LoteDT;
