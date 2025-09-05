import { HomeSharp } from "@mui/icons-material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

const NotFound = () => {
   const { setIsLoading } = useGlobalContext();
   useEffect(() => {
      setIsLoading(false);
   }, []);

   return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
         <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-4">
               <svg className="w-auto h-40 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
               </svg>
               <h1 className="text-4xl font-extrabold sm:text-5xl">404</h1>
               <p className="text-xl">¡Ups! Página no encontrada.</p>
               <p className="text-base">
                  Es posible que la página que estás buscando haya sido eliminada, haya cambiado de nombre o no esté disponible temporalmente.
               </p>
            </div>
            <div>
               <Link href="/" className="btn btn-secondary">
                  <HomeSharp />
                  &nbsp; Ir al inicio
               </Link>
            </div>
         </div>
      </div>
   );
};
export default NotFound;
