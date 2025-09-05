import { styled, useColorScheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import env from "../constant/env";
import SplashLoader from "./../components/SplashLoader";
import { Outlet } from "react-router-dom";

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
            </Box>
         </Box>
      </ThemeProvider>
   );
}
