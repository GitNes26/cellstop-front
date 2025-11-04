import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { generateUsername } from "../../../../utils/Formats";
// import useSSE from "../../../../hooks/useSSE";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;

// interface InputProps {
//    container?: "drawer" | "modal" ; // Tipo de contenedor para el formulario (por defecto "drawer")
// }

const Form = ({ formData, validations, formikRef, validationSchema, onSubmit, textBtnSubmit, handleCancel, container }) => {
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
         maxHeight={container === "drawer" ? "73vh" : container === "modal" ? "65vh" : "auto"}
         // sizeCols={{}}
         container={["drawer", "modal"].includes(container)}
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
const UserForm = ({ container = "drawer", refreshSelect, openDialog, setOpenDialog }) => {
   const { auth } = useAuthContext();
   const { setIsLoading } = useGlobalContext();

   const {
      singularName,
      user,
      formTitle,
      setFormTitle,
      textBtnSubmit,
      setTextBtnSubmit,
      formikRef,
      isEdit,
      setIsEdit,
      changePassword,
      setChangePassword,
      createOrUpdateUser
   } = useUserContext();
   const { allRoles, setAllRoles, getSelectIndexRoles } = useRoleContext();
   const { allEmployees, setAllEmployees, getSelectIndexEmployees } = useEmployeeContext();

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [roleFormDialog, setRoleFormDialog] = useState(false);
   const [employeeFormDialog, setEmployeeFormDialog] = useState(false);

   const { refetch: refreshRoles } = useFetch(getSelectIndexRoles, setAllRoles);
   const { refetch: refreshEmployees } = useFetch(getSelectIndexEmployees, setAllEmployees);
   // const { data, error, open, setOpen } = useSSE(API_EVENTS);

   const formData = [
      {
         name: "id",
         value: null,
         input: <Input key={`key-input-id`} col={1} idName={"id"} label={"ID"} required hidden />,
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "employee_id",
         value: 0,
         input: (
            <Select2
               KEY={`key-input-employee_id`}
               col={12}
               idName="employee_id"
               label="Empleado"
               placeholder=""
               refreshSelect={refreshEmployees}
               onChangeExtra={handleChangeEmployee}
               options={allEmployees || []}
               addRegister={auth.permissions.create ? () => setEmployeeFormDialog(true) : null}
            />
         ),
         validations: Yup.number().min(0, "Esta opción no es valida").notRequired(),
         validationPage: [],
         dividerBefore: { show: true, title: "EMPLEADO", orientation: "horizontal", sx: {} }
      },
      {
         name: "username",
         value: "",
         input: (
            <Input
               key={`key-input-username`}
               col={12}
               idName="username"
               label="Nombre de usuario"
               placeholder="miUsuario"
               type="text"
               textStyleCase={null}
               helperText=""
               required
            />
         ),
         validations: Yup.string().trim().required("Nombre de usuario requerido"),
         validationPage: [],
         dividerBefore: { show: true, title: "DATOS DE USUARIO", orientation: "horizontal", sx: {} }
      },
      {
         name: "email",
         value: "",
         input: (
            <Input
               key={`key-input-email`}
               col={12}
               idName="email"
               label="Correo"
               placeholder="micorreo@ejemplo.com"
               type="text"
               textStyleCase={false}
               helperText=""
               required
            />
         ),
         validations: Yup.string().trim().email("Formato invalido").required("correo requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "password",
         value: "123456",
         input: (
            <Input
               key={`key-input-password`}
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
         ),
         validations: isEdit
            ? changePassword && Yup.string().trim().min(6, "Tu contraseña debe tener mínimo 6 caracteres").required("La contraseña es requerida")
            : Yup.string().trim().min(6, "Tu contraseña debe tener mínimo 6 caracteres").required("La contraseña es requerida"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "changePassword",
         value: changePassword,
         input: <Input key={`key-input-changePassword`} col={12} idName={"changePassword"} label={"Cambiar contraseña"} type={"checkbox"} required hidden />,
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      }, // solo para la logica en el backend
      {
         name: "confirmPassword",
         value: "123456",
         input: (
            <Input
               key={`key-input-confirmPassword`}
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
         ),
         validations: isEdit
            ? changePassword &&
              Yup.string()
                 .trim()
                 .test("confirmPassword", "Las contraseñas no coinciden", (value) => value.match(formikRef.current.values.password))
                 .required("El nombre de usuario es requerido")
            : Yup.string()
                 .trim()
                 .test("confirmPassword", "Las contraseñas no coinciden", (value) => value.match(formikRef.current.values.password))
                 .required("El nombre de usuario es requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "role_id",
         value: 0,
         input: (
            <Select2
               key={`key-input-role_id`}
               col={12}
               idName="role_id"
               label="Rol"
               placeholder="Mi perfil"
               refreshSelect={refreshRoles}
               options={allRoles || []}
               addRegister={auth.permissions.create ? () => setRoleFormDialog(true) : null}
               required
            />
         ),
         validations: Yup.number().min(1, "Esta opción no es valida").required("Rol requerido"),
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
      // values.evidences = imgEvidences.length == 0 ? "" : imgEvidences[0].file;
      // return console.log("🚀 ~ onSubmit ~ values:", values);
      setIsLoading(true);
      const res = await createOrUpdateUser(values);
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
      // console.log("🚀 ~ handleChangeCheckAdd ~ checked:", checked);
      try {
         localStorage.setItem("checkAdd", checked);
         setCheckAdd(checked);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   function handleChangeEmployee(values) {
      // console.log("🚀 ~ handleChangeEmployee ~ values:", values);
      if (values.value.id <= 0) return formikRef.current.setFieldValue("username", "");
      formikRef.current.setFieldValue("username", generateUsername(values.value.label));
   }

   useEffect(() => {
      // console.log("🚀 Form ~ useEffect ~ changePassword:", changePassword);
      // console.log("🚀 Form ~ useEffect ~ isEdit:", isEdit);
   }, [user, formikRef, isEdit]); //changePassword

   return (
      <>
         {container === "drawer" ? (
            <Drawer
               // sx={{ zIndex: 9999 }}
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
                  formData={formData}
                  validations={validations}
                  formikRef={formikRef}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  textBtnSubmit={textBtnSubmit}
                  handleCancel={handleCancel}
                  container={container}
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
                  formData={formData}
                  validations={validations}
                  formikRef={formikRef}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  textBtnSubmit={textBtnSubmit}
                  handleCancel={handleCancel}
                  container={container}
               />
            </DialogComponent>
         ) : (
            <Form
               formData={formData}
               validations={validations}
               formikRef={formikRef}
               validationSchema={validationSchema}
               onSubmit={onSubmit}
               textBtnSubmit={textBtnSubmit}
               handleCancel={handleCancel}
               container={container}
            />
         )}
         <RoleForm container="modal" openDialog={roleFormDialog} setOpenDialog={setRoleFormDialog} refreshSelect={refreshRoles} />
         <EmployeeForm container="modal" openDialog={employeeFormDialog} setOpenDialog={setEmployeeFormDialog} refreshSelect={refreshEmployees} />
      </>
   );
};

export default UserForm;
