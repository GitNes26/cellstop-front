import { useEffect, useRef } from "react";
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

const columnas = [
   "FILTRO",
   "TELEFONO",
   "IMEI",
   "ICCID",
   "ESTATUS",
   "LIN",
   "MOVIMIENTO",
   "FECHA_ACTIV",
   "FECHA_PRIM_LLAM",
   "FECHA_DOL",
   "ESTATUS_PAGO",
   "MOTIVO_ESTATUS",
   "MONTO_COM",
   "TIPO_COMISION",
   "EVALUACION",
   "FZA_VTA_PAGO",
   "FECHA_EVALUACION",
   "FOLIO",
   "FACTURA",
   "FECHA_PUBLICACION"
];

// Validaciones por columna: null = opcional
const validaciones = {
   TELEFONO: (v) => /^\d{10}$/.test(v),
   IMEI: (v) => /^\d{15}$/.test(v),
   ICCID: (v) => !!v && v.length >= 10,
   ESTATUS: null,
   LIN: null,
   MOVIMIENTO: null,
   FECHA_ACTIV: (v) => !isNaN(Date.parse(v)),
   FECHA_PRIM_LLAM: (v) => !v || !isNaN(Date.parse(v)), // opcional
   FECHA_DOL: (v) => !v || !isNaN(Date.parse(v)),
   ESTATUS_PAGO: null,
   MOTIVO_ESTATUS: null,
   MONTO_COM: (v) => !isNaN(Number(v)),
   TIPO_COMISION: null,
   EVALUACION: null,
   FZA_VTA_PAGO: null,
   FECHA_EVALUACION: (v) => !v || !isNaN(Date.parse(v)),
   FOLIO: null,
   FACTURA: null,
   FECHA_PUBLICACION: (v) => !v || !isNaN(Date.parse(v))
};

const ChipDT = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const { singularName, allChips, setFormTitle, setTextBtnSubmit, formikRef, setIsEdit, deleteChip, disEnableChip, getAllChips, getChip, importChips } =
      useChipContext();
   const mySwal = withReactContent(Swal);
   const fileInputRef = useRef(null);

   //#region COLUMNAS
   const fontSizeTable = { text: "sm", subtext: "xs" };
   const globalFilterFields = ["iccid", "operator", "chip_description", "active", "created_at"];

   // #region BodysTemplate
   const IccidBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text} className="font-black">
         {obj.iccid}
      </Typography>
   );
   const OperatorBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.operator}
      </Typography>
   );
   const DescriptionBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.chip_description}
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
         field: "iccid",
         headerName: "ICCID",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <IccidBodyTemplate {...params.row} key={`iccid-${params.row.id}`} />,
         filter: true,
         filterField: null
      },
      {
         field: "operator",
         headerName: "Operadora",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <OperatorBodyTemplate {...params.row} key={`operator-${params.row.id}`} />,
         filter: true,
         filterField: null
      },
      {
         field: "chip_description",
         headerName: "Descripción",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <DescriptionBodyTemplate {...params.row} key={`description-${params.row.id}`} />,
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
   const toolbarContentEnd = (
      <Stack direction="row" spacing={1} alignItems="center">
         <ExcelUploader columns={columnas} validations={validaciones} apiEndpoint={`${env.API_URL}/chips/import`} />
         <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            style={{ display: "none" }}
            onChange={async (e) => {
               try {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setIsLoading(true);
                  const res = await importChips(file);
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
                  if (res.alert_text) Toast.Success(res.alert_text);
                  await getAllChips();
                  setIsLoading(false);
               } catch (error) {
                  console.log(error);
                  Toast.Error(error);
                  setIsLoading(false);
               } finally {
                  // limpiar input para poder re-subir mismo archivo si se desea
                  e.target.value = "";
               }
            }}
         />
         <Button variant="contained" startIcon={<UploadFileRounded />} onClick={() => fileInputRef.current?.click()} disabled={!auth.permissions.create}>
            Importar
         </Button>
      </Stack>
   );

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
            <input
               ref={fileInputRef}
               type="file"
               accept=".xlsx,.xls,.csv"
               style={{ display: "none" }}
               onChange={async (e) => {
                  try {
                     const file = e.target.files?.[0];
                     if (!file) return;
                     setIsLoading(true);
                     const res = await importChips(file);
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
                     if (res.alert_text) Toast.Success(res.alert_text);
                     await getAllChips();
                     setIsLoading(false);
                  } catch (error) {
                     console.log(error);
                     Toast.Error(error);
                     setIsLoading(false);
                  } finally {
                     // limpiar input para poder re-subir mismo archivo si se desea
                     e.target.value = "";
                  }
               }}
            />
            <Button variant="contained" startIcon={<UploadFileRounded />} onClick={() => fileInputRef.current?.click()} disabled={!auth.permissions.create}>
               Importar (Carga Masiva)
            </Button>
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
            scrollHeight="80vh"
            // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
            // positionBtnsToolbar="center"
            // toolbarContentCenter={toolbarContentCenter}
            // toolbarContentEnd={toolbarContentEnd}
         />
      </>
   );
};
export default ChipDT;
