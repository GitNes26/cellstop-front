const SignIn = ({}) => {
   return <>LOGIN</>;
};

export default SignIn;

// import { useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import images from "../../constant/images";
// import FormikForm, { Input } from "../../components/forms";
// import { Typography } from "../../components/basics";
import Toast from "../../utils/Toast";
// import { ThemeCharger } from "../../components";
// import { useGlobalContext } from "../../context/GlobalContext";
// import { useAuthContext } from "../../context/AuthContext";
// // import { login } from "../../services/authService";
// // import useAuthStore from "../../stores/authStore";

// const SignIn = () => {
//    const navigate = useNavigate();
//    const { setIsLoading } = useGlobalContext();
//    const { setAuth, login } = useAuthContext();
//    // const { setAuth } = useAuthStore();

//    const formData = [
//       { name: "username", value: "", validations: Yup.string().trim().required("El nombre de usuario es requerido") },
//       { name: "password", value: "", validations: Yup.string().trim().min(6, "Tu contraseña debe tener mínimo 6 caracteres").required("La contraseña es requerida") }
//    ];
//    const initialValues = {};
//    const validations = {};
//    formData.forEach((field) => {
//       initialValues[field.name] = field.value;
//       validations[field.name] = field.validations;
//    });
//    const validationSchema = Yup.object().shape(validations);

//    const onSubmit = async (values, { setSubmitting }) => {
//       setIsLoading(true);
//       const res = await login(values);
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
//       navigate("/app");
//    };

//    useEffect(() => {
//       setIsLoading(false);
//    }, []);

//    return (
//       <>
//          <aside className={"h-screen hidden md:block"} style={{ maxWidth: 490 }}>
//             <img src={images.bgAuth} className="object-cover w-full h-screen" />
//          </aside>
//          <main className=" flex flex-col justify-center items-start px-[5%] my-auto">
//             <ThemeCharger className="mx-2" />
//             <Typography className="mb-5 font-extrabold text-7xl">LOGIN</Typography>
//             <FormikForm
//                initialValues={initialValues}
//                validationSchema={validationSchema}
//                onSubmit={onSubmit}
//                alignContent={"center"}
//                textBtnSubmit="INICIAR SESIÓN"
//                btnSize="large"
//                showCancelButton={false}
//                col={6}
//                sizeCols={{ xs: 12, sm: 9, md: 6 }}
//                spacing={0}
//             >
//                <Input
//                   col={12}
//                   idName="username"
//                   label="Nombre de usuario | Correo | No. Nómina"
//                   placeholder="miUsuario | correo | No. Nómina"
//                   type="text"
//                   size="xs"
//                   helperText=""
//                   focus={true}
//                   required
//                />
//                <Input col={12} idName="password" label="Contraseña" placeholder="******" type="password" helperText="Mínimo 6 caracteres" required />
//             </FormikForm>
//             <Typography>
//                ¿Aún no tienes cuenta?{" "}
//                <Link to={"/registro"} className="font-bold text-primary">
//                   Registrate Aquí
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

// export default SignIn;
