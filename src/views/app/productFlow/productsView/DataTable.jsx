import { useEffect, useRef, useState } from "react";
import { Badge, Button, Chip, Stack, Typography } from "@mui/material";

import Toast from "../../../../utils/Toast.js";
import { DataTableComponent, ExcelUploader } from "../../../../components/index.js";

import { formatDatetime, includesInArray } from "../../../../utils/Formats.js";
import { QuestionAlertConfig } from "../../../../utils/sAlert.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuthContext } from "../../../../context/AuthContext.jsx";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext.jsx";
import { useProductContext } from "../../../../context/ProductContext.jsx";
import { useLoteContext } from "../../../../context/LoteContext";
import useFetch from "../../../../hooks/useFetch";
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
      getAllProductsPagination,
      getProduct,
      productDetailsByProduct,
      setProductDetailsByProduct,
      getProductDetailsByProduct,
      allProductDetails,
      getMovementsByProduct,
      createMultipleManuallyPortabilities,
      createMultipleManuallyAssignments
   } = useProductContext();
   const { lotesSelect, setLotesSelect, getSelectIndexLotes } = useLoteContext();
   const { refetch: refetchLotes } = useFetch(getSelectIndexLotes, setLotesSelect, false);
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

   // Nuevo Paginacion
   const [currentPage, setCurrentPage] = useState(1);
   const [pageSize, setPageSize] = useState(100);
   const [totalItems, setTotalItems] = useState(0);
   const [totalPages, setTotalPages] = useState(0);
   const [tableLoading, setTableLoading] = useState(false);
   const [tableData, setTableData] = useState([]);

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

   const FechaBodyTemplate = ({ date }) => {
      return (
         <Typography textAlign="center" size={fontSizeTable.text}>
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
   //    //    header: "Región",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.region}</TextCenter>
   //    // },
   //    {
   //       field: "celular",
   //       header: "Celular",
   //       sortable: true,
   //       body: (params) => <TextCenter>{params.row.celular}</TextCenter>
   //    },
   //    {
   //       field: "iccid",
   //       header: "ICCID",
   //       sortable: true,
   //       body: (params) => {
   //          const { key, ...obj } = params.row;
   //          return <IccidBodyTemplate {...obj} />;
   //       }
   //    },
   //    {
   //       field: "fecha",
   //       header: "Fecha Pre-activación",
   //       sortable: true,
   //       body: (params) => {
   //          // const { key, ...obj } = params.row;
   //          return <FechaBodyTemplate key={`key-fechaPreactivacion-${params.row.id}`} date={params.row.fecha} />;
   //       }
   //    },
   //    {
   //       field: "imei",
   //       header: "IMEI",
   //       sortable: true,
   //       body: (params) => <TextCenter>{params.row.imei}</TextCenter>
   //    },
   //    {
   //       field: "marca",
   //       header: "Marca",
   //       sortable: true,
   //       body: (params) => <TextCenter>{params.row.marca}</TextCenter>
   //    },
   //    {
   //       field: "modelo",
   //       header: "Modelo",
   //       sortable: true,
   //       body: (params) => <TextCenter>{params.row.modelo}</TextCenter>
   //    },
   //    {
   //       field: "color",
   //       header: "Color",
   //       sortable: true,
   //       body: (params) => <TextCenter>{params.row.color}</TextCenter>
   //    },
   //    {
   //       field: "executed_at",
   //       header: `Fecha de ${status === "asignados" ? "asignación" : status === "distribuidos" ? "distribución" : status === "activados" ? "activación" : status === "portados" ? "portación" : "ejecución"}`,
   //       sortable: true,
   //       body: (params) => <FechaBodyTemplate key={`key-fechaExecutedAt-${params.row.id}`} date={params.row.executed_at} />
   //    },
   //    // {
   //    //    field: "tramite",
   //    //    header: "Trámite",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.tramite}</TextCenter>
   //    // },
   //    // {
   //    //    field: "estatus",
   //    //    header: "Estatus",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.estatus}</TextCenter>
   //    // },
   //    // {
   //    //    field: "comentario",
   //    //    header: "Comentario",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.comentario}</TextCenter>
   //    // },
   //    // {
   //    //    field: "fza_vta_prepago",
   //    //    header: "Fza Vta Prepago",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.fza_vta_prepago}</TextCenter>
   //    // },
   //    // {
   //    //    field: "fza_vta_padre",
   //    //    header: "Fza Vta Padre",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.fza_vta_padre}</TextCenter>
   //    // },
   //    // {
   //    //    field: "usuario",
   //    //    header: "Usuario",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.usuario}</TextCenter>
   //    // },
   //    status === "asignados" && {
   //       field: "lote",
   //       header: "Lote",
   //       sortable: true,
   //       body: (params) => <TextCenter>{params.row.lote}</TextCenter>
   //    },
   //    status === "asignados" && {
   //       field: "folio",
   //       header: "Folio",
   //       sortable: true,
   //       body: (params) => <TextCenter>{params.row.folio}</TextCenter>
   //    },
   //    ["distribuidos", "activados", "portados"].includes(status) && {
   //       field: "pos_name",
   //       header: "P.V. / Cliente",
   //       sortable: true,
   //       body: (params) => <TextCenter>{params.row.pos_name}</TextCenter>
   //    },
   //    {
   //       field: "status",
   //       header: "Estatus",
   //       sortable: true,
   //       body: (params) => {
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
   //    //    header: "Producto",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.producto}</TextCenter>
   //    // },
   //    // {
   //    //    field: "num_orden",
   //    //    header: "Núm Orden",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.num_orden}</TextCenter>
   //    // },
   //    // {
   //    //    field: "estatus_orden",
   //    //    header: "Estatus Orden",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.estatus_orden}</TextCenter>
   //    // },
   //    // {
   //    //    field: "motivo_error",
   //    //    header: "Motivo Error",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.motivo_error}</TextCenter>
   //    // },
   //    // {
   //    //    field: "tipo_sim",
   //    //    header: "Tipo SIM",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.tipo_sim}</TextCenter>
   //    // },
   //    // {
   //    //    field: "modelo",
   //    //    header: "Modelo",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.modelo}</TextCenter>
   //    // },
   //    // {
   //    //    field: "marca",
   //    //    header: "Marca",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.marca}</TextCenter>
   //    // },
   //    // {
   //    //    field: "color",
   //    //    header: "Color",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.color}</TextCenter>
   //    // },
   //    // {
   //    //    field: "location_status",
   //    //    header: "Ubicación",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.location_status}</TextCenter>
   //    // },
   //    // {
   //    //    field: "activation_status",
   //    //    header: "Estatus Activación",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.activation_status}</TextCenter>
   //    // },
   //    // {
   //    //    field: "product_type",
   //    //    header: "Tipo Producto",
   //    //    sortable: true,
   //    //    body: (params) => <TextCenter>{params.row.product_type}</TextCenter>
   //    // },
   //    {
   //       field: "import",
   //       headerName: "Importación",
   //       sortable: true,
   //       body: (params) => <TextCenter>{params.row.import_name}</TextCenter>
   //    },
   //    {
   //       field: "uploader_username",
   //       headerName: "Creado Por",
   //       sortable: true,
   //       body: (params) => <TextCenter>{params.row.uploader_username}</TextCenter>
   //    },
   //    {
   //       field: "evaluations_rejected",
   //       headerName: "Evaluaciones",
   //       sortable: true,
   //       body: (params) => <TextCenter>{params.row.evaluations_rejected}</TextCenter>
   //    }
   // ];
   const columns = [
      {
         field: "celular",
         header: "Celular",
         sortable: true,
         body: (params) => <TextCenter>{params.row.celular}</TextCenter>
      },
      {
         field: "iccid",
         header: "ICCID",
         sortable: true,
         body: (params) => {
            const { key, ...obj } = params.row;
            return <IccidBodyTemplate {...obj} />;
         }
      },
      {
         field: "fecha",
         header: "Fecha Pre-activación",
         sortable: true,
         body: (params) => {
            // const { key, ...obj } = params.row;
            return <FechaBodyTemplate key={`key-fechaPreactivacion-${params.row.id}`} date={params.row.fecha} />;
         }
      },
      {
         field: "imei",
         header: "IMEI",
         sortable: true,
         body: (params) => <TextCenter>{params.row.imei}</TextCenter>
      },
      {
         field: "executed_at",
         header: `Fecha de Ejecución`,
         // header: `Fecha de ${status === "asignados" ? "asignación" : status === "distribuidos" ? "distribución" : status === "activados" ? "activación" : status === "portados" ? "portación" : "ejecución"}`,
         sortable: true,
         body: (params) => <FechaBodyTemplate key={`key-fechaExecutedAt-${params.row.id}`} date={params.row.executed_at} />
      }
   ];
   [undefined, "asignados"].includes(status) &&
      columns.push(
         {
            field: "lote",
            header: "Lote",
            sortable: true,
            body: (params) => <TextCenter>{params.row.lote}</TextCenter>
         },
         {
            field: "folio",
            header: "Folio",
            sortable: true,
            body: (params) => <TextCenter>{params.row.folio}</TextCenter>
         }
      );
   [undefined, "asignados", "distribuidos", "activados", "portados"].includes(status) &&
      columns.push({
         field: "username",
         header: "Vendedor",
         sortable: true,
         body: (params) => (
            <TextCenter>
               {params.row.username} {params.row.full_name ? ` - ${params.row.full_name}` : ""}
            </TextCenter>
         )
      });
   [undefined, "distribuidos", "activados", "portados"].includes(status) &&
      columns.push({
         field: "pos_name",
         header: "P.V. / Cliente",
         sortable: true,
         body: (params) => <TextCenter>{params.row.pos_name}</TextCenter>
      });
   columns.push(
      {
         field: "status",
         header: "Estatus",
         sortable: true,
         body: (params) => {
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
            return <Chip color={color} label={params.row.destination} />;
         }
      },
      {
         field: "marca",
         header: "Marca",
         sortable: true,
         body: (params) => <TextCenter>{params.row.marca}</TextCenter>
      },
      {
         field: "modelo",
         header: "Modelo",
         sortable: true,
         body: (params) => <TextCenter>{params.row.modelo}</TextCenter>
      },
      {
         field: "color",
         header: "Color",
         sortable: true,
         body: (params) => <TextCenter>{params.row.color}</TextCenter>
      },
      {
         field: "import",
         header: "Importación",
         sortable: true,
         body: (params) => <TextCenter>{params.row.import_name}</TextCenter>
      },
      {
         field: "uploader_username",
         header: "Creado Por",
         sortable: true,
         body: (params) => <TextCenter>{params.row.uploader_username}</TextCenter>
      },
      {
         field: "evaluations_rejected",
         header: "Evaluaciones",
         sortable: true,
         body: (params) => <TextCenter>{params.row.evaluations_rejected}</TextCenter>
      }
   );

   auth.role_id === ROLE_SUPER_ADMIN &&
      columns.push(
         {
            field: "active",
            header: "Activo",
            description: "",
            // width: 90,
            sortable: true,
            functionEdit: null,
            body: (params) => {
               const { key, ...obj } = params.row;
               return <ActiveBodyTemplate {...obj} key={`active-${params.row.id}`} />;
            },
            filter: false,
            filterField: null
         },
         {
            field: "created_at",
            header: "Fecha de alta",
            description: "",
            // width: 90,
            sortable: true,
            functionEdit: null,
            body: (params) => {
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
                  loadProductsWithPagination();
                  setIsLoading(false);
               }
            });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickCreateMultipleManuallyAssignments = async (id, obj) => {
      try {
         // mySwal.fire(QuestionAlertConfig(`¿Estas seguro de portar manualmente el producto ${name}?`, "CONFIRMAR"))
         // Construir lista de opciones con lotes cargados (lista desplegable estilizada)
         const lotesSelectByFolio = lotesSelect.filter((d) => Number(d.folio) === Number(obj.folio));
         const optionsListHTML = (lotesSelectByFolio || [])
            .map((l) => `<li data-id="${l.id}" class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm">${l.label || ""}</li>`)
            .join("");

         mySwal
            .fire({
               ...QuestionAlertConfig(
                  `
         <div class="w-full max-w-md mx-auto text-left">
            <h3 class="text-lg font-semibold text-center mb-3">Asignación manual del producto <br/> cel:${obj.celular} | folio:${obj.folio}</h3>
            <label for="loteSearch" class="block text-sm font-medium text-gray-700 mb-1">Lote</label>
            <div class="relative">
               <div id="loteSelector" class="flex items-center justify-between border rounded px-3 py-2 bg-white cursor-pointer" tabindex="0">
                  <span id="loteSelectedText" class="text-sm text-gray-700">-- Selecciona un lote --</span>
                  <svg id="loteCaret" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
               </div>
               <div id="loteDropdown" class="absolute left-0 right-0 mt-1 bg-white border rounded shadow max-h-56 overflow-auto hidden z-50">
                  <div class="p-2">
                     <input id="loteSearch" type="search" placeholder="Buscar por folio/descripcion" class="w-full px-3 py-2 border rounded text-sm" />
                  </div>
                  <ul id="loteOptions" class="divide-y"> 
                     <li data-id="" class="px-3 py-2 text-sm text-gray-500">-- Selecciona un lote --</li>
                     ${optionsListHTML}
                  </ul>
               </div>
            </div>
            <div class="mt-4">
               <label for="executedAt" class="block text-sm font-medium text-gray-700 mb-1">Fecha de ejecución</label>
               <input type="date" id="executedAt" name="executedAt" class="px-3 py-2 border rounded text-sm" value="${new Date().toISOString().split("T")[0]}" />
            </div>
         </div>
      `,
                  "CONFIRMAR"
               ),
               didOpen: () => {
                  const selector = document.getElementById("loteSelector");
                  const dropdown = document.getElementById("loteDropdown");
                  const search = document.getElementById("loteSearch");
                  const options = document.getElementById("loteOptions");
                  const selectedText = document.getElementById("loteSelectedText");

                  if (!selector || !dropdown || !search || !options) return;

                  const openDropdown = () => dropdown.classList.remove("hidden");
                  const closeDropdown = () => dropdown.classList.add("hidden");

                  const onSelectorClick = (e) => {
                     e.stopPropagation();
                     if (dropdown.classList.contains("hidden")) openDropdown();
                     else closeDropdown();
                  };

                  const onOptionClick = (e) => {
                     const li = e.target.closest("li[data-id]");
                     if (!li) return;
                     const id = li.getAttribute("data-id");
                     const text = li.textContent || li.innerText;
                     // establecer valor seleccionado
                     const hidden = document.getElementById("loteId");
                     if (hidden) hidden.value = id;
                     selectedText.textContent = text;
                     closeDropdown();
                  };

                  const onSearch = () => {
                     const q = search.value.toLowerCase();
                     Array.from(options.querySelectorAll("li[data-id]")).forEach((li) => {
                        const txt = (li.textContent || "").toLowerCase();
                        li.style.display = txt.includes(q) ? "" : "none";
                     });
                  };

                  // crear input oculto para almacenar id
                  let hiddenInput = document.getElementById("loteId");
                  if (!hiddenInput) {
                     hiddenInput = document.createElement("input");
                     hiddenInput.type = "hidden";
                     hiddenInput.id = "loteId";
                     document.querySelector(".swal2-html-container").appendChild(hiddenInput);
                  }

                  selector.addEventListener("click", onSelectorClick);
                  options.addEventListener("click", onOptionClick);
                  search.addEventListener("input", onSearch);

                  // cerrar al hacer click fuera
                  const outsideClick = (ev) => {
                     if (!dropdown.contains(ev.target) && !selector.contains(ev.target)) closeDropdown();
                  };
                  document.addEventListener("click", outsideClick);

                  // guardar referencias para limpieza
                  window._swalLote = { onSelectorClick, onOptionClick, onSearch, outsideClick };
               },
               willClose: () => {
                  // limpiar listeners
                  if (!window._swalLote) return;
                  const selector = document.getElementById("loteSelector");
                  const options = document.getElementById("loteOptions");
                  const search = document.getElementById("loteSearch");
                  if (selector && window._swalLote.onSelectorClick) selector.removeEventListener("click", window._swalLote.onSelectorClick);
                  if (options && window._swalLote.onOptionClick) options.removeEventListener("click", window._swalLote.onOptionClick);
                  if (search && window._swalLote.onSearch) search.removeEventListener("input", window._swalLote.onSearch);
                  if (window._swalLote.outsideClick) document.removeEventListener("click", window._swalLote.outsideClick);
                  delete window._swalLote;
               },
               preConfirm: () => {
                  const loteValue = document.getElementById("loteId") ? document.getElementById("loteId").value : null;
                  const executedAtValue = document.getElementById("executedAt") ? document.getElementById("executedAt").value : null;
                  if (!loteValue || loteValue === "") {
                     mySwal.showValidationMessage("Por favor, selecciona un lote");
                     return false;
                  }
                  if (!executedAtValue) {
                     mySwal.showValidationMessage("Por favor, selecciona una fecha de ejecución");
                     return false;
                  }
                  return { lote_id: loteValue, executed_at: executedAtValue };
               }
            })

            .then(async (result) => {
               if (result.isConfirmed) {
                  setIsLoading(true);
                  const ids = [];
                  ids.push(id);
                  const res = await createMultipleManuallyAssignments({ ids, executed_at: result?.value?.executed_at, lote_id: result?.value?.lote_id });
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
                     showFlexibleAlert(res.metrics, {
                        type: ALERT_TYPES.METRICS_CUSTOM,
                        title: "ASIGNACIONES MANUALES",
                        subtitle: res.message,
                        copyTextGenerator: (data) => {
                           const metrics = data;
                           return `RESULTADO DETALLES:\n\n` + `Procesados: ${metrics.processed}\n` + `Errores: ${metrics.errors}`;
                        }
                     });
                  loadProductsWithPagination();
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

   // Función para cargar datos con paginación
   const loadProductsWithPagination = async (page = currentPage, size = pageSize) => {
      try {
         setTableLoading(true);
         // Suponiendo que tu API acepta parámetros de paginación
         const response = await getAllProductsPagination({}, page, size); // Necesitarás modificar esta función
         // const response = await getAllProducts(); // Necesitarás modificar esta función
         // console.log("🚀 ~ loadProductsWithPagination ~ response:", response);
         // Si tu respuesta tiene la estructura del JSON que mostraste
         if (response?.result) {
            setTotalItems(response.result.total);
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
            setPageSize(response.result.per_page);

            // Formatear datos con acciones
            // const formattedData = response.result.map((obj, index) => {
            const formattedData = response.result.data.map((obj, index) => {
               let register = { ...obj };
               register.key = index + 1;
               register.actions = [
                  { label: "Editar", iconName: "Edit", tooltip: "", handleOnClick: () => handleClickEdit(obj.id), color: "blue", permission: auth.permissions.update },
                  {
                     label: "Ver detalles",
                     iconName: "ListAltRounded",
                     tooltip: "",
                     handleOnClick: () => handleClickDetails(obj.id),
                     color: "primary",
                     permission: true
                  },
                  {
                     label: "Ver movimientos",
                     iconName: "HistoryRounded",
                     tooltip: "",
                     handleOnClick: () => handleClickMovements(obj),
                     color: "primary",
                     permission: true
                  },
                  register.destination != "Portado" && {
                     label: "Portar Manualmente",
                     iconName: "ImportExportRounded",
                     tooltip: "",
                     handleOnClick: () => handleClickCreateMultipleManuallyPortabilities(obj.id, obj.celular),
                     color: "primary",
                     permission: includesInArray(auth.permissions.more_permissions, ["todas", "Portacion Manual"])
                  },
                  register.seller_id == null && {
                     label: "Asignación Manual",
                     iconName: "AssignmentIndRounded",
                     tooltip: "",
                     handleOnClick: () => handleClickCreateMultipleManuallyAssignments(obj.id, obj),
                     color: "primary",
                     permission: includesInArray(auth.permissions.more_permissions, ["todas", "Asignacion Manual"])
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
               return register;
            });
            // console.log("🚀 ~ loadProductsWithPagination ~ formattedData:", formattedData);

            setTableData(formattedData);
            return formattedData;
         }

         setTableData([]);
         return [];
      } catch (error) {
         console.error("Error loading products:", error);
         Toast.Error(error);
         setTableData([]);
         return [];
      } finally {
         setTableLoading(false);
      }
   };

   // Efecto para cargar datos iniciales
   useEffect(() => {
      loadProductsWithPagination();
   }, [status, allProducts.length]); // Recargar cuando cambie el status

   // Cargar lotes para selector de asignación manual
   useEffect(() => {
      if (refetchLotes) refetchLotes();
   }, []);

   // Manejadores de cambio de página
   const handlePageChange = async (newPage) => {
      await loadProductsWithPagination(newPage, pageSize);
   };

   const handlePageSizeChange = async (newSize) => {
      await loadProductsWithPagination(1, newSize);
   };

   // Configurar información de paginación
   const paginationInfo = {
      current_page: currentPage,
      total: totalItems,
      per_page: pageSize,
      last_page: totalPages
   };

   const data = tableData;

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
                  afterSubmit={() => loadProductsWithPagination(currentPage, pageSize)}
               />
            )}
            {/* {<PreActivationForm openDialog={openDialogPreActivationForm} setOpenDialog={setOpenDialogPreActivationForm} />} */}
            {includesInArray(auth.permissions.more_permissions, ["todas", "Importar Detalles"]) && (
               <ImportProductDetailsForm
                  openDialog={openDialogImportDetailsForm}
                  setOpenDialog={setOpenDialogImportDetailsForm}
                  columns={columnasDetalleProducto}
                  afterSubmit={() => loadProductsWithPagination(currentPage, pageSize)}
               />
            )}
            {includesInArray(auth.permissions.more_permissions, ["todas", "Asignar Productos"]) && (
               <AssignmentForm
                  openDialog={openDialogAssignmentForm}
                  setOpenDialog={setOpenDialogAssignmentForm}
                  afterSubmit={() => loadProductsWithPagination(currentPage, pageSize)}
               />
            )}
            {includesInArray(auth.permissions.more_permissions, ["todas", "Importa Portaciones"]) && (
               <ImportPortabitiesFrom
                  openDialog={openDialogImportPortabitiesForm}
                  setOpenDialog={setOpenDialogImportPortabitiesForm}
                  afterSubmit={() => loadProductsWithPagination(currentPage, pageSize)}
               />
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
            // refreshTable={getAllProducts}
            refreshTable={() => loadProductsWithPagination(currentPage, pageSize)}
            btnsExport={false}
            scrollHeight="75vh"
            // Nuevas props de paginación
            pagination={paginationInfo}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={tableLoading}
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
