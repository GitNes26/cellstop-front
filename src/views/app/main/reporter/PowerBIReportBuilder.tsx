// components/ReportBuilder/PowerBIReportBuilder.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
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
   Collapse,
   Tabs,
   Tab,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Grid,
   Card,
   CardContent,
   CardHeader,
   Avatar,
   List,
   ListItem,
   ListItemText,
   ListItemIcon,
   Checkbox,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   LinearProgress,
   Badge
} from "@mui/material";
import {
   Menu,
   Save,
   Download,
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
   Add,
   Delete,
   Map,
   Warning,
   ExpandMore,
   ExpandLess,
   TableChart,
   InsertChart,
   CopyAllRounded,
   PictureAsPdf,
   Image,
   Info
} from "@mui/icons-material";
import ReactECharts from "echarts-for-react";
import { utils, writeFile } from "xlsx";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useGlobalContext } from "../../../../context/GlobalContext.jsx";
import { ChartConfig, DataField, FilterCondition, FilterOperator } from "../../../../types/reporter.js";

// ==================== Diccionario de campos ====================
const fieldMapping: Record<string, { displayName: string; type: "string" | "number" | "date" | "boolean"; show: boolean }> = {
   destination: { displayName: "Estatus", type: "string", show: true },
   executed_at: { displayName: "Fecha de ejecución", type: "date", show: true },
   iccid: { displayName: "ICCID", type: "string", show: true },
   imei: { displayName: "IMEI", type: "string", show: true },
   fecha: { displayName: "Fecha de pre-activación", type: "date", show: true },
   celular: { displayName: "Celular", type: "string", show: true },
   folio: { displayName: "Folio", type: "string", show: true },
   num_orden: { displayName: "Num. orden", type: "string", show: true },
   tipo_sim: { displayName: "Tipo de SIM", type: "string", show: true },
   modelo: { displayName: "Modelo", type: "string", show: true },
   marca: { displayName: "Marca", type: "string", show: true },
   color: { displayName: "Color", type: "string", show: true },
   activation_status: { displayName: "Estado de activación", type: "string", show: true },
   product_type: { displayName: "Tipo de producto", type: "string", show: true },
   import_name: { displayName: "Archivo de importación", type: "string", show: true },
   uploader_full_name: { displayName: "Registrado por", type: "string", show: true },
   lote: { displayName: "Lote", type: "string", show: true },
   lada: { displayName: "Lada", type: "string", show: true },
   full_name: { displayName: "Vendedor", type: "string", show: true },
   visit_type: { displayName: "Tipo de visita", type: "string", show: true },
   pos_name: { displayName: "Punto de venta", type: "string", show: true },
   lat: { displayName: "Latitud", type: "number", show: true },
   lon: { displayName: "Longitud", type: "number", show: true }
};

const fields: DataField[] = Object.entries(fieldMapping)
   .filter(([, config]) => config.show)
   .map(([name, config]) => ({
      id: name,
      name,
      type: config.type,
      displayName: config.displayName
   }));

// ==================== Datos de ejemplo (simulación) ====================
const generateSampleData = (count = 200) => {
   const statuses = ["Virgen", "Pre-activado", "Activado", "Portado", "Caducado"];
   const types = ["SIM Estándar", "Micro SIM", "Nano SIM", "eSIM"];
   const brands = ["Samsung", "Apple", "Xiaomi", "Huawei", "Motorola"];
   const models = ["Galaxy S23", "iPhone 15", "Redmi Note 12", "P30", "Moto G"];
   const colors = ["Negro", "Blanco", "Azul", "Rojo", "Gris"];
   const sellers = ["Juan Pérez", "María López", "Carlos Ruiz", "Ana García"];
   const points = ["Tienda Centro", "Plaza Norte", "Sucursal Sur", "Kiosco Oriente"];
   const visits = ["Distribución", "Monitoreo"];

   return Array.from({ length: count }, (_, i) => ({
      destination: i % 3 === 0 ? "Stock" : i % 3 === 1 ? "Asignado" : "Distribuido",
      executed_at: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
      iccid: `8931040610123456789${i.toString().padStart(2, "0")}`,
      imei: `${Math.floor(Math.random() * 100000000000000)}`,
      fecha: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
      celular: `+521${Math.floor(Math.random() * 10000000000)}`,
      folio: `FOL-${i}`,
      num_orden: `ORD-${i}`,
      tipo_sim: types[i % types.length],
      modelo: models[i % models.length],
      marca: brands[i % brands.length],
      color: colors[i % colors.length],
      activation_status: statuses[i % statuses.length],
      product_type: types[i % types.length],
      import_name: `import_${Math.floor(i / 50)}.xlsx`,
      uploader_full_name: sellers[i % sellers.length],
      lote: `LOTE-${Math.floor(i / 20)}`,
      lada: `55`,
      full_name: sellers[i % sellers.length],
      visit_type: visits[i % visits.length],
      pos_name: points[i % points.length],
      lat: 19.4 + (Math.random() - 0.5) * 10,
      lon: -99.1 + (Math.random() - 0.5) * 10
   }));
};

// ==================== Tipos ====================
export type ChartType = "bar" | "line" | "pie" | "doughnut" | "scatter" | "area" | "radar" | "map";
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

export type VisualizationType = "chart" | "table";

export interface Panel {
   id: string;
   type: VisualizationType;
   title: string;
   chartType: ChartType;
   xAxis: string;
   yAxis: string;
   showLegend: boolean;
   showGrid: boolean;
   stacked: boolean;
   colorScheme: string;
   visibleColumns?: string[];
}

// ==================== Componente FilterSection mejorado ====================
interface FilterSectionProps {
   fields: DataField[];
   filters: FilterCondition[];
   onFiltersChange: (filters: FilterCondition[]) => void;
   dateRange: { startDate: string; endDate: string };
   onDateRangeChange: (dateRange: { startDate: string; endDate: string }) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ fields, filters, onFiltersChange, dateRange, onDateRangeChange }) => {
   const [localFilters, setLocalFilters] = useState(filters);
   const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

   // Sincronizar con props cuando cambien desde fuera (ej. al limpiar)
   useEffect(() => {
      setLocalFilters(filters);
   }, [filters]);

   const addFilter = () => {
      const newFilter: FilterCondition = {
         id: `filter-${Date.now()}`,
         field: fields[0]?.id || "",
         operator: "equals",
         value: ""
      };
      const newFilters = [...localFilters, newFilter];
      setLocalFilters(newFilters);
      notifyChange(newFilters);
   };

   const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
      const updated = localFilters.map((f) => (f.id === id ? { ...f, ...updates } : f));
      setLocalFilters(updated);
      notifyChange(updated);
   };

   const removeFilter = (id: string) => {
      const updated = localFilters.filter((f) => f.id !== id);
      setLocalFilters(updated);
      notifyChange(updated);
   };

   const notifyChange = (newFilters: FilterCondition[]) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
         onFiltersChange(newFilters);
      }, 300);
      setDebounceTimer(timer);
   };

   const handleDateChange = (field: "startDate" | "endDate", value: string) => {
      const newRange = { ...dateRange, [field]: value };
      onDateRangeChange(newRange);
   };

   const getFieldType = (fieldId: string) => fields.find((f) => f.id === fieldId)?.type || "string";

   const getOperatorsForField = (fieldType: string) => operatorOptions.filter((op) => op.types.includes(fieldType));

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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
         <Paper className="p-4 rounded-xl shadow-sm border">
            <Box className="flex items-center justify-between mb-4">
               <Typography variant="h6" className="font-semibold text-gray-800">
                  Filtros Globales
               </Typography>
               <Button startIcon={<Add />} onClick={addFilter} variant="outlined" size="small">
                  Agregar
               </Button>
            </Box>

            {/* Rango de fechas */}
            <Box className="grid grid-cols-2 gap-3 mb-4">
               <TextField
                  label="Fecha inicio"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateChange("startDate", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
               />
               <TextField
                  label="Fecha fin"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
               />
            </Box>

            <AnimatePresence>
               {localFilters.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-4 text-gray-500">
                     <FilterList className="text-3xl mb-2 text-gray-300 mx-auto" />
                     <Typography variant="body2">No hay filtros aplicados</Typography>
                     <Typography variant="caption">Agrega filtros para refinar tus datos</Typography>
                  </motion.div>
               ) : (
                  <Box className="space-y-3">
                     {localFilters.map((filter, index) => (
                        <motion.div
                           key={filter.id}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           transition={{ duration: 0.2, delay: index * 0.1 }}
                        >
                           <Paper className="p-1 border border-gray-200 rounded-lg">
                              <Box className="flex items-start gap-3">
                                 <Chip label={`Filtro ${index + 1}`} size="small" color="primary" variant="outlined" />
                                 <Box className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                                    {/* Campo */}
                                    <FormControl size="small" className="md:col-span-3">
                                       <InputLabel>Campo</InputLabel>
                                       <Select value={filter.field} label="Campo" onChange={(e) => updateFilter(filter.id, { field: e.target.value })}>
                                          {fields.map((field) => (
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
                                       <IconButton size="small" color="error" onClick={() => removeFilter(filter.id)}>
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

            {localFilters.length > 0 && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.5 }}>
                  <Divider className="my-3" />
                  <Box className="flex items-center justify-between">
                     <Typography variant="body2" className="text-gray-600">
                        {localFilters.length} filtro{localFilters.length !== 1 ? "s" : ""} aplicado{localFilters.length !== 1 ? "s" : ""}
                     </Typography>
                     <Button onClick={() => notifyChange([])} color="error" size="small">
                        Limpiar todos
                     </Button>
                  </Box>
               </motion.div>
            )}
         </Paper>
      </motion.div>
   );
};

// ==================== Componente principal ====================
const PowerBIReportBuilder: React.FC = () => {
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
   const [drawerOpen, setDrawerOpen] = useState(!isMobile);
   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
   const { setIsLoading } = useGlobalContext();

   // Datos
   const [rawData, setRawData] = useState<any[]>([]);
   const [filteredData, setFilteredData] = useState<any[]>([]);
   const [globalFilters, setGlobalFilters] = useState<FilterCondition[]>([]);
   const [dateRange, setDateRange] = useState({ startDate: "2024-01-01", endDate: "2024-12-31" });

   // Estado de paneles
   const [panels, setPanels] = useState<Panel[]>([
      {
         id: "panel-1",
         type: "chart",
         title: "Distribución por Estatus",
         chartType: "pie",
         xAxis: "destination",
         yAxis: "iccid",
         showLegend: true,
         showGrid: true,
         stacked: false,
         colorScheme: "default"
      },
      {
         id: "panel-2",
         type: "chart",
         title: "Actividad por Mes",
         chartType: "line",
         xAxis: "executed_at",
         yAxis: "iccid",
         showLegend: true,
         showGrid: true,
         stacked: false,
         colorScheme: "default"
      }
   ]);
   const [selectedPanelId, setSelectedPanelId] = useState<string>(panels[0]?.id);
   const [activeTab, setActiveTab] = useState(0);
   const [expandedPanels, setExpandedPanels] = useState<Set<string>>(new Set());

   const chartRefs = useRef<{ [key: string]: any }>({});
   const exportRefs = useRef<{ [key: string]: HTMLDivElement }>({});

   // Cargar datos (simulación)
   useEffect(() => {
      setIsLoading(true);
      setTimeout(() => {
         const data = generateSampleData(500);
         setRawData(data);
         setIsLoading(false);
      }, 500);
   }, []);

   // Aplicar filtros globales y rango de fechas
   useEffect(() => {
      if (!rawData.length) return;

      let filtered = [...rawData];

      // Filtro de rango de fechas (executed_at)
      if (dateRange.startDate && dateRange.endDate) {
         filtered = filtered.filter((item) => {
            const itemDate = new Date(item.executed_at);
            const start = new Date(dateRange.startDate);
            const end = new Date(dateRange.endDate);
            return itemDate >= start && itemDate <= end;
         });
      }

      // Aplicar filtros avanzados
      globalFilters.forEach((filter) => {
         const field = fields.find((f) => f.id === filter.field);
         if (!field) return;

         filtered = filtered.filter((item) => {
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
               case "in": {
                  const values = String(filter.value)
                     .split(",")
                     .map((v) => v.trim());
                  return values.includes(String(value));
               }
               case "not_in": {
                  const values = String(filter.value)
                     .split(",")
                     .map((v) => v.trim());
                  return !values.includes(String(value));
               }
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

      setFilteredData(filtered);
   }, [rawData, globalFilters, dateRange]);

   // Funciones de paneles
   const addPanel = () => {
      const newPanel: Panel = {
         id: `panel-${Date.now()}`,
         type: "chart",
         title: "Nuevo Panel",
         chartType: "bar",
         xAxis: fields[0]?.id || "",
         yAxis: fields[1]?.id || "",
         showLegend: true,
         showGrid: true,
         stacked: false,
         colorScheme: "default"
      };
      setPanels((prev) => [...prev, newPanel]);
      setSelectedPanelId(newPanel.id);
      showSnackbar("Panel agregado", "success");
   };

   const removePanel = (id: string) => {
      setPanels((prev) => prev.filter((p) => p.id !== id));
      if (selectedPanelId === id && panels.length > 1) {
         setSelectedPanelId(panels[0].id);
      }
      showSnackbar("Panel eliminado", "success");
   };

   const duplicatePanel = (panel: Panel) => {
      const newPanel = {
         ...panel,
         id: `panel-${Date.now()}`,
         title: `${panel.title} (copia)`
      };
      setPanels((prev) => [...prev, newPanel]);
      setSelectedPanelId(newPanel.id);
      showSnackbar("Panel duplicado", "success");
   };

   const updatePanel = (id: string, updates: Partial<Panel>) => {
      setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
   };

   const getCurrentPanel = () => panels.find((p) => p.id === selectedPanelId);

   const toggleExpand = (panelId: string) => {
      setExpandedPanels((prev) => {
         const newSet = new Set(prev);
         if (newSet.has(panelId)) {
            newSet.delete(panelId);
         } else {
            newSet.add(panelId);
         }
         return newSet;
      });
   };

   const getPanelSize = (panel: Panel) => {
      if (expandedPanels.has(panel.id)) return 12;
      const count = panels.length;
      if (count === 1) return 12;
      if (count === 2) return 6;
      return 4;
   };

   const showSnackbar = (message: string, severity: "success" | "error") => {
      setSnackbar({ open: true, message, severity });
   };

   // Generar opciones de gráfico para un panel
   const getChartOptionsForPanel = (panel: Panel) => {
      const xField = fields.find((f) => f.id === panel.xAxis);
      const yField = fields.find((f) => f.id === panel.yAxis);
      if (!xField || !yField) return { title: { text: "Configura los ejes" } };

      const categories = [...new Set(filteredData.map((item) => item[xField.name]))];
      const seriesData = categories.map((cat) => {
         const items = filteredData.filter((item) => item[xField.name] === cat);
         if (yField.type === "number") {
            return items.reduce((sum, item) => sum + (item[yField.name] || 0), 0);
         } else {
            return items.length;
         }
      });

      const baseOptions: any = {
         title: { text: panel.title, left: "center", textStyle: { fontSize: 16, fontWeight: "bold" } },
         tooltip: { trigger: "item" },
         legend: panel.showLegend ? { show: true, orient: "horizontal", bottom: 0 } : { show: false },
         grid: panel.showGrid ? { left: "3%", right: "4%", bottom: panel.showLegend ? "15%" : "3%", containLabel: true } : { show: false }
      };

      if (panel.chartType === "map") {
         return {
            title: { text: panel.title, left: "center" },
            tooltip: { trigger: "item" },
            visualMap: {
               min: 0,
               max: Math.max(...filteredData.map((d) => d[yField.name])),
               calculable: true,
               inRange: { color: ["#4575b4", "#74add1", "#abd9e9", "#e0f3f8", "#ffffbf", "#fee090", "#fdae61", "#f46d43", "#d73027"] }
            },
            series: [
               {
                  name: yField.displayName,
                  type: "map",
                  map: "world",
                  data: filteredData.map((item) => ({ name: item[xField.name], value: item[yField.name] }))
               }
            ]
         };
      }

      switch (panel.chartType) {
         case "bar":
            baseOptions.xAxis = { type: "category", data: categories, axisLabel: { rotate: 45 } };
            baseOptions.yAxis = { type: "value" };
            baseOptions.series = [{ name: yField.displayName, type: "bar", data: seriesData }];
            break;
         case "line":
            baseOptions.xAxis = { type: "category", data: categories };
            baseOptions.yAxis = { type: "value" };
            baseOptions.series = [{ name: yField.displayName, type: "line", data: seriesData }];
            break;
         case "pie":
            baseOptions.series = [
               {
                  type: "pie",
                  radius: "50%",
                  data: categories.map((cat, i) => ({ name: cat, value: seriesData[i] }))
               }
            ];
            break;
         case "doughnut":
            baseOptions.series = [
               {
                  type: "pie",
                  radius: ["40%", "70%"],
                  data: categories.map((cat, i) => ({ name: cat, value: seriesData[i] }))
               }
            ];
            break;
         case "area":
            baseOptions.xAxis = { type: "category", data: categories, boundaryGap: false };
            baseOptions.yAxis = { type: "value" };
            baseOptions.series = [{ type: "line", data: seriesData, areaStyle: {} }];
            break;
         case "scatter":
            baseOptions.xAxis = { type: "value", name: xField.displayName };
            baseOptions.yAxis = { type: "value", name: yField.displayName };
            baseOptions.series = [
               {
                  type: "scatter",
                  data: filteredData.map((item) => [item[xField.name], item[yField.name]])
               }
            ];
            break;
         case "radar":
            baseOptions.radar = { indicator: categories.map((c) => ({ name: c, max: Math.max(...seriesData) })) };
            baseOptions.series = [
               {
                  type: "radar",
                  data: [{ value: seriesData, name: yField.displayName }]
               }
            ];
            break;
         default:
            baseOptions.graphic = { elements: [{ type: "text", style: { text: "Tipo no soportado" } }] };
      }
      return baseOptions;
   };

   // Renderizar panel
   const renderPanel = (panel: Panel) => {
      if (panel.type === "table") {
         const columns = panel.visibleColumns?.length ? panel.visibleColumns : fields.map((f) => f.id);
         const visibleFields = fields.filter((f) => columns.includes(f.id));
         return (
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
               <Table size="small" stickyHeader>
                  <TableHead>
                     <TableRow>
                        {visibleFields.map((field) => (
                           <TableCell key={field.id}>{field.displayName}</TableCell>
                        ))}
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {filteredData.slice(0, 100).map((row, idx) => (
                        <TableRow key={idx}>
                           {visibleFields.map((field) => (
                              <TableCell key={field.id}>
                                 {field.type === "date" && row[field.name] ? new Date(row[field.name]).toLocaleDateString() : row[field.name]}
                              </TableCell>
                           ))}
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
               {filteredData.length > 100 && (
                  <Typography variant="caption" sx={{ p: 1, display: "block", textAlign: "center" }}>
                     Mostrando 100 de {filteredData.length} registros
                  </Typography>
               )}
            </TableContainer>
         );
      } else {
         const options = getChartOptionsForPanel(panel);
         return (
            <ReactECharts
               ref={(el) => {
                  if (el) chartRefs.current[panel.id] = el;
               }}
               option={options}
               style={{ height: "400px", width: "100%" }}
               opts={{ renderer: "svg" }}
            />
         );
      }
   };

   // Exportar panel como imagen
   const exportPanelAsImage = async (panelId: string) => {
      const element = exportRefs.current[panelId];
      if (!element) return;
      try {
         const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
         const link = document.createElement("a");
         link.download = `panel_${panelId}.png`;
         link.href = canvas.toDataURL();
         link.click();
         showSnackbar("Panel exportado como imagen", "success");
      } catch (error) {
         console.error(error);
         showSnackbar("Error al exportar imagen", "error");
      }
   };

   // Exportar panel como PDF
   const exportPanelAsPDF = async (panelId: string) => {
      const element = exportRefs.current[panelId];
      if (!element) return;
      try {
         const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
         const imgData = canvas.toDataURL("image/png");
         const pdf = new jsPDF("p", "mm", "a4");
         const imgWidth = 190;
         const pageHeight = 297;
         const imgHeight = (canvas.height * imgWidth) / canvas.width;
         let heightLeft = imgHeight;
         let position = 0;
         pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
         heightLeft -= pageHeight;
         while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
         }
         pdf.save(`panel_${panelId}.pdf`);
         showSnackbar("Panel exportado como PDF", "success");
      } catch (error) {
         console.error(error);
         showSnackbar("Error al exportar PDF", "error");
      }
   };

   // Exportar datos a Excel
   const exportToExcel = () => {
      const worksheet = utils.json_to_sheet(filteredData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Datos Filtrados");
      writeFile(workbook, `reporte_${Date.now()}.xlsx`);
      showSnackbar("Datos exportados a Excel", "success");
   };

   // Resumen de filtros para mostrar en panel
   const getActiveFiltersSummary = () => {
      if (globalFilters.length === 0 && dateRange.startDate === "2024-01-01" && dateRange.endDate === "2024-12-31") {
         return "Sin filtros aplicados";
      }
      const parts = [];
      if (dateRange.startDate !== "2024-01-01" || dateRange.endDate !== "2024-12-31") {
         parts.push(`Fecha: ${dateRange.startDate} - ${dateRange.endDate}`);
      }
      globalFilters.forEach((f) => {
         const field = fields.find((ff) => ff.id === f.field);
         const operatorLabel = operatorOptions.find((op) => op.value === f.operator)?.label || f.operator;
         let valueText = f.value;
         if (f.operator === "between" || f.operator === "not_between") {
            valueText = `${f.value} y ${f.value2}`;
         } else if (f.operator === "in" || f.operator === "not_in") {
            valueText = f.value;
         }
         parts.push(`${field?.displayName} ${operatorLabel} ${valueText}`);
      });
      return parts.join(" | ");
   };

   return (
      <Box className="max-h-5/6 bg-gray-50">
         {/* Header */}
         <Paper className="rounded-none shadow-sm border-b" sx={{ position: "sticky", top: 0, zIndex: 1100 }}>
            <Box className="p-4 flex items-center justify-between">
               <Box className="flex items-center gap-4">
                  <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
                     <Menu />
                  </IconButton>
                  <Typography variant="h5" fontWeight="bold">
                     📊 Reporteador
                  </Typography>
               </Box>
               <Box>
                  <Button variant="outlined" startIcon={<Download />} onClick={exportToExcel} sx={{ mr: 1 }}>
                     Exportar Excel
                  </Button>
                  {/* <Button variant="contained" startIcon={<Save />}>
                     Guardar Reporte
                  </Button> */}
               </Box>
            </Box>
         </Paper>

         <Box className="flex h-[calc(88vh-70px)]">
            {/* Drawer de configuración */}
            <Drawer
               variant={isMobile ? "temporary" : "persistent"}
               open={drawerOpen}
               onClose={() => setDrawerOpen(false)}
               sx={{
                  width: 400,
                  flexShrink: 0,
                  "& .MuiDrawer-paper": { width: 400, boxSizing: "border-box", position: "static" }
               }}
            >
               <Box className="h-full flex flex-col">
                  <Box className="p-4 border-b">
                     <Typography variant="h6">Configuración</Typography>
                  </Box>
                  <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                     <Tab label="Paneles" />
                     <Tab label="Filtros globales" />
                  </Tabs>
                  <Box className="flex-1 overflow-auto p-4">
                     {activeTab === 0 && (
                        <>
                           <Box className="flex justify-between mb-4">
                              <Typography variant="subtitle1">Paneles</Typography>
                              <Button startIcon={<Add />} onClick={addPanel} size="small">
                                 Agregar
                              </Button>
                           </Box>
                           <List dense>
                              {panels.map((panel) => (
                                 <ListItem
                                    key={panel.id}
                                    component="button"
                                    onClick={() => setSelectedPanelId(panel.id)}
                                    secondaryAction={
                                       <>
                                          <Tooltip title="Copiar Panel">
                                             <IconButton edge="end" size="small" color="primary" onClick={() => duplicatePanel(panel)}>
                                                <CopyAllRounded fontSize="small" />
                                             </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Eliminar Panel">
                                             <IconButton edge="end" size="small" color="error" onClick={() => removePanel(panel.id)}>
                                                <Delete fontSize="small" />
                                             </IconButton>
                                          </Tooltip>
                                       </>
                                    }
                                    sx={{
                                       cursor: "pointer",
                                       borderRadius: 0.5,
                                       mb: 1,
                                       backgroundColor: selectedPanelId === panel.id ? "action.selected" : "transparent"
                                    }}
                                    className={`hover:scale-102 hover:bg-blue-50 transition-all duration-600`}
                                 >
                                    <ListItemIcon>{panel.type === "chart" ? <InsertChart /> : <TableChart />}</ListItemIcon>
                                    <ListItemText primary={panel.title} secondary={panel.type === "chart" ? panel.chartType : "Tabla"} />
                                 </ListItem>
                              ))}
                           </List>

                           {getCurrentPanel() && (
                              <Box className="mt-6" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                 <Divider />
                                 <Typography variant="subtitle1">Configurar panel: {getCurrentPanel()?.title}</Typography>
                                 <TextField
                                    label="Título"
                                    fullWidth
                                    size="small"
                                    value={getCurrentPanel()?.title || ""}
                                    onChange={(e) => updatePanel(selectedPanelId, { title: e.target.value })}
                                 />
                                 <FormControl fullWidth size="small">
                                    <InputLabel>Tipo de visualización</InputLabel>
                                    <Select
                                       value={getCurrentPanel()?.type || "chart"}
                                       onChange={(e) => updatePanel(selectedPanelId, { type: e.target.value as VisualizationType })}
                                    >
                                       <MenuItem value="chart">Gráfico</MenuItem>
                                       <MenuItem value="table">Tabla</MenuItem>
                                    </Select>
                                 </FormControl>

                                 {getCurrentPanel()?.type === "chart" && (
                                    <>
                                       <FormControl fullWidth size="small">
                                          <InputLabel>Tipo de gráfico</InputLabel>
                                          <Select
                                             value={getCurrentPanel()?.chartType || "bar"}
                                             onChange={(e) => updatePanel(selectedPanelId, { chartType: e.target.value as ChartType })}
                                          >
                                             {chartTypes.map((ct) => (
                                                <MenuItem key={ct.type} value={ct.type}>
                                                   {ct.label}
                                                </MenuItem>
                                             ))}
                                          </Select>
                                       </FormControl>

                                       <FormControl fullWidth size="small">
                                          <InputLabel>Eje X</InputLabel>
                                          <Select value={getCurrentPanel()?.xAxis || ""} onChange={(e) => updatePanel(selectedPanelId, { xAxis: e.target.value })}>
                                             {fields.map((f) => (
                                                <MenuItem key={f.id} value={f.id}>
                                                   {f.displayName}
                                                </MenuItem>
                                             ))}
                                          </Select>
                                       </FormControl>

                                       <FormControl fullWidth size="small">
                                          <InputLabel>Eje Y</InputLabel>
                                          <Select value={getCurrentPanel()?.yAxis || ""} onChange={(e) => updatePanel(selectedPanelId, { yAxis: e.target.value })}>
                                             {fields.map((f) => (
                                                <MenuItem key={f.id} value={f.id}>
                                                   {f.displayName}
                                                </MenuItem>
                                             ))}
                                          </Select>
                                       </FormControl>

                                       <Box className="flex gap-3">
                                          <FormControlLabel
                                             control={
                                                <Switch
                                                   checked={getCurrentPanel()?.showLegend || false}
                                                   onChange={(e) => updatePanel(selectedPanelId, { showLegend: e.target.checked })}
                                                />
                                             }
                                             label="Leyenda"
                                          />
                                          <FormControlLabel
                                             control={
                                                <Switch
                                                   checked={getCurrentPanel()?.showGrid || false}
                                                   onChange={(e) => updatePanel(selectedPanelId, { showGrid: e.target.checked })}
                                                />
                                             }
                                             label="Cuadrícula"
                                          />
                                          {(getCurrentPanel()?.chartType === "bar" || getCurrentPanel()?.chartType === "area") && (
                                             <FormControlLabel
                                                control={
                                                   <Switch
                                                      checked={getCurrentPanel()?.stacked || false}
                                                      onChange={(e) => updatePanel(selectedPanelId, { stacked: e.target.checked })}
                                                   />
                                                }
                                                label="Apilado"
                                             />
                                          )}
                                       </Box>
                                    </>
                                 )}

                                 {getCurrentPanel()?.type === "table" && (
                                    <FormControl fullWidth size="small">
                                       <InputLabel>Columnas visibles</InputLabel>
                                       <Select
                                          multiple
                                          value={getCurrentPanel()?.visibleColumns || fields.map((f) => f.id)}
                                          onChange={(e) => updatePanel(selectedPanelId, { visibleColumns: e.target.value as string[] })}
                                          renderValue={(selected) => (
                                             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                {(selected as string[]).map((value) => (
                                                   <Chip key={value} label={fields.find((f) => f.id === value)?.displayName} size="small" />
                                                ))}
                                             </Box>
                                          )}
                                       >
                                          {fields.map((f) => (
                                             <MenuItem key={f.id} value={f.id}>
                                                <Checkbox checked={getCurrentPanel()?.visibleColumns?.includes(f.id) || false} />
                                                <ListItemText primary={f.displayName} />
                                             </MenuItem>
                                          ))}
                                       </Select>
                                    </FormControl>
                                 )}
                              </Box>
                           )}
                        </>
                     )}

                     {activeTab === 1 && (
                        <FilterSection
                           fields={fields}
                           filters={globalFilters}
                           onFiltersChange={setGlobalFilters}
                           dateRange={dateRange}
                           onDateRangeChange={setDateRange}
                        />
                     )}
                  </Box>
               </Box>
            </Drawer>

            {/* Área principal con paneles */}
            <Box className="flex-1 p-4 overflow-auto">
               <AnimatePresence mode="wait">
                  <motion.div
                     key={expandedPanels.size} // para refrescar layout
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     transition={{ duration: 0.3 }}
                  >
                     <Grid container spacing={2}>
                        {panels.map((panel) => (
                           <Grid size={{ xs: 12, md: getPanelSize(panel) }} key={panel.id}>
                              <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                                 <div
                                    ref={(el) => {
                                       if (el) exportRefs.current[panel.id] = el;
                                    }}
                                 >
                                    <Card variant="outlined" className="h-full flex flex-col">
                                       <CardHeader
                                          avatar={<Avatar>{panel.type === "chart" ? <InsertChart /> : <TableChart />}</Avatar>}
                                          title={panel.title}
                                          subheader={
                                             <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                                <span>{panel.type === "chart" ? `Gráfico: ${panel.chartType}` : "Tabla de datos"}</span>
                                                <Tooltip title={getActiveFiltersSummary()}>
                                                   <Chip size="small" icon={<FilterList />} label={`${globalFilters.length} filtros`} variant="outlined" />
                                                </Tooltip>
                                                <br />
                                                <small>
                                                   <b>Filtros aplicados: </b>
                                                   {getActiveFiltersSummary()}
                                                </small>
                                             </Box>
                                          }
                                          action={
                                             <>
                                                <Tooltip title="Exportar como Imagen">
                                                   <IconButton size="small" onClick={() => exportPanelAsImage(panel.id)}>
                                                      <Image />
                                                   </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Exportar como PDF">
                                                   <IconButton size="small" onClick={() => exportPanelAsPDF(panel.id)}>
                                                      <PictureAsPdf />
                                                   </IconButton>
                                                </Tooltip>
                                                <Tooltip title={expandedPanels.has(panel.id) ? "Reducir Panel" : "Expandir Panel"}>
                                                   <IconButton size="small" onClick={() => toggleExpand(panel.id)}>
                                                      {expandedPanels.has(panel.id) ? <FullscreenExit /> : <Fullscreen />}
                                                   </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar Panel">
                                                   <IconButton size="small" color="error" onClick={() => removePanel(panel.id)}>
                                                      <Delete fontSize="small" />
                                                   </IconButton>
                                                </Tooltip>
                                             </>
                                          }
                                       />
                                       <CardContent className="flex-1">{renderPanel(panel)}</CardContent>
                                    </Card>
                                 </div>
                              </motion.div>
                           </Grid>
                        ))}
                     </Grid>
                  </motion.div>
               </AnimatePresence>
               {panels.length === 0 && (
                  <Box className="text-center mt-20">
                     <Typography variant="h6" color="textSecondary">
                        No hay paneles. Haz clic en "Agregar" para comenzar.
                     </Typography>
                     <Button startIcon={<Add />} onClick={addPanel} variant="contained" className="mt-4">
                        Agregar panel
                     </Button>
                  </Box>
               )}
            </Box>
         </Box>

         <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
         >
            <Alert severity={snackbar.severity} variant="filled">
               {snackbar.message}
            </Alert>
         </Snackbar>
      </Box>
   );
};

export default PowerBIReportBuilder;
