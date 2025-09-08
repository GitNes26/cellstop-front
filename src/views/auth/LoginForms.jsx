"use client";

// import type React from "react";
import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Card, CardContent, Typography, TextField, Button, InputAdornment, IconButton, Divider, Stack, Alert } from "@mui/material";
import {
   Visibility,
   VisibilityOff,
   Mail,
   Lock,
   Person,
   Login,
   HowToReg,
   Google,
   GitHub,
   ArrowBack,
   Send,
   AccountCircleRounded,
   BlockRounded,
   EmailRounded
} from "@mui/icons-material";
import { useGlobalContext } from "../../context/GlobalContext";
import { useAuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import images from "../../constant/images";

import * as Yup from "yup";
import FormikForm, { Input } from "../../components/forms";
import Toast from "../../utils/Toast";

// type FormState = "login" | "register" | "forgot-password";

export default function LoginForms() {
   const navigate = useNavigate();
   const formikRef = useRef(null);
   const { setIsLoading } = useGlobalContext();
   const { setAuth, login, signup } = useAuthContext();
   //#region  States Animaciones
   const [formState, setFormState] = useState("login");
   const [showPassword, setShowPassword] = useState(false);
   const [formSubmitted, setFormSubmitted] = useState(false);
   const [resetEmailSent, setResetEmailSent] = useState(false);
   //#endregion States Animaciones

   //#region Animaciones
   const getFormTitle = () => {
      switch (formState) {
         case "login":
            return "Bienvenido :)";
         case "register":
            return "Crear una cuenta";
         case "forgot-password":
            return "Recuperar contraseña";
         default:
            return "";
      }
   };

   const getFormSubtitle = () => {
      switch (formState) {
         case "login":
            return "Ingresa tus credenciales para acceder a tu cuenta";
         case "register":
            return "Completa el formulario para registrarte";
         case "forgot-password":
            return "Te enviaremos un enlace para restablecer tu contraseña";
         default:
            return "";
      }
   };

   const slideVariants = {
      enter: (direction) => ({
         x: direction > 0 ? 300 : -300,
         opacity: 0
      }),
      center: {
         zIndex: 1,
         x: 0,
         opacity: 1
      },
      exit: (direction) => ({
         zIndex: 0,
         x: direction < 0 ? 300 : -300,
         opacity: 0
      })
   };

   const [direction, setDirection] = useState(0);

   const handleFormChange = (newState) => {
      const stateOrder = ["login", "register", "forgot-password"];
      const currentIndex = stateOrder.indexOf(formState);
      const newIndex = stateOrder.indexOf(newState);
      setDirection(newIndex > currentIndex ? 1 : -1);
      setFormState(newState);
   };
   //#endregion Animaciones

   // ["login", "register"].includes(formState) &&
   const formData = [
      {
         name: "username",
         value: "",
         input: <Input idName={"username"} label={"Nombre de usuario | Correo | N° de empleado"} required />,
         validations: Yup.string().trim().required("El nombre de usuario es requerido"),
         validationPage: ["login", "register"]
      },
      {
         name: "email",
         value: "",
         input: <Input idName={"email"} label={"Correo Electrónico"} type="email" required />,
         validations: Yup.string().trim().email("Formato de correo invalida").required("El correo electrónico es requerido"),
         validationPage: ["register", "forgot-password"]
      },
      {
         name: "password",
         value: "",
         input: <Input idName={"password"} label={"Contraseña"} type="password" required />,
         validations: Yup.string().trim().min(6, "Tu contraseña debe tener mínimo 6 caracteres").required("La contraseña es requerida"),
         validationPage: ["login", "register"]
      },
      {
         name: "password_confirm",
         value: "",
         input: <Input idName={"password_confirm"} label={"Confirmar Contraseña"} type="password" required />,
         validations: Yup.string()
            .trim()
            .min(6, "Tu contraseña debe tener mínimo 6 caracteres")
            .required("La contraseña es requerida")
            .test("confirmPassword", "Las contraseñas no coinciden", (value) => value.match(formikRef.current.values.password))
            .required("El nombre de usuario es requerido"),
         validationPage: ["register"]
      }
   ];
   const initialValues = {};
   const validations = {};
   const inputsForms = [];
   formData.forEach((field) => {
      inputsForms.push(field.input);
      initialValues[field.name] = field.value;
      // validations[field.name] = field.validations;
   });
   // const validationSchema = Yup.object().shape(validations);
   const validationSchema = (page) => {
      // console.log("🚀 ~ validationSchema ~ page:", page);
      const formDataPerPage = formData.filter((item) => item.validationPage.includes(page));
      // console.log("🚀 ~ validationSchema ~ formDataPerPage:", formDataPerPage);
      const validationsPerPage = [];
      formDataPerPage.forEach((field) => {
         validationsPerPage[field.name] = field.validations;
      });
      // console.log("🚀 ~ formDataPerPage.forEach ~ validationsPerPage:", validationsPerPage);
      return Yup.object().shape(validationsPerPage);
   };

   const onSubmit = async (values, { setSubmitting }) => {
      // return console.log("🚀 ~ onSubmit ~ values:", values);

      setIsLoading(true);
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

      // await setAuth(res.result);
      if (res.alert_text) Toast.Success(res.alert_text);

      setSubmitting(false);
      setIsLoading(false);
      if (formState === "login") navigate("/app");
      else handleFormChange("login");
   };

   useLayoutEffect(() => {
      setIsLoading(false);
   }, []);

   return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col gap-5">
         <img src={images.icon} className="object-contain h-20 self-center" />
         <Card
            sx={{
               width: { xs: "90%", sm: 450 },
               mx: "auto",
               borderRadius: 2,
               overflow: "hidden",
               // boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
               boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
               backdropFilter: "blur(20px)",
               background: "rgba(255, 255, 255, 0.95)",
               border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
         >
            <Box
               sx={{
                  height: 6,
                  background: "linear-gradient(90deg, #034AAB, #8b5cf6, #d946ef, #034AAB)",
                  backgroundSize: "200% 100%",
                  animation: "gradient 3s ease infinite",
                  "@keyframes gradient": {
                     "0%": { backgroundPosition: "0% 50%" },
                     "50%": { backgroundPosition: "100% 50%" },
                     "100%": { backgroundPosition: "0% 50%" }
                  }
               }}
            />

            <CardContent
               sx={{
                  p: 4,
                  position: "relative",
                  overflow: "hidden"
               }}
            >
               {resetEmailSent && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ marginBottom: 16 }}>
                     <Alert severity="success" sx={{ borderRadius: 2 }}>
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
                     transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                     }}
                  >
                     {formState === "forgot-password" && (
                        <Box sx={{ mb: 2 }}>
                           <Button startIcon={<ArrowBack />} onClick={() => handleFormChange("login")} sx={{ color: "text.secondary", p: 0 }}>
                              Volver al inicio de sesión
                           </Button>
                        </Box>
                     )}

                     <Typography variant="h4" component="h1" fontWeight="bold" mb={1}>
                        {getFormTitle()}
                     </Typography>

                     <Typography variant="body2" color="text.secondary" mb={4}>
                        {getFormSubtitle()}
                     </Typography>

                     <FormikForm
                        key={"formikComponent"}
                        initialValues={initialValues}
                        validationSchema={validationSchema(formState)}
                        onSubmit={onSubmit}
                        showActionButtons={false}
                        formikRef={formikRef}
                        handleCancel={null}
                     >
                        <Stack spacing={3} width={"100%"}>
                           {/* {inputsForms.map((input) => input)} */}

                           {/* FORMULARIO */}
                           {formState === "forgot-password" ? (
                              <Input
                                 idName={"email"}
                                 label={"Correo Electrónico"}
                                 type="email"
                                 startAdornmentContent={<EmailRounded color="action" />}
                                 focus
                                 required
                              />
                           ) : (
                              <>
                                 <Input
                                    idName={"username"}
                                    label={"Usuario | Correo | N° de empleado"}
                                    type="text"
                                    startAdornmentContent={<AccountCircleRounded />}
                                    required
                                 />
                                 {formState === "register" && (
                                    <Input
                                       idName={"email"}
                                       label={"Correo Electrónico"}
                                       type="email"
                                       startAdornmentContent={<EmailRounded color="action" />}
                                       required
                                    />
                                 )}

                                 <Input
                                    idName={"password"}
                                    label={"Contraseña"}
                                    type="password"
                                    helperText="Mínimo 6 caracteres"
                                    minLength={6}
                                    startAdornmentContent={<Lock color="action" />}
                                    focus
                                    required
                                 />
                                 {formState === "register" && (
                                    <Input
                                       idName={"password_confirm"}
                                       label={"Confirmar Contraseña"}
                                       type="password"
                                       helperText="Mínimo 6 caracteres"
                                       minLength={6}
                                       startAdornmentContent={<Lock color="action" />}
                                       required
                                    />
                                 )}
                              </>
                           )}

                           {/* BOTON DE OLVIDASTE TU CONTRASEÑA */}
                           {formState === "login" && (
                              <Box sx={{ textAlign: "right" }}>
                                 <Button
                                    variant="text"
                                    onClick={() => handleFormChange("forgot-password")}
                                    sx={{
                                       p: 0,
                                       fontWeight: "medium",
                                       fontSize: "0.875rem",
                                       color: "primary.main",
                                       "&:hover": {
                                          bgcolor: "transparent",
                                          textDecoration: "underline"
                                       }
                                    }}
                                 >
                                    ¿Olvidaste tu contraseña?
                                 </Button>
                              </Box>
                           )}

                           {/* BOTON SEND */}
                           <Button
                              type="submit"
                              variant="contained"
                              size="large"
                              fullWidth
                              loading={formSubmitted}
                              disabled={formSubmitted}
                              startIcon={formState === "login" ? <Login /> : formState === "register" ? <HowToReg /> : <Send />}
                              sx={{
                                 py: 1.5,
                                 color: "whitesmoke",
                                 background: "linear-gradient(45deg, #034AAB, #8b5cf6)",
                                 "&:hover": {
                                    background: "linear-gradient(45deg, #4f46e5, #7c3aed)"
                                 },
                                 "&:disabled": {
                                    background: "rgba(0,0,0,0.12)"
                                 }
                              }}
                           >
                              {formSubmitted ? (
                                 <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                       duration: 1,
                                       repeat: Number.POSITIVE_INFINITY,
                                       ease: "easeInOut"
                                    }}
                                 >
                                    ⏳
                                 </motion.div>
                              ) : formState === "login" ? (
                                 "Iniciar sesión"
                              ) : formState === "register" ? (
                                 "Registrarse"
                              ) : (
                                 "Enviar enlace"
                              )}
                           </Button>
                        </Stack>
                     </FormikForm>

                     {/* TEXTO INFERIRO PARA CAMBIAR DE FORMULARIO */}
                     {formState !== "forgot-password" && (
                        <Box sx={{ mt: 3, textAlign: "center" }}>
                           <Typography variant="body2" component="span">
                              {formState === "login" ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
                           </Typography>
                           <Button
                              variant="text"
                              onClick={() => handleFormChange(formState === "login" ? "register" : "login")}
                              sx={{
                                 p: 0,
                                 fontWeight: "medium",
                                 fontSize: "0.875rem",
                                 color: "primary.main",
                                 "&:hover": {
                                    bgcolor: "transparent",
                                    textDecoration: "underline"
                                 }
                              }}
                           >
                              {formState === "login" ? "Regístrate" : "Inicia sesión"}
                           </Button>
                        </Box>
                     )}
                  </motion.div>
               </AnimatePresence>
            </CardContent>
         </Card>
      </motion.div>
   );
}
