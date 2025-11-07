import { useEffect, useRef, useState } from "react";
import FormikForm, { Input, Select2, FileInputModerno } from "../../../../components/forms";
import * as Yup from "yup";
import { DialogComponent, showDuplicatesAlert } from "../../../../components";
import {
   Button,
   FormControlLabel,
   FormGroup,
   Switch,
   Tooltip,
   Typography,
   Box,
   Checkbox,
   TextField,
   List,
   ListItem,
   ListItemIcon,
   ListItemText,
   Chip,
   IconButton,
   Paper
} from "@mui/material";
import { Search, Clear, CheckBox, CheckBoxOutlineBlank, SimCard } from "@mui/icons-material";
import Toast from "../../../../utils/Toast";
import Grid from "@mui/material/Grid";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useProductContext } from "../../../../context/ProductContext";
import { UploadFileRounded } from "@mui/icons-material";
import { useAuthContext } from "../../../../context/AuthContext";
import { useProductTypeContext } from "../../../../context/ProductTypeContext";
import useFetch from "../../../../hooks/useFetch";
import * as XLSX from "xlsx";
import showFlexibleAlert, { ALERT_TYPES } from "../../../../components/showDuplicatesAlert";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;

const Form = ({ formData, validations, formikRef, validationSchema, onSubmit, textBtnSubmit, handleCancel, iccidList, onIccidSelectionChange }) => {
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
         maxHeight={"65vh"}
         spacing={2}
         container={true}
      >
         {inputsForms.map((input) => input)}

         {/* Sección de listado de ICCIDs */}
         {iccidList && iccidList.length > 0 && <IccidListSection iccidList={iccidList} onSelectionChange={onIccidSelectionChange} />}
      </FormikForm>
   );
};

// Componente para la sección de listado de ICCIDs
const IccidListSection = ({ iccidList, onSelectionChange }) => {
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedIccids, setSelectedIccids] = useState(new Set());
   const [selectAll, setSelectAll] = useState(true);

   // Inicializar con todos seleccionados
   useEffect(() => {
      const allIccids = new Set(iccidList.map((iccid) => iccid));
      setSelectedIccids(allIccids);
      setSelectAll(true);
   }, [iccidList]);

   // Filtrar ICCIDs basado en la búsqueda
   const filteredIccids = iccidList.filter((iccid) => iccid.toString().toLowerCase().includes(searchTerm.toLowerCase()));

   const handleToggleAll = () => {
      if (selectAll) {
         // Deseleccionar todos
         setSelectedIccids(new Set());
         setSelectAll(false);
         onSelectionChange?.([]);
      } else {
         // Seleccionar todos
         const allIccids = new Set(iccidList.map((iccid) => iccid));
         setSelectedIccids(allIccids);
         setSelectAll(true);
         onSelectionChange?.(Array.from(allIccids));
      }
   };

   const handleToggleIccid = (iccid) => {
      const newSelected = new Set(selectedIccids);
      if (newSelected.has(iccid)) {
         newSelected.delete(iccid);
      } else {
         newSelected.add(iccid);
      }
      setSelectedIccids(newSelected);
      setSelectAll(newSelected.size === iccidList.length);
      onSelectionChange?.(Array.from(newSelected));
   };

   const handleClearSearch = () => {
      setSearchTerm("");
   };

   return (
      <Grid container size={{ md: 12 }}>
         <Paper
            elevation={2}
            sx={{
               width: "100%",
               p: 2,
               border: "1px solid",
               borderColor: "divider",
               borderRadius: 2,
               backgroundColor: "background.paper"
            }}
         >
            {/* Header del listado */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
               <Typography variant="h6" fontWeight="600" color="primary">
                  <SimCard sx={{ fontSize: 20, mr: 1, verticalAlign: "middle" }} />
                  Lista de ICCIDs Detectados
               </Typography>
               <Chip label={`${selectedIccids.size}/${iccidList.length} seleccionados`} color="primary" variant="outlined" />
            </Box>

            {/* Barra de búsqueda y controles */}
            <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
               <TextField
                  fullWidth
                  size="small"
                  placeholder="Buscar ICCID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                     startAdornment: <Search sx={{ color: "text.secondary", mr: 1 }} />,
                     endAdornment: searchTerm && (
                        <IconButton size="small" onClick={handleClearSearch}>
                           <Clear />
                        </IconButton>
                     )
                  }}
               />
               <Button variant="outlined" size="small" onClick={handleToggleAll} startIcon={selectAll ? <CheckBox /> : <CheckBoxOutlineBlank />}>
                  {selectAll ? "Deseleccionar Todos" : "Seleccionar Todos"}
               </Button>
            </Box>

            {/* Lista de ICCIDs */}
            <Paper
               variant="outlined"
               sx={{
                  maxHeight: 300,
                  overflow: "auto",
                  borderColor: "divider"
               }}
            >
               <List dense sx={{ p: 0 }}>
                  {filteredIccids.length > 0 ? (
                     filteredIccids.map((iccid, index) => (
                        <ListItem
                           key={`iccid-${iccid}-${index}`} // KEY ÚNICA CORREGIDA
                           sx={{
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              "&:last-child": { borderBottom: "none" },
                              "&:hover": {
                                 backgroundColor: "action.hover"
                              }
                           }}
                        >
                           <ListItemIcon sx={{ minWidth: 40 }}>
                              <Checkbox edge="start" checked={selectedIccids.has(iccid)} onChange={() => handleToggleIccid(iccid)} color="primary" />
                           </ListItemIcon>
                           <ListItemText
                              primary={
                                 <Typography variant="body2" fontFamily="'Monaco', 'Consolas', monospace" fontWeight="500">
                                    {iccid}
                                 </Typography>
                              }
                           />
                        </ListItem>
                     ))
                  ) : (
                     <ListItem key="no-results">
                        {" "}
                        {/* KEY AGREGADA */}
                        <ListItemText
                           primary={
                              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                                 {searchTerm ? "No se encontraron ICCIDs que coincidan con la búsqueda" : "No hay ICCIDs para mostrar"}
                              </Typography>
                           }
                        />
                     </ListItem>
                  )}
               </List>
            </Paper>

            {/* Información adicional */}
            <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
               <Chip
                  key="showing-count" // KEY AGREGADA
                  label={`Mostrando: ${filteredIccids.length}`}
                  size="small"
                  variant="outlined"
                  color="info"
               />
               {searchTerm && (
                  <Chip
                     key="search-term" // KEY AGREGADA
                     label={`Filtrado por: "${searchTerm}"`}
                     size="small"
                     variant="outlined"
                     onDelete={handleClearSearch}
                  />
               )}
            </Box>
         </Paper>
      </Grid>
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
const PreActivationForm = ({ refetchSelect, openDialog, setOpenDialog }) => {
   const { auth } = useAuthContext();
   const { setIsLoading } = useGlobalContext();
   const { product, isEdit, setIsEdit, preActivationProducts } = useProductContext();
   const { setProductTypesSelect, getSelectIndexProductTypes } = useProductTypeContext();
   const formikRef = useRef(null);

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [iccidList, setIccidList] = useState([]);
   const [selectedIccids, setSelectedIccids] = useState([]);

   const { refetch: refetchProductTypes } = useFetch(getSelectIndexProductTypes, setProductTypesSelect);
   const [imgFile, setImgFile] = useState([]);
   const [helperTextImgFile, setHelperTextImgFile] = useState(null);

   const handleFile = async (file) => {
      setIsLoading(true);
      const reader = new FileReader();

      reader.onload = async (e) => {
         try {
            const dataExcel = new Uint8Array(e.target.result);
            const workbook = XLSX.read(dataExcel, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // ✅ Convertir hoja a JSON completo
            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });

            // ✅ Buscar columna "ICCID" (sin importar mayúsculas/minúsculas)
            const firstRow = jsonData[0];
            const iccidKey = Object.keys(firstRow || {}).find((key) => key.trim().toLowerCase() === "iccid");

            if (!iccidKey) {
               Toast.Error("No se encontró la columna 'ICCID' en el archivo Excel");
               setIsLoading(false);
               return [];
            }

            // ✅ Extraer todos los valores de la columna ICCID
            const extractedIccids = jsonData
               .map((row) => row[iccidKey])
               .filter((val) => val !== null && val !== undefined && val !== "")
               .map((iccid) => iccid.toString().trim());

            // ✅ Mostrar resultado
            const msgToast = `Archivo leído correctamente. Registros ICCID: ${extractedIccids.length}`;
            Toast.Success(msgToast);
            setHelperTextImgFile(msgToast);

            // ✅ Guardar en estado
            setIccidList(extractedIccids);
            setSelectedIccids(extractedIccids); // Seleccionar todos por defecto

            // ✅ Guardar en Formik
            formikRef.current.setFieldValue("data", extractedIccids);

            setIsLoading(false);
            return extractedIccids;
         } catch (error) {
            console.error("Error procesando archivo Excel:", error);
            Toast.Error("Error al procesar el archivo Excel");
            setIsLoading(false);
            return [];
         }
      };

      reader.readAsArrayBuffer(file);
   };

   const handleIccidSelectionChange = (selectedIccids) => {
      setSelectedIccids(selectedIccids);
      formikRef.current.setFieldValue("data", selectedIccids);
   };

   const formData = [
      {
         name: "file",
         input: (
            <FileInputModerno
               key="key-file"
               col="12"
               idName="file"
               label="Cargar Archivo Excel"
               filePreviews={imgFile}
               handleUploadingFile={(files) => {
                  const f = files && files[0].file;
                  if (f) handleFile(f);
               }}
               helperText={helperTextImgFile}
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

      // Usar los ICCIDs seleccionados en lugar de todos
      values.data = selectedIccids;

      if (selectedIccids.length === 0) {
         Toast.Error("Debe seleccionar al menos un ICCID para Pre-activar");
         setIsLoading(false);
         return;
      }

      const res = await preActivationProducts(values);
      console.log("🚀 ~ onSubmit ~ res:", res);

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
            type: ALERT_TYPES.METRICS,
            title: "Resultado de Pre-Activación",
            subtitle: "Proceso de pre-activación masiva completado",
            copyTextGenerator: (data) => {
               const metrics = data;
               return (
                  `RESULTADO PRE-ACTIVACIÓN:\n\n` +
                  `Solicitados: ${metrics.requested}\n` +
                  `Actualizados: ${metrics.updated}\n` +
                  `No encontrados: ${metrics.not_found}\n` +
                  `Ya activados: ${metrics.already_activated}`
               );
            }
         });

      await resetForm();
      setImgFile([]);
      setIccidList([]);
      setSelectedIccids([]);
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
      setIccidList([]);
      setSelectedIccids([]);
      setIsEdit(false);
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

   useEffect(() => {
      // Resetear listas cuando se cierra el diálogo
      if (!openDialog) {
         setIccidList([]);
         setSelectedIccids([]);
      }
   }, [openDialog]);

   return (
      <>
         <Button variant="contained" startIcon={<UploadFileRounded />} onClick={() => setOpenDialog(true)} disabled={!auth.permissions.create} color={"info"}>
            CARGAR ICCIDs preAprobados
         </Button>

         <DialogComponent
            open={openDialog}
            setOpen={setOpenDialog}
            modalTitle={
               <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                  <Typography className="font-extrabold text-center" variant="h4" fontWeight={"bold"}>
                     {"PRE-ACTIVACIÓN MASIVA"}
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
               textBtnSubmit={"PRE-ACTIVAR"}
               handleCancel={handleCancel}
               iccidList={iccidList}
               onIccidSelectionChange={handleIccidSelectionChange}
            />
         </DialogComponent>
      </>
   );
};

export default PreActivationForm;
