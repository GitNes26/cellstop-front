import React, { useCallback, useEffect, useState } from "react";

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
               { label: "Editar", iconName: "Edit", tooltip: "", handleOnClick: () => handleClickEdit(obj.id), color: "blue", permission: auth.permissions.update },
               { label: "Exportar Plantilla", iconName: "GridOnRounded", tooltip: "", handleOnClick: () => handleClickTemplateExport(obj), color: "primary" },
               {
                  label: "Eliminar",
                  iconName: "Delete",
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

   const testData = [
      {
         id: 1,
         region: "3",
         celular: "8722957088",
         iccid: "8952020525331075016",
         imei: null,
         fecha: "2025-01-12",
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "80100013605358149",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:59.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 2,
         region: "3",
         celular: "8722957099",
         iccid: "8952020525331075024",
         imei: null,
         fecha: "2024-12-23",
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "590100013605713180",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:59.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 3,
         region: "3",
         celular: "8722957113",
         iccid: "8952020525331075032",
         imei: null,
         fecha: "2025-03-30",
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "770100013603506954",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:59.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 4,
         region: "3",
         celular: "8722957115",
         iccid: "8952020525331075040",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "950100013605604254",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 5,
         region: "3",
         celular: "8722957150",
         iccid: "8952020525331075057",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "100013604144683",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 6,
         region: "3",
         celular: "8722957151",
         iccid: "8952020525331075065",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "120100013603636894",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 7,
         region: "3",
         celular: "8722957190",
         iccid: "8952020525331075073",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "220100013605140410",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 8,
         region: "3",
         celular: "8722957224",
         iccid: "8952020525331075081",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "870100013605378366",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 9,
         region: "3",
         celular: "8722957271",
         iccid: "8952020525331075099",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "680100013605573291",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 10,
         region: "3",
         celular: "8722957284",
         iccid: "8952020525331075107",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "10100013604144685",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 11,
         region: "3",
         celular: "8722957287",
         iccid: "8952020525331075115",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "950100013606032092",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 12,
         region: "3",
         celular: "8722957316",
         iccid: "8952020525331075123",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "50100013597320838",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 13,
         region: "3",
         celular: "8722957333",
         iccid: "8952020525331075131",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "630100013605808160",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 14,
         region: "3",
         celular: "8722957360",
         iccid: "8952020525331075149",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "140100013603284946",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 15,
         region: "3",
         celular: "8722957376",
         iccid: "8952020525331075156",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "230100013605140415",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 16,
         region: "3",
         celular: "8722957391",
         iccid: "8952020525331075164",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "20100013604144686",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 17,
         region: "3",
         celular: "8722957403",
         iccid: "8952020525331075172",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "30100013604144687",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 18,
         region: "3",
         celular: "8722957410",
         iccid: "8952020525331075180",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "660100013605223362",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 19,
         region: "3",
         celular: "8722957420",
         iccid: "8952020525331075198",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "120100013605905149",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      },
      {
         id: 20,
         region: "3",
         celular: "8722957422",
         iccid: "8952020525331075206",
         imei: null,
         fecha: null,
         tramite: "Activación masiva",
         estatus: "Accion exitosa",
         comentario: null,
         fza_vta_prepago: "LTL001",
         fza_vta_padre: "LTL",
         usuario: "LTL001",
         folio: "12526529",
         producto: "Amigo Chip Express Sin Limite",
         num_orden: "300100013605707211",
         estatus_orden: "ready",
         motivo_error: null,
         tipo_sim: "Fisica",
         modelo: null,
         marca: null,
         color: null,
         location_status: "Stock",
         activation_status: "Pre-activado",
         product_type_id: 1,
         import_id: 1,
         active: 1,
         created_at: "2025-12-03T19:41:34.000000Z",
         updated_at: "2025-12-03T19:41:34.000000Z",
         deleted_at: null,
         product_type: {
            id: 1,
            product_type: "SIM",
            description: "Chip SIM para dispositivos móviles.",
            status: "activo",
            active: 1,
            created_at: "2025-12-03T19:39:30.000000Z",
            updated_at: null,
            deleted_at: null
         },
         import: {
            id: 1,
            name: "ListadoTramitesPrepagoGral (1).xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 39070,
            last_modified: 1761945637693,
            path: null,
            notes: null,
            uploaded_by: 1,
            active: true,
            created_at: "2025-12-03T19:41:34.000000Z",
            updated_at: "2025-12-03T19:41:34.000000Z",
            deleted_at: null,
            uploader: {
               id: 1,
               username: "sa",
               email: "sa@gmail.com",
               email_verified_at: null,
               role_id: 1,
               employee_id: null,
               active: 1,
               created_at: "2025-12-03T19:39:30.000000Z",
               updated_at: "2025-12-03T19:39:30.000000Z",
               deleted_at: null,
               role: "SuperAdmin",
               read: "todas",
               create: "todas",
               update: "todas",
               delete: "todas",
               more_permissions: "todas",
               page_index: "/app",
               payroll_number: null,
               avatar: null,
               name: null,
               plast_name: null,
               mlast_name: null,
               cellphone: null,
               office_phone: null,
               ext: null,
               img_firm: null,
               position_id: null,
               department_id: null,
               full_name: null,
               full_name_reverse: null,
               position: null,
               description: null,
               letters: null,
               department: null,
               department_description: null
            }
         }
      }
   ];

   return (
      <>
         <TemplateExport open={openDialogTemplateExport} onClose={() => setopenDialogTemplateExport(false)} plantillaUrl={PLANTILLA_PATH} data={allProducts} />

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
            refreshTable={getAllLotes}
            btnsExport={true}
            fileNameExport="Lotes"
            scrollHeight="67vh"
            // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
            // positionBtnsToolbar="center"
            // toolbarContentCenter={toolbarContentCenter}
            // toolbarContentEnd={toolbarContentEnd}
         />
      </>
   );
};
export default LoteDT;
