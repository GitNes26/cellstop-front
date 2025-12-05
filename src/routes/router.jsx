import { createBrowserRouter, createHashRouter } from "react-router-dom";

// routes
// import MainRoutes from "./MainRoutes";

// ====================|| AUTHENTICATION ROUTING ||===================== //

// project imports
// import Loadable from "../ui-component/Loadable";
// import MinimalLayout from "../layout/MinimalLayout";
// import NotFound from "../views/NotFound";
// import MainLayout from "../layout/MainLayout";

// const Index = lazy(() => import("./../views/app/Index"));
// const AuthSignIn = lazy(() => import("./../views/auth/SignIn"));
// const AuthSignUp = lazy(() => import("./../views/auth/SignUp"));
import authRouter from "./authRouter";
import mainRouter from "./mainRouter";
// ====================|| AUTHENTICATION ROUTING ||===================== //

// export const router = createBrowserRouter([authRouter, mainRouter]);
export const router = createHashRouter([authRouter, mainRouter]);
