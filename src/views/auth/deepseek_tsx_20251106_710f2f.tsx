"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Card, CardContent, Typography, Button, Alert } from "@mui/material";
import {
   ArrowBack,
   Login,
   HowToReg,
   Send,
   AccountCircle,
   Email,
   Lock,
   Visibility,
   VisibilityOff
} from "@mui/icons-material";
import { useGlobalContext } from "../../context/GlobalContext";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import images from "../../constant/images";

import * as Yup from "yup";
import FormikForm, { Input } from "../../components/forms";
import Toast from "../../utils/Toast";

export default function LoginForms() {
   const navigate = useNavigate();
   const formikRef = useRef(null);
   const { setIsLoading } = useGlobalContext();
   const { setAuth, login, signup } = useAuthContext();
   
   const [formState, setFormState] = useState("login");
   const [showPassword, setShowPassword] = useState(false);
   const [formSubmitted, setFormSubmitted] = useState(false);
   const [resetEmailSent, setResetEmailSent] = useState(false);
   const [direction, setDirection] = useState(0);

   // Animaciones mejoradas
   const slideVariants = {
      enter: (direction) => ({
         x: direction > 0 ? 50 : -50,
         opacity: 0,
         scale: 0.95
      }),
      center: {
         x: 0,
         opacity: 1,
         scale: 1,
         transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
         }
      },
      exit: (direction) => ({
         x: direction < 0 ? 50 : -50,
         opacity: 0,
         scale: 0.95,
         transition: {
            duration: 0.2
         }
      })
   };

   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1
         }
      }
   };

   const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
         y: 0,
         opacity: 1,
         transition: {
            type: "spring",
            stiffness: 100
         }
      }
   };

   const handleFormChange = (newState) => {
      const stateOrder = ["login", "register", "forgot-password"];
      const currentIndex = stateOrder.indexOf(formState);
      const newIndex = stateOrder.indexOf(newState);
      setDirection(newIndex > currentIndex ? 1 : -1);
      setFormState(newState);
   };

   const getFormTitle = () => {
      switch (formState) {
         case "login":
            return "Bienvenido de vuelta";
         case "register":
            return "Crear cuenta";
         case "forgot-password":
            return "Recuperar acceso";
         default:
            return "";
      }
   };

   const getFormSubtitle = () => {
      switch (formState) {
         case "login":
            return "Ingresa a tu cuenta para continuar";
         case "register":
            return "Completa tus datos para comenzar";
         case "forgot-password":
            return "Te enviaremos instrucciones para restablecer tu contraseña";
         default:
            return "";
      }
   };

   const formData = [
      {
         name: "username",
         value: "",
         input: <Input idName={"username"} label={"Usuario o correo"} required />,
         validations: Yup.string().trim().required("El usuario es requerido"),
         validationPage: ["login", "register"]
      },
      {
         name: "email",
         value: "",
         input: <Input idName={"email"} label={"Correo electrónico"} type="email" required />,
         validations: Yup.string().trim().email("Formato de correo inválido").required("El correo es requerido"),
         validationPage: ["register", "forgot-password"]
      },
      {
         name: "password",
         value: "",
         input: <Input idName={"password"} label={"Contraseña"} type="password" required />,
         validations: Yup.string().trim().min(6, "Mínimo 6 caracteres").required("La contraseña es requerida"),
         validationPage: ["login", "register"]
      },
      {
         name: "password_confirm",
         value: "",
         input: <Input idName={"password_confirm"} label={"Confirmar contraseña"} type="password" required />,
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
      
      if (formState === "login") navigate("/app");
      else handleFormChange("login");
   };

   useLayoutEffect(() => {
      setIsLoading(false);
   }, []);

   return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
         >
            {/* Logo */}
            <motion.div
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="flex justify-center mb-8"
            >
               <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <img 
                     src={images.icon} 
                     className="h-12 w-auto object-contain"
                     alt="Logo"
                  />
               </div>
            </motion.div>

            {/* Card Principal */}
            <Card
               sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  position: "relative"
               }}
            >
               {/* Barra de gradiente sutil */}
               <Box
                  sx={{
                     height: 4,
                     background: "linear-gradient(90deg, #0369a1, #7c3aed, #c026d3)",
                     backgroundSize: "200% 100%",
                     animation: "gradientShift 3s ease infinite",
                     "@keyframes gradientShift": {
                        "0%": { backgroundPosition: "0% 50%" },
                        "50%": { backgroundPosition: "100% 50%" },
                        "100%": { backgroundPosition: "0% 50%" }
                     }
                  }}
               />

               <CardContent sx={{ p: 4 }}>
                  {resetEmailSent && (
                     <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6"
                     >
                        <Alert 
                           severity="success" 
                           sx={{ 
                              borderRadius: 2,
                              bgcolor: '#f0fdf4',
                              color: '#166534',
                              border: '1px solid #bbf7d0'
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
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-6"
                     >
                        {/* Header del formulario */}
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                           {formState === "forgot-password" && (
                              <motion.div variants={itemVariants} className="mb-4">
                                 <Button 
                                    startIcon={<ArrowBack />} 
                                    onClick={() => handleFormChange("login")}
                                    sx={{ 
                                       color: "text.secondary",
                                       p: 0,
                                       fontSize: '0.875rem',
                                       fontWeight: 500,
                                       '&:hover': {
                                          bgcolor: 'transparent',
                                          color: 'primary.main'
                                       }
                                    }}
                                 >
                                    Volver al login
                                 </Button>
                              </motion.div>
                           )}

                           <motion.div variants={itemVariants}>
                              <Typography 
                                 variant="h4" 
                                 component="h1" 
                                 fontWeight="600" 
                                 color="text.primary"
                                 sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}
                              >
                                 {getFormTitle()}
                              </Typography>
                           </motion.div>

                           <motion.div variants={itemVariants}>
                              <Typography 
                                 variant="body1" 
                                 color="text.secondary"
                                 sx={{ mt: 1, fontSize: '0.95rem' }}
                              >
                                 {getFormSubtitle()}
                              </Typography>
                           </motion.div>
                        </motion.div>

                        {/* Formulario */}
                        <FormikForm
                           key={`formik-${formState}`}
                           initialValues={initialValues}
                           validationSchema={validationSchema(formState)}
                           onSubmit={onSubmit}
                           showActionButtons={false}
                           formikRef={formikRef}
                           handleCancel={null}
                        >
                           <motion.div
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                              className="space-y-4"
                           >
                             {formState === "forgot-password" ? (
                                <motion.div variants={itemVariants}>
                                   <Input
                                      idName="email"
                                      label="Correo electrónico"
                                      type="email"
                                      startAdornmentContent={<Email sx={{ color: 'text.secondary' }} />}
                                      focus
                                      required
                                   />
                                </motion.div>
                             ) : (
                                <>
                                   <motion.div variants={itemVariants}>
                                      <Input
                                         idName="username"
                                         label="Usuario o correo"
                                         type="text"
                                         startAdornmentContent={<AccountCircle sx={{ color: 'text.secondary' }} />}
                                         required
                                      />
                                   </motion.div>

                                   {formState === "register" && (
                                      <motion.div variants={itemVariants}>
                                         <Input
                                            idName="email"
                                            label="Correo electrónico"
                                            type="email"
                                            startAdornmentContent={<Email sx={{ color: 'text.secondary' }} />}
                                            required
                                         />
                                      </motion.div>
                                   )}

                                   <motion.div variants={itemVariants}>
                                      <Input
                                         idName="password"
                                         label="Contraseña"
                                         type="password"
                                         startAdornmentContent={<Lock sx={{ color: 'text.secondary' }} />}
                                         focus={formState === "login"}
                                         required
                                      />
                                   </motion.div>

                                   {formState === "register" && (
                                      <motion.div variants={itemVariants}>
                                         <Input
                                            idName="password_confirm"
                                            label="Confirmar contraseña"
                                            type="password"
                                            startAdornmentContent={<Lock sx={{ color: 'text.secondary' }} />}
                                            required
                                         />
                                      </motion.div>
                                   )}
                                </>
                             )}

                             {/* Link de olvidó contraseña */}
                             {formState === "login" && (
                                <motion.div variants={itemVariants} className="text-right">
                                   <Button
                                      variant="text"
                                      onClick={() => handleFormChange("forgot-password")}
                                      sx={{
                                         p: 0,
                                         fontSize: '0.875rem',
                                         fontWeight: 500,
                                         color: 'primary.main',
                                         textTransform: 'none',
                                         '&:hover': {
                                            bgcolor: 'transparent',
                                            textDecoration: 'underline'
                                         }
                                      }}
                                   >
                                      ¿Olvidaste tu contraseña?
                                   </Button>
                                </motion.div>
                             )}

                             {/* Botón de acción principal */}
                             <motion.div variants={itemVariants}>
                                <Button
                                   type="submit"
                                   variant="contained"
                                   size="large"
                                   fullWidth
                                   disabled={formSubmitted}
                                   startIcon={
                                      formState === "login" ? <Login /> : 
                                      formState === "register" ? <HowToReg /> : 
                                      <Send />
                                   }
                                   sx={{
                                      py: 1.5,
                                      borderRadius: 2,
                                      fontSize: '1rem',
                                      fontWeight: 600,
                                      textTransform: 'none',
                                      background: 'linear-gradient(135deg, #0369a1 0%, #7c3aed 100%)',
                                      boxShadow: '0 4px 14px 0 rgba(3, 105, 161, 0.3)',
                                      '&:hover': {
                                         background: 'linear-gradient(135deg, #075985 0%, #6d28d9 100%)',
                                         boxShadow: '0 6px 20px rgba(3, 105, 161, 0.4)',
                                         transform: 'translateY(-1px)'
                                      },
                                      '&:active': {
                                         transform: 'translateY(0)'
                                      },
                                      '&:disabled': {
                                         background: 'rgba(0,0,0,0.12)',
                                         boxShadow: 'none',
                                         transform: 'none'
                                      }
                                   }}
                                >
                                   {formSubmitted ? (
                                      <motion.span
                                         animate={{ rotate: 360 }}
                                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      >
                                         ⏳
                                      </motion.span>
                                   ) : formState === "login" ? (
                                      "Iniciar sesión"
                                   ) : formState === "register" ? (
                                      "Crear cuenta"
                                   ) : (
                                      "Enviar instrucciones"
                                   )}
                                </Button>
                             </motion.div>
                           </motion.div>
                        </FormikForm>

                        {/* Cambio entre login/register */}
                        {formState !== "forgot-password" && (
                           <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="text-center pt-4"
                           >
                              <Typography variant="body2" color="text.secondary" component="span">
                                 {formState === "login" ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
                              </Typography>
                              <Button
                                 variant="text"
                                 onClick={() => handleFormChange(formState === "login" ? "register" : "login")}
                                 sx={{
                                    p: 0,
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'primary.main',
                                    textTransform: 'none',
                                    '&:hover': {
                                       bgcolor: 'transparent',
                                       textDecoration: 'underline'
                                    }
                                 }}
                              >
                                 {formState === "login" ? "Regístrate" : "Inicia sesión"}
                              </Button>
                           </motion.div>
                        )}
                     </motion.div>
                  </AnimatePresence>
               </CardContent>
            </Card>

            {/* Footer */}
            <motion.div
               initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-8"
            >
               <Typography variant="caption" color="text.secondary">
                  © 2024 Tu Empresa. Todos los derechos reservados.
               </Typography>
            </motion.div>
         </motion.div>
      </div>
   );
}