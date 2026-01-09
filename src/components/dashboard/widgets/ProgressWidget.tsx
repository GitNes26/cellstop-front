// components/dashboard/widgets/ProgressWidget.tsx
import React from "react";
import { Card, CardContent, Typography, Box, LinearProgress, Chip } from "@mui/material";
import { motion } from "framer-motion";

export interface ProgressItem {
   label: string;
   value: number;
   total: number;
   color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
   description?: string;
}

export interface ProgressWidgetProps {
   title: string;
   subtitle?: string;
   items: ProgressItem[];
   height?: number;
}

export const ProgressWidget: React.FC<ProgressWidgetProps> = ({ title, subtitle, items, height = 300 }) => {
   const colorMap = {
      primary: "#6F99CD",
      secondary: "#764ba2",
      success: "#38a169",
      error: "#e53e3e",
      warning: "#d69e2e",
      info: "#4299e1"
   };

   const getPercentage = (value: number, total: number) => {
      return total > 0 ? Math.round((value / total) * 100) : 0;
   };

   return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
         <Card
            sx={{
               height: "100%",
               // background: "rgba(255, 255, 255, 0.9)",
               backdropFilter: "blur(10px)",
               border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
         >
            <CardContent sx={{ p: 3 }}>
               <Typography variant="h6" fontWeight="700" gutterBottom>
                  {title}
               </Typography>
               {subtitle && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                     {subtitle}
                  </Typography>
               )}

               <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {items.map((item, index) => {
                     const percentage = getPercentage(item.value, item.total);
                     const color = colorMap[item.color || "primary"];

                     return (
                        <Box key={index}>
                           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                              <Typography variant="body1" fontWeight="600">
                                 {item.label}
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                 <Typography variant="body2" fontWeight="600" color="text.primary">
                                    {item.value.toLocaleString()}
                                 </Typography>
                                 <Typography variant="body2" color="text.secondary">
                                    / {item.total.toLocaleString()}
                                 </Typography>
                                 <Chip
                                    label={`${percentage}%`}
                                    size="small"
                                    sx={{
                                       backgroundColor: `${color}15`,
                                       color: color,
                                       fontWeight: "600",
                                       minWidth: 60
                                    }}
                                 />
                              </Box>
                           </Box>

                           {item.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                 {item.description}
                              </Typography>
                           )}

                           <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{
                                 height: 8,
                                 borderRadius: 4,
                                 backgroundColor: `${color}20`,
                                 "& .MuiLinearProgress-bar": {
                                    backgroundColor: color,
                                    borderRadius: 4
                                 }
                              }}
                           />
                        </Box>
                     );
                  })}
               </Box>
            </CardContent>
         </Card>
      </motion.div>
   );
};
