import { motion } from "framer-motion";
import { Box } from "@mui/material";

export default function AnimatedBackground() {
   const floatingElements = Array.from({ length: 8 }, (_, i) => i);

   return (
      <Box
         sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #6F99CD 0%, #764ba2 100%)",
            overflow: "hidden",
            zIndex: 0
         }}
      >
         {/* Gradient overlay animado */}
         <motion.div
            style={{
               position: "absolute",
               top: 0,
               left: 0,
               width: "100%",
               height: "100%",
               background: "linear-gradient(45deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8), rgba(99, 102, 241, 0.8))"
            }}
            animate={{
               background: [
                  "linear-gradient(45deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8), rgba(99, 102, 241, 0.8))",
                  "linear-gradient(45deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8), rgba(217, 70, 239, 0.8))",
                  "linear-gradient(45deg, rgba(139, 92, 246, 0.8), rgba(217, 70, 239, 0.8), rgba(102, 126, 234, 0.8))",
                  "linear-gradient(45deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8), rgba(99, 102, 241, 0.8))"
               ]
            }}
            transition={{
               duration: 8,
               repeat: Number.POSITIVE_INFINITY,
               ease: "easeInOut"
            }}
         />

         {/* Elementos flotantes */}
         {floatingElements.map((i) => (
            <motion.div
               key={i}
               style={{
                  position: "absolute",
                  width: Math.random() * 100 + 50,
                  height: Math.random() * 100 + 50,
                  borderRadius: "50%",
                  background: `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
               }}
               animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
               }}
               transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: Math.random() * 2
               }}
            />
         ))}

         {/* Formas geométricas */}
         <motion.div
            style={{
               position: "absolute",
               top: "10%",
               right: "10%",
               width: 200,
               height: 200,
               borderRadius: "30%",
               background: "rgba(255, 255, 255, 0.05)"
            }}
            animate={{
               rotate: [0, 360],
               scale: [1, 1.2, 1]
            }}
            transition={{
               duration: 20,
               repeat: Number.POSITIVE_INFINITY,
               ease: "linear"
            }}
         />

         <motion.div
            style={{
               position: "absolute",
               bottom: "15%",
               left: "15%",
               width: 150,
               height: 150,
               borderRadius: "20%",
               background: "rgba(255, 255, 255, 0.03)"
            }}
            animate={{
               rotate: [360, 0],
               y: [0, -20, 0]
            }}
            transition={{
               duration: 15,
               repeat: Number.POSITIVE_INFINITY,
               ease: "easeInOut"
            }}
         />
      </Box>
   );
}
