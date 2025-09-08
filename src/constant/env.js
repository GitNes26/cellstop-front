import { createTheme } from "@mui/material";

const env = {
   APP_KEY: "local", // Clave para WebSocket
   VERSION: import.meta.env.VITE_VERSION,
   API_URL: import.meta.env.VITE_API_URL,
   API_URL_IMG: import.meta.env.VITE_API_URL_IMG,
   NAME_SYSTEM: "Mi Sistema",
   // API_CP: import.meta.env.VITE_API_CP,
   // API_KEY_ORC: import.meta.env.VITE_API_KEY_ORC
   TRANSITION_TIME: "0.3s",
   THEME: createTheme({
      cssVariables: {
         colorSchemeSelector: "data-color-scheme"
      },
      colorSchemes: {
         light: {
            palette: {
               background: {
                  default: "#eeeeee", //BG Main
                  paper: "#f5f5f5" //Nav y Side
               },
               primary: {
                  main: "#034AAB"
               }
            },
            shape: {
               borderRadius: 12
            }
         },
         dark: {
            palette: {
               background: {
                  default: "#31363F", //"#424242", //BG Main
                  paper: "#222831" //"#212121", //Nav y Side
               },
               primary: {
                  main: "#1B2430"
               }
            },
            shape: {
               borderRadius: 12
            }
         }
      },

      breakpoints: {
         values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536
         }
      }
      //  transitions: {
      //     duration: {
      //        shortest: 1500,
      //        shorter: 2000,
      //        short: 2500,
      //        standard: 3000, // 300ms por defecto
      //        complex: 3750,
      //        enteringScreen: 2250,
      //        leavingScreen: 1950,
      //     },
      //  },
   })
};
export default env;
