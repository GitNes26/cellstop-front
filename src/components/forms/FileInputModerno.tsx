import React, { useCallback, useEffect, useRef, useState } from "react";
import { Field, useFormikContext } from "formik";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Toast from "../../utils/Toast";
import { QuestionAlertConfig } from "../../utils/sAlert";
import { Grid, FormControl, Typography, Box, FormLabel } from "@mui/material";
import { isMobile } from "react-device-detect";
import CameraInput from "./CameraInput";
import Compressor from "compressorjs";
import DialogSelectMode from "../DialogSelectMode";
import env from "../../constant/env";

// Definición de la interfaz para las props
interface FileInputProps {
   xsOffset?: number | null;
   col: number;
   idName: string;
   label: string;
   helperText?: string;
   disabled?: boolean;
   hidden?: boolean;
   marginBottom?: number;
   color?: string;
   required?: boolean;
   filePreviews: Array<{ original: File; file: File; dataURL: any }>;
   setFilePreviews: React.Dispatch<React.SetStateAction<Array<{ original: File; file: File; dataURL: any }>>>;
   multiple?: boolean;
   maxImages?: number;
   accept?: string;
   fileSizeMax?: number;
   showBtnCamera?: boolean;
   handleUploadingFile?: (filePreviews: Array<{ original: File; file: File; dataURL: any }>) => void;
   showDialogFileOrPhoto?: boolean;
   caputureINE?: boolean;
   zoomLeft?: boolean;
}

const MB = 1048576;
const mySwal = withReactContent(Swal);

export const imageCompress = async (file: File | Blob | any, INE: boolean = false): Promise<File> => {
   return new Promise((resolve, reject) => {
      new Compressor(file, {
         quality: INE ? 0.3 : 0.6,
         convertSize: 2.5 * MB,
         maxWidth: INE ? 1080 : 1920,
         maxHeight: INE ? 720 : 1080,
         success(result: any) {
            const compressedFile = new File([result], file.name, {
               type: result.type,
               lastModified: Date.now()
            });
            resolve(compressedFile);
         },
         error(err: any) {
            reject(err);
         }
      });
   });
};

export const setObjImg = (img: string | null | undefined, setImg: (arg0: { file: { name: string }; dataURL: string }[]) => void) => {
   if (["", null, undefined].includes(img)) return setImg([]);
   const imgObj = {
      file: {
         name: `${img}`
      },
      dataURL: `${env.API_URL_IMG}/${img}`
   };
   setImg([imgObj]);
};

const FileInputModerno: React.FC<FileInputProps> = ({
   xsOffset = null,
   col,
   idName,
   label,
   helperText,
   disabled,
   hidden,
   marginBottom,
   color,
   required,
   filePreviews = [],
   setFilePreviews,
   multiple,
   maxImages = -1,
   accept = "*",
   fileSizeMax = 1,
   showBtnCamera = false,
   handleUploadingFile,
   showDialogFileOrPhoto = false,
   caputureINE = false,
   zoomLeft = false,
   ...props
}) => {
   const formik: any = useFormikContext<any>();
   const error = formik.touched[idName] && formik.errors[idName] ? formik.errors[idName].toString() : null;
   const isError = Boolean(error);
   const [uploadProgress, setUploadProgress] = useState(0);
   const [ttShow, setTtShow] = useState("");
   const [fileSizeExceeded, setFileSizeExceeded] = useState(fileSizeMax * MB);
   const [confirmRemove, setConfirmRemove] = useState(true);
   const [fileInfo, setFileInfo] = useState(null);

   const inputFileRefMobile: any = useRef<HTMLInputElement | null>(null);
   const [openCameraFile, setOpenCameraFile] = useState(false);
   const [openDialog, setOpenDialog] = useState(false);

   const validationQuantityImages = () => {
      if (multiple) {
         if (maxImages != -1) {
            if (filePreviews.length >= maxImages) {
               Toast.Info(`Solo se permiten cargar ${maxImages} imagenes.`);
               return false;
            }
         }
      } else {
         if (filePreviews.length >= 1) {
            Toast.Info(`Solo se permite cargar una imagen.`);
            return false;
         }
      }
      return true;
   };

   const onDrop = useCallback(
      (acceptedFiles: File[]) => {
         if (!confirmRemove) return;
         setConfirmRemove(false);

         setFilePreviews([]);

         if (acceptedFiles && acceptedFiles.length > 0) {
            acceptedFiles.forEach((file: File | Blob | any) => {
               handleSetFile(file);
            });
         } else {
            Toast.Error("No hay archivos en el acceptedFiles");
         }
      },
      [confirmRemove, setFilePreviews]
   );

   const readFileAsDataURL = (file: File | Blob | any) => {
      return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onload = () => resolve(reader.result);
         reader.onerror = (error) => reject(error);

         // Para archivos que no son imágenes, podríamos usar URL.createObjectURL como alternativa
         if (!file.type.includes("image")) {
            // Para archivos grandes o no imágenes, usar object URL puede ser más eficiente
            const objectURL = URL.createObjectURL(file);
            resolve(objectURL);
         } else {
            // Para imágenes, usar DataURL para preview de calidad
            reader.readAsDataURL(file);
         }
      });
   };

   const handleSetFile = async (file: File | Blob | any) => {
      // Validación inicial de tamaño para todos los archivos
      if (file.size >= fileSizeExceeded) {
         if (filePreviews.length == 0) setConfirmRemove(true);
         Toast.Info(`el archivo pesa más de ${fileSizeMax}MB, su calidad bajara.`);
      }

      // Lógica para archivos de imagen
      if (file.type.includes("image")) {
         try {
            let newFile = file;

            // Comprimir solo si es imagen y excede el tamaño
            if (file.size >= fileSizeExceeded) {
               const fileCompressed = await imageCompress(file);
               newFile = fileCompressed;
            }

            const dataURL = await readFileAsDataURL(newFile);
            const preview = {
               original: file,
               file: newFile,
               dataURL
            };

            setFilePreviews([preview]);
            filePreviews = [preview];
            if (handleUploadingFile) handleUploadingFile(filePreviews);
         } catch (error) {
            console.error("Error al procesar la imagen:", error);
            Toast.Error(`Error al procesar la imagen: ${error}`);
         }
      }
      // Lógica para otros tipos de archivos (PDF, documentos, etc.)
      else {
         try {
            const dataURL = await readFileAsDataURL(file);
            const preview = {
               original: file,
               file: file, // Usamos el archivo original sin comprimir
               dataURL
            };
            // console.log("🚀 ~ handleSetFile ~ preview:", preview);

            setFilePreviews([preview]);
            filePreviews = [preview];
            if (handleUploadingFile) handleUploadingFile(filePreviews);
         } catch (error) {
            console.error("Error al leer el archivo:", error);
            Toast.Error(`Error al leer el archivo: ${error}`);
         }
      }
   };

   const handleGetFileCamera = async (camFile: { file: File; dataUrl: any } | File | Blob | any) => {
      try {
         setFilePreviews([]);
         setConfirmRemove(true);
         handleSetFile(camFile.file ? camFile.file : camFile);
      } catch (error) {
         console.log("🚀 ~ handleGetFileCamera ~ error:", error);
      }
   };

   const handleOnChangeFileInput = (e: { target: { files: string | any[] } } | any) => {
      const file = e.target.files.length > 0 ? e.target.files[0] : null;
      if (!file) return;
      handleGetFileCamera(file);
   };

   const handleRemoveImage = async (fileToRemove: File) => {
      if (disabled) return;

      mySwal.fire(QuestionAlertConfig(`¿Estas seguro de eliminar el archivo?`, "CONFIRMAR")).then(async (result) => {
         if (result.isConfirmed) {
            // Revocar Object URLs si existen para liberar memoria
            filePreviews.forEach((preview) => {
               if (preview.dataURL && preview.dataURL.startsWith("blob:")) {
                  URL.revokeObjectURL(preview.dataURL);
               }
            });

            setFilePreviews([]);
            setConfirmRemove(true);
         }
      });
   };

   const { getRootProps, getInputProps } = useDropzone({
      onDrop
   });

   const handleMouseEnter = () => {
      setTtShow("opacity-100 scale-100");
   };

   const handleMouseLeave = () => {
      setTtShow("opacity-0 scale-95");
   };

   const handleOpenDialog = () => {
      confirmRemove && setOpenDialog(true);
   };

   const handleCloseDialog = () => {
      setOpenDialog(false);
   };

   const handleSelectFile = async () => {
      setOpenCameraFile(false);
      setOpenDialog(false);
      inputFileRefMobile.current.click();
   };

   const handleSelectPhoto = async () => {
      setOpenCameraFile(true);
      setOpenDialog(false);
      inputFileRefMobile.current.click();
   };

   useEffect(() => {
      if (filePreviews.length == 0) setConfirmRemove(true);
      else setConfirmRemove(false);
   }, [idName, formik.values[idName], filePreviews]);

   // Función para determinar el tipo de archivo
   const getFileType = (file: File) => {
      // console.log("🚀 ~ getFileType ~ file.type:", file.type);
      if (file.type.includes("image")) return "image";
      if (file.type.includes("pdf")) return "pdf";
      if (file.type.includes("excel") || file.type.includes("csv") || file.type.includes("sheet")) return "excel";
      if (file.type.includes("word") || file.type.includes("document")) return "document";
      if (file.type.includes("text")) return "text";
      if (file.type.includes("zip") || file.type.includes("rar") || file.type.includes("7z")) return "archive";
      return "other";
   };

   // Clases base para el dropzone
   const getDropzoneClasses = () => {
      const baseClasses = `
         relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 ease-in-out
         cursor-pointer text-center hover:shadow-lg
         ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "bg-white"}
      `;

      if (isError || color === "red") {
         return `${baseClasses} border-red-500 bg-red-50 hover:bg-red-100`;
      }

      return `${baseClasses} border-blue-400 bg-blue-50 hover:bg-blue-100`;
   };

   return (
      <>
         <Grid
            size={{ xs: 12, md: col }}
            offset={{ xs: xsOffset }}
            sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: "center", mb: marginBottom ? marginBottom : 0 }}
         >
            <FormControl fullWidth>
               <div className="flex justify-between items-center mb-2">
                  <label htmlFor={idName} className={`text-sm font-medium ${isError ? "text-red-600" : color === "red" ? "text-red-600" : "text-gray-700"}`}>
                     {label}
                  </label>
                  <span className={`text-xs ${isError ? "text-red-600" : "text-gray-400"}`}>{required ? "Requerido" : "Opcional"}</span>
               </div>

               <Field name={idName} id={idName}>
                  {({ field, form }) => (
                     <>
                        <div className="w-full" onClick={isMobile && showDialogFileOrPhoto ? handleOpenDialog : undefined}>
                           <div
                              {...getRootProps({
                                 className: getDropzoneClasses(),
                                 style: { pointerEvents: disabled ? "none" : "auto" }
                              })}
                           >
                              {isMobile && showDialogFileOrPhoto ? (
                                 <input
                                    {...getInputProps()}
                                    onChange={confirmRemove ? handleOnChangeFileInput : undefined}
                                    type={confirmRemove ? "file" : "text"}
                                    ref={inputFileRefMobile}
                                    multiple={multiple}
                                    accept={accept}
                                    disabled={disabled}
                                    capture={openCameraFile && "environment"}
                                    className="hidden"
                                 />
                              ) : (
                                 <input
                                    {...getInputProps()}
                                    onChange={confirmRemove ? handleOnChangeFileInput : undefined}
                                    type={confirmRemove ? "file" : "text"}
                                    multiple={multiple}
                                    accept={accept}
                                    disabled={disabled}
                                    className="hidden"
                                 />
                              )}

                              {/* Contenido del dropzone */}
                              <div className="flex flex-col items-center justify-center space-y-4">
                                 {/* Icono de upload */}
                                 <div className={`p-3 rounded-full ${isError ? "bg-red-100" : "bg-blue-100"}`}>
                                    <svg className={`w-6 h-6 ${isError ? "text-red-500" : "text-blue-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                       />
                                    </svg>
                                 </div>

                                 {/* Texto principal */}
                                 {filePreviews.length === 0 && (
                                    <div className="text-center">
                                       <p className="text-gray-600 font-medium mb-1">Arrastra y suelta tus archivos aquí</p>
                                       <p className="text-gray-500 text-sm">
                                          o <span className="text-blue-600 font-medium">haz clic para seleccionar</span>
                                       </p>
                                    </div>
                                 )}

                                 {/* Vista previa de archivos */}
                                 {filePreviews.length > 0 && (
                                    <div className="w-full space-y-4">
                                       {filePreviews.map((preview) => {
                                          const fileType = getFileType(preview.file);
                                          // console.log("🚀 ~ FileInputModerno ~ fileType:", fileType);

                                          return (
                                             <div key={preview.file.name} className="relative group">
                                                {fileType === "image" ? (
                                                   // Preview para imágenes
                                                   <div className="bg-white rounded-lg p-4 shadow-sm border">
                                                      <div className="flex items-center space-x-3 mb-3">
                                                         <div className="p-2 bg-green-100 rounded-lg">
                                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                               <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                               />
                                                            </svg>
                                                         </div>
                                                         <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{preview.file.name}</p>
                                                            <p className="text-sm text-gray-500">{Math.round(preview.file.size / 1024)} KB</p>
                                                         </div>
                                                      </div>
                                                      <div className="relative">
                                                         <img
                                                            className="w-full h-64 object-contain rounded-lg border bg-gray-50"
                                                            src={preview.dataURL}
                                                            alt={preview.file.name}
                                                            onMouseEnter={handleMouseEnter}
                                                            onMouseLeave={handleMouseLeave}
                                                         />
                                                         {/* Tooltip para imagen */}
                                                         <div
                                                            className={`absolute top-0 ${
                                                               zoomLeft ? "left-0" : "right-0"
                                                            } w-96 bg-white shadow-2xl rounded-lg border transition-all duration-300 z-50 ${ttShow}`}
                                                         >
                                                            <img src={preview.dataURL} alt={preview.file.name} className="w-full h-96 object-contain rounded-lg" />
                                                         </div>
                                                      </div>
                                                   </div>
                                                ) : fileType === "pdf" ? (
                                                   // Preview para PDFs
                                                   <div className="bg-white rounded-lg p-4 shadow-sm border">
                                                      <div className="flex items-center space-x-3 mb-3">
                                                         <div className="p-2 bg-red-100 rounded-lg">
                                                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                               <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                               />
                                                            </svg>
                                                         </div>
                                                         <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{preview.file.name}</p>
                                                            <p className="text-sm text-gray-500">{Math.round(preview.file.size / 1024)} KB</p>
                                                         </div>
                                                      </div>
                                                      <div className="relative">
                                                         <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-100 rounded border">
                                                            <svg className="w-16 h-16 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                               <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                               />
                                                            </svg>
                                                            <p className="text-sm text-gray-600">PDF Document</p>
                                                            <p className="text-xs text-gray-500 mt-1">Haz clic para ver el contenido</p>
                                                         </div>
                                                         {/* Tooltip para PDF */}
                                                         <div
                                                            className={`absolute top-0 ${
                                                               zoomLeft ? "left-0" : "right-0"
                                                            } w-64 bg-white shadow-2xl rounded-lg border transition-all duration-300 z-50 ${ttShow}`}
                                                         >
                                                            <embed src={preview.dataURL} type="application/pdf" className="w-full h-96 rounded-lg" />
                                                         </div>
                                                      </div>
                                                   </div>
                                                ) : (
                                                   // Preview para otros tipos de archivos
                                                   <div className="bg-white rounded-lg p-4 shadow-sm border">
                                                      <div className="flex items-center space-x-3 mb-3">
                                                         <div className="p-2 bg-blue-100 rounded-lg">
                                                            <svg
                                                               className={`w-6 h-6 ${fileType === "excel" ? "text-green-600" : "text-blue-600"}`}
                                                               fill="none"
                                                               stroke="currentColor"
                                                               viewBox="0 0 24 24"
                                                            >
                                                               <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                               />
                                                            </svg>
                                                         </div>
                                                         <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{preview.file.name}</p>
                                                            <p className="text-sm text-gray-500">
                                                               {Math.round(preview.file.size / 1024)} KB • {fileType.toUpperCase()}
                                                            </p>
                                                         </div>
                                                      </div>
                                                      <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-100 rounded border">
                                                         <svg className="w-12 h-12 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                               strokeLinecap="round"
                                                               strokeLinejoin="round"
                                                               strokeWidth={2}
                                                               d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                            />
                                                         </svg>
                                                         <p className="text-sm text-gray-600">{fileType.toUpperCase()} File</p>
                                                         <p className="text-xs text-gray-500 mt-1">No hay preview disponible</p>
                                                      </div>
                                                   </div>
                                                )}

                                                {/* Botón de eliminar */}
                                                {!disabled && (
                                                   <button
                                                      type="button"
                                                      onClick={(e) => {
                                                         e.stopPropagation();
                                                         handleRemoveImage(preview.file);
                                                      }}
                                                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                                      onMouseEnter={handleMouseEnter}
                                                      onMouseLeave={handleMouseLeave}
                                                   >
                                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                      </svg>
                                                   </button>
                                                )}
                                             </div>
                                          );
                                       })}
                                    </div>
                                 )}
                              </div>
                           </div>

                           {/* Información adicional */}
                           <div className="mt-2 flex flex-col items-center space-y-2">
                              <p className="text-xs text-gray-500 text-center">
                                 Tamaño máximo del archivo: <b>{fileSizeMax}MB MAX.</b>
                              </p>

                              {!disabled && showBtnCamera && (
                                 <div className="flex justify-center">
                                    <CameraInput getFile={handleGetFileCamera} caputureINE={caputureINE} />
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* Mensaje de error/helper */}
                        <p className={`mt-1 text-xs ${isError ? "text-red-600" : helperText ? "text-gray-500" : "text-transparent"}`}>
                           {isError ? error : helperText ? helperText : "."}
                        </p>
                     </>
                  )}
               </Field>
            </FormControl>
         </Grid>

         {isMobile && showDialogFileOrPhoto && (
            <DialogSelectMode open={openDialog} onClose={handleCloseDialog} onSelectFile={handleSelectFile} onSelectPhoto={handleSelectPhoto} />
         )}
      </>
   );
};

export default FileInputModerno;
