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
import { useChipContext } from "../../../../context/ChipContext";
import { CheckCircleRounded, UploadFileRounded } from "@mui/icons-material";
import { CancelRounded } from "@mui/icons-material";
import { env } from "../../../../constant";
import AssignmentForm from "./AssignmentForm";

const columnas = [
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

const ChipDT = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const { singularName, allChips, setFormTitle, setTextBtnSubmit, formikRef, setIsEdit, deleteChip, disEnableChip, getAllChips, getChip } = useChipContext();
   const mySwal = withReactContent(Swal);

   const [openDialogAssignmentForm, setOpenDialogAssignmentForm] = useState(false);

   //#region COLUMNAS
   const fontSizeTable = { text: "sm", subtext: "xs" };

   // #region BodysTemplate
   const FiltroBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.filtro}
      </Typography>
   );

   const TelefonoBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.telefono}
      </Typography>
   );

   const ImeiBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.imei}
      </Typography>
   );

   const IccidBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text} className="font-black">
         {obj.iccid}
      </Typography>
   );

   const EstatusLinBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.estatus_lin}
      </Typography>
   );

   const MovimientoBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.movimiento}
      </Typography>
   );

   const FechaActivBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {formatDatetime(obj.fecha_activ, false)}
      </Typography>
   );

   const FechaPrimLlamBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {formatDatetime(obj.fecha_prim_llam, false)}
      </Typography>
   );

   const FechaDolBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {formatDatetime(obj.fecha_dol, false)}
      </Typography>
   );

   const EstatusPagoBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.estatus_pago}
      </Typography>
   );

   const MotivoEstatusBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.motivo_estatus}
      </Typography>
   );

   const MontoComBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         ${obj.monto_com ? Number(obj.monto_com).toFixed(2) : "0.00"}
      </Typography>
   );

   const TipoComisionBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.tipo_comision}
      </Typography>
   );

   const EvaluacionBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.evaluacion}
      </Typography>
   );

   const FzaVtaPagoBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.fza_vta_pago}
      </Typography>
   );

   const FechaEvaluacionBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {formatDatetime(obj.fecha_evaluacion, false)}
      </Typography>
   );

   const FolioFacturaBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.folio_factura}
      </Typography>
   );

   const FechaPublicacionBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {formatDatetime(obj.fecha_publicacion, false)}
      </Typography>
   );

   const LocationStatusBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.location_status}
      </Typography>
   );

   const ActivationStatusBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.activation_status}
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
   // #endregion Body Templates

   const columns = [
      { field: "filtro", headerName: "Filtro", sortable: true, renderCell: (params) => <FiltroBodyTemplate {...params.row} key={`filtro-${params.row.id}`} /> },
      {
         field: "telefono",
         headerName: "Teléfono",
         sortable: true,
         renderCell: (params) => <TelefonoBodyTemplate {...params.row} key={`telefono-${params.row.id}`} />
      },
      { field: "imei", headerName: "IMEI", sortable: true, renderCell: (params) => <ImeiBodyTemplate {...params.row} key={`imei-${params.row.id}`} /> },
      { field: "iccid", headerName: "ICCID", sortable: true, renderCell: (params) => <IccidBodyTemplate {...params.row} key={`iccid-${params.row.id}`} /> },
      {
         field: "estatus_lin",
         headerName: "Estatus Línea",
         sortable: true,
         renderCell: (params) => <EstatusLinBodyTemplate {...params.row} key={`estatus-${params.row.id}`} />
      },
      {
         field: "movimiento",
         headerName: "Movimiento",
         sortable: true,
         renderCell: (params) => <MovimientoBodyTemplate {...params.row} key={`mov-${params.row.id}`} />
      },
      {
         field: "fecha_activ",
         headerName: "Fecha Activación",
         sortable: true,
         renderCell: (params) => <FechaActivBodyTemplate {...params.row} key={`activ-${params.row.id}`} />
      },
      {
         field: "fecha_prim_llam",
         headerName: "Fecha 1ra Llamada",
         sortable: true,
         renderCell: (params) => <FechaPrimLlamBodyTemplate {...params.row} key={`prim-${params.row.id}`} />
      },
      { field: "fecha_dol", headerName: "Fecha DOL", sortable: true, renderCell: (params) => <FechaDolBodyTemplate {...params.row} key={`dol-${params.row.id}`} /> },
      {
         field: "estatus_pago",
         headerName: "Estatus Pago",
         sortable: true,
         renderCell: (params) => <EstatusPagoBodyTemplate {...params.row} key={`pago-${params.row.id}`} />
      },
      {
         field: "motivo_estatus",
         headerName: "Motivo Estatus",
         sortable: true,
         renderCell: (params) => <MotivoEstatusBodyTemplate {...params.row} key={`motivo-${params.row.id}`} />
      },
      {
         field: "monto_com",
         headerName: "Monto Comisión",
         sortable: true,
         renderCell: (params) => <MontoComBodyTemplate {...params.row} key={`monto-${params.row.id}`} />
      },
      {
         field: "tipo_comision",
         headerName: "Tipo Comisión",
         sortable: true,
         renderCell: (params) => <TipoComisionBodyTemplate {...params.row} key={`tipo-${params.row.id}`} />
      },
      {
         field: "evaluacion",
         headerName: "Evaluación",
         sortable: true,
         renderCell: (params) => <EvaluacionBodyTemplate {...params.row} key={`eval-${params.row.id}`} />
      },
      {
         field: "fza_vta_pago",
         headerName: "Fza Vta Pago",
         sortable: true,
         renderCell: (params) => <FzaVtaPagoBodyTemplate {...params.row} key={`fza-${params.row.id}`} />
      },
      {
         field: "fecha_evaluacion",
         headerName: "Fecha Evaluación",
         sortable: true,
         renderCell: (params) => <FechaEvaluacionBodyTemplate {...params.row} key={`feval-${params.row.id}`} />
      },
      {
         field: "folio_factura",
         headerName: "Folio Factura",
         sortable: true,
         renderCell: (params) => <FolioFacturaBodyTemplate {...params.row} key={`folio-${params.row.id}`} />
      },
      {
         field: "fecha_publicacion",
         headerName: "Fecha Publicación",
         sortable: true,
         renderCell: (params) => <FechaPublicacionBodyTemplate {...params.row} key={`fpub-${params.row.id}`} />
      },
      {
         field: "location_status",
         headerName: "Ubicación",
         sortable: true,
         renderCell: (params) => <LocationStatusBodyTemplate {...params.row} key={`loc-${params.row.id}`} />
      },
      {
         field: "activation_status",
         headerName: "Estatus Activación",
         sortable: true,
         renderCell: (params) => <ActivationStatusBodyTemplate {...params.row} key={`actst-${params.row.id}`} />
      }
   ];
   // #endregion COLUMNAS

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
         const res = await getChip(id);
         console.log("🚀 ~ handleClickLogout ~ res:", res);
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

         if (res.result.chip_description) res.result.chip_description == null && (res.result.chip_description = "");
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
         mySwal.fire(QuestionAlertConfig(`¿Estas seguro de eliminar el vendedor de ${name}?`, "CONFIRMAR")).then(async (result) => {
            if (result.isConfirmed) {
               setIsLoading(true);
               const res = await deleteChip(id);
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
            const res = await disEnableChip(id, !active);
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
         // console.log("cargar listado", allChips);
         await allChips.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            // register.actions = <ButtonsAction id={obj.id} name={obj.chip} active={obj.active} />;
            register.actions = [
               { label: "Editar", iconName: "Edit", tooltip: "", handleOnClick: () => handleClickEdit(obj.id), color: "blue" },
               { label: "Eliminar", iconName: "Delete", tooltip: "", handleOnClick: () => handleClickDelete(obj.id, obj.chip), color: "red" }
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
            <ExcelUploader columns={columnas} chunkSize={500} apiEndpoint="chips/import" headerRow={4} dataStartRow={5} onFinish={getAllChips} />
            <AssignmentForm   openDialog={openDialogAssignmentForm} setOpenDialog={setOpenDialogAssignmentForm} />
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
            numberColumnName={1}
            rowEdit={false}
            refreshTable={getAllChips}
            btnsExport={false}
            scrollHeight="75vh"
            // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
            // positionBtnsToolbar="center"
            // toolbarContentCenter={toolbarContentCenter}
            // toolbarContentEnd={toolbarContentEnd}
         />
      </>
   );
};
export default ChipDT;
