"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Card, CardContent, Typography, Button, Alert } from "@mui/material";
import {
   Login,
   HowToReg,
   Send,
   AccountCircle,
   Email,
   Lock,
   Security,
   Dashboard,
   Analytics,
   WorkspacesRounded,
   ArrowBack,
   EditNoteRounded,
   QueryStatsRounded,
   VerifiedUserRounded
} from "@mui/icons-material";
import { useGlobalContext } from "../../context/GlobalContext";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import * as Yup from "yup";
import FormikForm, { Input } from "../../components/forms";
import Toast from "../../utils/Toast";
import { env, images } from "../../constant";

export default function LoginForms() {
   const navigate = useNavigate();
   const formikRef = useRef(null);
   const { setIsLoading } = useGlobalContext();
   const { auth, setAuth, login, signup } = useAuthContext();

   const [formState, setFormState] = useState("login");
   const [formSubmitted, setFormSubmitted] = useState(false);
   const [resetEmailSent, setResetEmailSent] = useState(false);
   const [isHovered, setIsHovered] = useState(false);
   const [direction, setDirection] = useState(0);

   // Features para el lado izquierdo
   const features = [
      {
         icon: <Dashboard sx={{ fontSize: 32 }} />,
         text: "Dashboard Intuitivo",
         description: "Interfaz limpia y fácil de usar",
         delay: 0
      },
      {
         icon: <Analytics sx={{ fontSize: 32 }} />,
         text: "Analíticas en Tiempo Real",
         description: "Métricas actualizadas al instante",
         delay: 0.2
      },
      {
         icon: <WorkspacesRounded sx={{ fontSize: 32 }} />,
         text: "Gestión de Equipos",
         description: "Colaboración eficiente",
         delay: 0.4
      },
      {
         icon: <Security sx={{ fontSize: 32 }} />,
         text: "Seguridad Enterprise",
         description: "Protección de nivel empresarial",
         delay: 0.6
      }
   ];

   // Configuración de formulario
   const formData = [
      {
         name: "username",
         value: "",
         validations: Yup.string().trim().required("El usuario es requerido"),
         validationPage: ["login", "register"]
      },
      {
         name: "email",
         value: "",
         validations: Yup.string().trim().email("Formato de correo inválido").required("El correo es requerido"),
         validationPage: ["register", "forgot-password"]
      },
      {
         name: "password",
         value: "",
         validations: Yup.string().trim().min(6, "Mínimo 6 caracteres").required("La contraseña es requerida"),
         validationPage: ["login", "register"]
      },
      {
         name: "password_confirm",
         value: "",
         validations: Yup.string()
            .trim()
            .min(6, "Mínimo 6 caracteres")
            .required("Confirma tu contraseña")
            .test("confirmPassword", "Las contraseñas no coinciden", (value) => value === formikRef.current?.values.password),
         validationPage: ["register"]
      }
   ];

   const initialValues = {};
   formData.forEach((field) => {
      initialValues[field.name] = field.value;
   });

   const validationSchema = (page) => {
      const formDataPerPage = formData.filter((item) => item.validationPage.includes(page));
      const validationsPerPage = {};
      formDataPerPage.forEach((field) => {
         validationsPerPage[field.name] = field.validations;
      });
      return Yup.object().shape(validationsPerPage);
   };

   const onSubmit = async (values, { setSubmitting }) => {
      setIsLoading(true);
      setFormSubmitted(true);

      let res;
      if (formState === "login") {
         res = await login(values);
      } else if (formState === "register") {
         res = await signup(values);
      } else {
         setResetEmailSent(true);
         setTimeout(() => {
            setResetEmailSent(false);
            setFormState("login");
         }, 3000);
      }

      if (!res) {
         setIsLoading(false);
         setFormSubmitted(false);
         return;
      }

      if (res.errors) {
         setIsLoading(false);
         setFormSubmitted(false);
         Object.values(res.errors).forEach((errors) => {
            errors.map((error) => Toast.Warning(error));
         });
         return;
      } else if (res.status_code !== 200) {
         setIsLoading(false);
         setFormSubmitted(false);
         return Toast.Customizable(res.alert_text, res.alert_icon);
      }

      if (res.alert_text) Toast.Success(res.alert_text);

      setSubmitting(false);
      setIsLoading(false);
      setFormSubmitted(false);

      console.log("🚀 ~ onSubmit ~ res.data.resutl:", res?.result?.auth?.page_index);
      console.log("a ver el auth jsoin", JSON.parse(localStorage.getItem("auth"))?.page_index);

      if (formState === "login") console.log("vamos a :", JSON.parse(localStorage.getItem("auth"))?.page_index);
      // setTimeout(() => {
      //    navigate(JSON.parse(localStorage.getItem("auth"))?.page_index ?? "/app");
      // }, 500);
      else handleFormChange("login");
   };

   const handleFormChange = (newState) => {
      const stateOrder = ["login", "register", "forgot-password"];
      const currentIndex = stateOrder.indexOf(formState);
      const newIndex = stateOrder.indexOf(newState);
      setDirection(newIndex > currentIndex ? 1 : -1);
      setFormState(newState);
   };

   useLayoutEffect(() => {
      setIsLoading(false);
   }, []);

   return (
      <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
         {/* Partículas animadas de fondo - De la Opción 2 */}
         <div className="absolute inset-0">
            {[...Array(25)].map((_, i) => (
               <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                  style={{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`
                  }}
                  animate={{
                     y: [0, -150, 0],
                     opacity: [0, 0.8, 0],
                     scale: [0, 1, 0]
                  }}
                  transition={{
                     duration: 4 + Math.random() * 3,
                     repeat: Infinity,
                     delay: Math.random() * 5
                  }}
               />
            ))}
            {/* Partículas más grandes */}
            {[...Array(8)].map((_, i) => (
               <motion.div
                  key={`large-${i}`}
                  className="absolute w-3 h-3 bg-purple-500 rounded-full opacity-30"
                  style={{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`
                  }}
                  animate={{
                     y: [0, -80, 0],
                     x: [0, 20, 0]
                  }}
                  transition={{
                     duration: 6 + Math.random() * 4,
                     repeat: Infinity,
                     delay: Math.random() * 3
                  }}
               />
            ))}
         </div>

         {/* Lado Izquierdo - Específico para Distribución de Chips */}
         <motion.div
            className="hidden lg:flex flex-1 relative overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
         >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-indigo-800/90" />

            {/* Efectos de luz */}
            <div className="absolute top-1/4 -left-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col justify-center px-16 text-white">
               <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="mb-12">
                  <Typography variant="h2" fontWeight="800" className="mb-4 leading-tight">
                     Sistema de Gestión
                     <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">CellStop</span>
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300, lineHeight: 1.6 }}>
                     Plataforma especializada en la gestión y distribución inteligente de chips telefónicos con control total del inventario en tiempo real.
                  </Typography>
               </motion.div>

               <div className="space-y-8">
                  {[
                     {
                        icon: <Dashboard sx={{ fontSize: 32 }} />,
                        text: "Dashboard de Distribución",
                        description: "Monitoreo en tiempo real de productos y ventas",
                        delay: 0
                     },
                     {
                        icon: <Analytics sx={{ fontSize: 32 }} />,
                        text: "Control de Inventario",
                        description: "Gestión de chips pre-activados, asignados y distribuidos",
                        delay: 0.2
                     },
                     {
                        icon: <WorkspacesRounded sx={{ fontSize: 32 }} />,
                        text: "Reportes Avanzados",
                        description: "Analíticas detalladas y exportación de datos",
                        delay: 0.4
                     },
                     {
                        icon: <Security sx={{ fontSize: 32 }} />,
                        text: "Seguimiento Seguro",
                        description: "Trazabilidad completa de cada chip",
                        delay: 0.6
                     }
                  ].map((feature, index) => (
                     <motion.div
                        key={index}
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: feature.delay + 0.5, duration: 0.6 }}
                        className="flex items-start gap-6 group cursor-pointer"
                     >
                        <motion.div
                           whileHover={{ scale: 1.1, rotate: 5 }}
                           className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all duration-300"
                        >
                           {feature.icon}
                        </motion.div>
                        <div>
                           <Typography variant="h6" fontWeight="600" className="mb-1">
                              {feature.text}
                           </Typography>
                           <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              {feature.description}
                           </Typography>
                        </div>
                     </motion.div>
                  ))}
               </div>

               {/* Stats específicos del sistema de distribución */}
               <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20"
               >
                  <div className="text-center">
                     <Typography variant="h3" fontWeight="800" className="text-cyan-300">
                        <EditNoteRounded sx={{ fontSize: 60 }} />
                        <br /> Ingresa
                     </Typography>
                  </div>
                  <div className="text-center">
                     <Typography variant="h3" fontWeight="800" className="text-purple-300">
                        <QueryStatsRounded sx={{ fontSize: 60 }} />
                        <br /> Analiza
                     </Typography>
                  </div>
                  <div className="text-center">
                     <Typography variant="h3" fontWeight="800" className="text-blue-300">
                        <VerifiedUserRounded sx={{ fontSize: 60 }} />
                        <br /> Decide
                     </Typography>
                  </div>
               </motion.div>

               {/* Información adicional del sistema */}
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10"
               >
                  <Typography variant="body2" sx={{ opacity: 0.9, fontStyle: "italic" }} className="text-center">
                     💡 <strong>Tip del sistema:</strong> Usa el reporteador avanzado para generar análisis personalizados de distribución y ventas en tiempo real.
                  </Typography>
               </motion.div>
            </div>
         </motion.div>
         {/* Lado Derecho - Formulario Flotante (Combinación) */}
         <motion.div
            className="flex-1 flex items-center justify-center p-4 lg:p-8 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
         >
            <motion.div className="w-full max-w-md relative z-10" onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
               {/* Card Flotante con Glass Effect */}
               <Card
                  sx={{
                     borderRadius: 4,
                     overflow: "hidden",
                     background: "rgba(255, 255, 255, 0.1)",
                     backdropFilter: "blur(20px)",
                     border: "1px solid rgba(255, 255, 255, 0.2)",
                     boxShadow: isHovered ? "0 35px 60px -12px rgba(0, 0, 0, 0.5)" : "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                     transition: "all 0.4s ease",
                     position: "relative"
                  }}
               >
                  {/* Barra superior con gradiente animado */}
                  <Box
                     sx={{
                        height: 4,
                        background: "linear-gradient(90deg, #22d3ee, #3b82f6, #8b5cf6, #ec4899)",
                        backgroundSize: "300% 100%",
                        animation: "gradientShift 3s ease infinite",
                        "@keyframes gradientShift": {
                           "0%": { backgroundPosition: "0% 50%" },
                           "50%": { backgroundPosition: "100% 50%" },
                           "100%": { backgroundPosition: "0% 50%" }
                        }
                     }}
                  />

                  <CardContent sx={{ p: 5 }}>
                     {resetEmailSent && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                           <Alert
                              severity="success"
                              sx={{
                                 borderRadius: 3,
                                 bgcolor: "rgba(34, 197, 94, 0.2)",
                                 color: "white",
                                 border: "1px solid rgba(34, 197, 94, 0.3)",
                                 backdropFilter: "blur(10px)"
                              }}
                           >
                              ¡Correo enviado! Revisa tu bandeja de entrada.
                           </Alert>
                        </motion.div>
                     )}

                     <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                           key={formState}
                           custom={direction}
                           initial={{ opacity: 0, x: direction * 30 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: direction * -30 }}
                           transition={{ duration: 0.3 }}
                           className="space-y-6"
                        >
                           {/* Header del Formulario */}
                           <div className="text-center space-y-4">
                              {formState === "forgot-password" && (
                                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start mb-2">
                                    <Button
                                       startIcon={<ArrowBack />}
                                       onClick={() => handleFormChange("login")}
                                       sx={{
                                          color: "rgba(255,255,255,0.8)",
                                          p: 0,
                                          fontSize: "0.875rem",
                                          textTransform: "none",
                                          "&:hover": {
                                             bgcolor: "transparent",
                                             color: "white"
                                          }
                                       }}
                                    >
                                       Volver al inicio
                                    </Button>
                                 </motion.div>
                              )}

                              <motion.div
                                 initial={{ scale: 0 }}
                                 animate={{ scale: 1 }}
                                 transition={{ type: "spring", stiffness: 200 }}
                                 className="w-45 h-45 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                              >
                                 {/* <Security sx={{ fontSize: 32, color: "white" }} /> */}
                                 <img src={images.icon} className="object-contain h-20 self-center" />
                              </motion.div>

                              <Typography variant="h4" component="h1" fontWeight="700" color="white" sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" } }}>
                                 {formState === "login" ? "Bienvenido" : formState === "register" ? "Crear Cuenta" : "Recuperar Acceso"}
                              </Typography>

                              <Typography
                                 variant="body1"
                                 sx={{
                                    color: "rgba(255,255,255,0.7)",
                                    fontSize: "0.95rem",
                                    lineHeight: 1.5
                                 }}
                              >
                                 {formState === "login"
                                    ? "Ingresa a tu espacio seguro y personalizado"
                                    : formState === "register"
                                      ? "Comienza tu journey con nosotros hoy"
                                      : "Te enviaremos instrucciones para recuperar tu cuenta"}
                              </Typography>
                           </div>

                           {/* Formulario */}
                           <FormikForm
                              key={`formik-${formState}`}
                              initialValues={initialValues}
                              validationSchema={validationSchema(formState)}
                              onSubmit={onSubmit}
                              showActionButtons={false}
                              formikRef={formikRef}
                              handleCancel={null}
                              spacing={3}
                           >
                              {/* <div className="space-y-5"> */}
                              {formState === "forgot-password" ? (
                                 <Input
                                    idName="email"
                                    label="Correo electrónico"
                                    type="email"
                                    startAdornmentContent={<Email sx={{ color: "rgba(255,255,255,0.7)" }} />}
                                    sx={{
                                       input: { color: "white" },
                                       label: { color: "rgba(255,255,255,0.7)" },
                                       "& .MuiOutlinedInput-root": {
                                          bgcolor: "rgba(255,255,255,0.1)",
                                          border: "1px solid rgba(255,255,255,0.2)",
                                          borderRadius: 2,
                                          color: "white",
                                          "&:hover": {
                                             fontWeight: "bolder",
                                             // bgcolor: "rgba(255,255,255,0.15)",
                                             border: "5px solid rgba(255,255,255,0.3)"
                                          },
                                          "&.Mui-focused": {
                                             fontWeight: "bolder",
                                             // bgcolor: "rgba(255,255,255,0.2)",
                                             border: "2px solid rgba(59, 130, 246, 0.5)"
                                          }
                                       }
                                    }}
                                    focus={true}
                                    required
                                 />
                              ) : (
                                 <>
                                    <Input
                                       idName="username"
                                       label="Usuario o correo"
                                       type="text"
                                       startAdornmentContent={<AccountCircle sx={{ color: "rgba(255,255,255,0.7)" }} />}
                                       sx={{
                                          input: { color: "white" },
                                          label: { color: "rgba(255,255,255,0.7)" },
                                          "& .MuiOutlinedInput-root": {
                                             bgcolor: "rgba(255,255,255,0.1)",
                                             border: "1px solid rgba(255,255,255,0.2)",
                                             borderRadius: 2,
                                             color: "white",
                                             "&:hover": {
                                                bgcolor: "rgba(255,255,255,0.15)",
                                                border: "1px solid rgba(255,255,255,0.3)"
                                             }
                                          }
                                       }}
                                       required
                                    />

                                    {formState === "register" && (
                                       <Input
                                          idName="email"
                                          label="Correo electrónico"
                                          type="email"
                                          startAdornmentContent={<Email sx={{ color: "rgba(255,255,255,0.7)" }} />}
                                          sx={{
                                             input: { color: "white" },
                                             label: { color: "rgba(255,255,255,0.7)" },
                                             "& .MuiOutlinedInput-root": {
                                                bgcolor: "rgba(255,255,255,0.1)",
                                                border: "1px solid rgba(255,255,255,0.2)",
                                                borderRadius: 2,
                                                color: "white"
                                             }
                                          }}
                                          required
                                       />
                                    )}

                                    <Input
                                       idName="password"
                                       label="Contraseña"
                                       type="password"
                                       startAdornmentContent={<Lock sx={{ color: "rgba(255,255,255,0.7)" }} />}
                                       sx={{
                                          input: { color: "white" },
                                          label: { color: "rgba(255,255,255,0.7)" },
                                          "& .MuiOutlinedInput-root": {
                                             bgcolor: "rgba(255,255,255,0.1)",
                                             border: "1px solid rgba(255,255,255,0.2)",
                                             borderRadius: 2,
                                             color: "white"
                                          }
                                       }}
                                       required
                                    />

                                    {formState === "register" && (
                                       <Input
                                          idName="password_confirm"
                                          label="Confirmar contraseña"
                                          type="password"
                                          startAdornmentContent={<Lock sx={{ color: "rgba(255,255,255,0.7)" }} />}
                                          sx={{
                                             input: { color: "white" },
                                             label: { color: "rgba(255,255,255,0.7)" },
                                             "& .MuiOutlinedInput-root": {
                                                bgcolor: "rgba(255,255,255,0.1)",
                                                border: "1px solid rgba(255,255,255,0.2)",
                                                borderRadius: 2,
                                                color: "white"
                                             }
                                          }}
                                          required
                                       />
                                    )}
                                 </>
                              )}

                              {formState === "login" && (
                                 <div className="text-right">
                                    <Button
                                       variant="text"
                                       onClick={() => handleFormChange("forgot-password")}
                                       sx={{
                                          p: 0,
                                          fontSize: "0.875rem",
                                          color: "rgba(255,255,255,0.8)",
                                          textTransform: "none",
                                          "&:hover": {
                                             bgcolor: "transparent",
                                             color: "white",
                                             textDecoration: "underline"
                                          }
                                       }}
                                    >
                                       ¿Olvidaste tu contraseña?
                                    </Button>
                                 </div>
                              )}

                              <motion.div
                                 style={{ width: "100%" }}
                                 whileHover={{ scale: 1.02 }}
                                 whileTap={{ scale: 0.98 }}
                                 transition={{ type: "spring", stiffness: 400 }}
                              >
                                 <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={formSubmitted}
                                    startIcon={formState === "login" ? <Login /> : formState === "register" ? <HowToReg /> : <Send />}
                                    sx={{
                                       py: 1.8,
                                       borderRadius: 3,
                                       fontSize: "1rem",
                                       fontWeight: 600,
                                       textTransform: "none",
                                       background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #8b5cf6 100%)",
                                       backgroundSize: "200% 100%",
                                       boxShadow: "0 8px 25px rgba(34, 211, 238, 0.3)",
                                       position: "relative",
                                       overflow: "hidden",
                                       "&:hover": {
                                          background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #8b5cf6 100%)",
                                          backgroundPosition: "100% 0%",
                                          boxShadow: "0 12px 35px rgba(34, 211, 238, 0.5)",
                                          transform: "translateY(-2px)"
                                       },
                                       "&:disabled": {
                                          background: "rgba(255,255,255,0.1)",
                                          color: "rgba(255,255,255,0.5)",
                                          transform: "none"
                                       }
                                    }}
                                 >
                                    {formSubmitted ? (
                                       <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                          ⏳
                                       </motion.span>
                                    ) : formState === "login" ? (
                                       "Acceder al Sistema"
                                    ) : formState === "register" ? (
                                       "Crear Mi Cuenta"
                                    ) : (
                                       "Enviar Instrucciones"
                                    )}
                                 </Button>
                              </motion.div>
                              {/* </div> */}
                           </FormikForm>

                           {/* Navegación entre formularios */}
                           {formState !== "forgot-password" && (
                              <motion.div
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: 1 }}
                                 transition={{ delay: 0.3 }}
                                 className="text-center pt-4 border-t border-white/10"
                              >
                                 <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }} component="span">
                                    {formState === "login" ? "¿Primera vez en la plataforma? " : "¿Ya tienes una cuenta? "}
                                 </Typography>
                                 <Button
                                    variant="text"
                                    onClick={() => handleFormChange(formState === "login" ? "register" : "login")}
                                    sx={{
                                       p: 0,
                                       fontSize: "0.875rem",
                                       fontWeight: 600,
                                       color: "white",
                                       textTransform: "none",
                                       "&:hover": {
                                          bgcolor: "transparent",
                                          textDecoration: "underline"
                                       }
                                    }}
                                 >
                                    {formState === "login" ? "Crear cuenta" : "Iniciar sesión"}
                                 </Button>
                              </motion.div>
                           )}
                        </motion.div>
                     </AnimatePresence>
                  </CardContent>
               </Card>

               {/* Footer */}
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="text-center mt-8">
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                     © 2025 Sistema CellStop • {env.VERSION} • Sistema de autenticación segura
                  </Typography>
               </motion.div>
            </motion.div>
         </motion.div>
      </div>
   );
}
