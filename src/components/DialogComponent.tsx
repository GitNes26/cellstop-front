import React, { forwardRef, useEffect, useLayoutEffect, useState, ReactNode } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import { Box, Button, DialogActions, IconButton, Toolbar, Tooltip } from "@mui/material";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { isMobile } from "react-device-detect";
import { useGlobalContext } from "../context/GlobalContext";
import { printContent } from "../utils/Formats";
import { ClearRounded, FullscreenExitRounded, FullscreenRounded, PrintRounded } from "@mui/icons-material";

// Tipos para las props
interface DialogComponentProps {
   children: ReactNode;
   open: boolean;
   setOpen: (open: boolean) => void;
   modalTitle?: string | any;
   maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
   height?: string | number;
   dialogActions?: boolean | null;
   formikRef?: any; // Puedes tipar esto mejor con FormikProps si estás usando Formik
   textBtnSubmit?: string;
   titlePrint?: string;
   fullScreen?: boolean;
   btnPrint?: boolean;
}

// Tipo para el componente Transition
const Transition = forwardRef<HTMLDivElement, any>(function Transition(props, ref) {
   return <Slide children={undefined} direction="up" ref={ref} {...props} />;
});

const DialogComponent: React.FC<DialogComponentProps> = ({
   children,
   open = false,
   setOpen,
   modalTitle = "",
   maxWidth = "lg",
   height,
   dialogActions = null,
   formikRef,
   textBtnSubmit = "Guardar",
   titlePrint = "Solicitud",
   fullScreen = isMobile,
   btnPrint = false
}) => {
   const mySwal = withReactContent(Swal);
   const [fullScreenDialog, setFullScreenDialog] = useState<boolean>(fullScreen);
   const { setIsLoading } = useGlobalContext();

   const handleClose = () => {
      setOpen(false);
   };

   useEffect(() => {
      // console.log("formikRef", formikRef);
      // console.log("estoy en el modal", voucher);
   }, []);

   useLayoutEffect(() => {
      // console.log("estoy en el useLayoutEffect", drivers);
   }, []);

   return (
      <div>
         <Dialog
            open={open}
            TransitionComponent={Transition}
            maxWidth={maxWidth}
            keepMounted
            fullWidth
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{ backgroundColor: "transparent", borderRadius: 5, zIndex: 1201 }}
            fullScreen={fullScreenDialog}
         >
            <DialogTitle my={0} py={0} sx={{ padding: 0, backgroundColor: "primary.main" }} className="flex flex-col py-1 text-base-content">
               <Toolbar sx={{ py: 0 }}>
                  <Typography variant={isMobile ? "h4" : "h2"} my={0} py={-10} sx={{ ml: 2, flex: 1, py: 0, pt: 0, pb: 0, padding: "0px 10px !important" }}>
                     {modalTitle}
                  </Typography>

                  {btnPrint && (
                     <Tooltip title={`Imprimir Reporte`} placement="top">
                        <IconButton color="inherit" onClick={() => printContent(titlePrint, "reportPaper")}>
                           <PrintRounded />
                        </IconButton>
                     </Tooltip>
                  )}

                  <Tooltip title={fullScreenDialog ? `Minimizar ventana` : `Maximizar ventana`} placement="top">
                     <IconButton color="inherit" onClick={() => setFullScreenDialog(!fullScreenDialog)}>
                        {fullScreenDialog ? <FullscreenExitRounded /> : <FullscreenRounded />}
                     </IconButton>
                  </Tooltip>

                  <Tooltip title={`Cerrar ventana`} placement="top">
                     <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
                        <ClearRounded />
                     </IconButton>
                  </Tooltip>
               </Toolbar>
            </DialogTitle>

            <DialogContent sx={{ pb: 0, paddingTop: 2, height: height, maxHeight: "90vh" }} className="">
               <Box sx={{ mt: 1, height: fullScreenDialog ? "90%" : height, maxHeight: "100%" }}>{children}</Box>
            </DialogContent>

            {dialogActions && formikRef && (
               <DialogActions>
                  <Button type="submit" disabled={formikRef.isSubmitting} variant="contained" fullWidth size="large">
                     {textBtnSubmit}
                  </Button>
               </DialogActions>
            )}
         </Dialog>
      </div>
   );
};

export default DialogComponent;
//--------- EN JS ------

// import React from "react";
// import Dialog from "@mui/material/Dialog";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import Slide from "@mui/material/Slide";

// import Typography from "@mui/material/Typography";
// import { forwardRef, useEffect, useLayoutEffect, useState } from "react";
// import { Box, Button, DialogActions, IconButton, Toolbar, Tooltip } from "@mui/material";
// import withReactContent from "sweetalert2-react-content";
// import Swal from "sweetalert2";
// import icons from ".././constant/icons";
// import { isMobile } from "react-device-detect";
// import { useGlobalContext } from "../context/GlobalContext.jsx";
// import { printContent } from "../utils/Formats";
// import { ClearRounded, FullscreenExitRounded, FullscreenRounded, PrintRounded } from "@mui/icons-material";

// // const Transition = forwardRef(function Transition(props, ref) {
// //    return <Slide /* children={undefined} */ direction="down" ref={ref} {...props} />;
// // });

// const Transition = React.forwardRef(function Transition(props, ref) {
//    return <Slide direction="up" ref={ref} {...props} />;
// });

// const DialogComponent = ({
//    children,
//    open = false,
//    setOpen,
//    modalTitle = "",
//    maxWidth = "lg",
//    height,
//    dialogActions = null,
//    formikRef,
//    textBtnSubmit,
//    titlePrint = "Solicitud",
//    fullScreen = isMobile ? true : false,
//    btnPrint = false
// }) => {
//    const mySwal = withReactContent(Swal);
//    const [fullScreenDialog, setFullScreenDialog] = useState(fullScreen);
//    const { setIsLoading } = useGlobalContext();

//    const handleClose = () => {
//       setOpen(false);
//    };

//    useEffect(() => {
//       // console.log("formikRef", formikRef);
//       // console.log("estoy en el modal", voucher);
//    }, []);
//    useLayoutEffect(() => {
//       // console.log("estoy en el useLayoutEffect", drivers);
//    }, []);

//    return (
//       <div>
//          <Dialog
//             open={open}
//             slots={{
//                transition: Transition
//             }}
//             maxWidth={maxWidth}
//             keepMounted
//             fullWidth
//             onClose={handleClose}
//             aria-describedby="alert-dialog-slide-description"
//             sx={{ backgroundColor: "transparent", borderRadius: 5, zIndex: 1201 }}
//             fullScreen={fullScreenDialog}
//          >
//             <DialogTitle my={0} py={0} sx={{ padding: 0, backgroundColor: "primary.main" }} className="flex flex-col py-1 text-base-content">
//                <Toolbar sx={{ py: 0 }}>
//                   <Typography variant="h2" my={0} py={-10} /* color={gpcDark} */ sx={{ ml: 2, flex: 1, py: 0, pt: 0, pb: 0, padding: "0px 24px !important" }}>
//                      {modalTitle}
//                   </Typography>
//                   {/* <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div">
//                   {"title"}
//                </Typography> */}
//                   {/* <Tooltip title={`Exportar Reporte a PDF`} placement="top">
//                   <IconButton color="inherit" onClick={() => downloadPDF("reportPaper")}>
//                      <IconFileTypePdf color="red" />
//                   </IconButton>
//                </Tooltip>*/}
//                   {btnPrint && (
//                      <Tooltip title={`Imprimir Reporte`} placement="top">
//                         <IconButton color="inherit" onClick={() => printContent(titlePrint, "reportPaper")}>
//                            <PrintRounded />
//                         </IconButton>
//                      </Tooltip>
//                   )}
//                   <Tooltip title={fullScreenDialog ? `Minimizar ventana` : `Maximizar ventana`} placement="top">
//                      <IconButton color="inherit" onClick={() => setFullScreenDialog(!fullScreenDialog)}>
//                         {fullScreenDialog ? <FullscreenExitRounded /> : <FullscreenRounded />}
//                      </IconButton>
//                   </Tooltip>
//                   <Tooltip title={`Cerrar ventana`} placement="top">
//                      <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
//                         <ClearRounded />
//                      </IconButton>
//                   </Tooltip>
//                </Toolbar>
//             </DialogTitle>
//             <DialogContent sx={{ pb: 0, paddingTop: 2, height: height, maxHeight: "90vh" }} className="">
//                <Box sx={{ mt: 1, height: fullScreenDialog ? "90%" : height, maxHeight: "100%" }}>{children}</Box>
//             </DialogContent>
//             {dialogActions && (
//                <DialogActions>
//                   <Button
//                      type="submit"
//                      disabled={formikRef.isSubmitting}
//                      loading={formikRef.isSubmitting}
//                      // loadingPosition="start"
//                      variant="contained"
//                      fullWidth
//                      size="large"
//                   >
//                      {textBtnSubmit}
//                   </Button>
//                </DialogActions>
//             )}
//          </Dialog>
//       </div>
//    );
// };
// export default DialogComponent;
