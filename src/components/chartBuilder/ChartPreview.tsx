// components/ChartBuilder/ChartPreview.tsx
import React from "react";
import { motion } from "framer-motion";
import { Box, Typography, Paper, Skeleton, Alert, Chip } from "@mui/material";
import { BarChart, ShowChart, PieChart, DonutLarge, ScatterPlot, AreaChart, Radar, CameraEnhanceRounded } from "@mui/icons-material";
import { ChartConfig, DataField } from "../../types/reporter";

interface ChartPreviewProps {
   config: ChartConfig;
   fields: DataField[];
   data: any[];
   isLoading?: boolean;
}

const ChartPreview: React.FC<ChartPreviewProps> = ({ config, fields, data, isLoading = false }) => {
   const getChartIcon = (type: string) => {
      switch (type) {
         case "bar":
            return BarChart;
         case "line":
            return ShowChart;
         case "pie":
            return PieChart;
         case "doughnut":
            return DonutLarge;
         case "scatter":
            return ScatterPlot;
         case "area":
            return AreaChart;
         case "radar":
            return Radar;
         case "polar":
            return CameraEnhanceRounded;
         default:
            return BarChart;
      }
   };

   const ChartIcon = getChartIcon(config.chartType);

   if (isLoading) {
      return (
         <Paper className="p-6 rounded-2xl shadow-sm border h-96 flex items-center justify-center">
            <Box className="text-center w-full">
               <Skeleton variant="circular" width={80} height={80} className="mx-auto mb-4" />
               <Skeleton variant="text" width={200} className="mx-auto mb-2" />
               <Skeleton variant="text" width={150} className="mx-auto" />
            </Box>
         </Paper>
      );
   }

   if (!config.xAxis || !config.yAxis) {
      return (
         <Paper className="p-6 rounded-2xl shadow-sm border h-96 flex items-center justify-center">
            <Box className="text-center text-gray-500">
               <ChartIcon className="text-6xl mb-4 text-gray-300 mx-auto" />
               <Typography variant="h6" className="mb-2">
                  Configura los ejes del gráfico
               </Typography>
               <Typography variant="body2">Selecciona campos para los ejes X e Y para ver la previsualización</Typography>
            </Box>
         </Paper>
      );
   }

   const xField = fields.find((f) => f.id === config.xAxis);
   const yField = fields.find((f) => f.id === config.yAxis);

   return (
      <Paper className="p-6 rounded-2xl shadow-sm border">
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {/* Header del gráfico */}
            <Box className="mb-6">
               <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                  {config.title || "Gráfico sin título"}
               </Typography>
               {config.description && (
                  <Typography variant="body2" className="text-gray-600">
                     {config.description}
                  </Typography>
               )}
            </Box>

            {/* Preview del gráfico */}
            <Box className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 h-80 flex items-center justify-center">
               <Box className="text-center">
                  <ChartIcon className="text-6xl mb-4 text-blue-400 mx-auto" />
                  <Typography variant="h6" className="text-blue-800 mb-2">
                     Vista Previa del Gráfico
                  </Typography>
                  <Typography variant="body2" className="text-blue-600 mb-4">
                     {config.chartType.toUpperCase()} - {data.length} registros
                  </Typography>

                  <Box className="flex flex-wrap gap-4 justify-center text-sm text-blue-700">
                     <Chip label={`X: ${xField?.displayName}`} size="small" color="primary" variant="outlined" />
                     <Chip label={`Y: ${yField?.displayName}`} size="small" color="secondary" variant="outlined" />
                  </Box>
               </Box>
            </Box>

            {/* Información adicional */}
            <Box className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
               <Paper className="p-3 bg-gray-50 rounded-lg">
                  <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-1">
                     Tipo
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                     {config.chartType}
                  </Typography>
               </Paper>

               <Paper className="p-3 bg-gray-50 rounded-lg">
                  <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-1">
                     Filtros
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                     {config.filters.length} aplicados
                  </Typography>
               </Paper>

               <Paper className="p-3 bg-gray-50 rounded-lg">
                  <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-1">
                     Datos
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                     {data.length} registros
                  </Typography>
               </Paper>
            </Box>
         </motion.div>
      </Paper>
   );
};

export default ChartPreview;
