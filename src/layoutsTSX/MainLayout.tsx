import { styled, useColorScheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./SideBar";
import env from "../constant/env";

const DrawerHeader = styled("div")(({ theme }) => ({
   display: "flex",
   alignItems: "center",
   justifyContent: "flex-end",
   padding: theme.spacing(0, 1),
   // necessary for content to be below app bar
   ...theme.mixins.toolbar,
}));

export default function MainLayout() {
   const { mode } = useColorScheme();

   return (
      <ThemeProvider theme={env.THEME} defaultMode={mode}>
         <Box sx={{ display: "flex", transition: env.TRANSITION_TIME }}>
            <CssBaseline />
            {/* Navbar */}
            <Navbar />

            {/* Sidebar */}
            <Sidebar />
            {/* Contenido */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
               <DrawerHeader />
            </Box>
         </Box>
      </ThemeProvider>
   );
}
