import React, { useEffect, useRef } from "react";
// import { TbBan, TbCameraUp, TbPhotoSearch } from "react-icons/tb";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { CameraEnhanceRounded, ImageSearchRounded, NotInterestedRounded } from "@mui/icons-material";

const DialogSelectMode = ({ open, onClose, name = "myModal", onSelectFile, onSelectPhoto }) => {
   return (
      <Dialog open={open} onClose={onClose}>
         <DialogTitle className="bg-base-300 text-base-content" sx={{ textAlign: "center", pt: 1, pb: 0 }} variant="h6">
            Selecciona una opción
         </DialogTitle>
         <DialogActions className="bg-base-200">
            <Button onClick={onSelectFile} className="flex flex-col justify-center align-middle hover:scale-95">
               <ImageSearchRounded fontSize="large" /> Subir Archivo
            </Button>
            <Button onClick={onSelectPhoto} className="flex flex-col justify-center align-middle hover:scale-95">
               <CameraEnhanceRounded fontSize="large" /> Tomar Foto
            </Button>
            <Button onClick={onClose} color="inherit" className="flex flex-col justify-center align-middle hover:scale-95 btn-outline">
               <NotInterestedRounded fontSize="large" /> Cancelar
            </Button>
         </DialogActions>
      </Dialog>
   );
};
export default DialogSelectMode;
