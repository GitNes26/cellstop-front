import React, { useState, useRef } from "react";
// import Tesseract from "tesseract.js";
import img from "../assets/images/INEs/ine-fake-2.png";
import axios from "axios";
import Toast from "../utils/Toast";
import { CameraInput, FileInput } from "./forms";
import { imageCompress } from "./forms/FileInput";
import { useRegisterContext } from "../context/RegisterContext";

const CaptureINE = ({ getAnnotations, img, setImg }) => {
   const { formikRef } = useRegisterContext();

   const [text, setText] = useState("");
   const [loading, setLoading] = useState(false);
   const fileInputRef = useRef(null);
   const canvasRef = useRef(null);

   const handleUpload = async (filePreviews, byCam = false) => {
      // const file = event.target.files[0];
      // console.log("🚀 ~ handleUpload ~ filePreviews:", filePreviews);
      const file = byCam ? filePreviews.file : filePreviews[0].original;

      if (!file) {
         Toast.Error("Por favor, selecciona una imagen primero.");
         return;
      }
      let newFile = file;
      const fileCompressed = await imageCompress(file, true);
      newFile = fileCompressed;

      setLoading(true);

      // Convertir la imagen a base64
      const reader = new FileReader();
      reader.readAsDataURL(newFile);
      reader.onload = async () => {
         const base64Image = reader.result.split(",")[1];

         try {
            // Realizar la solicitud a la API de Google Vision
            const response = await axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${import.meta.env.VITE_API_KEY_ORC}`, {
               requests: [
                  {
                     image: {
                        content: base64Image
                     },
                     features: [
                        {
                           type: "TEXT_DETECTION"
                        }
                     ]
                  }
               ]
            });
            // console.log("🚀 ~ reader.onload= ~ response:", response);

            // Procesar la respuesta
            const annotations = response.data.responses[0].textAnnotations;
            // console.log("🚀 ~ reader.onload= ~ annotations:", annotations);
            if (annotations && annotations.length > 0) {
               getAnnotations && getAnnotations(annotations[0].description);
            } else {
               setText("No se encontró texto en la imagen.");
            }
         } catch (error) {
            console.error("Error al realizar OCR con Google Vision:", error);
            setText("Ocurrió un error al realizar el OCR.");
         }

         setLoading(false);
      };
   };

   return (
      <FileInput
         col={6}
         idName="img_ine"
         label="INE"
         filePreviews={img}
         setFilePreviews={setImg}
         multiple={false}
         accept={"image/*"}
         handleUploadingFile={handleUpload}
         fileSizeMax={3}
         showBtnCamera={true}
         caputureINE
         // showDialogFileOrPhoto={true}
      />
   );
};

export default CaptureINE;
