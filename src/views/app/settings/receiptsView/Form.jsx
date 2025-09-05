import { useCallback, useEffect, useRef, useState } from "react";
import FormikForm, { Input, Textarea } from "../../../../components/forms";
import * as Yup from "yup";
import { DialogComponent, Drawer, Toggle, Typography } from "../../../../components/basics";
import Toast from "../../../../utils/Toast";
import Grid from "@mui/material/Grid";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useReceiptContext } from "../../../../context/ReceiptContext";
import { FormControlLabel, FormGroup, Switch, Tooltip } from "@mui/material";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;

const Form = ({ inContainer, formikRef, initialValues, validationSchema, onSubmit, textBtnSubmit, handleCancel }) => (
   <FormikForm
      formikRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      alignContent={"center"}
      textBtnSubmit={textBtnSubmit}
      btnSize="large"
      showCancelButton={true}
      handleCancel={handleCancel}
      col={12}
      maxHeight={inContainer === "drawer" ? "73vh" : inContainer === "modal" ? "65vh" : "auto"}
      // sizeCols={{}}
      spacing={0}
      inContainer={["drawer", "modal"].includes(inContainer)}
   >
      <Input col={12} idName="folio" label="Folio del Caso" placeholder="Escriba El folio del caso" type="text" textStyleCase={true} required disabled />

      <Input
         col={12}
         idName="num_folio"
         label="Foliado del Recibo"
         placeholder="Escribe el número foliado del Recibo"
         type="number"
         textStyleCase={null}
         helperText=""
         required
      />
      <Input col={12} idName="amount" label="Monto Autorizado" placeholder="999.99" type="number" helperText="" required />
   </FormikForm>
);

/**
 * Componente formulario Formik .
 *
 * Este componente renderiza un formulario y te permite elegir si deseas que sea contenido dentro de
 * un drawer lateral, un modal o sin contenedor.
 *
 * @component
 * @example
 * <UserForm
 *   container = ""
 * />
 *
 * @param {Object} props - Propiedades del componente.
 * @param {"drawer" | "modal" | "none"} [props.container="drawer"] - Tipo de contenedor para el formulario (por defecto "drawer")
 * @param {*} [props.openDialog] - State En dado caso se necesite abrir un segundo formulario en una vista
 * @param {*} [props.setOpenDialog] - Funcion del State
 * @param {*} [props.refreshSelect] - Funcion para refrescar el listado en caso se haya agregado un registro
 *
 * @returns {React.JSX.Element} El componente FormikForm.
 */
const ReceiptForm = ({ container = "drawer", refreshSelect, openDialog, setOpenDialog }) => {
   const { setIsLoading } = useGlobalContext();
   const { singularName, num_folio, formTitle, setFormTitle, textBtnSubmit, setTextBtnSubmit, formikRef, isEdit, setIsEdit, createOrUpdateReceipt } =
      useReceiptContext();
   // const formikRef = useRef(null);

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);

   const formData = [
      { name: "id", value: null, validations: null },
      { name: "folio", value: "", validations: Yup.string().trim().required("Folio de la situación requerido") },
      { name: "num_folio", value: "", validations: Yup.number().required("N° de Folio del recibo requerido") },
      { name: "amount", value: "", validations: Yup.number().required("Monto autorizado requerido") }
   ];
   const initialValues = {};
   const validations = {};
   formData.forEach((field) => {
      initialValues[field.name] = field.value;
      validations[field.name] = field.validations;
   });
   const validationSchema = Yup.object().shape(validations);
   const onSubmit = async (values, { setSubmitting, resetForm }) => {
      // console.log("🚀 ~ onSubmit ~ values:", values);
      setIsLoading(true);
      // console.log("🚀 ~ onSubmit ~ values:", values);
      const res = await createOrUpdateReceipt(values);
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

      await resetForm();
      formikRef.current.resetForm();
      formikRef.current.setValues(formikRef.current.initialValues);
      if (res.alert_text) Toast.Success(res.alert_text);

      setSubmitting(false);
      setIsLoading(false);
      if (refreshSelect) await refreshSelect();
      if (!checkAdd) setOpenDialog(false);
   };
   const handleCancel = () => {
      formikRef.current.resetForm();
      formikRef.current.setValues(formikRef.current.initialValues);
      setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      setTextBtnSubmit("AGREGAR");
      setIsEdit(false);
      if (refreshSelect) refreshSelect();
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

   // useEffect(() => {
   //    // Almacena la referencia de Formik en el estado de Zustand
   //    setFormikRef(formikRef);
   // }, [setFormikRef]);

   useEffect(() => {
      // console.log("🚀 Form ~ useEffect :");
      // console.log("🚀 Form ~ useEffect ~ isEdit:", isEdit);
   }, [num_folio, formikRef, isEdit]);

   return (
      <>
         {container === "drawer" ? (
            <Drawer
               sx={{ zIndex: 9999 }}
               anchor="right"
               open={openDialog}
               setOpen={setOpenDialog}
               onClose={() => setOpenDialog(false)}
               className="form-drawer"
               headerDrawer={
                  <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"} className="pb-1" sx={{ backgroundColor: "primary.main" }}>
                     <Typography className="font-extrabold text-center" variant="h5" fontWeight={"bold"}>
                        {formTitle}
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
            >
               <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"} className="p-3 pb-5 rounded-b-xl">
                  <Typography fontWeight={"bold"} variant="h4" className="font-extrabold text-center">
                     {formTitle}
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
               <Form
                  inContainer={container}
                  formikRef={formikRef}
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  textBtnSubmit={textBtnSubmit}
                  handleCancel={handleCancel}
               />
            </Drawer>
         ) : container === "modal" ? (
            <DialogComponent
               open={openDialog}
               setOpen={setOpenDialog}
               modalTitle={
                  <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                     <Typography className="font-extrabold text-center" variant="h4" fontWeight={"bold"}>
                        {formTitle}
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
                  inContainer={container}
                  formikRef={formikRef}
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  textBtnSubmit={textBtnSubmit}
                  handleCancel={handleCancel}
               />
            </DialogComponent>
         ) : (
            <Form
               inContainer={container}
               formikRef={formikRef}
               initialValues={initialValues}
               validationSchema={validationSchema}
               onSubmit={onSubmit}
               textBtnSubmit={textBtnSubmit}
               handleCancel={handleCancel}
            />
         )}
      </>
   );
};

export default ReceiptForm;
