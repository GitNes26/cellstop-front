import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import AnimatedBackground from "../views/auth/AnimatedBackground";
import LoginForms from "../views/auth/LoginForms";
import { env } from "../constant";

const AuthLayout = ({}) => {
   return (
      <ThemeProvider theme={env.THEME}>
         <CssBaseline />
         <main className="min-h-screen relative overflow-hidden">
            {/* <AnimatedBackground /> */}
            {/* <div className="relative z-10 min-h-screen flex items-center justify-center p-4"> */}
               <LoginForms />
            {/* </div> */}
         </main>
      </ThemeProvider>
   );
};

export default AuthLayout;
