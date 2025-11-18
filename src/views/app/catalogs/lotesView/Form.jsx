import { useEffect, useState } from "react";
import FormikForm, { DividerComponent, FileInput, FirmPad, Input, Select2, Textarea } from "../../../../components/forms";
import * as Yup from "yup";
import { DialogComponent } from "../../../../components";
import { Drawer, FormControlLabel, FormGroup, Switch, Tooltip, Typography } from "@mui/material";
import Toast from "../../../../utils/Toast";
import Grid from "@mui/material/Grid";
import useFetch from "../../../../hooks/useFetch";
import UserForm from "../../settings/usersView/Form";
import { useAuthContext } from "../../../../context/AuthContext";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useLoteContext } from "../../../../context/LoteContext";
import { useUserContext } from "../../../../context/UserContext";
import { useProductContext } from "../../../../context/ProductContext";

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
         spacing={2}
         maxHeight={container === "drawer" ? "75vh" : container === "modal" ? "65vh" : "auto"}
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
 * <LoteForm
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
const LoteForm = ({ container = "drawer", refreshSelect, openDialog, setOpenDialog }) => {
   const { auth } = useAuthContext();
   const { setIsLoading } = useGlobalContext();
   const { singularName, lote, formTitle, setFormTitle, textBtnSubmit, setTextBtnSubmit, formikRef, isEdit, setIsEdit, createOrUpdateLote } = useLoteContext();
   const { usersSelect, setUsersSelect, getSelectIndexUsersByRole } = useUserContext();
   const { foliosSelect, setFoliosSelect, getSelectIndexFolios } = useProductContext();

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [sellerFormDialog, setSellerFormDialog] = useState(false);

   const { refetch: refetchSeller } = useFetch(() => getSelectIndexUsersByRole(3), setUsersSelect);
   const { refetch: refetchFolios } = useFetch(() => getSelectIndexFolios(), setFoliosSelect);

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
         name: "lote",
         input: (
            <Input
               key={`key-input-lote`}
               col={12}
               idName="lote"
               label="Lote"
               placeholder="Escriba # de lote"
               type="text"
               textStyleCase={true}
               helperText=""
               required
            />
         ),
         value: "",
         validations: Yup.string().trim().required("Lote requerido"),
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
               required
            />
         ),
         value: "",
         validations: Yup.number().min(1, "Esta opción no es valida").required("Vendedor requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "description",
         input: (
            <Textarea
               key={`key-input-description`}
               idName={"description"}
               label={"Descripción del lote"}
               placeholder={"Puedes agregar una descripción"}
               helperText={""}
               textStyleCase={null}
               styleInput={"classic"}
               size={"md"}
               rows={3}
               characterLimit={0}
            />
         ),
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "folio",
         input: (
            <Select2
               key={`key-input-folio`}
               col={8}
               idName="folio"
               label="Folio"
               options={foliosSelect || []}
               refreshSelect={refetchFolios}
               onChangeExtra={handleChangeFolio}
               required
            />
         ),
         value: "",
         validations: Yup.number().min(1, "Esta opción no es valida").required("Folio requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "quantity",
         input: (
            <Input
               key={`key-input-quantity`}
               col={4}
               idName="quantity"
               label="Cantidad de productos"
               placeholder="999"
               type="number"
               helperText=""
               maxLength={3}
               required
            />
         ),
         value: 500,
         validations: Yup.number().min(1, "La cantidad minima es 1").required("Cantidad requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "lada",
         input: (
            <Input key={`key-input-lada`} col={3} idName="lada" label="Lada" placeholder="871" type="text" textStyleCase={true} helperText="" maxLength={3} required />
         ),
         value: "",
         validations: Yup.string().trim().required("Lada requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "preactivation_date",
         input: (
            <Input
               key={`key-input-preactivation_date`}
               col={9}
               idName="preactivation_date"
               label="Fecha de Pre-activación"
               // placeholder="DD/MM/AAAA"
               type="date"
               textStyleCase={true}
               helperText=""
               required
            />
         ),
         value: "",
         validations: Yup.string().trim().required("Fecha de Pre-activación requerido"),
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

      const res = await createOrUpdateLote(values);
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

   function handleChangeFolio(values) {
      // console.log("🚀 ~ handleChangeFolio ~ values:", values);
      const folioSelected = foliosSelect.find((folio) => folio.id == values.value.id);
      if (folioSelected == undefined) {
         formikRef.current.setFieldValue("lada", "");
         formikRef.current.setFieldValue("preactivation_date", "");
         return;
      }
      formikRef.current.setFieldValue("lada", folioSelected.lada);
      formikRef.current.setFieldValue("preactivation_date", folioSelected.fecha_preactivacion);
   }

   useEffect(() => {
      // console.log("🚀 Form ~ useEffect :");
      // console.log("🚀 Form ~ useEffect ~ isEdit:", isEdit);
   }, [lote, formikRef, isEdit]);

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

export default LoteForm;
