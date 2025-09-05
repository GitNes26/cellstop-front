import { useCallback, useEffect, useRef, useState } from "react";
import FormikForm, { DividerComponent, Input, Select2 } from "../../../../components/forms";
import * as Yup from "yup";
import { DialogComponent } from "../../../../components";
import { Box, Divider, Drawer, FormControlLabel, FormGroup, Switch, ToggleButton, Tooltip, Typography } from "@mui/material";

// import { DialogComponent, Divider, Drawer, Toggle, Typography } from "../../../../components/basics";
import useFetch from "../../../../hooks/useFetch";
import Toast from "../../../../utils/Toast";
import Grid from "@mui/material/Grid";
import RoleForm from "../rolesView/Form";
import EmployeeForm from "../employeesView/Form";
import { useAuthContext } from "../../../../context/AuthContext";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useUserContext } from "../../../../context/UserContext";
import { useRoleContext } from "../../../../context/RoleContext";
import { useEmployeeContext } from "../../../../context/EmployeeContext";
// import useSSE from "../../../../hooks/useSSE";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;

// interface InputProps {
//    container?: "drawer" | "modal" ; // Tipo de contenedor para el formulario (por defecto "drawer")
// }
const Form = ({
   inContainer,
   formikRef,
   initialValues,
   validationSchema,
   onSubmit,
   textBtnSubmit,
   handleCancel,
   isEdit,
   changePassword,
   setChangePassword,
   refreshRoles,
   allRoles,
   setRoleFormDialog,
   refreshEmployees,
   allEmployees,
   setEmployeeFormDialog,
   auth
}) => (
   <FormikForm
      formikRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      alignContent={"center"}
      textBtnSubmit={textBtnSubmit}
      btnSize="md"
      showCancelButton={true}
      handleCancel={handleCancel}
      col={12}
      maxHeight={inContainer === "drawer" ? "73vh" : inContainer === "modal" ? "65vh" : "auto"}
      // sizeCols={{}}
      spacing={0}
      inContainer={["drawer", "modal"].includes(inContainer)}
   >
      <Input col={12} idName="username" label="Nombre de usuario" placeholder="miUsuario" type="text" textStyleCase={null} helperText="" required />
      <Input col={12} idName="email" label="Correo" placeholder="micorreo@ejemplo.com" type="text" textStyleCase={false} helperText="" required />
      <Grid container width={"100%"} alignItems={"flex-end"}>
         <Input
            col={6}
            idName="password"
            label="Contraseña"
            placeholder="******"
            type="password"
            textStyleCase={null}
            helperText="Mínimo 6 caracteres"
            disabled={isEdit ? !changePassword : false}
            setChangePassword={() => setChangePassword(!changePassword)}
            required
         />
         <Input
            col={6}
            idName="confirmPassword"
            label="Confirmar Contraseña"
            placeholder="******"
            type="password"
            textStyleCase={null}
            helperText="Vuelve a escribir la contraseña"
            disabled={isEdit ? !changePassword : false}
            required
         />
      </Grid>
      <Select2
         col={12}
         idName="role_id"
         label="Rol"
         placeholder="Mi perfil"
         refreshSelect={refreshRoles}
         options={allRoles || []}
         addRegister={auth.permissions.create ? () => setRoleFormDialog(true) : null}
         required
      />
      <Divider text="EMPLEADO" />
      <Select2
         col={12}
         idName="employee_id"
         label="Empleado"
         placeholder=""
         refreshSelect={refreshEmployees}
         options={allEmployees || []}
         addRegister={auth.permissions.create ? () => setEmployeeFormDialog(true) : null}
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
const UserForm = ({ container = "drawer", refreshSelect }) => {
   const { auth } = useAuthContext();
   const { setIsLoading, openDialog, setOpenDialog } = useGlobalContext();
   // const { openDialog, setOpenDialog } = useGlobalContext();

   const { singularName, user, formTitle, setFormTitle, textBtnSubmit, setTextBtnSubmit, formikRef, isEdit, setIsEdit, changePassword, setChangePassword } =
      useUserContext();
   const { allRoles, setAllRoles, getSelectIndexRoles } = useRoleContext();
   const { allEmployees, setAllEmployees, getSelectIndexEmployees } = useEmployeeContext();

   const formikRef3 = useRef(null);

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [roleFormDialog, setRoleFormDialog] = useState(false);
   const [employeeFormDialog, setEmployeeFormDialog] = useState(false);

   const { refetch: refreshRoles } = useFetch(getSelectIndexRoles, setAllRoles);
   const { refetch: refreshEmployees } = useFetch(getSelectIndexEmployees, setAllEmployees);
   // const { data, error, open, setOpen } = useSSE(API_EVENTS);

   const formData = [
      { name: "id", value: null, validations: null },
      { name: "username", value: "", validations: Yup.string().trim().required("Nombre de usuario requerido") },
      { name: "email", value: "", validations: Yup.string().trim().email("Formato invalido").required("correo requerido") },
      {
         name: "password",
         value: "123456",
         validations: isEdit
            ? changePassword && Yup.string().trim().min(6, "Tu contraseña debe tener mínimo 6 caracteres").required("La contraseña es requerida")
            : Yup.string().trim().min(6, "Tu contraseña debe tener mínimo 6 caracteres").required("La contraseña es requerida")
      },
      { name: "changePassword", value: changePassword, validations: null }, // solo para la logica en el backend
      {
         name: "confirmPassword",
         value: "123456",
         validations: isEdit
            ? changePassword &&
              Yup.string()
                 .trim()
                 .test("confirmPassword", "Las contraseñas no coinciden", (value) => value.match(formikRef.current.values.password))
                 .required("El nombre de usuario es requerido")
            : Yup.string()
                 .trim()
                 .test("confirmPassword", "Las contraseñas no coinciden", (value) => value.match(formikRef.current.values.password))
                 .required("El nombre de usuario es requerido")
      },
      { name: "role_id", value: 0, validations: Yup.number().min(1, "Esta opción no es valida").required("Rol requerido") },
      { name: "employee_id", value: 0, validations: Yup.number().min(1, "Esta opción no es valida").notRequired() }
   ];
   const initialValues = {};
   const validations = {};
   formData.forEach((field) => {
      initialValues[field.name] = field.value;
      validations[field.name] = field.validations;
   });
   const validationSchema = Yup.object().shape(validations);

   const onSubmit = async (values, { setSubmitting, resetForm }) => {
      // console.log("🚀 ~ onSubmit ~ validationSchema:", validationSchema());
      // values.evidences = imgEvidences.length == 0 ? "" : imgEvidences[0].file;
      // return console.log("🚀 ~ onSubmit ~ values:", values);
      setIsLoading(true);
      const res = await createOrUpdateUser(values);
      // console.log('🚀 ~ onSubmit ~ res:', res);
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
      // setImgEvidences([]);
      setIsEdit(false);
      setChangePassword(false);
      if (!checkAdd) setOpenDialog(false);
   };

   const handleChangeCheckAdd = (checked) => {
      console.log("🚀 ~ handleChangeCheckAdd ~ checked:", checked);
      try {
         localStorage.setItem("checkAdd", checked);
         setCheckAdd(checked);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      // console.log("🚀 Form ~ useEffect ~ changePassword:", changePassword);
      // console.log("🚀 Form ~ useEffect ~ isEdit:", isEdit);
      console.log("🚀 ~ formikRef:", formikRef);
      console.log("🚀 ~ formikRef3:", formikRef3);
   }, [user, formikRef, isEdit, changePassword]);

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
               // headerDrawer={
               //    <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
               //       <Typography className="font-extrabold text-center">{formTitle}</Typography>

               //       <ToggleButton
               //          Button
               //          label={"Seguir Agregando"}
               //          size="xs"
               //          classNameText="ml-1"
               //          style={{ opacity: checkAdd ? 1 : 0.35 }}
               //          defaultChecked={checkAdd}
               //          onChange={(e) => handleChangeCheckAdd(e.target.checked)}
               //          tooltipTitle="Al estar activo, el formulario no se cerrará al terminar un registro"
               //       />
               //    </Grid>
               // }
            >
               <Grid
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  className=" p-3 pb-5 rounded-b-xl"
                  sx={{ backgroundColor: "primary.main" }}
               >
                  <Typography fontWeight={"bold"} variant="h5" className="font-extrabold text-center">
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
                  {/* <ToggleButton
                     Button
                     label={"Seguir Agregando"}
                     size="xs"
                     classNameText="ml-1"
                     style={{ opacity: checkAdd ? 1 : 0.35 }}
                     defaultChecked={checkAdd}
                     onChange={(e) => handleChangeCheckAdd(e.target.checked)}
                     tooltipTitle="Al estar activo, el formulario no se cerrará al terminar un registro"
                  /> */}
               </Grid>
               <Form
                  inContainer={container}
                  formikRef={formikRef}
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  textBtnSubmit={textBtnSubmit}
                  handleCancel={handleCancel}
                  isEdit={isEdit}
                  changePassword={changePassword}
                  setChangePassword={setChangePassword}
                  refreshRoles={refreshRoles}
                  allRoles={allRoles}
                  setRoleFormDialog={setRoleFormDialog}
                  refreshEmployees={refreshEmployees}
                  allEmployees={allEmployees}
                  setEmployeeFormDialog={setEmployeeFormDialog}
                  auth={auth}
               />
               {/* <Form
                  inContainer={container === "drawer"}
                  formikRef={formikRef}
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  textBtnSubmit={textBtnSubmit}
                  handleCancel={handleCancel}
                  isEdit={isEdit}
                  changePassword={changePassword}
                  setChangePassword={setChangePassword}
                  refreshRoles={refreshRoles}
                  allRoles={allRoles}
                  setRoleFormDialog={setRoleFormDialog}
                  refreshEmployees={refreshEmployees}
                  allEmployees={allEmployees}
                  setEmployeeFormDialog={setEmployeeFormDialog}
                  auth={auth}
               /> */}
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
                  maxHeight={container === "drawer" ? "73vh" : container === "modal" ? "65vh" : "auto"}
                  // sizeCols={{}}
                  container={["drawer", "modal"].includes(container)}
               >
                  {inputsForms.map((input) => input)}
               </FormikForm>
            </DialogComponent>
         ) : (
            <FormikForm
               formikRef={formikRef}
               ref={formikRef}
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
               maxHeight={container === "drawer" ? "73vh" : container === "modal" ? "65vh" : "auto"}
               // sizeCols={{}}
               container={["drawer", "modal"].includes(container)}
            >
               {inputsForms.map((input) => input)}
            </FormikForm>
         )}
         <RoleForm container="modal" openDialog={roleFormDialog} setOpenDialog={setRoleFormDialog} refreshSelect={refreshRoles} />
         <EmployeeForm container="modal" openDialog={employeeFormDialog} setOpenDialog={setEmployeeFormDialog} refreshSelect={refreshEmployees} />
      </>
   );
};

export default UserForm;
