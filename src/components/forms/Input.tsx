import { FormikValues, useFormikContext } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { FormControlLabel, FormGroup, Grid, IconButton, InputAdornment, Switch, TextField, Typography, CircularProgress, Box, SxProps } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";
import { handleInputFormik, handlePhoneChange } from "../../utils/Formats.js";
import { Visibility, VisibilityOff, VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import { Theme } from "@emotion/react";

//#region INPUT
interface FormValues {
   [idName: string]: string; // Cambia esto según los campos de tu formulario
}
//extends TextFieldProps {
interface InputProps {
   xsOffset?: number | null; // Offset en pantallas extra pequeñas
   loading?: true | false; // Indica que la información se esta procesando
   col: number; // Número de columnas que ocupará el input
   sizeCols?: { xs: number; sm: number; md: number }; // Ancho máxima del input
   idName: string; // Identificador único del input
   label: string; // Texto del label
   placeholder?: string; // Texto de placeholder del input
   helperText?: string; // Texto de ayuda que aparece debajo del input
   type?: "text" | "number" | "search" | "email" | "tel" | "hidden" | "url" | "password" | "color" | "range" | "date"; // Tipo de input (por defecto "text")
   textStyleCase?: true | false | null; // Indica si el input pondra todo en MAYUS/true | MINUS/false | AMBAS/null
   variant?: "filled" | "outlined" | "standard";
   // styleInput?: "classic" | "floating" | "start-inside" | "end-inside" | "both-inside"; // Estilo del input
   startAdornmentContent?: any; // Icono como label
   endAdornmentContent?: any; // Icono como label
   size?: "small" | "medium"; //"xs" | "sm" | "md" | "lg"; // Tamaño del input
   className?: string; // Clases CSS adicionales para el input
   sx?: SxProps<Theme> | undefined;
   characterLimit?: number; // Límite de caracteres permitidos en el input
   color?: "primary" | "secondary" | "success" | "error" | "warning" | "info" | "disabled" | "accent"; // Color del input y label
   mask?: string; // Nueva prop para definir la máscara
   maskChar?: string; // Caracter de reemplazo en la máscara
   onChange?: (e: any) => any | null; // Función para cuando presionan alguna tecla
   onChangeExtra?: (value: any) => void | null; // Función extra para manejar el cambio de valor | opcion2: (e: React.ChangeEvent<HTMLInputElement>) => void;
   hidden?: boolean; // Indica si el input está oculto
   disabled?: boolean; // Desactiva el input
   mb?: number; // Margen inferior del input
   focus?: boolean; // Establece si el input debe enfocarse automáticamente
   required?: boolean; // Establece si el valor de intput es oblogatorio
   changePassword?: true | false; // Cuando el input es password y se esta editando el objeto, se solicita este campo para poder cambiar la contraseña
   maxLength?: number; // Límite Maximo de caracteres permitidos en el input
   minLength?: number; // Límite Minimo de caracteres permitidos en el input
   onKeyUp?: (e: any) => any | null; // Función para cuando presionan alguna tecla
   inputRef?: any | null; // Referencia para el input
   setChangePassword?: (value: any) => void | null; // Funcion para manejar el cambio del changePassword
}

/**
 * Componente de campo de entrada personalizado con estilos y validación basada en Formik.
 *
 * Este componente renderiza un campo de entrada (`<input>`) con un label asociado.
 * Soporta múltiples estilos, incluyendo un label flotante y estilos con label dentro del input.
 *
 * @component
 * @example
 * <Input
 *   col={6}
 *   idName="nombre"
 *   label="Nombre"
 *   placeholder="Introduce tu nombre"
 *   helperText="Tu nombre completo"
 *   type="text"
 *   color="primary"
 *   size="medium"
//  *   styleInput="floating"
 *   characterLimit={50}
 *   required
 * />
 *
 * @param {Object} props - Propiedades del componente.
 * @param {number | null} [props.xsOffset=null] - Offset en pantallas extra pequeñas.
 * @param {true | false} [props.loading=false] - Indica que la información se esta procesando.
 * @param {number} props.col - Número de columnas que ocupará el input.
 * @param {Object} [props.sizeCols={ xs: 12, sm: 9, md: col }] - Ancho máximo del input en diferentes tamaños de pantalla.
 * @param {number} props.sizeCols.xs - Ancho en pantallas extra pequeñas.
 * @param {number} props.sizeCols.sm - Ancho en pantallas pequeñas.
 * @param {number} props.sizeCols.md - Ancho en pantallas medianas.
 * @param {string} props.idName - Identificador único del input.
 * @param {string} props.label - Texto del label del input.
 * @param {string} [props.placeholder] - Texto de placeholder del input.
 * @param {string} [props.helperText] - Texto de ayuda que aparece debajo del input.
 * @param {"text" | "number" | "search" | "email" | "tel" | "hidden" | "url" | "password"} [type="text"] - Tipo de input.
 * @param {true | false | null} [props.textStyleCase=null] - Define si el texto del input se convierte a mayúsculas (`true`), minúsculas (`false`), o se deja tal como está (`null`).
//  * @param {"classic" | "floating" | "start-inside" | "end-inside" | "both-inside"} [props.styleInput="classic"] - Estilo del input.
 * @param {*} [props.startAdornmentContent] - Contenido al inicio del input.
 * @param {*} [props.endAdornmentContent] - Contenido al final del input.
 * @param {"small" | "medium"} [props.size="medium"] - Tamaño del input.
 * @param {string} [props.className] - Clases CSS adicionales para el input.
 * @param {number} [props.characterLimit=0] - Límite de caracteres permitidos en el input. 0 significa sin límite.
 * @param {"primary" | "secondary" | "success" | "error" | "warning" | "info" | "disabled" | "accent"} [props.color] - Co
 * @param {string} [props.mask] - Nueva prop para definir la máscara.
 * @param {string} [props.maskChar] - Caracter de reemplazo en la máscaralor del input y del label.
 * @param {(value: any) => void | null} [props.onChangeExtra] - Función extra para manejar el cambio de valor del input.
 * @param {(value: any) => void | null} [props.onChange] - Función adicional para manejar el cambio de valor del input.
 * @param {boolean} [props.hidden=false] - Indica si el input está oculto.
 * @param {boolean} [props.disabled] - Desactiva el input.
 * @param {number} [props.mb=2] - Margen inferior del input.
 * @param {boolean} [props.focus=false] - Establece si el input debe enfocarse automáticamente.
 * @param {boolean} [props.required] - Establece si el valor del input es obligatorio.
 * @param {true | false} [props.changePassword] - Cuando el input es password y se esta editando el objeto, se solicita este campo para poder cambiar la contraseña.
 * @param {(value: any) => void | null} [props.setChangePassword] Funcion para manejar el cambio del changePassword.
 * @param {number} [props.maxLength] - Límite Máximo de caracteres permitidos en el input.
 * @param {number} [props.minLength=0] - Límite Mínimo de caracteres permitidos en el input.
 * @param {(value: any) => void | null} [props.onKeyUp] - Función adicional para manejar el cambio de valor del input.
 *
 * @returns {React.JSX.Element} El componente Input.
 */

const Input: React.FC<InputProps> = ({
   xsOffset = null,
   loading = false,
   col,
   sizeCols = { xs: 12, sm: 12, md: col }, // 97% Altura máxima del formulario
   idName,
   label,
   placeholder,
   helperText,
   hidden = false,
   disabled,
   color,
   mask,
   maskChar = "_",
   mb = 0,
   type = "text",
   textStyleCase = null,
   variant,
   // styleInput = "classic", // Estilo del input
   startAdornmentContent,
   endAdornmentContent,
   size = "medium",
   className = "",
   sx,
   characterLimit = 0,
   onChangeExtra = null,
   onChange,
   focus = false,
   required,
   changePassword = false,
   setChangePassword,
   maxLength,
   minLength,
   onKeyUp,
   inputRef,
   ...props
}): InputProps => {
   const formik = useFormikContext<FormikValues>();
   const inputRefFocus = useRef<HTMLInputElement>(null);
   const { values } = formik;
   const error = formik.touched[idName] && formik.errors[idName] ? formik.errors[idName].toString() : null;
   const isError = Boolean(error);
   const [showPassword, setShowPassword] = useState(false);
   const [characters, setCharacters] = useState(0);

   useEffect(() => {
      setTimeout(() => {
         if (focus && inputRefFocus.current) {
            // console.log("🚀 ~ setTimeout ~ focus:", focus);
            inputRefFocus.current.focus();
         }
      }, 500);
   }, [focus]);

   const onChangeCharacteres = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setCharacters(e.target.value.length);
   };

   useEffect(() => {
      // console.log("inputRef", inputRef);
      // console.log("isError", isError);
      // console.log("🚀 Input ~ changePassword:", changePassword);
   }, [idName, formik.values[idName], changePassword]);

   return (
      <Grid size={sizeCols} offset={{ xs: xsOffset }} hidden={hidden} mb={mb} px={{}} /* className={`pt-2 mb-[${mb}]`} */>
         {/* <InputLabelComponent /> */}
         {"password" === "password" && values.id > 0 && idName === "password" && (
            <FormGroup sx={{ ml: 1, mb: 1 }}>
               <FormControlLabel
                  control={
                     <Switch
                        title="Cambiar contraseña"
                        defaultChecked={changePassword}
                        onChange={setChangePassword}
                        size="small"
                        style={{ opacity: !changePassword ? 1 : 0.35 }}
                     />
                  }
                  label="Cambiar contraseña"
               />
            </FormGroup>
         )}
         <TextField
            ref={inputRef ? inputRef : inputRefFocus}
            id={idName}
            name={idName}
            placeholder={placeholder}
            size={size}
            className={className}
            sx={sx}
            fullWidth
            label={label}
            type={type === "password" ? (showPassword ? "text" : "password") : type}
            variant={variant}
            required={required}
            value={formik.values[idName] || ""}
            onChange={(e) => {
               formik.handleChange(e);
               if (onChangeExtra) onChangeExtra(e);
               if (onChange) onChange(e);
               if (characterLimit > 0) onChangeCharacteres(e);
            }}
            onFocus={() => {}}
            onInput={(e) => {
               textStyleCase != null ? handleInputFormik(e, formik.setFieldValue, idName, textStyleCase) : null;
               type === "tel" ? handlePhoneChange(e, formik.setFieldValue, idName) : null;
            }}
            onBlur={(e) => {
               formik.handleBlur(e);
            }}
            // multiline={true}
            rows={3}
            onKeyUp={onKeyUp}
            disabled={disabled}
            slotProps={{
               input: {
                  inputProps: { minLength: minLength, maxLength: characterLimit > 0 ? characterLimit : maxLength },
                  startAdornment: startAdornmentContent != null && <InputAdornment position="start">{startAdornmentContent}</InputAdornment>,
                  endAdornment:
                     type === "password" ? (
                        <InputAdornment position="start">
                           <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => {
                                 setShowPassword(!showPassword);
                              }}
                              edge="end"
                           >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                           </IconButton>
                        </InputAdornment>
                     ) : (
                        <>
                           {endAdornmentContent != null && <InputAdornment position="end">{endAdornmentContent}</InputAdornment>}
                           {loading && (
                              <InputAdornment position="end">
                                 <CircularProgress color="primary" size={size == "medium" ? 35 : 25} />
                              </InputAdornment>
                           )}
                        </>
                     )
               }
            }}
            error={isError}
            helperText={
               <span className="flex justify-between">
                  <span>{isError ? error : helperText}</span>
                  <span>
                     {characterLimit > 0 && (
                        <span className={`label-text-alt text-gray-400 mb-0`}>
                           max. {characters}/{characterLimit}
                        </span>
                     )}
                  </span>
               </span>
            }
            {...props}
         />

         {/* {loading && <span className={`absolute right-3 top-[38%] loading loading-spinner text-primary`}></span>} */}

         {/* <label className={`form-control w-full relative mb-2`}>
            <div className={`label py-0 pb-0.5`}>
               <span className={`label-text font-bold text-${color} ${isError && "text-error"}`}>{styleInput.includes("inside") ? "" : label}</span>
               <span className={`label-text-alt ${isError ? "text-error" : "text-gray-400"}`}>{required ? "Requerido" : "Opcional"}</span>
            </div>
            {styleInput.includes("inside") ? (
               <label className="flex items-center gap-2 input input-bordered">
                  {styleInput.includes("start") && (
                     <Typography className="pr-2 font-bold">{styleInput.includes("icon") ? startAdornmentContent : `${label}`}</Typography>
                  )}
                  <input
                     ref={inputRef ? inputRef : inputRefFocus}
                     // ref={inputRef}
                     id={idName}
                     name={idName}
                     placeholder={placeholder}
                     type={type === "password" ? (showPassword ? "text" : "password") : type}
                     className={`text-base-content dark:bg-slate-500 ${
                        ["start-inside", "end-inside", "icon-start-inside", "icon-end-inside"].includes(styleInput)
                           ? "grow"
                           : `input input-bordered input-${size} input-${color} ${isError && "input-error"} w-full`
                     } ${styleInput === "floating" ? "pt-5" : ""} input-${size} ${type === "password" && "pr-10"} ${className}`}
                     value={formik.values[idName] || ""}
                     onChange={(e) => {
                        formik.handleChange(e);
                        if (onChangeExtra) onChangeExtra(e);
                        if (onChange) onChange(e);
                     }}
                     onFocus={() => {
                        if (styleInput === "floating") {
                           const labelElement = document.querySelector(".label-text");
                           labelElement?.classList.add("transform", "-translate-y-4", "scale-75");
                        }
                     }}
                     onInput={(e) => {
                        textStyleCase != null ? handleInputFormik(e, formik.setFieldValue, idName, textStyleCase) : null;
                        type === "tel" ? handlePhoneChange(e, formik.setFieldValue, idName) : null;
                     }}
                     onBlur={(e) => {
                        formik.handleBlur(e);
                        if (styleInput === "floating" && !formik.values[idName]) {
                           const labelElement = document.querySelector(".label-text");
                           labelElement?.classList.remove("transform", "-translate-y-4", "scale-75");
                        }
                     }}
                     maxLength={characterLimit > 0 ? characterLimit : maxLength}
                     minLength={minLength}
                     onKeyUp={onKeyUp}
                     disabled={disabled}
                     // formNoValidate={true}
                     // {...props}
                  />
                  {styleInput.includes("end") && <Typography className="pl-5 font-bold">{styleInput.includes("icon") ? endAdornmentContent : `${label}`}</Typography>}
               </label>
            ) : (
               <input
                  ref={inputRef ? inputRef : inputRefFocus}
                  // ref={inputRef}
                  id={idName}
                  name={idName}
                  placeholder={placeholder}
                  type={type === "password" ? (showPassword ? "text" : "password") : type}
                  className={`text-base-content dark:bg-slate-500 ${
                     ["start-inside", "end-inside"].includes(styleInput)
                        ? "grow"
                        : `input input-bordered input-${size} input-${color} ${isError && "input-error"} w-full`
                  } ${styleInput === "floating" ? "pt-5" : ""} input-${size} ${type === "password" && "pr-10"} ${className}`}
                  value={formik.values[idName] || ""}
                  onChange={(e) => {
                     formik.handleChange(e);
                     if (onChangeExtra) onChangeExtra(e);
                     if (onChange) onChange(e);
                  }}
                  onFocus={() => {
                     if (styleInput === "floating") {
                        const labelElement = document.querySelector(".label-text");
                        labelElement?.classList.add("transform", "-translate-y-4", "scale-75");
                     }
                  }}
                  onInput={(e) => {
                     textStyleCase != null ? handleInputFormik(e, formik.setFieldValue, idName, textStyleCase) : null;
                     type === "tel" ? handlePhoneChange(e, formik.setFieldValue, idName) : null;
                  }}
                  onBlur={(e) => {
                     formik.handleBlur(e);
                     if (styleInput === "floating" && !formik.values[idName]) {
                        const labelElement = document.querySelector(".label-text");
                        labelElement?.classList.remove("transform", "-translate-y-4", "scale-75");
                     }
                  }}
                  maxLength={characterLimit > 0 ? characterLimit : maxLength}
                  minLength={minLength}
                  onKeyUp={onKeyUp}
                  disabled={disabled}
                  // formNoValidate={true}
                  // {...props}
               />
            )}

            {type === "password" && (
               <span
                  className={`absolute right-3 ${
                     idName === "confirmPassword" ? "top-[35%]" : "top-[35%]"
                  }  active:scale-75 cursor-pointer transition-all duration-100`}
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  onClick={() => {
                     setShowPassword(!showPassword);
                  }}
               >
                  {showPassword ? <VisibilityRounded className="text-base-content" /> : <VisibilityOffRounded className="text-base-content" />}
               </span>
            )}
            {loading && <span className={`absolute right-3 top-[38%] loading loading-spinner text-primary`}></span>}
            <div className={`label`}>
               <span className={`label-text-alt ${!isError && !helperText && "text-transparent"} ${isError && "text-error"}`}>
                  {isError ? error : helperText ? helperText : "."}
               </span>
               {characterLimit > 0 && <span className={`label-text-alt text-gray-400 mb-0`}>0/{characterLimit}</span>}
            </div>
         </label> */}
      </Grid>
   );
};
export default Input;
//#endregion INPUT
