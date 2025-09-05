import { useCallback, useEffect, useRef, useState } from "react";
import FormikForm, { Input, Textarea } from "../components/forms";
import * as Yup from "yup";
// import { DialogComponent, Drawer, Toggle, Typography } from "../components/basics";
import Toast from "../utils/Toast";
import { useGlobalContext } from "../context/GlobalContext";
import { useAuthContext } from "../context/AuthContext";
import { DialogComponent } from "../components";
import { Grid, Drawer, ToggleButton, Typography, Tooltip, FormGroup, FormControlLabel, Switch } from "@mui/material";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;

const Form = ({ inContainer, formikRef, initialValues, validationSchema, onSubmit, textBtnSubmit = "CAMBIAR CONTRASEÑA", handleCancel }) => (
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
      maxHeight={inContainer === "drawer" ? "73vh" : inContainer === "modal" ? "30vh" : "auto"}
      // sizeCols={{}}
      spacing={2}
      inContainer={["drawer", "modal"].includes(inContainer)}
   >
      <Input
         col={12}
         idName="password"
         label="Contraseña Actual"
         placeholder="Escriba la contraseña actual"
         type="password"
         textStyleCase={null}
         helperText=""
         required
      />
      <Input
         col={12}
         idName="new_password"
         label="Nueva contraseña"
         placeholder="Escriba la nueva contraseña"
         type="password"
         textStyleCase={null}
         helperText="Mínimo 6 caracteres"
         required
      />
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
const ChangePasswordForm = ({ container = "drawer", openDialog, setOpenDialog, refreshSelect }) => {
   const { setIsLoading } = useGlobalContext();
   const { formikRef, textBtnSubmit, changePasswordAuth, logout } = useAuthContext();
   const formTitle = "CAMBIAR CONTRASEÑA";
   // const formikRef = useRef(null);

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);

   const formData = [
      { name: "password", value: "", validations: Yup.string().trim().required("Contraseña actual requerida") },
      { name: "new_password", value: "", validations: Yup.string().trim().required("Nueva contraseña requerida").min(6, "Mínimo 6 caracteres") }
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
      await changePasswordAuth(values);
   };
   const handleCancel = () => {
      formikRef.current.resetForm();
      formikRef.current.setValues(formikRef.current.initialValues);
      // setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      // setTextBtnSubmit("AGREGAR");
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

   return (
      <>
         {container === "drawer" ? (
            <Drawer
               open={openDialog}
               setOpen={setOpenDialog}
               headerDrawer={
                  <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                     <Typography className="font-extrabold text-center" variant="h4" fontWeight={"bold"}>
                        {formTitle}
                     </Typography>
                  </Grid>
               }
            >
               <Form
                  inContainer={container}
                  formikRef={formikRef}
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  handleCancel={handleCancel}
               />
            </Drawer>
         ) : container === "modal" ? (
            <DialogComponent
               open={openDialog}
               setOpen={setOpenDialog}
               maxWidth="md"
               modalTitle={
                  <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                     <Typography className="font-extrabold text-center" variant="h4" fontWeight={"bold"}>
                        {formTitle}
                     </Typography>
                  </Grid>
               }
               fullScreen={false}
               height={undefined}
               formikRef={undefined}
            >
               <Form
                  inContainer={container}
                  formikRef={formikRef}
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
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

export default ChangePasswordForm;
