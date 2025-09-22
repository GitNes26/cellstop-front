import React, { useRef } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import Toast from "../../utils/Toast";
import { Button } from "@mui/material";
import { UploadFileRounded } from "@mui/icons-material";

interface IExcelUploader {
   // file: File;
   columns: string[];
   validations: { [key: string]: (value: any) => boolean | null };
   apiEndpoint: string;
   chunkSize?: number;
   onUploadError?: (error: any) => void;
   onUploadSuccess?: (count: number) => void;
}

const ExcelUploader = ({ columns, validations, apiEndpoint, chunkSize = 500, onUploadSuccess, onUploadError }): IExcelUploader => {
   const { auth } = useAuthContext();
   const fileInputRef = useRef(null);

   const handleFile = (file) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
         if (!e.target || !e.target.result) {
            Toast.Error("No se pudo leer el archivo.");
            return;
         }
         const data = new Uint8Array(e.target.result as ArrayBuffer);
         const workbook = XLSX.read(data, { type: "array" });
         const sheetName = workbook.SheetNames[0];
         const sheet = workbook.Sheets[sheetName];
         const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });

         // Validar registros
         const errores = [];
         const validos = [];

         jsonData.forEach((row, index) => {
            let filaValida = true;

            columns.forEach((col) => {
               const val = row[col];
               const validateFn = validations[col];
               if (validateFn && !validateFn(val)) {
                  filaValida = false;
                  errores.push(`Fila ${index + 2}, columna ${col}: valor inválido -> ${val}`);
               }
            });

            if (filaValida) validos.push(row);
         });

         // Mostrar errores
         if (errores.length) {
            errores.forEach((err) => Toast.Error(err, { autoClose: 5000 }));
         }

         // Enviar registros válidos al backend en chunks
         for (let i = 0; i < validos.length; i += chunkSize) {
            const chunk = validos.slice(i, i + chunkSize);
            try {
               await axios.post(apiEndpoint, chunk);
            } catch (error) {
               Toast.Error("Error al enviar los datos al servidor");
               console.error(error);
            }
         }

         Toast.Success(`Procesamiento finalizado. Registros válidos enviados: ${validos.length}`);
      };

      reader.readAsArrayBuffer(file);
   };

   return (
      <div>
         <input type="file" ref={fileInputRef} accept=".xlsx,.xls" onChange={(e) => handleFile(e.target.files[0])} />
         <Button variant="contained" startIcon={<UploadFileRounded />} onClick={() => fileInputRef.current?.click()} disabled={!auth.permissions.create}>
            Importar (Carga Masiva)
         </Button>
      </div>
   );
};

export default ExcelUploader;
