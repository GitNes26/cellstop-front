import { useEffect, useRef, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";

import Toast from "../../../../utils/Toast";
import { DataTableComponent, ExcelUploader } from "../../../../components";

import { formatDatetime } from "../../../../utils/Formats";
import { QuestionAlertConfig } from "../../../../utils/sAlert";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuthContext } from "../../../../context/AuthContext";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext";
import { useProductContext } from "../../../../context/ProductContext";
import { CheckCircleRounded, UploadFileRounded } from "@mui/icons-material";
import { CancelRounded } from "@mui/icons-material";
import { env } from "../../../../constant";
import AssignmentForm from "./AssignmentForm";
import ImportForm from "./ImportForm";
import PreActivationForm from "./PreActivationForm";
import ImportProductDetailsForm from "./ImportProductDetailsForm.jsx";
import ModalTableDetails from "./TableDetails.js";

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
      allProductDetailsByProduct,
      setAllProductDetailsByProduct,
      getProductDetailsByProduct
   } = useProductContext();
   const mySwal = withReactContent(Swal);

   const [openDialogImportForm, setOpenDialogImportForm] = useState(false);
   const [openDialogImportDetailsForm, setOpenDialogImportDetailsForm] = useState(false);
   const [openDialogAssignmentForm, setOpenDialogAssignmentForm] = useState(false);
   const [openDialogTableDetails, setOpenDialogTableDetails] = useState(false);

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

   const FechaBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {formatDatetime(obj.fecha, false)}
      </Typography>
   );

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

   const columns = [
      {
         field: "region",
         headerName: "Región",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.region}`}>{params.row.region}</TextCenter>
      },
      {
         field: "celular",
         headerName: "Celular",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.celular}`}>{params.row.celular}</TextCenter>
      },
      { field: "iccid", headerName: "ICCID", sortable: true, renderCell: (params) => <IccidBodyTemplate {...params.row} /> },
      {
         field: "imei",
         headerName: "IMEI",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.imei}`}>{params.row.imei}</TextCenter>
      },
      { field: "fecha", headerName: "Fecha", sortable: true, renderCell: (params) => <FechaBodyTemplate {...params.row} /> },
      {
         field: "tramite",
         headerName: "Trámite",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.tramite}`}>{params.row.tramite}</TextCenter>
      },
      {
         field: "estatus",
         headerName: "Estatus",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.estatus}`}>{params.row.estatus}</TextCenter>
      },
      {
         field: "comentario",
         headerName: "Comentario",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.comentario}`}>{params.row.comentario}</TextCenter>
      },
      {
         field: "fza_vta_prepago",
         headerName: "Fza Vta Prepago",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.fza_vta_prepago}`}>{params.row.fza_vta_prepago}</TextCenter>
      },
      {
         field: "fza_vta_padre",
         headerName: "Fza Vta Padre",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.fza_vta_padre}`}>{params.row.fza_vta_padre}</TextCenter>
      },
      {
         field: "usuario",
         headerName: "Usuario",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.usuario}`}>{params.row.usuario}</TextCenter>
      },
      {
         field: "folio",
         headerName: "Folio",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.folio}`}>{params.row.folio}</TextCenter>
      },
      {
         field: "producto",
         headerName: "Producto",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.producto}`}>{params.row.producto}</TextCenter>
      },
      {
         field: "num_orden",
         headerName: "Núm Orden",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.num_orden}`}>{params.row.num_orden}</TextCenter>
      },
      {
         field: "estatus_orden",
         headerName: "Estatus Orden",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.estatus_orden}`}>{params.row.estatus_orden}</TextCenter>
      },
      {
         field: "motivo_error",
         headerName: "Motivo Error",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.motivo_error}`}>{params.row.motivo_error}</TextCenter>
      },
      {
         field: "tipo_sim",
         headerName: "Tipo SIM",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.tipo_sim}`}>{params.row.tipo_sim}</TextCenter>
      },
      {
         field: "modelo",
         headerName: "Modelo",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.modelo}`}>{params.row.modelo}</TextCenter>
      },
      {
         field: "marca",
         headerName: "Marca",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.marca}`}>{params.row.marca}</TextCenter>
      },
      {
         field: "color",
         headerName: "Color",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.color}`}>{params.row.color}</TextCenter>
      },
      {
         field: "location_status",
         headerName: "Ubicación",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.location_status}`}>{params.row.location_status}</TextCenter>
      },
      {
         field: "activation_status",
         headerName: "Estatus Activación",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.activation_status}`}>{params.row.activation_status}</TextCenter>
      },
      {
         field: "product_type",
         headerName: "Tipo Producto",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.product_type_id}`}>{params.row.product_type.product_type}</TextCenter>
      },
      {
         field: "import",
         headerName: "Importación",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.import_id}`}>{params.row.import.name}</TextCenter>
      },
      {
         field: "import.upload_by",
         headerName: "Creado Por",
         sortable: true,
         renderCell: (params) => <TextCenter key={`key-${params.row.id}-${params.row.import.upload_by}`}>{params.row.import.upload_by}</TextCenter>
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
            renderCell: (params) => <CreatedAtBodyTemplate {...params.row} key={`created-at-${params.row.id}`} />,
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
               { label: "Editar", iconName: "Edit", tooltip: "", handleOnClick: () => handleClickEdit(obj.id), color: "blue" },
               { label: "Ver detalles", iconName: "ListAltRounded", tooltip: "", handleOnClick: () => handleClickDetails(obj.id), color: "blue" },
               { label: "Eliminar", iconName: "Delete", tooltip: "", handleOnClick: () => handleClickDelete(obj.id, obj.product), color: "red" }
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
      <>
         <Stack direction="row" spacing={1} alignItems="center" padding={1}>
            {/* <ExcelUploader columns={columnas} chunkSize={1000} apiEndpoint="products/import" headerRow={4} dataStartRow={5} onFinish={getAllProducts} /> */}
            <ImportForm
               openDialog={openDialogImportForm}
               setOpenDialog={setOpenDialogImportForm}
               columns={columnas}
               chunkSize={1000}
               apiEndpoint="products/import"
               headerRow={1}
               dataStartRow={2}
            />
            {/* {<PreActivationForm openDialog={openDialogPreActivationForm} setOpenDialog={setOpenDialogPreActivationForm} />} */}
            {<ImportProductDetailsForm openDialog={openDialogImportDetailsForm} setOpenDialog={setOpenDialogImportDetailsForm} columns={columnasDetalleProducto} />}
            <AssignmentForm openDialog={openDialogAssignmentForm} setOpenDialog={setOpenDialogAssignmentForm} />
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
            indexColumnName={3}
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
            processedData={allProductDetailsByProduct}
            heightDialog={"80vh"}
            maxHeight={"95%"}
         />
      </>
   );
};
export default ProductDT;
