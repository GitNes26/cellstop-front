// views/VisitsView/DataTable.tsx
import React, { useEffect } from "react";
import Toast from "../../../../utils/Toast";
import { DataTableComponent } from "../../../../components";
import { formatDatetime, formatPhone } from "../../../../utils/Formats";
import { QuestionAlertConfig } from "../../../../utils/sAlert";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuthContext } from "../../../../context/AuthContext";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext";
import { useVisitContext } from "../../../../context/VisitContext";
import { Typography } from "@mui/material";
import { CheckCircleRounded, CancelRounded, LocationOn, Person, Phone, Store, Category, MapRounded, PhoneAndroidRounded } from "@mui/icons-material";

const VisitDT = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const { singularName, allVisits, setFormTitle, setTextBtnSubmit, formikRef, setIsEdit, deleteVisit, disEnableVisit, getAllVisits, getVisit } = useVisitContext();

   const mySwal = withReactContent(Swal);

   //#region COLUMNAS
   const fontSizeTable = { text: "sm", subtext: "xs" };
   const globalFilterFields = ["visit_type", "active", "created_at"];

   const VisitTypeBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.visit_type}
      </Typography>
   );

   const SellerBodyTemplate = (obj) => {
      return (
         <Typography textAlign={"center"} size={fontSizeTable.text} className="flex items-center justify-center">
            <Person fontSize={"small"} className="mr-1" />
            {obj.seller?.username || "Sin vendedor"}
         </Typography>
      );
   };

   const POSBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text} className="flex items-center justify-center">
         <Store fontSize={"small"} className="mr-1" />
         {obj.point_of_sale?.name || "Sin punto de venta"}
      </Typography>
   );

   const ContactBodyTemplate = (obj) => (
      <>
         <Typography textAlign={"center"} size={fontSizeTable.text}>
            {obj.contact_name}
         </Typography>
         <Typography textAlign={"center"} size={fontSizeTable.subtext} className="flex items-center justify-center italic">
            <PhoneAndroidRounded style={{ color: "" }} fontSize={"medium"} className="mr-2" />
            <a href={`tel:${obj.contact_phone}`} className="text-blue-600 hover:underline transition-all">
               {formatPhone(obj.contact_phone)}
            </a>
         </Typography>
         {/* <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.contact_name ? (
            <div className="flex items-center justify-center">
               <Person fontSize={"small"} className="mr-1" />
               {obj.contact_name}
               {obj.contact_phone && (
                  <>
                     <Phone fontSize={"small"} className="ml-2 mr-1" />
                     {obj.contact_phone}
                  </>
               )}
            </div>
         ) : (
            "No aplica"
         )}
      </Typography> */}
      </>
   );

   const ProductsBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.visit_type === "Distribución" ? (
            <div className="flex items-center justify-center">
               <Category fontSize={"small"} className="mr-1" />
               {JSON.parse(obj.product_ids).length} productos
            </div>
         ) : (
            "No aplica"
         )}
      </Typography>
   );

   const LocationBodyTemplate = (obj) => (
      <>
         <Typography
            textAlign={"center"}
            size={fontSizeTable.text}
            component={"a"}
            href={obj.ubication ?? "#"}
            target="_blank"
            className="text-blue-800 hover:underline transition-all"
         >
            <MapRounded style={{ color: "" }} fontSize={"medium"} className="mr-2" /> {obj.ubication ? "Ver ubicación" : "Sin ubicación"}
         </Typography>
         {/* <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.lat && obj.lon ? (
            <div className="flex items-center justify-center">
               <LocationOn fontSize={"small"} className="mr-1" />
               <span title={`Lat: ${obj.lat}, Lon: ${obj.lon}`}>Verificada</span>
            </div>
         ) : (
            "Sin verificar"
         )}
      </Typography> */}
      </>
   );

   const ObservationsBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.observations}
      </Typography>
   );

   const ChipsInfoBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.visit_type === "Distribución" ? (
            <div>
               <div>Entregados: {obj.chips_delivered || 0}</div>
               <div>Vendidos: {obj.chips_sold || 0}</div>
               <div>Restantes: {obj.chips_remaining || 0}</div>
            </div>
         ) : (
            "No aplica"
         )}
      </Typography>
   );

   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"} className="flex justify-center">
         {obj.active ? <CheckCircleRounded style={{ color: "green" }} fontSize={"medium"} /> : <CancelRounded style={{ color: "red" }} fontSize={"medium"} />}
      </Typography>
   );

   const CreatedAtBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {formatDatetime(obj.created_at, true)}
      </Typography>
   );

   const columns = [
      {
         field: "visit_type",
         headerName: "Tipo",
         sortable: true,
         renderCell: (params) => {
            const { key, ...obj } = params.row;
            return <VisitTypeBodyTemplate {...obj} />;
         },
         filter: true
      },
      {
         field: "seller",
         headerName: "Vendedor",
         sortable: true,
         renderCell: (params) => {
            const { key, ...obj } = params.row;
            return <SellerBodyTemplate {...obj} />;
         },
         filter: true
      },
      {
         field: "point_of_sale",
         headerName: "Punto de Venta",
         sortable: true,
         renderCell: (params) => {
            const { key, ...obj } = params.row;
            return <POSBodyTemplate {...obj} />;
         },
         filter: true
      },
      {
         field: "contact",
         headerName: "Contacto",
         sortable: false,
         renderCell: (params) => {
            const { key, ...obj } = params.row;
            return <ContactBodyTemplate {...obj} />;
         },
         filter: false
      },
      {
         field: "products",
         headerName: "Productos Dsitribuidos",
         sortable: false,
         renderCell: (params) => {
            const { key, ...obj } = params.row;
            return <ProductsBodyTemplate {...obj} />;
         },
         filter: false
      },
      {
         field: "location",
         headerName: "Ubicación",
         sortable: false,
         renderCell: (params) => {
            const { key, ...obj } = params.row;
            return <LocationBodyTemplate {...obj} />;
         },
         filter: false
      },
      {
         field: "observations",
         headerName: "Observaciones",
         sortable: false,
         renderCell: (params) => {
            const { key, ...obj } = params.row;
            return <ObservationsBodyTemplate {...obj} />;
         },
         filter: false
      }
      // {
      //    field: "chips_info",
      //    headerName: "Seguimiento",
      //    sortable: false,
      //    renderCell: (params) => {
      //       const { key, ...obj } = params.row;
      //       return <ChipsInfoBodyTemplate {...obj} />;
      //    },
      //    filter: false
      // }
   ];

   if (auth.role_id === ROLE_SUPER_ADMIN) {
      columns.push(
         {
            field: "active",
            headerName: "Activo",
            sortable: true,
            renderCell: (params) => {
               const { key, ...obj } = params.row;
               return <ActiveBodyTemplate {...obj} />;
            },
            filter: false
         },
         {
            field: "created_at",
            headerName: "Fecha",
            sortable: true,
            renderCell: (params) => {
               const { key, ...obj } = params.row;
               return <CreatedAtBodyTemplate {...obj} />;
            },
            filter: false
         }
      );
   }
   //#endregion COLUMNAS

   const handleClickAdd = () => {
      try {
         if (formikRef.current === null) setOpenDialog(true);
         formikRef?.current?.resetForm();
         // formikRef.current.initialValues.seller_id = auth.role_id;
         formikRef?.current?.setValues(formikRef.current.initialValues);
         //if(auth.role_id===3) formikRef?.current?.setFieldValue("seller_id", auth.id);
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         setTextBtnSubmit("AGREGAR");
         setIsEdit(false);
         setOpenDialog(true);
      } catch (error) {
         setOpenDialog(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      try {
         setIsLoading(true);
         if (formikRef.current === null) setOpenDialog(true);
         const res = await getVisit(id);

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

         // Parsear product_ids si es JSON string
         if (res.result.product_ids && typeof res.result.product_ids === "string") {
            res.result.product_ids = JSON.parse(res.result.product_ids);
         }

         formikRef?.current.setValues(res.result);
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
   };

   const handleClickDelete = async (id) => {
      try {
         mySwal.fire(QuestionAlertConfig(`¿Estas seguro de eliminar esta visita?`, "CONFIRMAR")).then(async (result) => {
            if (result.isConfirmed) {
               setIsLoading(true);
               const res = await deleteVisit(id);

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

               Toast.Customizable(res.alert_text, res.alert_icon);
               setIsLoading(false);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDisEnable = async (id, name, active) => {
      try {
         setTimeout(async () => {
            setIsLoading(true);
            const res = await disEnableVisit(id, !active);

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

            Toast.Customizable(res.alert_text, res.alert_icon);
            setIsLoading(false);
         }, 500);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const data = [];

   function formatData() {
      try {
         allVisits.forEach((obj, index) => {
            let register = obj;
            register.key = index + 1;
            register.actions = [
               {
                  label: "Editar",
                  iconName: "Edit",
                  tooltip: "",
                  handleOnClick: () => handleClickEdit(obj.id),
                  color: "blue",
                  permission: auth.permissions.update
               },
               {
                  label: "Eliminar",
                  iconName: "Delete",
                  tooltip: "",
                  handleOnClick: () => handleClickDelete(obj.id),
                  color: "red",
                  permission: auth.permissions.delete
               }
            ];

            // Para superadmin agregar botón activar/desactivar
            if (auth.role_id === ROLE_SUPER_ADMIN) {
               register.actions.push({
                  label: obj.active ? "Desactivar" : "Activar",
                  iconName: obj.active ? "ToggleOff" : "ToggleOn",
                  tooltip: "",
                  handleOnClick: () => handleClickDisEnable(obj.id, obj.id, obj.active),
                  color: obj.active ? "orange" : "green",
                  permission: auth.permissions.update
               });
            }

            data.push(register);
         });
      } catch (error) {
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   }

   formatData();

   useEffect(() => {
      // Inicializar si es necesario
   }, []);

   return (
      <DataTableComponent
         dataColumns={columns}
         data={data}
         headerFilters={true}
         btnAdd={auth.permissions.create}
         handleClickAdd={handleClickAdd}
         handleClickEdit={handleClickEdit}
         handleClickDisEnable={handleClickDisEnable}
         singularName={singularName}
         indexColumnName={1}
         rowEdit={false}
         refreshTable={getAllVisits}
         btnsExport={true}
         fileNameExport="Visitas"
         scrollHeight="67vh"
      />
   );
};

export default VisitDT;
