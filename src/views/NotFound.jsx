import { ArrowBack, Warning, SearchOff, ReplayOutlined } from "@mui/icons-material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import { Box, Button, Typography, Container, Paper, Grid } from "@mui/material";
import { motion } from "framer-motion";

const NotFound = () => {
   const { setIsLoading } = useGlobalContext();
   const navigate = useNavigate();

   useEffect(() => {
      setIsLoading(false);
   }, []);

   const handleGoBack = () => {
      navigate(-1);
   };

   return (
      <Box
         className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
         sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 4
         }}
      >
         <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
               {/* Ilustración/Animación */}
               <Grid size={{ xs: 12, md: 4 }}>
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="flex justify-center">
                     <Box
                        sx={{
                           position: "relative",
                           width: "100%",
                           maxWidth: 400,
                           height: 300
                        }}
                     >
                        {/* Círculos de fondo */}
                        <Box
                           sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: 200,
                              height: 200,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)",
                              animation: "pulse 2s infinite"
                           }}
                        />
                        <Box
                           sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: 150,
                              height: 150,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                              animation: "pulse 2s infinite 0.5s"
                           }}
                        />

                        {/* Icono principal */}
                        <motion.div
                           animate={{
                              y: [0, -10, 0],
                              rotate: [0, -5, 0]
                           }}
                           transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                           }}
                           className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                           <Box
                              sx={{
                                 width: 120,
                                 height: 120,
                                 borderRadius: "50%",
                                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                                 boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)"
                              }}
                           >
                              <SearchOff
                                 sx={{
                                    fontSize: 48,
                                    color: "white"
                                 }}
                              />
                           </Box>
                        </motion.div>

                        {/* Elementos flotantes */}
                        <motion.div
                           animate={{
                              y: [0, -20, 0],
                              x: [0, 10, 0]
                           }}
                           transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.2
                           }}
                           className="absolute top-1/4 left-1/4"
                        >
                           <Warning
                              sx={{
                                 fontSize: 32,
                                 color: "#d69e2e"
                              }}
                           />
                        </motion.div>

                        <motion.div
                           animate={{
                              y: [0, 15, 0],
                              x: [0, -5, 0]
                           }}
                           transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.4
                           }}
                           className="absolute bottom-1/4 right-1/4"
                        >
                           <Box
                              sx={{
                                 width: 24,
                                 height: 24,
                                 borderRadius: "50%",
                                 backgroundColor: "#38a169"
                              }}
                           />
                        </motion.div>
                     </Box>
                  </motion.div>
               </Grid>

               {/* Contenido textual */}
               <Grid size={{ xs: 12, md: 8 }}>
                  <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                     <Paper
                        elevation={0}
                        sx={{
                           p: 6,
                           background: "rgba(255, 255, 255, 0.9)",
                           backdropFilter: "blur(20px)",
                           border: "1px solid rgba(255, 255, 255, 0.2)",
                           borderRadius: 4,
                           textAlign: { xs: "center", md: "left" }
                        }}
                     >
                        {/* Badge de error */}
                        <Box
                           sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              px: 2,
                              py: 1,
                              borderRadius: 2,
                              backgroundColor: "#fed7d7",
                              color: "#c53030",
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              mb: 3
                           }}
                        >
                           <Warning sx={{ fontSize: 16, mr: 1 }} />
                           Error 404
                        </Box>

                        {/* Título principal */}
                        <Typography
                           variant="h1"
                           sx={{
                              fontSize: { xs: "3rem", md: "4rem" },
                              fontWeight: 800,
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              backgroundClip: "text",
                              WebkitBackgroundClip: "text",
                              color: "transparent",
                              mb: 2
                           }}
                        >
                           Página No Encontrada
                        </Typography>

                        {/* Subtítulo */}
                        <Typography
                           variant="h5"
                           sx={{
                              color: "text.secondary",
                              fontWeight: 400,
                              mb: 3,
                              lineHeight: 1.6
                           }}
                        >
                           Lo sentimos, no pudimos encontrar la página que estás buscando en nuestro sistema de distribución.
                        </Typography>

                        {/* Descripción */}
                        <Typography
                           variant="body1"
                           sx={{
                              color: "text.secondary",
                              mb: 4,
                              lineHeight: 1.7
                           }}
                        >
                           Es posible que la dirección URL haya cambiado, la página haya sido eliminada o no tengas los permisos necesarios para acceder a este recurso
                           en nuestra plataforma de gestión de productos.
                        </Typography>

                        {/* Acciones */}
                        <Box
                           sx={{
                              display: "flex",
                              gap: 2,
                              flexDirection: { xs: "column", sm: "row" },
                              justifyContent: { xs: "center", md: "flex-start" }
                           }}
                        >
                           <Button
                              variant="contained"
                              size="large"
                              startIcon={<ArrowBack />}
                              onClick={handleGoBack}
                              sx={{
                                 py: 1.5,
                                 px: 4,
                                 borderRadius: 3,
                                 fontSize: "1rem",
                                 fontWeight: 600,
                                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                 boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                                 "&:hover": {
                                    background: "linear-gradient(135deg, #5a6fd8 0%, #6a42a0 100%)",
                                    boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                                    transform: "translateY(-2px)"
                                 },
                                 transition: "all 0.3s ease"
                              }}
                           >
                              Volver a la Página Anterior
                           </Button>

                           <Button
                              variant="outlined"
                              size="large"
                              onClick={() => navigate("/app")}
                              sx={{
                                 py: 1.5,
                                 px: 4,
                                 borderRadius: 3,
                                 fontSize: "1rem",
                                 fontWeight: 600,
                                 borderColor: "#667eea",
                                 color: "#667eea",
                                 "&:hover": {
                                    backgroundColor: "#667eea10",
                                    borderColor: "#5a6fd8",
                                    transform: "translateY(-2px)"
                                 },
                                 transition: "all 0.3s ease"
                              }}
                           >
                              Ir a página principal
                           </Button>
                        </Box>
                        <Button
                           variant="outlined"
                           size="large"
                           startIcon={<ReplayOutlined />}
                           fullWidth
                           onClick={() => window.location.reload()}
                           sx={{
                              mt: 2,
                              py: 1.5,
                              px: 4,
                              borderRadius: 3,
                              fontSize: "1rem",
                              fontWeight: 600,
                              borderColor: "#667eea",
                              color: "#667eea",
                              "&:hover": {
                                 backgroundColor: "#667eea10",
                                 borderColor: "#5a6fd8",
                                 transform: "translateY(-2px)"
                              },
                              transition: "all 0.3s ease"
                           }}
                        >
                           Recargar Página
                        </Button>

                        {/* Información adicional */}
                        <Box
                           sx={{
                              mt: 4,
                              p: 3,
                              borderRadius: 2,
                              backgroundColor: "#ebf8ff",
                              borderLeft: "4px solid #4299e1"
                           }}
                        >
                           <Typography
                              variant="body2"
                              sx={{
                                 color: "#2b6cb0",
                                 fontWeight: 500,
                                 display: "flex",
                                 alignItems: "center",
                                 gap: 1
                              }}
                           >
                              💡 <strong>Sugerencia:</strong> Verifica la URL o contacta al administrador del sistema si crees que esto es un error.
                           </Typography>
                        </Box>
                     </Paper>
                  </motion.div>
               </Grid>
            </Grid>
         </Container>

         {/* Estilos de animación */}
         <style jsx>{`
            @keyframes pulse {
               0%,
               100% {
                  opacity: 1;
                  transform: translate(-50%, -50%) scale(1);
               }
               50% {
                  opacity: 0.7;
                  transform: translate(-50%, -50%) scale(1.05);
               }
            }
         `}</style>
      </Box>
   );
};

export default NotFound;
