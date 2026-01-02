import React, { useCallback, useEffect } from "react";
import { Typography, Button, ButtonGroup, Tooltip } from "@mui/material";

import Toast from "../../../../utils/Toast";
import { DataTableComponent } from "../../../../components";
import { formatDatetime, formatPhone } from "../../../../utils/Formats";
import { QuestionAlertConfig } from "../../../../utils/sAlert";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuthContext } from "../../../../context/AuthContext";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext";
import { usePointOfSaleContext } from "../../../../context/PointOfSaleContext";
import { CancelRounded, CheckCircleRounded, MapRounded, PhoneAndroidRounded } from "@mui/icons-material";

const PointOfSaleDT = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      allPointsOfSale,
      setFormTitle,
      setTextBtnSubmit,
      formikRef,
      setIsEdit,
      deletePointOfSale,
      disEnablePointOfSale,
      getAllPointsOfSale,
      getPointOfSale
   } = usePointOfSaleContext();
   const mySwal = withReactContent(Swal);

   //#region COLUMNAS
   const fontSizeTable = { text: "sm", subtext: "xs" };
   const globalFilterFields = ["pointOfSale", "description", "active", "created_at"];

   // #region BodysTemplate
   const PointOfSaleBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.name}
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
      </>
   );
   const AddressBodyTemplate = (obj) => (
      <>
         <Typography
            textAlign={"center"}
            size={fontSizeTable.text}
            component={"a"}
            href={obj.ubication ?? "#"}
            target="_blank"
            className="text-blue-800 hover:underline transition-all"
         >
            <MapRounded style={{ color: "" }} fontSize={"medium"} className="mr-2" /> {obj.address}
         </Typography>
      </>
   );
   const SellerBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.seller.username}
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
   // #endregion BodysTemplate

   const columns = [
      {
         field: "name",
         headerName: "Puesto de trabajo",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => {
            const { key, ...obj } = params.row;
            return <PointOfSaleBodyTemplate {...obj} key={`name-${params.row.id}`} />;
         },
         filter: true,
         filterField: null
      },
      {
         field: "contact_name",
         headerName: "Contacto",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => {
            const { key, ...obj } = params.row;
            return <ContactBodyTemplate {...obj} key={`contact_name-${params.row.id}`} />;
         },
         filter: true,
         filterField: null
      },
      {
         field: "address",
         headerName: "Dirección",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => {
            const { key, ...obj } = params.row;
            return <AddressBodyTemplate {...obj} key={`address-${params.row.id}`} />;
         },
         filter: true,
         filterField: null
      },
      {
         field: "seller",
         headerName: "Vendedor",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => {
            const { key, ...obj } = params.row;
            return <SellerBodyTemplate {...obj} key={`seller-${params.row.id}`} />;
         },
         filter: true,
         filterField: null
      }
   ];
   auth.role_id === ROLE_SUPER_ADMIN &&
      columns.push(
         {
            field: "active",
            headerName: "Activo",
            description: "",
            // width: 90,
            sortable: true,
            functionEdit: null,
            renderCell: (params) => {
               const { key, ...obj } = params.row;
               return <ActiveBodyTemplate {...obj} key={`active-${params.row.id}`} />;
            },
            filter: false,
            filterField: null
         },
         {
            field: "created_at",
            headerName: "Fecha de alta",
            description: "",
            // width: 90,
            sortable: true,
            functionEdit: null,
            renderCell: (params) => {
               const { key, ...obj } = params.row;
               return <CreatedAtBodyTemplate {...obj} key={`created_at-${params.row.id}`} />;
            },
            filter: false,
            filterField: null
         }
      );
   //#endregion COLUMNAS

   const handleClickAdd = () => {
      try {
         if (formikRef.current === null) setOpenDialog(true);
         formikRef?.current?.resetForm();
         formikRef?.current?.setValues(formikRef.current.initialValues);
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
         const res = await getPointOfSale(id);
         // console.log("🚀 ~ handleClickLogout ~ res:", res);
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
         formikRef?.current.setValues(res.result);
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
   };

   const handleClickDelete = async (id, name) => {
      try {
         mySwal.fire(QuestionAlertConfig(`¿Estas seguro de eliminar el departamento de ${name}?`, "CONFIRMAR")).then(async (result) => {
            if (result.isConfirmed) {
               setIsLoading(true);
               const res = await deletePointOfSale(id);
               // console.log('🚀 ~ handleClickLogout ~ res:', res);
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

               if (res.alert_text) Toast.Customizable(res.alert_text, res.alert_icon);
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
            const res = await disEnablePointOfSale(id, !active);
            // console.log('🚀 ~ handleClickLogout ~ res:', res);
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

            if (res.alert_text) Toast.Customizable(res.alert_text, res.alert_icon);
            setIsLoading(false);
         }, 500);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", allPointsOfSale);
         await allPointsOfSale.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            // register.actions = <ButtonsAction id={obj.id} name={obj.pointOfSale} active={obj.active} />;
            register.actions = [
               { label: "Editar", iconName: "Edit", tooltip: "", handleOnClick: () => handleClickEdit(obj.id), color: "blue", permission: auth.permissions.update },
               {
                  label: "Eliminar",
                  iconName: "Delete",
                  tooltip: "",
                  handleOnClick: () => handleClickDelete(obj.id, obj.pointOfSale),
                  color: "red",
                  permission: auth.permissions.delete
               }
            ];
            data.push(register);
         });
      } catch (error) {
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };
   formatData();

   useEffect(() => {}, []);

   return (
      <DataTableComponent
         dataColumns={columns}
         data={data}
         // setData={setRequestBecas}
         // globalFilterFields={globalFilterFields}
         headerFilters={true}
         btnAdd={auth.permissions.create}
         handleClickAdd={handleClickAdd}
         handleClickEdit={handleClickEdit}
         handleClickDisEnable={handleClickDisEnable}
         singularName={singularName}
         indexColumnName={1}
         rowEdit={false}
         refreshTable={getAllPointsOfSale}
         btnsExport={false}
         scrollHeight="67vh"
         // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
         // pointOfSaleBtnsToolbar="center"
         // toolbarContentCenter={toolbarContentCenter}
         // toolbarContentEnd={toolbarContentEnd}
      />
   );
};
export default PointOfSaleDT;
