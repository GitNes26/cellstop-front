import { Button, FormControlLabel, FormGroup, Grid, Switch, Tooltip, Typography } from "@mui/material";
import FormikForm, { DateTimePicker, Input, Select2, Textarea, TransferList } from "../../../../components/forms";
import * as Yup from "yup";
import { DialogComponent } from "../../../../components";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useChipContext } from "../../../../context/ChipContext";
import { AddLinkRounded, AssignmentInd, Inventory, Inventory2Rounded } from "@mui/icons-material";
import { useAuthContext } from "../../../../context/AuthContext";
import { useLoteContext } from "./../../../../context/LoteContext";
import useFetch from "../../../../hooks/useFetch";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;

const Form = ({ formData, validations, formikRef, validationSchema, onSubmit, textBtnSubmit, handleCancel, container = "modal" }) => {
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

const AssignmentForm = ({ openDialog, setOpenDialog }) => {
   const { auth } = useAuthContext();
   const { setIsLoading } = useGlobalContext();
   // const {setAllProducts,getSelectIndexRoles}=useProductContext()
   const {
      singularName,
      chip,
      formTitle,
      setFormTitle,
      textBtnSubmit,
      setTextBtnSubmit,
      formikRef,
      isEdit,
      setIsEdit,
      updatePackageAssignment,
      chipsSelect,
      setChipsSelect,
      getSelectIndexChips
   } = useChipContext();
   const { lotesSelect, setLotesSelect, getSelectIndexLotes } = useLoteContext();

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);

   const { refetch: refreshLotes } = useFetch(getSelectIndexLotes, setLotesSelect);
   const { refetch: refreshChips } = useFetch(getSelectIndexChips, setChipsSelect);

   const init = () => {
      const chipsEnStock = chipsSelect.filter((chip) => chip.location_status === "Stock");
      const chipsAsignados = chipsSelect.filter((chip) => chip.location_status === "Asignado");
      formikRef?.current?.setFieldValue(
         "chips_en_stock",
         chipsEnStock.map((d) => d.id)
      );
      formikRef?.current?.setFieldValue(
         "chip_ids",
         chipsAsignados.map((d) => d.id)
      );
   };
   init();

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
         name: "lote_id",
         input: (
            <Select2
               key={`key-input-lote_id`}
               col={7}
               idName="lote_id"
               label="Lote"
               options={lotesSelect}
               refreshSelect={refreshLotes}
               startAdornmentContent={<AssignmentInd />}
               required
            />
         ),
         value: "",
         validations: Yup.number().min(1, "Esta opción no es valida").required("Lote requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "seller",
         input: (
            <Input
               key={`key-input-seller`}
               col={3}
               idName="seller"
               label="Vendedor Asignado"
               placeholder=""
               type="text"
               helperText=""
               required
               startAdornmentContent={<Inventory />}
            />
         ),
         value: null,
         validations: Yup.string().required("Vendedor requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "assigned_at",
         input: (
            <DateTimePicker
               key={"key-input-assigned_at"}
               col={2}
               idName="assigned_at"
               label="Fecha de asignación"
               picker={"date"}
               format={"DD/MM/YYYY"}
               // helperText={"DD/MM/AAAA"}
               color="primary"
               disabled
               // startAdornmentContent={<CalendarMonthIcon />}
            />
         ),
         value: "",
         validations: Yup.date().nullable(),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "chip_ids",
         input: (
            <TransferList
               key={`key-input-chip_ids`}
               col={12}
               idNameLeft="chips_en_stock"
               idNameRight="chip_ids"
               label="Motivo Estatus"
               placeholder="Describa el motivo del estatus"
               labelLeft={"Chips en Stock"}
               labelRight={"Chips Asignados"}
               data={chipsSelect}
            />
         ),
         value: "",
         validations: null, // Yup.array().min(1, "Debe seleccionar al menos un chip.").required("Debe seleccionar al menos un chip."),
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
      const res = await updatePackageAssignment(values);
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
         <Button variant="contained" startIcon={<Inventory2Rounded />} onClick={() => setOpenDialog(true)} disabled={!auth.permissions.create} color="secondary">
            Asignar chips a lotes
         </Button>

         <DialogComponent
            open={openDialog}
            setOpen={setOpenDialog}
            modalTitle={
               <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                  <Typography className="font-extrabold text-center" variant="h4" fontWeight={"bold"}>
                     {"Asignar chips a un lote"}
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
               container={"modal"}
            />
         </DialogComponent>
      </>
   );
};

export default AssignmentForm;
