// components/dashboard/widgets/StatCard.tsx
import React from "react";
import { Card, CardContent, Typography, Box, LinearProgress, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Equalizer } from "@mui/icons-material";

export interface StatCardProps {
   title: string;
   value: string | number;
   subtitle?: string;
   icon?: React.ReactNode;
   color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
   trend?: {
      value: number;
      isPositive: boolean;
   };
   progress?: number;
   onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color = "primary", trend, progress, onClick }) => {
   const colorMap = {
      primary: "#667eea",
      secondary: "#764ba2",
      success: "#38a169",
      error: "#e53e3e",
      warning: "#d69e2e",
      info: "#4299e1"
   };

   const TrendIcon = trend?.isPositive ? TrendingUp : TrendingDown;

   return (
      <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
         <Card
            sx={{
               height: "100%",
               cursor: onClick ? "pointer" : "default",
               background: `linear-gradient(135deg, ${colorMap[color]}15 0%, ${colorMap[color]}08 100%)`,
               border: `1px solid ${colorMap[color]}20`,
               backdropFilter: "blur(10px)",
               position: "relative",
               overflow: "hidden",
               "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: `linear-gradient(90deg, ${colorMap[color]} 0%, ${colorMap[color]}80 100%)`
               }
            }}
            onClick={onClick}
         >
            <CardContent sx={{ p: 3 }}>
               {/* Header */}
               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box>
                     <Typography
                        variant="h6"
                        color="text.secondary"
                        fontWeight="600"
                        sx={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.5px" }}
                     >
                        {title}
                     </Typography>
                     <Typography
                        variant="h3"
                        fontWeight="800"
                        sx={{
                           mt: 1,
                           background: `linear-gradient(135deg, ${colorMap[color]} 0%, ${colorMap[color]}80 100%)`,
                           backgroundClip: "text",
                           WebkitBackgroundClip: "text",
                           color: "transparent"
                        }}
                     >
                        {value}
                     </Typography>
                  </Box>

                  {icon && (
                     <Box
                        sx={{
                           p: 1,
                           borderRadius: 2,
                           background: `${colorMap[color]}15`,
                           color: colorMap[color],
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center"
                        }}
                     >
                        {icon}
                     </Box>
                  )}
               </Box>

               {/* Subtitle */}
               {subtitle && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                     {subtitle}
                  </Typography>
               )}

               {/* Trend */}
               {trend && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                     <TrendIcon
                        sx={{
                           fontSize: 16,
                           color: trend.isPositive ? "#38a169" : "#e53e3e"
                        }}
                     />
                     <Typography variant="body2" fontWeight="600" sx={{ color: trend.isPositive ? "#38a169" : "#e53e3e" }}>
                        {trend.isPositive ? "+" : ""}
                        {trend.value}%
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                        vs último mes
                     </Typography>
                  </Box>
               )}

               {/* Progress Bar */}
               {progress !== undefined && (
                  <Box sx={{ mt: 2 }}>
                     <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                           height: 6,
                           borderRadius: 3,
                           backgroundColor: `${colorMap[color]}20`,
                           "& .MuiLinearProgress-bar": {
                              backgroundColor: colorMap[color],
                              borderRadius: 3
                           }
                        }}
                     />
                     <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "right" }}>
                        {progress}% completado
                     </Typography>
                  </Box>
               )}
            </CardContent>
         </Card>
      </motion.div>
   );
};
