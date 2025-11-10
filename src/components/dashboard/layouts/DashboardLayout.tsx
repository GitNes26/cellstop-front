// components/dashboard/layouts/DashboardLayout.tsx
import React from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
   children: React.ReactNode;
   title?: string;
   subtitle?: string;
   navigation?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
   children,
   title = "Dashboard de Distribución",
   subtitle = "Monitoreo en tiempo real de productos y ventas",
   navigation
}) => {
   const theme = useTheme();

   return (
      <Box
         sx={{
            flexGrow: 1,
            minHeight: "100vh",
            // background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            p: 0,
            position: "relative"
         }}
      >
         {/* Navigation Sidebar */}
         {navigation}

         <Container maxWidth={false} sx={{ position: "relative", zIndex: 1 }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
               <Box sx={{ mb: 4 }}>
                  <Typography
                     variant="h3"
                     fontWeight="800"
                     gutterBottom
                     sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent"
                     }}
                  >
                     {title}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ opacity: 0.8 }}>
                     {subtitle}
                  </Typography>
               </Box>
            </motion.div>

            {/* Content */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
               {children}
            </motion.div>
         </Container>
      </Box>
   );
};
