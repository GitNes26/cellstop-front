import React, { useCallback, useEffect } from "react";
import { Button, ButtonGroup, Tooltip } from "@mui/material";

import Toast from "../../../../utils/Toast";
import icons from "../../../../constant/icons";
import { DataTable, Toggle, Typography } from "../../../../components/basics";
import { formatDatetime } from "../../../../utils/Formats";
import { QuestionAlertConfig } from "../../../../utils/sAlert";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuthContext } from "../../../../context/AuthContext";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext";
import { useReceiptContext } from "../../../../context/ReceiptContext";
import { getCommunityById } from "../../../../components/forms/CommunityInputs";

const ReceiptDT = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog, setOpenDialogRegister } = useGlobalContext();
   const { singularName, setReceipt, allReceipts, setFormTitle, setTextBtnSubmit, formikRef, setIsEdit, deleteReceipt, disEnableReceipt, getAllReceipts, getReceipt } =
      useReceiptContext();
   const mySwal = withReactContent(Swal);

   //#region COLUMNAS
   const fontSizeTable = { text: "sm", subtext: "xs" };
   const globalFilterFields = ["receipt.num_folio", "folio", "requester.full_name", "active", "created_at"];

   // #region BodysTemplate
   const NumFolioTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text} className="font-black">
         {obj.receipt.num_folio}
      </Typography>
   );
   const FolioTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.folio}
      </Typography>
   );
   const RequesterTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.requester.full_name}
      </Typography>
   );
   const RegisterTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.register.username}
      </Typography>
   );

   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"} className="flex justify-center">
         {obj.active ? <icons.Tb.TbCircleCheckFilled style={{ color: "green" }} size={32} /> : <icons.Tb.TbCircleXFilled style={{ color: "red" }} size={32} />}
      </Typography>
   );
   const CreatedAtBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {formatDatetime(obj.created_at, true)}
      </Typography>
   );
   // #endregion BodysTemplate

   const columns = [
      { field: "receipt.num_folio", header: "# Folio", sortable: true, functionEdit: null, body: NumFolioTemplate, filter: true, filterField: null },
      { field: "folio", header: "Folio Solicitud", sortable: true, functionEdit: null, body: FolioTemplate, filter: true, filterField: null },
      { field: "requester.full_name", header: "Solicitante", sortable: true, functionEdit: null, body: RequesterTemplate, filter: true, filterField: null },
      { field: "register.username", header: "Registrado Por", sortable: true, functionEdit: null, body: RegisterTemplate, filter: true, filterField: null }
   ];
   auth.role_id === ROLE_SUPER_ADMIN &&
      columns.push(
         { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filter: false, filterField: null },
         { field: "created_at", header: "Fecha de alta", sortable: true, functionEdit: null, body: CreatedAtBodyTemplate, filter: false, filterField: null }
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

   const handleClickView = async (obj) => {
      // console.log("🚀 ~ handleClickView ~ obj:", obj);
      try {
         setIsLoading(true);
         // const res = await getRegister(id);
         // console.log("🚀 ~ handleClickLogout ~ res:", res);
         // if (!res) return setIsLoading(false);
         // if (res.status_code !== 200) {
         //    setIsLoading(false);
         //    return Toast.Customizable(res.alert_text, res.alert_icon);
         // }

         if (obj.description) obj.description == null && (obj.description = "");
         const community = await getCommunityById(obj.requester.community_id, obj.requester.street, obj.requester.num_ext, obj.requester.int);

         obj.community = community;
         await setReceipt(obj);
         // if (res.alert_text) Toast.Success(res.alert_text);
         setTimeout(() => {
            setOpenDialogRegister(true);
            setIsLoading(false);
         }, 1000);
      } catch (error) {
         setOpenDialog(false);
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      try {
         setIsLoading(true);
         const res = await getReceipt(id);
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

         if (res.result.receipt_description) res.result.receipt_description == null && (res.result.receipt_description = "");
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
         mySwal.fire(QuestionAlertConfig(`¿Estas seguro de eliminar el recibo de ${name}?`, "CONFIRMAR")).then(async (result) => {
            if (result.isConfirmed) {
               setIsLoading(true);
               const res = await deleteReceipt(id);
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
            const res = await disEnableReceipt(id, !active);
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

   const ButtonsAction = ({ id, name, active, obj }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={`Ver ${singularName} ${obj.folio}`} placement="top">
               <Button color="dark" onClick={() => handleClickView(obj)}>
                  {<icons.Tb.TbEye size={20} />}
               </Button>
            </Tooltip>
            {auth.permissions.update && (
               <Tooltip title={`Editar ${singularName}`} placement="top">
                  <Button color="info" onClick={() => handleClickEdit(id)}>
                     {<icons.Tb.TbEdit size={20} />}
                  </Button>
               </Tooltip>
            )}
            {/*{auth.permissions.delete && (
               <Tooltip title={`Eliminar ${singularName}`} placement="top">
                  <Button color="error" onClick={() => handleClickDelete(id, name)}>
                     <icons.Md.MdDeleteForever size={20} />
                  </Button>
               </Tooltip>
            )} */}
            {auth.role_id == ROLE_SUPER_ADMIN && (
               <Tooltip title={active ? "Desactivar" : "Reactivar"} placement="right">
                  <Button color="dark" onClick={() => handleClickDisEnable(id, name, active)} sx={{ p: 0 }}>
                     <ToggleButton Button defaultChecked={Boolean(active)} />
                  </Button>
               </Tooltip>
            )}
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         // const _data = [];
         // console.log("cargar listado", allReceipts);
         await allReceipts.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            register.actions = <ButtonsAction id={obj.id} name={obj.receipt} active={obj.active} obj={obj} />;
            // _data.push(register);
            data.push(register);
         });
         // setData(_data);
         // if (data.length > 0) setGlobalFilterFields(Object.keys(allReceipts[0]));
         // console.log("la data del formatData", globalFilterFields);
         // setIsLoading(false);
      } catch (error) {
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };
   formatData();

   useEffect(() => {
      // console.log("auth", auth);
      // (async () => {
      // await formatData();
      // setIsLoading(false);
      // })();
   }, []);

   return (
      <DataTable
         dataColumns={columns}
         data={data}
         // setData={setRequestBecas}
         globalFilterFields={globalFilterFields}
         headerFilters={true}
         btnAdd={false} //auth.permissions.create}
         handleClickAdd={handleClickAdd}
         rowEdit={false}
         refreshTable={getAllReceipts}
         btnsExport={true}
         fileNameExport="Recibos"
         scrollHeight="67vh"
         // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
         // positionBtnsToolbar="center"
         // toolbarContentCenter={toolbarContentCenter}
         // toolbarContentEnd={toolbarContentEnd}
      />
   );
};
export default ReceiptDT;
