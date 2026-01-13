import {
   Button,
   FormControlLabel,
   FormGroup,
   Grid,
   Switch,
   Tooltip,
   Typography,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   Chip,
   Box,
   Alert
} from "@mui/material";
import FormikForm, { DateTimePicker, DividerComponent, FileInputModerno, Input } from "../../../../components/forms";
import * as Yup from "yup";
import { DialogComponent } from "../../../../components";
import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useProductContext } from "../../../../context/ProductContext";
import { UploadFile, Visibility, VisibilityOff, CheckCircle, Error, Warning, Info } from "@mui/icons-material";
import { useAuthContext } from "../../../../context/AuthContext";
import Toast from "../../../../utils/Toast";
import * as XLSX from "xlsx";
import showFlexibleAlert, { ALERT_TYPES } from "../../../../components/showDuplicatesAlert";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { QuestionAlertConfig } from "../../../../utils/sAlert";
import dayjs from "dayjs";

const checkAddInitialState = localStorage.getItem("checkAddPortaciones") == "true" ? true : false || false;

// Mapeo de columnas del Excel para portaciones
const excelPortacionesMap = {
   telefono: "telefono",
   Telefono: "telefono",
   TELEFONO: "telefono",
   celular: "telefono",
   Celular: "telefono",
   CELULAR: "telefono",
   numero: "telefono",
   Número: "telefono",
   NÚMERO: "telefono",

   fechaActivacion: "fecha_activacion",
   FechaActivacion: "fecha_activacion",
   FECHAACTIVACION: "fecha_activacion",
   "fecha activacion": "fecha_activacion",
   "Fecha Activacion": "fecha_activacion",
   "FECHA ACTIVACION": "fecha_activacion",

   fechaPortacion: "fecha_portacion",
   FechaPortacion: "fecha_portacion",
   FECHAPORTACION: "fecha_portacion",
   "fecha portacion": "fecha_portacion",
   "Fecha Portacion": "fecha_portacion",
   "FECHA PORTACION": "fecha_portacion",
   portacion: "fecha_portacion",

   fzaVentas: "fza_ventas",
   FzaVentas: "fza_ventas",
   FZAVENTAS: "fza_ventas",
   "fza ventas": "fza_ventas",
   "Fza Ventas": "fza_ventas",
   "FZA VENTAS": "fza_ventas",

   descripFzaVta: "descrip_fza_vta",
   DescripFzaVta: "descrip_fza_vta",
   DESCRIPFZAVTA: "descrip_fza_vta",
   "descrip fza vta": "descrip_fza_vta",
   "Descrip Fza Vta": "descrip_fza_vta",
   "DESCRIP FZA VTA": "descrip_fza_vta",
   descripcion: "descrip_fza_vta",
   Descripcion: "descrip_fza_vta"
};

const Form = ({ formData, validations, formikRef, validationSchema, onSubmit, textBtnSubmit, handleCancel, container = "modal" }) => {
   const initialValues = {};
   const inputsForms = [];
   formData.forEach((field) => {
      if (field.dividerBefore.show)
         inputsForms.push(<DividerComponent title={field.dividerBefore.title} orientation={field.dividerBefore.orientation} sx={field.dividerBefore.sx} />);
      inputsForms.push(field.input);
      initialValues[field.name] = field.value;
      if (formData[0].validationPage.length == 0) validations[field.name] = field.validations;
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
         spacing={2}
         maxHeight={container === "drawer" ? "70vh" : container === "modal" ? "65vh" : "auto"}
         container={["drawer", "modal"].includes(container)}
      >
         {inputsForms.map((input) => input)}
      </FormikForm>
   );
};

const ImportPortabitiesFrom = ({ openDialog, setOpenDialog }) => {
   const { auth } = useAuthContext();
   const { setIsLoading } = useGlobalContext();
   const { importPortabilities } = useProductContext(); // Necesitarías crear esta función en tu contexto
   const formikRef = useRef(null);
   const [imgFile, setImgFile] = useState([]);

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [fileData, setFileData] = useState(null);
   const [processedData, setProcessedData] = useState([]);
   const [showDetails, setShowDetails] = useState(false);
   const [validationResults, setValidationResults] = useState({
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      duplicatePhones: 0,
      missingTelefono: 0,
      invalidDates: 0
   });
   const [validationErrors, setValidationErrors] = useState([]);
   const [columnMapping, setColumnMapping] = useState(null);
   const mySwal = withReactContent(Swal);

   const init = () => {
      setFileData(null);
      setProcessedData([]);
      setShowDetails(false);
      setValidationResults({
         totalRows: 0,
         validRows: 0,
         invalidRows: 0,
         duplicatePhones: 0,
         missingTelefono: 0,
         invalidDates: 0
      });
      setValidationErrors([]);
      setColumnMapping(null);
   };

   useEffect(() => {
      if (openDialog) {
         formikRef?.current?.resetForm();
         formikRef?.current?.setValues(formikRef.current.initialValues);
         init();
      }
   }, [openDialog]);

   const detectColumnMapping = (headers) => {
      const mapping = {};

      headers.forEach((header, index) => {
         if (!header) return;

         const headerStr = String(header).trim();
         const normalizedHeader = headerStr.toLowerCase();

         // Buscar coincidencia en el mapeo
         for (const [excelKey, dbKey] of Object.entries(excelPortacionesMap)) {
            if (excelKey.toLowerCase() === normalizedHeader) {
               mapping[dbKey] = index;
               break;
            }
         }

         // Si no se encontró coincidencia exacta, intentar búsqueda parcial
         if ((!mapping["telefono"] && normalizedHeader.includes("telefono")) || normalizedHeader.includes("celular") || normalizedHeader.includes("numero")) {
            mapping["telefono"] = index;
         }
         if (!mapping["fecha_activacion"] && normalizedHeader.includes("activacion")) {
            mapping["fecha_activacion"] = index;
         }
         if (!mapping["fecha_portacion"] && normalizedHeader.includes("portacion")) {
            mapping["fecha_portacion"] = index;
         }
         if (!mapping["fza_ventas"] && normalizedHeader.includes("fza")) {
            mapping["fza_ventas"] = index;
         }
         if (!mapping["descrip_fza_vta"] && (normalizedHeader.includes("descrip") || normalizedHeader.includes("descripción"))) {
            mapping["descrip_fza_vta"] = index;
         }
      });

      return mapping;
   };

   const validatePhoneNumber = (phone) => {
      if (!phone) return false;

      const phoneStr = String(phone).trim();

      // Remover caracteres no numéricos excepto +
      const cleanPhone = phoneStr.replace(/[^\d+]/g, "");

      // Validar formato básico de teléfono mexicano
      const mexicanPattern = /^(\+52|52)?\s?1?\s?(\d{2}|\d{3})\s?\d{4}\s?\d{4}$/;
      const simplePattern = /^\d{10}$/; // 10 dígitos

      return mexicanPattern.test(cleanPhone) || simplePattern.test(cleanPhone);
   };

   const parseDate = (dateValue) => {
      if (!dateValue) return null;

      try {
         // Si es un número de Excel (serial date)
         if (typeof dateValue === "number") {
            const excelEpoch = new Date(1899, 11, 30);
            return new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
         }

         // Si es una cadena
         if (typeof dateValue === "string") {
            const trimmed = dateValue.trim();

            // Intentar diferentes formatos
            const formats = [
               /(\d{2})\/(\d{2})\/(\d{4})/, // DD/MM/YYYY
               /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
               /(\d{2})-(\d{2})-(\d{4})/, // DD-MM-YYYY o MM-DD-YYYY
               /(\d{1,2})\s+de\s+([a-zA-Z]+)\s+de\s+(\d{4})/i // 15 de Enero de 2024
            ];

            for (const format of formats) {
               const match = trimmed.match(format);
               if (match) {
                  let day, month, year;

                  if (format === formats[0]) {
                     // DD/MM/YYYY
                     day = parseInt(match[1], 10);
                     month = parseInt(match[2], 10) - 1;
                     year = parseInt(match[3], 10);
                  } else if (format === formats[1]) {
                     // YYYY-MM-DD
                     year = parseInt(match[1], 10);
                     month = parseInt(match[2], 10) - 1;
                     day = parseInt(match[3], 10);
                  } else if (format === formats[2]) {
                     // Asumir DD-MM-YYYY (más común en México)
                     day = parseInt(match[1], 10);
                     month = parseInt(match[2], 10) - 1;
                     year = parseInt(match[3], 10);
                  } else if (format === formats[3]) {
                     // 15 de Enero de 2024
                     day = parseInt(match[1], 10);
                     const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
                     const monthName = match[2].toLowerCase();
                     month = monthNames.findIndex((m) => m.includes(monthName));
                     year = parseInt(match[3], 10);
                  }

                  if (month >= 0 && month <= 11 && day >= 1 && day <= 31 && year > 2000) {
                     const date = new Date(year, month, day);
                     if (!isNaN(date.getTime())) {
                        return date;
                     }
                  }
               }
            }

            // Intentar parseo nativo
            const parsed = new Date(trimmed);
            if (!isNaN(parsed.getTime())) {
               return parsed;
            }
         }
      } catch (error) {
         console.error("Error parseando fecha:", dateValue, error);
      }

      return null;
   };

   const processExcelFile = (file) => {
      return new Promise((resolve, reject) => {
         const reader = new FileReader();

         reader.onload = (e) => {
            try {
               const data = new Uint8Array(e.target.result);
               const workbook = XLSX.read(data, { type: "array" });

               // Obtener la primera hoja
               const sheetName = workbook.SheetNames[0];
               const worksheet = workbook.Sheets[sheetName];

               // Convertir a JSON manteniendo índices de columnas
               const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

               // Agregar info del archivo
               const fileData = {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  lastModified: file.lastModified
               };
               formikRef.current.setFieldValue("fileData", fileData);

               resolve(jsonData);
            } catch (error) {
               reject(error);
            }
         };

         reader.onerror = (error) => reject(error);
         reader.readAsArrayBuffer(file);
      });
   };

   const processFileData = (data) => {
      // Encontrar la fila con encabezados
      let headerRowIndex = 0;
      for (let i = 0; i < Math.min(data.length, 10); i++) {
         const row = data[i];
         if (
            row &&
            row.some((cell) => cell && String(cell).trim() && (String(cell).toLowerCase().includes("telefono") || String(cell).toLowerCase().includes("celular")))
         ) {
            headerRowIndex = i;
            break;
         }
      }

      const headers = data[headerRowIndex];
      const columnMap = detectColumnMapping(headers);
      setColumnMapping(columnMap);

      // Validar que al menos tenemos la columna de teléfono
      if (columnMap["telefono"] === undefined) {
         Toast.Error("No se encontró la columna 'Teléfono' en el archivo");
         return;
      }

      const processed = [];
      const errors = [];
      const phoneSet = new Set();
      let validCount = 0;
      let invalidCount = 0;
      let missingPhoneCount = 0;
      let duplicatePhoneCount = 0;
      let invalidDateCount = 0;

      // Procesar filas de datos
      for (let i = headerRowIndex + 1; i < data.length; i++) {
         const row = data[i];
         if (!row || row.length === 0) continue;

         const rowNumber = i + 1; // Para reporte de errores
         const rowErrors = [];

         // Extraer valores usando el mapeo de columnas
         const telefono = columnMap["telefono"] !== undefined ? row[columnMap["telefono"]] : null;
         const fechaActivacion = columnMap["fecha_activacion"] !== undefined ? row[columnMap["fecha_activacion"]] : null;
         const fechaPortacion = columnMap["fecha_portacion"] !== undefined ? row[columnMap["fecha_portacion"]] : null;
         const fzaVentas = columnMap["fza_ventas"] !== undefined ? row[columnMap["fza_ventas"]] : null;
         const descripFzaVta = columnMap["descrip_fza_vta"] !== undefined ? row[columnMap["descrip_fza_vta"]] : null;

         // Validar teléfono (campo obligatorio)
         if (!telefono) {
            rowErrors.push("Teléfono es requerido");
            missingPhoneCount++;
         } else if (!validatePhoneNumber(telefono)) {
            rowErrors.push("Teléfono no válido");
         } else if (phoneSet.has(String(telefono).trim())) {
            rowErrors.push("Teléfono duplicado");
            duplicatePhoneCount++;
         } else {
            phoneSet.add(String(telefono).trim());
         }

         // Validar fechas (opcionales)
         const parsedFechaActivacion = fechaActivacion ? parseDate(fechaActivacion) : null;
         const parsedFechaPortacion = fechaPortacion ? parseDate(fechaPortacion) : null;

         if (fechaActivacion && !parsedFechaActivacion) {
            rowErrors.push("Fecha de activación no válida");
            invalidDateCount++;
         }

         if (fechaPortacion && !parsedFechaPortacion) {
            rowErrors.push("Fecha de portación no válida");
            invalidDateCount++;
         }

         // Preparar objeto normalizado
         const normalizedRow = {
            telefono: telefono ? String(telefono).trim() : null,
            fecha_activacion: parsedFechaActivacion ? parsedFechaActivacion.toISOString().split("T")[0] : null,
            fecha_portacion: parsedFechaPortacion ? parsedFechaPortacion.toISOString().split("T")[0] : null,
            fza_ventas: fzaVentas ? String(fzaVentas).trim() : null,
            descrip_fza_vta: descripFzaVta ? String(descripFzaVta).trim() : null,
            raw_data: row, // Guardar datos crudos para referencia
            row_number: rowNumber
         };

         if (rowErrors.length === 0) {
            processed.push(normalizedRow);
            validCount++;
         } else {
            errors.push({
               row: rowNumber,
               telefono: telefono || "N/A",
               errors: rowErrors,
               data: normalizedRow
            });
            invalidCount++;
         }
      }

      // Preparar data para el formulario
      const dataForForm = processed.map((p) => ({
         telefono: p.telefono,
         fecha_activacion: p.fecha_activacion,
         fecha_portacion: p.fecha_portacion,
         fza_ventas: p.fza_ventas,
         descrip_fza_vta: p.descrip_fza_vta
      }));

      formikRef.current.setFieldValue("data", dataForForm);

      setProcessedData(processed);
      setValidationErrors(errors);
      setValidationResults({
         totalRows: validCount + invalidCount,
         validRows: validCount,
         invalidRows: invalidCount,
         duplicatePhones: duplicatePhoneCount,
         missingTelefono: missingPhoneCount,
         invalidDates: invalidDateCount
      });

      Toast.Success(`Archivo procesado: ${validCount} válidos, ${invalidCount} con errores`);
   };

   const handleFileUpload = async (file) => {
      setIsLoading(true);

      if (!file) return setIsLoading(false);

      // Validar tipo de archivo
      if (!file.name.match(/\.(xls|xlsx|csv)$/)) {
         setIsLoading(false);
         Toast.Warning("Por favor, seleccione un archivo Excel válido (.xls, .xlsx o .csv)");
         return;
      }

      try {
         const excelData = await processExcelFile(file);
         processFileData(excelData);
      } catch (error) {
         console.error("Error procesando archivo:", error);
         Toast.Error("Error al procesar el archivo. Verifique que sea un Excel válido.");
      } finally {
         setIsLoading(false);
      }
   };

   const renderValidationSummary = () => {
      const { totalRows, validRows, invalidRows, duplicatePhones, missingTelefono, invalidDates } = validationResults;

      return (
         <Grid
            container
            spacing={2}
            sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 2, bgcolor: invalidRows > 0 ? "#fff3e0" : "#e8f5e9", width: "100%" }}
         >
            <Grid size={{ sx: 12 }}>
               <Typography variant="h6" gutterBottom>
                  Validación de Portaciones
               </Typography>
            </Grid>

            <Grid size={{ sx: 6, sm: 3 }}>
               <Typography variant="body2" fontWeight="bold">
                  Total Filas:
               </Typography>
               <Typography variant="h6" color="primary">
                  {totalRows}
               </Typography>
            </Grid>

            <Grid size={{ sx: 6, sm: 3 }}>
               <Typography variant="body2" fontWeight="bold" color="success.main">
                  Válidos:
               </Typography>
               <Typography variant="h6" color="success.main">
                  {validRows}
               </Typography>
            </Grid>

            <Grid size={{ sx: 6, sm: 3 }}>
               <Typography variant="body2" fontWeight="bold" color={invalidRows > 0 ? "error" : "text.secondary"}>
                  Con Errores:
               </Typography>
               <Typography variant="h6" color={invalidRows > 0 ? "error" : "text.secondary"}>
                  {invalidRows}
               </Typography>
            </Grid>

            <Grid size={{ sx: 6, sm: 3 }}>
               <Typography variant="body2" fontWeight="bold" color={validRows > 0 ? "success" : "warning"}>
                  Estado:
               </Typography>
               <Chip
                  icon={validRows > 0 ? <CheckCircle /> : <Error />}
                  label={validRows > 0 ? "Listo para importar" : "Revisar errores"}
                  color={validRows > 0 ? "success" : "warning"}
                  variant="outlined"
                  size="small"
               />
            </Grid>

            {invalidRows > 0 && (
               <>
                  <Grid size={{ sx: 12 }}>
                     <Typography variant="subtitle2" fontWeight="bold" color="error" gutterBottom>
                        Errores Detectados:
                     </Typography>
                  </Grid>

                  <Grid size={{ sx: 6, sm: 4 }}>
                     <Box display="flex" alignItems="center" gap={1}>
                        <Error sx={{ color: "error.main", fontSize: 16 }} />
                        <Typography variant="body2">Sin teléfono: {missingTelefono}</Typography>
                     </Box>
                  </Grid>

                  <Grid size={{ sx: 6, sm: 4 }}>
                     <Box display="flex" alignItems="center" gap={1}>
                        <Warning sx={{ color: "warning.main", fontSize: 16 }} />
                        <Typography variant="body2">Duplicados: {duplicatePhones}</Typography>
                     </Box>
                  </Grid>

                  <Grid size={{ sx: 6, sm: 4 }}>
                     <Box display="flex" alignItems="center" gap={1}>
                        <Info sx={{ color: "info.main", fontSize: 16 }} />
                        <Typography variant="body2">Fechas inválidas: {invalidDates}</Typography>
                     </Box>
                  </Grid>
               </>
            )}

            {processedData.length > 0 && (
               <Grid size={{ sx: 12 }}>
                  <Button variant="outlined" startIcon={showDetails ? <VisibilityOff /> : <Visibility />} onClick={() => setShowDetails(!showDetails)} size="small">
                     {showDetails ? "Ocultar Detalles" : "Ver Detalles"}
                  </Button>
               </Grid>
            )}
         </Grid>
      );
   };

   const renderColumnMappingInfo = () => {
      if (!columnMapping) return null;

      return (
         <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">
               Columnas detectadas:
            </Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
               {Object.entries(columnMapping).map(([dbKey, index]) => (
                  <Grid key={dbKey}>
                     <Chip label={`${dbKey}: columna ${index + 1}`} size="small" color="primary" variant="outlined" />
                  </Grid>
               ))}
            </Grid>
         </Alert>
      );
   };

   const renderErrorDetails = () => {
      if (validationErrors.length === 0) return null;

      return (
         <Grid container spacing={2} sx={{ mt: 2, width: "100%" }}>
            <Grid size={{ xs: 12 }}>
               <Typography variant="h6" color="error">
                  Errores de Validación
               </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
               <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table size="small" stickyHeader>
                     <TableHead>
                        <TableRow>
                           <TableCell>
                              <strong>Fila</strong>
                           </TableCell>
                           <TableCell>
                              <strong>Teléfono</strong>
                           </TableCell>
                           <TableCell>
                              <strong>Errores</strong>
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {validationErrors.slice(0, 20).map((error, index) => (
                           <TableRow key={index} hover>
                              <TableCell>{error.row}</TableCell>
                              <TableCell>{error.telefono}</TableCell>
                              <TableCell>
                                 {error.errors.map((err, errIndex) => (
                                    <Chip key={errIndex} label={err} color="error" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                 ))}
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>

               {validationErrors.length > 20 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                     Mostrando primeros 20 errores de {validationErrors.length} totales
                  </Typography>
               )}
            </Grid>
         </Grid>
      );
   };

   const renderValidDataTable = () => {
      if (processedData.length === 0) return null;

      return (
         <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
               <Typography variant="h6" color="success">
                  Datos Válidos ({processedData.length} registros)
               </Typography>
            </Grid>

            <Grid item xs={12}>
               <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table size="small" stickyHeader>
                     <TableHead>
                        <TableRow>
                           <TableCell>
                              <strong>#</strong>
                           </TableCell>
                           <TableCell>
                              <strong>Teléfono</strong>
                           </TableCell>
                           <TableCell>
                              <strong>Fecha Activación</strong>
                           </TableCell>
                           <TableCell>
                              <strong>Fecha Portación</strong>
                           </TableCell>
                           <TableCell>
                              <strong>Fza Ventas</strong>
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {processedData.slice(0, 15).map((row, index) => (
                           <TableRow key={index} hover>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{row.telefono}</TableCell>
                              <TableCell>{row.fecha_activacion || "N/A"}</TableCell>
                              <TableCell>{row.fecha_portacion || "N/A"}</TableCell>
                              <TableCell>{row.fza_ventas || "N/A"}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>

               {processedData.length > 15 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                     Mostrando primeros 15 registros de {processedData.length} totales
                  </Typography>
               )}
            </Grid>
         </Grid>
      );
   };

   const formData = [
      {
         name: "executed_at",
         input: (
            <DateTimePicker col={12} idName={"executed_at"} label={"Fecha de Ejecución"} picker={"date"} format={"DD/MM/YYYY"} helperText={"DD/MM/AAAA"} required />
         ),
         value: dayjs(),
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "file",
         input: (
            <FileInputModerno
               key={`key-input-archivo-portaciones`}
               col="12"
               idName="file"
               label="Cargar Archivo Excel de Portaciones"
               filePreviews={imgFile}
               handleUploadingFile={(files) => {
                  const f = files && files[0].file;
                  if (f) handleFileUpload(f);
               }}
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
      },
      {
         name: "data",
         input: <Input key={`key-input-data-portaciones`} col={1} idName="data" label="Data" hidden />,
         value: null,
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "fileData",
         input: <Input key={`key-input-fileData-portaciones`} col={1} idName="fileData" label="fileData" hidden />,
         value: null,
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "resumen",
         input: (
            <>
               {/* {renderColumnMappingInfo()} */}
               {renderValidationSummary()}
            </>
         ),
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: true, title: "Resumen de Validación", orientation: "horizontal", sx: { mt: 2 } }
      },
      ...(showDetails
         ? [
              {
                 name: "detalles_errores",
                 input: renderErrorDetails(),
                 value: "",
                 validations: null,
                 validationPage: [],
                 dividerBefore: { show: validationErrors.length > 0, title: "Detalles de Errores", orientation: "horizontal", sx: { mt: 2 } }
              },
              {
                 name: "detalles_validos",
                 input: renderValidDataTable(),
                 value: "",
                 validations: null,
                 validationPage: [],
                 dividerBefore: { show: processedData.length > 0, title: "Datos Válidos", orientation: "horizontal", sx: { mt: 2 } }
              }
           ]
         : [])
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
      console.log("🚀 ~ onSubmit ~ processedData:", processedData);
      if (processedData.length === 0) {
         Toast.Warning("Primero debe procesar un archivo válido");
         setSubmitting(false);
         return;
      }

      console.log("🚀 ~ onSubmit ~ validationResults:", validationResults);
      if (validationResults.invalidRows > 0) {
         mySwal
            .fire(
               QuestionAlertConfig(
                  `Hay ${validationResults.invalidRows} registros con errores. ¿Desea continuar importando solo los ${validationResults.validRows} válidos?`,
                  "CONFIRMAR"
               )
            )
            .then(async (result) => {
               console.log("aqui voy", result);
               if (result.isConfirmed) {
                  setIsLoading(true);

                  try {
                     const res = await importPortabilities(values);

                     if (!res) {
                        setIsLoading(false);
                        return;
                     }

                     if (res.errors) {
                        setIsLoading(false);
                        Object.values(res.errors).forEach((errors) => {
                           if (typeof errors === "string") Toast.Warning(errors);
                           else errors.map((error) => Toast.Warning(error));
                        });
                        return;
                     } else if (res.status_code !== 200) {
                        setIsLoading(false);
                        return Toast.Customizable(res.alert_text, res.alert_icon);
                     }

                     Toast.Success(`Se importaron ${processedData.length} portaciones correctamente`);
                     if (res.metrics)
                        /* showMetricsAlert(res.metrics); */
                        showFlexibleAlert(res.metrics, {
                           type: ALERT_TYPES.METRICS_CUSTOM,
                           title: "PORTACIONES",
                           subtitle: res.message,
                           copyTextGenerator: (data) => {
                              const metrics = data;
                              return `RESULTADO DETALLES:\n\n` + `Procesados: ${metrics.processed}\n` + `Errores: ${metrics.errors}`;
                           }
                        });

                     if (!checkAdd) {
                        setOpenDialog(false);
                        resetForm();
                        init();
                     }
                  } catch (error) {
                     console.error("Error importando portaciones:", error);
                     Toast.Error("Error al importar las portaciones");
                  } finally {
                     setIsLoading(false);
                     setSubmitting(false);
                  }

                  // setIsLoading(true);
                  // const res = await deleteProduct(id);
                  // // console.log('🚀 ~ handleClickLogout ~ res:', res);
                  // if (!res) return setIsLoading(false);
                  // if (res.errors) {
                  //    setIsLoading(false);
                  //    Object.values(res.errors).forEach((errors) => {
                  //       errors.map((error) => Toast.Warning(error));
                  //    });
                  //    return;
                  // } else if (res.status_code !== 200) {
                  //    setIsLoading(false);
                  //    return Toast.Customizable(res.alert_text, res.alert_icon);
                  // }

                  // if (res.alert_text) Toast.Customizable(res.alert_text, res.alert_icon);
                  // setIsLoading(false);
               } else {
                  setSubmitting(false);
                  return;
               }
            });

         // const confirm = window.confirm(
         //    `Hay ${validationResults.invalidRows} registros con errores. ¿Desea continuar importando solo los ${validationResults.validRows} válidos?`
         // );
         // if (!confirm) {
         //    setSubmitting(false);
         //    return;
         // }
      } else {
         try {
            const res = await importPortabilities(values);

            if (!res) {
               setIsLoading(false);
               return;
            }

            if (res.errors) {
               setIsLoading(false);
               Object.values(res.errors).forEach((errors) => {
                  if (typeof errors === "string") Toast.Warning(errors);
                  else errors.map((error) => Toast.Warning(error));
               });
               return;
            } else if (res.status_code !== 200) {
               setIsLoading(false);
               return Toast.Customizable(res.alert_text, res.alert_icon);
            }

            Toast.Success(`Se importaron ${processedData.length} portaciones correctamente`);
            if (res.metrics)
               /* showMetricsAlert(res.metrics); */
               showFlexibleAlert(res.metrics, {
                  type: ALERT_TYPES.METRICS_CUSTOM,
                  title: "PORTACIONES",
                  subtitle: res.message,
                  copyTextGenerator: (data) => {
                     const metrics = data;
                     return `RESULTADO DETALLES:\n\n` + `Procesados: ${metrics.processed}\n` + `Errores: ${metrics.errors}`;
                  }
               });

            if (!checkAdd) {
               setOpenDialog(false);
               resetForm();
               init();
            }
         } catch (error) {
            console.error("Error importando portaciones:", error);
            Toast.Error("Error al importar las portaciones");
         } finally {
            setIsLoading(false);
            setSubmitting(false);
         }
      }
   };

   const handleCancel = () => {
      formikRef.current.resetForm();
      formikRef.current.setValues(formikRef.current.initialValues);
      setImgFile([]);
      init();
      if (!checkAdd) setOpenDialog(false);
   };

   const handleChangeCheckAdd = (checked) => {
      try {
         localStorage.setItem("checkAddPortaciones", checked);
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
            startIcon={<UploadFile />}
            onClick={() => {
               setImgFile([]);
               setOpenDialog(true);
            }}
            disabled={!auth.permissions.create}
            color="warning"
         >
            IMPORTAR PORTACIONES
         </Button>

         {openDialog && (
            <DialogComponent
               open={openDialog}
               setOpen={setOpenDialog}
               modalTitle={
                  <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                     <Typography className="font-extrabold text-center" variant="h4" fontWeight={"bold"}>
                        {"Importar Portaciones"}
                     </Typography>

                     <Tooltip title={"Al estar activo, el formulario no se cerrará al terminar una importación"}>
                        <FormGroup sx={{}}>
                           <FormControlLabel
                              control={<Switch defaultChecked={checkAdd} color="secondary" />}
                              label={"Seguir Importando"}
                              sx={{ opacity: checkAdd ? 1 : 0.35 }}
                              onChange={(e) => handleChangeCheckAdd(e.target.checked)}
                           />
                        </FormGroup>
                     </Tooltip>
                  </Grid>
               }
               fullScreen={false}
               maxWidth="lg"
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
                  textBtnSubmit={processedData.length > 0 ? `IMPORTAR ${processedData.length} PORTACIONES` : "PROCESAR ARCHIVO"}
                  handleCancel={handleCancel}
                  container={"modal"}
               />
            </DialogComponent>
         )}
      </>
   );
};

export default ImportPortabitiesFrom;
