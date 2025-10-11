import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { Axios, Response } from "../../utils/Api";
import to from "await-to-js";
// import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import { useGlobalContext } from "../../context/GlobalContext";
import Toast from "../../utils/Toast";
import { Button } from "@mui/material";
import { UploadFileRounded } from "@mui/icons-material";
import { excelDateToJSDate } from "../../utils/Formats";

type ValidationFn = (value: any) => boolean;

interface ColumnConfig {
   name: string; // Nombre exacto de la columna en el Excel
   validate?: ValidationFn | null; // null = no se valida
   required?: boolean; // si la columna debe estar presente
   isDate?: boolean; // marcar si la columna debe convertirse usando excelDateToJSDate
}

interface ExcelUploaderProps {
   columns: ColumnConfig[]; // configuración de columnas
   apiEndpoint: string; // endpoint de Laravel para recibir chunks
   chunkSize?: number; // tamaño de lote (default: 500)
   headerRow?: number; // fila que contiene los encabezados (1-based), por defecto 1
   dataStartRow?: number; // fila a partir de la cual se tomarán los datos (1-based), por defecto headerRow+1
   onFinish?: () => Promise<void> | null;
}

const ExcelUploader: React.FC<ExcelUploaderProps> = ({ columns, apiEndpoint, chunkSize = 500, headerRow = 1, dataStartRow, onFinish }) => {
   const { auth } = useAuthContext();
   const { isLoading, setIsLoading } = useGlobalContext();
   const fileInputRef = useRef(null);

   const handleFile = (file: File) => {
      // setIsLoading(true);
      const reader = new FileReader();
      reader.onload = async (e: any) => {
         console.log("🚀 ~ handleFile ~ file:", file);
         const data = new Uint8Array(e.target.result);
         const workbook = XLSX.read(data, { type: "array" });
         const sheetName = workbook.SheetNames[0];
         const sheet = workbook.Sheets[sheetName];

         // Determinar filas: headerRow indica en qué fila están los encabezados (1-based).
         // dataStartRow indica desde qué fila se tomarán los registros (1-based). Por defecto headerRow+1.
         const hr = headerRow ?? 1;
         const dsr = dataStartRow ?? hr + 1;

         // Convertir a JSON usando la fila de encabezado indicada (range usa 0-based)
         let jsonData: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, {
            defval: null,
            range: hr - 1
         });

         // Si se solicita empezar en una fila de datos posterior a la fila inmediatamente siguiente al header,
         // se quitan las filas previas al inicio deseado.
         const skip = Math.max(0, dsr - hr - 1);
         if (skip > 0) jsonData = jsonData.slice(skip);

         // Convertir campos marcados como fecha usando excelDateToJSDate
         if (Array.isArray(jsonData) && columns && columns.length) {
            jsonData = jsonData.map((row) => {
               const newRow = { ...row };
               columns.forEach((col) => {
                  if (String(col).toLowerCase().includes("fecha")) {
                     try {
                        const raw = newRow[col];
                        // sólo convertir si hay valor distinto de null/empty
                        if (raw !== null && raw !== "" && raw !== undefined) {
                           newRow[col] = excelDateToJSDate(raw);
                        } else {
                           newRow[col] = null;
                        }
                     } catch (err) {
                        console.error(`Error convirtiendo fecha columna ${col}:`, err);
                        newRow[col] = null;
                     }
                  }
               });
               return newRow;
            });
         }

         const errores: string[] = [];
         const validos: Record<string, any>[] = [];

         jsonData.forEach((row, index) => {
            let filaValida = true;

            columns.forEach((col) => {
               const val = row[col.name];

               // Validar campo requerido
               if (col.required && (val === null || val === "")) {
                  filaValida = false;
                  errores.push(`Fila ${index + 2}, columna ${col.name}: campo obligatorio vacío`);
               }

               // Validar con función custom
               if (col.validate && val !== null && val !== "") {
                  if (!col.validate(val)) {
                     filaValida = false;
                     errores.push(`Fila ${index + 2}, columna ${col.name}: valor inválido -> ${val}`);
                  }
               }
            });
            row.fileData = {
               name: file.name,
               size: file.size,
               type: file.type,
               lastModified: file.lastModified
            };
            // poner encabezados como key

            if (filaValida) validos.push(row);
         });

         // Mostrar errores
         if (errores.length) {
            errores.forEach((err) => Toast.Error(err));
            // errores.forEach((err) => Toast.  (err, { autoClose: 5000 }));
         }

         // Enviar registros válidos en chunks
         for (let i = 0; i < validos.length; i += chunkSize) {
            const chunk = validos.slice(i, i + chunkSize);
            // console.log("🚀 ~ handleFile ~ chunk:", chunk);
            try {
               console.log("🚀 ~ handleFile ~ chunk:", chunk);
               // return;
               // await Axios.post(apiEndpoint, chunk);
               const [error, response] = await to(Axios.post(`${apiEndpoint}`, chunk));
               // console.log("🚀 ~ createOrUpdateDepartment ~ error:", error);
               // console.log("🚀 ~ createOrUpdateDepartment ~ response:", response);
               if (error) {
                  console.log("🚀 ~ createOrUpdateDepartment ~ error:", error);
                  const message = error.response.data.message || "createOrUpdateDepartment ~ Ocurrio algun error, intenta de nuevo :c";
                  Toast.Error(message);
                  setIsLoading(false);
                  return;
               }
            } catch (error) {
               Toast.Error("Error al enviar los datos al servidor");
               console.error(error);
               setIsLoading(false);
            }
         }
         if (onFinish) onFinish();
         setIsLoading(false);
         Toast.Success(`Procesamiento finalizado. Registros válidos enviados: ${validos.length}`);
      };

      reader.readAsArrayBuffer(file);
   };

   return (
      <div>
         <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx,.xls,.csv"
            onChange={(e) => {
               const f = e.target.files && e.target.files[0];
               if (f) handleFile(f);
            }}
            className="hidden"
         />
         <Button variant="contained" startIcon={<UploadFileRounded />} onClick={() => fileInputRef.current?.click()} disabled={!auth.permissions.create}>
            Importar (Carga Masivas)
         </Button>
      </div>
   );
};

export default ExcelUploader;

// import React, { useRef } from "react";
// import * as XLSX from "xlsx";
// import axios from "axios";
// import { useAuthContext } from "../../context/AuthContext";
// import Toast from "../../utils/Toast";
// import { Button } from "@mui/material";
// import { UploadFileRounded } from "@mui/icons-material";

// interface IExcelUploader {
//    // file: File;
//    columns: string[];
//    validations: { [key: string]: (value: any) => boolean | null };
//    apiEndpoint: string;
//    chunkSize?: number;
//    onUploadError?: (error: any) => void;
//    onUploadSuccess?: (count: number) => void;
// }

// const ExcelUploader = ({ columns, validations, apiEndpoint, chunkSize = 500, onUploadSuccess, onUploadError }): IExcelUploader => {
//    const { auth } = useAuthContext();
//    const fileInputRef = useRef(null);

//    const handleFile = (file) => {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//          if (!e.target || !e.target.result) {
//             Toast.Error("No se pudo leer el archivo.");
//             return;
//          }
//          const data = new Uint8Array(e.target.result as ArrayBuffer);
//          const workbook = XLSX.read(data, { type: "array" });
//          const sheetName = workbook.SheetNames[0];
//          const sheet = workbook.Sheets[sheetName];
//          const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });

//          // Validar registros
//          const errores = [];
//          const validos = [];

//          jsonData.forEach((row, index) => {
//             let filaValida = true;

//             columns.forEach((col) => {
//                const val = row[col];
//                const validateFn = validations[col];
//                if (validateFn && !validateFn(val)) {
//                   filaValida = false;
//                   errores.push(`Fila ${index + 2}, columna ${col}: valor inválido -> ${val}`);
//                }
//             });

//             if (filaValida) validos.push(row);
//          });

//          // Mostrar errores
//          if (errores.length) {
//             errores.forEach((err) => Toast.Error(err, { autoClose: 5000 }));
//          }

//          // Enviar registros válidos al backend en chunks
//          for (let i = 0; i < validos.length; i += chunkSize) {
//             const chunk = validos.slice(i, i + chunkSize);
//             try {
//                await axios.post(apiEndpoint, chunk);
//             } catch (error) {
//                Toast.Error("Error al enviar los datos al servidor");
//                console.error(error);
//             }
//          }

//          Toast.Success(`Procesamiento finalizado. Registros válidos enviados: ${validos.length}`);
//       };

//       reader.readAsArrayBuffer(file);
//    };

//    return (
//       <div>
//          <input type="file" ref={fileInputRef} accept=".xlsx,.xls" onChange={(e) => handleFile(e.target.files[0])} />
//          <Button variant="contained" startIcon={<UploadFileRounded />} onClick={() => fileInputRef.current?.click()} disabled={!auth.permissions.create}>
//             Importar (Carga Masiva)
//          </Button>
//       </div>
//    );
// };

// export default ExcelUploader;
