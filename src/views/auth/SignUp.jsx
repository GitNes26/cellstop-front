const SignUp = ({}) => {
   return <>REGISTRO</>;
};

export default SignUp;

// import { useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import images from "../../constant/images";
// import Grid from "@mui/material/Grid";
// import FormikForm, { Input } from "../../components/forms";
// import { Typography } from "../../components/basics";
// import { ThemeCharger } from "../../components";
// import { useAuthContext } from "../../context/AuthContext";
// import { useGlobalContext } from "../../context/GlobalContext";

// const SignUp = () => {
//    const { setIsLoading } = useGlobalContext();
//    const { signup } = useAuthContext();

//    const navigate = useNavigate();
//    const formikRef = useRef(null);

//    const initialValues = {
//       username: "",
//       email: "",
//       password: "",
//       confirmPassword: ""
//    };
//    const validationSchema = Yup.object({
//       username: Yup.string().trim().required("El nombre de usuario es requerido"),
//       email: Yup.string().trim().email("Formato de correo inválido").required("El correo es requerido"),
//       password: Yup.string().trim().min(6, "Tu contraseña debe tener mínimo 6 caracteres").required("La contraseña es requerida"),
//       confirmPassword: Yup.string()
//          .trim()
//          .test("confirmPassword", "Las contraseñas no coinciden", (value) => value.match(formikRef.current.values.password))
//          .required("El nombre de usuario es requerido")
//    });
//    const onSubmit = async (values, { setSubmitting }) => {
//       setIsLoading(true);
//       const res = await signup(values);
//       // console.log("🚀 ~ onSubmit ~ res:", res);
//       if (!res) return setIsLoading(false);
//       if (res.status_code !== 200) {
//          setIsLoading(false);
//          return Toast.Customizable(res.alert_text, res.alert_icon);
//       }

//       // await setAuth(res.result);
//       if (res.alert_text) Toast.Success(res.alert_text);

//       setSubmitting(false);
//       setIsLoading(false);
//       navigate("/");
//    };

//    return (
//       <>
//          <aside className={"h-screen hidden md:block"} style={{ maxWidth: 490 }}>
//             <img src={images.bgAuth} className="object-cover w-full h-screen" />
//          </aside>
//          <main className="w-full flex flex-col justify-center items-start px-[5%] my-auto">
//             <ThemeCharger className="mx-2" />
//             <Typography className="mb-5 font-extrabold sm:text-lg md:text-2xl lg:text-4xl">REGISTRO</Typography>

//             <FormikForm
//                initialValues={initialValues}
//                validationSchema={validationSchema}
//                onSubmit={onSubmit}
//                alignContent={"center"}
//                textBtnSubmit="INICIAR SESIÓN"
//                btnSize="large"
//                showCancelButton={false}
//                col={9}
//                sizeCols={{ xs: 12, sm: 9, md: 9 }}
//                spacing={0}
//                formikRef={formikRef}
//             >
//                <Input
//                   col={12}
//                   idName="username"
//                   label="Nombre de usuario"
//                   placeholder="miUsuario"
//                   type="text"
//                   size="xs"
//                   helperText="Texto de ayuda"
//                   focus={true}
//                   required
//                />
//                <Input
//                   col={12}
//                   idName="email"
//                   label="Correo Electrónico"
//                   placeholder="correo@ejemplo.com"
//                   type="email"
//                   textStyleCase={false}
//                   helperText="Texto de ayuda"
//                   required
//                />
//                <Grid container width={"100%"} alignItems={"flex-end"}>
//                   <Input col={6} idName="password" label="Contraseña" placeholder="******" type="password" helperText="Mínimo 6 caracteres" required />
//                   <Input
//                      col={6}
//                      idName="confirmPassword"
//                      label="Confirmar Contraseña"
//                      placeholder="******"
//                      type="password"
//                      helperText="Vuelve a escribir la contraseña"
//                      required
//                   />
//                </Grid>
//             </FormikForm>
//             <Typography>
//                Ya tengo una cuenta{" "}
//                <Link to={"/"} className="font-bold text-primary">
//                   Iniciar Sesión
//                </Link>
//             </Typography>

//             <div className="absolute flex align-items-center bottom-10">
//                <div className="pr-10 mr-5 border-r-[1px]  border-r-primary">
//                   <img src={images.logoDark} className="object-contain w-20" alt="Logo Dark" />
//                </div>
//                <div className="my-auto text-sm">DIF Gómez Palacio Durango</div>
//             </div>
//          </main>
//       </>
//    );
// };

// export default SignUp;
