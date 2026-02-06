import { Button, FormControlLabel, FormGroup, Grid, Switch, Tooltip, Typography } from "@mui/material";
import FormikForm, { DateTimePicker, Input, Select2, Textarea, TransferList } from "../../../../components/forms";
import * as Yup from "yup";
import { DialogComponent } from "../../../../components";
import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useProductContext } from "../../../../context/ProductContext";
import { AddLinkRounded, AssignmentInd, Inventory, Inventory2Rounded } from "@mui/icons-material";
import { useAuthContext } from "../../../../context/AuthContext";
import { useLoteContext } from "./../../../../context/LoteContext";
import useFetch from "../../../../hooks/useFetch";
import LoteForm from "../../catalogs/lotesView/Form";
import Toast from "../../../../utils/Toast";
import sAlert from "../../../../utils/sAlert";
import dayjs from "dayjs";

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

const AssignmentForm = ({ openDialog, setOpenDialog, afterSubmit = null }) => {
   const { auth } = useAuthContext();
   const { setIsLoading } = useGlobalContext();
   // const {setAllProducts,getSelectIndexRoles}=useProductContext()
   const { singularName, product, formTitle, setFormTitle, textBtnSubmit, setTextBtnSubmit, isEdit, setIsEdit, updateLoteAssignment, getSelectIndexProducts } =
      useProductContext();
   const {
      lotesSelect,
      setLotesSelect,
      getSelectIndexLotes
      /* allLoteDetailsByLote, setAllLoteDetailsByLote, getLoteDetailsByLote */
   } = useLoteContext();
   const [productsInStockSelect, setProductsInStockSelect] = useState([]);
   const formikRef = useRef(null);

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [loteFormDialog, setLoteFormDialog] = useState(false);
   const [folioLote, setFolioLote] = useState(0);

   const { refetch: refreshLotes } = useFetch(getSelectIndexLotes, setLotesSelect);
   const { refetch: refetchProductsInStock } = useFetch(() => getSelectIndexProducts({ folio: folioLote }), setProductsInStockSelect, false);
   // const { refetch: refetchProductsInStock } = useFetch(
   //    () => getSelectIndexProducts({ location_status: ["Stock", "Asignado"], activation_status: "Pre-activado" }),
   //    setProductsInStockSelect
   // );

   const init = () => {
      // console.log("🚀 ~ init ~ allLoteDetailsByLote:", allLoteDetailsByLote);
      setProductsInStockSelect([]);
      // formikRef?.current?.setFieldValue(
      //    "productos_en_stock",
      //    productsInStockSelect.map((d) => d.id)
      // );
      // // formikRef?.current?.setFieldValue(
      // //    "product_ids",
      // //    productsAssignment.map((d) => d.id)
      // // );
   };
   useEffect(() => {
      // console.log("🚀 ~ AssignmentForm ~ useEffect:openDialog:", openDialog);

      formikRef?.current?.resetForm();
      formikRef?.current?.setValues(formikRef.current.initialValues);
      init();
   }, [openDialog == true]);

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
               col={6}
               idName="lote_id"
               label="Lote"
               options={lotesSelect}
               onChangeExtra={handleChangeLote}
               refreshSelect={refreshLotes}
               addRegister={auth.permissions.create ? () => setLoteFormDialog(true) : null}
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
         name: "folio",
         input: <Input key={`key-input-folio`} col={3} idName="folio" label="Folio" placeholder="" disabled />,
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "lada",
         input: <Input key={`key-input-lada`} col={1} idName="lada" label="lada" placeholder="" disabled />,
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "quantity",
         input: <Input key={`key-input-quantity`} col={2} idName="quantity" label="Cantidad" type="number" placeholder="" disabled />,
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "descrption",
         input: <Textarea key={`key-input-descrption`} col={9} idName="descrption" label="Descripción del lote" placeholder="" rows={1} disabled />,
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "preactivation_date",
         input: (
            <DateTimePicker
               key={"key-input-preactivation_date"}
               col={3}
               idName="preactivation_date"
               label="Fecha de Pre-activación"
               picker={"date"}
               format={"DD/MM/YYYY"}
               // helperText={"DD/MM/AAAA"}
               color="primary"
               disabled
               // startAdornmentContent={<CalendarMonthIcon />}
            />
         ),
         value: "",
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "executed_at",
         input: (
            <DateTimePicker col={12} idName={"executed_at"} label={"Fecha de Ejecución"} picker={"date"} format={"DD/MM/YYYY"} helperText={"DD/MM/AAAA"} required />
         ),
         value: null, //dayjs(),
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "product_ids",
         input: (
            <TransferList
               key={`key-input-product_ids`}
               col={12}
               idNameLeft="productos_en_stock"
               idNameRight="product_ids"
               label="Motivo Estatus"
               heightList={"33vh"}
               placeholder="Describa el motivo del estatus"
               labelLeft={"Productos en Stock"}
               labelRight={"Productos Asignados"}
               handleClickLeft={handleClickLeftTansfer}
               handleClickRight={handleClickRightTansfer}
               data={productsInStockSelect}
               onRefetch={refetchProductsInStock}
               // isLoading={}
            />
         ),
         value: "",
         validations: null, // Yup.array().min(1, "Debe seleccionar al menos un product.").required("Debe seleccionar al menos un product."),
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

      if (values.product_ids.length > values.quantity) {
         sAlert.Info(`La cantidad de productos asignados (${values.product_ids.length}) supera la cantidad destinada al Lote (${values.quantity})`);
         return setIsLoading(false);
      }

      const res = await updateLoteAssignment(values);
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
      if (refetchProductsInStock) await refetchProductsInStock();
      if (afterSubmit) await afterSubmit();
      if (!checkAdd) setOpenDialog(false);
   };
   const handleCancel = () => {
      formikRef.current.resetForm();
      formikRef.current.setValues(formikRef.current.initialValues);
      setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      setTextBtnSubmit("AGREGAR");
      setIsEdit(false);
      if (refetchProductsInStock) refetchProductsInStock();
      if (!checkAdd) setOpenDialog(false);
   };

   async function handleChangeLote(values) {
      // console.log("🚀 ~ handleChangeLote ~ values:", values);
      try {
         setFolioLote(0);
         // console.log("🚀 ~ handleChangeLote ~ productsInStockSelect:", productsInStockSelect);
         if (values.value == null || values.value?.id < 1) {
            formikRef?.current?.setValues(formikRef.current.initialValues);
            formikRef?.current?.setFieldValue("productos_en_stock", []);
            formikRef?.current?.setFieldValue("product_ids", []);
            setProductsInStockSelect([]);
            return Toast.Warning("Selecciona un lote");
         }
         const loteSelected = lotesSelect.find((item) => item.id === values.value.id);
         setFolioLote(loteSelected.folio);
         formikRef?.current?.setFieldValue("folio", loteSelected.folio);
         formikRef?.current?.setFieldValue("lada", loteSelected.lada);
         formikRef?.current?.setFieldValue("quantity", loteSelected.quantity);
         formikRef?.current?.setFieldValue("descrption", loteSelected.description);
         formikRef?.current?.setFieldValue("preactivation_date", loteSelected.preactivation_date);

         setIsLoading(true);
         // refetchProductsInStock();

         if (formikRef.current === null) setOpenDialog(true);
         // const res = await getLoteDetailsByLote(values.value.id);
         const res = await getSelectIndexProducts({ folio: loteSelected.folio, seller_id: loteSelected.seller_id });
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

         if (res.result.description) res.result.description == null && (res.result.description = "");
         // const productsInStockSelect = formikRef?.current?.values?.productos_en_stock.filter((id) => !productsAssignment.includes(id)).map((d) => d.id);

         // console.log("🚀 ~ handleChangeLote ~ res.result:", res.result);
         const productsInStockByFolio = res.result
            .filter((product) => Number(product.folio) === (Number(loteSelected.folio) || 0) && product.destination === "Stock")
            .map((d) => d.id);
         // console.log("🚀 ~ handleChangeLote ~ productsInStockByFolio:", productsInStockByFolio);

         setProductsInStockSelect((prev) => {
            const merged = [...prev, ...res.result];
            // console.log("🚀 ~ handleChangeLote ~ merged:", merged);

            const unique = merged.filter((item, index, self) => index === self.findIndex((p) => p.id === item.id));

            return unique;
         });

         // const productsAssignment = res.result.map((d) => d.id);
         const productsAssignment = res.result.map((d) => (d.destination === "Asignado" && d.lote_id === loteSelected.id ? d.id : null)).filter((id) => id != null);
         console.log("🚀 ~ handleChangeLote ~ productsAssignment:", productsAssignment);

         formikRef?.current?.setFieldValue("productos_en_stock", productsInStockByFolio);
         formikRef?.current?.setFieldValue("product_ids", productsAssignment);
         // formikRef?.current.setValues(res.result);
         if (res.alert_text) Toast.Success(res.alert_text);
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         setTextBtnSubmit("GUARDAR");
         setIsEdit(true);
         setIsLoading(false);
         setOpenDialog(true);
      } catch (error) {
         setOpenDialog(false);
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   }

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

   function handleClickLeftTansfer() {
      const quantity = formikRef.current.values.quantity;
   }
   function handleClickRightTansfer() {
      const quantity = formikRef.current.values.quantity;
      if (formikRef.current.values.product_ids.length > quantity) {
         Toast.Warning("La cantidad de productos asignados no puede ser mayor a la cantidad del lote.");
      }
   }

   useEffect(() => {
      // console.log("🚀 Form ~ useEffect :");
      // console.log("🚀 Form ~ useEffect ~ isEdit:", isEdit);
   }, [product, formikRef, isEdit]);

   return (
      <>
         <Button variant="contained" startIcon={<Inventory2Rounded />} onClick={() => setOpenDialog(true)} disabled={!auth.permissions.create} color="secondary">
            ASIGNAR PRODUCTOS
         </Button>

         {openDialog && (
            <>
               <DialogComponent
                  open={openDialog}
                  setOpen={setOpenDialog}
                  modalTitle={
                     <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography className="font-extrabold text-center" variant="h4" fontWeight={"bold"}>
                           {"Asignar productos a un lote"}
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
               <LoteForm container="modal" openDialog={loteFormDialog} setOpenDialog={setLoteFormDialog} refreshSelect={refreshLotes} />
            </>
         )}
      </>
   );
};

export default AssignmentForm;
