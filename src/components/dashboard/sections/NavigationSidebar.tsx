// components/dashboard/sections/NavigationSidebar.tsx
import React, { useState } from "react";
import { Box, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton, Tooltip, Collapse } from "@mui/material";
import { Dashboard, Analytics, TrendingUp, Map, Inventory2, PointOfSale, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationItem {
   id: string;
   label: string;
   icon: React.ReactNode;
   section: string;
}

const navigationItems: NavigationItem[] = [
   { id: "stats", label: "Estadísticas", icon: <Dashboard />, section: "stats" },
   { id: "products", label: "Análisis Productos", icon: <Inventory2 />, section: "products" },
   { id: "sales", label: "Rendimiento Ventas", icon: <TrendingUp />, section: "sales" },
   { id: "geography", label: "Distribución Geográfica", icon: <Map />, section: "geography" },
   { id: "analytics", label: "Analíticas Avanzadas", icon: <Analytics />, section: "analytics" }
];

interface NavigationSidebarProps {
   onSectionChange: (section: string) => void;
   activeSection: string;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ onSectionChange, activeSection }) => {
   const [isCollapsed, setIsCollapsed] = useState(false);

   const handleNavigation = (section: string) => {
      onSectionChange(section);
      // Scroll suave a la sección
      const element = document.getElementById(section);
      if (element) {
         element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
   };

   return (
      <motion.div
         initial={{ x: -100, opacity: 0 }}
         animate={{ x: 0, opacity: 1 }}
         transition={{ duration: 0.5, delay: 0.2 }}
         style={{
            position: "fixed",
            right: 20,
            top: "10%",
            transform: "translateY(-50%)",
            zIndex: 1000
         }}
      >
         <Paper
            elevation={8}
            sx={{
               borderRadius: 4,
               background: "rgba(255, 255, 255, 0.95)",
               backdropFilter: "blur(20px)",
               border: "1px solid rgba(255, 255, 255, 0.2)",
               overflow: "hidden",
               minWidth: isCollapsed ? 60 : 240,
               transition: "all 0.3s ease"
            }}
         >
            {/* Header */}
            <Box
               sx={{
                  p: 2,
                  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isCollapsed ? "center" : "space-between"
               }}
            >
               <AnimatePresence>
                  {!isCollapsed && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Typography variant="h6" fontWeight="700" fontSize="0.9rem">
                           Navegación
                        </Typography>
                     </motion.div>
                  )}
               </AnimatePresence>

               <Tooltip title={isCollapsed ? "Expandir" : "Contraer"}>
                  <IconButton
                     size="small"
                     onClick={() => setIsCollapsed(!isCollapsed)}
                     sx={{
                        color: "text.secondary",
                        "&:hover": { color: "primary.main" }
                     }}
                  >
                     {isCollapsed ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  </IconButton>
               </Tooltip>
            </Box>

            {/* Navigation Items */}
            <List sx={{ p: 1 }}>
               {navigationItems.map((item) => (
                  <Tooltip key={item.id} title={isCollapsed ? item.label : ""} placement="right">
                     <ListItem disablePadding>
                        <ListItemButton
                           onClick={() => handleNavigation(item.section)}
                           selected={activeSection === item.section}
                           sx={{
                              borderRadius: 2,
                              mb: 0.5,
                              mx: 0.5,
                              minHeight: 48,
                              justifyContent: isCollapsed ? "center" : "flex-start",
                              "&.Mui-selected": {
                                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                 color: "white",
                                 "&:hover": {
                                    background: "linear-gradient(135deg, #5a6fd8 0%, #6a42a0 100%)"
                                 }
                              },
                              "&:hover": {
                                 backgroundColor: "rgba(102, 126, 234, 0.1)"
                              }
                           }}
                        >
                           <ListItemIcon
                              sx={{
                                 minWidth: 0,
                                 mr: isCollapsed ? 0 : 2,
                                 justifyContent: "center",
                                 color: activeSection === item.section ? "white" : "text.secondary"
                              }}
                           >
                              {item.icon}
                           </ListItemIcon>

                           <Collapse in={!isCollapsed} orientation="horizontal">
                              <ListItemText
                                 primary={
                                    <Typography variant="body2" fontWeight="600">
                                       {item.label}
                                    </Typography>
                                 }
                              />
                           </Collapse>
                        </ListItemButton>
                     </ListItem>
                  </Tooltip>
               ))}
            </List>

            {/* Footer */}
            <AnimatePresence>
               {!isCollapsed && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                     <Box
                        sx={{
                           p: 2,
                           borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                           textAlign: "center"
                        }}
                     >
                        <Typography variant="caption" color="text.secondary">
                           Dashboard v1.0
                        </Typography>
                     </Box>
                  </motion.div>
               )}
            </AnimatePresence>
         </Paper>
      </motion.div>
   );
};
