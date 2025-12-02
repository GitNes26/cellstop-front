import { useEffect, useRef, useState } from "react";
import FormikForm, { Input, Textarea, Select2, DateTimePicker, FileInput, FileInputModerno } from "../../../../components/forms";
import * as Yup from "yup";
import { DialogComponent, showDuplicatesAlert } from "../../../../components";
import { Button, Drawer, FormControlLabel, FormGroup, Switch, Tooltip, Typography } from "@mui/material";
import Toast from "../../../../utils/Toast";
import Grid from "@mui/material/Grid";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useProductContext } from "../../../../context/ProductContext";
import { color } from "framer-motion";
import { icons } from "../../../../constant";
import { AttachMoneyRounded, UploadFileRounded } from "@mui/icons-material";
import { useAuthContext } from "../../../../context/AuthContext";
import { useProductTypeContext } from "../../../../context/ProductTypeContext";
import useFetch from "../../../../hooks/useFetch";
import { Response } from "../../../../utils/Api";
import * as XLSX from "xlsx";
import sAlert from "../../../../utils/sAlert";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;

const Form = ({ formData, validations, formikRef, validationSchema, onSubmit, textBtnSubmit, handleCancel }) => {
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
   // const {setAllProducts,getSelectIndexRoles}=useProductContext()
   const formikRef = useRef(null);
   const { singularName, product, textBtnSubmit, setTextBtnSubmit, isEdit, setIsEdit, importProducts } = useProductContext();
   const { productTypesSelect, setProductTypesSelect, getSelectIndexProductTypes } = useProductTypeContext();

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);

   const { refetch: refetchProductTypes } = useFetch(getSelectIndexProductTypes, setProductTypesSelect);
   const [imgFile, setImgFile] = useState([]);
   const [helperTextImgFile, setHelperTextImgFile] = useState(null);

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

            // Convertir fechas si aplica
            if (Array.isArray(jsonData) && columns?.length) {
               jsonData = jsonData.map((row) => {
                  const newRow = { ...row };
                  columns.forEach((col) => {
                     if (String(col).toLowerCase().includes("fecha")) {
                        try {
                           const raw = newRow[col];
                           newRow[col] = raw !== null && raw !== "" && raw !== undefined ? excelDateToJSDate(raw) : null;
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

               // // Agregar info del archivo
               // row.fileData = {
               //    name: file.name,
               //    size: file.size,
               //    type: file.type,
               //    lastModified: file.lastModified
               // };

               if (filaValida) validos.push(row);
            });

            // Mostrar errores si los hay
            if (errores.length) {
               errores.forEach((err) => Toast.Error(err));
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
            const msgToast = `Validación completa. Registros por registrar: ${validos.length}`;
            Toast.Success(msgToast);
            setHelperTextImgFile(msgToast);
            formikRef.current.setFieldValue("data", validos);
            formikRef.current.setFieldValue("fileData", fileData);
            // Llamar callback si se proporciona
            // if (onFinish) onFinish(validos);

            // console.log("🚀 ~ handleFile ~ validos:", validos);
            return validos;
         } catch (error) {
            console.error("Error procesando archivo Excel:", error);
            Toast.Error("Error al procesar el archivo Excel");
            setIsLoading(false);
         }
      };

      reader.readAsArrayBuffer(file);
   };

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
                  // console.log("🚀 ~ ImportForm ~ files:", files);
                  // if (files.length > 0) setImgFile(files[0]);
                  // const f = e.target.files && e.target.files[0];
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
      // console.log("🚀 ~ onSubmit ~ validationSchema:", validationSchema());
      // return console.log("🚀 ~ onSubmit ~ values:", values);
      setIsLoading(true);
      // values.file = imgFile.length == 0 ? "" : imgFile[0].file;
      // console.log("🚀 ~ onSubmit ~ values:", values);
      // return setIsLoading(false);
      const res = await importProducts(values);
      // console.log("🚀 ~ onSubmit ~ res:", res);
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
      // setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      // setTextBtnSubmit("AGREGAR");
      setImgFile([]);
      setIsEdit(false);
      if (refetchSelect) refetchSelect();
      if (!checkAdd) setOpenDialog(false);
   };

   const handleChangeCheckAdd = (checked) => {
      // console.log("🚀 ~ handleChangeCheckAdd ~ checked:", checked);
      try {
         localStorage.setItem("checkAdd", checked);
         setCheckAdd(checked);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      // console.log("🚀 Form ~ useEffect :");
      // console.log("🚀 Form ~ useEffect ~ isEdit:", isEdit);
   }, [product, formikRef, isEdit]);

   return (
      <>
         <Button
            variant="contained"
            startIcon={<UploadFileRounded />}
            onClick={() => {
               setImgFile([]);
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
            />
         </DialogComponent>
      </>
   );
};

export default ImportForm;
