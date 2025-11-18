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
import { useLoteContext } from "../../../../context/LoteContext";
import { Avatar, Typography } from "@mui/material";
import { AlternateEmailRounded, AssignmentIndRounded, CancelRounded, CheckCircleRounded, FaxRounded, NumbersRounded, PhoneAndroidRounded } from "@mui/icons-material";
import dayjs from "dayjs";

const LoteDT = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const { singularName, allLotes, setFormTitle, setTextBtnSubmit, formikRef, setIsEdit, deleteLote, disEnableLote, getAllLotes, getLote } = useLoteContext();
   const mySwal = withReactContent(Swal);

   //#region COLUMNAS
   const fontSizeTable = { text: "sm", subtext: "xs" };
   const globalFilterFields = ["active", "created_at"];

   // #region BodysTemplate
   const LoteBodyTemplate = (obj) => (
      <>
         <Typography textAlign={"center"} size={fontSizeTable.text}>
            {obj.lote}
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
   const FolioBodyTemplate = (obj) => (
      <>
         <Typography textAlign={"center"} size={fontSizeTable.text} className="flex items-center justify-center">
            {obj.folio ?? 0}
         </Typography>
      </>
   );
   const QuantityBodyTemplate = (obj) => (
      <>
         <Typography textAlign={"center"} size={fontSizeTable.text} className="flex items-center justify-center">
            {obj.quantity ?? 0}
         </Typography>
      </>
   );
   const LadaBodyTemplate = (obj) => (
      <>
         <Typography textAlign={"center"} size={fontSizeTable.text} className="flex items-center justify-center">
            {obj.lada ?? "Sin lada"}
         </Typography>
      </>
   );
   const PreactivationDateBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {formatDatetime(obj.preactivation_date, false)}
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
         field: "lote",
         headerName: "Lote",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <LoteBodyTemplate {...params.row} key={`lote-${params.row.id}`} />,
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
      },
      {
         field: "folio",
         headerName: "Folio",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <FolioBodyTemplate {...params.row} key={`seller-${params.row.id}`} />,
         filter: true,
         filterField: null
      },
      {
         field: "quantity",
         headerName: "Cantidad",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <QuantityBodyTemplate {...params.row} key={`seller-${params.row.id}`} />,
         filter: true,
         filterField: null
      },
      {
         field: "lada",
         headerName: "Lada",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <LadaBodyTemplate {...params.row} key={`seller-${params.row.id}`} />,
         filter: true,
         filterField: null
      },
      {
         field: "preactivation_date",
         headerName: "Fecha de Pre-activación",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <PreactivationDateBodyTemplate {...params.row} key={`seller-${params.row.id}`} />,
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
               { label: "Editar", iconName: "Edit", tooltip: "", handleOnClick: () => handleClickEdit(obj.id), color: "blue" },
               { label: "Eliminar", iconName: "Delete", tooltip: "", handleOnClick: () => handleClickDelete(obj.id, obj.lote), color: "red" }
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
         indexColumnName={0}
         rowEdit={false}
         refreshTable={getAllLotes}
         btnsExport={true}
         fileNameExport="Lotes"
         scrollHeight="67vh"
         // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
         // positionBtnsToolbar="center"
         // toolbarContentCenter={toolbarContentCenter}
         // toolbarContentEnd={toolbarContentEnd}
      />
   );
};
export default LoteDT;
