import { useEffect, useState } from "react";
import FormikForm, { DividerComponent, FileInput, FileInputModerno, FirmPad, Input, Select2 } from "../../../../components/forms";
import * as Yup from "yup";
import { DialogComponent } from "../../../../components";
import { Drawer, FormControlLabel, FormGroup, Switch, Tooltip, Typography } from "@mui/material";
import Toast from "../../../../utils/Toast";
import Grid from "@mui/material/Grid";
import useFetch from "../../../../hooks/useFetch";
import DepartmentForm from "../departmentsView/Form";
import PositionForm from "../positionsView/Form";
import { useAuthContext } from "../../../../context/AuthContext";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useEmployeeContext } from "../../../../context/EmployeeContext";
import { usePositionContext } from "../../../../context/PositionContext";
import { useDepartmentContext } from "../../../../context/DepartmentContext";
import { LocationOnRounded } from "@mui/icons-material";

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
         maxHeight={container === "drawer" ? "74vh" : container === "modal" ? "65vh" : "auto"}
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
 * <EmployeeForm
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
const EmployeeForm = ({ container = "drawer", refreshSelect, openDialog, setOpenDialog }) => {
   const { auth } = useAuthContext();
   const { setIsLoading } = useGlobalContext();
   const {
      singularName,
      employee,
      formTitle,
      setFormTitle,
      textBtnSubmit,
      setTextBtnSubmit,
      formikRef,
      isEdit,
      setIsEdit,
      imgAvatar,
      setImgAvatar,
      imgFirm,
      setImgFirm,
      ineFront,
      setIneFront,
      ineBack,
      setIneBack,
      createOrUpdateEmployee
   } = useEmployeeContext();
   const { allPositions, setAllPositions, getSelectIndexPositions } = usePositionContext();
   const { allDepartments, setAllDepartments, getSelectIndexDepartments } = useDepartmentContext();

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [positionFormDialog, setPositionFormDialog] = useState(false);
   const [departmentFormDialog, setDepartmentFormDialog] = useState(false);

   const { refetch: refreshPositions } = useFetch(getSelectIndexPositions, setAllPositions);
   const { refetch: refreshDepartments } = useFetch(getSelectIndexDepartments, setAllDepartments);

   const [showInputPinColor, setShowInputPinColor] = useState(false);
   const [pinColor, setPinColor] = useState(null);

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
         name: "avatar",
         input: (
            <FileInputModerno
               key={`key-input-avatar`}
               col={12}
               idName="avatar"
               label="Foto del Empleado"
               filePreviews={imgAvatar}
               setFilePreviews={setImgAvatar}
               multiple={false}
               accept={"image/*"}
               zoomLeft={true}
               fileSizeMax={3}
               showBtnCamera={true}
               // handleUploadingFile={handleUpload}
               // showDialogFileOrPhoto={true}
            />
         ),
         value: null,
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "payroll_number",
         input: (
            <Input
               key={`key-input-payroll_number`}
               col={4}
               idName="payroll_number"
               label="No. Nómina"
               placeholder="No. trabajador"
               type="number"
               textStyleCase={null}
               helperText=""
               required
            />
         ),
         value: "",
         validations: Yup.number().required("No. de empleado requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "name",
         input: (
            <Input
               key={`key-input-name`}
               col={8}
               idName="name"
               label="Nombre(s)"
               placeholder="Escriba su nombre(s)"
               type="text"
               textStyleCase={true}
               helperText=""
               required
            />
         ),
         value: "",
         validations: Yup.string().trim().required("Nombre(s) requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "plast_name",
         input: (
            <Input
               key={`key-input-plast_name`}
               col={6}
               idName="plast_name"
               label="Apellido Paterno"
               placeholder="Escriba su primer apellido"
               type="text"
               textStyleCase={true}
               helperText=""
               required
            />
         ),
         value: "",
         validations: Yup.string().trim().required("Apellido paterno requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "mlast_name",
         input: (
            <Input
               key={`key-input-mlast_name`}
               col={6}
               idName="mlast_name"
               label="Apellido Materno"
               placeholder="Escriba su segundo apellido"
               type="text"
               textStyleCase={true}
               helperText=""
            />
         ),
         value: "",
         validations: Yup.string().trim().notRequired("Apellido materno requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "cellphone",
         input: (
            <Input
               key={`key-input-cellphone`}
               col={12}
               idName={"cellphone"}
               label={"Número Celular"}
               placeholder={"10 dígitos"}
               type={"tel"}
               maxLength={10}
               helperText={""}
               required
            />
         ),
         value: "",
         validations: Yup.string()
            // .transform((value) => value.replace(/[^\d]/g, "")) // Elimina caracteres no numéricos
            .matches(/^[0-9]{10}$/, "El número debe contener 10 dígitos.")
            .required("Número celular requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      //DATOS DE OFICINA
      {
         name: "office_phone",
         input: (
            <Input
               key={`key-input-office_phone`}
               col={6}
               idName={"office_phone"}
               label={"Teléfono de oficina"}
               placeholder={"Escribir a 10 dígitos"}
               type={"tel"}
               maxLength={10}
               helperText={""}
            />
         ),
         value: "",
         validations: Yup.number("Solo números").notRequired(),
         validationPage: [],
         dividerBefore: { show: true, title: "DATOS DE OFICINA", orientation: "horizontal", sx: {} }
      },
      {
         name: "ext",
         input: <Input key={`key-input-ext`} col={6} idName={"ext"} label={"Extensión"} placeholder={""} type={"tel"} maxLength={10} helperText={""} />,
         value: "",
         validations: Yup.number("Solo números").notRequired(),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "ine_front",
         input: (
            <FileInputModerno
               key={`key-input-ine_front`}
               col={6}
               idName="ine_front"
               label="INE POR ENFRENTE"
               filePreviews={ineFront}
               setFilePreviews={setIneFront}
               multiple={false}
               accept={"image/*"}
               // handleUploadingFile={handleUpload}
               fileSizeMax={3}
               showBtnCamera={true}
               // showDialogFileOrFirm={true}
               required
            />
         ),
         value: null,
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "ine_back",
         input: (
            <FileInputModerno
               key={`key-input-ine_back`}
               col={6}
               idName="ine_back"
               label="INE POR DETRAS"
               filePreviews={ineBack}
               setFilePreviews={setIneBack}
               multiple={false}
               accept={"image/*"}
               // handleUploadingFile={handleUpload}
               fileSizeMax={3}
               showBtnCamera={true}
               // showDialogFileOrFirm={true}
            />
         ),
         value: null,
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      ...(showInputPinColor
         ? [
              {
                 name: "pin_color",
                 input: (
                    <Grid container width={"100%"} direction="row" alignItems="center" justifyContent="center">
                       <Grid size={{ xs: 10 }} mb={1}>
                          <Input
                             key={`key-input-pin_color`}
                             col={12}
                             idName={"pin_color"}
                             label={"Color del PIN de ubicación"}
                             placeholder={"Seleccionar color"}
                             type={"color"}
                             onChangeExtra={(e) => {
                                setPinColor(e.target.value);
                             }}
                             helperText={(currentValue) => `Color seleccionado: ${currentValue}`}
                          />
                       </Grid>
                       <Grid size={{ xs: 2 }}>
                          <LocationOnRounded style={{ color: pinColor || "#000000", fontSize: 50, marginTop: -10 }} />
                       </Grid>
                    </Grid>
                 ),
                 value: "",
                 validations: showInputPinColor ? Yup.string().trim().required("Color de pin requerido") : null,
                 validationPage: [],
                 dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
              }
           ]
         : []),
      // {
      //    name: "img_firm",
      //    input: (
      //       <Grid container size={"grow"} display={"flex"} alignItems={"center"} className={"border-1 border-gray-400 rounded-2xl p-2"} justifyContent={"center"}>
      //          <FileInput
      //             key={`key-input-img_firm`}
      //             col={10}
      //             idName="img_firm"
      //             label="Firma del Empleado"
      //             filePreviews={imgFirm}
      //             setFilePreviews={setImgFirm}
      //             multiple={false}
      //             accept={"image/*"}
      //             // handleUploadingFile={handleUpload}
      //             fileSizeMax={3}
      //             showBtnCamera={true}
      //             // showDialogFileOrFirm={true}
      //          />
      //          <FirmPad col={2} idName="img_firm"  />
      //       </Grid>
      //    ),
      //    value: null,
      //    validations: null,
      //    validationPage: [],
      //    dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      // },
      {
         name: "department_id",
         input: (
            <Select2
               key={`key-input-department_id`}
               col={12}
               idName="department_id"
               label="Departamento"
               options={allDepartments.filter((item) => item.role_id !== 3) || []}
               refreshSelect={refreshDepartments}
               addRegister={auth.permissions.create ? () => setDepartmentFormDialog(true) : null}
               required
            />
         ),
         value: 0,
         validations: Yup.number().min(1, "Esta opción no es valida").required("Departamento requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "position_id",
         input: (
            <Select2
               key={`key-input-position_id`}
               col={12}
               idName="position_id"
               label="Puesto"
               options={allPositions || []}
               refreshSelect={refreshPositions}
               addRegister={auth.permissions.create ? () => setPositionFormDialog(true) : null}
               onChangeExtra={(values) => {
                  console.log("🚀 ~ EmployeeForm ~ values:", values);
                  if (values.value.id == 2) {
                     console.log("entro al snhow");
                     setShowInputPinColor(true);
                  } else {
                     console.log("NOentro al snhow");
                     setShowInputPinColor(false);
                  }
               }}
               required
            />
         ),
         value: 0,
         validations: Yup.number().min(1, "Esta opción no es valida").required("Puesto requerido"),
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

      values.avatar = imgAvatar.length == 0 ? "" : imgAvatar[0].file;
      values.img_firm = imgFirm.length == 0 ? "" : imgFirm[0].file;
      values.ine_front = ineFront.length == 0 ? "" : ineFront[0].file;
      values.ine_back = ineBack.length == 0 ? "" : ineBack[0].file;
      const res = await createOrUpdateEmployee(values);
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
      handleCancel();
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
      setImgAvatar([]);
      setImgFirm([]);
      setIneFront([]);
      setIneBack([]);
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
      console.log("🚀 Form ~ useEffect ~ isEdit:", isEdit);
      setShowInputPinColor(false);
      if (formikRef?.current?.values?.position_id == 2) setShowInputPinColor(true);
      console.log("formikRef.current.values.position_id", formikRef.current.values.position_id, " | showInputPinColor:", showInputPinColor);
      // if (isEdit) {
      //    console.log("edits");
      // } else {
      //    console.log("no dedits");
      // }
   }, [employee, formikRef, isEdit]);

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
         <PositionForm container="modal" openDialog={positionFormDialog} setOpenDialog={setPositionFormDialog} refreshSelect={refreshPositions} />
         <DepartmentForm container="modal" openDialog={departmentFormDialog} setOpenDialog={setDepartmentFormDialog} refreshSelect={refreshDepartments} />
      </>
   );
};

export default EmployeeForm;
