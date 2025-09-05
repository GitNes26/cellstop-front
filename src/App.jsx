import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import Loading from "./components/Loading";
import LinearLoading from "./components/LinearLoading";
import { SnackbarProvider } from "notistack";
import { useGlobalContext } from "./context/GlobalContext";
import { CheckCircle, Error, Info, TaskAltRounded, Warning } from "@mui/icons-material";
import { Paper } from "@mui/material";
import { isMobile } from "react-device-detect";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect } from "react";
import echo from "./utils/Notifications";

function Copyright() {
   return (
      <Typography
         variant="body2"
         align="center"
         sx={{
            color: "text.secondary"
         }}
      >
         {"Copyright © "}
         <Link color="inherit" href="https://mui.com/">
            Your Website
         </Link>{" "}
         {new Date().getFullYear()}
         {"."}
      </Typography>
   );
}

export default function App({}) {
   const { isLoading } = useGlobalContext();

   useEffect(() => {
      // echo.private(`user.${user.id}`).listen(".new-notification", (e) => {
      //    console.log("Nueva notificación:", e.notification);
      // });
   }, []);

   return (
      <>
         <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SnackbarProvider
               maxSnack={5}
               anchorOrigin={{ horizontal: isMobile ? "center" : "right", vertical: "bottom" }}
               preventDuplicate
               // iconVariant={{
               //    success: (
               //       <Paper sx={{ borderRadius: 1000 }}>
               //          <TaskAltRounded fontSize="large" sx={{ p: 1 }} />
               //       </Paper>
               //    ),
               //    error: (
               //       <Paper sx={{ borderRadius: 1000 }}>
               //          <Error fontSize="small" sx={{ mr: 1 }} />
               //       </Paper>
               //    ),
               //    warning: (
               //       <Paper sx={{ borderRadius: 1000 }}>
               //          <Warning fontSize="small" sx={{ mr: 1 }} />
               //       </Paper>
               //    ),
               //    info: (
               //       <Paper sx={{ borderRadius: 1000 }}>
               //          <Info fontSize="small" sx={{ mr: 1 }} />
               //       </Paper>
               //    ),
               // }}
               style={{
                  // color: "white",
                  borderRadius: 15,
                  fontWeight: "bold"
                  // zIndex: 999999
               }}
            >
               <Loading open={isLoading} animation="bounce" />
               <RouterProvider router={router} fallbackElement={<LinearLoading />} />
            </SnackbarProvider>
         </LocalizationProvider>
      </>
   );
}
