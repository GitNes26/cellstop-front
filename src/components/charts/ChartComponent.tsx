// src/components/charts/ChartComponent.tsx
import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import {
   Box,
   Paper,
   Typography,
   CircularProgress,
   IconButton,
   Menu,
   MenuItem,
   Tooltip,
   Chip,
   Stack,
   Button,
   Card,
   CardHeader,
   CardContent,
   CardActions,
   Divider,
   Alert
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { saveAs } from "file-saver";

// Tipos para el componente
export type ChartType =
   | "line"
   | "bar"
   | "pie"
   | "donut"
   | "scatter"
   | "area"
   | "radar"
   | "heatmap"
   | "gauge"
   | "treemap"
   | "sunburst"
   | "funnel"
   | "boxplot"
   | "candlestick"
   | "map";

export type ChartTheme =
   | "light"
   | "dark"
   | "vintage"
   | "westeros"
   | "essos"
   | "wonderland"
   | "walden"
   | "chalk"
   | "infographic"
   | "macarons"
   | "roma"
   | "shine"
   | "purple-passion";

export interface ChartDataItem {
   name?: string;
   value?: any;
   [key: string]: any;
}

export interface ChartSeries {
   name?: string;
   type?: ChartType;
   data: ChartDataItem[] | number[] | [number, number][];
   [key: string]: any;
}

export interface ChartAxis {
   type?: "category" | "value" | "time" | "log";
   name?: string;
   data?: string[] | number[];
   [key: string]: any;
}

export interface ChartComponentProps {
   // Configuración básica
   title?: string;
   subtitle?: string;
   type?: ChartType;
   data?: ChartDataItem[] | number[] | Record<string, any>;
   series?: ChartSeries[];
   xAxis?: ChartAxis | ChartAxis[];
   yAxis?: ChartAxis | ChartAxis[];

   // Dimensiones
   height?: number | string;
   width?: number | string;

   // Estado y comportamiento
   loading?: boolean;
   error?: string | null;
   emptyMessage?: string;

   // Configuración visual
   theme?: ChartTheme;
   colors?: string[];
   backgroundColor?: string;
   grid?: any;
   tooltip?: any;
   legend?: any;

   // Interactividad
   onClick?: (params: any) => void;
   onDataZoom?: (params: any) => void;
   onLegendSelectChanged?: (params: any) => void;

   // Customización avanzada
   options?: any; // Opciones ECharts personalizadas
   customRender?: (data: any) => React.ReactNode;

   // Características del componente
   showTitle?: boolean;
   showToolbar?: boolean;
   showLegend?: boolean;
   showGrid?: boolean;
   showExport?: boolean;
   showFullscreen?: boolean;
   showRefresh?: boolean;
   showLoading?: boolean;
   showTooltip?: boolean;
   responsive?: boolean;

   // Callbacks
   onRefresh?: () => void;
   onExport?: (format: "png" | "jpg" | "svg" | "json") => void;

   // Clases y estilos
   className?: string;
   style?: React.CSSProperties;
   paperProps?: any;
   cardProps?: any;

   // Configuración específica por tipo de gráfico
   pieRadius?: [string | number, string | number]; // [inner, outer]
   barWidth?: string | number;
   smooth?: boolean;
   areaStyle?: any;
   stack?: string;
   symbolSize?: number;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
   // Configuración básica
   title = "",
   subtitle = "",
   type = "bar",
   data = [],
   series = [],
   xAxis = { type: "category" },
   yAxis = { type: "value" },

   // Dimensiones
   height = 400,
   width = "100%",

   // Estado y comportamiento
   loading = false,
   error = null,
   emptyMessage = "No hay datos disponibles",

   // Configuración visual
   theme = "light",
   colors = ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc", "#60c0dd"],
   backgroundColor = "transparent",
   grid = { left: "3%", right: "4%", bottom: "3%", top: title ? 60 : 40, containLabel: true },
   tooltip = { trigger: "axis" },
   legend = { show: true, type: "scroll" },

   // Interactividad
   onClick,
   onDataZoom,
   onLegendSelectChanged,

   // Customización avanzada
   options = {},
   customRender,

   // Características del componente
   showTitle = true,
   showToolbar = true,
   showLegend = true,
   showGrid = true,
   showExport = true,
   showFullscreen = true,
   showRefresh = true,
   showLoading = true,
   showTooltip = true,
   responsive = true,

   // Callbacks
   onRefresh,
   onExport,

   // Clases y estilos
   className = "",
   style = {},
   paperProps = {},
   cardProps = {},

   // Configuración específica por tipo
   pieRadius = ["0%", "75%"],
   barWidth = "60%",
   smooth = false,
   areaStyle = {},
   stack,
   symbolSize = 4
}) => {
   const chartRef = useRef<any>(null);
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const [isFullscreen, setIsFullscreen] = useState(false);
   const [zoomLevel, setZoomLevel] = useState(1);
   const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

   // Configuraciones por defecto según el tipo de gráfico
   const getDefaultSeriesConfig = (): Partial<ChartSeries> => {
      const baseConfig: Partial<ChartSeries> = {
         animation: true,
         animationDuration: 500,
         animationEasing: "cubicOut"
      };

      switch (type) {
         case "line":
            return {
               ...baseConfig,
               smooth,
               symbol: "circle",
               symbolSize,
               lineStyle: { width: 3 },
               itemStyle: { borderWidth: 2 }
            };

         case "bar":
            return {
               ...baseConfig,
               barWidth,
               barGap: "10%",
               barCategoryGap: "20%",
               itemStyle: { borderRadius: [2, 2, 0, 0] }
            };

         case "pie":
         case "donut":
            return {
               ...baseConfig,
               radius: type === "donut" ? pieRadius : "75%",
               label: {
                  show: true,
                  formatter: "{b}: {c} ({d}%)"
               },
               emphasis: {
                  itemStyle: {
                     shadowBlur: 10,
                     shadowOffsetX: 0,
                     shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
               }
            };

         case "area":
            return {
               ...baseConfig,
               smooth,
               areaStyle,
               stack,
               symbol: "circle",
               symbolSize
            };

         case "scatter":
            return {
               ...baseConfig,
               symbolSize,
               itemStyle: {
                  borderWidth: 1,
                  borderColor: "#fff"
               }
            };

         default:
            return baseConfig;
      }
   };

   // Preparar los datos según el formato recibido
   const prepareSeries = (): ChartSeries[] => {
      // Si se pasó data directamente (formato simple)
      if (Array.isArray(data) && data.length > 0 && (typeof data[0] === "number" || !data[0].name)) {
         return [
            {
               type: type as any,
               data: data as number[],
               ...getDefaultSeriesConfig(),
               ...(series[0] || {})
            }
         ];
      }

      // Si se pasó data como array de objetos
      if (Array.isArray(data) && data.length > 0 && data[0].name) {
         return [
            {
               type: type as any,
               data: data,
               ...getDefaultSeriesConfig(),
               ...(series[0] || {})
            }
         ];
      }

      // Si se pasaron series directamente
      if (series.length > 0) {
         return series.map((s) => ({
            type: type as any,
            ...getDefaultSeriesConfig(),
            ...s
         }));
      }

      return [];
   };

   // Generar opciones de ECharts
   const getChartOptions = () => {
      const preparedSeries = prepareSeries();

      const baseOptions = {
         title:
            showTitle && title
               ? {
                    text: title,
                    subtext: subtitle,
                    left: "center",
                    textStyle: {
                       fontSize: 16,
                       fontWeight: "bold"
                    },
                    subtextStyle: {
                       fontSize: 12,
                       color: "#666"
                    }
                 }
               : undefined,

         backgroundColor,

         color: colors,

         grid: showGrid ? grid : undefined,

         tooltip: showTooltip
            ? {
                 ...tooltip,
                 backgroundColor: "rgba(255, 255, 255, 0.9)",
                 borderColor: "#ddd",
                 borderWidth: 1,
                 textStyle: { color: "#333" },
                 formatter:
                    tooltip.formatter ||
                    function (params: any) {
                       if (type === "pie" || type === "donut") {
                          return `${params.name}<br/>${params.seriesName}: ${params.value} (${params.percent}%)`;
                       }
                       if (Array.isArray(params)) {
                          return params.map((p) => `${p.seriesName}: ${p.value}`).join("<br/>");
                       }
                       return `${params.seriesName}: ${params.value}`;
                    }
              }
            : undefined,

         legend: showLegend
            ? {
                 ...legend,
                 show: preparedSeries.length > 1 || legend.show,
                 type: "scroll",
                 orient: "horizontal",
                 bottom: 0
              }
            : undefined,

         xAxis: xAxis,
         yAxis: yAxis,

         series: preparedSeries,

         dataZoom: responsive
            ? [
                 {
                    type: "inside",
                    start: 0,
                    end: 100
                 },
                 {
                    show: true,
                    type: "slider",
                    bottom: 10,
                    start: 0,
                    end: 100
                 }
              ]
            : undefined,

         graphic: loading
            ? [
                 {
                    type: "text",
                    left: "center",
                    top: "center",
                    style: {
                       text: "Cargando...",
                       fontSize: 14,
                       fill: "#999"
                    }
                 }
              ]
            : undefined
      };

      // Fusionar con opciones personalizadas
      return {
         ...baseOptions,
         ...options
      };
   };

   // Eventos del gráfico
   const onChartClick = (params: any) => {
      if (onClick) onClick(params);
   };

   const onChartEvents = {
      click: onChartClick,
      datazoom: onDataZoom,
      legendselectchanged: onLegendSelectChanged
   };

   // Funciones del toolbar
   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleMenuClose = () => {
      setAnchorEl(null);
   };

   const handleExport = (format: "png" | "jpg" | "svg" | "json") => {
      if (chartInstance) {
         const dataUrl = chartInstance.getDataURL({
            type: format || "png",
            pixelRatio: 2,
            backgroundColor: "#fff"
         });

         saveAs(dataUrl, `${title || "chart"}_${new Date().getTime()}.${format}`);

         if (onExport) onExport(format);
      }
      handleMenuClose();
   };

   const handleRefresh = () => {
      if (onRefresh) onRefresh();
   };

   const handleFullscreen = () => {
      if (chartRef.current) {
         if (!isFullscreen) {
            chartRef.current.getEchartsInstance().dispatchAction({
               type: "takeGlobalCursor",
               key: "dataZoomSelect",
               dataZoomSelectActive: true
            });
         }
         setIsFullscreen(!isFullscreen);
      }
   };

   const handleZoomIn = () => {
      if (chartInstance) {
         const currentZoom = chartInstance.getOption().dataZoom?.[0]?.end || 100;
         const newZoom = Math.max(10, currentZoom - 10);
         chartInstance.dispatchAction({
            type: "dataZoom",
            start: 0,
            end: newZoom
         });
         setZoomLevel(newZoom / 100);
      }
   };

   const handleZoomOut = () => {
      if (chartInstance) {
         const currentZoom = chartInstance.getOption().dataZoom?.[0]?.end || 100;
         const newZoom = Math.min(100, currentZoom + 10);
         chartInstance.dispatchAction({
            type: "dataZoom",
            start: 0,
            end: newZoom
         });
         setZoomLevel(newZoom / 100);
      }
   };

   const handleChartReady = (echartsInstance: echarts.ECharts) => {
      setChartInstance(echartsInstance);
   };

   // Renderizar contenido según el estado
   const renderContent = () => {
      if (error) {
         return (
            <Box display="flex" alignItems="center" justifyContent="center" height={height}>
               <Alert severity="error" sx={{ maxWidth: "80%" }}>
                  {error}
               </Alert>
            </Box>
         );
      }

      if (loading && showLoading) {
         return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={height}>
               <CircularProgress />
               <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Cargando datos...
               </Typography>
            </Box>
         );
      }

      const preparedSeries = prepareSeries();
      if (preparedSeries.length === 0 || preparedSeries[0]?.data?.length === 0) {
         return (
            <Box display="flex" alignItems="center" justifyContent="center" height={height}>
               <Typography variant="body2" color="text.secondary">
                  {emptyMessage}
               </Typography>
            </Box>
         );
      }

      if (customRender) {
         return customRender(data);
      }

      return (
         <ReactECharts
            ref={chartRef}
            echarts={echarts}
            option={getChartOptions()}
            theme={theme}
            style={{ height, width }}
            onEvents={onChartEvents}
            onChartReady={handleChartReady}
            opts={{ renderer: "canvas" }}
            notMerge={true}
            lazyUpdate={true}
            showLoading={loading}
         />
      );
   };

   return (
      <Paper
         elevation={isFullscreen ? 0 : 2}
         sx={{
            position: "relative",
            width: isFullscreen ? "100vw" : "100%",
            height: isFullscreen ? "100vh" : "auto",
            p: isFullscreen ? 0 : 2,
            overflow: "hidden",
            ...paperProps?.sx
         }}
         className={`chart-container ${className} ${isFullscreen ? "fullscreen" : ""}`}
         style={style}
         {...paperProps}
      >
         {!isFullscreen && showToolbar && (
            <Box
               sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: "wrap",
                  gap: 1
               }}
            >
               {/* Título y subtítulo */}
               <Box>
                  {showTitle && title && (
                     <Typography variant="h6" component="h3" fontWeight="bold">
                        {title}
                     </Typography>
                  )}
                  {subtitle && (
                     <Typography variant="body2" color="text.secondary">
                        {subtitle}
                     </Typography>
                  )}
               </Box>

               {/* Toolbar de acciones */}
               <Stack direction="row" spacing={1}>
                  {showRefresh && (
                     <Tooltip title="Actualizar datos">
                        <IconButton size="small" onClick={handleRefresh} disabled={loading}>
                           <RefreshIcon fontSize="small" />
                        </IconButton>
                     </Tooltip>
                  )}

                  {zoomLevel !== 1 && (
                     <Chip
                        label={`Zoom: ${Math.round(zoomLevel * 100)}%`}
                        size="small"
                        onDelete={() => {
                           if (chartInstance) {
                              chartInstance.dispatchAction({
                                 type: "dataZoom",
                                 start: 0,
                                 end: 100
                              });
                              setZoomLevel(1);
                           }
                        }}
                     />
                  )}

                  <Tooltip title="Zoom in">
                     <span>
                        <IconButton size="small" onClick={handleZoomIn} disabled={loading}>
                           <ZoomInIcon fontSize="small" />
                        </IconButton>
                     </span>
                  </Tooltip>

                  <Tooltip title="Zoom out">
                     <span>
                        <IconButton size="small" onClick={handleZoomOut} disabled={loading}>
                           <ZoomOutIcon fontSize="small" />
                        </IconButton>
                     </span>
                  </Tooltip>

                  {showFullscreen && (
                     <Tooltip title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
                        <IconButton size="small" onClick={handleFullscreen}>
                           <FullscreenIcon fontSize="small" />
                        </IconButton>
                     </Tooltip>
                  )}

                  {showExport && (
                     <>
                        <Tooltip title="Opciones de exportación">
                           <IconButton size="small" onClick={handleMenuOpen}>
                              <MoreVertIcon fontSize="small" />
                           </IconButton>
                        </Tooltip>

                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                           <MenuItem onClick={() => handleExport("png")}>Exportar como PNG</MenuItem>
                           <MenuItem onClick={() => handleExport("jpg")}>Exportar como JPG</MenuItem>
                           <MenuItem onClick={() => handleExport("svg")}>Exportar como SVG</MenuItem>
                           <MenuItem onClick={() => handleExport("json")}>Exportar datos (JSON)</MenuItem>
                        </Menu>
                     </>
                  )}
               </Stack>
            </Box>
         )}

         {/* Contenido del gráfico */}
         {renderContent()}

         {/* Footer con información */}
         {!isFullscreen && prepareSeries.length > 0 && (
            <Box sx={{ mt: 2, pt: 1, borderTop: 1, borderColor: "divider" }}>
               <Typography variant="caption" color="text.secondary">
                  Total series: {prepareSeries.length} | Total puntos: {prepareSeries.reduce((acc, s) => acc + (s.data?.length || 0), 0)} | Última actualización:{" "}
                  {new Date().toLocaleTimeString()}
               </Typography>
            </Box>
         )}
      </Paper>
   );
};

export default ChartComponent;
