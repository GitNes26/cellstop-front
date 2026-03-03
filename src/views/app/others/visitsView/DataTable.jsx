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
import { setObjImg } from "../../../../components/forms/FileInputModerno";
import { env } from "../../../../constant";

const VisitDT = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const { singularName, allVisits, setFormTitle, setTextBtnSubmit, formikRef, setImgEvidencePhoto, setIsEdit, deleteVisit, disEnableVisit, getAllVisits, getVisit } =
      useVisitContext();

   const mySwal = withReactContent(Swal);

   //#region COLUMNAS
   const fontSizeTable = { text: "sm", subtext: "xs" };
   const globalFilterFields = ["visit_type", "seller.username", "point_of_sale.name", "contact_name", "contact_phone", "observations", "active", "created_at"];

   //#region BodyTemplate
   const VisitTypeBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {rowData.visit_type}
      </Typography>
   );

   const SellerBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text} className="flex items-center justify-center">
         <Person fontSize="small" className="mr-1" />
         {rowData.seller?.username || "Sin vendedor"}
      </Typography>
   );

   const POSBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text} className="flex items-center justify-center">
         <Store fontSize="small" className="mr-1" />
         {rowData.point_of_sale?.name || "Sin punto de venta"}
      </Typography>
   );

   const ContactBodyTemplate = (rowData) => (
      <>
         <Typography textAlign="center" size={fontSizeTable.text}>
            {rowData.point_of_sale.contact_name}
         </Typography>
         <Typography textAlign="center" size={fontSizeTable.subtext} className="flex items-center justify-center italic">
            <PhoneAndroidRounded fontSize="medium" className="mr-2" />
            <a href={`tel:${rowData.point_of_sale.contact_phone}`} className="text-blue-600 hover:underline transition-all">
               {formatPhone(rowData.point_of_sale.contact_phone)}
            </a>
         </Typography>
      </>
   );

   const ProductsBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {rowData.visit_type === "Distribución" ? (
            <div className="flex items-center justify-center">
               <Category fontSize="small" className="mr-1" />
               {JSON.parse(rowData.product_ids).length} productos
            </div>
         ) : (
            "No aplica"
         )}
      </Typography>
   );

   const LocationBodyTemplate = (rowData) => (
      <Typography
         textAlign="center"
         size={fontSizeTable.text}
         component="a"
         href={rowData.ubication ?? "#"}
         target="_blank"
         className="text-blue-800 hover:underline transition-all"
      >
         <MapRounded fontSize="medium" className="mr-2" />
         {rowData.ubication ? "Ver ubicación" : "Sin ubicación"}
      </Typography>
   );

   const ObservationsBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {rowData.observations}
      </Typography>
   );

   const EvidenceBodyTemplate = (rowData) => <img src={`${env.API_URL_IMG}/${rowData.evidence_photo}`} className="object-contain h-[50px]" alt="Evidencia" />;

   const ChipsInfoBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {rowData.visit_type === "Distribución" ? (
            <div>
               <div>Entregados: {rowData.chips_delivered || 0}</div>
               <div>Vendidos: {rowData.chips_sold || 0}</div>
               <div>Restantes: {rowData.chips_remaining || 0}</div>
            </div>
         ) : (
            "No aplica"
         )}
      </Typography>
   );

   const ActiveBodyTemplate = (rowData) => (
      <Typography textAlign="center" className="flex justify-center">
         {rowData.active ? <CheckCircleRounded style={{ color: "green" }} fontSize="medium" /> : <CancelRounded style={{ color: "red" }} fontSize="medium" />}
      </Typography>
   );

   const CreatedAtBodyTemplate = (rowData) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {formatDatetime(rowData.created_at, true)}
      </Typography>
   );
   //#endregion BodyTemplate

   const columns = [
      { field: "visit_type", header: "Tipo", sortable: true, filter: true, body: VisitTypeBodyTemplate },
      { field: "seller.username", header: "Vendedor", sortable: true, filter: true, body: SellerBodyTemplate },
      { field: "point_of_sale.name", header: "Punto de Venta", sortable: true, filter: true, body: POSBodyTemplate },
      { field: "point_of_sale.contact_name", header: "Contacto", sortable: false, filter: true, body: ContactBodyTemplate },
      { field: "products", header: "Productos Distribuidos", sortable: false, body: ProductsBodyTemplate },
      { field: "location", header: "Ubicación", sortable: false, body: LocationBodyTemplate },
      { field: "observations", header: "Observaciones", sortable: false, filter: true, body: ObservationsBodyTemplate },
      { field: "evidence_photo", header: "Evidencia", sortable: false, body: EvidenceBodyTemplate }
      // { field: 'chips_info', header: 'Seguimiento', sortable: false, body: ChipsInfoBodyTemplate } // si se descomenta
   ];

   if (auth.role_id === ROLE_SUPER_ADMIN) {
      columns.push(
         { field: "active", header: "Activo", sortable: true, body: ActiveBodyTemplate },
         { field: "created_at", header: "Fecha", sortable: true, width: "120px", body: CreatedAtBodyTemplate }
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
         setImgEvidencePhoto([]);
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
         setObjImg(res.result.evidence_photo, setImgEvidencePhoto);

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
                  iconName: "pi-pen-to-square",
                  tooltip: "",
                  handleOnClick: () => handleClickEdit(obj.id),
                  color: "blue",
                  permission: auth.permissions.update
               },
               {
                  label: "Eliminar",
                  iconName: "pi-trash",
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
         columns={columns}
         data={data}
         globalFilterFields={globalFilterFields}
         headerFilters={true}
         btnAdd={auth.permissions.create}
         handleClickAdd={handleClickAdd}
         rowEdit={false}
         btnDeleteMultiple={false}
         refreshTable={getAllVisits}
         scrollHeight="64vh"
         btnsExport={true}
         fileNameExport={`Listado de ${singularName} - ${formatDatetime(new Date(), true, "DD-MM-YYYY")}`}
         singularName={singularName}
         indexColumnName={0}
         // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
         // positionBtnsToolbar="center"
         // toolbarContentCenter={toolbarContentCenter}
         // toolbarContentEnd={toolbarContentEnd}
      />
      // <DataTableComponent
      //    dataColumns={columns}
      //    data={data}
      //    headerFilters={true}
      //    btnAdd={auth.permissions.create}
      //    handleClickAdd={handleClickAdd}
      //    handleClickEdit={handleClickEdit}
      //    handleClickDisEnable={handleClickDisEnable}
      //    singularName={singularName}
      //    indexColumnName={1}
      //    rowEdit={false}
      //    refreshTable={getAllVisits}
      //    btnsExport={true}
      //    fileNameExport="Visitas"
      //    scrollHeight="67vh"
      // />
   );
};

export default VisitDT;
