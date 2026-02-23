import React, { useCallback, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { Typography, Button, ButtonGroup, Tooltip, Avatar } from "@mui/material";

import Toast from "../../../../utils/Toast";
import { DataTableComponent } from "../../../../components";
import { formatDatetime, formatPhone, stringAvatar } from "../../../../utils/Formats";
import { QuestionAlertConfig } from "../../../../utils/sAlert";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuthContext } from "../../../../context/AuthContext";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext";
import { usePointOfSaleContext } from "../../../../context/PointOfSaleContext";
import { CancelRounded, CheckCircleRounded, MapRounded, PhoneAndroidRounded } from "@mui/icons-material";
import { setObjImg } from "../../../../components/forms/FileInputModerno";
import { env } from "../../../../constant";

const PointOfSaleDT = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      allPointsOfSale,
      setFormTitle,
      setTextBtnSubmit,
      formikRef,
      setImgImg,
      setIsEdit,
      deletePointOfSale,
      disEnablePointOfSale,
      getAllPointsOfSale,
      getPointOfSale
   } = usePointOfSaleContext();
   const mySwal = withReactContent(Swal);

   // //#region COLUMNAS mui
   // const fontSizeTable = { text: "sm", subtext: "xs" };
   // const globalFilterFields = ["name", "description", "active", "created_at"];

   // // #region BodysTemplate
   // const ImgBodyTemplate = (obj) => (
   //    <>{obj.img == null || obj.img === "" ? <Avatar {...stringAvatar(obj.name)} /> : <Avatar src={`${env.API_URL_IMG}/${obj.img}`} />}</>
   // );

   // const PointOfSaleBodyTemplate = (obj) => (
   //    <Typography textAlign={"center"} size={fontSizeTable.text}>
   //       {obj.name}
   //    </Typography>
   // );
   // const ContactBodyTemplate = (obj) => (
   //    <>
   //       <Typography textAlign={"center"} size={fontSizeTable.text}>
   //          {obj.contact_name}
   //       </Typography>
   //       <Typography textAlign={"center"} size={fontSizeTable.subtext} className="flex items-center justify-center italic">
   //          <PhoneAndroidRounded style={{ color: "" }} fontSize={"medium"} className="mr-2" />
   //          <a href={`tel:${obj.contact_phone}`} className="text-blue-600 hover:underline transition-all">
   //             {formatPhone(obj.contact_phone)}
   //          </a>
   //       </Typography>
   //    </>
   // );
   // const AddressBodyTemplate = (obj) => (
   //    <>
   //       <Typography
   //          textAlign={"center"}
   //          size={fontSizeTable.text}
   //          component={"a"}
   //          href={obj.ubication ?? "#"}
   //          target="_blank"
   //          className="text-blue-800 hover:underline transition-all"
   //       >
   //          <MapRounded style={{ color: "" }} fontSize={"medium"} className="mr-2" /> {obj.address}
   //       </Typography>
   //    </>
   // );
   // const SellerBodyTemplate = (obj) => (
   //    <Typography textAlign={"center"} size={fontSizeTable.text}>
   //       {obj.seller.username}
   //    </Typography>
   // );

   // const ActiveBodyTemplate = (obj) => (
   //    <Typography textAlign={"center"} className="flex justify-center">
   //       {obj.active ? <CheckCircleRounded style={{ color: "green" }} fontSize={"medium"} /> : <CancelRounded style={{ color: "red" }} fontSize={"medium"} />}
   //    </Typography>
   // );
   // const CreatedAtBodyTemplate = (obj) => (
   //    <Typography textAlign={"center"} size={fontSizeTable.text}>
   //       {formatDatetime(obj.created_at, true)}
   //    </Typography>
   // );
   // // #endregion BodysTemplate

   // const columns = [
   //    {
   //       field: "img",
   //       headerName: "Img",
   //       description: "",
   //       // width: 90,
   //       sortable: false,
   //       functionEdit: null,
   //       renderCell: (params) => <ImgBodyTemplate {...params.row} key={`img-${params.row.id}`} />,
   //       filter: false,
   //       filterField: null
   //    },
   //    {
   //       field: "name",
   //       headerName: "Puesto de trabajo",
   //       description: "",
   //       // width: 90,
   //       sortable: true,
   //       functionEdit: null,
   //       renderCell: (params) => {
   //          const { key, ...obj } = params.row;
   //          return <PointOfSaleBodyTemplate {...obj} key={`name-${params.row.id}`} />;
   //       },
   //       filter: true,
   //       filterField: null
   //    },
   //    {
   //       field: "contact_name",
   //       headerName: "Contacto",
   //       description: "",
   //       // width: 90,
   //       sortable: true,
   //       functionEdit: null,
   //       renderCell: (params) => {
   //          const { key, ...obj } = params.row;
   //          return <ContactBodyTemplate {...obj} key={`contact_name-${params.row.id}`} />;
   //       },
   //       filter: true,
   //       filterField: null
   //    },
   //    {
   //       field: "address",
   //       headerName: "Dirección",
   //       description: "",
   //       // width: 90,
   //       sortable: true,
   //       functionEdit: null,
   //       renderCell: (params) => {
   //          const { key, ...obj } = params.row;
   //          return <AddressBodyTemplate {...obj} key={`address-${params.row.id}`} />;
   //       },
   //       filter: true,
   //       filterField: null
   //    },
   //    {
   //       field: "seller",
   //       headerName: "Vendedor",
   //       description: "",
   //       // width: 90,
   //       sortable: true,
   //       functionEdit: null,
   //       renderCell: (params) => {
   //          const { key, ...obj } = params.row;
   //          return <SellerBodyTemplate {...obj} key={`seller-${params.row.id}`} />;
   //       },
   //       filter: true,
   //       filterField: null
   //    }
   // ];
   // auth.role_id === ROLE_SUPER_ADMIN &&
   //    columns.push(
   //       {
   //          field: "active",
   //          headerName: "Activo",
   //          description: "",
   //          // width: 90,
   //          sortable: true,
   //          functionEdit: null,
   //          renderCell: (params) => {
   //             const { key, ...obj } = params.row;
   //             return <ActiveBodyTemplate {...obj} key={`active-${params.row.id}`} />;
   //          },
   //          filter: false,
   //          filterField: null
   //       },
   //       {
   //          field: "created_at",
   //          headerName: "Fecha de alta",
   //          description: "",
   //          // width: 90,
   //          sortable: true,
   //          functionEdit: null,
   //          renderCell: (params) => {
   //             const { key, ...obj } = params.row;
   //             return <CreatedAtBodyTemplate {...obj} key={`created_at-${params.row.id}`} />;
   //          },
   //          filter: false,
   //          filterField: null
   //       }
   //    );
   // //#endregion COLUMNAS

   // //#region OPCION DE DataTables.Net
   // const fontSizeTable = { text: "sm", subtext: "xs" };

   // const ImgBodyTemplate = (obj) =>
   //    obj.img == null || obj.img === ""
   //       ? ReactDOMServer.renderToString(<Avatar {...stringAvatar(obj.name)} />)
   //       : ReactDOMServer.renderToString(<Avatar src={`${env.API_URL_IMG}/${obj.img}`} />);

   // const ContactBodyTemplate = (obj) =>
   //    ReactDOMServer.renderToString(
   //       <>
   //          {" "}
   //          <Typography textAlign="center" size={fontSizeTable.text}>
   //             {" "}
   //             {obj.contact_name}{" "}
   //          </Typography>{" "}
   //          <Typography textAlign="center" size={fontSizeTable.subtext} className="flex items-center justify-center italic">
   //             {" "}
   //             <PhoneAndroidRounded fontSize="medium" className="mr-2" />{" "}
   //             <a href={`tel:${obj.contact_phone}`} className="text-blue-600 hover:underline transition-all">
   //                {" "}
   //                {formatPhone(obj.contact_phone)}{" "}
   //             </a>{" "}
   //          </Typography>{" "}
   //       </>
   //    );
   // const PointOfSaleBodyTemplate = (obj) =>
   //    ReactDOMServer.renderToString(
   //       <Typography textAlign="center" size={fontSizeTable.text}>
   //          {obj.name}
   //       </Typography>
   //    );
   // const AddressBodyTemplate = (obj) =>
   //    ReactDOMServer.renderToString(
   //       <Typography
   //          textAlign="center"
   //          size={fontSizeTable.text}
   //          component="a"
   //          href={obj.ubication ?? "#"}
   //          target="_blank"
   //          className="text-blue-800 hover:underline transition-all"
   //       >
   //          {" "}
   //          <MapRounded fontSize="medium" className="mr-2" /> {obj.address}{" "}
   //       </Typography>
   //    );

   // const SellerBodyTemplate = (obj) =>
   //    ReactDOMServer.renderToString(
   //       <Typography textAlign="center" size={fontSizeTable.text}>
   //          {obj.seller.username}
   //       </Typography>
   //    );

   // const ActiveBodyTemplate = (obj) =>
   //    ReactDOMServer.renderToString(
   //       <Typography textAlign={"center"} className="flex justify-center">
   //          {obj.active ? <CheckCircleRounded style={{ color: "green" }} fontSize={"medium"} /> : <CancelRounded style={{ color: "red" }} fontSize={"medium"} />}
   //       </Typography>
   //    );

   // const CreatedAtBodyTemplate = (obj) =>
   //    ReactDOMServer.renderToString(
   //       <Typography textAlign={"center"} size={fontSizeTable.text}>
   //          {formatDatetime(obj.created_at, true)}
   //       </Typography>
   //    );

   // const columns = [
   //    { title: "Img", data: "img", orderable: false, render: (data, type, row) => ImgBodyTemplate(row) },
   //    {
   //       title: "Punto de venta",
   //       data: "pos_name",
   //       orderable: true,
   //       render: (data, type, row) => PointOfSaleBodyTemplate(row)
   //    },
   //    { title: "Contacto", data: "contact_name", orderable: true, render: (data, type, row) => ContactBodyTemplate(row) },
   //    {
   //       title: "Dirección",
   //       data: "address",
   //       orderable: true,
   //       render: (data, type, row) => AddressBodyTemplate(row)
   //    },
   //    {
   //       title: "Vendedor",
   //       data: "seller.username",
   //       orderable: true,
   //       render: (data, type, row) => SellerBodyTemplate(row)
   //    },
   //    {
   //       title: "Activo",
   //       data: "active",
   //       orderable: true,
   //       render: (data, type, row) => ActiveBodyTemplate(row)
   //    },
   //    {
   //       title: "Fecha de alta",
   //       data: "created_at",
   //       orderable: true,
   //       render: (data, type, row) => CreatedAtBodyTemplate(row)
   //    }
   // ];

   // //#endregion OPCION DE DataTables.Net

   //#region COLUMNAS PrimeReact
   const fontSizeTable = { text: "sm", subtext: "xs" };
   const globalFilterFields = ["name", "description", "active", "created_at"];

   // #region BodyTemplates
   const ImgBodyTemplate = (obj) => (obj.img == null || obj.img === "" ? <Avatar {...stringAvatar(obj.name)} /> : <Avatar src={`${env.API_URL_IMG}/${obj.img}`} />);

   const PointOfSaleBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.name}
      </Typography>
   );

   const ContactBodyTemplate = (obj) => (
      <>
         <Typography textAlign="center" size={fontSizeTable.text}>
            {obj.contact_name}
         </Typography>
         <Typography textAlign="center" size={fontSizeTable.subtext} className="flex items-center justify-center italic">
            <PhoneAndroidRounded fontSize="medium" className="mr-2" />
            <a href={`tel:${obj.contact_phone}`} className="text-blue-600 hover:underline transition-all">
               {formatPhone(obj.contact_phone)}
            </a>
         </Typography>
      </>
   );

   const AddressBodyTemplate = (obj) => (
      <Typography
         textAlign="center"
         size={fontSizeTable.text}
         component="a"
         href={obj.ubication ?? "#"}
         target="_blank"
         className="text-blue-800 hover:underline transition-all"
      >
         <MapRounded fontSize="medium" className="mr-2" /> {obj.address}
      </Typography>
   );

   const SellerBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {obj.seller.username}
      </Typography>
   );

   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign="center" className="flex justify-center">
         {obj.active ? <CheckCircleRounded style={{ color: "green" }} fontSize="medium" /> : <CancelRounded style={{ color: "red" }} fontSize="medium" />}
      </Typography>
   );

   const CreatedAtBodyTemplate = (obj) => (
      <Typography textAlign="center" size={fontSizeTable.text}>
         {formatDatetime(obj.created_at, true)}
      </Typography>
   );
   // #endregion BodyTemplates

   const columns = [
      { field: "img", header: "Img", sortable: false, body: ImgBodyTemplate, filter: false },
      { field: "name", header: "Puesto de trabajo", sortable: true, body: PointOfSaleBodyTemplate, filter: true },
      { field: "contact_name", header: "Contacto", sortable: true, body: ContactBodyTemplate, filter: true },
      { field: "address", header: "Dirección", sortable: true, body: AddressBodyTemplate, filter: true },
      { field: "seller", header: "Vendedor", sortable: true, body: SellerBodyTemplate, filter: true }
   ];

   if (auth.role_id === ROLE_SUPER_ADMIN) {
      columns.push(
         { field: "active", header: "Activo", sortable: true, body: ActiveBodyTemplate, filter: false },
         { field: "created_at", header: "Fecha de alta", sortable: true, body: CreatedAtBodyTemplate, filter: false }
      );
   }
   // #endregion COLUMNAS react-data-table-component

   const handleClickAdd = () => {
      try {
         if (formikRef.current === null) setOpenDialog(true);
         formikRef?.current?.resetForm();
         formikRef?.current?.setValues(formikRef.current.initialValues);
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         setTextBtnSubmit("AGREGAR");
         setImgImg([]);
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
         setObjImg(res.result.img, setImgImg);

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
            // register.actions = <ButtonsAction id={obj.id} name={obj.name} active={obj.active} />;
            // LOS ICONOS SON EN BASE A PRIMEREACT - PrimeIcons
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
                  handleOnClick: () => handleClickDelete(obj.id, obj.name),
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
         columns={columns}
         data={data}
         globalFilterFields={globalFilterFields}
         headerFilters={true}
         btnAdd={auth.permissions.create}
         handleClickAdd={handleClickAdd}
         rowEdit={false}
         refreshTable={getAllPointsOfSale}
         scrollHeight="67vh"
         btnsExport={true}
         fileNameExport={`Listado de ${singularName} - ${formatDatetime(new Date(), true, "DD-MM-YYYY")}`}
         singularName={singularName}
         indexColumnName={1}
         // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
         // positionBtnsToolbar="center"
         // toolbarContentCenter={toolbarContentCenter}
         // toolbarContentEnd={toolbarContentEnd}
      />

      // <DataTableComponent // DataTables.Net
      //    title="Puestos de trabajo"
      //    data={data}
      //    // data={myData}
      //    columns={columns ?? []}
      //    serverSide={false} // o true si viene de Laravel
      //    ajaxUrl="/api/users"
      //    onRowSelect={(rows) => console.log("Seleccionados:", rows)}
      //    onActionClick={(row) => console.log("Acción en:", row)}
      // />

      // <DataTableComponent // MUI
      //    dataColumns={columns}
      //    data={data}
      //    // setData={setRequestBecas}
      //    // globalFilterFields={globalFilterFields}
      //    headerFilters={true}
      //    btnAdd={auth.permissions.create}
      //    handleClickAdd={handleClickAdd}
      //    handleClickEdit={handleClickEdit}
      //    handleClickDisEnable={handleClickDisEnable}
      //    singularName={singularName}
      //    indexColumnName={2}
      //    rowEdit={false}
      //    refreshTable={getAllPointsOfSale}
      //    btnsExport={false}
      //    scrollHeight="67vh"
      //    // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
      //    // pointOfSaleBtnsToolbar="center"
      //    // toolbarContentCenter={toolbarContentCenter}
      //    // toolbarContentEnd={toolbarContentEnd}
      // />
   );
};
export default PointOfSaleDT;
