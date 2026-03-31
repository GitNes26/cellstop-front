import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, Avatar, Badge, IconButton, useTheme, useMediaQuery, Button } from "@mui/material";
import {
   LocalShipping,
   Store,
   Assessment,
   QrCode,
   Receipt,
   Group,
   Inventory,
   TrendingUp,
   Notifications,
   AccountCircle,
   Menu,
   Add,
   Speed,
   LocationOn,
   CheckCircle,
   Schedule,
   Storefront,
   SignalCellularNoSimRounded,
   SimCardRounded,
   OutboxRounded
} from "@mui/icons-material";
import Toast from "../../utils/Toast.js";
import { useLayoutEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext.jsx";
import { useNavigate } from "react-router-dom";
import DashboardView from "./main/dashboard/Index.js";
import { useAuthContext } from "./../../context/AuthContext";
import { useDashboardContext } from "../../context/DashboardContext.jsx";
import useFetch from "../../hooks/useFetch.jsx";
import VisitForm from "./others/visitsView/Form.jsx";

const Index = ({}) => {
   const { setIsLoading } = useGlobalContext();
   const { auth } = useAuthContext();

   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
   const navigate = useNavigate();
   const [activeCard, setActiveCard] = useState<string | null>(null);

   const [VisitFormDialog, setVisitFormDialog] = useState(false);

   const { sellerDashboardData, setSellerDashboardData, getSellerDashboard } = useDashboardContext();

   const { refetch: refreshSellerDashboard } = useFetch(getSellerDashboard, setSellerDashboardData);

   const [counter, setCounter] = useState(0);
   const handleClick = () => {
      Toast.Success("Success: " + counter);
      Toast.Error("Error: " + counter);
      Toast.Warning("Warning: " + counter);
      Toast.Info("Info: " + counter);
      Toast.Default("Default: " + counter);
      setCounter(counter + 1);
      navigate("/app/configuraciones/usuarios");
   };

   // Acciones rápidas del vendedor
   const quickActions = [
      {
         id: "visit",
         title: "Checar Visita / Distribución",
         description: "Registrar visita a punto de venta /Distribuir productos",
         icon: <LocalShipping sx={{ fontSize: 32, color: "black" }} />,
         color: "linear-gradient(135deg, #6F99CD 0%, #764ba2 100%)",
         stats: "",
         badge: "",
         route: "/app/otros/visitas"
      },
      {
         id: "inventory",
         title: "Inventario",
         description: "Control de stock y existencias",
         icon: <Inventory sx={{ fontSize: 32, color: "black" }} />,
         color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
         stats: "",
         badge: "",
         route: "/app/productos/asignados"
      }
      // {
      //    id: "sales",
      //    title: "Ventas",
      //    description: "Registro y seguimiento de ventas",
      //    icon: <TrendingUp sx={{ fontSize: 32 }} />,
      //    color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      //    stats: "1,890 distribuidos",
      //    badge: "+8% crecimiento",
      //    route: "/app"
      // },
      // {
      //    id: "reports",
      //    title: "Reportes",
      //    description: "Analíticas y reportes de desempeño",
      //    icon: <Assessment sx={{ fontSize: 32 }} />,
      //    color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      //    stats: "15 reportes",
      //    badge: "3 nuevos",
      //    route: "/app"
      // }
      // {
      //    id: "qr-scanner",
      //    title: "Escanear QR",
      //    description: "Escaneo rápido de productos",
      //    icon: <QrCode sx={{ fontSize: 32 }} />,
      //    color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      //    stats: "45 escaneos hoy",
      //    badge: "Listo",
      //    route: "/app"
      // }
   ];

   // Métricas rápidas
   const quickMetrics = [
      {
         label: "Chips Asignados",
         value: sellerDashboardData == null ? "0" : (sellerDashboardData?.sellers_performance[0]?.products_stats?.assigned ?? "0"),
         change: sellerDashboardData == null ? "0%" : `${sellerDashboardData?.sellers_performance[0]?.products_stats?.assigned_rate}%`,
         icon: <SimCardRounded color="primary" />
      },
      {
         label: "Chips en Stock",
         value: sellerDashboardData == null ? "0" : (sellerDashboardData?.sellers_performance[0]?.products_stats?.in_stock ?? "0"),
         change: sellerDashboardData == null ? "0%" : `${sellerDashboardData?.sellers_performance[0]?.products_stats?.in_stock_rate}%`,
         icon: <Inventory color="info" />
      },
      {
         label: "Chips Distribuidos",
         value: sellerDashboardData == null ? "0" : (sellerDashboardData?.sellers_performance[0]?.products_stats?.distributed ?? "0"),
         change: sellerDashboardData == null ? "0%" : `${sellerDashboardData?.sellers_performance[0]?.products_stats?.distributed_rate}%`,
         icon: <OutboxRounded color="warning" />
      },
      {
         label: "Chips Activos",
         value: sellerDashboardData == null ? "0" : (sellerDashboardData?.sellers_performance[0]?.products_stats?.actived ?? "0"),
         change: sellerDashboardData == null ? "0%" : `${sellerDashboardData?.sellers_performance[0]?.products_stats?.actived_rate}%`,
         icon: <CheckCircle color="success" />
      },
      {
         label: "Chips Portados",
         value: sellerDashboardData == null ? "0" : (sellerDashboardData?.sellers_performance[0]?.products_stats?.ported ?? "0"),
         change: sellerDashboardData == null ? "0%" : `${sellerDashboardData?.sellers_performance[0]?.products_stats?.ported_rate}%`,
         icon: <SignalCellularNoSimRounded color="error" />
      },
      {
         label: "Puntos de Venta",
         value: sellerDashboardData == null ? "0" : (sellerDashboardData?.sellers_performance[0]?.points_of_sale?.total ?? "0"),
         change: "100%",
         icon: <Storefront color="warning" />
      },
      {
         label: "Visitas Diarias",
         value: sellerDashboardData == null ? "0" : (sellerDashboardData?.sellers_performance[0]?.visits?.daily ?? "0"),
         change: sellerDashboardData == null ? "0%" : `${sellerDashboardData?.sellers_performance[0]?.visits?.daily_rate}%`,
         icon: <Schedule color="error" />
      }
   ];

   const handleCardClick = (action: (typeof quickActions)[0]) => {
      setActiveCard(action.id);
      setTimeout(() => {
         navigate(action.route);
         setActiveCard(null);
      }, 300);
   };

   const cardVariants = {
      initial: { scale: 1, y: 0 },
      hover: { scale: 1.05, y: -8 },
      tap: { scale: 0.95 }
   };

   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1
         }
      }
   };

   useLayoutEffect(() => {
      setIsLoading(false);
   }, []);

   return (
      <>
         {/* <ClockComponent color={"initial"} /> */}
         <Box className="" sx={{}}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
               <Paper className="rounded-2xl shadow-lg mb-6 border-0" sx={{ background: "linear-gradient(135deg, #6F99CD 0%, #764ba2 100%)" }}>
                  <Box className="p-6 text-white">
                     <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <Box>
                           <Typography variant="h3" fontWeight="800" className="mb-2">
                              {`¡Hola, ${auth.full_name || auth.username}! 👋`}
                           </Typography>
                           <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
                              ¿Qué deseas hacer hoy?
                           </Typography>
                           <Chip label="Sesión activa • CellStop" variant="outlined" sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)", mt: 2 }} />
                        </Box>

                        {/* <Box className="flex items-center gap-3">
                           <Badge badgeContent={3} color="error">
                              <IconButton sx={{ color: "white", bgcolor: "rgba(255,255,255,0.2)" }}>
                                 <Notifications />
                              </IconButton>
                           </Badge>
                           <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)" }}>
                              <AccountCircle />
                           </Avatar>
                        </Box> */}
                     </Box>
                  </Box>
               </Paper>
            </motion.div>

            {/* Acciones Rápidas */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
               <Typography variant="h5" fontWeight="700" className="text-base mb-6" mb={1}>
                  Acciones Rápidas
               </Typography>

               <Grid container spacing={3}>
                  {quickActions.map((action) => (
                     <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={action.id}>
                        <motion.div
                           variants={cardVariants}
                           initial="initial"
                           whileHover="hover"
                           whileTap="tap"
                           onClick={() => handleCardClick(action)}
                           className="cursor-pointer"
                        >
                           <AnimatePresence>
                              <Card
                                 className={`rounded-2xl shadow-lg border-0 overflow-hidden transition-all duration-300 ${
                                    activeCard === action.id ? "ring-4 ring-blue-500 ring-opacity-50" : ""
                                 }`}
                                 sx={{
                                    background: action.color,
                                    position: "relative",
                                    overflow: "visible"
                                 }}
                              >
                                 {/* Efecto de brillo al hover */}
                                 <motion.div className="absolute inset-0 bg-white opacity-0" whileHover={{ opacity: 0.1 }} transition={{ duration: 0.3 }} />

                                 <CardContent className="p-5 text-white relative z-10">
                                    <Box className="flex items-start justify-between mb-4">
                                       <Box className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">{action.icon}</Box>
                                       <Chip
                                          label={action.badge}
                                          size="small"
                                          sx={{
                                             bgcolor: "rgba(255,255,255,0.3)",
                                             color: "white",
                                             fontWeight: 600
                                          }}
                                       />
                                    </Box>

                                    <Typography variant="h5" fontWeight="700" className="mb-2">
                                       {action.title}
                                    </Typography>

                                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                                       {action.description}
                                    </Typography>

                                    <Box className="flex items-center justify-between">
                                       <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                          {action.stats}
                                       </Typography>
                                       <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 400 }}>
                                          <IconButton
                                             size="small"
                                             sx={{
                                                color: "white",
                                                bgcolor: "rgba(255,255,255,0.3)",
                                                "&:hover": { bgcolor: "rgba(255,255,255,0.4)" }
                                             }}
                                          >
                                             <Speed />
                                          </IconButton>
                                       </motion.div>
                                    </Box>
                                 </CardContent>

                                 {/* Indicador de carga cuando está activo */}
                                 <AnimatePresence>
                                    {activeCard === action.id && (
                                       <motion.div
                                          initial={{ scaleX: 0 }}
                                          animate={{ scaleX: 1 }}
                                          exit={{ scaleX: 0 }}
                                          transition={{ duration: 0.3 }}
                                          className="h-1 bg-white bg-opacity-50"
                                          style={{ originX: 0 }}
                                       />
                                    )}
                                 </AnimatePresence>
                              </Card>
                           </AnimatePresence>
                        </motion.div>
                     </Grid>
                  ))}
               </Grid>
            </motion.div>

            {/* Métricas Rápidas */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-8">
               <Grid container spacing={2}>
                  {quickMetrics.map((metric, index) => (
                     <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                           <Paper className="p-4 rounded-2xl shadow-xl border-0 h-full" sx={{}}>
                              <Box className="flex items-center justify-between">
                                 <Box>
                                    <Typography variant="h4" fontWeight="800" className="text-base">
                                       {metric.value}
                                    </Typography>
                                    <Typography variant="body2" className="text-base mt-1">
                                       {metric.label}
                                    </Typography>
                                    <Chip
                                       label={metric.change}
                                       size="small"
                                       color={metric.change.includes("+") ? "success" : metric.change.includes("-") ? "error" : "default"}
                                       variant="outlined"
                                       className="mt-2"
                                    />
                                 </Box>
                                 <Box className="p-2 bg-blue-50 rounded-xl">{metric.icon}</Box>
                              </Box>
                           </Paper>
                        </motion.div>
                     </Grid>
                  ))}
               </Grid>
            </motion.div>

            {/* Acciones Adicionales */}
            {/* <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="mt-8">
               <Paper className="p-6 rounded-2xl shadow-sm border-0">
                  <Box className="flex flex-col md:flex-row justify-between items-center gap-4">
                     <Box>
                        <Typography variant="h6" fontWeight="600" className="text-gray-800 mb-2">
                           ¿Necesitas algo más?
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                           Accede a todas las funcionalidades del sistema
                        </Typography>
                     </Box>

                     <Box className="flex gap-2">
                        <Button variant="outlined" startIcon={<Menu />} sx={{ borderRadius: 3, textTransform: "none" }} onClick={() => navigate("#")}>
                           Menú Completo
                        </Button>
                        <Button
                           variant="contained"
                           startIcon={<Add />}
                           sx={{
                              borderRadius: 3,
                              textTransform: "none",
                              background: "linear-gradient(135deg, #6F99CD 0%, #764ba2 100%)"
                           }}
                           onClick={() => navigate("#")}
                        >
                           Nueva Acción
                        </Button>
                     </Box>
                  </Box>
               </Paper>
            </motion.div> */}

            {/* Footer de Estado */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1 }} className="mt-8 text-center">
               <Typography variant="caption" className="text-gray-500">
                  Sistema CellStop • Conectado • Última actualización: hoy a las {new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
               </Typography>
            </motion.div>
         </Box>

         {/* <DashboardView /> */}
         {/* <p>Crear modulo de visitas...</p> */}
         {/* <VisitForm container="modal" openDialog={VisitFormDialog} setOpenDialog={setVisitFormDialog} refreshSelect={{}} /> */}
      </>
   );
};

export default Index;
