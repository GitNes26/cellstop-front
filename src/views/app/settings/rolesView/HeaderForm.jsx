import { useCallback, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import FormikForm, { Select2 } from "../../../../components/forms";
import * as Yup from "yup";
import useFetch from "../../../../hooks/useFetch";
import Toast from "../../../../utils/Toast";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useRoleContext } from "../../../../context/RoleContext";
import { useMenuContext } from "../../../../context/MenuContext";
import { Button } from "@mui/material";

const HeaderForm = ({ setOpenDialogTable, setLoadPermissions }) => {
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      formikRef,
      setIsEdit,
      setCheckMaster,
      checkMenus,
      setCheckMenus,
      menusItems,
      roleSelect,
      rolesSelect,
      setRolesSelect,
      setFormTitle,
      textBtnSubmit,
      setTextBtnSubmit,
      getRole,
      getSelectIndexRoles,
      updatePermissions
   } = useRoleContext();
   const { menusSelect, getSelectMenusToRoles } = useMenuContext();

   useFetch(getSelectMenusToRoles);
   const { refetch: refreshRoles } = useFetch(getSelectIndexRoles, setRolesSelect);

   const formData = [{ name: "id", value: null, validations: Yup.number().min(1, "Esta opción no es valida").required("Seleccione un rol") }];
   const initialValues = {};
   const validations = {};
   formData.forEach((field) => {
      initialValues[field.name] = field.value;
      validations[field.name] = field.validations;
   });
   const validationSchema = Yup.object().shape(validations);
   const onSubmit = async (values, { setSubmitting, resetForm }) => {
      try {
         // console.log("values", values);
         // console.log("checkMenus", checkMenus);
         if (values.id < 1) return Toast.Info("Selecciona un Role");
         // console.log("🚀 ~ onSubmit ~ checkMenus:", checkMenus);
         setIsLoading(true);
         // checkMenus = [];
         values.read = [];
         values.create = [];
         values.update = [];
         values.delete = [];
         values.more_permissions = [];
         let count_more_permissions = 0;
         const totalMenus = checkMenus.length;
         checkMenus.map((check) => {
            // console.log("check", check);
            if (check.permissions.read) values.read.push(check.id);
            if (check.permissions.create) values.create.push(check.id);
            if (check.permissions.update) values.update.push(check.id);
            if (check.permissions.delete) values.delete.push(check.id);
            if (check.permissions.more_permissions.length > 0) {
               check.permissions.more_permissions.map((permission) => {
                  // console.log("🚀 ~ check.permissions.more_permissions.map ~ permission:", permission);
                  values.more_permissions.push(permission);
               });
            }
         });
         // console.log("🚀 ~ onSubmit ~ menusItems:", menusItems);
         menusItems.map((m) => m.children.map((mc) => (count_more_permissions += mc.others_permissions.length)));
         // console.log("values", values);
         // console.log("values.more_permissions", values.more_permissions, "-- count", count_more_permissions);
         if (values.read.length == totalMenus) values.read = "todas";
         else values.read = values.read.join();
         if (values.create.length == totalMenus) values.create = "todas";
         else values.create = values.create.join();
         if (values.update.length == totalMenus) values.update = "todas";
         else values.update = values.update.join();
         if (values.delete.length == totalMenus) values.delete = "todas";
         else values.delete = values.delete.join();
         // if (values.more_permissions.length > 0 && values.more_permissions.length == count_more_permissions) values.more_permissions = "todas";
         // else
         values.more_permissions = values.more_permissions.join();
         // console.log("values.more_permissions FINAL", values.more_permissions);
         // return console.log("valuesFinal", values);

         const res = await updatePermissions(values);
         if (!res) return setIsLoading(false);
         if (res.errors) {
            setIsLoading(false);
            Object.values(res.errors).forEach((errors) => {
               errors.map((error) => Toast.Warning(error));
            });
            return;
         } else if (res.status_code !== 200) {
            setIsLoading(false);
            setSubmitting(false);
            return Toast.Customizable(res.alert_text, res.alert_icon);
         }
         resetForm();
         formikRef.current.setValues(formikRef.current.initialValues);
         resetCheckMenus();
         // setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         setSubmitting(false);
         setIsLoading(false);
         Toast.Customizable(res.alert_text, res.alert_icon);
         // if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const resetCheckMenus = () => {
      setCheckMaster(false);
      const resetCheck = checkMenus.map((check) => {
         check.isChecked = false;
         check.permissions = { read: false, create: false, update: false, delete: false, more_permissions: [] };
         return check;
      });
      setCheckMenus(resetCheck);
   };

   const handleChangeRole = async ({ value }) => {
      try {
         // console.log("amanas", value);
         setLoadPermissions(true);
         resetCheckMenus();
         // console.log("resetCheckMenus", resetCheckMenus);
         if (value.id < 1) return setLoadPermissions(false); // checks se quedan reiniciados

         setIsLoading(true);
         const res = await getRole(value.id);
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
         // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", res);
         const permissions = {
            read: [],
            create: [],
            update: [],
            delete: [],
            more_permissions: []
         };
         permissions.read = res.result.read === "todas" ? "todas" : res.result.read === null ? [] : res.result.read.split(",");
         permissions.create = res.result.create === "todas" ? "todas" : res.result.create === null ? [] : res.result.create.split(",");
         permissions.update = res.result.update === "todas" ? "todas" : res.result.update === null ? [] : res.result.update.split(",");
         permissions.delete = res.result.delete === "todas" ? "todas" : res.result.delete === null ? [] : res.result.delete.split(",");
         permissions.more_permissions =
            res.result.more_permissions === "todas" ? "todas" : res.result.more_permissions === null ? [] : res.result.more_permissions.split(",");
         // console.log("permissions.more_permissions", permissions.more_permissions);

         let newCheckMenus = [];
         if (
            permissions.read === "todas" &&
            permissions.create === "todas" &&
            permissions.update === "todas" &&
            permissions.delete === "todas"
            // && permissions.more_permissions === "todas"
         )
            newCheckMenus = checkMenus.map((check) => {
               check.isChecked = true;
               check.permissions = { read: true, create: true, update: true, delete: true, more_permissions: [] };
               // check.permissions = { read: true, create: true, update: true, delete: true, more_permissions: ["todas"] };
               return check;
            });
         else {
            newCheckMenus = checkMenus.map((check) => {
               // console.log(`${permissions.read}includes(${check.id.toString()})`);
               if (permissions.read.includes(check.id.toString()) || permissions.read === "todas") check.isChecked = true;
               if (permissions.read.includes(check.id.toString()) || permissions.read === "todas") check.permissions.read = true;
               if (permissions.create.includes(check.id.toString()) || permissions.create === "todas") check.permissions.create = true;
               if (permissions.update.includes(check.id.toString()) || permissions.update === "todas") check.permissions.update = true;
               if (permissions.delete.includes(check.id.toString()) || permissions.delete === "todas") check.permissions.delete = true;
               // console.log(`${permissions.more_permissions}includes(${check.id.toString()})`);
               check.permissions.more_permissions = [];
               // if (permissions.more_permissions === "todas") check.permissions.more_permissions = ["todas"];

               // else check.permissions.more_permissions = permissions.more_permissions;
               // else {
               //    permissions.more_permissions.map((mp) => {
               //       console.log("el mp", mp);
               //       // else check.permissions.more_permissions = permissions.more_permissions;
               //    });
               // }
               return check;
            });
         }
         // console.log("🚀 ~ permissions.more_permissions.map ~ newCheckMenus:", newCheckMenus);

         if (Array.isArray(permissions.more_permissions)) {
            // console.log("es array", permissions.more_permissions);
            permissions.more_permissions.map((mp) => {
               // console.log("el mp", mp);
               if (mp.includes("@")) {
                  const id = mp.split("@")[0];
                  newCheckMenus.find((check) => check.id === Number(id) && check.permissions.more_permissions.push(mp));
               } else newCheckMenus.find((check) => check.others_permissions.includes(mp) && check.permissions.more_permissions.push(mp));
               // else check.permissions.more_permissions = permissions.more_permissions;
            });
         } else if (permissions.more_permissions == "todas")
            newCheckMenus.map((check) => check.others_permissions.length > 0 && check.permissions.more_permissions.push("todas"));
         // console.log("🚀 ~ newCheckMenus=checkMenus.map ~ newCheckMenus:", newCheckMenus);
         setCheckMenus(newCheckMenus);
         setLoadPermissions(false);
         if (res.alert_text) Toast.Success(res.alert_text);
         setIsLoading(false);
         // console.log("FormSelect - checkMenus", checkMenus);
      } catch (error) {
         setLoadPermissions(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickShowTable = () => {
      try {
         setOpenDialogTable(true);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async () => {
      try {
         setOpenDialog(true);
         setIsLoading(true);
         // console.log("el roleSelect:", roleSelect, formikRef.current);
         if (roleSelect.id < 1) return Toast.Info("No has seleccionado ningún rol.");
         roleSelect.page_index = menusSelect.find((item) => (item.label = roleSelect.page_index)).id;
         setTimeout(() => {
            formikRef?.current.setValues(roleSelect);
         }, 1500);
         // if (res.alert_text) Toast.Success(res.alert_text);
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         setTextBtnSubmit("GUARDAR");
         setIsEdit(true);
         setIsLoading(false);
      } catch (error) {
         setOpenDialog(false);
         setIsLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };

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

   useEffect(() => {
      // console.log("🚀 Form ~ useEffect ~ changePassword:", changePassword);
      // console.log("🚀 Form ~ useEffect ~ isEdit:", isEdit);
   }, [formikRef]);

   return (
      <div className="card bg-base-300">
         <FormikForm
            formikRef={formikRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            alignContent={"center"}
            textBtnSubmit={textBtnSubmit}
            btnSize="large"
            showCancelButton={false}
            handleCancel={null}
            showActionButtons={false}
            col={12}
            alignItems="start"
            maxHeight="auto"
            // sizeCols={{}}
            spacing={0}
         >
            <Grid size={{ xs: 12, sm: 2 }} sx={{ pt: 0, px: 1 }}>
               <Button type="button" variant="outlined" color="secondary" size="large" fullWidth onClick={handleClickShowTable}>
                  VER TODOS
               </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }} sx={{ pt: 0, px: 1 }}>
               <Button type="button" variant="outlined" color="info" size="large" fullWidth onClick={handleClickEdit}>
                  EDITAR
               </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }} sx={{ pt: 0, px: 1 }}>
               <Button type="button" variant="outlined" color="success" size="large" fullWidth onClick={handleClickAdd}>
                  AGREGAR
               </Button>
            </Grid>
            <Select2
               col={4}
               idName={"id"}
               label={"Rol"}
               options={rolesSelect || []}
               refreshSelect={refreshRoles}
               onChangeExtra={handleChangeRole}
               helperText={""}
               size={"medium"}
               required
            />
            <Grid size={{ xs: 12, sm: 2 }} sx={{ pt: 0, px: 1 }}>
               <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
                  GUARDAR
               </Button>
            </Grid>
         </FormikForm>
      </div>
   );
};

export default HeaderForm;
