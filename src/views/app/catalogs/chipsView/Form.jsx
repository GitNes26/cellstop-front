import { useEffect, useState } from "react";
import FormikForm, { Input, Textarea, Select2 } from "../../../../components/forms";
import * as Yup from "yup";
import { DialogComponent } from "../../../../components";
import { Drawer, FormControlLabel, FormGroup, Switch, Tooltip, Typography } from "@mui/material";
import Toast from "../../../../utils/Toast";
import Grid from "@mui/material/Grid";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useChipContext } from "../../../../context/ChipContext";
import { color } from "framer-motion";

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
const ChipForm = ({ container = "drawer", refreshSelect, openDialog, setOpenDialog }) => {
   const { setIsLoading } = useGlobalContext();
   const { singularName, chip, formTitle, setFormTitle, textBtnSubmit, setTextBtnSubmit, formikRef, isEdit, setIsEdit, createOrUpdateChip } = useChipContext();

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);

   // const formData = [
   //    {
   //       name: "id",
   //       input: <Input key={`key-input-id`} col={1} idName={"id"} label={"ID"} required hidden />,
   //       value: null,
   //       validations: null,
   //       validationPage: [],
   //       dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
   //    },
   //    {
   //       name: "iccid",
   //       input: (
   //          <Input
   //             key={`key-input-iccid`}
   //             col={12}
   //             idName="iccid"
   //             label="ICCID"
   //             placeholder="Escriba el ICCID"
   //             type="text"
   //             textStyleCase={true}
   //             helperText=""
   //             required
   //          />
   //       ),
   //       value: "",
   //       validations: Yup.string().trim().required("ICCID requerido"),
   //       validationPage: [],
   //       dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
   //    },
   //    {
   //       name: "operator",
   //       input: (
   //          <Input
   //             key={`key-input-operator`}
   //             col={12}
   //             idName="operator"
   //             label="Nombre de la operadora"
   //             placeholder="Escriba el nombre de la operadora"
   //             type="text"
   //             textStyleCase={null}
   //             helperText=""
   //             required
   //          />
   //       ),
   //       value: "",
   //       validations: Yup.string().trim().required("Nombre de la operadora requerido"),
   //       validationPage: [],
   //       dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
   //    },
   //    {
   //       name: "chip_description",
   //       input: (
   //          <Textarea
   //             key={`key-input-chip_description`}
   //             col={12}
   //             idName="chip_description"
   //             label="Descripción"
   //             placeholder="Puedes agregar descripción de lo que se realiza..."
   //             helperText=""
   //             rows={5}
   //          />
   //       ),
   //       value: "",
   //       validations: null,
   //       validationPage: [],
   //       dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
   //    }
   // ];
   const formData = [
      {
         name: "id",
         input: <Input key={`key-input-id`} col={1} idName="id" label="ID" required hidden />,
         value: null,
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "product_id",
         input: (
            <Input
               key={`key-input-product_id`}
               col={12}
               idName="product_id"
               label="Producto ID"
               placeholder="Ingrese el ID del producto"
               type="number"
               helperText=""
               required
            />
         ),
         value: "",
         validations: Yup.number().required("ID del producto requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "filtro",
         input: <Input key={`key-input-filtro`} col={12} idName="filtro" label="Filtro" placeholder="Ingrese el filtro" type="text" helperText="" />,
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "telefono",
         input: <Input key={`key-input-telefono`} col={12} idName="telefono" label="Teléfono" placeholder="Ingrese el número de teléfono" type="text" helperText="" />,
         value: "",
         validations: Yup.string().trim().required("Teléfono requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "imei",
         input: <Input key={`key-input-imei`} col={12} idName="imei" label="IMEI" placeholder="Ingrese el IMEI" type="text" helperText="" />,
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "iccid",
         input: <Input key={`key-input-iccid`} col={12} idName="iccid" label="ICCID" placeholder="Ingrese el ICCID" type="text" helperText="" required />,
         value: "",
         validations: Yup.string().trim().required("ICCID requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "estatus_lin",
         input: (
            <Input
               key={`key-input-estatus_lin`}
               col={12}
               idName="estatus_lin"
               label="Estatus Línea"
               placeholder="Ingrese el estatus de la línea"
               type="text"
               helperText=""
            />
         ),
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "movimiento",
         input: (
            <Input
               key={`key-input-movimiento`}
               col={12}
               idName="movimiento"
               label="Movimiento"
               placeholder="Ingrese el tipo de movimiento"
               type="text"
               helperText=""
            />
         ),
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "fecha_activ",
         input: (
            <Input
               key={`key-input-fecha_activ`}
               col={6}
               idName="fecha_activ"
               label="Fecha Activación"
               placeholder="Seleccione la fecha de activación"
               type="date"
               helperText=""
            />
         ),
         value: "",
         validations: Yup.date().nullable(),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "fecha_prim_llam",
         input: (
            <Input
               key={`key-input-fecha_prim_llam`}
               col={6}
               idName="fecha_prim_llam"
               label="Fecha 1ra Llamada"
               placeholder="Seleccione la fecha de primera llamada"
               type="date"
               helperText=""
            />
         ),
         value: "",
         validations: Yup.date().nullable(),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "fecha_dol",
         input: <Input key={`key-input-fecha_dol`} col={6} idName="fecha_dol" label="Fecha DOL" placeholder="Seleccione la fecha DOL" type="date" helperText="" />,
         value: "",
         validations: Yup.date().nullable(),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "estatus_pago",
         input: (
            <Input
               key={`key-input-estatus_pago`}
               col={12}
               idName="estatus_pago"
               label="Estatus de Pago"
               placeholder="Ingrese el estatus de pago"
               type="text"
               helperText=""
            />
         ),
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "motivo_estatus",
         input: (
            <Textarea key={`key-input-motivo_estatus`} col={12} idName="motivo_estatus" label="Motivo Estatus" placeholder="Describa el motivo del estatus" rows={3} />
         ),
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "monto_com",
         input: (
            <Input
               key={`key-input-monto_com`}
               col={6}
               idName="monto_com"
               label="Monto Comisión"
               placeholder="Ingrese el monto de comisión"
               type="number"
               helperText=""
            />
         ),
         value: "",
         validations: Yup.number().nullable(),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "tipo_comision",
         input: (
            <Input
               key={`key-input-tipo_comision`}
               col={6}
               idName="tipo_comision"
               label="Tipo de Comisión"
               placeholder="Ingrese el tipo de comisión"
               type="text"
               helperText=""
            />
         ),
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "evaluacion",
         input: <Input key={`key-input-evaluacion`} col={12} idName="evaluacion" label="Evaluación" placeholder="Ingrese la evaluación" type="text" helperText="" />,
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "fza_vta_pago",
         input: (
            <Input
               key={`key-input-fza_vta_pago`}
               col={12}
               idName="fza_vta_pago"
               label="Fuerza Venta Pago"
               placeholder="Ingrese la fuerza de venta del pago"
               type="text"
               helperText=""
            />
         ),
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "fecha_evaluacion",
         input: <Input key={`key-input-fecha_evaluacion`} col={6} idName="fecha_evaluacion" label="Fecha Evaluación" type="date" helperText="" />,
         value: "",
         validations: Yup.date().nullable(),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "folio_factura",
         input: (
            <Input
               key={`key-input-folio_factura`}
               col={6}
               idName="folio_factura"
               label="Folio Factura"
               placeholder="Ingrese el folio de factura"
               type="text"
               helperText=""
            />
         ),
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "fecha_publicacion",
         input: <Input key={`key-input-fecha_publicacion`} col={6} idName="fecha_publicacion" label="Fecha Publicación" type="date" helperText="" />,
         value: "",
         validations: Yup.date().nullable(),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "location_status",
         input: (
            <Select2
               key={`key-input-location_status`}
               col={6}
               idName="location_status"
               label="Ubicación"
               options={[
                  { label: "Stock", value: "stock" },
                  { label: "Con Vendedor", value: "con_vendedor" },
                  { label: "Distribuido", value: "distribuido" }
               ]}
            />
         ),
         value: "stock",
         validations: Yup.string().oneOf(["stock", "con_vendedor", "distribuido"]),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "activation_status",
         input: (
            <Select2
               key={`key-input-activation_status`}
               col={6}
               idName="activation_status"
               label="Estatus de Activación"
               options={[
                  { label: "Virgen", value: "virgen" },
                  { label: "Pre Activado", value: "pre_activado" },
                  { label: "Activado", value: "activado" },
                  { label: "Caducado", value: "caducado" }
               ]}
            />
         ),
         value: "virgen",
         validations: Yup.string().oneOf(["virgen", "pre_activado", "activado", "caducado"]),
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
      const res = await createOrUpdateChip(values);
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

   useEffect(() => {
      // console.log("🚀 Form ~ useEffect :");
      // console.log("🚀 Form ~ useEffect ~ isEdit:", isEdit);
   }, [chip, formikRef, isEdit]);

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
      </>
   );
};

export default ChipForm;
