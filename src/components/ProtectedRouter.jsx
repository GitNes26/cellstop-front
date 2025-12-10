import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";

/**
 * Componente para proteger rutas
 *
 * @param {ReactNode} children Un elemento de React
 * @param {boolean} invert Si NO esta logeado
 * @param {string} redirectTo Ruta a donde se redireccionara en caso de no estar logeado
 * @returns
 */

const ProtectedRouter = ({ children, invert = false, redirectTo = "/" }) => {
   // console.log("🚀 ~ ProtectedRouter ~ ProtectedRouter:");
   const { auth, isAuth, logout, checkLoggedIn } = useAuthContext();
   const token = localStorage.getItem("token");
   const location = useLocation();

   useEffect(() => {
      const verifyAuth = async () => {
         // console.log("🚀 ~ isAuth:", isAuth);
         await checkLoggedIn();
      };

      if (isAuth) verifyAuth();
   }, [location.pathname]);

   // if (invert ? isAuth : !isAuth) {
   if (invert ? auth?.id && token : !auth?.id && !token) {
      if (!invert) logout();
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
   }

   return children ? children : <Outlet />;

   // if (invert ? isAuth : !isAuth) {
   //    if (!invert) logout();

   //    checkLoggedIn();

   //    return <Navigate to={redirectTo} state={{ from: location }} replace />;
   // }
   // return children ? children : <Outlet />;
};

export default ProtectedRouter;
