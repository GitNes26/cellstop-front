import { useEffect, useState } from "react";
import FormikForm, { Input, LocationButton, Select2, Textarea } from "../../../../components/forms";
import * as Yup from "yup";
import { DialogComponent } from "../../../../components";
import { Drawer, FormControlLabel, FormGroup, Switch, Tooltip, Typography } from "@mui/material";

import Toast from "../../../../utils/Toast";
import Grid from "@mui/material/Grid";
import { useAuthContext } from "../../../../context/AuthContext";
import { ROLE_SELLER, useGlobalContext } from "../../../../context/GlobalContext";
import { usePointOfSaleContext } from "../../../../context/PointOfSaleContext";
import UserForm from "../../settings/usersView/Form";
import useFetch from "../../../../hooks/useFetch";
import { useUserContext } from "../../../../context/UserContext";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;

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
         maxHeight={container === "drawer" ? "70vh" : container === "modal" ? "65vh" : "auto"}
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
const PointOfSaleForm = ({ container = "drawer", refreshSelect, openDialog, setOpenDialog }) => {
   const { auth, theUserIs } = useAuthContext();
   const { setIsLoading } = useGlobalContext();
   const { usersSelect, setUsersSelect, getSelectIndexUsersByRole } = useUserContext();
   const { singularName, pointOfSale, formTitle, setFormTitle, textBtnSubmit, setTextBtnSubmit, formikRef, isEdit, setIsEdit, createOrUpdatePointOfSale } =
      usePointOfSaleContext();
   const [sellerFormDialog, setSellerFormDialog] = useState(false);

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const { refetch: refetchSeller } = useFetch(() => getSelectIndexUsersByRole(3), setUsersSelect);

   const formData = [
      {
         name: "id",
         input: <Input key={`key-input-id`} col={1} idName={"id"} label={"ID"} required hidden />,
         value: null,
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "seller_id",
         input: (
            <Select2
               key={`key-input-seller_id`}
               col={12}
               idName="seller_id"
               label="Vendedor"
               // options={usersSelect.filter((item) => item.role_id !== 3) || []}
               options={usersSelect || []}
               refreshSelect={refetchSeller}
               addRegister={auth.permissions.create ? () => setSellerFormDialog(true) : null}
               disabled={theUserIs([ROLE_SELLER])}
               required
            />
         ),
         value: "",
         validations: Yup.number().min(1, "Esta opción no es valida").required("Vendedor requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "name",
         input: (
            <Input
               key={`key-input-name`}
               col={12}
               idName="name"
               label="Nombre del punto de venta / Cliente"
               placeholder="Escriba el nombre del punto de venta / cliente"
               type="text"
               textStyleCase={null}
               helperText=""
               required
            />
         ),
         value: "",
         validations: Yup.string().trim().required("Nombre del punto de venta / cliente requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "contact_name",
         input: (
            <Input
               key={`key-input-contact_name`}
               col={8}
               idName="contact_name"
               label="Nombre del contacto"
               placeholder="Escriba el nombre del contacto"
               type="text"
               textStyleCase={null}
               helperText=""
               required
            />
         ),
         value: "",
         validations: Yup.string().trim().required("Nombre del contacto requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "contact_phone",
         input: (
            <Input
               key={`key-input-contact_phone`}
               col={4}
               idName="contact_phone"
               label="Teléfono del contacto"
               placeholder={"10 dígitos"}
               type="tel"
               maxLength={10}
               textStyleCase={null}
               helperText=""
               required
            />
         ),
         value: "",
         validations: Yup.string()
            // .transform((value) => value.replace(/[^\d]/g, "")) // Elimina caracteres no numéricos
            .matches(/^[0-9]{10}$/, "El número debe contener 10 dígitos.")
            .required("Número del contacto requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "address",
         input: (
            <Textarea
               key={`key-input-address`}
               col={12}
               idName={"address"}
               label={"Dirección del punto de venta / cliente"}
               placeholder={"Calle | Num. Ext | Num. Int | Colonia | C.P. | Ciudad | Estado"}
               helperText={""}
               textStyleCase={null}
               styleInput={"classic"}
               size={"md"}
               rows={2}
               characterLimit={0}
               required
            />
         ),
         value: "",
         validations: Yup.string().trim().required("Dirección requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      // {
      //    name: "lat",
      //    input: <Input key={`key-input-lat`} col={6} idName="lat" label="Latitud" placeholder="0.00000000" type="text" textStyleCase={null} helperText="" disabled />,
      //    value: "",
      //    validations: Yup.string().trim().notRequired(""),
      //    validationPage: [],
      //    dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      // },
      // {
      //    name: "lon",
      //    input: <Input key={`key-input-lon`} col={6} idName="lon" label="Longitud" placeholder="0.00000000" type="text" textStyleCase={null} helperText="" disabled />,
      //    value: "",
      //    validations: Yup.string().trim().notRequired(""),
      //    validationPage: [],
      //    dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      // },
      {
         name: "ubication",
         input: <LocationButton idNameLat="lat" idNameLng="lon" idNameUbi="ubication" label="Ubicación del establecimiento" mb={2} />,
         value: "",
         validations: Yup.string().trim().notRequired(),
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
      const res = await createOrUpdatePointOfSale(values);
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

   const init = () => {
      // si el usuario es de rol_id === 3 (vendedor) seleccionar el id y poner disabled el Select2
      if (theUserIs([ROLE_SELLER])) formikRef?.current?.setFieldValue("seller_id", auth.role_id);
      else console.log("no lo soy");
   };
   useEffect(() => {
      // console.log("🚀 ~ AssignmentForm ~ useEffect:openDialog:", openDialog);
      // formikRef?.current?.resetForm();
      // formikRef?.current?.setValues(formikRef.current.initialValues);
      init();
   }, [openDialog == true]);

   useEffect(() => {
      // console.log("🚀 Form ~ useEffect :");
      // console.log("🚀 Form ~ useEffect ~ isEdit:", isEdit);
   }, [pointOfSale, formikRef, isEdit]);

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
            >
               <Grid
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  className="p-3 pb-5 rounded-b-xl"
                  sx={{ backgroundColor: "primary.main" }}
               >
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
         <UserForm container="modal" openDialog={sellerFormDialog} setOpenDialog={setSellerFormDialog} refreshSelect={refetchSeller} />
      </>
   );
};

export default PointOfSaleForm;
