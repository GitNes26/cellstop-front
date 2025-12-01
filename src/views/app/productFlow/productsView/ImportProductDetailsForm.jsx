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
   Paper
} from "@mui/material";
import FormikForm, { Input } from "../../../../components/forms";
import * as Yup from "yup";
import { DialogComponent } from "../../../../components";
import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useProductContext } from "../../../../context/ProductContext";
import { UploadFile, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuthContext } from "../../../../context/AuthContext";
import Toast from "../../../../utils/Toast";
import * as XLSX from "xlsx";
import { formatCurrency } from "../../../../utils/Formats";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;

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

const ImportProductDetailsForm = ({ openDialog, setOpenDialog, columns }) => {
   const { auth } = useAuthContext();
   const { setIsLoading } = useGlobalContext();
   const { singularName, formTitle, setFormTitle, textBtnSubmit, setTextBtnSubmit, isEdit, setIsEdit, importProductDetails } = useProductContext();
   const formikRef = useRef(null);
   const [imgFile, setImgFile] = useState([]);

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [fileData, setFileData] = useState(null);
   const [processedData, setProcessedData] = useState([]);
   const [showDetails, setShowDetails] = useState(false);
   const [summary, setSummary] = useState({
      totalLines: 0,
      pagadas: 0,
      rechazadas: 0,
      pendientes: 0,
      totalComision: 0,
      telefonosUnicos: 0,
      evaluaciones: { 1: 0, 2: 0, 3: 0, 4: 0 }
   });

   const init = () => {
      setFileData(null);
      setProcessedData([]);
      setShowDetails(false);
      setSummary({
         totalLines: 0,
         pagadas: 0,
         rechazadas: 0,
         pendientes: 0,
         totalComision: 0,
         telefonosUnicos: 0,
         evaluaciones: { 1: 0, 2: 0, 3: 0, 4: 0 }
      });
   };

   useEffect(() => {
      if (openDialog) {
         formikRef?.current?.resetForm();
         formikRef?.current?.setValues(formikRef.current.initialValues);
         init();
      }
   }, [openDialog]);

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

               // Convertir a JSON
               const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

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
      // Encontrar la fila donde empiezan los encabezados reales
      let startRow = 0;
      for (let i = 0; i < data.length; i++) {
         if (data[i] && data[i].length > 0 && (data[i][0] === "FILTRO" || data[i][0] === "TELEFONO:")) {
            startRow = i;
            break;
         }
      }

      const lines = data.slice(startRow);
      const processed = [];
      let pagadas = 0,
         rechazadas = 0,
         pendientes = 0,
         totalComision = 0;
      const telefonosUnicos = new Set();
      const evaluaciones = { 1: 0, 2: 0, 3: 0, 4: 0 };

      // Encontrar índices de columnas basados en los encabezados
      const headerRow = lines[0];
      const columnIndexes = {
         filtro: headerRow.findIndex((col) => col === "FILTRO"),
         telefono: headerRow.findIndex((col) => col === "TELEFONO"),
         imei: headerRow.findIndex((col) => col === "IMEI"),
         iccid: headerRow.findIndex((col) => col === "ICCID"),
         estatusLin: headerRow.findIndex((col) => col === "ESTATUS LIN"),
         movimiento: headerRow.findIndex((col) => col === "MOVIMIENTO"),
         fechaActiv: headerRow.findIndex((col) => col === "FECHA_ACTIV"),
         estatusPago: headerRow.findIndex((col) => col === "ESTATUS_PAGO"),
         montoCom: headerRow.findIndex((col) => col === "MONTO_COM"),
         tipoComision: headerRow.findIndex((col) => col === "TIPO_COMISION"),
         evaluacion: headerRow.findIndex((col) => col === "EVALUACION"),
         folioFactura: headerRow.findIndex((col) => col === "FOLIO FACTURA")
      };

      // Procesar las filas de datos (empezando desde la fila 1 después del header)
      for (let i = 1; i < lines.length; i++) {
         const line = lines[i];

         formData.data = line;

         if (line && line[columnIndexes.telefono]) {
            const telefono = line[columnIndexes.telefono];
            const imei = line[columnIndexes.imei];
            const iccid = line[columnIndexes.iccid];
            const estatusLin = line[columnIndexes.estatusLin];
            const movimiento = line[columnIndexes.movimiento];
            const fechaActiv = line[columnIndexes.fechaActiv];
            const estatusPago = line[columnIndexes.estatusPago];
            const montoCom = parseFloat(line[columnIndexes.montoCom]) || 0;
            const tipoComision = line[columnIndexes.tipoComision];
            const evaluacion = parseInt(line[columnIndexes.evaluacion]) || 0;
            const folioFactura = line[columnIndexes.folioFactura];

            // Contar por estatus de pago
            switch (estatusPago) {
               case "PAGADA":
                  pagadas++;
                  totalComision += montoCom;
                  break;
               case "RECHAZADA":
                  rechazadas++;
                  break;
               case "PENDIENTE":
                  pendientes++;
                  break;
            }

            // Contar teléfonos únicos
            telefonosUnicos.add(telefono);

            // Contar evaluaciones
            if (evaluacion >= 1 && evaluacion <= 4) {
               evaluaciones[evaluacion]++;
            }

            processed.push({
               id: i,
               telefono,
               imei,
               iccid,
               estatusLin,
               movimiento,
               fechaActiv,
               estatusPago,
               montoCom,
               tipoComision,
               evaluacion,
               folioFactura,
               rawData: line
            });
         }
      }

      setProcessedData(processed);
      setSummary({
         totalLines: processed.length,
         pagadas,
         rechazadas,
         pendientes,
         totalComision,
         telefonosUnicos: telefonosUnicos.size,
         evaluaciones
      });
   };

   const handleFileUpload = async (event) => {
      setImgFile([]);
      const file = event.target.files[0];
      if (!file) return setIsLoading(false);

      // Validar tipo de archivo
      if (!file.name.match(/\.(xls|xlsx)$/)) {
         Toast.Warning("Por favor, seleccione un archivo Excel válido (.xls o .xlsx)");
         return;
      }

      setIsLoading(true);

      try {
         const excelData = await processExcelFile(file);
         processFileData(excelData);
         Toast.Success("Archivo procesado correctamente");
      } catch (error) {
         console.error("Error procesando archivo:", error);
         Toast.Error("Error al procesar el archivo. Verifique que sea un Excel válido.");
      } finally {
         setIsLoading(false);
      }
   };

   const formData = [
      {
         name: "archivo",
         input: (
            // <FileInputModerno
            //                key="key-file"
            //                col="12"
            //                idName="file"
            //                label="Cargar Archivo Excel"
            //                filePreviews={imgFile}
            //                handleUploadingFile={(files) => {
            //                   const f = files && files[0].file;
            //                   if (f) handleFile(f);
            //                }}
            //                helperText={helperTextImgFile}
            //                setFilePreviews={setImgFile}
            //                multiple={false}
            //                accept={".xlsx,.xls,.csv"}
            //                required
            //             />
            <Input
               key={`key-input-archivo`}
               col={12}
               idName="archivo"
               label="Archivo Excel de Líneas Prepago"
               type="file"
               accept=".xls,.xlsx"
               onChange={handleFileUpload}
               startAdornmentContent={<UploadFile />}
               required
            />
         ),
         value: "",
         validations: Yup.mixed().required("Archivo requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "resumen",
         input: (
            <Grid key={`key-input-resumen`} container spacing={2} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 2 }}>
               <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                     Datos Procesado
                  </Typography>
               </Grid>
               <Grid item xs={6} sm={3}>
                  <Typography variant="body2" fontWeight="bold">
                     Total Líneas:
                  </Typography>
                  <Typography variant="h6" color="primary">
                     {summary.totalLines}
                  </Typography>
               </Grid>
               <Grid item xs={6} sm={3}>
                  <Typography variant="body2" fontWeight="bold">
                     Teléfonos Únicos:
                  </Typography>
                  <Typography variant="h6" color="primary">
                     {summary.telefonosUnicos}
                  </Typography>
               </Grid>
               <Grid item xs={6} sm={2}>
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                     Pagadas:
                  </Typography>
                  <Typography variant="h6" color="success.main">
                     {summary.pagadas}
                  </Typography>
               </Grid>
               <Grid item xs={6} sm={2}>
                  <Typography variant="body2" fontWeight="bold" color="error.main">
                     Rechazadas:
                  </Typography>
                  <Typography variant="h6" color="error.main">
                     {summary.rechazadas}
                  </Typography>
               </Grid>
               <Grid item xs={6} sm={2}>
                  <Typography variant="body2" fontWeight="bold" color="warning.main">
                     Pendientes:
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                     {summary.pendientes}
                  </Typography>
               </Grid>
               <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="bold" color="primary.main">
                     Total Comisión:
                  </Typography>
                  <Typography variant="h5" color="primary.main">
                     {formatCurrency(summary.totalComision)}
                  </Typography>
               </Grid>
               <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="bold">
                     Evaluaciones:
                  </Typography>
                  <Grid container spacing={1}>
                     {[1, 2, 3, 4].map((evalNum) => (
                        <Grid item xs={3} key={evalNum}>
                           <Typography variant="body2">
                              E{evalNum}: {summary.evaluaciones[evalNum]}
                           </Typography>
                        </Grid>
                     ))}
                  </Grid>
               </Grid>
               {processedData.length > 0 && (
                  <Grid item xs={12}>
                     <Button variant="outlined" startIcon={showDetails ? <VisibilityOff /> : <Visibility />} onClick={() => setShowDetails(!showDetails)} size="small">
                        {showDetails ? "Ocultar Detalles" : "Ver Detalles"}
                     </Button>
                  </Grid>
               )}
            </Grid>
         ),
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: true, title: "Resumen", orientation: "horizontal", sx: { mt: 2 } }
      },
      ...(showDetails && processedData.length > 0
         ? [
              {
                 name: "detalles",
                 input: (
                    <TableContainer component={Paper} key={`key-input-detalles`} sx={{ maxHeight: 350, mb: 2 }}>
                       <Table stickyHeader size="small">
                          <TableHead>
                             <TableRow>
                                <TableCell>Teléfono</TableCell>
                                <TableCell>ICCID</TableCell>
                                <TableCell>Estatus Pago</TableCell>
                                <TableCell>Monto</TableCell>
                                <TableCell>Evaluación</TableCell>
                                <TableCell>Fecha Activación</TableCell>
                             </TableRow>
                          </TableHead>
                          <TableBody>
                             {processedData.map((line) => (
                                <TableRow key={line.id}>
                                   <TableCell>{line.telefono}</TableCell>
                                   <TableCell>{line.iccid}</TableCell>
                                   <TableCell>
                                      <Typography
                                         variant="body2"
                                         color={line.estatusPago === "PAGADA" ? "success.main" : line.estatusPago === "RECHAZADA" ? "error.main" : "warning.main"}
                                      >
                                         {line.estatusPago}
                                      </Typography>
                                   </TableCell>
                                   <TableCell>${line.montoCom.toFixed(2)}</TableCell>
                                   <TableCell>{line.evaluacion}</TableCell>
                                   <TableCell>{line.fechaActiv}</TableCell>
                                </TableRow>
                             ))}
                             {/* {processedData.length > 50 && (
                                <TableRow>
                                   <TableCell colSpan={6} align="center">
                                      <Typography variant="body2" color="text.secondary">
                                         ... y {processedData.length - 50} líneas más
                                      </Typography>
                                   </TableCell>
                                </TableRow>
                             )} */}
                          </TableBody>
                       </Table>
                    </TableContainer>
                 ),
                 value: "",
                 validations: null,
                 validationPage: [],
                 dividerBefore: { show: true, title: "Detalles de Líneas", orientation: "horizontal", sx: { mt: 2 } }
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
      if (processedData.length === 0) {
         Toast.Warning("Primero debe procesar un archivo válido");
         setSubmitting(false);
         return;
      }

      setIsLoading(true);

      try {
         // Usar los ICCIDs seleccionados en lugar de todos
         // values.data = processedData;
         return console.log("values", values);

         const res = await importProductDetails(values);

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
         Toast.Success(`Se procesaron ${processedData.length} líneas prepago correctamente`);

         if (!checkAdd) {
            setOpenDialog(false);
            resetForm();
            init();
         }
      } catch (error) {
         console.error("Error guardando datos:", error);
         Toast.Error("Error al guardar las líneas prepago");
      } finally {
         setIsLoading(false);
         setSubmitting(false);
      }
   };

   const handleCancel = () => {
      formikRef.current.resetForm();
      formikRef.current.setValues(formikRef.current.initialValues);
      setFormTitle(`PROCESAR LÍNEAS PREPAGO`);
      setTextBtnSubmit("PROCESAR");
      setImgFile([]);
      setIsEdit(false);
      init();
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
         <Button variant="contained" startIcon={<UploadFile />} onClick={() => setOpenDialog(true)} disabled={!auth.permissions.create} color="primary">
            IMPORTAR DETALLES DE PRODUCTOS
         </Button>

         {openDialog && (
            <DialogComponent
               open={openDialog}
               setOpen={setOpenDialog}
               modalTitle={
                  <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                     <Typography className="font-extrabold text-center" variant="h4" fontWeight={"bold"}>
                        {"Procesar Detalles de Líneas"}
                     </Typography>

                     <Tooltip title={"Al estar activo, el formulario no se cerrará al terminar un procesamiento"}>
                        <FormGroup sx={{}}>
                           <FormControlLabel
                              control={<Switch defaultChecked={checkAdd} color="dark" />}
                              label={"Seguir Procesando"}
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
                  textBtnSubmit={textBtnSubmit}
                  handleCancel={handleCancel}
                  container={"modal"}
               />
            </DialogComponent>
         )}
      </>
   );
};

// Componente Divider auxiliar si no existe
const DividerComponent = ({ title, orientation, sx }) => (
   <Grid item xs={12} sx={sx}>
      <Typography
         variant="h6"
         component={orientation === "horizontal" ? "b" : "div"}
         sx={{
            border: orientation === "horizontal" ? "1px solid #e0e0e0" : "none",
            width: "100%",
            my: 2
         }}
      >
         {title}
      </Typography>
   </Grid>
);

export default ImportProductDetailsForm;
