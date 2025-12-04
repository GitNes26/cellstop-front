import React from "react";
import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import { images } from "../constant";

interface LoadingProps {
   /** Indica si el componente debe estar visible o no. */
   open: boolean;
   animation: "spin" | "bounce" | "typing" | "default";
}

/**
 * Componente de carga con fondo de Backdrop.
 * Muestra un texto de "CARGANDO" con una animación de puntos de carga.
 *
 * @param {boolean} open - Indica si el componente debe estar visible o no.
 *
 * @returns {JSX.Element} - El componente de carga.
 */
const Loading: React.FC<LoadingProps> = ({ open, animation = "bounce" }): React.JSX.Element => {
   return (
      <Backdrop sx={{ zIndex: 99999 }} className="cursor-wait" open={open}>
         {animation === "spin" ? (
            <div className="loader-circle-spinner">
               <img src={images.icon || images.logo} alt="logo" className="loader-image" />
            </div>
         ) : animation === "bounce" ? (
            <span className="relative flex  items-center justify-center text-center">
               <div className="icon-loader inline-flex animate-[pulse_2s_infinite] ease-in-out opacity-5">
                  <img src={images.icon || images.logo} alt="logo" className="loader-image" />
               </div>
               <img src={images.icon || images.logo} alt="logo" className="relative inline-flex loader-image animate-[ping_2s_infinite] ease-in-out" />
            </span>
         ) : animation === "typing" ? (
            <Typography variant="h1" textAlign={"center"} sx={{ fontWeight: "bold" }} className="font-black text-inherit animate-typing">
               {/* <span className="loading loading-infinity loading-lg"></span> */}
               <CircularProgress sx={{ mr: 5 }} size={"5rem"} color="inherit" />
               CARGANDO
               <CircularProgress sx={{ ml: 5 }} size={"5rem"} color="inherit" />
               {/* <span className="loading loading-infinity loading-lg"></span> */}
            </Typography>
         ) : (
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
               <div className="loader-circle-spinner">
                  <img src={images.icon || images.logo} alt="logo" className="loader-image" />
               </div>
               {/* <br /> */}
               <Typography variant="h1" textAlign={"center"} sx={{ fontWeight: "bold" }} className="font-black text-inherit animate-typing">
                  {/* <span className="loading loading-infinity loading-lg"></span> */}
                  <CircularProgress sx={{ mr: 5 }} size={"5rem"} color="inherit" />
                  CARGANDO
                  <CircularProgress sx={{ ml: 5 }} size={"5rem"} color="inherit" />
                  {/* <span className="loading loading-infinity loading-lg"></span> */}
               </Typography>
            </Box>
         )}
      </Backdrop>
   );
};
export default Loading;
