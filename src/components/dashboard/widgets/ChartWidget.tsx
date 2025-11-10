// components/dashboard/widgets/ChartWidget.tsx
import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert, Refresh } from "@mui/icons-material";
import { motion } from "framer-motion";
import * as echarts from "echarts";

export interface ChartWidgetProps {
   title: string;
   subtitle?: string;
   chartOption: echarts.EChartsOption;
   height?: number;
   onRefresh?: () => void;
   menuItems?: Array<{
      label: string;
      action: () => void;
      icon?: React.ReactNode;
   }>;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ title, subtitle, chartOption, height = 400, onRefresh, menuItems }) => {
   const chartRef = useRef<HTMLDivElement>(null);
   const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);
   const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

   useEffect(() => {
      if (chartRef.current) {
         const chart = echarts.init(chartRef.current);
         setChartInstance(chart);
         chart.setOption(chartOption);

         const handleResize = () => chart.resize();
         window.addEventListener("resize", handleResize);

         return () => {
            window.removeEventListener("resize", handleResize);
            chart.dispose();
         };
      }
   }, [chartOption]);

   useEffect(() => {
      if (chartInstance && chartOption) {
         chartInstance.setOption(chartOption);
      }
   }, [chartInstance, chartOption]);

   const handleRefresh = () => {
      onRefresh?.();
   };

   return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
         <Card
            sx={{
               height: "100%",
               background: "rgba(255, 255, 255, 0.9)",
               backdropFilter: "blur(10px)",
               border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
         >
            <CardContent sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column" }}>
               {/* Header */}
               <Box
                  sx={{
                     p: 3,
                     pb: 2,
                     display: "flex",
                     justifyContent: "space-between",
                     alignItems: "flex-start",
                     borderBottom: "1px solid rgba(0, 0, 0, 0.08)"
                  }}
               >
                  <Box>
                     <Typography variant="h6" fontWeight="700" gutterBottom>
                        {title}
                     </Typography>
                     {subtitle && (
                        <Typography variant="body2" color="text.secondary">
                           {subtitle}
                        </Typography>
                     )}
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                     {onRefresh && (
                        <IconButton
                           size="small"
                           onClick={handleRefresh}
                           sx={{
                              color: "text.secondary",
                              "&:hover": { color: "primary.main" }
                           }}
                        >
                           <Refresh />
                        </IconButton>
                     )}

                     {menuItems && (
                        <>
                           <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ color: "text.secondary" }}>
                              <MoreVert />
                           </IconButton>
                           <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                              {menuItems.map((item, index) => (
                                 <MenuItem
                                    key={index}
                                    onClick={() => {
                                       item.action();
                                       setMenuAnchor(null);
                                    }}
                                 >
                                    {item.icon}
                                    {item.label}
                                 </MenuItem>
                              ))}
                           </Menu>
                        </>
                     )}
                  </Box>
               </Box>

               {/* Chart */}
               <Box sx={{ flex: 1, p: 2 }}>
                  <div
                     ref={chartRef}
                     style={{
                        width: "100%",
                        height: `${height}px`,
                        borderRadius: "8px"
                     }}
                  />
               </Box>
            </CardContent>
         </Card>
      </motion.div>
   );
};
