import { styled, useColorScheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import env from "../constant/env";
import SplashLoader from "./../components/SplashLoader";
import { Outlet } from "react-router-dom";
import CountdownSession from "../components/CountdownSession";
import { useAuthContext } from "../context/AuthContext";

const DrawerHeader = styled("div")(({ theme }) => ({
   display: "flex",
   alignItems: "center",
   justifyContent: "flex-end",
   padding: theme.spacing(0, 1),
   // backgroundColor:"blue",
   // necessary for content to be below app bar
   ...theme.mixins.toolbar
}));

export default function MainLayout() {
   const { mode, setMode } = useColorScheme();
   const { logout } = useAuthContext();

   return (
      <ThemeProvider theme={env.THEME}>
         <Box sx={{ display: "flex", transition: env.TRANSITION_TIME }}>
            <CssBaseline />
            {/* <SplashLoader /> */}
            {/* Navbar */}
            <Navbar />

            {/* Sidebar */}
            <Sidebar />
            {/* Contenido */}
            <Box component="main" sx={{ flexGrow: 1, p: 2, width: "82vw" }}>
               <DrawerHeader />
               <Outlet />
               {/* <CountdownSession
                  startDate={new Date()}
                  // endDate={new Date("2026-02-04T00:00:00")}
                  endDate={new Date("2026-02-06T00:00:00")}
                  title="TIEMPO DE PRUBEA RESTANTE"
                  description={"al terminar el tiempo su acceso será removido hasta completar el pago"}
                  showPersistentCounter
                  autoLogoutOnExpire
                  onLogout={logout}
               /> */}
            </Box>
         </Box>
      </ThemeProvider>
   );
}
