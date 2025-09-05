import * as React from "react";
// import { useNavigation } from "react-router-dom";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useNavigation } from "react-router-dom";

export default function LinearLoading() {
   const navigation = useNavigation();
   const [progress, setProgress] = React.useState(0);
   const [show, setShow] = React.useState(false);

   React.useEffect(() => {
      let interval;

      if (navigation.state === "loading") {
         setShow(true);
         setProgress(30); // Valor inicial al empezar la carga

         // Simula progreso incremental (opcional)
         interval = setInterval(() => {
            setProgress((prev) => {
               const diff = Math.random() * 10;
               return Math.min(prev + diff, 90); // No llega al 100% hasta confirmar carga
            });
         }, 500);
      } else if (progress > 0) {
         setProgress(100); // Completa al 100% cuando termina
         setTimeout(() => {
            setShow(false);
            setProgress(0);
         }, 400); // Pequeño delay para animación
      }

      return () => clearInterval(interval);
   }, [navigation.state]);

   if (!show) return null;

   return (
      <Box
         sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 9999,
         }}>
         <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
               height: 3,
               "& .MuiLinearProgress-bar": {
                  transition:
                     progress === 100
                        ? "transform 0.3s ease-out"
                        : "transform 0.2s linear",
               },
            }}
         />
      </Box>
   );
}
