import { Formik, FormikHelpers, FormikState, FormikValues } from "formik";
import * as Yup from "yup";
import React, { useEffect, forwardRef, ReactNode, Ref } from "react";
import { Grid, Button } from "@mui/material";

//#region FORMIK COMPONENT
// =================== INTERFACES =======================
interface Values {
   username: string;
   email: string;
   password: string;
   confirmPassword: string;
}
interface FormikFormProps {
   initialValues: FormikValues; // Valores iniciales del formulario
   validationSchema: Yup.ObjectSchema<any>; // Esquema de validación usando Yup
   onSubmit: (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>) => void; // Función de envío del formulario
   children: ReactNode; // Contenido del formulario (campos e ítems)
   textBtnSubmit: string; // Texto del botón de envío
   formikRef?: any; //Ref<any>; // Referencia al formulario
   handleCancel?: (resetForm: () => void) => void; // Función de cancelación
   showActionButtons?: boolean | true | false; // Mostrar o no los botones de acción
   showCancelButton?: boolean | true | false; // Mostrar o no el botón de cancelar
   activeStep?: number | null; // Paso activo, si es un formulario con múltiples pasos
   setStepFailed?: ((step: number) => void) | null; // Función para establecer el paso como fallido
   alignContent?: "center" | "space-between" | "start" | "end" | "space-around";
   alignItems?: "center" | "start" | "end" | "flex-start" | "flex-end" | "baseline";
   maxHeight?: string; // Altura máxima del formulario
   col?: number; // Altura máxima del formulario
   sizeCols?: { xs: number; sm: number; md: number }; // Ancho máxima del formulario
   spacing?: number;
   btnSize?: "small" | "medium" | "large"; // Altura máxima del formulario
   className?: string; // Clases adicionales para estilos
   inContainer?: true | false; // Permite saber si el formulario esta dentro de un contenedor y ajustar la altura
}
// =================== COMPONENTE =======================
/**
 * FormikForm es un componente reutilizable basado en Formik, que permite crear formularios dinámicos y personalizables.
 *
 * @param {object} initialValues - Valores iniciales del formulario.
 * @param {object} validationSchema - Esquema de validación de Yup para el formulario.
 * @param {function} onSubmit - Función que se ejecuta al enviar el formulario.
 * @param {ReactNode} children - Contenido del formulario (campos e ítems de formulario).
 * @param {string} textBtnSubmit - Texto que aparecerá en el botón de enviar.
 * @param {object} formikRef - Referencia al formulario para acceder a sus métodos.
 * @param {function} handleCancel - Función que se ejecuta al cancelar el formulario.
 * @param {true | false} showActionButtons - Si se muestran los botones de acción (enviar y cancelar).
 * @param {true | false} showCancelButton - Si se muestra el botón de cancelar.
 * @param {number | null} activeStep - Paso activo en un formulario con múltiples pasos (opcional).
 * @param {function | null} setStepFailed - Función para establecer si un paso ha fallado (opcional).
 * @param {string} alignContent - Orientación vertical del contenedor del formulario.
 * @param {string} alignItems - Orientación horizontal del contenedor del formulario.
 * @param {string} maxHeight - Altura máxima del contenedor del formulario.
 * @param {string} className - Clases CSS adicionales para personalizar el estilo del formulario.
 * @param {true | false} inContainer - Clases CSS adicionales para personalizar el estilo del formulario.
 * @param {Ref} ref - Permite saber si el formulario esta dentro de un contenedor y ajustar la altura.
 *
 * @returns {JSX.Element} Formulario basado en Formik con gestión de pasos y botones de acción.
 */
const FormikForm = forwardRef<any, FormikFormProps>(
   (
      {
         initialValues = {}, // Valores iniciales por defecto
         validationSchema = {}, // Esquema de validación
         onSubmit, // Función que se ejecuta al enviar el formulario
         children, // Contenido del formulario
         textBtnSubmit, // Texto del botón de envío
         formikRef, // Referencia del formulario
         handleCancel, // Función de cancelación del formulario
         showActionButtons = true, // Mostrar los botones de acción
         showCancelButton = true, // Mostrar el botón de cancelar
         activeStep = null, // Paso activo
         setStepFailed = null, // Función para marcar un paso como fallido
         alignContent = "space-between",
         alignItems = "center",
         maxHeight = "100%", // 97% Altura máxima del formulario
         col = 12, // 97% Altura máxima del formulario
         sizeCols = { xs: 12, sm: 12, md: col }, // 97% Altura máxima del formulario
         spacing = 2,
         btnSize = "large", // 97% Altura máxima del formulario
         className, // Clases adicionales
         inContainer = true
      },
      ref
   ) => {
      // useEffect(() => {
      //    // Código opcional para inicialización
      //    console.log("formikRef", formikRef);
      // }, []);

      const onBlur = () => {
         if (activeStep && setStepFailed) {
            if (Object.keys(formikRef?.current.errors).length > 0) setStepFailed(activeStep);
            else setStepFailed(-1);
         }
      };

      const onChange = () => {
         if (activeStep && setStepFailed) {
            if (Object.keys(formikRef?.current.errors).length > 0) setStepFailed(activeStep);
            else setStepFailed(-1);
         }
      };

      const onReset = (resetForm: { (nextState?: Partial<FormikState<FormikValues>> | undefined): void; (): void }) => {
         resetForm();
         formikRef?.current.setValues(formikRef?.current.initialValues);
         handleCancel && handleCancel(resetForm);
         // console.log("🚀 ~ onReset ~ formikRef?.current:", formikRef?.current);
      };

      return (
         <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} innerRef={formikRef == null ? ref : formikRef}>
            {({ handleSubmit, isSubmitting, resetForm }) => (
               <form
                  noValidate
                  className={`grid ${inContainer && "h-full"} my-3 ${className} w-full`}
                  onSubmit={handleSubmit}
                  onBlur={onBlur}
                  onChangeCapture={onChange}
                  style={{ alignContent: alignContent }}
               >
                  {!showActionButtons ? (
                     <Grid
                        container
                        spacing={spacing}
                        size={sizeCols}
                        height={maxHeight}
                        maxHeight={maxHeight}
                        alignContent={"flex-start"}
                        alignItems={alignItems}
                        p={1}
                     >
                        {children}
                     </Grid>
                  ) : (
                     <>
                        <Grid
                           container
                           spacing={spacing}
                           size={sizeCols}
                           height={maxHeight}
                           maxHeight={maxHeight}
                           overflow={"auto"}
                           alignContent={"flex-start"}
                           alignItems={alignItems}
                           className={className}
                           p={1}
                        >
                           {children}
                        </Grid>
                        <Grid container spacing={2} p={1} mt={2} size={sizeCols}>
                           <Button type="submit" color="primary" disabled={isSubmitting} loading={isSubmitting} variant="contained" fullWidth size={btnSize}>
                              {textBtnSubmit}
                           </Button>
                           {showCancelButton && (
                              <Button
                                 type="reset"
                                 variant="outlined"
                                 color="error"
                                 fullWidth
                                 size={btnSize}
                                 onClick={() => {
                                    onReset(resetForm);
                                 }}
                              >
                                 CANCELAR
                              </Button>
                           )}
                        </Grid>
                     </>
                  )}
               </form>
            )}
         </Formik>
      );
   }
);

export default FormikForm;

//#endregion FORMIK COMPONENT
