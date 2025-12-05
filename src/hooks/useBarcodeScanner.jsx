import { useEffect, useRef, useState } from "react";

export const useBarcodeScanner = ({
   onScan,
   minLength = 4, // códigos de mínimo 4 caracteres
   scanTimeout = 130, // tiempo para distinguir lector vs humano
   sounds = true
}) => {
   const buffer = useRef("");
   const lastKeyTime = useRef(0);
   const inputRef = useRef(null);

   // sonidos opcionales
   const beepSuccess = new Audio("/sounds/success.mp3");
   const beepError = new Audio("/sounds/error.mp3");
   const beepDuplicate = new Audio("/sounds/duplicate.mp3");

   const playSound = (audio) => {
      if (!sounds) return;
      try {
         audio.currentTime = 0;
         audio.play();
      } catch {}
   };

   useEffect(() => {
      const handleKeydown = (e) => {
         const char = e.key;

         const now = Date.now();
         const timeDiff = now - lastKeyTime.current;
         lastKeyTime.current = now;

         // reset si pasó mucho tiempo
         if (timeDiff > scanTimeout) buffer.current = "";

         // ignorar teclas especiales
         if (char.length === 1) {
            buffer.current += char;
         }

         // detectar ENTER o TAB del lector
         if (e.key === "Enter" || e.key === "Tab") {
            if (buffer.current.length >= minLength) {
               processCode(buffer.current);
            }
            buffer.current = "";
         }
      };

      window.addEventListener("keydown", handleKeydown);
      return () => window.removeEventListener("keydown", handleKeydown);
   }, []);

   const processCode = (code) => {
      const result = onScan(code);

      if (result === "ok") playSound(beepSuccess);
      if (result === "duplicate") playSound(beepDuplicate);
      if (result === "not_found") playSound(beepError);

      if (inputRef.current) {
         inputRef.current.value = "";
         inputRef.current.focus();
      }
   };

   return {
      inputRef,
      clearBuffer: () => (buffer.current = ""),
      forceProcess: (value) => processCode(value)
   };
};
