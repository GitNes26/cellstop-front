import { useEffect, useState } from "react";
import FormikForm, { Input, LocationButton, Textarea } from "../../../../components/forms";
import * as Yup from "yup";
import { DialogComponent } from "../../../../components";
import { Drawer, FormControlLabel, FormGroup, Switch, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

import Toast from "../../../../utils/Toast";
import { useAuthContext } from "../../../../context/AuthContext";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useSaleContext } from "../../../../context/SaleContext"; // Nuevo contexto para ventas
import EvidenceCapture from "../../../../components/forms/EvidenceCapture"; // Nuevo componente de cámara
import { isMobile } from "react-device-detect";

const checkAddInitialState = localStorage.getItem("checkAddSale") === "true";

const Form = ({ formData, validations, formikRef, validationSchema, onSubmit, textBtnSubmit, handleCancel, container }) => {
   const initialValues = {};
   const inputsForms = [];

   formData.forEach((field) => {
      if (field.dividerBefore.show)
         inputsForms.push(<DividerComponent title={field.dividerBefore.title} orientation={field.dividerBefore.orientation} sx={field.dividerBefore.sx} />);
      inputsForms.push(field.input);
      initialValues[field.name] = field.value;
      if (formData[0].validationPage.length === 0) validations[field.name] = field.validations;
   });

   return (
      <FormikForm
         formikRef={formikRef}
         initialValues={initialValues}
         validationSchema={() => validationSchema()}
         onSubmit={onSubmit}
         alignContent={"center"}
         textBtnSubmit={textBtnSubmit}
         showCancelButton
         handleCancel={handleCancel}
         showActionButtons
         col={12}
         spacing={2}
         maxHeight={container === "drawer" ? "70vh" : container === "modal" ? "65vh" : "auto"}
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
const SaleForm = ({ container = "drawer", refreshSelect, openDialog, setOpenDialog }) => {
   const { auth } = useAuthContext();
   const { setIsLoading } = useGlobalContext();
   const { singularName, formTitle, textBtnSubmit, setTextBtnSubmit, formikRef, isEdit, setIsEdit, createOrUpdateSale } = useSaleContext();

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);

   const formData = [
      {
         name: "id",
         input: <Input key={`key-input-id`} col={1} idName={"id"} label={"ID"} hidden />,
         value: null,
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "chip_id",
         input: <Input key={`key-input-chip_id`} col={12} idName="chip_id" label="ID del Chip" placeholder="Escanee o escriba el número del chip" required />,
         value: "",
         validations: Yup.string().required("El ID del chip es requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "buyer_name",
         input: <Input key={`key-input-buyer_name`} col={8} idName="buyer_name" label="Nombre del comprador" placeholder="Nombre completo del comprador" required />,
         value: "",
         validations: Yup.string().trim().required("Nombre del comprador requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "buyer_phone",
         input: (
            <Input
               key={`key-input-buyer_phone`}
               col={4}
               idName="buyer_phone"
               label="Teléfono del comprador"
               placeholder="10 dígitos"
               type="tel"
               maxLength={10}
               required
            />
         ),
         value: "",
         validations: Yup.string()
            .matches(/^[0-9]{10}$/, "Debe contener 10 dígitos")
            .required("Teléfono del comprador requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "ubication",
         input: <LocationButton idNameLat="lat" idNameLng="lon" idNameUbi="ubication" label="Ubicación del comprador" mb={2} />,
         value: "",
         validations: Yup.string().required("Ubicación requerida"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "evidence_photo",
         input: (
            <EvidenceCapture
               key={`key-input-evidence`}
               idName="evidence_photo"
               label="Foto de evidencia"
               required
               helperText="Toma una foto del comprador con el chip o documento"
            />
         ),
         value: "",
         validations: Yup.string().required("Foto de evidencia requerida"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      }
   ];

   const validations = {};

   const validationSchema = () => Yup.object().shape(validations);

   const onSubmit = async (values, { setSubmitting, resetForm }) => {
      setIsLoading(true);
      const res = await createOrUpdateSale(values);

      if (!res) return setIsLoading(false);

      if (res.errors) {
         Object.values(res.errors).forEach((errors) => errors.forEach((error) => Toast.Warning(error)));
         return setIsLoading(false);
      }

      if (res.status_code !== 200) {
         Toast.Customizable(res.alert_text, res.alert_icon);
         return setIsLoading(false);
      }

      Toast.Success(res.alert_text);
      await resetForm();
      formikRef.current?.resetForm();
      setSubmitting(false);
      setIsLoading(false);
      if (refreshSelect) await refreshSelect();
      if (!checkAdd) setOpenDialog(false);
   };

   const handleCancel = () => {
      formikRef.current?.resetForm();
      setIsEdit(false);
      if (!checkAdd) setOpenDialog(false);
   };

   const handleChangeCheckAdd = (checked) => {
      localStorage.setItem("checkAddSale", checked);
      setCheckAdd(checked);
   };

   return (
      <>
         {container === "drawer" ? (
            <Drawer anchor="right" open={openDialog} onClose={() => setOpenDialog(false)} className="form-drawer">
               <Grid display="flex" justifyContent="space-between" alignItems="center" className="p-3 pb-5 rounded-b-xl" sx={{ backgroundColor: "primary.main" }}>
                  <Typography fontWeight="bold" variant="h4" className="font-extrabold text-center">
                     {formTitle}
                  </Typography>
                  <Tooltip title="Al estar activo, el formulario no se cerrará al terminar un registro">
                     <FormGroup>
                        <FormControlLabel
                           control={<Switch defaultChecked={checkAdd} color="dark" />}
                           label="Seguir Agregando"
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
            <DialogComponent open={openDialog} setOpen={setOpenDialog} modalTitle={formTitle} fullScreen={isMobile}>
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
      </>
   );
};

export default SaleForm;
