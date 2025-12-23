// components/dashboard/widgets/StatCard.tsx - Versión expandida
import React from "react";
import { Card, CardContent, Typography, Box, LinearProgress, Chip, Avatar, IconButton, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Equalizer, InfoOutlined, MoreVert } from "@mui/icons-material";

export interface StatCardProps {
   title: string;
   value: string | number;
   subtitle?: string;
   icon?: React.ReactNode;
   color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
   trend?: {
      value: number;
      isPositive: boolean;
      label?: string;
   };
   progress?: number;
   onClick?: () => void;
   size?: "small" | "medium" | "large" | "compact";
   variant?: "default" | "elevated" | "minimal" | "gradient";
   action?: React.ReactNode;
   infoTooltip?: string;
   status?: "active" | "inactive" | "pending" | "completed";
   priority?: "low" | "medium" | "high" | "critical";
}

export const StatCard: React.FC<StatCardProps> = ({
   title,
   value,
   subtitle,
   icon,
   color = "primary",
   trend,
   progress,
   onClick,
   size = "medium",
   variant = "default",
   action,
   infoTooltip,
   status,
   priority
}) => {
   // Mapeo de colores usando la paleta del tema
   const colorMap = {
      primary: "#034AAB",
      secondary: "#7c3aed",
      success: "#059669",
      error: "#dc2626",
      warning: "#d97706",
      info: "#0891b2"
   };

   const priorityColors = {
      low: "#10b981",
      medium: "#f59e0b",
      high: "#ef4444",
      critical: "#dc2626"
   };

   const statusColors = {
      active: "#10b981",
      inactive: "#6b7280",
      pending: "#f59e0b",
      completed: "#3b82f6"
   };

   // Configuraciones por tamaño
   const sizeConfig = {
      compact: {
         padding: 2,
         valueSize: "1.5rem",
         titleSize: "0.75rem",
         iconSize: 20
      },
      small: {
         padding: 2.5,
         valueSize: "2rem",
         titleSize: "0.875rem",
         iconSize: 24
      },
      medium: {
         padding: 3,
         valueSize: "2.5rem",
         titleSize: "0.875rem",
         iconSize: 32
      },
      large: {
         padding: 4,
         valueSize: "3rem",
         titleSize: "1rem",
         iconSize: 40
      }
   };

   const config = sizeConfig[size];
   const TrendIcon = trend?.isPositive ? TrendingUp : TrendingDown;

   // Estilos por variante
   const variantStyles = {
      default: {
         background: `linear-gradient(135deg, ${colorMap[color]}08 0%, ${colorMap[color]}05 100%)`,
         border: `1px solid ${colorMap[color]}20`,
         topBar: `linear-gradient(90deg, ${colorMap[color]} 0%, ${colorMap[color]}80 100%)`
      },
      elevated: {
         background: `linear-gradient(135deg, ${colorMap[color]}15 0%, ${colorMap[color]}08 100%)`,
         border: `1px solid ${colorMap[color]}30`,
         topBar: `linear-gradient(90deg, ${colorMap[color]} 0%, ${colorMap[color]}CC 100%)`,
         boxShadow: `0 10px 15px -3px ${colorMap[color]}20, 0 4px 6px -4px ${colorMap[color]}20`
      },
      minimal: {
         background: "transparent",
         border: `1px solid ${colorMap[color]}15`,
         topBar: "transparent"
      },
      gradient: {
         background: `linear-gradient(135deg, ${colorMap[color]}15 0%, ${colorMap[color]}08 50%, transparent 100%)`,
         border: `1px solid ${colorMap[color]}20`,
         topBar: `linear-gradient(90deg, ${colorMap[color]} 0%, ${colorMap[color]}AA 50%, ${colorMap[color]}80 100%)`
      }
   };

   const styles = variantStyles[variant];

   return (
      <motion.div
         whileHover={{ y: variant === "minimal" ? -2 : -4, scale: variant === "minimal" ? 1.01 : 1.02 }}
         transition={{ type: "spring", stiffness: 300 }}
         className="h-full"
      >
         <Card
            sx={{
               height: "100%",
               cursor: onClick ? "pointer" : "default",
               background: styles.background,
               border: styles.border,
               backdropFilter: "blur(10px)",
               position: "relative",
               overflow: "hidden",
               boxShadow: styles.boxShadow,
               "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: styles.topBar
               }
            }}
            onClick={onClick}
         >
            <CardContent sx={{ p: config.padding, position: "relative" }}>
               {/* Header con acciones */}
               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: size === "compact" ? 1 : 2 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                     {/* Título con tooltip */}
                     <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: size === "compact" ? 0.5 : 1 }}>
                        <Typography
                           variant="h6"
                           color="text.secondary"
                           fontWeight="600"
                           sx={{
                              fontSize: config.titleSize,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              lineHeight: 1.2
                           }}
                        >
                           {title}
                        </Typography>
                        {infoTooltip && (
                           <Tooltip title={infoTooltip}>
                              <InfoOutlined sx={{ fontSize: 14, color: "text.secondary", opacity: 0.7 }} />
                           </Tooltip>
                        )}
                     </Box>

                     {/* Valor principal */}
                     <Typography
                        variant="h3"
                        fontWeight="800"
                        sx={{
                           fontSize: config.valueSize,
                           background: `linear-gradient(135deg, ${colorMap[color]} 0%, ${colorMap[color]}80 100%)`,
                           backgroundClip: "text",
                           WebkitBackgroundClip: "text",
                           color: "transparent",
                           lineHeight: 1.1,
                           mb: subtitle ? 0.5 : 0
                        }}
                     >
                        {value}
                     </Typography>

                     {/* Subtítulo */}
                     {subtitle && (
                        <Typography
                           variant="body2"
                           color="text.secondary"
                           sx={{
                              fontSize: size === "compact" ? "0.75rem" : "0.875rem",
                              lineHeight: 1.3
                           }}
                        >
                           {subtitle}
                        </Typography>
                     )}
                  </Box>

                  {/* Icono y acciones */}
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                     {icon && (
                        <Avatar
                           sx={{
                              width: config.iconSize + 8,
                              height: config.iconSize + 8,
                              bgcolor: `${colorMap[color]}15`,
                              color: colorMap[color],
                              fontSize: config.iconSize
                           }}
                        >
                           {icon}
                        </Avatar>
                     )}

                     {/* Chips de estado y prioridad */}
                     <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        {status && (
                           <Chip
                              label={status}
                              size="small"
                              sx={{
                                 height: 20,
                                 fontSize: "0.625rem",
                                 bgcolor: `${statusColors[status]}15`,
                                 color: statusColors[status],
                                 border: `1px solid ${statusColors[status]}30`
                              }}
                           />
                        )}
                        {priority && (
                           <Chip
                              label={priority}
                              size="small"
                              sx={{
                                 height: 20,
                                 fontSize: "0.625rem",
                                 bgcolor: `${priorityColors[priority]}15`,
                                 color: priorityColors[priority],
                                 border: `1px solid ${priorityColors[priority]}30`
                              }}
                           />
                        )}
                     </Box>
                  </Box>
               </Box>

               {/* Trend y métricas secundarias */}
               {(trend || progress !== undefined) && (
                  <Box sx={{ mt: size === "compact" ? 1 : 2 }}>
                     {/* Trend indicator */}
                     {trend && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: progress !== undefined ? 1 : 0 }}>
                           <TrendIcon
                              sx={{
                                 fontSize: 16,
                                 color: trend.isPositive ? "#059669" : "#dc2626"
                              }}
                           />
                           <Typography
                              variant="body2"
                              fontWeight="600"
                              sx={{
                                 color: trend.isPositive ? "#059669" : "#dc2626",
                                 fontSize: size === "compact" ? "0.75rem" : "0.875rem"
                              }}
                           >
                              {trend.isPositive ? "+" : ""}
                              {trend.value}%
                           </Typography>
                           <Typography variant="body2" color="text.secondary" sx={{ fontSize: size === "compact" ? "0.75rem" : "0.875rem" }}>
                              {trend.label || "vs último mes"}
                           </Typography>
                        </Box>
                     )}

                     {/* Progress Bar */}
                     {progress !== undefined && (
                        <Box>
                           <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                 height: size === "compact" ? 4 : 6,
                                 borderRadius: 2,
                                 backgroundColor: `${colorMap[color]}20`,
                                 "& .MuiLinearProgress-bar": {
                                    backgroundColor: colorMap[color],
                                    borderRadius: 2
                                 }
                              }}
                           />
                           {size !== "compact" && (
                              <Typography
                                 variant="body2"
                                 color="text.secondary"
                                 sx={{
                                    mt: 0.5,
                                    textAlign: "right",
                                    fontSize: "0.75rem"
                                 }}
                              >
                                 {progress}% completado
                              </Typography>
                           )}
                        </Box>
                     )}
                  </Box>
               )}

               {/* Acción personalizada */}
               {action && <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>{action}</Box>}
            </CardContent>
         </Card>
      </motion.div>
   );
};

// Componente adicional para grid de StatCards
interface StatCardGridProps {
   children: React.ReactNode;
   columns?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
   };
   gap?: number;
}

export const StatCardGrid: React.FC<StatCardGridProps> = ({ children, columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }, gap = 3 }) => {
   return (
      <Box
         sx={{
            display: "grid",
            direction: "ltr",
            gap: gap,
            gridTemplateColumns: {
               xs: `repeat(${columns.xs}, 1fr)`,
               sm: `repeat(${columns.sm}, 1fr)`,
               md: `repeat(${columns.md}, 1fr)`,
               lg: `repeat(${columns.lg}, 1fr)`,
               xl: `repeat(${columns.xl}, 1fr)`
            }
         }}
      >
         {children}
      </Box>
   );
};
