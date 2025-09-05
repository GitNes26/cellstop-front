import React from "react";
import { useEffect, useState } from "react";
import SunIcon from "../assets/icons/SunIcon";
import MoonIcon from "../assets/icons/MoonIcon";
import { IconButton, Tooltip, useColorScheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// // Obtener el tema actual del localStorage
// const mode = localStorage.getItem("theme");

/**
 * Componente ThemeCharger que permite cambiar entre temas claro y oscuro.
 *
 * @param {string} themeLight - Nombre del tema claro. Ejemplos: 'light', 'nord', etc.
 * @param {string} themeDark - Nombre del tema oscuro. Ejemplos: 'dark', 'darkneutro', etc.
 * @param {string} className - Clases CSS adicionales para personalizar el estilo del formulario.
 */
interface ThemeChargerProps {
   themeLight?: "light"; //| "nord" | "cupcake"; // Opciones limitadas para el tema claro
   themeDark?: "dark"; //| "abyss" | "darkneutro" | "dim"; // Opciones limitadas para el tema oscuro
   className?: string; // Clases adicionales para estilos
}

const ThemeCharger: React.FC<ThemeChargerProps> = ({
   themeLight = "light",
   themeDark = "dark",
   className,
}) => {
   const { mode, setMode } = useColorScheme();
   const [isDarkMode, setIsDarkMode] = useState(false);

   // const [isChecked, setIsChecked] = useState(mode !== "light");
   // const setColorTableHeader = useGlobalStore(useCallback((state) => state.setColorTableHeader, []));
   // const setThemeActive = useGlobalStore(useCallback((state) => state.setThemeActive, []));

   // Manejador del cambio de tema
   const handleClick = async () => {
      // console.log("🚀 ~ handleClick ~ isDarkMode:", isDarkMode);
      setIsDarkMode(!isDarkMode);
      // const checked = e.target.checked;
      // setIsChecked(checked);
      // const theme = checked ? themeDark : themeLight;
      const theme = isDarkMode ? themeDark : themeLight;
      setMode(theme);
      // localStorage.setItem("theme", theme);
   };

   useEffect(() => {
      (async () => {
         handleClick();
         const theme = isDarkMode ? themeDark : themeLight;
         setMode(theme);
         // setMode(!mode || "system");
         // setIsChecked(mode !== themeLight);
      })();
   }, []);

   return (
      <>
         <Tooltip
            title={
               isDarkMode ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro"
            }>
            <IconButton
               onClick={handleClick}
               sx={{
                  position: "relative",
                  padding: 2,
                  width: 25,
                  height: 25,
                  marginLeft: 2,
               }}
               aria-label="Toggle theme">
               <AnimatePresence mode="wait">
                  {isDarkMode ? (
                     <motion.div
                        key="moon"
                        initial={{ opacity: 0, rotate: -90, scale: 0.95 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.95 }}
                        transition={{ duration: 0.15 }}>
                        <MoonIcon />
                     </motion.div>
                  ) : (
                     <motion.div
                        key="sun"
                        initial={{ opacity: 0, rotate: 90, scale: 0.95 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -90, scale: 0.95 }}
                        transition={{ duration: 0.15 }}>
                        <SunIcon />
                     </motion.div>
                  )}
               </AnimatePresence>
            </IconButton>
         </Tooltip>
         {/* <label className={`swap swap-rotate ${className}`}>
            <input
               type="checkbox"
               className="theme-controller animate-[wiggle_1s_ease-in-out_infinite]"
               data-toggle-theme={`${themeDark},${themeLight}`}
               data-act-class="ACTIVECLASS"
               checked={isChecked}
               onChange={handleChange}
            />
            <SunIcon />
            <MoonIcon />
         </label> */}
      </>
   );
};

export default ThemeCharger;
