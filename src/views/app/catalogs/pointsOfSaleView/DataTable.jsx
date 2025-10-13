import React, { useCallback, useEffect } from "react";

import Toast from "../../../../utils/Toast";
import { DataTableComponent } from "../../../../components";

import { formatDatetime, stringAvatar } from "../../../../utils/Formats";
import { QuestionAlertConfig } from "../../../../utils/sAlert";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { formatPhone } from "../../../../utils/Formats";
import { setObjImg } from "../../../../components/forms/FileInput";
import env from "../../../../constant/env";
import { useAuthContext } from "../../../../context/AuthContext";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext";
import { usePointOfSaleContext } from "../../../../context/PointOfSaleContext";
import { Avatar, Typography } from "@mui/material";
import { AlternateEmailRounded, AssignmentIndRounded, CancelRounded, CheckCircleRounded, FaxRounded, NumbersRounded, PhoneAndroidRounded } from "@mui/icons-material";

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
      setImgAvatar,
      setImgFirm,
      deletePointOfSale,
      disEnablePointOfSale,
      getAllPointsOfSale,
      getPointOfSale
   } = usePointOfSaleContext();
   const mySwal = withReactContent(Swal);

   //#region COLUMNAS
   const fontSizeTable = { text: "sm", subtext: "xs" };
   const globalFilterFields = ["payroll_number", "full_name", "cellphone", "office_phone", "ext", "department", "position", "active", "created_at"];

   // #region BodysTemplate
   const AvatarBodyTemplate = (obj) => (
      <>{obj.avatar == null || obj.avatar === "" ? <Avatar {...stringAvatar(obj.full_name)} /> : <Avatar src={`${env.API_URL_IMG}/${obj.avatar}`} />}</>
   );
   const PayRollNumberTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         <b>{obj.payroll_number}</b>
      </Typography>
   );
   const PointOfSaleBodyTemplate = (obj) => (
      <>
         <Typography textAlign={"center"} size={fontSizeTable.text}>
            {obj.full_name}
         </Typography>
         <Typography textAlign={"center"} size={fontSizeTable.subtext} className="flex items-center justify-center italic">
            <PhoneAndroidRounded style={{ color: "" }} fontSize={"medium"} className="mr-2" /> {formatPhone(obj.cellphone)}
         </Typography>
         <Typography textAlign={"center"} size={fontSizeTable.subtext} className="flex items-center justify-center italic">
            <AlternateEmailRounded style={{ color: "" }} fontSize={"medium"} className="mr-2" /> {obj.user ? obj.user.email : "No hay usuario vinculado"}
         </Typography>
      </>
   );
   const DepartmentBodyTemplate = (obj) => {
      return (
         <>
            <Typography textAlign={"center"} size={fontSizeTable.text}>
               {obj.department.department}
            </Typography>
            <Typography textAlign={"center"} size={fontSizeTable.subtext} className="flex items-center justify-center italic">
               <FaxRounded style={{ color: "" }} fontSize={"medium"} className="mr-2" /> {formatPhone(obj.office_phone)}
            </Typography>
         </>
      );
   };
   const PositionBodyTemplate = (obj) => (
      <>
         <Typography textAlign={"center"} size={fontSizeTable.text}>
            {obj.position.position}
         </Typography>
         <Typography textAlign={"center"} size={fontSizeTable.subtext} className="flex items-center justify-center italic">
            <NumbersRounded style={{ color: "" }} fontSize={"medium"} className="mr-2" /> Ext. {obj.ext}
         </Typography>
      </>
   );
   const UserBodyTemplate = (obj) => (
      <>
         <Typography textAlign={"center"} size={fontSizeTable.text} className="flex items-center justify-center">
            <AssignmentIndRounded style={{ color: "" }} fontSize={"medium"} className="mr-2" />
            {obj.username ?? "Sin asignar"}
         </Typography>
      </>
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
         field: "avatar",
         headerName: "Avatar",
         description: "",
         // width: 90,
         sortable: false,
         functionEdit: null,
         renderCell: (params) => <AvatarBodyTemplate {...params.row} key={`avatar-${params.row.id}`} />,
         filter: false,
         filterField: null
      },
      {
         field: "payroll_number",
         headerName: "No. Empleado",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <PayRollNumberTemplate {...params.row} key={`payroll_number-${params.row.id}`} />,
         filter: true,
         filterField: null
      },
      {
         field: "full_name",
         headerName: "Empleado",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <PointOfSaleBodyTemplate {...params.row} key={`full_name-${params.row.id}`} />,
         filter: true,
         filterField: null
      },
      {
         field: "department",
         headerName: "Departamento",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <DepartmentBodyTemplate {...params.row} key={`department-${params.row.id}`} />,
         filter: true,
         filterField: null
      },
      {
         field: "position",
         headerName: "Puesto",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <PositionBodyTemplate {...params.row} key={`position-${params.row.id}`} />,
         filter: true,
         filterField: null
      },
      {
         field: "user",
         headerName: "Usuario del sistema",
         description: "",
         // width: 90,
         sortable: true,
         functionEdit: null,
         renderCell: (params) => <UserBodyTemplate {...params.row} key={`user-${params.row.id}`} />,
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
            renderCell: (params) => <ActiveBodyTemplate {...params.row} key={`active-${params.row.id}`} />,
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
            renderCell: (params) => <CreatedAtBodyTemplate {...params.row} key={`created_at-${params.row.id}`} />,
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
         setImgAvatar([]);
         setImgFirm([]);
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

         // if (res.result.description) res.result.description == null && (res.result.description = "");
         setObjImg(res.result.avatar, setImgAvatar);
         setObjImg(res.result.img_firm, setImgFirm);
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
         mySwal.fire(QuestionAlertConfig(`¿Estas seguro de eliminar el empleado ${name}?`, "CONFIRMAR")).then(async (result) => {
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

   async function formatData() {
      try {
         // console.log("cargar listado", allPointsOfSale);
         await allPointsOfSale.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            // register.actions = <ButtonsAction id={obj.id} name={obj.full_name} active={obj.active} />;
            register.actions = [
               { label: "Editar", iconName: "Edit", tooltip: "", handleOnClick: () => handleClickEdit(obj.id), color: "blue" },
               { label: "Eliminar", iconName: "Delete", tooltip: "", handleOnClick: () => handleClickDelete(obj.id, obj.full_name), color: "red" }
            ];
            data.push(register);
         });
      } catch (error) {
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   }
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
         indexColumnName={2}
         rowEdit={false}
         refreshTable={getAllPointsOfSale}
         btnsExport={true}
         fileNameExport="Empleados"
         scrollHeight="67vh"
         // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
         // positionBtnsToolbar="center"
         // toolbarContentCenter={toolbarContentCenter}
         // toolbarContentEnd={toolbarContentEnd}
      />
   );
};
export default PointOfSaleDT;
