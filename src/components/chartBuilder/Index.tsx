// components/ChartBuilder/RealTimeChartBuilder.tsx (actualizado completo)
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
   Box,
   Typography,
   TextField,
   Paper,
   Drawer,
   IconButton,
   Button,
   Divider,
   Chip,
   Alert,
   Snackbar,
   Tooltip,
   useTheme,
   useMediaQuery,
   FormControlLabel,
   Switch,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
   Collapse
} from "@mui/material";
import {
   Menu,
   Save,
   Download,
   Share,
   ZoomIn,
   ZoomOut,
   Fullscreen,
   FullscreenExit,
   FilterList,
   BarChart,
   ShowChart,
   PieChart,
   DonutLarge,
   ScatterPlot,
   AreaChart,
   Radar,
   SwapHoriz,
   Info,
   Add,
   Delete,
   Map,
   Warning,
   ExpandMore,
   ExpandLess
} from "@mui/icons-material";
import ReactECharts from "echarts-for-react";
import { ChartConfig, DataField, FilterCondition, FilterOperator } from "../../types/reporter";
import { useGlobalContext } from "../../context/GlobalContext";
import { utils, writeFile } from "xlsx";

// Datos de ejemplo extendidos
const sampleFields: DataField[] = [
   { id: "product", name: "product", type: "string", displayName: "Producto" },
   { id: "category", name: "category", type: "string", displayName: "Categoría" },
   { id: "sales", name: "sales", type: "number", displayName: "Ventas" },
   { id: "revenue", name: "revenue", type: "number", displayName: "Ingresos" },
   { id: "profit", name: "profit", type: "number", displayName: "Ganancia" },
   { id: "date", name: "date", type: "date", displayName: "Fecha" },
   { id: "region", name: "region", type: "string", displayName: "Región" },
   { id: "city", name: "city", type: "string", displayName: "Ciudad" },
   { id: "latitude", name: "latitude", type: "number", displayName: "Latitud" },
   { id: "longitude", name: "longitude", type: "number", displayName: "Longitud" },
   { id: "status", name: "status", type: "string", displayName: "Estado" },
   { id: "priority", name: "priority", type: "string", displayName: "Prioridad" }
];

const sampleData = Array.from({ length: 50 }, (_, i) => ({
   product: `Producto ${i + 1}`,
   category: ["Electrónicos", "Hogar", "Ropa", "Deportes", "Juguetes"][i % 5],
   sales: Math.floor(Math.random() * 1000) + 100,
   revenue: Math.floor(Math.random() * 10000) + 1000,
   profit: Math.floor(Math.random() * 2000) + 500,
   date: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
   region: ["Norte", "Sur", "Este", "Oeste", "Centro"][i % 5],
   city: ["Ciudad A", "Ciudad B", "Ciudad C", "Ciudad D", "Ciudad E"][i % 5],
   latitude: 19.4 + (Math.random() - 0.5) * 10,
   longitude: -99.1 + (Math.random() - 0.5) * 10,
   status: ["Activo", "Inactivo", "Pendiente"][i % 3],
   priority: ["Alta", "Media", "Baja"][i % 3]
}));

const chartTypes = [
   { type: "bar", label: "Barras", icon: BarChart, color: "text-blue-600" },
   { type: "line", label: "Líneas", icon: ShowChart, color: "text-green-600" },
   { type: "pie", label: "Pastel", icon: PieChart, color: "text-purple-600" },
   { type: "doughnut", label: "Dona", icon: DonutLarge, color: "text-pink-600" },
   { type: "area", label: "Área", icon: AreaChart, color: "text-orange-600" },
   { type: "scatter", label: "Dispersión", icon: ScatterPlot, color: "text-red-600" },
   { type: "radar", label: "Radar", icon: Radar, color: "text-cyan-600" },
   { type: "map", label: "Mapa", icon: Map, color: "text-teal-600" }
];

const operatorOptions: { value: FilterOperator; label: string; types: string[] }[] = [
   { value: "equals", label: "Igual a", types: ["string", "number", "date", "boolean"] },
   { value: "not_equals", label: "No igual a", types: ["string", "number", "date", "boolean"] },
   { value: "contains", label: "Contiene", types: ["string"] },
   { value: "not_contains", label: "No contiene", types: ["string"] },
   { value: "starts_with", label: "Comienza con", types: ["string"] },
   { value: "ends_with", label: "Termina con", types: ["string"] },
   { value: "greater_than", label: "Mayor que", types: ["number", "date"] },
   { value: "greater_than_equal", label: "Mayor o igual que", types: ["number", "date"] },
   { value: "less_than", label: "Menor que", types: ["number", "date"] },
   { value: "less_than_equal", label: "Menor o igual que", types: ["number", "date"] },
   { value: "between", label: "Entre", types: ["number", "date"] },
   { value: "not_between", label: "No entre", types: ["number", "date"] },
   { value: "in", label: "En lista", types: ["string", "number"] },
   { value: "not_in", label: "No en lista", types: ["string", "number"] },
   { value: "is_empty", label: "Está vacío", types: ["string", "number", "date"] },
   { value: "is_not_empty", label: "No está vacío", types: ["string", "number", "date"] },
   { value: "is_null", label: "Es nulo", types: ["string", "number", "date"] },
   { value: "is_not_null", label: "No es nulo", types: ["string", "number", "date"] }
];

const RealTimeChartBuilder: React.FC = () => {
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
   const [drawerOpen, setDrawerOpen] = useState(!isMobile);
   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
   const [isFullscreen, setIsFullscreen] = useState(false);
   const [advancedOpen, setAdvancedOpen] = useState(false);
   const [alerts, setAlerts] = useState<string[]>([]);
   const chartRef = useRef<any>();

   const { setIsLoading } = useGlobalContext();

   useEffect(() => {
      setIsLoading(false);
   }, []);

   const [chartConfig, setChartConfig] = useState<ChartConfig>({
      id: `chart-${Date.now()}`,
      title: "Mi Gráfico de Análisis",
      description: "Esta gráfica muestra el análisis de los datos seleccionados",
      chartType: "bar",
      xAxis: "category",
      yAxis: "sales",
      filters: [],
      colorScheme: "default",
      showLegend: true,
      showGrid: true,
      stacked: false,
      dateRange: {
         startDate: "2024-01-01",
         endDate: "2024-12-31"
      }
   });

   // Validaciones y alertas
   useEffect(() => {
      const newAlerts: string[] = [];

      // Validar campos de ejes
      const xField = sampleFields.find((f) => f.id === chartConfig.xAxis);
      const yField = sampleFields.find((f) => f.id === chartConfig.yAxis);

      if (!xField || !yField) {
         newAlerts.push("Selecciona ambos ejes para generar la gráfica");
      }

      // Validar tipo de gráfica vs campos
      if (chartConfig.chartType === "map" && (!xField || xField.type !== "string")) {
         newAlerts.push("Para mapas, el eje X debe ser una ubicación geográfica");
      }

      if (chartConfig.chartType === "scatter" && (xField?.type !== "number" || yField?.type !== "number")) {
         newAlerts.push("Para gráficas de dispersión, ambos ejes deben ser numéricos");
      }

      if (chartConfig.chartType === "pie" && yField?.type !== "number") {
         newAlerts.push("Para gráficas de pastel, el eje Y debe ser numérico");
      }

      // Validar rango de fechas
      if (chartConfig.dateRange) {
         const start = new Date(chartConfig.dateRange.startDate);
         const end = new Date(chartConfig.dateRange.endDate);
         if (start > end) {
            newAlerts.push("La fecha de inicio no puede ser mayor que la fecha final");
         }
      }

      setAlerts(newAlerts);
   }, [chartConfig]);

   

   // Componente de Filtros
   const FilterSection = () => {
      const addFilter = () => {
         const newFilter: FilterCondition = {
            id: `filter-${Date.now()}`,
            field: sampleFields[0]?.id || "",
            operator: "equals",
            value: ""
         };
         updateChartConfig({ filters: [...chartConfig.filters, newFilter] });
      };

      const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
         const updatedFilters = chartConfig.filters.map((filter) => (filter.id === id ? { ...filter, ...updates } : filter));
         updateChartConfig({ filters: updatedFilters });
      };

      const removeFilter = (id: string) => {
         const updatedFilters = chartConfig.filters.filter((filter) => filter.id !== id);
         updateChartConfig({ filters: updatedFilters });
      };

      const getFieldType = (fieldId: string) => {
         return sampleFields.find((f) => f.id === fieldId)?.type || "string";
      };

      const getOperatorsForField = (fieldType: string) => {
         return operatorOptions.filter((op) => op.types.includes(fieldType));
      };

      const renderValueInput = (filter: FilterCondition) => {
         const fieldType = getFieldType(filter.field);
         const operator = filter.operator;

         if (operator === "is_empty" || operator === "is_not_empty" || operator === "is_null" || operator === "is_not_null") {
            return null;
         }

         if (operator === "between" || operator === "not_between") {
            return (
               <Box className="flex gap-2">
                  <TextField
                     size="small"
                     type={fieldType === "date" ? "date" : fieldType === "number" ? "number" : "text"}
                     value={filter.value || ""}
                     onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                     placeholder="Desde"
                     fullWidth
                  />
                  <TextField
                     size="small"
                     type={fieldType === "date" ? "date" : fieldType === "number" ? "number" : "text"}
                     value={filter.value2 || ""}
                     onChange={(e) => updateFilter(filter.id, { value2: e.target.value })}
                     placeholder="Hasta"
                     fullWidth
                  />
               </Box>
            );
         }

         if (operator === "in" || operator === "not_in") {
            return (
               <TextField
                  size="small"
                  value={filter.value || ""}
                  onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                  placeholder="Valores separados por coma..."
                  fullWidth
                  helperText="Separa múltiples valores con comas"
               />
            );
         }

         return (
            <TextField
               size="small"
               type={fieldType === "date" ? "date" : fieldType === "number" ? "number" : "text"}
               value={filter.value || ""}
               onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
               placeholder="Valor..."
               fullWidth
            />
         );
      };

      return (
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
            <Paper className="p-4 rounded-xl shadow-sm border">
               <Box className="flex items-center justify-between mb-4">
                  <Typography variant="h6" className="font-semibold text-gray-800">
                     Filtros Avanzados
                  </Typography>
                  <Button startIcon={<Add />} onClick={addFilter} variant="outlined" size="small">
                     Agregar
                  </Button>
               </Box>

               <AnimatePresence>
                  {chartConfig.filters.length === 0 ? (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-4 text-gray-500">
                        <FilterList className="text-3xl mb-2 text-gray-300 mx-auto" />
                        <Typography variant="body2">No hay filtros aplicados</Typography>
                        <Typography variant="caption">Agrega filtros para refinar tus datos</Typography>
                     </motion.div>
                  ) : (
                     <Box className="space-y-3">
                        {chartConfig.filters.map((filter, index) => (
                           <motion.div
                              key={filter.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2, delay: index * 0.1 }}
                           >
                              <Paper className="p-3 border border-gray-200 rounded-lg">
                                 <Box className="flex items-start gap-3">
                                    <Chip label={`Filtro ${index + 1}`} size="small" color="primary" variant="outlined" />

                                    <Box className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                                       {/* Campo */}
                                       <FormControl size="small" className="md:col-span-3">
                                          <InputLabel>Campo</InputLabel>
                                          <Select value={filter.field} label="Campo" onChange={(e) => updateFilter(filter.id, { field: e.target.value })}>
                                             {sampleFields.map((field) => (
                                                <MenuItem key={field.id} value={field.id}>
                                                   {field.displayName}
                                                </MenuItem>
                                             ))}
                                          </Select>
                                       </FormControl>

                                       {/* Operador */}
                                       <FormControl size="small" className="md:col-span-3">
                                          <InputLabel>Operador</InputLabel>
                                          <Select
                                             value={filter.operator}
                                             label="Operador"
                                             onChange={(e) => updateFilter(filter.id, { operator: e.target.value as FilterOperator })}
                                          >
                                             {getOperatorsForField(getFieldType(filter.field)).map((op) => (
                                                <MenuItem key={op.value} value={op.value}>
                                                   {op.label}
                                                </MenuItem>
                                             ))}
                                          </Select>
                                       </FormControl>

                                       {/* Valor */}
                                       <Box className="md:col-span-5">{renderValueInput(filter)}</Box>

                                       {/* Eliminar */}
                                       <Box className="md:col-span-1 flex justify-center">
                                          <IconButton size="small" onClick={() => removeFilter(filter.id)} className="text-red-600 hover:bg-red-50">
                                             <Delete fontSize="small" />
                                          </IconButton>
                                       </Box>
                                    </Box>
                                 </Box>
                              </Paper>
                           </motion.div>
                        ))}
                     </Box>
                  )}
               </AnimatePresence>

               {chartConfig.filters.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.5 }}>
                     <Divider className="my-3" />
                     <Box className="flex items-center justify-between">
                        <Typography variant="body2" className="text-gray-600">
                           {chartConfig.filters.length} filtro{chartConfig.filters.length !== 1 ? "s" : ""} aplicado{chartConfig.filters.length !== 1 ? "s" : ""}
                        </Typography>
                        <Button onClick={() => updateChartConfig({ filters: [] })} color="error" size="small">
                           Limpiar todos
                        </Button>
                     </Box>
                  </motion.div>
               )}
            </Paper>
         </motion.div>
      );
   };

   // Función para aplicar filtros a los datos
   const getFilteredData = () => {
      let filteredData = [...sampleData];

      // Aplicar rango de fechas
      if (chartConfig.dateRange) {
         filteredData = filteredData.filter((item) => {
            const itemDate = new Date(item.date);
            const startDate = new Date(chartConfig.dateRange!.startDate);
            const endDate = new Date(chartConfig.dateRange!.endDate);
            return itemDate >= startDate && itemDate <= endDate;
         });
      }

      // Aplicar filtros avanzados
      chartConfig.filters.forEach((filter) => {
         const field = sampleFields.find((f) => f.id === filter.field);
         if (!field) return;

         filteredData = filteredData.filter((item) => {
            const value = item[field.name];

            switch (filter.operator) {
               case "equals":
                  return value == filter.value;
               case "not_equals":
                  return value != filter.value;
               case "contains":
                  return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
               case "not_contains":
                  return !String(value).toLowerCase().includes(String(filter.value).toLowerCase());
               case "starts_with":
                  return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
               case "ends_with":
                  return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
               case "greater_than":
                  return Number(value) > Number(filter.value);
               case "greater_than_equal":
                  return Number(value) >= Number(filter.value);
               case "less_than":
                  return Number(value) < Number(filter.value);
               case "less_than_equal":
                  return Number(value) <= Number(filter.value);
               case "between":
                  return Number(value) >= Number(filter.value) && Number(value) <= Number(filter.value2);
               case "not_between":
                  return Number(value) < Number(filter.value) || Number(value) > Number(filter.value2);
               case "in":
                  const inValues = String(filter.value)
                     .split(",")
                     .map((v) => v.trim());
                  return inValues.includes(String(value));
               case "not_in":
                  const notInValues = String(filter.value)
                     .split(",")
                     .map((v) => v.trim());
                  return !notInValues.includes(String(value));
               case "is_empty":
                  return value === "" || value === null || value === undefined;
               case "is_not_empty":
                  return value !== "" && value !== null && value !== undefined;
               case "is_null":
                  return value === null || value === undefined;
               case "is_not_null":
                  return value !== null && value !== undefined;
               default:
                  return true;
            }
         });
      });

      return filteredData;
   };

   // Generar opciones de ECharts basado en la configuración
   const getChartOptions = () => {
      const xField = sampleFields.find((f) => f.id === chartConfig.xAxis);
      const yField = sampleFields.find((f) => f.id === chartConfig.yAxis);
      const filteredData = getFilteredData();

      if (!xField || !yField) {
         return {
            title: { text: "Configura los ejes para ver la gráfica", left: "center", textStyle: { color: "#999" } },
            graphic: {
               elements: [
                  {
                     type: "text",
                     style: { text: "Selecciona campos para los ejes X e Y", fill: "#ccc" },
                     left: "center",
                     top: "center"
                  }
               ]
            }
         };
      }

      // Gráfica de Mapa
      if (chartConfig.chartType === "map") {
         return {
            title: {
               text: chartConfig.title,
               left: "center",
               textStyle: { fontSize: 16, fontWeight: "bold" }
            },
            tooltip: {
               trigger: "item",
               formatter: "{b}: {c}"
            },
            visualMap: {
               min: 0,
               max: Math.max(...filteredData.map((item) => item[yField.name])),
               text: ["Alto", "Bajo"],
               calculable: true,
               inRange: {
                  color: ["#4575b4", "#74add1", "#abd9e9", "#e0f3f8", "#ffffbf", "#fee090", "#fdae61", "#f46d43", "#d73027"]
               }
            },
            series: [
               {
                  name: yField.displayName,
                  type: "map",
                  map: "world",
                  data: filteredData.map((item) => ({
                     name: item[xField.name],
                     value: item[yField.name]
                  })),
                  emphasis: {
                     label: {
                        show: true
                     }
                  }
               }
            ]
         };
      }

      // Procesar datos para otras gráficas
      const categories = [...new Set(filteredData.map((item) => item[xField.name]))];
      const seriesData = categories.map((category) => {
         const items = filteredData.filter((item) => item[xField.name] === category);
         const value = items.reduce((sum, item) => sum + (item[yField.name] || 0), 0);
         return value;
      });

      const baseOptions: any = {
         title: {
            text: chartConfig.title,
            left: "center",
            textStyle: { fontSize: 16, fontWeight: "bold" }
         },
         tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c}"
         },
         legend: chartConfig.showLegend
            ? {
                 show: true,
                 orient: "horizontal",
                 bottom: 0
              }
            : { show: false },
         grid: chartConfig.showGrid
            ? {
                 left: "3%",
                 right: "4%",
                 bottom: chartConfig.showLegend ? "15%" : "3%",
                 containLabel: true
              }
            : { show: false }
      };

      // Configuración específica por tipo de gráfica
      switch (chartConfig.chartType) {
         case "bar":
            baseOptions.xAxis = {
               type: "category",
               data: categories,
               axisLabel: { rotate: 45 }
            };
            baseOptions.yAxis = { type: "value" };
            baseOptions.series = [
               {
                  name: yField.displayName,
                  type: "bar",
                  data: seriesData,
                  itemStyle: { color: "#3b82f6" }
               }
            ];
            break;

         case "line":
            baseOptions.xAxis = {
               type: "category",
               data: categories,
               axisLabel: { rotate: 45 }
            };
            baseOptions.yAxis = { type: "value" };
            baseOptions.series = [
               {
                  name: yField.displayName,
                  type: "line",
                  data: seriesData,
                  itemStyle: { color: "#10b981" },
                  lineStyle: { width: 3 }
               }
            ];
            break;

         case "pie":
            baseOptions.series = [
               {
                  name: yField.displayName,
                  type: "pie",
                  radius: "50%",
                  data: categories.map((category, index) => ({
                     name: category,
                     value: seriesData[index]
                  })),
                  emphasis: {
                     itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                     }
                  }
               }
            ];
            break;

         case "doughnut":
            baseOptions.series = [
               {
                  name: yField.displayName,
                  type: "pie",
                  radius: ["40%", "70%"],
                  data: categories.map((category, index) => ({
                     name: category,
                     value: seriesData[index]
                  }))
               }
            ];
            break;

         case "area":
            baseOptions.xAxis = {
               type: "category",
               data: categories,
               boundaryGap: false,
               axisLabel: { rotate: 45 }
            };
            baseOptions.yAxis = { type: "value" };
            baseOptions.series = [
               {
                  name: yField.displayName,
                  type: "line",
                  data: seriesData,
                  areaStyle: { color: "#f59e0b" },
                  lineStyle: { width: 2 }
               }
            ];
            break;

         case "scatter":
            baseOptions.xAxis = {
               type: "value",
               name: xField.displayName
            };
            baseOptions.yAxis = {
               type: "value",
               name: yField.displayName
            };
            baseOptions.series = [
               {
                  name: yField.displayName,
                  type: "scatter",
                  data: filteredData.map((item) => [item[xField.name], item[yField.name]]),
                  itemStyle: { color: "#ef4444" }
               }
            ];
            break;

         case "radar":
            baseOptions.radar = {
               indicator: categories.map((category) => ({ name: category, max: Math.max(...seriesData) }))
            };
            baseOptions.series = [
               {
                  name: yField.displayName,
                  type: "radar",
                  data: [
                     {
                        value: seriesData,
                        name: yField.displayName
                     }
                  ]
               }
            ];
            break;

         default:
            baseOptions.graphic = {
               elements: [
                  {
                     type: "text",
                     style: {
                        text: `Gráfico ${chartConfig.chartType} no implementado`,
                        fill: "#999"
                     },
                     left: "center",
                     top: "center"
                  }
               ]
            };
      }

      return baseOptions;
   };

   const updateChartConfig = (updates: Partial<ChartConfig>) => {
      setChartConfig((prev) => ({ ...prev, ...updates }));
   };

   const handleSaveReport = () => {
      showSnackbar("Reporte guardado exitosamente", "success");
   };

   const handleExportImage = () => {
      if (chartRef.current) {
         const chartInstance = chartRef.current.getEchartsInstance();
         const chartDataURL = chartInstance.getDataURL({
            type: "png",
            pixelRatio: 2,
            backgroundColor: "#fff"
         });

         const link = document.createElement("a");
         link.href = chartDataURL;
         link.download = `${chartConfig.title || "chart"}.png`;
         link.click();
      }
      showSnackbar("Gráfica exportada como imagen", "success");
   };

   const handleExportExcel = () => {
      const filteredData = getFilteredData();
      const worksheet = utils.json_to_sheet(filteredData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Datos Filtrados");
      writeFile(workbook, `${chartConfig.title || "datos"}.xlsx`);
      showSnackbar("Datos exportados a Excel", "success");
   };

   const handleZoomIn = () => {
      if (chartRef.current) {
         const chartInstance = chartRef.current.getEchartsInstance();
         chartInstance.dispatchAction({
            type: "dataZoom",
            start: 0,
            end: 50
         });
      }
   };

   const handleZoomOut = () => {
      if (chartRef.current) {
         const chartInstance = chartRef.current.getEchartsInstance();
         chartInstance.dispatchAction({
            type: "dataZoom",
            start: 0,
            end: 100
         });
      }
   };

   const toggleFullscreen = () => {
      setIsFullscreen(!isFullscreen);
   };

   const showSnackbar = (message: string, severity: "success" | "error") => {
      setSnackbar({ open: true, message, severity });
   };

   const filteredData = getFilteredData();

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
                           📊 Reporteador Avanzado
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                           Configura y visualiza al instante
                        </Typography>
                     </Box>
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
                  width: 450,
                  flexShrink: 0,
                  "& .MuiDrawer-paper": {
                     width: 450,
                     boxSizing: "border-box",
                     borderRight: "1px solid",
                     borderColor: "divider"
                  }
               }}
            >
               <Box className="h-full flex flex-col">
                  {/* Header del Drawer */}
                  <Box className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                     <Box className="flex items-center justify-between">
                        <Typography variant="h6" className="font-semibold text-gray-800">
                           Configuración
                        </Typography>
                        <IconButton onClick={() => setDrawerOpen(false)} size="small">
                           <Menu />
                        </IconButton>
                     </Box>
                  </Box>

                  {/* Contenido de Configuración - Scrollable */}
                  <Box className="flex-1 overflow-y-auto p-4 space-y-6">
                     {/* Alertas */}
                     {alerts.length > 0 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                           <Alert severity="warning" icon={<Warning />}>
                              <Box>
                                 <Typography variant="subtitle2" className="font-semibold">
                                    Verifica la configuración:
                                 </Typography>
                                 {alerts.map((alert, index) => (
                                    <Typography key={index} variant="body2" className="mt-1">
                                       • {alert}
                                    </Typography>
                                 ))}
                              </Box>
                           </Alert>
                        </motion.div>
                     )}

                     {/* Información Básica */}
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <Paper className="p-4 rounded-xl shadow-sm border">
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
                              className="mb-3"
                           />

                           <TextField
                              label="Descripción"
                              value={chartConfig.description}
                              onChange={(e) => updateChartConfig({ description: e.target.value })}
                              placeholder="Describe el propósito de este gráfico..."
                              multiline
                              rows={3}
                              fullWidth
                              variant="outlined"
                           />
                        </Paper>
                     </motion.div>

                     {/* Rango de Fechas */}
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                        <Paper className="p-4 rounded-xl shadow-sm border">
                           <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                              Rango de Fechas
                           </Typography>

                           <Box className="grid grid-cols-2 gap-3">
                              <TextField
                                 label="Fecha de inicio"
                                 type="date"
                                 value={chartConfig.dateRange?.startDate || ""}
                                 onChange={(e) =>
                                    updateChartConfig({
                                       dateRange: {
                                          ...chartConfig.dateRange,
                                          startDate: e.target.value
                                       }
                                    })
                                 }
                                 InputLabelProps={{ shrink: true }}
                                 fullWidth
                              />

                              <TextField
                                 label="Fecha de fin"
                                 type="date"
                                 value={chartConfig.dateRange?.endDate || ""}
                                 onChange={(e) =>
                                    updateChartConfig({
                                       dateRange: {
                                          ...chartConfig.dateRange,
                                          endDate: e.target.value
                                       }
                                    })
                                 }
                                 InputLabelProps={{ shrink: true }}
                                 fullWidth
                              />
                           </Box>
                        </Paper>
                     </motion.div>

                     {/* Selección de Ejes */}
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                        <Paper className="p-4 rounded-xl shadow-sm border">
                           <Box className="flex items-center justify-between mb-4">
                              <Typography variant="h6" className="font-semibold text-gray-800">
                                 Configuración de Ejes
                              </Typography>
                              <Tooltip title="Intercambiar ejes">
                                 <IconButton
                                    onClick={() =>
                                       updateChartConfig({
                                          xAxis: chartConfig.yAxis,
                                          yAxis: chartConfig.xAxis
                                       })
                                    }
                                    size="small"
                                 >
                                    <SwapHoriz />
                                 </IconButton>
                              </Tooltip>
                           </Box>

                           <Box className="space-y-4">
                              <FormControl fullWidth size="small">
                                 <InputLabel>Eje X (Categorías)</InputLabel>
                                 <Select value={chartConfig.xAxis} label="Eje X (Categorías)" onChange={(e) => updateChartConfig({ xAxis: e.target.value })}>
                                    {sampleFields.map((field) => (
                                       <MenuItem key={field.id} value={field.id}>
                                          <Box className="flex items-center justify-between w-full">
                                             <Typography variant="body2">{field.displayName}</Typography>
                                             <Chip label={field.type} size="small" color={field.type === "number" ? "primary" : "secondary"} variant="outlined" />
                                          </Box>
                                       </MenuItem>
                                    ))}
                                 </Select>
                              </FormControl>

                              <FormControl fullWidth size="small">
                                 <InputLabel>Eje Y (Valores)</InputLabel>
                                 <Select value={chartConfig.yAxis} label="Eje Y (Valores)" onChange={(e) => updateChartConfig({ yAxis: e.target.value })}>
                                    {sampleFields.map((field) => (
                                       <MenuItem key={field.id} value={field.id}>
                                          <Box className="flex items-center justify-between w-full">
                                             <Typography variant="body2">{field.displayName}</Typography>
                                             <Chip label={field.type} size="small" color={field.type === "number" ? "primary" : "secondary"} variant="outlined" />
                                          </Box>
                                       </MenuItem>
                                    ))}
                                 </Select>
                              </FormControl>
                           </Box>
                        </Paper>
                     </motion.div>

                     {/* Tipo de Gráfico */}
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
                        <Paper className="p-4 rounded-xl shadow-sm border">
                           <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                              Tipo de Gráfico
                           </Typography>

                           <Box className="grid grid-cols-3 gap-2 mb-4">
                              {chartTypes.map((chart) => {
                                 const IconComponent = chart.icon;
                                 return (
                                    <Tooltip key={chart.type} title={chart.label}>
                                       <Paper
                                          className={`
                              p-2 cursor-pointer transition-all duration-200 border-2 text-center
                              ${
                                 chartConfig.chartType === chart.type
                                    ? "border-blue-500 bg-blue-50 shadow-md"
                                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                              }
                            `}
                                          onClick={() => updateChartConfig({ chartType: chart.type as any })}
                                       >
                                          <IconComponent
                                             className={`text-2xl mx-auto mb-1 ${chart.color} ${
                                                chartConfig.chartType === chart.type ? "scale-110" : ""
                                             } transition-transform duration-200`}
                                          />
                                          <Typography
                                             variant="caption"
                                             className={`font-medium block ${chartConfig.chartType === chart.type ? "text-blue-700" : "text-gray-700"}`}
                                          >
                                             {chart.label}
                                          </Typography>
                                       </Paper>
                                    </Tooltip>
                                 );
                              })}
                           </Box>

                           <Box className="grid grid-cols-2 gap-4">
                              <FormControlLabel
                                 control={
                                    <Switch checked={chartConfig.showLegend} onChange={(e) => updateChartConfig({ showLegend: e.target.checked })} color="primary" />
                                 }
                                 label="Mostrar leyenda"
                              />

                              <FormControlLabel
                                 control={
                                    <Switch checked={chartConfig.showGrid} onChange={(e) => updateChartConfig({ showGrid: e.target.checked })} color="primary" />
                                 }
                                 label="Mostrar grid"
                              />
                           </Box>

                           {/* Configuraciones avanzadas */}
                           <Box className="mt-4">
                              <Button
                                 fullWidth
                                 onClick={() => setAdvancedOpen(!advancedOpen)}
                                 startIcon={advancedOpen ? <ExpandLess /> : <ExpandMore />}
                                 variant="outlined"
                                 size="small"
                              >
                                 Configuraciones Avanzadas
                              </Button>

                              <Collapse in={advancedOpen}>
                                 <Box className="mt-3 space-y-3 p-3 bg-gray-50 rounded-lg">
                                    <FormControlLabel
                                       control={
                                          <Switch
                                             checked={chartConfig.stacked || false}
                                             onChange={(e) => updateChartConfig({ stacked: e.target.checked })}
                                             color="primary"
                                          />
                                       }
                                       label="Gráfico apilado"
                                    />

                                    <FormControl fullWidth size="small">
                                       <InputLabel>Esquema de colores</InputLabel>
                                       <Select
                                          value={chartConfig.colorScheme}
                                          label="Esquema de colores"
                                          onChange={(e) => updateChartConfig({ colorScheme: e.target.value })}
                                       >
                                          <MenuItem value="default">Por defecto</MenuItem>
                                          <MenuItem value="vibrant">Vibrante</MenuItem>
                                          <MenuItem value="pastel">Pastel</MenuItem>
                                          <MenuItem value="monochrome">Monocromático</MenuItem>
                                       </Select>
                                    </FormControl>
                                 </Box>
                              </Collapse>
                           </Box>
                        </Paper>
                     </motion.div>

                     {/* Filtros */}
                     <FilterSection />

                     {/* Acciones */}
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
                        <Paper className="p-4 rounded-xl shadow-sm border">
                           <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                              Acciones
                           </Typography>

                           <Box className="grid grid-cols-1 gap-2">
                              <Button startIcon={<Save />} onClick={handleSaveReport} variant="outlined" fullWidth>
                                 Guardar Reporte
                              </Button>

                              <Box className="grid grid-cols-2 gap-2">
                                 <Button startIcon={<Download />} onClick={handleExportImage} variant="contained" fullWidth className="bg-blue-600 hover:bg-blue-700">
                                    Exportar Imagen
                                 </Button>

                                 <Button
                                    startIcon={<Download />}
                                    onClick={handleExportExcel}
                                    variant="contained"
                                    fullWidth
                                    className="bg-green-600 hover:bg-green-700"
                                 >
                                    Exportar Excel
                                 </Button>
                              </Box>
                           </Box>
                        </Paper>
                     </motion.div>
                  </Box>
               </Box>
            </Drawer>

            {/* Contenido Principal - Gráfica en Tiempo Real */}
            <Box className={`flex-1 transition-all duration-300 ${drawerOpen && !isMobile ? "ml-0" : "ml-0"}`}>
               <Box className={`h-full p-6 ${isFullscreen ? "fixed inset-0 z-50 bg-white p-0" : ""}`}>
                  {/* Controles de la Gráfica */}
                  {!isFullscreen && !drawerOpen && (
                     <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-4">
                        <Button startIcon={<Menu />} onClick={() => setDrawerOpen(true)} variant="outlined" size="small">
                           Configuración
                        </Button>
                     </motion.div>
                  )}

                  {/* Gráfica en Tiempo Real */}
                  <motion.div
                     key={`chart-${chartConfig.chartType}-${chartConfig.xAxis}-${chartConfig.yAxis}-${chartConfig.filters.length}`}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.4 }}
                     className={`bg-white rounded-xl shadow-lg border ${isFullscreen ? "h-full w-full" : "h-[600px]"}`}
                  >
                     {/* Header de la Gráfica */}
                     <Box className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <Box>
                           <Typography variant="h6" className="font-semibold text-gray-800">
                              {chartConfig.title}
                           </Typography>
                           {chartConfig.description && (
                              <Typography variant="body2" className="text-gray-600">
                                 {chartConfig.description}
                              </Typography>
                           )}
                        </Box>

                        <Box className="flex items-center gap-1">
                           <Tooltip title="Zoom In">
                              <IconButton size="small" onClick={handleZoomIn}>
                                 <ZoomIn />
                              </IconButton>
                           </Tooltip>

                           <Tooltip title="Zoom Out">
                              <IconButton size="small" onClick={handleZoomOut}>
                                 <ZoomOut />
                              </IconButton>
                           </Tooltip>

                           <Tooltip title="Exportar Imagen">
                              <IconButton size="small" onClick={handleExportImage}>
                                 <Download />
                              </IconButton>
                           </Tooltip>

                           <Tooltip title="Exportar Excel">
                              <IconButton size="small" onClick={handleExportExcel}>
                                 <Download />
                              </IconButton>
                           </Tooltip>

                           <Tooltip title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
                              <IconButton size="small" onClick={toggleFullscreen}>
                                 {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                              </IconButton>
                           </Tooltip>
                        </Box>
                     </Box>

                     {/* Gráfica ECharts */}
                     <Box className={`${isFullscreen ? "h-[calc(100%-80px)]" : "h-[calc(100%-80px)]"} p-4`}>
                        <ReactECharts ref={chartRef} option={getChartOptions()} style={{ height: "100%", width: "100%" }} opts={{ renderer: "svg" }} />
                     </Box>
                  </motion.div>

                  {/* Información de Configuración */}
                  {!isFullscreen && (
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-6">
                        <Paper className="p-4 rounded-xl shadow-sm border">
                           <Box className="flex items-center justify-between">
                              <Typography variant="h6" className="font-semibold text-gray-800">
                                 Configuración Actual
                              </Typography>
                              <Chip label={`${filteredData.length} registros`} size="small" color="info" variant="outlined" />
                           </Box>
                           <Box className="flex flex-wrap gap-2 mt-2">
                              <Chip label={`Tipo: ${chartConfig.chartType}`} size="small" color="primary" variant="outlined" />
                              <Chip
                                 label={`Eje X: ${sampleFields.find((f) => f.id === chartConfig.xAxis)?.displayName}`}
                                 size="small"
                                 color="secondary"
                                 variant="outlined"
                              />
                              <Chip
                                 label={`Eje Y: ${sampleFields.find((f) => f.id === chartConfig.yAxis)?.displayName}`}
                                 size="small"
                                 color="success"
                                 variant="outlined"
                              />
                              <Chip label={`Filtros: ${chartConfig.filters.length}`} size="small" color="warning" variant="outlined" />
                              <Chip
                                 label={`Rango: ${chartConfig.dateRange?.startDate} a ${chartConfig.dateRange?.endDate}`}
                                 size="small"
                                 color="info"
                                 variant="outlined"
                              />
                           </Box>
                        </Paper>
                     </motion.div>
                  )}
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
