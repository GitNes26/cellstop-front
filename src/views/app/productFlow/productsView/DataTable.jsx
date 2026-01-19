import { useEffect, useRef, useState } from "react";
import { Badge, Button, Stack, Typography } from "@mui/material";

import Toast from "../../../../utils/Toast.js";
import { DataTableComponent, ExcelUploader } from "../../../../components/index.js";

import { formatDatetime, includesInArray } from "../../../../utils/Formats.js";
import { QuestionAlertConfig } from "../../../../utils/sAlert.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuthContext } from "../../../../context/AuthContext.jsx";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext.jsx";
import { useProductContext } from "../../../../context/ProductContext.jsx";
import { CheckCircleRounded, UploadFileRounded } from "@mui/icons-material";
import { CancelRounded } from "@mui/icons-material";
import { env } from "../../../../constant/index.js";
import AssignmentForm from "./AssignmentForm.jsx";
import ImportForm from "./ImportForm.jsx";
import PreActivationForm from "./PreActivationForm.jsx";
import ImportProductDetailsForm from "./ImportProductDetailsForm.js";
import ModalTableDetails from "./TableDetails.js";
import ImportPortabitiesFrom from "./ImportPortabitiesFrom.jsx";
import { ProductMovementsModal } from "./TableMovements.js";
import showFlexibleAlert, { ALERT_TYPES } from "../../../../components/showDuplicatesAlert.js";
import { useParams } from "react-router-dom";

const columnasPortaciones = ["telefono", "fechaActivacion", "fechaPortacion", "FzaVentas", "descripFzaVta"];

const columnasDetalleProducto = [
   "FILTRO",
   "TELEFONO",
   "IMEI",
   "ICCID",
   "ESTATUS LIN",
   "MOVIMIENTO",
   "FECHA_ACTIV",
   "FECHA_PRIM_LLAM",
   "FECHA DOL",
   "ESTATUS_PAGO",
   "MOTIVO_ESTATUS",
   "MONTO_COM",
   "TIPO_COMISION",
   "EVALUACION",
   "FZA_VTA_PAGO",
   "FECHA EVALUACION",
   "FOLIO FACTURA",
   "FECHA PUBLICACION"
];
const columnas = [
   "Región",
   "Celular",
   "ICCID",
   "IMEI",
   "Fecha",
   "Trámite",
   "Estatus",
   "Comentario",
   "Fuerza de Venta Prepago",
   "Fuerza de Venta Padre",
   "Usuario",
   "Folio",
   "Producto",
   "Núm Orden",
   "Estatus orden",
   "Motivo error",
   "Tipo SIM"
];
// Validaciones por columna: null = opcional
const validaciones = {
   FILTRO: () => null,
   // TELEFONO: (v) => /^\d{10}$/.test(v),
   TELEFONO: (v) => !!v && v.length === 10,
   // IMEI: (v) => /^\d{15}$/.test(v),
   IMEI: (v) => !!v && v.length === 15,
   ICCID: (v) => !!v && v.length >= 10,
   "ESTATUS LIN": null,
   MOVIMIENTO: null,
   FECHA_ACTIV: (v) => !isNaN(Date.parse(v)),
   FECHA_PRIM_LLAM: (v) => !v || !isNaN(Date.parse(v)), // opcional
   "FECHA DOL": (v) => !v || !isNaN(Date.parse(v)),
   ESTATUS_PAGO: null,
   MOTIVO_ESTATUS: null,
   MONTO_COM: (v) => !isNaN(Number(v)),
   TIPO_COMISION: null,
   EVALUACION: null,
   FZA_VTA_PAGO: null,
   "FECHA EVALUACION": (v) => !v || !isNaN(Date.parse(v)),
   "FOLIO FACTURA": null,
   "FECHA PUBLICACION": (v) => !v || !isNaN(Date.parse(v))
};

const ProductDT = ({}) => {
   const { status } = useParams();

   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      allProducts,
      setFormTitle,
      setTextBtnSubmit,
      formikRef,
      setIsEdit,
      deleteProduct,
      disEnableProduct,
      getAllProducts,
      getProduct,
      productDetailsByProduct,
      setProductDetailsByProduct,
      getProductDetailsByProduct,
      allProductDetails,
      getMovementsByProduct,
      createMultipleManuallyPortabilities
   } = useProductContext();
   const mySwal = withReactContent(Swal);

   const [openDialogImportForm, setOpenDialogImportForm] = useState(false);
   const [openDialogImportDetailsForm, setOpenDialogImportDetailsForm] = useState(false);
   const [openDialogAssignmentForm, setOpenDialogAssignmentForm] = useState(false);
   const [openDialogImportPortabitiesForm, setOpenDialogImportPortabitiesForm] = useState(false);
   const [openDialogTableDetails, setOpenDialogTableDetails] = useState(false);
   const [openDialogTableMovements, setOpenDialogTableMovements] = useState(false);
   const [productInfoSelected, setProductInfoSelected] = useState({
      iccid: "8952020525331075016",
      imei: "123456789012345",
      phone: "8722957088"
   });

   //#region COLUMNAS
   const fontSizeTable = { text: "sm", subtext: "xs" };

   // #region Body Templates
   const TextCenter = ({ children, key }) => (
      <Typography key={key} textAlign="center" size={fontSizeTable.text}>
         {children ?? "-"}
      </Typography>
   );

   const IccidBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text} className="font-black">
         {obj.iccid}
      </Typography>
   );

   const FechaBodyTemplate = ({ key, date }) => {
      return (
         <Typography key={key} textAlign="center" size={fontSizeTable.text}>
            {formatDatetime(date, false)}
         </Typography>
      );
   };

   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign="center" className="flex justify-center">
         {obj.active ? <CheckCircleRounded style={{ color: "green" }} fontSize="medium" /> : <CancelRounded style={{ color: "red" }} fontSize="medium" />}
      </Typography>
   );

   const CreatedAtBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {formatDatetime(obj.created_at, true)}
      </Typography>
   );
   // #endregion

   // const columns = [
   //    // {
   //    //    field: "region",
   //    //    headerName: "Región",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.region}</TextCenter>
   //    // },
   //    {
   //       field: "celular",
   //       headerName: "Celular",
   //       sortable: true,
   //       renderCell: (params) => <TextCenter>{params.row.celular}</TextCenter>
   //    },
   //    {
   //       field: "iccid",
   //       headerName: "ICCID",
   //       sortable: true,
   //       renderCell: (params) => {
   //          const { key, ...obj } = params.row;
   //          return <IccidBodyTemplate {...obj} />;
   //       }
   //    },
   //    {
   //       field: "fecha",
   //       headerName: "Fecha Pre-activación",
   //       sortable: true,
   //       renderCell: (params) => {
   //          // const { key, ...obj } = params.row;
   //          return <FechaBodyTemplate key={`key-fechaPreactivacion-${params.row.id}`} date={params.row.fecha} />;
   //       }
   //    },
   //    {
   //       field: "imei",
   //       headerName: "IMEI",
   //       sortable: true,
   //       renderCell: (params) => <TextCenter>{params.row.imei}</TextCenter>
   //    },
   //    {
   //       field: "marca",
   //       headerName: "Marca",
   //       sortable: true,
   //       renderCell: (params) => <TextCenter>{params.row.marca}</TextCenter>
   //    },
   //    {
   //       field: "modelo",
   //       headerName: "Modelo",
   //       sortable: true,
   //       renderCell: (params) => <TextCenter>{params.row.modelo}</TextCenter>
   //    },
   //    {
   //       field: "color",
   //       headerName: "Color",
   //       sortable: true,
   //       renderCell: (params) => <TextCenter>{params.row.color}</TextCenter>
   //    },
   //    {
   //       field: "executed_at",
   //       headerName: `Fecha de ${status === "asignados" ? "asignación" : status === "distribuidos" ? "distribución" : status === "activados" ? "activación" : status === "portados" ? "portación" : "ejecución"}`,
   //       sortable: true,
   //       renderCell: (params) => <FechaBodyTemplate key={`key-fechaExecutedAt-${params.row.id}`} date={params.row.executed_at} />
   //    },
   //    // {
   //    //    field: "tramite",
   //    //    headerName: "Trámite",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.tramite}</TextCenter>
   //    // },
   //    // {
   //    //    field: "estatus",
   //    //    headerName: "Estatus",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.estatus}</TextCenter>
   //    // },
   //    // {
   //    //    field: "comentario",
   //    //    headerName: "Comentario",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.comentario}</TextCenter>
   //    // },
   //    // {
   //    //    field: "fza_vta_prepago",
   //    //    headerName: "Fza Vta Prepago",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.fza_vta_prepago}</TextCenter>
   //    // },
   //    // {
   //    //    field: "fza_vta_padre",
   //    //    headerName: "Fza Vta Padre",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.fza_vta_padre}</TextCenter>
   //    // },
   //    // {
   //    //    field: "usuario",
   //    //    headerName: "Usuario",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.usuario}</TextCenter>
   //    // },
   //    status === "asignados" && {
   //       field: "lote",
   //       headerName: "Lote",
   //       sortable: true,
   //       renderCell: (params) => <TextCenter>{params.row.lote}</TextCenter>
   //    },
   //    status === "asignados" && {
   //       field: "folio",
   //       headerName: "Folio",
   //       sortable: true,
   //       renderCell: (params) => <TextCenter>{params.row.folio}</TextCenter>
   //    },
   //    ["distribuidos", "activados", "portados"].includes(status) && {
   //       field: "pos_name",
   //       headerName: "P.V. / Cliente",
   //       sortable: true,
   //       renderCell: (params) => <TextCenter>{params.row.pos_name}</TextCenter>
   //    },
   //    {
   //       field: "status",
   //       headerName: "Estatus",
   //       sortable: true,
   //       renderCell: (params) => {
   //          const color =
   //             params.row.destination === "Asignado"
   //                ? "warning"
   //                : params.row.destination === "Distribuido"
   //                  ? "info"
   //                  : params.row.destination === "Activado"
   //                    ? "success"
   //                    : params.row.destination === "Portado"
   //                      ? "error"
   //                      : "default";
   //          return (
   //             <TextCenter>
   //                <Badge color={color}>{params.row.destination}</Badge>
   //             </TextCenter>
   //          );
   //       }
   //    },
   //    // {
   //    //    field: "producto",
   //    //    headerName: "Producto",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.producto}</TextCenter>
   //    // },
   //    // {
   //    //    field: "num_orden",
   //    //    headerName: "Núm Orden",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.num_orden}</TextCenter>
   //    // },
   //    // {
   //    //    field: "estatus_orden",
   //    //    headerName: "Estatus Orden",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.estatus_orden}</TextCenter>
   //    // },
   //    // {
   //    //    field: "motivo_error",
   //    //    headerName: "Motivo Error",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.motivo_error}</TextCenter>
   //    // },
   //    // {
   //    //    field: "tipo_sim",
   //    //    headerName: "Tipo SIM",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.tipo_sim}</TextCenter>
   //    // },
   //    // {
   //    //    field: "modelo",
   //    //    headerName: "Modelo",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.modelo}</TextCenter>
   //    // },
   //    // {
   //    //    field: "marca",
   //    //    headerName: "Marca",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.marca}</TextCenter>
   //    // },
   //    // {
   //    //    field: "color",
   //    //    headerName: "Color",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.color}</TextCenter>
   //    // },
   //    // {
   //    //    field: "location_status",
   //    //    headerName: "Ubicación",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.location_status}</TextCenter>
   //    // },
   //    // {
   //    //    field: "activation_status",
   //    //    headerName: "Estatus Activación",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.activation_status}</TextCenter>
   //    // },
   //    // {
   //    //    field: "product_type",
   //    //    headerName: "Tipo Producto",
   //    //    sortable: true,
   //    //    renderCell: (params) => <TextCenter>{params.row.product_type}</TextCenter>
   //    // },
   //    {
   //       field: "import",
   //       headerName: "Importación",
   //       sortable: true,
   //       renderCell: (params) => <TextCenter>{params.row.import_name}</TextCenter>
   //    },
   //    {
   //       field: "uploader_username",
   //       headerName: "Creado Por",
   //       sortable: true,
   //       renderCell: (params) => <TextCenter>{params.row.uploader_username}</TextCenter>
   //    },
   //    {
   //       field: "evaluations_rejected",
   //       headerName: "Evaluaciones",
   //       sortable: true,
   //       renderCell: (params) => <TextCenter>{params.row.evaluations_rejected}</TextCenter>
   //    }
   // ];
   const columns = [
      {
         field: "celular",
         headerName: "Celular",
         sortable: true,
         renderCell: (params) => <TextCenter>{params.row.celular}</TextCenter>
      },
      {
         field: "iccid",
         headerName: "ICCID",
         sortable: true,
         renderCell: (params) => {
            const { key, ...obj } = params.row;
            return <IccidBodyTemplate {...obj} />;
         }
      },
      {
         field: "fecha",
         headerName: "Fecha Pre-activación",
         sortable: true,
         renderCell: (params) => {
            // const { key, ...obj } = params.row;
            return <FechaBodyTemplate key={`key-fechaPreactivacion-${params.row.id}`} date={params.row.fecha} />;
         }
      },
      {
         field: "imei",
         headerName: "IMEI",
         sortable: true,
         renderCell: (params) => <TextCenter>{params.row.imei}</TextCenter>
      },
      {
         field: "marca",
         headerName: "Marca",
         sortable: true,
         renderCell: (params) => <TextCenter>{params.row.marca}</TextCenter>
      },
      {
         field: "modelo",
         headerName: "Modelo",
         sortable: true,
         renderCell: (params) => <TextCenter>{params.row.modelo}</TextCenter>
      },
      {
         field: "color",
         headerName: "Color",
         sortable: true,
         renderCell: (params) => <TextCenter>{params.row.color}</TextCenter>
      },
      {
         field: "executed_at",
         headerName: `Fecha de ${status === "asignados" ? "asignación" : status === "distribuidos" ? "distribución" : status === "activados" ? "activación" : status === "portados" ? "portación" : "ejecución"}`,
         sortable: true,
         renderCell: (params) => <FechaBodyTemplate key={`key-fechaExecutedAt-${params.row.id}`} date={params.row.executed_at} />
      }
   ];
   [undefined, "asignados"].includes(status) &&
      columns.push(
         {
            field: "lote",
            headerName: "Lote",
            sortable: true,
            renderCell: (params) => <TextCenter>{params.row.lote}</TextCenter>
         },
         {
            field: "folio",
            headerName: "Folio",
            sortable: true,
            renderCell: (params) => <TextCenter>{params.row.folio}</TextCenter>
         }
      );
   [undefined, "distribuidos", "activados", "portados"].includes(status) &&
      columns.push({
         field: "pos_name",
         headerName: "P.V. / Cliente",
         sortable: true,
         renderCell: (params) => <TextCenter>{params.row.pos_name}</TextCenter>
      });
   columns.push(
      {
         field: "status",
         headerName: "Estatus",
         sortable: true,
         renderCell: (params) => {
            const color =
               params.row.destination === "Asignado"
                  ? "warning"
                  : params.row.destination === "Distribuido"
                    ? "info"
                    : params.row.destination === "Activado"
                      ? "success"
                      : params.row.destination === "Portado"
                        ? "error"
                        : "default";
            return (
               <TextCenter>
                  <Badge color={color}>{params.row.destination}</Badge>
               </TextCenter>
            );
         }
      },
      {
         field: "import",
         headerName: "Importación",
         sortable: true,
         renderCell: (params) => <TextCenter>{params.row.import_name}</TextCenter>
      },
      {
         field: "uploader_username",
         headerName: "Creado Por",
         sortable: true,
         renderCell: (params) => <TextCenter>{params.row.uploader_username}</TextCenter>
      },
      {
         field: "evaluations_rejected",
         headerName: "Evaluaciones",
         sortable: true,
         renderCell: (params) => <TextCenter>{params.row.evaluations_rejected}</TextCenter>
      }
   );

   auth.role_id === ROLE_SUPER_ADMIN &&
      columns.push(
         {
            field: "active",
            headerName: "Activo",
            description: "",
            // width: 90,
            sortable: true,
            functionEdit: null,
            renderCell: (params) => {
               const { key, ...obj } = params.row;
               return <ActiveBodyTemplate {...obj} key={`active-${params.row.id}`} />;
            },
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
            renderCell: (params) => {
               const { key, ...obj } = params.row;
               return <CreatedAtBodyTemplate {...obj} key={`created-at-${params.row.id}`} />;
            },
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
         const res = await getProduct(id);
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

         if (res.result.product_description) res.result.product_description == null && (res.result.product_description = "");
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

   const handleClickDetails = async (id) => {
      try {
         setIsLoading(true);
         const res = await getProductDetailsByProduct(id);
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

         if (res.result.product_description) res.result.product_description == null && (res.result.product_description = "");
         // formikRef?.current.setValues(res.result);
         if (res.alert_text) Toast.Success(res.alert_text);
         setIsLoading(false);
         setOpenDialogTableDetails(true);
      } catch (error) {
         setOpenDialogTableDetails(false);
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickMovements = async (obj) => {
      try {
         setIsLoading(true);
         const res = await getMovementsByProduct(obj.id);
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

         if (res.result.product_description) res.result.product_description == null && (res.result.product_description = "");
         setProductInfoSelected({
            iccid: obj.iccid,
            imei: obj.imei,
            phone: obj.celular
         });
         // formikRef?.current.setValues(res.result);
         if (res.alert_text) Toast.Success(res.alert_text);
         setIsLoading(false);
         setOpenDialogTableMovements(true);
      } catch (error) {
         setOpenDialogTableMovements(false);
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (id, name) => {
      try {
         mySwal.fire(QuestionAlertConfig(`¿Estas seguro de eliminar el producto ${name}?`, "CONFIRMAR")).then(async (result) => {
            if (result.isConfirmed) {
               setIsLoading(true);
               const res = await deleteProduct(id);
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

   const handleClickCreateMultipleManuallyPortabilities = async (id, name) => {
      try {
         // mySwal.fire(QuestionAlertConfig(`¿Estas seguro de portar manualmente el producto ${name}?`, "CONFIRMAR"))
         mySwal
            .fire({
               ...QuestionAlertConfig(
                  `
         <div style="text-align: center;">
            <h3>¿Estás seguro de portar manualmente el producto ${name}?</h3>
            <br />
            <label for="executedAt" style="display: block; margin-bottom: 8px; font-weight: 500;">
            Fecha de ejecución:
            </label>
            <input 
            type="date" 
            id="executedAt" 
            name="executedAt"
            style="
               padding: 8px 12px;
               border: 1px solid #ddd;
               border-radius: 4px;
               font-size: 14px;
               width: 100%;
               max-width: 200px;
            "
            value="${new Date().toISOString().split("T")[0]}"
            />
         </div>
      `,
                  "CONFIRMAR"
               ),
               preConfirm: () => {
                  const executedAtInput = document.getElementById("executedAt");
                  const executedAtValue = executedAtInput ? executedAtInput.value : null;

                  if (!executedAtValue) {
                     mySwal.showValidationMessage("Por favor, selecciona una fecha de ejecución");
                     return false;
                  }

                  return { executed_at: executedAtValue };
               }
            })

            .then(async (result) => {
               if (result.isConfirmed) {
                  setIsLoading(true);
                  const ids = [];
                  ids.push(id);
                  const res = await createMultipleManuallyPortabilities({ ids, executed_at: result?.value?.executed_at });
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
                  if (res.metrics)
                     /* showMetricsAlert(res.metrics); */
                     showFlexibleAlert(res.metrics, {
                        type: ALERT_TYPES.METRICS_CUSTOM,
                        title: "PORTACIONES MANUALES",
                        subtitle: res.message,
                        copyTextGenerator: (data) => {
                           const metrics = data;
                           return `RESULTADO DETALLES:\n\n` + `Procesados: ${metrics.processed}\n` + `Errores: ${metrics.errors}`;
                        }
                     });
                  // if (res.alert_text) Toast.Customizable(res.alert_text, res.alert_icon);
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
            const res = await disEnableProduct(id, !active);
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

   // toolbar content: input hidden + importar

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", allProducts);
         await allProducts.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            // register.actions = <ButtonsAction id={obj.id} name={obj.product} active={obj.active} />;
            register.actions = [
               { label: "Editar", iconName: "Edit", tooltip: "", handleOnClick: () => handleClickEdit(obj.id), color: "blue", permission: auth.permissions.update },
               { label: "Ver detalles", iconName: "ListAltRounded", tooltip: "", handleOnClick: () => handleClickDetails(obj.id), color: "primary", permission: true },
               {
                  label: "Ver movimientos",
                  iconName: "HistoryRounded",
                  tooltip: "",
                  handleOnClick: () => handleClickMovements(obj),
                  color: "primary",
                  permission: true
               },
               {
                  label: "Portar Manualmente",
                  iconName: "ImportExportRounded",
                  tooltip: "",
                  handleOnClick: () => handleClickCreateMultipleManuallyPortabilities(obj.id, obj.celular),
                  color: "primary",
                  permission: includesInArray(auth.permissions.more_permissions, ["todas", "Portacion Manual"])
               },

               {
                  label: "Eliminar",
                  iconName: "Delete",
                  tooltip: "",
                  handleOnClick: () => handleClickDelete(obj.id, obj.celular),
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

   useEffect(() => {}, [status]);

   return (
      <>
         <Stack direction="row" spacing={1} justifyContent={"center"} alignItems="center" padding={1}>
            {/* <ExcelUploader columns={columnas} chunkSize={1000} apiEndpoint="products/import" headerRow={4} dataStartRow={5} onFinish={getAllProducts} /> */}
            {includesInArray(auth.permissions.more_permissions, ["todas", "Carga Masiva"]) && (
               <ImportForm
                  openDialog={openDialogImportForm}
                  setOpenDialog={setOpenDialogImportForm}
                  columns={columnas}
                  chunkSize={1000}
                  apiEndpoint="products/import"
                  headerRow={1}
                  dataStartRow={2}
               />
            )}
            {/* {<PreActivationForm openDialog={openDialogPreActivationForm} setOpenDialog={setOpenDialogPreActivationForm} />} */}
            {includesInArray(auth.permissions.more_permissions, ["todas", "Importar Detalles"]) && (
               <ImportProductDetailsForm openDialog={openDialogImportDetailsForm} setOpenDialog={setOpenDialogImportDetailsForm} columns={columnasDetalleProducto} />
            )}
            {includesInArray(auth.permissions.more_permissions, ["todas", "Asignar Productos"]) && (
               <AssignmentForm openDialog={openDialogAssignmentForm} setOpenDialog={setOpenDialogAssignmentForm} />
            )}
            {includesInArray(auth.permissions.more_permissions, ["todas", "Importa Portaciones"]) && (
               <ImportPortabitiesFrom openDialog={openDialogImportPortabitiesForm} setOpenDialog={setOpenDialogImportPortabitiesForm} />
            )}
         </Stack>
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
            refreshTable={getAllProducts}
            btnsExport={false}
            scrollHeight="75vh"
            // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
            // positionBtnsToolbar="center"
            // toolbarContentCenter={toolbarContentCenter}
            // toolbarContentEnd={toolbarContentEnd}
         />
         <ModalTableDetails
            openDialog={openDialogTableDetails}
            setOpenDialog={setOpenDialogTableDetails}
            processedData={productDetailsByProduct}
            heightDialog={"80vh"}
            maxHeight={"95%"}
         />
         <ProductMovementsModal
            open={openDialogTableMovements}
            onClose={() => setOpenDialogTableMovements(false)}
            movements={allProductDetails}
            productInfo={productInfoSelected}
            title="Historial del Producto"
            maxHeight={700}
         />
      </>
   );
};
export default ProductDT;
