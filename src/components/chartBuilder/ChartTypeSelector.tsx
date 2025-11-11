// components/ChartBuilder/ChartTypeSelector.tsx
import React from "react";
import { motion } from "framer-motion";
import { Box, Typography, Paper, Tooltip, FormControlLabel, Switch, RadioGroup, Radio } from "@mui/material";
import { BarChart, ShowChart, PieChart, DonutLarge, ScatterPlot, AreaChart, Radar, CameraEnhanceRounded } from "@mui/icons-material";
import { ChartType } from "../../types/reporter";

interface ChartTypeSelectorProps {
   chartType: ChartType;
   onChartTypeChange: (type: ChartType) => void;
   showLegend: boolean;
   onShowLegendChange: (show: boolean) => void;
   showGrid: boolean;
   onShowGridChange: (show: boolean) => void;
   stacked: boolean;
   onStackedChange: (stacked: boolean) => void;
}

const chartTypes = [
   {
      type: "bar" as ChartType,
      label: "Barras",
      icon: BarChart,
      description: "Ideal para comparar categorías",
      color: "text-blue-600"
   },
   {
      type: "line" as ChartType,
      label: "Líneas",
      icon: ShowChart,
      description: "Perfecto para tendencias en el tiempo",
      color: "text-green-600"
   },
   {
      type: "pie" as ChartType,
      label: "Pastel",
      icon: PieChart,
      description: "Muestra proporciones de un todo",
      color: "text-purple-600"
   },
   {
      type: "doughnut" as ChartType,
      label: "Dona",
      icon: DonutLarge,
      description: "Variación del gráfico de pastel",
      color: "text-pink-600"
   },
   {
      type: "area" as ChartType,
      label: "Área",
      icon: AreaChart,
      description: "Similar a líneas pero con área rellena",
      color: "text-orange-600"
   },
   {
      type: "scatter" as ChartType,
      label: "Dispersión",
      icon: ScatterPlot,
      description: "Muestra correlación entre variables",
      color: "text-red-600"
   },
   {
      type: "radar" as ChartType,
      label: "Radar",
      icon: Radar,
      description: "Compara múltiples variables",
      color: "text-cyan-600"
   },
   {
      type: "polar" as ChartType,
      label: "Polar",
      icon: CameraEnhanceRounded,
      description: "Datos en coordenadas polares",
      color: "text-indigo-600"
   }
];

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
   chartType,
   onChartTypeChange,
   showLegend,
   onShowLegendChange,
   showGrid,
   onShowGridChange,
   stacked,
   onStackedChange
}) => {
   return (
      <Paper className="p-4 rounded-2xl shadow-sm border">
         <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
            Tipo de Gráfico
         </Typography>

         <RadioGroup value={chartType} className="mb-4">
            <Box className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {chartTypes.map((chart, index) => {
                  const IconComponent = chart.icon;
                  return (
                     <motion.div
                        key={chart.type}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                     >
                        <Tooltip title={chart.description} placement="top">
                           <Paper
                              className={`
                      p-3 cursor-pointer transition-all duration-200 border-2
                      ${chartType === chart.type ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"}
                    `}
                              onClick={() => onChartTypeChange(chart.type)}
                           >
                              <Box className="flex flex-col items-center text-center">
                                 <IconComponent
                                    className={`text-2xl mb-2 ${chart.color} ${chartType === chart.type ? "scale-110" : ""} transition-transform duration-200`}
                                 />
                                 <Typography variant="body2" className={`font-medium ${chartType === chart.type ? "text-blue-700" : "text-gray-700"}`}>
                                    {chart.label}
                                 </Typography>
                                 <Radio
                                    value={chart.type}
                                    checked={chartType === chart.type}
                                    onChange={() => onChartTypeChange(chart.type)}
                                    className="mt-1"
                                    size="small"
                                 />
                              </Box>
                           </Paper>
                        </Tooltip>
                     </motion.div>
                  );
               })}
            </Box>
         </RadioGroup>

         {/* Opciones adicionales */}
         <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
         >
            <FormControlLabel
               control={<Switch checked={showLegend} onChange={(e) => onShowLegendChange(e.target.checked)} color="primary" />}
               label="Mostrar leyenda"
            />

            <FormControlLabel control={<Switch checked={showGrid} onChange={(e) => onShowGridChange(e.target.checked)} color="primary" />} label="Mostrar grid" />

            {(chartType === "bar" || chartType === "area") && (
               <FormControlLabel control={<Switch checked={stacked} onChange={(e) => onStackedChange(e.target.checked)} color="primary" />} label="Gráfico apilado" />
            )}
         </motion.div>
      </Paper>
   );
};

export default ChartTypeSelector;
