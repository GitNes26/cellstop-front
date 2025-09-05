import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { images } from "../constant";

export default function SplashLoader() {
   const [show, setShow] = useState(true);

   useEffect(() => {
      const timeout = setTimeout(() => setShow(false), 3000); // 3 segundos
      return () => clearTimeout(timeout);
   }, []);

   return (
      <AnimatePresence>
         {show && (
            <motion.div
               className="fixed inset-0 z-[9999] bg-rose-50 dark:bg-slate-900 flex flex-col items-center justify-center text-center"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
            >
               {/* Logo animado */}
               <motion.img
                  src={images.icon} // reemplaza con tu logo
                  alt="Logo de boda"
                  className="h-20 w-20"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{
                     repeat: Infinity,
                     duration: 1.8,
                     ease: "easeInOut"
                  }}
               />

               {/* Texto elegante */}
               <motion.h2
                  className="mt-6 text-xl font-marcellus text-rose-700 dark:text-rose-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
               >
                  Preparando tu invitación...
               </motion.h2>
            </motion.div>
         )}
      </AnimatePresence>
   );
}
