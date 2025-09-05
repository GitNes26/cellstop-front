// import { FormikValues, useFormikContext } from "formik";
// import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
// import Select from "react-tailwindcss-select";
// // import { Tooltip } from "../basics";
// import { Grid, IconButton, Tooltip } from "@mui/material";
import Toast from "../../utils/Toast";
// import icons from "./../../constant/icons";

// const options = [
//    { value: "fox", label: "🦊 Fox" },
//    { value: "Butterfly", label: "🦋 Butterfly" },
//    { value: "Honeybee", label: "🐝 Honeybee" }
// ];

// /**
//  * Props para el componente Select2.
//  */
// interface Option {
//    id?: number;
//    value?: any;
//    label: any;
// }
// interface GroupOption {
//    id?: number;
//    label: string;
//    options: Option[]; // Un grupo de opciones contiene un array de Option
//    value?: any;
// }

// type Options = (Option | GroupOption)[];
// interface Select2Props {
//    xsOffset?: number | null;
//    col?: number;
//    sizeCols?: {
//       xs: number;
//       sm: number;
//       md: number;
//    };
//    idName: string;
//    label: string;
//    options?: Options;
//    helperText?: string;
//    hidden?: boolean;
//    namePropLabel?: string;
//    disabled?: boolean;
//    color?: string;
//    mb?: number;
//    size?: "sm" | "md" | "lg";
//    className?: string;
//    onChangeExtra?: (value: any) => void;
//    focus?: boolean;
//    multiple?: boolean;
//    refreshSelect?: () => Promise<void> | null;
//    addRegister?: () => Promise<void> | null;
//    required?: boolean;
//    pluralName?: string;
//    singularName?: string;
//    // getValues?: (value: number, options: () => void) => any;
// }
// type dataPreviewType = {
//    cont: number;
//    dataPreview: Array<Record<string, any>>;
//    ignore: boolean;
// };
// /**
//  * @typedef {Object} Select2Props
//  * @property {number|null} [xsOffset=null] - Offset para la columna xs.
//  * @property {number} [col=12] - Tamaño de la columna.
//  * @property {Object} [sizeCols={ xs: 12, sm: 12, md: col }] - Tamaños para las diferentes pantallas.
//  * @property {number} [sizeCols.xs] - Tamaño en pantallas extra pequeñas.
//  * @property {number} [sizeCols.sm] - Tamaño en pantallas pequeñas.
//  * @property {number} [sizeCols.md] - Tamaño en pantallas medianas.
//  * @property {string} idName - Nombre del campo que identifica el control.
//  * @property {string} label - Etiqueta del campo.
//  * @property {Options} [option] - Opciones disponibles para el select.
//  * @property {string} [helperText] - Texto de ayuda debajo del campo.
//  * @property {boolean} [hidden=false] - Si el campo debe estar oculto.
//  * @property {string} namePropLabel - Nombre de la propiedad que se utiliza como etiqueta en las opciones.
//  * @property {boolean} [disabled] - Si el campo está deshabilitado.
//  * @property {string} [color] - Color de la etiqueta del campo.
//  * @property {number} [mb=2] - Margen inferior del campo.
//  * @property {string} [size="md"] - Tamaño del campo (pequeño, mediano, grande).
//  * @property {string} [className=""] - Clases adicionales para el select.
//  * @property {(data: { idName: string, value: any }) => void} [onChangeExtra] - Función adicional a ejecutar en el cambio de valor.
//  * @property {boolean} [focus=false] - Si el campo debe enfocarse automáticamente al renderizar.
//  * @property {boolean} [multiple] - Si el select permite seleccionar múltiples opciones.
//  * @property {() => Promise<void>} [refreshSelect] - Función para actualizar las opciones del select.
//  * @property {() => Promise<void>} [addRegister] - Función para agregar un registro.
//  * @property {string} [pluralName=""] - Para indicar que actualizará la lista.
//  * @property {boolean} [singularName] - Para indicar que puede agregar un registro.
//  */
// const Select2: React.FC<Select2Props> = ({
//    xsOffset = null,
//    col = 12,
//    sizeCols = { xs: 12, sm: 12, md: col }, // 97% Altura máxima del formulario
//    idName,
//    label,
//    options = [],
//    helperText,
//    hidden = false,
//    namePropLabel,
//    disabled,
//    color,
//    mb = 2,
//    size = "md",
//    className = "",
//    onChangeExtra,
//    focus = false,
//    multiple,
//    refreshSelect,
//    addRegister,
//    pluralName = "lista",
//    singularName = "registro",
//    required
//    // getValues
// }) => {
//    // const [dataOptions, setDataOptions] = useState<Options>([]);
//    const [value, setValue] = useState(null);
//    const formik = useFormikContext<FormikValues>();
//    const inputRef = useRef<HTMLInputElement>(null);
//    const [dataPreview, setDataPreview] = useState<dataPreviewType>({
//       cont: 0,
//       dataPreview: [],
//       ignore: false
//    });
//    const { values } = formik;
//    const error =
//       formik.touched[idName === "colony" ? "community_id" : idName] && formik.errors[idName === "colony" ? "community_id" : idName]
//          ? formik.errors[idName === "colony" ? "community_id" : idName].toString()
//          : null;
//    const isError = Boolean(error);
//    // options.push({ id: 0, label: "Agregar registro" });

//    // const [dataOptions, setDataOptions] = useState<Option[]>([]);
//    // const [dataOptions, setDataOptions] = useState<Options>([]);
//    // const [dataOptions, setDataOptions] = useState<any>([]);
//    // const [labelValue, setLabelValue] = useState("Selecciona una opción...");
//    const [loading, setLoading] = useState(false);

//    const handleChange = (value: any) => {
//       // console.log("value:", value); // => {id:0, label:""}
//       setValue(value);
//       formik.setFieldValue(idName, value === null ? null : value.id);
//       // console.log("🚀 ~ handleChange ~ value:", value);
//       if (onChangeExtra) onChangeExtra({ idName, value });
//    };

//    const handleClickRefresh = async (onlyRefresh = true) => {
//       try {
//          setLoading(true);
//          if (refreshSelect) await refreshSelect();
//          setLoading(false);
//          // console.log("proceso", onlyRefresh);
//          if (onlyRefresh) {
//             setDataPreview((prev) => ({
//                ...prev,
//                ignore: true
//             }));
//          } else {
//             setDataPreview((prev) => ({
//                ...prev,
//                cont: 0,
//                ignore: false
//             }));
//          }
//          Toast.Success("Lista Actualizada");
//       } catch (error) {
//          console.log(error);
//          Toast.Error(error);
//       }
//    };
//    const handleClickAddRegister = async () => {
//       try {
//          setLoading(true);
//          if (addRegister) {
//             await addRegister();
//             await handleClickRefresh(false);
//          }
//          setLoading(false);
//          Toast.Success("Registro agregado");
//       } catch (error) {
//          console.log(error);
//          Toast.Error(error);
//       }
//    };

//    // const handleKeyDown = (event) => {
//    //    console.log("🚀 ~ handleKeyDown ~ event:", event);
//    //    if (event.key === "ArrowDown") {
//    //       console.log("🚀 ~ handleKeyDown ~ ArrowDown:");
//    //       // if (event.key === "ArrowDown" && selectRef.current) {
//    //       // selectRef.current.focus();
//    //    }
//    // };

//    useEffect(() => {
//       setTimeout(() => {
//          if (focus && inputRef.current) {
//             inputRef.current.focus();
//          }
//       }, 500);
//    }, [focus]);

//    useEffect(() => {
//       if (dataPreview.cont == 0 && options.length > 0) {
//          setDataPreview({
//             cont: 1,
//             dataPreview: options,
//             ignore: false
//          });
//       }
//       // console.log("preview",dataPreview)
//       // console.log("🚀 ~ useEffect ~ options > dataPreview:", options.length, dataPreview.dataPreview.length, options.length > dataPreview.dataPreview.length);
//       if (options.length > 0 && dataPreview.dataPreview.length > 0 && options.length > dataPreview.dataPreview.length && !dataPreview.ignore) {
//          // console.log("🚀 ~ //handleKeyDown ~ options:", options);
//          const dataReorder = options.sort((a, b) => b.id - a.id);
//          // console.log("🚀 ~ useEffect ~ dataReorder:", dataReorder);
//          const value = dataReorder[0];
//          // console.log("🚀 ~ useEffect ~ value:", value);
//          formik.setFieldValue(idName, dataReorder[0].id);
//          if (onChangeExtra) onChangeExtra({ idName, value });
//       }
//    }, [options]);

//    useEffect(() => {
//       // dataOptions.push({ id: 0, label: "Agregar registro" });
//       // dataOptions.push(options);

//       // Inserta la opción "Agregar registro" solo si no existe ya en las opciones
//       // const defaultOption = { id: 0, label: "Agregar registro" };
//       // const hasDefaultOption = options.some((option) => option.id === defaultOption.id);

//       // if (!hasDefaultOption) {
//       //    console.log("oliiii");
//       //    options.unshift(defaultOption); // Agrega la opción al inicio
//       // }

//       // console.log("Select2 ~ isError", isError);
//       setValue(null);
//       if (formik.values[idName] > 0) {
//          setValue(options.find((item) => item.id === formik.values[idName]));
//       }
//    }, [idName, formik.values[idName]]);

//    useLayoutEffect(() => {
//       // console.log("useLayoutEffect ~ ordenar");
//       // options = removeDuplicates(options);
//       // options = options.sort((a,b)=> a.id - b.);
//       // console.log("🚀 ~ useLayoutEffect ~ options:", options);
//    }, []);

//    return (
//       <Grid size={sizeCols} offset={{ xs: xsOffset }} hidden={hidden} className={`p-1 mb-[${mb}]`}>
//          <div className="flex items-start">
//             <label className={`form-control grow relative mb-2`}>
//                <div className={`label py-0 pb-0.5`}>
//                   <span className={`label-text font-bold text-${color} ${isError && "text-error"}`}>{label}</span>
//                   <span className={`label-text-alt ${isError ? "text-error" : "text-gray-400"}`}>{required ? "Requerido" : "Opcional"}</span>
//                </div>
//                <Select
//                   key={`key-Select`}
//                   isSearchable
//                   value={value}
//                   options={options}
//                   // onSearchInputChange={handleKeyDown}
//                   // value={Number(formik.values[idName]) > 0 ? dataOptions.find((option) => option.value === formik.values[idName])?.value : 0}
//                   onChange={(value) => {
//                      formik.handleChange;
//                      handleChange(value);
//                   }}
//                   placeholder={"Selecciona una opción..."}
//                   searchInputPlaceholder="buscar..."
//                   noOptionsMessage="No se encontraron opciones"
//                   // primaryColor="primary"
//                   loading={loading}
//                   isDisabled={loading || disabled}
//                   isMultiple={multiple}
//                   isClearable={true}
//                   classNames={{
//                      menuButton: (value?: { isDisabled?: boolean }) =>
//                         `input input-${size} ${isError && "input-error"} items-center px-0 flex text-sm text-gray-500 border ${
//                            isError ? "border-error" : "border-gray-300"
//                         } rounded-lg shadow-sm transition-all duration-300 focus:outline-none bg-base-100 hover:${
//                            isError ? "border-error" : "border-gray-400"
//                         } focus:${isError ? "border-error" : "border-blue-500"} focus:ring focus:${isError ? "ring-red-500/20" : "ring-blue-500/20"}`,
//                      // searchContainer: ``,
//                      searchIcon: `absolute w-4 h-4 mt-2 ml-1 text-gray-500`,
//                      searchBox: `input input-sm w-full py-2 pl-6 text-sm border border-gray-200 rounded focus:border-gray-500 focus:ring-0 focus:outline-none text-base-content`,
//                      menu: `bg-base-300 pb-2 rounded-b-lg transition-all duration-300`,
//                      list: `list-select2 mt-2 max-h-52 overflow-y-auto`,
//                      listItem: (value?: { isSelected?: boolean }) =>
//                         ` block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded text-gray-500 hover:bg-blue-100 hover:text-blue-500`
//                   }}
//                />

//                <div className={`label`}>
//                   <span className={`label-text-alt ${!isError && !helperText && "text-transparent"} ${isError && "text-error"}`}>
//                      {isError ? error : helperText ? helperText : "."}
//                   </span>
//                </div>
//             </label>
//             {refreshSelect && (
//                <Tooltip title={`Actualizar ${pluralName}`} placement="top">
//                   <IconButton
//                      type="button"
//                      // variant="text"
//                      color="primary"
//                      sx={{ borderRadius: "12px", mr: 0, mt: 3.2 }}
//                      onClick={handleClickRefresh}
//                      disabled={disabled || loading}
//                      className="duration-500 rotate-0 active:transition-all active:rotate-90"
//                   >
//                      {<icons.Tb.TbReload />}
//                   </IconButton>
//                </Tooltip>
//             )}
//             {addRegister && (
//                <Tooltip
//                   title={`
//                Agregar ${singularName}`}
//                   placement="right"
//                >
//                   <IconButton
//                      type="button"
//                      // variant="text"
//                      color="success"
//                      sx={{ borderRadius: "12px", mr: 0, mt: 3.2 }}
//                      onClick={handleClickAddRegister}
//                      disabled={disabled || loading}
//                      className="duration-500 scale-100 active:transition-all active:scale-110"
//                   >
//                      {<icons.Ri.RiAddCircleLine />}
//                   </IconButton>
//                </Tooltip>
//             )}
//          </div>
//          {/* {getValues(values[idName], options)} */}
//       </Grid>
//    );
// };

// export default Select2;
