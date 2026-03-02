import React, { useCallback, useEffect } from "react";

import Toast from "../../../../utils/Toast";
import { DataTableComponent } from "../../../../components";

import { formatDatetime, stringAvatar } from "../../../../utils/Formats";
import { QuestionAlertConfig } from "../../../../utils/sAlert";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { formatPhone } from "../../../../utils/Formats";
import { setObjImg } from "../../../../components/forms/FileInput";
import env from "../../../../constant/env";
import { useAuthContext } from "../../../../context/AuthContext";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext";
import { useSaleContext } from "../../../../context/SaleContext";
import { Avatar, Typography } from "@mui/material";
import { AlternateEmailRounded, AssignmentIndRounded, CancelRounded, CheckCircleRounded, FaxRounded, NumbersRounded, PhoneAndroidRounded } from "@mui/icons-material";

const SaleDT = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const { singularName, allSales, setFormTitle, setTextBtnSubmit, formikRef, setIsEdit, setImgAvatar, setImgFirm, deleteSale, disEnableSale, getAllSales, getSale } =
      useSaleContext();
   const mySwal = withReactContent(Swal);

   //#region COLUMNAS
   const fontSizeTable = { text: "sm", subtext: "xs" };
   const globalFilterFields = ["active", "created_at"];

   // #region BodysTemplate
   const SaleBodyTemplate = (obj) => (
      <>
         <Typography textAlign={"center"} size={fontSizeTable.text}>
            {obj.sale}
         </Typography>
      </>
   );
   const SellerBodyTemplate = (obj) => (
      <>
         <Typography textAlign={"center"} size={fontSizeTable.text} className="flex items-center justify-center">
            <AssignmentIndRounded style={{ color: "" }} fontSize={"medium"} className="mr-2" />
            {obj.seller.username ?? "Sin asignar"}
         </Typography>
      </>
   );
   const DescriptionBodyTemplate = (obj) => (
      <>
         <Typography textAlign={"center"} size={fontSizeTable.text}>
            {obj.description}
         </Typography>
      </>
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
         field: "sale",
         headerName: "Folio Venta",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <SaleBodyTemplate {...params.row} key={`sale-${params.row.id}`} />,
         filter: true,
         filterField: null
      },
      {
         field: "seller",
         headerName: "Vendedor",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <SellerBodyTemplate {...params.row} key={`seller-${params.row.id}`} />,
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
         renderCell: (params) => <DescriptionBodyTemplate {...params.row} key={`seller-${params.row.id}`} />,
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
         setImgAvatar([]);
         setImgFirm([]);
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
         const res = await getSale(id);
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
         setObjImg(res.result.avatar, setImgAvatar);
         setObjImg(res.result.img_firm, setImgFirm);
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
         mySwal.fire(QuestionAlertConfig(`¿Estas seguro de eliminar el sale #${name}?`, "CONFIRMAR")).then(async (result) => {
            if (result.isConfirmed) {
               setIsLoading(true);
               const res = await deleteSale(id);
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
            const res = await disEnableSale(id, !active);
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
         // console.log("cargar listado", allSales);
         await allSales.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            // register.actions = <ButtonsAction id={obj.id} name={obj.sale} active={obj.active} />;
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
                  handleOnClick: () => handleClickDelete(obj.id, obj.sale),
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
      <DataTableComponent
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
         refreshTable={getAllSales}
         btnsExport={true}
         fileNameExport="Sales"
         scrollHeight="67vh"
         // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
         // positionBtnsToolbar="center"
         // toolbarContentCenter={toolbarContentCenter}
         // toolbarContentEnd={toolbarContentEnd}
      />
   );
};
export default SaleDT;
