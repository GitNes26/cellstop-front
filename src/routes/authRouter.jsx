import ProtectedRouter from "../components/ProtectedRouter"; //const ProtectedRouter = lazy(() => import("../components/ProtectedRouter"));
import AuthLayout from "../layouts/AuthLayout"; //const AuthLayout = lazy(() => import("../layouts/AuthLayout"));
import AuthSignIn from "../views/auth/SignIn"; // const AuthSignIn = lazy(() => import("../views/auth/SignIn"));
import AuthSignUp from "../views/auth/SignUp"; // const AuthSignUp = lazy(() => import("../views/auth/SignUp"));
import NotFound from "../views/NotFound"; //const NotFound = lazy(() => import("../views/NotFound"));

const authRouter = {
   path: "/",
   element: (
      <ProtectedRouter invert={true} redirectTo={"/app"}>
         <AuthLayout />
      </ProtectedRouter>
   ),
   errorElement: <NotFound />,
   children: [
      {
         path: "/",
         element: <AuthSignIn />,
      },
      {
         index: true,
         path: "login",
         element: <AuthSignIn />,
      },
      {
         path: "registro",
         element: <AuthSignUp />,
      },
   ],
};
export default authRouter;
