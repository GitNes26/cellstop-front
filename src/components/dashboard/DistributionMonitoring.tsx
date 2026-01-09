import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import "echarts-gl";
// import "echarts/map/js/world";

const DistributionMonitoring = ({ salesPoints = [] }) => {
   const mapRef = useRef(null);
   const chartRef = useRef(null);
   const [selectedZone, setSelectedZone] = useState("Zona Centro");
   const [selectedPoint, setSelectedPoint] = useState(null);
   const [activeFilter, setActiveFilter] = useState("all");

   // Datos de ejemplo si no se proporcionan
   const defaultPoints = [
      {
         id: 1,
         name: "Supermercado Central",
         lat: 40.41,
         lng: -3.7,
         type: "high",
         zone: "Zona Centro",
         postalCode: "28001",
         inventory: 92,
         sales: 38500,
         rotation: 3.8,
         orders: 2,
         lastDelivery: "2025-12-15",
         performance: [85, 88, 90, 89, 92, 91, 93]
      },
      {
         id: 2,
         name: "Tienda del Barrio",
         lat: 40.42,
         lng: -3.69,
         type: "medium",
         zone: "Zona Centro",
         postalCode: "28001",
         inventory: 78,
         sales: 22500,
         rotation: 2.5,
         orders: 5,
         lastDelivery: "2025-12-18",
         performance: [72, 74, 75, 76, 77, 78, 79]
      },
      {
         id: 3,
         name: "Minimarket Express",
         lat: 40.4,
         lng: -3.71,
         type: "low",
         zone: "Zona Centro",
         postalCode: "28001",
         inventory: 65,
         sales: 15200,
         rotation: 1.8,
         orders: 8,
         lastDelivery: "2025-12-10",
         performance: [60, 62, 63, 64, 65, 64, 65]
      },
      {
         id: 4,
         name: "Centro Distribución Norte",
         lat: 40.47,
         lng: -3.68,
         type: "center",
         zone: "Zona Norte",
         postalCode: "28003",
         inventory: 95,
         sales: 0,
         rotation: 4.2,
         orders: 0,
         lastDelivery: "2025-12-20",
         performance: [92, 93, 94, 95, 94, 95, 95]
      },
      {
         id: 5,
         name: "SuperAhorro",
         lat: 40.39,
         lng: -3.67,
         type: "high",
         zone: "Zona Sur",
         postalCode: "28005",
         inventory: 88,
         sales: 41200,
         rotation: 3.5,
         orders: 3,
         lastDelivery: "2025-12-19",
         performance: [82, 84, 86, 87, 88, 87, 88]
      },
      {
         id: 6,
         name: "Tienda 24 Horas",
         lat: 40.43,
         lng: -3.72,
         type: "medium",
         zone: "Zona Oeste",
         postalCode: "28008",
         inventory: 72,
         sales: 18900,
         rotation: 2.2,
         orders: 6,
         lastDelivery: "2025-12-17",
         performance: [68, 69, 70, 71, 72, 71, 72]
      },
      {
         id: 7,
         name: "Market Fresh",
         lat: 40.38,
         lng: -3.69,
         type: "high",
         zone: "Zona Sur",
         postalCode: "28005",
         inventory: 94,
         sales: 35600,
         rotation: 4.1,
         orders: 1,
         lastDelivery: "2025-12-20",
         performance: [90, 91, 92, 93, 94, 93, 94]
      },
      {
         id: 8,
         name: "Almacén Económico",
         lat: 40.45,
         lng: -3.73,
         type: "low",
         zone: "Zona Norte",
         postalCode: "28003",
         inventory: 58,
         sales: 12800,
         rotation: 1.5,
         orders: 9,
         lastDelivery: "2025-12-12",
         performance: [55, 56, 57, 58, 57, 58, 58]
      }
   ];

   const points = salesPoints.length > 0 ? salesPoints : defaultPoints;

   // Datos de zonas calculados
   const zonesData = React.useMemo(() => {
      const zones = {};

      points.forEach((point) => {
         if (!zones[point.zone]) {
            zones[point.zone] = {
               points: [],
               totalPoints: 0,
               totalInventory: 0,
               totalSales: 0,
               totalRotation: 0,
               totalOrders: 0,
               postalCodes: new Set()
            };
         }

         zones[point.zone].points.push(point);
         zones[point.zone].totalPoints++;
         zones[point.zone].totalInventory += point.inventory;
         zones[point.zone].totalSales += point.sales;
         zones[point.zone].totalRotation += point.rotation;
         zones[point.zone].totalOrders += point.orders;
         zones[point.zone].postalCodes.add(point.postalCode);
      });

      // Calcular promedios
      Object.keys(zones).forEach((zone) => {
         zones[zone].avgInventory = Math.round(zones[zone].totalInventory / zones[zone].totalPoints);
         zones[zone].avgSales = Math.round(zones[zone].totalSales / zones[zone].totalPoints);
         zones[zone].avgRotation = (zones[zone].totalRotation / zones[zone].totalPoints).toFixed(1);
         zones[zone].avgOrders = Math.round(zones[zone].totalOrders / zones[zone].totalPoints);
         zones[zone].postalCodes = Array.from(zones[zone].postalCodes).join(", ");

         // Determinar estado de la zona
         const performance = zones[zone].points.filter((p) => p.type === "high").length / zones[zone].totalPoints;
         zones[zone].status = performance > 0.7 ? "high" : performance > 0.4 ? "medium" : "low";
      });

      return zones;
   }, [points]);

   const currentZone = zonesData[selectedZone] || {};

   // Inicializar mapa ECharts
   useEffect(() => {
      if (!mapRef.current) return;

      const mapChart = echarts.init(mapRef.current);

      // Filtrar puntos según el filtro activo
      const filteredPoints = activeFilter === "all" ? points : points.filter((point) => point.type === activeFilter);

      const mapOption = {
         tooltip: {
            trigger: "item",
            formatter: function (params) {
               const point = points.find((p) => Math.abs(p.lat - params.value[1]) < 0.01 && Math.abs(p.lng - params.value[0]) < 0.01);

               if (!point) return "";

               let color;
               switch (point.type) {
                  case "high":
                     color = "#48bb78";
                     break;
                  case "medium":
                     color = "#f6ad55";
                     break;
                  case "low":
                     color = "#f56565";
                     break;
                  case "center":
                     color = "#667eea";
                     break;
               }

               return `
            <div class="font-bold text-lg mb-2" style="color:${color}">${point.name}</div>
            <div class="text-gray-600 mb-1"><i class="fas fa-map-marker-alt mr-2"></i>${point.zone}</div>
            <div class="text-gray-600 mb-1"><i class="fas fa-mail-bulk mr-2"></i>CP: ${point.postalCode}</div>
            <div class="text-gray-600 mb-1"><i class="fas fa-boxes mr-2"></i>Inventario: ${point.inventory}%</div>
            <div class="text-gray-600 mb-1"><i class="fas fa-euro-sign mr-2"></i>Ventas: €${point.sales.toLocaleString()}</div>
            <div class="text-gray-600"><i class="fas fa-sync-alt mr-2"></i>Rotación: ${point.rotation}</div>
          `;
            },
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderColor: "#e2e8f0",
            textStyle: { color: "#2d3748" },
            extraCssText: "box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 12px 16px;"
         },
         // geo: {
         //    // map: "world",
         //    roam: true,
         //    zoom: 1.5,
         //    center: [-3.7, 40.4],
         //    label: {
         //       emphasis: {
         //          show: false
         //       }
         //    },
         //    itemStyle: {
         //       normal: {
         //          areaColor: "#f8fafc",
         //          borderColor: "#cbd5e0",
         //          borderWidth: 1
         //       },
         //       emphasis: {
         //          areaColor: "#e2e8f0"
         //       }
         //    }
         // },
         series: [
            {
               name: "Puntos de Venta",
               type: "scatter",
               coordinateSystem: "geo",
               data: filteredPoints.map((point) => {
                  let value, symbolSize;

                  switch (point.type) {
                     case "high":
                        value = 90;
                        symbolSize = 18;
                        break;
                     case "medium":
                        value = 60;
                        symbolSize = 14;
                        break;
                     case "low":
                        value = 30;
                        symbolSize = 12;
                        break;
                     case "center":
                        value = 100;
                        symbolSize = 22;
                        break;
                  }

                  return {
                     name: point.name,
                     value: [point.lng, point.lat, value],
                     symbolSize: symbolSize,
                     itemStyle: {
                        color: point.type === "high" ? "#48bb78" : point.type === "medium" ? "#f6ad55" : point.type === "low" ? "#f56565" : "#667eea",
                        shadowBlur: 10,
                        shadowColor:
                           point.type === "high"
                              ? "rgba(72, 187, 120, 0.5)"
                              : point.type === "medium"
                              ? "rgba(246, 173, 85, 0.5)"
                              : point.type === "low"
                              ? "rgba(245, 101, 101, 0.5)"
                              : "rgba(102, 126, 234, 0.5)"
                     }
                  };
               }),
               emphasis: {
                  itemStyle: {
                     borderColor: "#fff",
                     borderWidth: 2,
                     shadowBlur: 20
                  }
               }
            }
         ]
      };

      mapChart.setOption(mapOption);

      // Evento de clic en el mapa
      mapChart.on("click", function (params) {
         if (params.componentType === "series" && params.seriesType === "scatter") {
            const pointName = params.name;
            const point = points.find((p) => p.name === pointName);

            if (point) {
               setSelectedZone(point.zone);
               setSelectedPoint(point);
            }
         }
      });

      // Ajustar tamaño al redimensionar
      const handleResize = () => mapChart.resize();
      window.addEventListener("resize", handleResize);

      return () => {
         window.removeEventListener("resize", handleResize);
         mapChart.dispose();
      };
   }, [points, activeFilter]);

   // Inicializar gráfico de desempeño
   useEffect(() => {
      if (!chartRef.current || !selectedPoint) return;

      const performanceChart = echarts.init(chartRef.current);

      const performanceOption = {
         tooltip: {
            trigger: "axis",
            formatter: function (params) {
               return `Día ${params[0].axisValue + 1}: ${params[0].value}%`;
            },
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderColor: "#e2e8f0",
            textStyle: { color: "#2d3748" },
            extraCssText: "box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border-radius: 8px;"
         },
         grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            top: "10%",
            containLabel: true
         },
         xAxis: {
            type: "category",
            boundaryGap: false,
            data: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
            axisLine: {
               lineStyle: {
                  color: "#cbd5e0"
               }
            },
            axisLabel: {
               color: "#718096"
            }
         },
         yAxis: {
            type: "value",
            min: 0,
            max: 100,
            axisLine: {
               lineStyle: {
                  color: "#cbd5e0"
               }
            },
            axisLabel: {
               color: "#718096",
               formatter: "{value}%"
            },
            splitLine: {
               lineStyle: {
                  color: "#f7fafc",
                  type: "dashed"
               }
            }
         },
         series: [
            {
               name: "Desempeño",
               type: "line",
               smooth: true,
               data: selectedPoint?.performance || [85, 88, 90, 89, 92, 91, 93],
               lineStyle: {
                  width: 4,
                  color: "#667eea"
               },
               itemStyle: {
                  color: "#667eea"
               },
               areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                     { offset: 0, color: "rgba(102, 126, 234, 0.5)" },
                     { offset: 1, color: "rgba(102, 126, 234, 0.1)" }
                  ])
               },
               symbol: "circle",
               symbolSize: 8
            }
         ]
      };

      performanceChart.setOption(performanceOption);

      return () => {
         performanceChart.dispose();
      };
   }, [selectedPoint]);

   // Filtrar puntos por zona seleccionada
   const zonePoints = points.filter((point) => point.zone === selectedZone);

   // Estadísticas generales
   const totalPoints = points.length;
   const highPoints = points.filter((p) => p.type === "high").length;
   const mediumPoints = points.filter((p) => p.type === "medium").length;
   const lowPoints = points.filter((p) => p.type === "low").length;
   const coverage = Math.round((points.length / 300) * 100); // Suponiendo 300 como máximo

   // Función para obtener el color del badge según el tipo
   const getStatusColor = (type) => {
      switch (type) {
         case "high":
            return "bg-green-100 text-green-800";
         case "medium":
            return "bg-yellow-100 text-yellow-800";
         case "low":
            return "bg-red-100 text-red-800";
         case "center":
            return "bg-blue-100 text-blue-800";
         default:
            return "bg-gray-100 text-gray-800";
      }
   };

   // Función para obtener el ícono según el tipo
   const getStatusIcon = (type) => {
      switch (type) {
         case "high":
            return "fa-chart-line";
         case "medium":
            return "fa-chart-bar";
         case "low":
            return "fa-chart-area";
         case "center":
            return "fa-warehouse";
         default:
            return "fa-store";
      }
   };

   // Función para formatear moneda
   const formatCurrency = (amount) => {
      if (amount >= 1000) {
         return `€${(amount / 1000).toFixed(1)}K`;
      }
      return `€${amount}`;
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
         <div className="max-w-screen-2xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-xl p-6 mb-6 text-white">
               <div className="flex justify-between items-center">
                  <div>
                     <h1 className="text-3xl font-bold">Sistema de Monitoreo de Distribución</h1>
                     <p className="text-blue-100 mt-2">Seguimiento en tiempo real de puntos de venta y rutas de distribución</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                     <div className="text-sm">Actualizado</div>
                     <div className="text-xl font-bold">Justo ahora</div>
                  </div>
               </div>

               {/* Estadísticas del header */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                     <div className="text-2xl font-bold">{totalPoints}</div>
                     <div className="text-blue-100">Puntos de venta</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                     <div className="text-2xl font-bold">{Object.keys(zonesData).length}</div>
                     <div className="text-blue-100">Zonas</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                     <div className="text-2xl font-bold">{Math.round(points.reduce((sum, p) => sum + p.inventory, 0) / points.length)}%</div>
                     <div className="text-blue-100">Inventario promedio</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                     <div className="text-2xl font-bold">{coverage}%</div>
                     <div className="text-blue-100">Cobertura</div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
               {/* Mapa - Columna principal */}
               <div className="lg:w-2/3">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div>
                           <h2 className="text-2xl font-bold text-gray-800">Mapa de Distribución</h2>
                           <p className="text-gray-600">Haz clic en cualquier punto para ver detalles</p>
                        </div>

                        {/* Filtros */}
                        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                           <button
                              onClick={() => setActiveFilter("all")}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                 activeFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                           >
                              Todos
                           </button>
                           <button
                              onClick={() => setActiveFilter("high")}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                 activeFilter === "high" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                           >
                              Alto
                           </button>
                           <button
                              onClick={() => setActiveFilter("medium")}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                 activeFilter === "medium" ? "bg-yellow-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                           >
                              Medio
                           </button>
                           <button
                              onClick={() => setActiveFilter("low")}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                 activeFilter === "low" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                           >
                              Bajo
                           </button>
                        </div>
                     </div>

                     {/* Mapa */}
                     <div className="h-[500px] rounded-xl overflow-hidden border border-gray-200">
                        <div ref={mapRef} className="w-full h-full" />
                     </div>

                     {/* Leyenda */}
                     <div className="flex flex-wrap gap-6 mt-4 text-sm">
                        <div className="flex items-center">
                           <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                           <span className="text-gray-700">Alto Desempeño ({highPoints})</span>
                        </div>
                        <div className="flex items-center">
                           <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                           <span className="text-gray-700">Desempeño Medio ({mediumPoints})</span>
                        </div>
                        <div className="flex items-center">
                           <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                           <span className="text-gray-700">Bajo Desempeño ({lowPoints})</span>
                        </div>
                        <div className="flex items-center">
                           <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                           <span className="text-gray-700">Centro Distribución</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Panel lateral */}
               <div className="lg:w-1/3">
                  <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                     {/* Información de zona */}
                     <div className="mb-8">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <h2 className="text-2xl font-bold text-gray-800">{selectedZone}</h2>
                              <div className="flex items-center text-gray-600 mt-1">
                                 <span>Código Postal: {currentZone.postalCodes || "N/A"}</span>
                                 <span className="mx-2">•</span>
                                 <span>{currentZone.totalPoints || 0} puntos</span>
                              </div>
                           </div>
                           <div
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                 currentZone.status === "high"
                                    ? "bg-green-100 text-green-800"
                                    : currentZone.status === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                           >
                              {currentZone.status === "high" ? "Óptimo" : currentZone.status === "medium" ? "Moderado" : "Crítico"}
                           </div>
                        </div>

                        {/* Tarjetas de estadísticas */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                           <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                              <div className="text-2xl font-bold">{currentZone.avgInventory || 0}%</div>
                              <div className="text-sm opacity-90">Inventario Promedio</div>
                           </div>
                           <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                              <div className="text-2xl font-bold">{formatCurrency(currentZone.avgSales || 0)}</div>
                              <div className="text-sm opacity-90">Ventas Promedio</div>
                           </div>
                           <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
                              <div className="text-2xl font-bold">{currentZone.avgRotation || 0}</div>
                              <div className="text-sm opacity-90">Rotación Stock</div>
                           </div>
                           <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-white">
                              <div className="text-2xl font-bold">{currentZone.avgOrders || 0}</div>
                              <div className="text-sm opacity-90">Pedidos Pendientes</div>
                           </div>
                        </div>

                        {/* Gráfico de desempeño */}
                        <div className="mb-6">
                           <div className="flex justify-between items-center mb-3">
                              <h3 className="font-semibold text-gray-700">Desempeño del Punto Seleccionado</h3>
                           </div>
                           <div ref={chartRef} className="h-40" />
                        </div>
                     </div>

                     {/* Lista de puntos de venta */}
                     <div>
                        <div className="flex justify-between items-center mb-4">
                           <h3 className="text-lg font-bold text-gray-800">Puntos en {selectedZone}</h3>
                           <div className="text-sm text-gray-500">{currentZone.totalPoints || 0} puntos</div>
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                           {zonePoints.map((point) => (
                              <div
                                 key={point.id}
                                 onClick={() => setSelectedPoint(point)}
                                 className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                                    selectedPoint?.id === point.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"
                                 }`}
                              >
                                 <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                       <div className="font-bold text-gray-800">{point.name}</div>
                                       <div className="text-sm text-gray-600 mt-1">
                                          <i className="fas fa-calendar-alt mr-2"></i>
                                          Últ. entrega: {point.lastDelivery}
                                       </div>

                                       <div className="grid grid-cols-3 gap-2 mt-3">
                                          <div className="text-center">
                                             <div className="text-lg font-bold text-gray-800">{point.inventory}%</div>
                                             <div className="text-xs text-gray-500">Inventario</div>
                                          </div>
                                          <div className="text-center">
                                             <div className="text-lg font-bold text-gray-800">{formatCurrency(point.sales)}</div>
                                             <div className="text-xs text-gray-500">Ventas</div>
                                          </div>
                                          <div className="text-center">
                                             <div className="text-lg font-bold text-gray-800">{point.rotation}</div>
                                             <div className="text-xs text-gray-500">Rotación</div>
                                          </div>
                                       </div>
                                    </div>

                                    <div className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(point.type)}`}>
                                       <i className={`fas ${getStatusIcon(point.type)} mr-1`}></i>
                                       {point.type === "high" ? "Alto" : point.type === "medium" ? "Medio" : point.type === "low" ? "Bajo" : "Centro"}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>

                        {/* Resumen */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                           <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen General</h3>
                           <div className="grid grid-cols-3 gap-4">
                              <div className="text-center p-3 bg-gray-50 rounded-xl">
                                 <div className="text-xl font-bold text-blue-600">{totalPoints}</div>
                                 <div className="text-sm text-gray-600">Puntos Totales</div>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-xl">
                                 <div className="text-xl font-bold text-green-600">{Math.round((highPoints / totalPoints) * 100)}%</div>
                                 <div className="text-sm text-gray-600">Alto Desempeño</div>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-xl">
                                 <div className="text-xl font-bold text-purple-600">{coverage}%</div>
                                 <div className="text-sm text-gray-600">Cobertura</div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Estilos adicionales */}
         <style jsx>{`
            .echarts-tooltip {
               background: rgba(255, 255, 255, 0.95) !important;
               backdrop-filter: blur(10px);
               border: 1px solid rgba(226, 232, 240, 0.8) !important;
               border-radius: 8px !important;
               box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
               padding: 12px 16px !important;
            }
         `}</style>

         {/* Font Awesome CDN */}
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </div>
   );
};

export default DistributionMonitoring;
