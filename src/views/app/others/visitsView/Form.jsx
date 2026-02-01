// views/VisitsView/Form.tsx
import { useEffect, useState } from "react";
import FormikForm, {
   DateTimePicker,
   DividerComponent,
   FileInput,
   FileInputModerno,
   Input,
   LocationButton,
   Radio,
   Select2,
   Textarea,
   TransferList
} from "../../../../components/forms";
import * as Yup from "yup";
import { Drawer, FormControlLabel, FormGroup, Switch, Tooltip, Typography, Grid, Chip, Box, Alert } from "@mui/material";
import Toast from "../../../../utils/Toast";
import { useAuthContext } from "../../../../context/AuthContext";
import { ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_SELLER, useGlobalContext } from "../../../../context/GlobalContext";
import { useVisitContext } from "../../../../context/VisitContext";
import { usePointOfSaleContext } from "../../../../context/PointOfSaleContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import useFetch from "../../../../hooks/useFetch";
import { DialogComponent } from "../../../../components";
import { useUserContext } from "../../../../context/UserContext";
import UserForm from "../../settings/usersView/Form";
import PointOfSaleForm from "../../catalogs/pointsOfSaleView/Form";
import EvidenceCapture from "../../../../components/forms/EvidenceCapture";
import { useProductContext } from "../../../../context/ProductContext";
import { useLoteContext } from "../../../../context/LoteContext";
import dayjs from "dayjs";
import { RefreshRounded } from "@mui/icons-material";

const checkAddInitialState = localStorage.getItem("checkAddVisits") == "true" ? true : false || false;

const Form = ({ formData, validations, formikRef, validationSchema, onSubmit, textBtnSubmit, handleCancel, container }) => {
   const initialValues = {};
   const inputsForms = [];

   formData.forEach((field) => {
      if (field.dividerBefore.show)
         inputsForms.push(<DividerComponent title={field.dividerBefore.title} orientation={field.dividerBefore.orientation} sx={field.dividerBefore.sx} />);
      inputsForms.push(field.input);
      initialValues[field.name] = field.value;
      if (formData[0].validationPage.length == 0) validations[field.name] = field.validations;
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
const VisitForm = ({ container = "drawer", refreshSelect, openDialog, setOpenDialog }) => {
   const { auth, theUserIs } = useAuthContext();
   const { setIsLoading } = useGlobalContext();
   const {
      singularName,
      visit,
      formTitle,
      setFormTitle,
      textBtnSubmit,
      setTextBtnSubmit,
      formikRef,
      imgEvidencePhoto,
      setImgEvidencePhoto,
      isEdit,
      setIsEdit,
      createOrUpdateVisit,
      getAvailableProductsForSeller,
      verifyLocation,
      currentLocation,
      setCurrentLocation,
      locationError,
      setLocationError,
      availableProducts
   } = useVisitContext();
   const { allProducts, setAllProducts, updateLoteAssignment, selectIndexProductForVisit, getSelectIndexProducts, getAllProducts } = useProductContext();

   const { usersSelect, setUsersSelect, getSelectIndexUsersByRole } = useUserContext();
   const { pointsOfSaleSelect, setPointsOfSaleSelect, getSelectIndexPointsOfSale } = usePointOfSaleContext();
   // const { allLotes, setAllLotes, getAllLotes } = useLoteContext();

   const [allPOSSelect, setAllPOSSelect] = useState([]);
   const [productsInStockSelect, setProductsInStockSelect] = useState([]);

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [sellerFormDialog, setSellerFormDialog] = useState(false);
   const [pointOfSaleFormDialog, setPointOfSaleFormDialog] = useState(false);

   const [locationVerified, setLocationVerified] = useState(false);
   const [selectedProducts, setSelectedProducts] = useState([]);
   const [isGettingLocation, setIsGettingLocation] = useState(false);

   // const { refetch: refetchFoliosByLote } = useFetch(() => getAllLotes(theUserIs([ROLE_SELLER]) ? { seller_id: auth.id } : {}), setAllLotes);

   const { refetch: refetchSeller } = useFetch(() => getSelectIndexUsersByRole(3), setUsersSelect);
   const { refetch: refetchPointsOfSale } = useFetch(() => getSelectIndexPointsOfSale(), setAllPOSSelect);

   const { refetch: refetchProductsInStock } = useFetch(
      () => getSelectIndexProducts({ seller_id: formikRef?.current?.values?.seller_id, pos_id: formikRef?.current?.values?.pos_id }),
      setProductsInStockSelect,
      false
   );

   const { refetch: refetchProductsDistributed } = useFetch(() => getAllProducts({ id: visit?.product_ids ?? [0] }), setAllProducts);

   // Obtener ubicación actual
   const getCurrentLocation = () => {
      return new Promise((resolve, reject) => {
         if (!navigator.geolocation) {
            reject("Geolocalización no soportada por el navegador");
            return;
         }

         setIsGettingLocation(true);
         navigator.geolocation.getCurrentPosition(
            (position) => {
               const location = {
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                  ubi: `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`
               };
               // console.log("🚀 ~ getCurrentLocation ~ location:", location);
               setCurrentLocation(location);
               setIsGettingLocation(false);

               setLocationVerified(true);
               // Toast.Success(result.message);
               // Actualizar campos en el formulario
               formikRef.current.setFieldValue("lat", location.lat);
               formikRef.current.setFieldValue("lon", location.lon);
               formikRef.current.setFieldValue("ubication", location.ubi);
               // formikRef.current.setFieldValue("ubication", `Lat: ${currentLocation.lat}, Lon: ${currentLocation.lng}`);

               resolve(location);
            },
            (error) => {
               setIsGettingLocation(false);
               let errorMessage = "Error al obtener ubicación: ";
               switch (error.code) {
                  case error.PERMISSION_DENIED:
                     errorMessage += "Permiso denegado";
                     break;
                  case error.POSITION_UNAVAILABLE:
                     errorMessage += "Posición no disponible";
                     break;
                  case error.TIMEOUT:
                     errorMessage += "Tiempo de espera agotado";
                     break;
                  default:
                     errorMessage += "Error desconocido";
               }
               setLocationError(errorMessage);
               reject(errorMessage);
               setLocationVerified(false);
               Toast.Error(errorMessage);
            },
            {
               enableHighAccuracy: true,
               timeout: 10000,
               maximumAge: 0
            }
         );
      });
   };

   // Verificar ubicación contra punto de venta
   const handleChangeUbication = async (values) => {
      try {
         // Verificar ubicación y asignando valores de ubicacion
         // console.log("🚀 ~ handleChangeUbication ~ values:", values);
         const currentLocation = values.coords;
         const pos = pointsOfSaleSelect.find((item) => item.id === formikRef.current?.values.pos_id);
         // console.log("🚀 ~ handleChangeUbication ~ pos:", pos);
         if (!currentLocation || !pos) return false;

         setIsLoading(true);
         const result = await verifyLocation(pos, currentLocation.lat, currentLocation.lng);
         // console.log("🚀 ~ handleChangeUbication ~ result:", result);
         setIsLoading(false);

         if (result.valid) {
            setLocationVerified(true);
            Toast.Success(result.message);

            // Actualizar campos en el formulario
            formikRef.current.setFieldValue("lat", currentLocation.lat);
            formikRef.current.setFieldValue("lon", currentLocation.lng);
            formikRef.current.setFieldValue("ubication", currentLocation.ubi);
            // formikRef.current.setFieldValue("ubication", `Lat: ${currentLocation.lat}, Lon: ${currentLocation.lng}`);

            return true;
         } else {
            setLocationVerified(false);
            Toast.Error(result.message);
            return false;
         }
      } catch (error) {
         setOpenDialog(false);
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };
   // const verifyLocationForPOS = async (posId) => {
   //    if (!currentLocation || !posId) return false;

   //    setIsLoading(true);
   //    const result = await verifyLocation(posId, currentLocation.lat, currentLocation.lon);
   //    setIsLoading(false);

   //    if (result.valid) {
   //       setLocationVerified(true);
   //       Toast.Success(result.message);

   //       // Actualizar campos en el formulario
   //       formikRef.current.setFieldValue("lat", currentLocation.lat);
   //       formikRef.current.setFieldValue("lon", currentLocation.lon);
   //       formikRef.current.setFieldValue("ubication", `Lat: ${currentLocation.lat}, Lon: ${currentLocation.lon}`);

   //       return true;
   //    } else {
   //       setLocationVerified(false);
   //       Toast.Error(result.message);
   //       return false;
   //    }
   // };

   // Manejar cambio de tipo de visita
   const handleVisitTypeChange = (values) => {
      // console.log("🚀 ~ handleVisitTypeChange ~ value:", values);
      const isDistribucion = values.value === "Distribución";
      // console.log("🚀 ~ handleVisitTypeChange ~ isDistribucion:", isDistribucion);
      formikRef.current.setFieldValue("visit_type", values.value);

      if (!isDistribucion) {
         // Limpiar campos de distribución si cambia a Monitoreo
         formikRef.current.setFieldValue("contact_name", "");
         formikRef.current.setFieldValue("contact_phone", "");
         formikRef.current.setFieldValue("product_ids", []);
         formikRef.current.setFieldValue("chips_delivered", null);
         formikRef.current.setFieldValue("chips_sold", null);
         formikRef.current.setFieldValue("chips_remaining", null);
         setSelectedProducts([]);
      }
   };

   const handleChangeSeller = async (values) => {
      // console.log("🚀 ~ handleChangeSeller ~ values:", values);
      // console.log("🚀 ~ handleChangeSeller ~ formikRef?.current?.values:", formikRef?.current?.values);
      try {
         // if (values.value == null || values.value?.id < 1) {
         formikRef?.current?.setFieldValue("productos_en_stock", []);
         formikRef?.current?.setFieldValue("product_ids", []);
         // return Toast.Warning("Selecciona un vendedor");
         // }

         const sellerId = values?.value?.id;
         formikRef?.current?.setFieldValue("seller_id", sellerId);

         setIsLoading(true);
         setPointsOfSaleSelect(() => {
            const filtered = allPOSSelect.filter((pos) => pos.seller_id === sellerId);
            return filtered;
         });
         // refetchProductsInStock();

         //#region CARGAR PRODUCTOS DISPONIBLES PARA EL VENDEDOR
         // if (formikRef.current === null) setOpenDialog(true);
         // // const res = await getLoteDetailsByLote(values.value.id);
         // const res = await getSelectIndexProducts({ seller_id: sellerId });
         // if (!res) return setIsLoading(false);
         // if (res.errors) {
         //    setIsLoading(false);
         //    Object.values(res.errors).forEach((errors) => {
         //       errors.map((error) => Toast.Warning(error));
         //    });
         //    return;
         // } else if (res.status_code !== 200) {
         //    setIsLoading(false);
         //    return Toast.Customizable(res.alert_text, res.alert_icon);
         // }

         // if (res.result.description) res.result.description == null && (res.result.description = "");

         // // console.log("🚀 ~ handleChangeLote ~ res.result:", res.result);
         // // refetchProductsInStock(values?.value?.id);
         // const productsInStockByFolio = res.result.filter((product) => product.destination === "Asignado").map((d) => d.id);

         // setProductsInStockSelect((prev) => {
         //    const merged = [...prev, ...res.result];

         //    const unique = merged.filter((item, index, self) => index === self.findIndex((p) => p.id === item.id));

         //    return unique;
         // });

         // // const productsAssignment = res.result.map((d) => d.id);
         // const productsAssignment = res.result.map((d) => (d.destination === "Distribuido" ? d.id : null)).filter((id) => id != null);
         // // console.log("🚀 ~ handleChangeLote ~ productsAssignment:", productsAssignment);

         // formikRef?.current?.setFieldValue("productos_en_stock", productsInStockByFolio);
         // formikRef?.current?.setFieldValue("product_ids", productsAssignment);
         //#endregion CARGAR PRODUCTOS DISPONIBLES PARA EL VENDEDOR

         // if (res.alert_text) Toast.Success(res.alert_text);
         setIsLoading(false);
         setOpenDialog(true);
      } catch (error) {
         setOpenDialog(false);
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };
   const handleChangePOS = async (values) => {
      try {
         // console.log("🚀 ~ handleChangeSeller ~ values:", values);
         // console.log("🚀 ~ handleChangeSeller ~ formikRef?.current?.values:", formikRef?.current?.values);
         try {
            if (values.value == null || values.value?.id < 1) {
               formikRef?.current?.setFieldValue("productos_en_stock", []);
               formikRef?.current?.setFieldValue("product_ids", []);
               return Toast.Warning("Selecciona un vendedor");
            }

            const sellerId = formikRef?.current?.values?.seller_id;
            const posId = values?.value?.id;
            formikRef?.current?.setFieldValue("pos_id", posId);

            setIsLoading(true);
            // refetchProductsInStock();

            if (formikRef.current === null) setOpenDialog(true);
            // const res = await getLoteDetailsByLote(values.value.id);
            const res = await getSelectIndexProducts({ seller_id: sellerId, pos_id: posId });
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

            // console.log("🚀 ~ handleChangeLote ~ res.result:", res.result);
            // refetchProductsInStock(values?.value?.id);
            const productsInStockByFolio = res.result.filter((product) => product.destination === "Asignado").map((d) => d.id);

            setProductsInStockSelect((prev) => {
               const merged = [...prev, ...res.result];

               const unique = merged.filter((item, index, self) => index === self.findIndex((p) => p.id === item.id));

               return unique;
            });

            // const productsAssignment = res.result.map((d) => d.id);
            const productsAssignment = res.result.map((d) => (d.destination === "Distribuido" ? d.id : null)).filter((id) => id != null);
            // console.log("🚀 ~ handleChangeLote ~ productsAssignment:", productsAssignment);

            formikRef?.current?.setFieldValue("productos_en_stock", productsInStockByFolio);
            formikRef?.current?.setFieldValue("product_ids", productsAssignment);

            if (res.alert_text) Toast.Success(res.alert_text);
            setIsLoading(false);
            setOpenDialog(true);
         } catch (error) {
            setOpenDialog(false);
            setIsLoading(false);
            console.log(error);
            Toast.Error(error);
         }
      } catch (error) {}
   };

   // Manejar selección de productos
   const handleProductSelection = (productId) => {
      const currentSelected = [...selectedProducts];
      const index = currentSelected.indexOf(productId);

      if (index === -1) {
         currentSelected.push(productId);
      } else {
         currentSelected.splice(index, 1);
      }

      setSelectedProducts(currentSelected);
      formikRef.current.setFieldValue("product_ids", currentSelected);
   };

   function handleClickLeftTansfer() {
      console.log("🚀 ~ handleClickLeftTansfer ~ handleClickLeftTansfer:");
      // const quantity = formikRef.current.values.quantity;
   }
   function handleClickRightTansfer() {
      console.log("🚀 ~ handleClickRightTansfer ~ handleClickRightTansfer:");
      // const quantity = formikRef.current.values.quantity;
      // if (formikRef.current.values.product_ids.length > quantity) {
      //    Toast.Warning("La cantidad de productos asignados no puede ser mayor a la cantidad del lote.");
      // }
   }

   // Cargar productos disponibles cuando cambia el vendedor
   // useEffect(() => {
   //    const loadProducts = async () => {
   //       const sellerId = formikRef.current?.values?.seller_id;
   //       if (sellerId) {
   //          await getAvailableProductsForSeller(sellerId);
   //       }
   //    };

   //    loadProducts();
   // }, [formikRef.current?.values?.seller_id]);

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
               onChangeExtra={handleChangeSeller}
               refreshSelect={refetchSeller}
               addRegister={auth.permissions.create ? () => setSellerFormDialog(true) : null}
               // disabled={theUserIs([ROLE_SELLER])}
               required
            />
         ),
         value: "",
         validations: Yup.number().min(1, "Esta opción no es valida").required("Vendedor requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "pos_id",
         input: (
            <Select2
               key={`key-input-pos_id`}
               col={12}
               idName="pos_id"
               label="Punto de Venta"
               options={pointsOfSaleSelect || []}
               refreshSelect={refetchPointsOfSale}
               addRegister={auth.permissions.create ? () => setPointOfSaleFormDialog(true) : null}
               required
               onChangeExtra={handleChangePOS}
               // onChangeExtra={async (value) => {
               //    formikRef.current.setFieldValue("pos_id", value.value);
               //    setLocationVerified(false);
               //    if (currentLocation) {
               //       await verifyLocationForPOS(value.value);
               //    }
               // }}
            />
         ),
         value: "",
         validations: Yup.number().min(1, "Punto de venta requerido").required("Punto de venta requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "visit_type",
         input: (
            <Radio
               col={2}
               idName="visit_type"
               label="Tipo de Visita"
               options={[
                  { value: "Monitoreo", label: "Monitoreo" },
                  { value: "Distribución", label: "Distribución" }
               ]}
               horizontal
               onChangeExtra={handleVisitTypeChange}
               required
            />
         ),
         value: "",
         validations: Yup.string().required("Tipo de visita requerido"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "ubication",
         input: (
            <LocationButton
               col={6}
               idNameLat="lat"
               idNameLng="lon"
               idNameUbi="ubication"
               label="Ubicación del comprador"
               mb={2}
               onChangeExtra={handleChangeUbication}
               hidden
            />
         ),
         value: "",
         validations: null, //Yup.string().required("Ubicación requerida"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
         // name: "location_section",
         // input: (
         //    <Grid item xs={12} key="location-section">
         //       <Box className="mb-4 p-3 border rounded-lg bg-gray-50">
         //          <Typography variant="h6" className="mb-2 flex items-center">
         //             <LocationOnIcon className="mr-2" /> Verificación de Ubicación
         //          </Typography>

         //          {currentLocation ? (
         //             <Alert severity={locationVerified ? "success" : "warning"} className="mb-2" icon={locationVerified ? <CheckCircleIcon /> : <ErrorIcon />}>
         //                <Typography variant="body2">
         //                   Ubicación obtenida: {currentLocation.lat.toFixed(6)}, {currentLocation.lon.toFixed(6)}
         //                   {currentLocation.accuracy && ` (Precisión: ${currentLocation.accuracy.toFixed(1)}m)`}
         //                </Typography>
         //                {formikRef.current?.values?.pos_id && !locationVerified && (
         //                   <Typography variant="body2" className="mt-1">
         //                      Selecciona un punto de venta para verificar
         //                   </Typography>
         //                )}
         //             </Alert>
         //          ) : (
         //             <Alert severity="info" className="mb-2">
         //                <Typography variant="body2">Es necesario obtener tu ubicación para verificar que estás en el punto de venta</Typography>
         //             </Alert>
         //          )}

         //          <Box className="flex gap-2">
         //             <button
         //                type="button"
         //                onClick={getCurrentLocation}
         //                disabled={isGettingLocation}
         //                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
         //             >
         //                {isGettingLocation ? "Obteniendo..." : "Obtener Ubicación"}
         //             </button>

         //             {currentLocation && formikRef.current?.values?.pos_id && (
         //                <button
         //                   type="button"
         //                   onClick={() => verifyLocationForPOS(formikRef.current.values.pos_id)}
         //                   className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
         //                >
         //                   Verificar con Punto de Venta
         //                </button>
         //             )}
         //          </Box>

         //          {locationError && (
         //             <Alert severity="error" className="mt-2">
         //                {locationError}
         //             </Alert>
         //          )}
         //       </Box>
         //    </Grid>
         // ),
         // value: null,
         // validations: null,
         // validationPage: [],
         // dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "evidence_photo",
         input: (
            <Grid size={{ md: 6 }}>
               {
                  <FileInputModerno
                     key={`key-input-evidence_photo`}
                     col={12}
                     idName="evidence_photo"
                     label="Evidencia de la visita"
                     filePreviews={imgEvidencePhoto}
                     setFilePreviews={setImgEvidencePhoto}
                     helperText="Toma una foto del comprador con el chip o documento"
                     multiple={false}
                     accept={"image/*"}
                     zoomLeft={true}
                     fileSizeMax={3}
                     showBtnCamera={true}
                     // handleUploadingFile={handleUpload}
                     // showDialogFileOrPhoto={true}
                  />
               }
               {/* <EvidenceCapture
                  key={`key-input-evidence`}
                  idName="evidence_photo"
                  label="Foto de evidencia"
                  helperText="Toma una foto del comprador con el chip o documento"
                  // getFile={}
               /> */}
            </Grid>
         ),
         value: "",
         validations: null, //Yup.string().required("Foto de evidencia requerida"),
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "executed_at",
         input: (
            <DateTimePicker
               col={4}
               idName={"executed_at"}
               label={"Fecha de Ejecución"}
               picker={"date"}
               format={"DD/MM/YYYY"}
               helperText={"DD/MM/AAAA"}
               hidden={theUserIs([ROLE_SELLER])}
               required
            />
         ),
         value: null, //dayjs(),
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      // {
      //    name: "contact_name",
      //    input: <Input col={6} idName="contact_name" label="Nombre del Comprador" placeholder="Nombre completo del comprador" required />,
      //    value: null,
      //    validations: Yup.string().required("Nombre del contacto requerido"),
      //    validationPage: [],
      //    dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      // },
      // {
      //    name: "contact_phone",
      //    input: <Input col={6} idName="contact_phone" label="Teléfono del Comprador" placeholder="10 dígitos" type="tel" maxLength={10} required />,
      //    value: null,
      //    validations: Yup.string().required("Telefono del contacto requerido"),
      //    validationPage: [],
      //    dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      // },
      {
         name: "distribucion_section",
         input: (
            <Grid container size={{ md: 12 }} key="distribucion-section">
               <Box className={`border rounded-lg w-full ${formikRef.current?.values?.visit_type === "Distribución" ? "bg-blue-50 p-2" : "bg-gray-50"}`}>
                  {/* {formikRef.current?.values?.visit_type === "Distribución" ? (
                     <> */}
                  <Typography variant="h6" className="mb-4 pl-2 pt-2">
                     Información de Distribución (solo se llena cuando la visita es tipo Distribución) (dar clic al botón de recargar datos <RefreshRounded />)
                  </Typography>

                  {/* {productsInStockSelect.length > 0 && (
                     <Box className="mt-4">
                        <Typography variant="subtitle1" className="mb-2">
                           Productos Disponibles para Distribuir ({productsInStockSelect.length})
                        </Typography>
                        <Box className="flex flex-wrap gap-2 p-3 border rounded">
                           {availableProducts.map((product) => (
                              <Chip
                                 key={product.id}
                                 label={`${product.iccid || product.celular} - ${product.product_type || "Producto"}`}
                                 onClick={() => handleProductSelection(product.id)}
                                 color={selectedProducts.includes(product.id) ? "primary" : "default"}
                                 variant={selectedProducts.includes(product.id) ? "filled" : "outlined"}
                                 className="m-1"
                              />
                           ))}
                        </Box>
                        <Typography variant="caption" className="mt-2 block">
                           Seleccionados: {selectedProducts.length} productos
                        </Typography>
                     </Box>
                  )} */}

                  {/* <Grid container width={"100%"} spacing={2} className="my-3 p-2">
                     <Input col={4} idName="chips_delivered" label="Chips Entregados" type="number" placeholder="0" min={0} />
                     <Input col={4} idName="chips_sold" label="Chips Vendidos" type="number" placeholder="0" min={0} />
                     <Input col={4} idName="chips_remaining" label="Chips en Inventario" type="number" placeholder="0" min={0} />
                  </Grid> */}
                  {/* </>
                  ) : ( */}
                  <TransferList
                     key={`key-input-product_ids`}
                     col={12}
                     idNameLeft="productos_en_stock"
                     idNameRight="product_ids"
                     label="Motivo Estatus"
                     heightList={"45vh"}
                     placeholder="Describa el motivo del estatus"
                     labelLeft={"Productos en Asignados"}
                     labelRight={"Productos a Distribuir"}
                     handleClickLeft={handleClickLeftTansfer}
                     handleClickRight={handleClickRightTansfer}
                     data={productsInStockSelect}
                     onRefetch={allProducts.length > 1 ? async () => await init() : refetchProductsInStock}
                  />
                  {/* )} */}
               </Box>
            </Grid>
         ),
         value: null,
         validations: null,
         validationPage: [],
         dividerBefore: { show: false, title: "", orientation: "horizontal", sx: {} }
      },
      {
         name: "observations",
         input: (
            <Textarea
               key={`key-input-observations`}
               idName="observations"
               label="Observaciones"
               placeholder="Observaciones de la visita..."
               helperText=""
               rows={3}
               characterLimit={500}
            />
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
      console.log("🚀 ~ onSubmit ~ values:", values);
      // Validar ubicación primero
      const currentLocation = await getCurrentLocation();
      values.lat = currentLocation.lat;
      values.lon = currentLocation.lon;
      values.ubication = currentLocation.ubi;

      if (!locationVerified && values.pos_id) {
         Toast.Error("Debes verificar tu ubicación antes de registrar la visita, vuelve dar click en AGREGAR");
         setSubmitting(false);
         return;
      }

      // Validar que esté en el rango
      if (values.lat && values.lon && values.pos_id) {
         const posSelected = pointsOfSaleSelect.find((item) => item.id === values.pos_id);
         const result = await verifyLocation(posSelected, values.lat, values.lon);
         if (!result.valid) {
            Toast.Error(result.message);
            setSubmitting(false);
            return;
         } else {
            Toast.Success(result.message);
         }
      }

      setIsLoading(true);
      values.evidence_photo = imgEvidencePhoto.length == 0 ? "" : imgEvidencePhoto[0].file;

      // Preparar datos para enviar
      // const dataToSend = {
      //    ...values,
      //    seller_id: auth.user?.id, // Forzar el ID del vendedor actual
      //    product_ids: values.visit_type === "Distribución" ? values.product_ids : []
      // };

      const res = await createOrUpdateVisit(values);

      if (!res) {
         setIsLoading(false);
         return;
      }

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
      setImgEvidencePhoto([]);
      setSelectedProducts([]);
      setLocationVerified(false);
      setCurrentLocation(null);

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
      setImgEvidencePhoto([]);
      setSelectedProducts([]);
      setLocationVerified(false);
      setCurrentLocation(null);
      setLocationError("");
      if (refreshSelect) refreshSelect();
      if (!checkAdd) setOpenDialog(false);
   };

   const handleChangeCheckAdd = (checked) => {
      try {
         localStorage.setItem("checkAddVisits", checked);
         setCheckAdd(checked);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const init = async () => {
      // si el usuario es de rol_id === 3 (vendedor) seleccionar el id y poner disabled el Select2
      if (theUserIs([ROLE_SELLER])) formikRef?.current?.setFieldValue("seller_id", auth.id);
      else console.log("no lo soy");

      // console.log("🚀 ~ init ~ allLoteDetailsByLote:", allLoteDetailsByLote);
      // formikRef?.current?.setFieldValue(
      //    "productos_en_stock",
      //    productsInStockSelect.map((d) => d.id)
      // );
      // await refetchProductsDistributed();
      // if (allProducts) {
      //    // formikRef?.current?.setFieldValue(
      //    //    "product_ids",
      //    //    productsInStockSelected.map((d) => d.id)
      //    // );
      //    // console.log("🚀 ~ init ~ productsInStockSelect:", productsInStockSelect);
      //    const productsAsigment = productsInStockSelect.filter((p) => p.location_status == "Asignado").map((d) => d.id);
      //    // productsInStockSelect
      //    //    .filter((product) => Number(product.folio) === (Number(loteSelected.folio) || 0) && product.location_status == "Stock")
      //    //    .map((d) => d.id);
      //    // console.log("🚀 ~ handleChangeLote ~ res.result:", res.result);
      //    const productsSelected = allProducts.map((d) => ({
      //       // activation_status: d.activation_status,
      //       folio: d.folio,
      //       id: d.id,
      //       label: `${d.iccid} - ${d.celular} - ${d.fecha ?? ""}`,
      //       location_status: d.location_status
      //    }));
      //    // console.log("🚀 ~ handleChangeLote ~ productsSelected:", productsSelected);
      //    setProductsInStockSelect((prev) => {
      //       const merged = [...prev, ...productsSelected];

      //       const unique = merged.filter((item, index, self) => index === self.findIndex((p) => p.id === item.id));

      //       return unique;
      //    });

      //    const productsInStockSelected = allProducts.map((d) => d.id);

      //    // console.log("🚀 ~ init ~ productsAsigment:", productsAsigment);
      //    // console.log("🚀 ~ init ~ productsInStockSelected:", productsInStockSelected);

      //    formikRef?.current?.setFieldValue(
      //       "productos_en_stock",
      //       productsAsigment //.filter((product) => product.location_status == "Asignado")
      //    );
      //    formikRef?.current?.setFieldValue("product_ids", productsInStockSelected);
      // }
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
      // console.log("🚀 ~ VisitForm ~ visit:", visit);
      // console.log("🚀 ~ VisitForm ~ formikRef:", formikRef);
   }, [visit, formikRef, isEdit]);
   // useEffect(() => {
   //    // Si hay un vendedor logueado, cargar sus productos disponibles
   //    if (auth.user?.id) {
   //       getAvailableProductsForSeller(auth.user.id);
   //    }
   // }, [auth.user]);

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
               maxWidth="full"
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
         <PointOfSaleForm container="modal" openDialog={pointOfSaleFormDialog} setOpenDialog={setPointOfSaleFormDialog} refreshSelect={refetchPointsOfSale} />

         {/* <RoleForm container="modal" openDialog={roleFormDialog} setOpenDialog={setRoleFormDialog} refreshSelect={refreshRoles} /> */}
         {/* <EmployeeForm container="modal" openDialog={employeeFormDialog} setOpenDialog={setEmployeeFormDialog} refreshSelect={refreshEmployees} /> */}
      </>
   );
};

export default VisitForm;
