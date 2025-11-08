import { useCallback, useEffect, useRef, useState } from "react";
import FormikForm, { DividerComponent, Input, Radio, Select2, Switch, Textarea } from "../../../../components/forms";
import * as Yup from "yup";
import useFetch from "../../../../hooks/useFetch";
import Toast from "../../../../utils/Toast";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useMenuContext } from "../../../../context/MenuContext";
import * as Menu from "../../../../models/Menu";
import { Card, CardHeader, Typography } from "@mui/material";
import useFetchObservable from "../../../../hooks/useFetchObservable";
import useObservable, { useObservableState } from "../../../../hooks/useObservable";

const Form = ({ formData, validations, formikRef, validationSchema, onSubmit, textBtnSubmit, handleCancel, container }) => {
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
         // sizeCols={{}}
         spacing={2}
         maxHeight={"53vh"}
         // sizeCols={{}}
         container={["drawer", "modal"].includes(container)}
      >
         {inputsForms.map((input) => input)}
      </FormikForm>
   );
};

const MenuForm = ({ refetchDataTable, refreshSelect }) => {
   // console.log("🚀 ~ MenuForm ~ headersMenus:", headersMenus);
   const { setIsLoading } = useGlobalContext();
   // const { ObservableGet } = useObservable();
   // const headersMenus = ObservableGet("Menu.headers") || [];
   const { data: headersMenus, refetch: refetchHeadersMenus } = useFetchObservable("Menu.headers", Menu.GetHeadersMenusSelect, true);

   console.log("🚀 ~ MenuForm ~ headersMenus:", headersMenus);

   const [isItem, setIsItem] = useObservableState(Menu.states.isItem);
   const [formTitle, setFormTitle] = useObservableState(Menu.states.formTitle);
   const [textBtnSubmit, setTextBtnSubmit] = useObservableState(Menu.states.textBtnSubmit);
   const formikRef = useRef(null);
   Menu.states.formikRef.next(formikRef);

   const [permissionsByMenu, setPermissionsByMenu] = useState([]);
   const [checkMaster, setCheckMaster] = useState(false);
   const [checkMenus, setCheckMenus] = useState([]);
   // const {
   //    menu,
   //    headersMenus,
   //    isItem,
   //    setIsItem,
   //    setHeadersMenus,
   //    formikRef,
   //    formTitle,
   //    setFormTitle,
   //    textBtnSubmit,
   //    setTextBtnSubmit,
   //    getHeadersMenusSelect,
   //    createOrUpdateMenu
   // } = useMenuContext();

   // const { refetch: refetchHeadersMenus } = useFetch(getHeadersMenusSelect, setHeadersMenus);
   // const { data: headersMenus, refetch: refetchHeadersMenus } = useFetchObservable("Menu.headers", Menu.GetHeadersMenusSelect, false);

   const formData = [
      {
         name: "id",
         value: null,
         input: <Input key={`key-input-id`} col={1} idName={"id"} label={"ID"} required hidden />,
         validations: null,
         validationPage: [],
         dividerBefore: {
            show: false,
            title: "",
            orientation: "left",
            sx: { mb: 2 }
         }
      },
      {
         name: "type",
         value: "group",
         input: (
            <Radio
               key={`key-radio-type`}
               col={12}
               idName="type"
               label="Tipo de Menú"
               options={[
                  { value: "group", label: "Padre" },
                  { value: "item", label: "Hijo" }
               ]}
               onChangeExtra={handleChangeType}
               required
            />
         ),
         validations: null,
         validationPage: [],
         dividerBefore: {
            show: false,
            title: "",
            orientation: "left",
            sx: { mb: 2 }
         }
      },
      {
         name: "menu",
         value: "",
         input: <Input col={12} key={`key-input-menu`} idName="menu" label="Nombre de menú" placeholder="Usuarios" type="text" helperText="" required />,
         validations: !isItem && Yup.string().trim().required("Menú requerido"),
         validationPage: [],
         dividerBefore: {
            show: false,
            title: "",
            orientation: "left",
            sx: { mb: 2 }
         }
      },
      {
         name: "caption",
         value: "",
         input: <>{!isItem && <Input key={`key-input-caption`} col={12} idName="caption" label="Leyenda de apoyo" placeholder="Control de usuarios" type="text" />}</>,
         validations: null,
         validationPage: [],
         dividerBefore: {
            show: false,
            title: "",
            orientation: "left",
            sx: { mb: 2 }
         }
      }, // Yup.string().trim().required("Leyenda requerida") },

      {
         name: "belongs_to",
         value: 0,
         input: (
            <>
               {isItem && (
                  <Select2
                     key={`key-select-belongs-to`}
                     col={12}
                     idName="belongs_to"
                     label="Pertenece a"
                     placeholder="NombreDelIcono"
                     refreshSelect={refetchHeadersMenus}
                     options={headersMenus || []}
                     required
                  />
               )}
            </>
         ),
         validations: isItem && Yup.number().min(1, "Esta opción no es valida").required("Pertenece a requerida"),
         validationPage: [],
         dividerBefore: {
            show: false,
            title: "",
            orientation: "left",
            sx: { mb: 2 }
         }
      },
      {
         name: "url",
         value: "",
         input: (
            <>{isItem && <Input key={`key-input-url`} col={12} idName="url" label="URL/Path" placeholder="/app/apartado/nombre-de-pagina" type="text" required />}</>
         ),
         validations: isItem && Yup.string().trim().required("URL requerido"),
         validationPage: [],
         dividerBefore: {
            show: false,
            title: "",
            orientation: "left",
            sx: { mb: 2 }
         }
      },
      {
         name: "icon",
         value: "",
         input: (
            <Input
               key={`key-input-icon`}
               col={12}
               idName="icon"
               label="Icono"
               placeholder="NombreDelIcono"
               type="text"
               helperText={
                  <a href="https://mui.com/material-ui/material-icons/?theme=Rounded" target="_blank" className="text-xs link-info hover:link-hover">
                     Página para obtener iconos (Material UI Icons)
                  </a>
               }
            />
         ),
         validations: null,
         validationPage: [],
         dividerBefore: {
            show: false,
            title: "",
            orientation: "left",
            sx: { mb: 2 }
         }
      }, //Yup.string().trim().required("Icono requerido") },
      {
         name: "others_permissions",
         value: "",
         input: (
            <>
               {isItem && (
                  <Textarea
                     key={`key-textarea-others-permissions`}
                     col={12}
                     idName="others_permissions"
                     label="Otros permisos"
                     placeholder="Dar permisos"
                     helperText={`Los permisos serán separados por coma "( , )" y su estructura: "Nombre Del Permiso"`}
                     required
                  />
               )}
            </>
         ),
         validations: null,
         validationPage: [],
         dividerBefore: {
            show: false,
            title: "",
            orientation: "left",
            sx: { mb: 2 }
         }
      },
      {
         name: "order",
         value: "",
         input: (
            <Input
               key={`key-input-order`}
               col={12}
               idName="order"
               label="Orden"
               placeholder="0"
               type="number"
               helperText="Orden en que se muestra en el sidebar"
               required
            />
         ),
         validations: Yup.number().required("Orden requerido"),
         validationPage: [],
         dividerBefore: {
            show: false,
            title: "",
            orientation: "left",
            sx: { mb: 2 }
         }
      },
      {
         name: "read_only",
         value: false,
         input: (
            <Switch
               key={`key-switch-read-only`}
               col={12}
               idName="read_only"
               label="Solo lectura"
               // onChangeExtra={handleChangeType}
               required
               defaultChecked={false}
            />
         ),
         validations: null,
         validationPage: [],
         dividerBefore: {
            show: false,
            title: "",
            orientation: "left",
            sx: { mb: 2 }
         }
      }, // Yup.boolean().oneOf([true], "Debe ser verdadero").required("Icono requerido") },
      {
         name: "show_counter",
         value: false,
         input: (
            <>
               {isItem && (
                  <Switch
                     key={`key-switch-show-counter`}
                     col={12}
                     idName="show_counter"
                     label="Mostrar Contador"
                     // onChangeExtra={handleChangeType}
                     required
                     defaultChecked={false}
                  />
               )}
            </>
         ),
         validations: null,
         validationPage: [],
         dividerBefore: {
            show: false,
            title: "",
            orientation: "left",
            sx: { mb: 2 }
         }
      },
      {
         name: "counter_name",
         value: "",
         input: (
            <>{isItem && <Input key={`key-input-counter-name`} col={12} idName="counter_name" label="Nombre del contador" placeholder="usersCounter" type="text" />}</>
         ),
         validations: null,
         validationPage: [],
         dividerBefore: {
            show: false,
            title: "",
            orientation: "left",
            sx: { mb: 2 }
         }
      },
      {
         name: "active",
         value: true,
         input: (
            <Switch
               key={`key-switch-active`}
               col={12}
               idName="active"
               label="Menu activo"
               // onChangeExtra={handleChangeType}
               required
               defaultChecked={true}
            />
         ),
         validations: null,
         validationPage: [],
         dividerBefore: {
            show: false,
            title: "",
            orientation: "left",
            sx: { mb: 2 }
         }
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
      const res = await Menu.CreateOrUpdateMenu(values);
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
      // if (refetchDataTable) refetchDataTable();
      setSubmitting(false);
      setIsLoading(false);
      if (refreshSelect) await refreshSelect();
   };
   const handleCancel = () => {
      setIsItem(false);
      formikRef.current.resetForm();
      formikRef.current.setValues(formikRef.current.initialValues);
      setTextBtnSubmit("AGREGAR");
      setFormTitle(`REGISTRAR ${Menu.singularName.toUpperCase()}`);
   };

   function handleChangeType({ idName, value }) {
      // console.log("🚀 ~ handleChangeType ~ idName, value:", idName, value);
      setIsItem(value === "item" ? true : false);
   }

   // useEffect(() => {
   //    // Almacena la referencia de Formik en el estado de Zustand
   //    setFormikRef(formikRef);
   // }, [setFormikRef]);

   // useEffect(() => {
   //    // console.log("🚀 useEffect ~ isItem:", isItem);
   // }, [isItem, formikRef]);
   // }, [isItem, menu, formikRef]);

   return (
      <Card className="p-2 card bg-base-300">
         <Typography variant="h5" className="font-extrabold text-center p-3 pb-5 rounded-b-xl" fontWeight={"bold"} sx={{ backgroundColor: "primary.main" }}>
            {formTitle}
         </Typography>
         <Form
            formData={formData}
            validations={validations}
            formikRef={formikRef}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            textBtnSubmit={textBtnSubmit}
            handleCancel={handleCancel}
            container={"none"}
         />
      </Card>
   );
};

export default MenuForm;
