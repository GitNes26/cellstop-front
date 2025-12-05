import React, { useCallback, useEffect } from "react";
import { Button, ButtonGroup, Tooltip, Typography } from "@mui/material";

import Toast from "../../../../utils/Toast";
import icons from "../../../../constant/icons";
// import { DataTable, Toggle, Typography } from "../../../../components/basics";
import { formatDatetime } from "../../../../utils/Formats";
import { useAuthContext } from "../../../../context/AuthContext";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext";
import { useUserContext } from "../../../../context/UserContext";
import { DataTableComponent } from "../../../../components";
import { CancelRounded, CheckCircleRounded, Label } from "@mui/icons-material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { QuestionAlertConfig } from "../../../../utils/sAlert";
import { color } from "framer-motion";
// import { GridColDef } from "@mui/x-data-grid";

const UserDT = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const { singularName, allUsers, setFormTitle, setTextBtnSubmit, setChangePassword, formikRef, setIsEdit, deleteUser, disEnableUser, getAllUsers, getUser } =
      useUserContext();

   const mySwal = withReactContent(Swal);

   //#region COLUMNAS
   const fontSizeTable = { text: "medium", subtext: "small" };
   const globalFilterFields = ["username", "email", "role", "active", "created_at"];

   // #region BodysTemplate
   const UserBodyTemplate = (obj) => {
      return (
         <Typography textAlign={"center"} fontSize={fontSizeTable.text}>
            {obj.username}
         </Typography>
      );
   };
   const EmailBodyTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.email}
      </Typography>
   );
   const RoleTemplate = (obj) => (
      <Typography textAlign={"center"} size={fontSizeTable.text}>
         {obj.role.role}
      </Typography>
   );
   const EmployeeIdBodyTemplate = (obj) => (
      <Typography textAlign={"center"} className="flex justify-center">
         {obj.employee_id > 0 ? <CheckCircleRounded style={{ color: "green" }} fontSize={"medium"} /> : <CancelRounded style={{ color: "red" }} fontSize={"medium"} />}
      </Typography>
   );

   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"} className="flex justify-center">
         {obj.active ? <CheckCircleRounded style={{ color: "green" }} fontSize={"medium"} /> : <CancelRounded style={{ color: "red" }} fontSize={"medium"} />}
      </Typography>
   );
   const CreatedAtBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatDatetime(obj.created_at, true)}</Typography>;
   // #endregion BodysTemplate

   const columns = [
      {
         field: "username",
         headerName: "Usuario",
         description: "",
         // width: 90,
         sortable: true,
         editable: true,
         functionEdit: null,
         renderCell: (params) => <UserBodyTemplate {...params.row} key={`username-${params.row.id}`} />
         // valueGetter: (value, row) => UserBodyTemplate(row) //`${row.username || ""} ${row.lastName || ""}`
         // body: UserBodyTemplate,
         // filter: true,
         // filterField: null
      },
      {
         field: "email",
         headerName: "Correo",
         description: "",
         // width: 90,
         sortable: true,
         editable: true,
         functionEdit: null,
         renderCell: (params) => <EmailBodyTemplate {...params.row} key={`email-${params.row.id}`} />
      },
      {
         field: "role",
         headerName: "Rol",
         description: "",
         // width: 90,
         sortable: true,
         editable: true,
         functionEdit: null,
         renderCell: (params) => <RoleTemplate {...params.row} key={`role-${params.row.id}`} />
      },
      {
         field: "employee_id",
         headerName: "Empleado",
         description: "",
         // width: 90,
         sortable: true,
         editable: true,
         functionEdit: null,
         renderCell: (params) => <EmployeeIdBodyTemplate {...params.row} key={`employee_id-${params.row.id}`} />
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
            editable: true,
            functionEdit: null,
            renderCell: (params) => <ActiveBodyTemplate {...params.row} key={`active-${params.row.id}`} />
         },
         {
            field: "created_at",
            headerName: "Fecha de alta",
            description: "",
            // width: 90,
            sortable: true,
            editable: true,
            functionEdit: null,
            renderCell: (params) => <CreatedAtBodyTemplate {...params.row} key={`created_at-${params.row.id}`} />
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
         setChangePassword(false);
         setOpenDialog(true);
      } catch (error) {
         setOpenDialog(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      // console.log("🚀 ~ handleClickEdit ~ id:", id);
      try {
         setIsLoading(true);
         if (formikRef.current === null) setOpenDialog(true);
         const res = await getUser(id);
         // console.log("🚀 ~ handleClickEdit ~ res:", res);
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
         setChangePassword(false);
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
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar a ${name}`)).then(async (result) => {
            if (result.isConfirmed) {
               setIsLoading(true);
               const axiosResponse = await deleteUser(id);
               setIsLoading(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDisEnable = async (id, name, active) => {
      try {
         // setTimeout(async () => {
         setIsLoading(true);
         const res = await disEnableUser(id, !active);
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
         // }, 500);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   // const ButtonsAction = ({ id, name, active }) => {
   //    return (
   //       <ButtonGroup variant="outlined">
   //          {/* {auth.permissions.update && ( */}
   //          <Tooltip title={`Editar ${singularName}`} placement="top">
   //             <Button color="info" onClick={() => handleClickEdit(id)}>
   //                {<icons.Tb.TbEdit size={20} />}
   //             </Button>
   //          </Tooltip>
   //          {/* )} */}
   //          {/* <Tooltip title={`Eliminar ${singularName}`} placement="top">
   //             <Button color="error" onClick={() => handleClickDelete(id, name)}>
   //                <IconDelete />
   //             </Button>
   //          </Tooltip> */}
   //          {/* {auth.role_id == ROLE_SUPER_ADMIN && ( */}
   //          <Tooltip title={active ? "Desactivar" : "Reactivar"} placement="right">
   //             <Button color="dark" onClick={() => handleClickDisEnable(id, name, active)} sx={{ p: 0 }}>
   //                <ToggleButton Button defaultChecked={Boolean(active)} />
   //             </Button>
   //          </Tooltip>
   //          {/* )} */}
   //       </ButtonGroup>
   //    );
   // };

   const data = [];
   const formatData = async () => {
      try {
         // const _data = [];
         // console.log("cargar listado", allUsers);
         await allUsers.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            // register.actions = <ButtonsAction id={obj.id} name={obj.user} active={obj.active} />;
            register.actions = [
               { label: "Editar", iconName: "Edit", tooltip: "", handleOnClick: () => handleClickEdit(obj.id), color: "blue", permission: auth.permissions.update },
               {
                  label: "Eliminar",
                  iconName: "Delete",
                  tooltip: "",
                  handleOnClick: () => handleClickDelete(obj.id, obj.username),
                  color: "red",
                  permission: auth.permissions.delete
               }
            ];
            // _data.push(register);
            data.push(register);
         });
         // setData(_data);
         // if (data.length > 0) setGlobalFilterFields(Object.keys(allUsers[0]));
         // console.log("la data del formatData", globalFilterFields);
         // setIsLoading(false);
      } catch (error) {
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };
   formatData();

   useEffect(() => {
      // (async () => {
      // await formatData();
      // setIsLoading(false);
      // })();
   }, []);

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
         rowEdit={false}
         refreshTable={getAllUsers}
         btnsExport={false}
         scrollHeight="80vh"
         // toolBar={auth.more_permissions.includes("Exportar Lista Pública") && status == "aprobadas" ? true : false}
         // positionBtnsToolbar="center"
         // toolbarContentCenter={toolbarContentCenter}
         // toolbarContentEnd={toolbarContentEnd}
      />
   );
};
export default UserDT;
