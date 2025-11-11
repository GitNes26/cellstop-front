// components/ChartBuilder/RealTimeChartBuilder.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, TextField, Paper, Drawer, IconButton, Button, Divider, Chip, Alert, Snackbar, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import { Menu, Save, Download, Share, Settings, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { ChartConfig, DataField } from "../../types/reporter";
import FieldSelector from "./FieldSelector";
import ChartTypeSelector from "./ChartTypeSelector";
import FilterBuilder from "./FilterBuilder";
import ChartPreview from "./ChartPreview";
import { useGlobalContext } from "../../context/GlobalContext";

// Datos de ejemplo
const sampleFields: DataField[] = [
   { id: "product", name: "product", type: "string", displayName: "Producto" },
   { id: "category", name: "category", type: "string", displayName: "Categoría" },
   { id: "sales", name: "sales", type: "number", displayName: "Ventas" },
   { id: "revenue", name: "revenue", type: "number", displayName: "Ingresos" },
   { id: "date", name: "date", type: "date", displayName: "Fecha" },
   { id: "region", name: "region", type: "string", displayName: "Región" },
   { id: "active", name: "active", type: "boolean", displayName: "Activo" }
];

const sampleData = Array.from({ length: 50 }, (_, i) => ({
   product: `Producto ${i + 1}`,
   category: ["Electrónicos", "Hogar", "Ropa", "Deportes"][i % 4],
   sales: Math.floor(Math.random() * 1000),
   revenue: Math.floor(Math.random() * 10000),
   date: new Date(2024, i % 12, (i % 28) + 1).toISOString().split("T")[0],
   region: ["Norte", "Sur", "Este", "Oeste"][i % 4],
   active: i % 3 === 0
}));

const RealTimeChartBuilder: React.FC = () => {
   const { setIsLoading } = useGlobalContext();

   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
   const [drawerOpen, setDrawerOpen] = useState(!isMobile);
   const [activeSection, setActiveSection] = useState("basic");
   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

   const [chartConfig, setChartConfig] = useState<ChartConfig>({
      id: `chart-${Date.now()}`,
      title: "Mi Gráfico de Análisis",
      description: "Esta gráfica muestra el análisis de los datos seleccionados",
      chartType: "bar",
      xAxis: "",
      yAxis: "",
      filters: [],
      colorScheme: "default",
      showLegend: true,
      showGrid: true,
      stacked: false
   });

   const sections = [
      { id: "basic", label: "Información Básica", icon: "📝" },
      { id: "data", label: "Datos y Ejes", icon: "📊" },
      { id: "chart", label: "Tipo de Gráfico", icon: "🎨" },
      { id: "filters", label: "Filtros", icon: "🔍" }
   ];

   const updateChartConfig = (updates: Partial<ChartConfig>) => {
      setChartConfig((prev) => ({ ...prev, ...updates }));
   };

   const handleSaveReport = () => {
      showSnackbar("Reporte guardado exitosamente", "success");
   };

   const handleExport = () => {
      showSnackbar("Reporte exportado exitosamente", "success");
   };

   const showSnackbar = (message: string, severity: "success" | "error") => {
      setSnackbar({ open: true, message, severity });
   };

   const renderSectionContent = () => {
      switch (activeSection) {
         case "basic":
            return (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                     Información del Reporte
                  </Typography>

                  <TextField
                     label="Título del gráfico"
                     value={chartConfig.title}
                     onChange={(e) => updateChartConfig({ title: e.target.value })}
                     placeholder="Ingresa un título descriptivo..."
                     fullWidth
                     variant="outlined"
                  />

                  <TextField
                     label="Descripción"
                     value={chartConfig.description}
                     onChange={(e) => updateChartConfig({ description: e.target.value })}
                     placeholder="Describe el propósito de este gráfico..."
                     multiline
                     rows={4}
                     fullWidth
                     variant="outlined"
                  />

                  <Paper className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                     <Typography variant="body2" className="text-blue-800">
                        💡 <strong>Consejo:</strong> Usa títulos descriptivos que expliquen claramente lo que muestra la gráfica. La descripción ayuda a otros usuarios
                        a entender el contexto y propósito del reporte.
                     </Typography>
                  </Paper>
               </motion.div>
            );

         case "data":
            return (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                  <FieldSelector
                     fields={sampleFields}
                     xAxis={chartConfig.xAxis}
                     yAxis={chartConfig.yAxis}
                     onXAxisChange={(field) => updateChartConfig({ xAxis: field })}
                     onYAxisChange={(field) => updateChartConfig({ yAxis: field })}
                     onSwapAxes={() =>
                        updateChartConfig({
                           xAxis: chartConfig.yAxis,
                           yAxis: chartConfig.xAxis
                        })
                     }
                  />
               </motion.div>
            );

         case "chart":
            return (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                  <ChartTypeSelector
                     chartType={chartConfig.chartType}
                     onChartTypeChange={(type) => updateChartConfig({ chartType: type })}
                     showLegend={chartConfig.showLegend}
                     onShowLegendChange={(show) => updateChartConfig({ showLegend: show })}
                     showGrid={chartConfig.showGrid}
                     onShowGridChange={(show) => updateChartConfig({ showGrid: show })}
                     stacked={chartConfig.stacked}
                     onStackedChange={(stacked) => updateChartConfig({ stacked })}
                  />
               </motion.div>
            );

         case "filters":
            return (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                  <FilterBuilder fields={sampleFields} filters={chartConfig.filters} onFiltersChange={(filters) => updateChartConfig({ filters })} />
               </motion.div>
            );

         default:
            return null;
      }
   };

   useEffect(() => {
      setIsLoading(false);
   }, []);

   return (
      <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
         {/* Header */}
         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Paper className="rounded-none shadow-sm border-b">
               <Box className="p-4 flex items-center justify-between">
                  <Box className="flex items-center gap-4">
                     <IconButton onClick={() => setDrawerOpen(!drawerOpen)} className="text-gray-700">
                        <Menu />
                     </IconButton>

                     <Box>
                        <Typography variant="h4" className="font-bold text-gray-800">
                           📊 Reporteador
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                           Crea visualizaciones en tiempo real
                        </Typography>
                     </Box>
                  </Box>

                  <Box className="flex items-center gap-2">
                     <Tooltip title="Guardar reporte">
                        <Button startIcon={<Save />} onClick={handleSaveReport} variant="outlined" size="small">
                           Guardar
                        </Button>
                     </Tooltip>

                     <Tooltip title="Exportar reporte">
                        <Button startIcon={<Download />} onClick={handleExport} variant="contained" size="small" className="bg-blue-600 hover:bg-blue-700">
                           Exportar
                        </Button>
                     </Tooltip>
                  </Box>
               </Box>
            </Paper>
         </motion.div>

         <Box className="flex h-[calc(100vh-80px)]">
            {/* Drawer de Configuración */}
            <Drawer
               variant={isMobile ? "temporary" : "persistent"}
               open={drawerOpen}
               onClose={() => setDrawerOpen(false)}
               sx={{
                  width: 320,
                  flexShrink: 0,
                  "& .MuiDrawer-paper": {
                     width: 320,
                     boxSizing: "border-box",
                     borderRight: "1px solid",
                     borderColor: "divider"
                  }
               }}
            >
               <Box className="h-full flex flex-col">
                  {/* Header del Drawer */}
                  <Box className="p-4 border-b border-gray-200">
                     <Box className="flex items-center justify-between">
                        <Typography variant="h6" className="font-semibold text-gray-800">
                           Configuración
                        </Typography>
                        <IconButton onClick={() => setDrawerOpen(false)} size="small">
                           <ChevronLeft />
                        </IconButton>
                     </Box>
                  </Box>

                  {/* Navegación de Secciones */}
                  <Box className="p-4 border-b border-gray-200">
                     <Typography variant="subtitle2" className="font-medium text-gray-600 mb-3">
                        CONFIGURACIÓN
                     </Typography>
                     <Box className="space-y-1">
                        {sections.map((section) => (
                           <Button
                              key={section.id}
                              fullWidth
                              onClick={() => setActiveSection(section.id)}
                              className={`justify-start px-3 py-2 rounded-lg transition-all ${
                                 activeSection === section.id ? "bg-blue-100 text-blue-700 border border-blue-200" : "text-gray-700 hover:bg-gray-100"
                              }`}
                              startIcon={<span>{section.icon}</span>}
                           >
                              <Typography variant="body2" className="font-medium">
                                 {section.label}
                              </Typography>
                           </Button>
                        ))}
                     </Box>
                  </Box>

                  {/* Contenido de la Sección */}
                  <Box className="flex-1 overflow-y-auto p-4">{renderSectionContent()}</Box>

                  {/* Footer del Drawer */}
                  <Box className="p-4 border-t border-gray-200 bg-gray-50">
                     <Typography variant="caption" className="text-gray-500 block text-center">
                        Los cambios se aplican en tiempo real
                     </Typography>
                  </Box>
               </Box>
            </Drawer>

            {/* Contenido Principal - Vista Previa */}
            <Box className={`flex-1 transition-all duration-300 ${drawerOpen && !isMobile ? "ml-0" : "ml-0"}`}>
               <Box className="h-full p-6">
                  {/* Botón para abrir drawer en móvil */}
                  {!drawerOpen && (
                     <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-4">
                        <Button startIcon={<ChevronRight />} onClick={() => setDrawerOpen(true)} variant="outlined" size="small">
                           Configuración
                        </Button>
                     </motion.div>
                  )}

                  {/* Vista Previa en Tiempo Real */}
                  <motion.div
                     key={`preview-${chartConfig.id}`}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.4 }}
                     className="h-full"
                  >
                     <ChartPreview config={chartConfig} fields={sampleFields} data={sampleData} />
                  </motion.div>

                  {/* Información de Configuración Actual */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-6">
                     <Paper className="p-4 rounded-xl shadow-sm border">
                        <Typography variant="h6" className="font-semibold text-gray-800 mb-3">
                           Configuración Actual
                        </Typography>
                        <Box className="flex flex-wrap gap-2">
                           <Chip label={`Tipo: ${chartConfig.chartType}`} size="small" color="primary" variant="outlined" />
                           <Chip
                              label={`Eje X: ${sampleFields.find((f) => f.id === chartConfig.xAxis)?.displayName || "No seleccionado"}`}
                              size="small"
                              color="secondary"
                              variant="outlined"
                           />
                           <Chip
                              label={`Eje Y: ${sampleFields.find((f) => f.id === chartConfig.yAxis)?.displayName || "No seleccionado"}`}
                              size="small"
                              color="success"
                              variant="outlined"
                           />
                           <Chip label={`Filtros: ${chartConfig.filters.length}`} size="small" color="warning" variant="outlined" />
                           <Chip label={`Leyenda: ${chartConfig.showLegend ? "Sí" : "No"}`} size="small" color="info" variant="outlined" />
                        </Box>
                     </Paper>
                  </motion.div>
               </Box>
            </Box>
         </Box>

         <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
         >
            <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
               {snackbar.message}
            </Alert>
         </Snackbar>
      </Box>
   );
};

export default RealTimeChartBuilder;

// // components/ChartBuilder/ChartBuilder.tsx
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Box, Typography, TextField, Button, Paper, Stepper, Step, StepLabel, StepContent, Alert, Snackbar } from "@mui/material";
// import { Save, Download, Share, Preview } from "@mui/icons-material";
// import { ChartConfig, DataField, FilterCondition } from "../../types/reporter";
// import FieldSelector from "./FieldSelector";
// import ChartTypeSelector from "./ChartTypeSelector";
// import FilterBuilder from "./FilterBuilder";
// import ChartPreview from "./ChartPreview";
// import { useGlobalContext } from "../../context/GlobalContext";

// // Datos de ejemplo
// const sampleFields: DataField[] = [
//    { id: "product", name: "product", type: "string", displayName: "Producto" },
//    { id: "category", name: "category", type: "string", displayName: "Categoría" },
//    { id: "sales", name: "sales", type: "number", displayName: "Ventas" },
//    { id: "revenue", name: "revenue", type: "number", displayName: "Ingresos" },
//    { id: "date", name: "date", type: "date", displayName: "Fecha" },
//    { id: "region", name: "region", type: "string", displayName: "Región" },
//    { id: "active", name: "active", type: "boolean", displayName: "Activo" }
// ];

// const sampleData = Array.from({ length: 50 }, (_, i) => ({
//    product: `Producto ${i + 1}`,
//    category: ["Electrónicos", "Hogar", "Ropa", "Deportes"][i % 4],
//    sales: Math.floor(Math.random() * 1000),
//    revenue: Math.floor(Math.random() * 10000),
//    date: new Date(2024, i % 12, (i % 28) + 1).toISOString().split("T")[0],
//    region: ["Norte", "Sur", "Este", "Oeste"][i % 4],
//    active: i % 3 === 0
// }));

// const ChartBuilder: React.FC = () => {
//    const { setIsLoading } = useGlobalContext();
//    const [activeStep, setActiveStep] = useState(0);
//    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

//    const [chartConfig, setChartConfig] = useState<ChartConfig>({
//       id: `chart-${Date.now()}`,
//       title: "",
//       description: "",
//       chartType: "bar",
//       xAxis: "",
//       yAxis: "",
//       filters: [],
//       colorScheme: "default",
//       showLegend: true,
//       showGrid: true,
//       stacked: false
//    });

//    const steps = ["Configurar ejes", "Seleccionar tipo de gráfico", "Aplicar filtros", "Personalizar y previsualizar"];

//    const handleNext = () => {
//       setActiveStep((prev) => prev + 1);
//    };

//    const handleBack = () => {
//       setActiveStep((prev) => prev - 1);
//    };

//    const updateChartConfig = (updates: Partial<ChartConfig>) => {
//       setChartConfig((prev) => ({ ...prev, ...updates }));
//    };

//    const handleSaveReport = () => {
//       // Aquí iría la lógica para guardar el reporte
//       showSnackbar("Reporte guardado exitosamente", "success");
//    };

//    const handleExport = () => {
//       // Aquí iría la lógica para exportar
//       showSnackbar("Reporte exportado exitosamente", "success");
//    };

//    const showSnackbar = (message: string, severity: "success" | "error") => {
//       setSnackbar({ open: true, message, severity });
//    };

//    const renderStepContent = (step: number) => {
//       switch (step) {
//          case 0:
//             return (
//                <FieldSelector
//                   fields={sampleFields}
//                   xAxis={chartConfig.xAxis}
//                   yAxis={chartConfig.yAxis}
//                   onXAxisChange={(field) => updateChartConfig({ xAxis: field })}
//                   onYAxisChange={(field) => updateChartConfig({ yAxis: field })}
//                   onSwapAxes={() =>
//                      updateChartConfig({
//                         xAxis: chartConfig.yAxis,
//                         yAxis: chartConfig.xAxis
//                      })
//                   }
//                />
//             );
//          case 1:
//             return (
//                <ChartTypeSelector
//                   chartType={chartConfig.chartType}
//                   onChartTypeChange={(type) => updateChartConfig({ chartType: type })}
//                   showLegend={chartConfig.showLegend}
//                   onShowLegendChange={(show) => updateChartConfig({ showLegend: show })}
//                   showGrid={chartConfig.showGrid}
//                   onShowGridChange={(show) => updateChartConfig({ showGrid: show })}
//                   stacked={chartConfig.stacked}
//                   onStackedChange={(stacked) => updateChartConfig({ stacked })}
//                />
//             );
//          case 2:
//             return <FilterBuilder fields={sampleFields} filters={chartConfig.filters} onFiltersChange={(filters) => updateChartConfig({ filters })} />;
//          case 3:
//             return (
//                <Box className="space-y-4">
//                   <Paper className="p-4 rounded-2xl shadow-sm border">
//                      <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
//                         Información del Reporte
//                      </Typography>
//                      <Box className="grid grid-cols-1 gap-4">
//                         <TextField
//                            label="Título del gráfico"
//                            value={chartConfig.title}
//                            onChange={(e) => updateChartConfig({ title: e.target.value })}
//                            placeholder="Ingresa un título descriptivo..."
//                            fullWidth
//                         />
//                         <TextField
//                            label="Descripción"
//                            value={chartConfig.description}
//                            onChange={(e) => updateChartConfig({ description: e.target.value })}
//                            placeholder="Describe el propósito de este gráfico..."
//                            multiline
//                            rows={3}
//                            fullWidth
//                         />
//                      </Box>
//                   </Paper>

//                   <ChartPreview config={chartConfig} fields={sampleFields} data={sampleData} />
//                </Box>
//             );
//          default:
//             return null;
//       }
//    };

//    useEffect(() => {
//       setIsLoading(false);
//    }, []);

//    return (
//       <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
//             <Typography variant="h3" className="text-center font-bold text-gray-800 mb-2">
//                📊 Reporteador Avanzado
//             </Typography>
//             <Typography variant="h6" className="text-center text-gray-600 mb-8">
//                Crea visualizaciones de datos impactantes en minutos
//             </Typography>
//          </motion.div>

//          <Box className="max-w-6xl mx-auto">
//             <Paper className="p-6 rounded-2xl shadow-xl border-0">
//                {/* Stepper */}
//                <Stepper activeStep={activeStep} orientation="vertical" className="mb-8">
//                   {steps.map((label, index) => (
//                      <Step key={label}>
//                         <StepLabel>
//                            <Typography variant="h6" className="font-semibold">
//                               {label}
//                            </Typography>
//                         </StepLabel>
//                         <StepContent>
//                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="my-4">
//                               {renderStepContent(index)}

//                               <Box className="mt-4 flex gap-2">
//                                  <Button onClick={handleBack} disabled={index === 0} variant="outlined">
//                                     Atrás
//                                  </Button>
//                                  <Button
//                                     onClick={handleNext}
//                                     variant="contained"
//                                     disabled={(index === 0 && (!chartConfig.xAxis || !chartConfig.yAxis)) || (index === 3 && !chartConfig.title)}
//                                  >
//                                     {index === steps.length - 1 ? "Finalizar" : "Siguiente"}
//                                  </Button>
//                               </Box>
//                            </motion.div>
//                         </StepContent>
//                      </Step>
//                   ))}
//                </Stepper>

//                {/* Acciones finales */}
//                {activeStep === steps.length && (
//                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8">
//                      <Typography variant="h4" className="font-bold text-green-600 mb-4">
//                         ¡Reporte Listo!
//                      </Typography>
//                      <Typography variant="body1" className="text-gray-600 mb-6">
//                         Tu reporte ha sido configurado exitosamente. Ahora puedes guardarlo, exportarlo o compartirlo.
//                      </Typography>

//                      <Box className="flex flex-wrap gap-4 justify-center">
//                         <Button variant="contained" startIcon={<Save />} onClick={handleSaveReport} size="large" className="bg-green-600 hover:bg-green-700">
//                            Guardar Reporte
//                         </Button>

//                         <Button variant="outlined" startIcon={<Download />} onClick={handleExport} size="large" className="text-blue-600 border-blue-600">
//                            Exportar
//                         </Button>

//                         <Button variant="outlined" startIcon={<Share />} size="large" className="text-purple-600 border-purple-600">
//                            Compartir
//                         </Button>

//                         <Button variant="text" startIcon={<Preview />} onClick={() => setActiveStep(3)} size="large">
//                            Ver Previsualización
//                         </Button>
//                      </Box>
//                   </motion.div>
//                )}
//             </Paper>
//          </Box>

//          <Snackbar
//             open={snackbar.open}
//             autoHideDuration={4000}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//          >
//             <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
//                {snackbar.message}
//             </Alert>
//          </Snackbar>
//       </Box>
//    );
// };

// export default ChartBuilder;
