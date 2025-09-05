import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
// import Input from "./Input";
import { base64ToFile } from "../../utils/Formats";
import { imageCompress } from "./FileInput";
import { Button } from "@mui/material";
import DialogComponent from "../DialogComponent";

interface FirmPadProps {
   onSave: (signatureData: File) => void;
   fullWidth?: boolean;
   width?: number;
   height?: number;
   penColor?: string;
   penWidth?: number;
   inDialog?: boolean;
}

const FirmPad: React.FC<FirmPadProps> = ({ onSave, fullWidth, width = 400, height = 200, penColor = "#0000FF", penWidth = 2, inDialog = true }) => {
   const sigCanvas = useRef<SignatureCanvas | null>(null);
   const [currentColor, setCurrentColor] = useState(penColor);
   const [currentWidth, setCurrentWidth] = useState(penWidth);
   const [isEmpty, setIsEmpty] = useState(true);
   const [openDialogFirm, setOpenDialogFirm] = useState(false);
   const [firmFile, setFirmFile] = useState(null);
   const [signed, setSigned] = useState(false);

   const clearSignature = () => {
      sigCanvas.current?.clear();
      setIsEmpty(true);
      setFirmFile(null);
   };

   const getTrimmedCanvas = (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return canvas;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data, width, height } = imageData;

      let top = height,
         bottom = 0,
         left = width,
         right = 0;

      for (let y = 0; y < height; y++) {
         for (let x = 0; x < width; x++) {
            const alpha = data[(y * width + x) * 4 + 3];
            if (alpha > 0) {
               if (x < left) left = x;
               if (x > right) right = x;
               if (y < top) top = y;
               if (y > bottom) bottom = y;
            }
         }
      }

      const trimmedWidth = right - left;
      const trimmedHeight = bottom - top;
      if (trimmedWidth <= 0 || trimmedHeight <= 0) return canvas;

      const trimmedCanvas = document.createElement("canvas");
      trimmedCanvas.width = trimmedWidth;
      trimmedCanvas.height = trimmedHeight;
      const trimmedCtx = trimmedCanvas.getContext("2d");
      if (!trimmedCtx) return canvas;

      trimmedCtx.putImageData(ctx.getImageData(left, top, trimmedWidth, trimmedHeight), 0, 0);
      return trimmedCanvas;
   };

   const saveSignature = async () => {
      if (!sigCanvas.current || sigCanvas.current.isEmpty()) return;
      setSigned(true);
      console.log("firmado");
      const originalCanvas = sigCanvas.current.getCanvas();
      const trimmedCanvas = getTrimmedCanvas(originalCanvas);
      const signatureDataBase64String = trimmedCanvas.toDataURL("image/png");
      const file = await base64ToFile(signatureDataBase64String, "firm.png");
      console.log("🚀 ~ saveSignature ~ file:", file);
      const fileCompress = await imageCompress(file);
      clearSignature();
      onSave(fileCompress);

      const reader = new FileReader();
      reader.onload = () => {
         setFirmFile(reader.result); // Guarda el Base64 en el estado
      };
      reader.readAsDataURL(file);

      setOpenDialogFirm(false);
   };

   const Content = () => (
      <div className="flex flex-col items-center w-full h-full p-2 mb-2 bg-white border shadow-md rounded-xl">
         <h1 className="mb-2 text-lg font-semibold">Firma Digital</h1>
         <div className="w-full border-2 border-gray-300 rounded-md h-5/6">
            <SignatureCanvas
               ref={sigCanvas}
               penColor={currentColor}
               minWidth={currentWidth}
               maxWidth={currentWidth}
               canvasProps={{ className: "w-full h-full border border-gray-400" }}
               onEnd={() => setIsEmpty(false)}
            />
         </div>
         <div className="flex gap-4 mt-4">
            <h3>Color</h3>
            <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} className="w-20 p-1 border rounded-md input" />
            <h3>Grosor</h3>
            <div className="w-full max-w-xs mr-5">
               <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={currentWidth}
                  onChange={(e) => setCurrentWidth(Number(e.target.value))}
                  className="w-full range active:range-primary range-xs"
               />
               <div className="flex justify-between px-2.5 -mt-1 text-xs">
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
               </div>
               <div className="flex justify-between px-2.5 mt-0 text-xs">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
               </div>
            </div>
            <Button sx={{ py: 0, my: 0, px: 4 }} onClick={clearSignature} variant="outlined" disabled={isEmpty}>
               LIMPIAR
            </Button>
            <Button sx={{ py: 0, my: 0, px: 4 }} onClick={saveSignature} variant="contained" disabled={isEmpty}>
               GUARDAR
            </Button>
         </div>
      </div>
   );

   return (
      // <div className="flex flex-col items-center w-full max-w-lg p-2 bg-white border shadow-md rounded-xl">
      <>
         {inDialog ? (
            <>
               <Button
                  variant="text"
                  color={!signed ? "primary" : "success"}
                  sx={{ fontWeight: "bold", fontSize: "large" }}
                  onClick={() => setOpenDialogFirm(true)}
                  fullWidth={fullWidth}
               >
                  {!signed ? "Firmar" : "Firmado"}
               </Button>
               <DialogComponent
                  open={openDialogFirm}
                  setOpen={setOpenDialogFirm}
                  fullScreen={true}
                  modalTitle=""
                  height={undefined}
                  formikRef={undefined}
                  textBtnSubmit={undefined}
               >
                  <Content />
               </DialogComponent>
            </>
         ) : (
            <Content />
         )}
      </>
   );
};

export default FirmPad;
