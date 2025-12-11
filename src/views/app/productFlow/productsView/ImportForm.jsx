import React, { useEffect, useRef, useState } from "react";
import FormikForm, { Input, Textarea, Select2, DateTimePicker, FileInput, FileInputModerno } from "../../../../components/forms";
import * as Yup from "yup";
import { DialogComponent, showDuplicatesAlert } from "../../../../components";
import {
   Grid,
   Typography,
   Button,
   Tooltip,
   FormGroup,
   Drawer,
   FormControlLabel,
   Switch,
   Paper,
   Box,
   Chip,
   List,
   ListItem,
   ListItemText,
   Divider,
   Collapse,
   IconButton
} from "@mui/material";
import { AttachMoneyRounded, UploadFileRounded, ExpandMore, ExpandLess, Summarize, Numbers, Folder } from "@mui/icons-material";
import Toast from "../../../../utils/Toast";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useProductContext } from "../../../../context/ProductContext";
import { color } from "framer-motion";
import { icons } from "../../../../constant";
import { useAuthContext } from "../../../../context/AuthContext";
import { useProductTypeContext } from "../../../../context/ProductTypeContext";
import useFetch from "../../../../hooks/useFetch";
import { Response } from "../../../../utils/Api";
import * as XLSX from "xlsx";
import sAlert from "../../../../utils/sAlert";
import { excelDateToJSDate } from "../../../../utils/Formats";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;

const Form = ({ formData, validations, formikRef, validationSchema, onSubmit, textBtnSubmit, handleCancel, fileSummary, FileSummaryComponent }) => {
   const initialValues = {};
   // const validations = {};
   const inputsForms = [];
   formData.forEach((field) => {
      // console.log("🚀 ~ field:", field);

      if (field.dividerBefore.show)
         inputsForms.push(<DividerComponent title={field.dividerBefore.title} orientation={field.dividerBefore.orientation} sx={field.dividerBefore.sx} />);
      inputsForms.push(field.input);
      initialValues[field.name] = field.value;
      if (formData[0].validationPage.length == 0) validations[field.name] = field.validations;
      // console.log("🚀 ~ formData.forEach ~ formData[0].validationPage.length == 0:", formData[0].validationPage.length == 0, formData[0].validationPage.length);
   });

   return (
      <FormikForm
         formikRef={formikRef}
         initialValues={initialValues}
         validationSchema={() => validationSchema()}
         onSubmit={onSubmit}
         alignContent={"center"}
         textBtnSubmit={textBtnSubmit}
         showCancelButton={true}
         handleCancel={handleCancel}
         showActionButtons={true}
         col={12}
         // maxHeight="73vh"
         // sizeCols={{}}
         spacing={2}
         maxHeight={"65vh"}
         // sizeCols={{}}
         container={true}
      >
         {inputsForms.map((input) => input)}
         {/* Mostrar resumen solo si hay datos */}
         {fileSummary.totalRegistros > 0 && <FileSummaryComponent />}
      </FormikForm>
   );
};

/**
 * Componente formulario Formik .
 *
 * Este componente renderiza un formulario y te permite elegir si deseas que sea contenido dentro de
 * un drawer lateral, un modal o sin contenedor.
 *
 * @component
 * @example
 * <UserForm
 * />
 *
 * @param {Object} props - Propiedades del componente.
 * @param {*} [props.openDialog] - State En dado caso se necesite abrir un segundo formulario en una vista
 * @param {*} [props.setOpenDialog] - Funcion del State
 * @param {*} [props.refetchSelect] - Funcion para refetchar el listado en caso se haya agregado un registro
 *
 * @returns {React.JSX.Element} El componente FormikForm.
 */
const ImportForm = ({ refetchSelect, openDialog, setOpenDialog, columns, apiEndpoint, chunkSize = 1000, headerRow = 1, dataStartRow }) => {
   const { auth } = useAuthContext();
   const { setIsLoading } = useGlobalContext();
   const formikRef = useRef(null);
   const { singularName, importProducts } = useProductContext();
   const { productTypesSelect, getSelectIndexProductTypes } = useProductTypeContext();

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const { refetch: refetchProductTypes } = useFetch(getSelectIndexProductTypes);
   const [imgFile, setImgFile] = useState([]);
   // const [helperTextImgFile, setHelperTextImgFile] = useState(null);

   // Estado para el resumen del archivo
   const [fileSummary, setFileSummary] = useState({
      totalRegistros: 0,
      foliosEncontrados: [],
      foliosUnicos: [],
      totalFolios: 0,
      registrosPorFolio: {},
      columnasDetectadas: [],
      errores: []
   });

   const [showSummary, setShowSummary] = useState(false);

   // Función para extraer folios del archivo
   const extractFoliosFromData = (data) => {
      if (!data || !Array.isArray(data)) return { folios: [], uniqueFolios: [] };

      // Buscar columnas que puedan contener folios (usando varias posibles claves)
      const folioKeys = ["folio", "FOLIO", "Folio", "fol_factura", "FOLIO_FACTURA", "factura", "FACTURA"];

      let allFolios = [];
      let uniqueFolios = new Set();
      let registrosPorFolio = {};

      data.forEach((row, index) => {
         let folioEncontrado = null;

         // Buscar en las posibles claves de folio
         for (const key of folioKeys) {
            if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
               folioEncontrado = String(row[key]).trim();
               break;
            }
         }

         // Si no se encontró en las claves conocidas, buscar en cualquier columna que tenga "folio" en el nombre
         if (!folioEncontrado) {
            Object.keys(row).forEach((key) => {
               if (key.toLowerCase().includes("folio") && row[key]) {
                  folioEncontrado = String(row[key]).trim();
               }
            });
         }

         if (folioEncontrado) {
            allFolios.push(folioEncontrado);
            uniqueFolios.add(folioEncontrado);

            // Contar registros por folio
            if (!registrosPorFolio[folioEncontrado]) {
               registrosPorFolio[folioEncontrado] = 0;
            }
            registrosPorFolio[folioEncontrado]++;
         }
      });

      return {
         folios: allFolios,
         uniqueFolios: Array.from(uniqueFolios),
         registrosPorFolio
      };
   };

   const handleFile = (file) => {
      setIsLoading(true);
      const reader = new FileReader();

      reader.onload = async (e) => {
         try {
            const dataExcel = new Uint8Array(e.target.result);
            const workbook = XLSX.read(dataExcel, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Configurar fila de encabezado y fila de inicio de datos
            const hr = headerRow ?? 1;
            const dsr = dataStartRow ?? hr + 1;

            // Convertir Excel a JSON
            let jsonData = XLSX.utils.sheet_to_json(sheet, {
               defval: null,
               range: hr - 1
            });

            // Cortar filas previas si se especificó dataStartRow
            const skip = Math.max(0, dsr - hr - 1);
            if (skip > 0) jsonData = jsonData.slice(skip);

            // Obtener columnas detectadas
            const columnasDetectadas = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

            // Convertir fechas si aplica
            if (Array.isArray(jsonData) && columns?.length) {
               jsonData = jsonData.map((row) => {
                  const newRow = { ...row };
                  columns.forEach((col) => {
                     if (String(col).toLowerCase().includes("fecha")) {
                        try {
                           const raw = newRow[col];
                           newRow[col] = raw !== null && raw !== "" && raw !== undefined ? excelDateToJSDate(raw) : null;
                           console.log("🚀 ~ handleFile ~ newRow[col]:", newRow[col])
                        } catch {
                           newRow[col] = null;
                        }
                     }
                  });
                  return newRow;
               });
            }

            // Validación
            const errores = [];
            const validos = [];

            jsonData.forEach((row, index) => {
               let filaValida = true;

               columns.forEach((col) => {
                  const val = row[col.name];

                  // Validar requeridos
                  if (col.required && (val === null || val === "")) {
                     filaValida = false;
                     errores.push(`Fila ${index + 2}, columna ${col.name}: campo obligatorio vacío`);
                  }

                  // Validación custom
                  if (col.validate && val !== null && val !== "" && !col.validate(val)) {
                     filaValida = false;
                     errores.push(`Fila ${index + 2}, columna ${col.name}: valor inválido -> ${val}`);
                  }
               });

               if (filaValida) validos.push(row);
            });

            // Extraer información de folios
            const foliosInfo = extractFoliosFromData(validos);

            // Crear resumen del archivo
            const summary = {
               totalRegistros: validos.length,
               foliosEncontrados: foliosInfo.folios,
               foliosUnicos: foliosInfo.uniqueFolios,
               totalFolios: foliosInfo.uniqueFolios.length,
               registrosPorFolio: foliosInfo.registrosPorFolio,
               columnasDetectadas,
               errores
            };

            // Actualizar estado con el resumen
            setFileSummary(summary);

            // Mostrar resumen automáticamente si hay folios
            if (foliosInfo.uniqueFolios.length > 0) {
               setShowSummary(true);
            }

            // Mostrar errores si los hay
            if (errores.length) {
               errores.forEach((err) => Toast.Warning(err));
            }

            // Agregar info del archivo
            const fileData = {
               name: file.name,
               size: file.size,
               type: file.type,
               lastModified: file.lastModified
            };

            // ✅ En lugar de enviar, solo devolvemos los datos válidos
            setIsLoading(false);
            const msgToast = `Validación completa. Registros válidos: ${validos.length} | Folios detectados: ${foliosInfo.uniqueFolios.length}`;
            Toast.Success(msgToast);
            // setHelperTextImgFile(msgToast);
            formikRef.current.setFieldValue("data", validos);
            formikRef.current.setFieldValue("fileData", fileData);

            console.log("Resumen del archivo:", summary);
            return validos;
         } catch (error) {
            console.error("Error procesando archivo Excel:", error);
            Toast.Error("Error al procesar el archivo Excel");
            setIsLoading(false);
         }
      };

      reader.readAsArrayBuffer(file);
   };

   // Componente para mostrar el resumen
   const FileSummaryComponent = () => (
      <Paper
         elevation={2}
         sx={{
            mt: 0,
            mb: 2,
            p: 2,
            backgroundColor: "grey.50",
            borderLeft: "4px solid",
            borderColor: "primary.main",
            width: "100%"
         }}
      >
         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
               <Summarize color="primary" />
               Resumen del Archivo
            </Typography>
            <IconButton size="small" onClick={() => setShowSummary(!showSummary)} title={showSummary ? "Ocultar resumen" : "Mostrar resumen"}>
               {showSummary ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
         </Box>

         <Collapse in={showSummary} sx={{ width: "100%" }}>
            <Grid container sx={{ width: "100%" }} spacing={2}>
               {/* Estadísticas generales */}
               <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "white" }}>
                     <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Estadísticas Generales
                     </Typography>
                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                        <Box textAlign="center">
                           <Typography variant="h4" color="primary.main" fontWeight="bold">
                              {fileSummary.totalRegistros}
                           </Typography>
                           <Typography variant="caption" color="text.secondary">
                              Registros
                           </Typography>
                        </Box>
                        <Box textAlign="center">
                           <Typography variant="h4" color="secondary.main" fontWeight="bold">
                              {fileSummary.totalFolios}
                           </Typography>
                           <Typography variant="caption" color="text.secondary">
                              Folios Únicos
                           </Typography>
                        </Box>
                        <Box textAlign="center">
                           <Typography variant="h4" color="success.main" fontWeight="bold">
                              {fileSummary.columnasDetectadas.length}
                           </Typography>
                           <Typography variant="caption" color="text.secondary">
                              Columnas
                           </Typography>
                        </Box>
                     </Box>
                  </Paper>
               </Grid>

               {/* Folios detectados */}
               <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "white", maxHeight: 200, overflow: "auto" }}>
                     <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Folder fontSize="small" />
                        Folios Detectados ({fileSummary.totalFolios})
                     </Typography>
                     {fileSummary.foliosUnicos.length > 0 ? (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                           {fileSummary.foliosUnicos.slice(0, 10).map((folio, index) => (
                              <Chip
                                 key={index}
                                 label={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                       <Numbers fontSize="small" />
                                       <span>{folio}</span>
                                       {fileSummary.registrosPorFolio[folio] && (
                                          <Chip label={fileSummary.registrosPorFolio[folio]} size="small" sx={{ height: 18, ml: 0.5 }} />
                                       )}
                                    </Box>
                                 }
                                 variant="outlined"
                                 size="small"
                                 sx={{
                                    borderColor: "primary.light",
                                    backgroundColor: index < 3 ? "primary.50" : "transparent"
                                 }}
                              />
                           ))}
                           {fileSummary.foliosUnicos.length > 10 && (
                              <Chip label={`+${fileSummary.foliosUnicos.length - 10} más`} size="small" variant="outlined" color="secondary" />
                           )}
                        </Box>
                     ) : (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                           No se detectaron folios en el archivo
                        </Typography>
                     )}
                  </Paper>
               </Grid>

               {/* Detalle por folio */}
               {/* {fileSummary.totalFolios > 0 && fileSummary.totalFolios <= 10 && (
                  <Grid size={{xs:12}}>
                     <Paper sx={{ p: 2, backgroundColor: "white" }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                           Registros por Folio
                        </Typography>
                        <List dense>
                           {Object.entries(fileSummary.registrosPorFolio)
                              .sort((a, b) => b[1] - a[1])
                              .map(([folio, cantidad]) => (
                                 <React.Fragment key={folio}>
                                    <ListItem>
                                       <ListItemText
                                          primary={
                                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="body2">{folio}</Typography>
                                                <Chip label={`${cantidad} registro${cantidad !== 1 ? "s" : ""}`} size="small" color="primary" variant="outlined" />
                                             </Box>
                                          }
                                       />
                                    </ListItem>
                                    <Divider component="li" />
                                 </React.Fragment>
                              ))}
                        </List>
                     </Paper>
                  </Grid>
               )} */}

               {/* Información adicional */}
               {/* <Grid size={{ xs: 12 }}>
                  <Paper sx={{ p: 2, backgroundColor: "white" }}>
                     <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Información del Archivo
                     </Typography>
                     <Grid container spacing={1}>
                        <Grid size={{ xs: 12 }} sm={6}>
                           <Typography variant="body2">
                              <strong>Columnas detectadas:</strong> {fileSummary.columnasDetectadas.length}
                           </Typography>
                           {fileSummary.columnasDetectadas.length > 0 && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                                 {fileSummary.columnasDetectadas.slice(0, 5).join(", ")}
                                 {fileSummary.columnasDetectadas.length > 5 && "..."}
                              </Typography>
                           )}
                        </Grid>
                        <Grid size={{ xs: 12 }} sm={6}>
                           <Typography variant="body2">
                              <strong>Errores de validación:</strong> {fileSummary.errores.length}
                           </Typography>
                           {fileSummary.errores.length > 0 && (
                              <Typography variant="caption" color="error.main" sx={{ display: "block", mt: 0.5 }}>
                                 Revisar los errores antes de continuar
                              </Typography>
                           )}
                        </Grid>
                     </Grid>
                  </Paper>
               </Grid> */}
            </Grid>
         </Collapse>

         {/* Mini resumen siempre visible */}
         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
               {fileSummary.totalRegistros} registros • {fileSummary.totalFolios} folios
            </Typography>
            {fileSummary.errores.length > 0 && (
               <Chip label={`${fileSummary.errores.length} error${fileSummary.errores.length !== 1 ? "es" : ""}`} size="small" color="warning" />
            )}
         </Box>
      </Paper>
   );

   const formData = [
      {
         name: "id",
         input: <Input key={`key-input-id`} col={1} idName="id" label="ID" hidden />,
         value: null,
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "data",
         input: <Input key={`key-input-data`} col={1} idName="data" label="Data" hidden />,
         value: null,
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "fileData",
         input: <Input key={`key-input-fileData`} col={1} idName="fileData" label="fileData" hidden />,
         value: null,
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "product_type_id",
         input: (
            <Select2
               key={`key-input-product_type_id`}
               col={12}
               idName="product_type_id"
               label="Tipo de Producto"
               options={productTypesSelect ?? []}
               refreshSelect={refetchProductTypes}
               addRegister={auth.permissions.create}
               required
            />
         ),
         value: "",
         validations: Yup.number().min(1, "Esta opción no es valida").required("Tipo de producto requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "file",
         input: (
            <FileInputModerno
               col="12"
               idName="file"
               label="Cargar Archivo Excel: (ListadoTramitesPrepagoGral)"
               filePreviews={imgFile}
               handleUploadingFile={(files) => {
                  const f = files && files[0].file;
                  if (f) {
                     // Resetear resumen antes de procesar nuevo archivo
                     setFileSummary({
                        totalRegistros: 0,
                        foliosEncontrados: [],
                        foliosUnicos: [],
                        totalFolios: 0,
                        registrosPorFolio: {},
                        columnasDetectadas: [],
                        errores: []
                     });
                     setShowSummary(false);
                     handleFile(f);
                  }
               }}
               // helperText={helperTextImgFile}
               setFilePreviews={setImgFile}
               multiple={false}
               accept={".xlsx,.xls,.csv"}
               required
            />
         ),
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      }
   ];

   const validations = {};

   const validationSchema = (page = null) => {
      if (!page) return Yup.object().shape(validations);

      const formDataPerPage = formData.filter((item) => item.validationPage.includes(page));
      const validationsPerPage = [];
      formDataPerPage.forEach((field) => {
         validationsPerPage[field.name] = field.validations;
      });
      return Yup.object().shape(validationsPerPage);
   };

   const onSubmit = async (values, { setSubmitting, resetForm }) => {
      setIsLoading(true);
      const res = await importProducts(values);

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

      if (res.duplicados && res.duplicados.length > 0) showDuplicatesAlert(res.duplicados);

      await resetForm();
      setImgFile([]);
      setFileSummary({
         totalRegistros: 0,
         foliosEncontrados: [],
         foliosUnicos: [],
         totalFolios: 0,
         registrosPorFolio: {},
         columnasDetectadas: [],
         errores: []
      });
      setShowSummary(false);

      formikRef.current.resetForm();
      formikRef.current.setValues(formikRef.current.initialValues);

      if (res.alert_text) Toast.Success(res.alert_text);

      setSubmitting(false);
      setIsLoading(false);
      if (refetchSelect) await refetchSelect();
      if (!checkAdd) setOpenDialog(false);
   };

   const handleCancel = () => {
      formikRef.current.resetForm();
      formikRef.current.setValues(formikRef.current.initialValues);
      setImgFile([]);
      setFileSummary({
         totalRegistros: 0,
         foliosEncontrados: [],
         foliosUnicos: [],
         totalFolios: 0,
         registrosPorFolio: {},
         columnasDetectadas: [],
         errores: []
      });
      setShowSummary(false);
      if (refetchSelect) refetchSelect();
      if (!checkAdd) setOpenDialog(false);
   };

   const handleChangeCheckAdd = (checked) => {
      try {
         localStorage.setItem("checkAdd", checked);
         setCheckAdd(checked);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   return (
      <>
         <Button
            variant="contained"
            startIcon={<UploadFileRounded />}
            onClick={() => {
               setImgFile([]);
               setFileSummary({
                  totalRegistros: 0,
                  foliosEncontrados: [],
                  foliosUnicos: [],
                  totalFolios: 0,
                  registrosPorFolio: {},
                  columnasDetectadas: [],
                  errores: []
               });
               setShowSummary(false);
               setOpenDialog(true);
            }}
            disabled={!auth.permissions.create}
            color="primary"
         >
            IMPORTAR (CARGA MASIVA)
         </Button>

         <DialogComponent
            open={openDialog}
            setOpen={setOpenDialog}
            modalTitle={
               <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                  <Typography className="font-extrabold text-center" variant="h4" fontWeight={"bold"}>
                     {"CARGA MASIVA"}
                  </Typography>

                  <Tooltip title={"Al estar activo, el formulario no se cerrará al terminar un registro"}>
                     <FormGroup sx={{}}>
                        <FormControlLabel
                           control={<Switch defaultChecked={checkAdd} color="dark" />}
                           label={"Seguir Agregando"}
                           sx={{ opacity: checkAdd ? 1 : 0.35 }}
                           onChange={(e) => handleChangeCheckAdd(e.target.checked)}
                        />
                     </FormGroup>
                  </Tooltip>
               </Grid>
            }
            fullScreen={false}
            height={undefined}
            formikRef={undefined}
            textBtnSubmit={undefined}
         >
            <Form
               formData={formData}
               validations={validations}
               formikRef={formikRef}
               validationSchema={validationSchema}
               onSubmit={onSubmit}
               textBtnSubmit={"CARGAR REGISTROS"}
               handleCancel={handleCancel}
               fileSummary={fileSummary}
               FileSummaryComponent={FileSummaryComponent}
            />
         </DialogComponent>
      </>
   );
};

// const ImportForm = ({ refetchSelect, openDialog, setOpenDialog, columns, apiEndpoint, chunkSize = 1000, headerRow = 1, dataStartRow }) => {
//    const { auth } = useAuthContext();
//    const { setIsLoading } = useGlobalContext();
//    // const {setAllProducts,getSelectIndexRoles}=useProductContext()
//    const formikRef = useRef(null);
//    const { singularName, product, textBtnSubmit, setTextBtnSubmit, isEdit, setIsEdit, importProducts } = useProductContext();
//    const { productTypesSelect, setProductTypesSelect, getSelectIndexProductTypes } = useProductTypeContext();

//    const [checkAdd, setCheckAdd] = useState(checkAddInitialState);

//    const { refetch: refetchProductTypes } = useFetch(getSelectIndexProductTypes, setProductTypesSelect);
//    const [imgFile, setImgFile] = useState([]);
//    const [helperTextImgFile, setHelperTextImgFile] = useState(null);

//    const handleFile = (file) => {
//       setIsLoading(true);
//       const reader = new FileReader();

//       reader.onload = async (e) => {
//          try {
//             const dataExcel = new Uint8Array(e.target.result);
//             const workbook = XLSX.read(dataExcel, { type: "array" });
//             const sheetName = workbook.SheetNames[0];
//             const sheet = workbook.Sheets[sheetName];

//             // Configurar fila de encabezado y fila de inicio de datos
//             const hr = headerRow ?? 1;
//             const dsr = dataStartRow ?? hr + 1;

//             // Convertir Excel a JSON
//             let jsonData = XLSX.utils.sheet_to_json(sheet, {
//                defval: null,
//                range: hr - 1
//             });

//             // Cortar filas previas si se especificó dataStartRow
//             const skip = Math.max(0, dsr - hr - 1);
//             if (skip > 0) jsonData = jsonData.slice(skip);

//             // Convertir fechas si aplica
//             if (Array.isArray(jsonData) && columns?.length) {
//                jsonData = jsonData.map((row) => {
//                   const newRow = { ...row };
//                   columns.forEach((col) => {
//                      if (String(col).toLowerCase().includes("fecha")) {
//                         try {
//                            const raw = newRow[col];
//                            newRow[col] = raw !== null && raw !== "" && raw !== undefined ? excelDateToJSDate(raw) : null;
//                         } catch {
//                            newRow[col] = null;
//                         }
//                      }
//                   });
//                   return newRow;
//                });
//                // console.log("🚀 ~ handleFile ~ jsonData:", jsonData);
//             }

//             // Validación
//             const errores = [];
//             const validos = [];

//             jsonData.forEach((row, index) => {
//                let filaValida = true;

//                columns.forEach((col) => {
//                   const val = row[col.name];

//                   // Validar requeridos
//                   if (col.required && (val === null || val === "")) {
//                      filaValida = false;
//                      errores.push(`Fila ${index + 2}, columna ${col.name}: campo obligatorio vacío`);
//                   }

//                   // Validación custom
//                   if (col.validate && val !== null && val !== "" && !col.validate(val)) {
//                      filaValida = false;
//                      errores.push(`Fila ${index + 2}, columna ${col.name}: valor inválido -> ${val}`);
//                   }
//                });

//                // // Agregar info del archivo
//                // row.fileData = {
//                //    name: file.name,
//                //    size: file.size,
//                //    type: file.type,
//                //    lastModified: file.lastModified
//                // };

//                if (filaValida) validos.push(row);
//             });

//             // Mostrar errores si los hay
//             if (errores.length) {
//                errores.forEach((err) => Toast.Error(err));
//             }

//             // Agregar info del archivo
//             const fileData = {
//                name: file.name,
//                size: file.size,
//                type: file.type,
//                lastModified: file.lastModified
//             };

//             // ✅ En lugar de enviar, solo devolvemos los datos válidos
//             setIsLoading(false);
//             const msgToast = `Validación completa. Registros por registrar: ${validos.length}`;
//             Toast.Success(msgToast);
//             setHelperTextImgFile(msgToast);
//             formikRef.current.setFieldValue("data", validos);
//             formikRef.current.setFieldValue("fileData", fileData);
//             // Llamar callback si se proporciona
//             // if (onFinish) onFinish(validos);

//             // console.log("🚀 ~ handleFile ~ validos:", validos);
//             return validos;
//          } catch (error) {
//             console.error("Error procesando archivo Excel:", error);
//             Toast.Error("Error al procesar el archivo Excel");
//             setIsLoading(false);
//          }
//       };

//       reader.readAsArrayBuffer(file);
//    };

//    const formData = [
//       {
//          name: "id",
//          input: <Input key={`key-input-id`} col={1} idName="id" label="ID" hidden />,
//          value: null,
//          validations: null,
//          validationPage: [],
//          dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
//       },
//       {
//          name: "data",
//          input: <Input key={`key-input-data`} col={1} idName="data" label="Data" hidden />,
//          value: null,
//          validations: null,
//          validationPage: [],
//          dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
//       },
//       {
//          name: "fileData",
//          input: <Input key={`key-input-fileData`} col={1} idName="fileData" label="fileData" hidden />,
//          value: null,
//          validations: null,
//          validationPage: [],
//          dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
//       },
//       {
//          name: "product_type_id",
//          input: (
//             <Select2
//                key={`key-input-product_type_id`}
//                col={12}
//                idName="product_type_id"
//                label="Tipo de Producto"
//                options={productTypesSelect ?? []}
//                refreshSelect={refetchProductTypes}
//                addRegister={auth.permissions.create}
//                required
//             />
//          ),
//          value: "",
//          validations: Yup.number().min(1, "Esta opción no es valida").required("Tipo de producto requerido"),
//          validationPage: [],
//          dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
//       },
//       {
//          name: "file",
//          input: (
//             <FileInputModerno
//                col="12"
//                idName="file"
//                label="Cargar Archivo Excel: (ListadoTramitesPrepagoGral)"
//                filePreviews={imgFile}
//                handleUploadingFile={(files) => {
//                   // console.log("🚀 ~ ImportForm ~ files:", files);
//                   // if (files.length > 0) setImgFile(files[0]);
//                   // const f = e.target.files && e.target.files[0];
//                   const f = files && files[0].file;
//                   if (f) handleFile(f);
//                }}
//                helperText={helperTextImgFile}
//                setFilePreviews={setImgFile}
//                multiple={false}
//                accept={".xlsx,.xls,.csv"}
//                required
//             />
//          ),
//          value: "",
//          validations: null,
//          validationPage: [],
//          dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
//       }
//    ];

//    const validations = {};

//    const validationSchema = (page = null) => {
//       if (!page) return Yup.object().shape(validations);

//       const formDataPerPage = formData.filter((item) => item.validationPage.includes(page));
//       const validationsPerPage = [];
//       formDataPerPage.forEach((field) => {
//          validationsPerPage[field.name] = field.validations;
//       });
//       return Yup.object().shape(validationsPerPage);
//    };
//    const onSubmit = async (values, { setSubmitting, resetForm }) => {
//       // console.log("🚀 ~ onSubmit ~ validationSchema:", validationSchema());
//       // return console.log("🚀 ~ onSubmit ~ values:", values);
//       setIsLoading(true);
//       // values.file = imgFile.length == 0 ? "" : imgFile[0].file;
//       // console.log("🚀 ~ onSubmit ~ values:", values);
//       // return setIsLoading(false);
//       const res = await importProducts(values);
//       // console.log("🚀 ~ onSubmit ~ res:", res);
//       if (!res) return setIsLoading(false);
//       if (res.errors) {
//          setIsLoading(false);
//          Object.values(res.errors).forEach((errors) => {
//             errors.map((error) => Toast.Warning(error));
//          });
//          return;
//       } else if (res.status_code !== 200) {
//          setIsLoading(false);
//          return Toast.Customizable(res.alert_text, res.alert_icon);
//       }
//       if (res.duplicados && res.duplicados.length > 0) showDuplicatesAlert(res.duplicados);

//       await resetForm();
//       setImgFile([]);
//       formikRef.current.resetForm();
//       formikRef.current.setValues(formikRef.current.initialValues);
//       if (res.alert_text) Toast.Success(res.alert_text);

//       setSubmitting(false);
//       setIsLoading(false);
//       if (refetchSelect) await refetchSelect();
//       if (!checkAdd) setOpenDialog(false);
//    };
//    const handleCancel = () => {
//       formikRef.current.resetForm();
//       formikRef.current.setValues(formikRef.current.initialValues);
//       // setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
//       // setTextBtnSubmit("AGREGAR");
//       setImgFile([]);
//       setIsEdit(false);
//       if (refetchSelect) refetchSelect();
//       if (!checkAdd) setOpenDialog(false);
//    };

//    const handleChangeCheckAdd = (checked) => {
//       // console.log("🚀 ~ handleChangeCheckAdd ~ checked:", checked);
//       try {
//          localStorage.setItem("checkAdd", checked);
//          setCheckAdd(checked);
//       } catch (error) {
//          console.log(error);
//          Toast.Error(error);
//       }
//    };

//    useEffect(() => {
//       // console.log("🚀 Form ~ useEffect :");
//       // console.log("🚀 Form ~ useEffect ~ isEdit:", isEdit);
//    }, [product, formikRef, isEdit]);

//    return (
//       <>
//          <Button
//             variant="contained"
//             startIcon={<UploadFileRounded />}
//             onClick={() => {
//                setImgFile([]);
//                setOpenDialog(true);
//             }}
//             disabled={!auth.permissions.create}
//             color="primary"
//          >
//             IMPORTAR (CARGA MASIVA)
//          </Button>

//          <DialogComponent
//             open={openDialog}
//             setOpen={setOpenDialog}
//             modalTitle={
//                <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
//                   <Typography className="font-extrabold text-center" variant="h4" fontWeight={"bold"}>
//                      {"CARGA MASIVA"}
//                   </Typography>

//                   <Tooltip title={"Al estar activo, el formulario no se cerrará al terminar un registro"}>
//                      <FormGroup sx={{}}>
//                         <FormControlLabel
//                            control={<Switch defaultChecked={checkAdd} color="dark" />}
//                            label={"Seguir Agregando"}
//                            sx={{ opacity: checkAdd ? 1 : 0.35 }}
//                            onChange={(e) => handleChangeCheckAdd(e.target.checked)}
//                         />
//                      </FormGroup>
//                   </Tooltip>
//                </Grid>
//             }
//             fullScreen={false}
//             height={undefined}
//             formikRef={undefined}
//             textBtnSubmit={undefined}
//          >
//             <Form
//                formData={formData}
//                validations={validations}
//                formikRef={formikRef}
//                validationSchema={validationSchema}
//                onSubmit={onSubmit}
//                textBtnSubmit={"CARGAR REGISTROS"}
//                handleCancel={handleCancel}
//             />
//          </DialogComponent>
//       </>
//    );
// };

export default ImportForm;
