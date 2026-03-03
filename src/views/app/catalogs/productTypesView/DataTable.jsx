import React, { useCallback, useEffect } from "react";
import { Typography, Button, ButtonGroup, Tooltip } from "@mui/material";

import Toast from "../../../../utils/Toast";
import { DataTableComponent } from "../../../../components";
import { formatDatetime } from "../../../../utils/Formats";
import { QuestionAlertConfig } from "../../../../utils/sAlert";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuthContext } from "../../../../context/AuthContext";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext";
import { useProductTypeContext } from "../../../../context/ProductTypeContext";
import { CancelRounded, CheckCircleRounded } from "@mui/icons-material";

const ProductTypeDT = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      allProductTypes,
      setFormTitle,
      setTextBtnSubmit,
      formikRef,
      setIsEdit,
      deleteProductType,
      disEnableProductType,
      getAllProductTypes,
      getProductType
   } = useProductTypeContext();
   const mySwal = withReactContent(Swal);

   //#region COLUMNAS
   const fontSizeTable = { text: "sm", subtext: "xs" };
   const globalFilterFields = ["product_type", "description", "active", "created_at"];

   // #region BodysTemplate
   const ProductTypeBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {rowData.product_type}
      </Typography>
   );

   const DescriptionBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {rowData.description}
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
      { field: "product_type", header: "Tipo de Producto", sortable: true, filter: true, body: ProductTypeBodyTemplate },
      { field: "description", header: "Descripción", sortable: true, filter: true, body: DescriptionBodyTemplate }
   ];

   if (auth.role_id === ROLE_SUPER_ADMIN) {
      columns.push(
         { field: "active", header: "Activo", sortable: true, body: ActiveBodyTemplate },
         { field: "created_at", width: "120px", header: "Fecha de alta", sortable: true, body: CreatedAtBodyTemplate }
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
         const res = await getProductType(id);
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

   const handleClickDelete = async (id, name) => {
      try {
         mySwal.fire(QuestionAlertConfig(`¿Estas seguro de eliminar el departamento de ${name}?`, "CONFIRMAR")).then(async (result) => {
            if (result.isConfirmed) {
               setIsLoading(true);
               const res = await deleteProductType(id);
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
            const res = await disEnableProductType(id, !active);
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
         // console.log("cargar listado", allProductTypes);
         await allProductTypes.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            // register.actions = <ButtonsAction id={obj.id} name={obj.product_type} active={obj.active} />;
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
                  label: "Eliminar",
                  iconName: "pi-trash",
                  tooltip: "",
                  handleOnClick: () => handleClickDelete(obj.id, obj.product_type),
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
         btnDeleteMultiple={false}
         refreshTable={getAllProductTypes}
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
      // <DataTableComponent
      //    dataColumns={columns}
      //    data={data}
      //    // setData={setRequestBecas}
      //    // globalFilterFields={globalFilterFields}
      //    headerFilters={true}
      //    btnAdd={auth.permissions.create}
      //    handleClickAdd={handleClickAdd}
      //    handleClickEdit={handleClickEdit}
      //    handleClickDisEnable={handleClickDisEnable}
      //    singularName={singularName}
      //    indexColumnName={1}
      //    rowEdit={false}
      //    refreshTable={getAllProductTypes}
      //    btnsExport={false}
      //    scrollHeight="67vh"
      //    // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
      //    // positionBtnsToolbar="center"
      //    // toolbarContentCenter={toolbarContentCenter}
      //    // toolbarContentEnd={toolbarContentEnd}
      // />
   );
};
export default ProductTypeDT;
