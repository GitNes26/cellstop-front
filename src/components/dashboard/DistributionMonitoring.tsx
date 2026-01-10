import React, { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const DistributionMonitoring = ({ salesPoints = [] }) => {
   const mapContainer = useRef(null);
   const map = useRef(null);
   const [selectedZone, setSelectedZone] = useState("Zona Centro");
   const [selectedPoint, setSelectedPoint] = useState(null);
   const [activeFilter, setActiveFilter] = useState("all");
   const markers = useRef([]);
   const popupRef = useRef(null);

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

   // Inicializar mapa MapLibre
   useEffect(() => {
      if (!mapContainer.current || map.current) return;

      map.current = new maplibregl.Map({
         container: mapContainer.current,
         style: "https://demotiles.maplibre.org/style.json", // Estilo por defecto
         center: [-3.7, 40.41],
         zoom: 11,
         attributionControl: false
      });

      // Añadir controles de navegación
      map.current.addControl(new maplibregl.NavigationControl(), "top-right");

      // Añadir control de escala
      map.current.addControl(
         new maplibregl.ScaleControl({
            maxWidth: 100,
            unit: "metric"
         })
      );

      map.current.on("load", () => {
         addMarkersToMap();
      });

      return () => {
         if (map.current) {
            map.current.remove();
            map.current = null;
         }
      };
   }, []);

   // Función para obtener color según tipo
   const getPointColor = useCallback((type) => {
      switch (type) {
         case "high":
            return "#10B981"; // verde
         case "medium":
            return "#F59E0B"; // amarillo
         case "low":
            return "#EF4444"; // rojo
         case "center":
            return "#3B82F6"; // azul
         default:
            return "#6B7280"; // gris
      }
   }, []);

   // Función para obtener ícono según tipo
   const getPointIcon = useCallback((type) => {
      switch (type) {
         case "high":
            return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
         case "medium":
            return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
         case "low":
            return "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";
         case "center":
            return "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4";
         default:
            return "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4";
      }
   }, []);

   // Añadir marcadores al mapa
   const addMarkersToMap = useCallback(() => {
      if (!map.current) return;

      // Limpiar marcadores anteriores
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];

      // Filtrar puntos según el filtro activo
      const filteredPoints = activeFilter === "all" ? points : points.filter((point) => point.type === activeFilter);

      filteredPoints.forEach((point) => {
         const color = getPointColor(point.type);
         const iconPath = getPointIcon(point.type);

         // Crear elemento SVG para el marcador
         const el = document.createElement("div");
         el.className = "marker";
         el.style.width = "32px";
         el.style.height = "32px";
         el.style.cursor = "pointer";
         el.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";

         el.innerHTML = `
        <svg viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="${iconPath}" />
          <circle cx="12" cy="12" r="10" fill="${color}" fill-opacity="0.2" />
        </svg>
      `;

         // Crear popup
         const popup = new maplibregl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            className: "custom-popup"
         }).setHTML(`
        <div class="p-3">
          <div class="flex items-center mb-2">
            <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${color}"></div>
            <h3 class="font-bold text-gray-800 text-lg">${point.name}</h3>
          </div>
          <div class="space-y-1 text-sm">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-gray-600">${point.zone}</span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span class="text-gray-600">CP: ${point.postalCode}</span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span class="text-gray-600">Inventario: <strong>${point.inventory}%</strong></span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-gray-600">Ventas: <strong>€${point.sales.toLocaleString()}</strong></span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="text-gray-600">Rotación: <strong>${point.rotation}</strong></span>
            </div>
          </div>
          <button class="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            Ver detalles
          </button>
        </div>
      `);

         // Crear marcador
         const marker = new maplibregl.Marker({
            element: el,
            anchor: "center"
         })
            .setLngLat([point.lng, point.lat])
            .setPopup(popup)
            .addTo(map.current);

         // Añadir evento de clic al marcador
         el.addEventListener("click", (e) => {
            e.stopPropagation();
            setSelectedZone(point.zone);
            setSelectedPoint(point);

            // Mover el mapa al punto
            map.current.flyTo({
               center: [point.lng, point.lat],
               zoom: 14,
               duration: 1000
            });
         });

         // Añadir evento al popup
         popup.on("open", () => {
            setSelectedZone(point.zone);
            setSelectedPoint(point);
         });

         markers.current.push(marker);
      });

      // Ajustar vista para mostrar todos los marcadores
      if (filteredPoints.length > 0) {
         const bounds = new maplibregl.LngLatBounds();
         filteredPoints.forEach((point) => {
            bounds.extend([point.lng, point.lat]);
         });

         setTimeout(() => {
            if (map.current) {
               map.current.fitBounds(bounds, {
                  padding: 50,
                  duration: 1000
               });
            }
         }, 500);
      }
   }, [points, activeFilter, getPointColor, getPointIcon]);

   // Actualizar marcadores cuando cambia el filtro
   useEffect(() => {
      if (map.current && map.current.isStyleLoaded()) {
         addMarkersToMap();
      }
   }, [activeFilter, addMarkersToMap]);

   // Filtrar puntos por zona seleccionada
   const zonePoints = points.filter((point) => point.zone === selectedZone);

   // Estadísticas generales
   const totalPoints = points.length;
   const highPoints = points.filter((p) => p.type === "high").length;
   const mediumPoints = points.filter((p) => p.type === "medium").length;
   const lowPoints = points.filter((p) => p.type === "low").length;
   const centerPoints = points.filter((p) => p.type === "center").length;
   const coverage = Math.round((points.length / 300) * 100);

   // Función para obtener el color del badge según el tipo
   const getStatusColor = (type) => {
      switch (type) {
         case "high":
            return "bg-green-100 text-green-800 border-green-200";
         case "medium":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
         case "low":
            return "bg-red-100 text-red-800 border-red-200";
         case "center":
            return "bg-blue-100 text-blue-800 border-blue-200";
         default:
            return "bg-gray-100 text-gray-800 border-gray-200";
      }
   };

   // Función para formatear moneda
   const formatCurrency = (amount) => {
      if (amount >= 1000) {
         return `€${(amount / 1000).toFixed(1)}K`;
      }
      return `€${amount}`;
   };

   // Función para calcular el desempeño promedio
   const calculateAveragePerformance = (performanceArray) => {
      if (!performanceArray || performanceArray.length === 0) return 0;
      const sum = performanceArray.reduce((a, b) => a + b, 0);
      return (sum / performanceArray.length).toFixed(1);
   };

   // Renderizar gráfico de desempeño
   const renderPerformanceChart = () => {
      const performance = selectedPoint?.performance || [85, 88, 90, 89, 92, 91, 93];
      const max = Math.max(...performance);
      const min = Math.min(...performance);

      return (
         <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
               <span>Últimos 7 días</span>
               <span>Promedio: {calculateAveragePerformance(performance)}%</span>
            </div>
            <div className="flex items-end h-32 space-x-1">
               {performance.map((value, index) => {
                  const height = ((value - min) / (max - min)) * 80 + 20;
                  return (
                     <div key={index} className="flex flex-col items-center flex-1">
                        <div
                           className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:opacity-80"
                           style={{ height: `${height}%` }}
                           title={`Día ${index + 1}: ${value}%`}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1">{["L", "M", "M", "J", "V", "S", "D"][index]}</div>
                     </div>
                  );
               })}
            </div>
         </div>
      );
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
         <div className="max-w-screen-2xl mx-auto p-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-6 mb-6 text-white">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="mb-4 md:mb-0">
                     <h1 className="text-3xl font-bold">Sistema de Monitoreo de Distribución</h1>
                     <p className="text-indigo-100 mt-2">Seguimiento en tiempo real de puntos de venta y rutas de distribución</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                     <div className="text-sm opacity-90">Actualizado</div>
                     <div className="text-xl font-bold flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        Justo ahora
                     </div>
                  </div>
               </div>

               {/* Estadísticas del header */}
               <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors">
                     <div className="text-2xl font-bold">{totalPoints}</div>
                     <div className="text-sm opacity-90">Puntos de venta</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors">
                     <div className="text-2xl font-bold">{Object.keys(zonesData).length}</div>
                     <div className="text-sm opacity-90">Zonas</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors">
                     <div className="text-2xl font-bold">{Math.round(points.reduce((sum, p) => sum + p.inventory, 0) / totalPoints)}%</div>
                     <div className="text-sm opacity-90">Inventario promedio</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors">
                     <div className="text-2xl font-bold">{coverage}%</div>
                     <div className="text-sm opacity-90">Cobertura</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors">
                     <div className="text-2xl font-bold">{centerPoints}</div>
                     <div className="text-sm opacity-90">Centros de distribución</div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
               {/* Mapa - Columna principal */}
               <div className="lg:w-2/3">
                  <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
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
                                 activeFilter === "all" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                           >
                              Todos ({totalPoints})
                           </button>
                           <button
                              onClick={() => setActiveFilter("high")}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                 activeFilter === "high" ? "bg-green-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                           >
                              Alto ({highPoints})
                           </button>
                           <button
                              onClick={() => setActiveFilter("medium")}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                 activeFilter === "medium" ? "bg-yellow-500 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                           >
                              Medio ({mediumPoints})
                           </button>
                           <button
                              onClick={() => setActiveFilter("low")}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                 activeFilter === "low" ? "bg-red-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                           >
                              Bajo ({lowPoints})
                           </button>
                        </div>
                     </div>

                     {/* Mapa MapLibre */}
                     <div className="h-[600px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                        <div ref={mapContainer} className="w-full h-full" />
                     </div>

                     {/* Leyenda */}
                     <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex flex-wrap gap-6">
                           <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                              <span className="text-gray-700 font-medium">Alto Desempeño</span>
                              <span className="ml-2 text-gray-500">({highPoints})</span>
                           </div>
                           <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                              <span className="text-gray-700 font-medium">Desempeño Medio</span>
                              <span className="ml-2 text-gray-500">({mediumPoints})</span>
                           </div>
                           <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                              <span className="text-gray-700 font-medium">Bajo Desempeño</span>
                              <span className="ml-2 text-gray-500">({lowPoints})</span>
                           </div>
                           <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                              <span className="text-gray-700 font-medium">Centro Distribución</span>
                              <span className="ml-2 text-gray-500">({centerPoints})</span>
                           </div>
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
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                 currentZone.status === "high"
                                    ? "bg-green-50 text-green-800 border-green-200"
                                    : currentZone.status === "medium"
                                    ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                                    : "bg-red-50 text-red-800 border-red-200"
                              }`}
                           >
                              {currentZone.status === "high" ? "Óptimo" : currentZone.status === "medium" ? "Moderado" : "Crítico"}
                           </div>
                        </div>

                        {/* Tarjetas de estadísticas */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                           <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow-md">
                              <div className="text-2xl font-bold">{currentZone.avgInventory || 0}%</div>
                              <div className="text-sm opacity-90">Inventario Promedio</div>
                              <div className="mt-2 text-xs opacity-80">
                                 {currentZone.avgInventory > 80 ? "Excelente" : currentZone.avgInventory > 60 ? "Bueno" : "Necesita atención"}
                              </div>
                           </div>
                           <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-4 text-white shadow-md">
                              <div className="text-2xl font-bold">{formatCurrency(currentZone.avgSales || 0)}</div>
                              <div className="text-sm opacity-90">Ventas Promedio</div>
                              <div className="mt-2 text-xs opacity-80">Por punto de venta</div>
                           </div>
                           <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white shadow-md">
                              <div className="text-2xl font-bold">{currentZone.avgRotation || 0}</div>
                              <div className="text-sm opacity-90">Rotación Stock</div>
                              <div className="mt-2 text-xs opacity-80">
                                 {currentZone.avgRotation > 3 ? "Óptima" : currentZone.avgRotation > 2 ? "Aceptable" : "Baja"}
                              </div>
                           </div>
                           <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-4 text-white shadow-md">
                              <div className="text-2xl font-bold">{currentZone.avgOrders || 0}</div>
                              <div className="text-sm opacity-90">Pedidos Pendientes</div>
                              <div className="mt-2 text-xs opacity-80">Por punto de venta</div>
                           </div>
                        </div>

                        {/* Gráfico de desempeño */}
                        <div className="mb-6">
                           <div className="flex justify-between items-center mb-3">
                              <h3 className="font-semibold text-gray-700">{selectedPoint ? `Desempeño: ${selectedPoint.name}` : "Desempeño de la Zona"}</h3>
                           </div>
                           {renderPerformanceChart()}
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
                                 onClick={() => {
                                    setSelectedPoint(point);
                                    // Mover el mapa al punto seleccionado
                                    if (map.current) {
                                       map.current.flyTo({
                                          center: [point.lng, point.lat],
                                          zoom: 14,
                                          duration: 1000
                                       });
                                    }
                                 }}
                                 className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                                    selectedPoint?.id === point.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                 }`}
                              >
                                 <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                       <div className="flex items-center">
                                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getPointColor(point.type) }}></div>
                                          <div className="font-bold text-gray-800 truncate">{point.name}</div>
                                       </div>
                                       <div className="text-sm text-gray-600 mt-1">
                                          <span className="inline-flex items-center">
                                             <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                   strokeLinecap="round"
                                                   strokeLinejoin="round"
                                                   strokeWidth="2"
                                                   d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                             </svg>
                                             {point.lastDelivery}
                                          </span>
                                       </div>

                                       <div className="grid grid-cols-3 gap-2 mt-3">
                                          <div className="text-center p-2 bg-white rounded-lg border">
                                             <div className="text-lg font-bold text-gray-800">{point.inventory}%</div>
                                             <div className="text-xs text-gray-500">Inventario</div>
                                          </div>
                                          <div className="text-center p-2 bg-white rounded-lg border">
                                             <div className="text-lg font-bold text-gray-800">{formatCurrency(point.sales)}</div>
                                             <div className="text-xs text-gray-500">Ventas</div>
                                          </div>
                                          <div className="text-center p-2 bg-white rounded-lg border">
                                             <div className="text-lg font-bold text-gray-800">{point.rotation}</div>
                                             <div className="text-xs text-gray-500">Rotación</div>
                                          </div>
                                       </div>
                                    </div>

                                    <div className={`ml-3 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(point.type)}`}>
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
                              <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border">
                                 <div className="text-xl font-bold text-blue-600">{totalPoints}</div>
                                 <div className="text-sm text-gray-600">Puntos Totales</div>
                              </div>
                              <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border">
                                 <div className="text-xl font-bold text-green-600">{Math.round((highPoints / totalPoints) * 100)}%</div>
                                 <div className="text-sm text-gray-600">Alto Desempeño</div>
                              </div>
                              <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border">
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

         {/* Estilos personalizados para MapLibre */}
         <style jsx global>{`
            .maplibregl-popup {
               max-width: 300px !important;
            }

            .maplibregl-popup-content {
               padding: 0 !important;
               border-radius: 12px !important;
               box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
               border: 1px solid #e5e7eb !important;
            }

            .maplibregl-popup-close-button {
               font-size: 20px !important;
               padding: 8px !important;
               color: #6b7280 !important;
            }

            .maplibregl-popup-close-button:hover {
               color: #374151 !important;
               background-color: transparent !important;
            }

            .maplibregl-ctrl-top-right {
               top: 10px !important;
               right: 10px !important;
            }

            .maplibregl-ctrl-group {
               border-radius: 8px !important;
               box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
               border: 1px solid #e5e7eb !important;
               overflow: hidden;
            }

            .maplibregl-ctrl button {
               width: 36px !important;
               height: 36px !important;
            }

            .maplibregl-ctrl-scale {
               background-color: rgba(255, 255, 255, 0.9) !important;
               border: 1px solid #e5e7eb !important;
               border-radius: 4px !important;
               padding: 4px 8px !important;
               font-size: 12px !important;
            }
         `}</style>
      </div>
   );
};

export default DistributionMonitoring;

// import React, { useEffect, useRef, useState } from "react";
// import * as echarts from "echarts";
// import "echarts-gl";
// // import "echarts/map/js/world";

// const DistributionMonitoring = ({ salesPoints = [] }) => {
//    const mapRef = useRef(null);
//    const chartRef = useRef(null);
//    const [selectedZone, setSelectedZone] = useState("Zona Centro");
//    const [selectedPoint, setSelectedPoint] = useState(null);
//    const [activeFilter, setActiveFilter] = useState("all");

//    // Datos de ejemplo si no se proporcionan
//    const defaultPoints = [
//       {
//          id: 1,
//          name: "Supermercado Central",
//          lat: 40.41,
//          lng: -3.7,
//          type: "high",
//          zone: "Zona Centro",
//          postalCode: "28001",
//          inventory: 92,
//          sales: 38500,
//          rotation: 3.8,
//          orders: 2,
//          lastDelivery: "2025-12-15",
//          performance: [85, 88, 90, 89, 92, 91, 93]
//       },
//       {
//          id: 2,
//          name: "Tienda del Barrio",
//          lat: 40.42,
//          lng: -3.69,
//          type: "medium",
//          zone: "Zona Centro",
//          postalCode: "28001",
//          inventory: 78,
//          sales: 22500,
//          rotation: 2.5,
//          orders: 5,
//          lastDelivery: "2025-12-18",
//          performance: [72, 74, 75, 76, 77, 78, 79]
//       },
//       {
//          id: 3,
//          name: "Minimarket Express",
//          lat: 40.4,
//          lng: -3.71,
//          type: "low",
//          zone: "Zona Centro",
//          postalCode: "28001",
//          inventory: 65,
//          sales: 15200,
//          rotation: 1.8,
//          orders: 8,
//          lastDelivery: "2025-12-10",
//          performance: [60, 62, 63, 64, 65, 64, 65]
//       },
//       {
//          id: 4,
//          name: "Centro Distribución Norte",
//          lat: 40.47,
//          lng: -3.68,
//          type: "center",
//          zone: "Zona Norte",
//          postalCode: "28003",
//          inventory: 95,
//          sales: 0,
//          rotation: 4.2,
//          orders: 0,
//          lastDelivery: "2025-12-20",
//          performance: [92, 93, 94, 95, 94, 95, 95]
//       },
//       {
//          id: 5,
//          name: "SuperAhorro",
//          lat: 40.39,
//          lng: -3.67,
//          type: "high",
//          zone: "Zona Sur",
//          postalCode: "28005",
//          inventory: 88,
//          sales: 41200,
//          rotation: 3.5,
//          orders: 3,
//          lastDelivery: "2025-12-19",
//          performance: [82, 84, 86, 87, 88, 87, 88]
//       },
//       {
//          id: 6,
//          name: "Tienda 24 Horas",
//          lat: 40.43,
//          lng: -3.72,
//          type: "medium",
//          zone: "Zona Oeste",
//          postalCode: "28008",
//          inventory: 72,
//          sales: 18900,
//          rotation: 2.2,
//          orders: 6,
//          lastDelivery: "2025-12-17",
//          performance: [68, 69, 70, 71, 72, 71, 72]
//       },
//       {
//          id: 7,
//          name: "Market Fresh",
//          lat: 40.38,
//          lng: -3.69,
//          type: "high",
//          zone: "Zona Sur",
//          postalCode: "28005",
//          inventory: 94,
//          sales: 35600,
//          rotation: 4.1,
//          orders: 1,
//          lastDelivery: "2025-12-20",
//          performance: [90, 91, 92, 93, 94, 93, 94]
//       },
//       {
//          id: 8,
//          name: "Almacén Económico",
//          lat: 40.45,
//          lng: -3.73,
//          type: "low",
//          zone: "Zona Norte",
//          postalCode: "28003",
//          inventory: 58,
//          sales: 12800,
//          rotation: 1.5,
//          orders: 9,
//          lastDelivery: "2025-12-12",
//          performance: [55, 56, 57, 58, 57, 58, 58]
//       }
//    ];

//    const points = salesPoints.length > 0 ? salesPoints : defaultPoints;

//    // Datos de zonas calculados
//    const zonesData = React.useMemo(() => {
//       const zones = {};

//       points.forEach((point) => {
//          if (!zones[point.zone]) {
//             zones[point.zone] = {
//                points: [],
//                totalPoints: 0,
//                totalInventory: 0,
//                totalSales: 0,
//                totalRotation: 0,
//                totalOrders: 0,
//                postalCodes: new Set()
//             };
//          }

//          zones[point.zone].points.push(point);
//          zones[point.zone].totalPoints++;
//          zones[point.zone].totalInventory += point.inventory;
//          zones[point.zone].totalSales += point.sales;
//          zones[point.zone].totalRotation += point.rotation;
//          zones[point.zone].totalOrders += point.orders;
//          zones[point.zone].postalCodes.add(point.postalCode);
//       });

//       // Calcular promedios
//       Object.keys(zones).forEach((zone) => {
//          zones[zone].avgInventory = Math.round(zones[zone].totalInventory / zones[zone].totalPoints);
//          zones[zone].avgSales = Math.round(zones[zone].totalSales / zones[zone].totalPoints);
//          zones[zone].avgRotation = (zones[zone].totalRotation / zones[zone].totalPoints).toFixed(1);
//          zones[zone].avgOrders = Math.round(zones[zone].totalOrders / zones[zone].totalPoints);
//          zones[zone].postalCodes = Array.from(zones[zone].postalCodes).join(", ");

//          // Determinar estado de la zona
//          const performance = zones[zone].points.filter((p) => p.type === "high").length / zones[zone].totalPoints;
//          zones[zone].status = performance > 0.7 ? "high" : performance > 0.4 ? "medium" : "low";
//       });

//       return zones;
//    }, [points]);

//    const currentZone = zonesData[selectedZone] || {};

//    // Inicializar mapa ECharts
//    useEffect(() => {
//       if (!mapRef.current) return;

//       const mapChart = echarts.init(mapRef.current);

//       // Filtrar puntos según el filtro activo
//       const filteredPoints = activeFilter === "all" ? points : points.filter((point) => point.type === activeFilter);

//       const mapOption = {
//          tooltip: {
//             trigger: "item",
//             formatter: function (params) {
//                const point = points.find((p) => Math.abs(p.lat - params.value[1]) < 0.01 && Math.abs(p.lng - params.value[0]) < 0.01);

//                if (!point) return "";

//                let color;
//                switch (point.type) {
//                   case "high":
//                      color = "#48bb78";
//                      break;
//                   case "medium":
//                      color = "#f6ad55";
//                      break;
//                   case "low":
//                      color = "#f56565";
//                      break;
//                   case "center":
//                      color = "#6F99CD";
//                      break;
//                }

//                return `
//             <div class="font-bold text-lg mb-2" style="color:${color}">${point.name}</div>
//             <div class="text-gray-600 mb-1"><i class="fas fa-map-marker-alt mr-2"></i>${point.zone}</div>
//             <div class="text-gray-600 mb-1"><i class="fas fa-mail-bulk mr-2"></i>CP: ${point.postalCode}</div>
//             <div class="text-gray-600 mb-1"><i class="fas fa-boxes mr-2"></i>Inventario: ${point.inventory}%</div>
//             <div class="text-gray-600 mb-1"><i class="fas fa-euro-sign mr-2"></i>Ventas: €${point.sales.toLocaleString()}</div>
//             <div class="text-gray-600"><i class="fas fa-sync-alt mr-2"></i>Rotación: ${point.rotation}</div>
//           `;
//             },
//             backgroundColor: "rgba(255, 255, 255, 0.95)",
//             borderColor: "#e2e8f0",
//             textStyle: { color: "#2d3748" },
//             extraCssText: "box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 12px 16px;"
//          },
//          // geo: {
//          //    // map: "world",
//          //    roam: true,
//          //    zoom: 1.5,
//          //    center: [-3.7, 40.4],
//          //    label: {
//          //       emphasis: {
//          //          show: false
//          //       }
//          //    },
//          //    itemStyle: {
//          //       normal: {
//          //          areaColor: "#f8fafc",
//          //          borderColor: "#cbd5e0",
//          //          borderWidth: 1
//          //       },
//          //       emphasis: {
//          //          areaColor: "#e2e8f0"
//          //       }
//          //    }
//          // },
//          series: [
//             {
//                name: "Puntos de Venta",
//                type: "scatter",
//                coordinateSystem: "geo",
//                data: filteredPoints.map((point) => {
//                   let value, symbolSize;

//                   switch (point.type) {
//                      case "high":
//                         value = 90;
//                         symbolSize = 18;
//                         break;
//                      case "medium":
//                         value = 60;
//                         symbolSize = 14;
//                         break;
//                      case "low":
//                         value = 30;
//                         symbolSize = 12;
//                         break;
//                      case "center":
//                         value = 100;
//                         symbolSize = 22;
//                         break;
//                   }

//                   return {
//                      name: point.name,
//                      value: [point.lng, point.lat, value],
//                      symbolSize: symbolSize,
//                      itemStyle: {
//                         color: point.type === "high" ? "#48bb78" : point.type === "medium" ? "#f6ad55" : point.type === "low" ? "#f56565" : "#6F99CD",
//                         shadowBlur: 10,
//                         shadowColor:
//                            point.type === "high"
//                               ? "rgba(72, 187, 120, 0.5)"
//                               : point.type === "medium"
//                               ? "rgba(246, 173, 85, 0.5)"
//                               : point.type === "low"
//                               ? "rgba(245, 101, 101, 0.5)"
//                               : "rgba(102, 126, 234, 0.5)"
//                      }
//                   };
//                }),
//                emphasis: {
//                   itemStyle: {
//                      borderColor: "#fff",
//                      borderWidth: 2,
//                      shadowBlur: 20
//                   }
//                }
//             }
//          ]
//       };

//       mapChart.setOption(mapOption);

//       // Evento de clic en el mapa
//       mapChart.on("click", function (params) {
//          if (params.componentType === "series" && params.seriesType === "scatter") {
//             const pointName = params.name;
//             const point = points.find((p) => p.name === pointName);

//             if (point) {
//                setSelectedZone(point.zone);
//                setSelectedPoint(point);
//             }
//          }
//       });

//       // Ajustar tamaño al redimensionar
//       const handleResize = () => mapChart.resize();
//       window.addEventListener("resize", handleResize);

//       return () => {
//          window.removeEventListener("resize", handleResize);
//          mapChart.dispose();
//       };
//    }, [points, activeFilter]);

//    // Inicializar gráfico de desempeño
//    useEffect(() => {
//       if (!chartRef.current || !selectedPoint) return;

//       const performanceChart = echarts.init(chartRef.current);

//       const performanceOption = {
//          tooltip: {
//             trigger: "axis",
//             formatter: function (params) {
//                return `Día ${params[0].axisValue + 1}: ${params[0].value}%`;
//             },
//             backgroundColor: "rgba(255, 255, 255, 0.95)",
//             borderColor: "#e2e8f0",
//             textStyle: { color: "#2d3748" },
//             extraCssText: "box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border-radius: 8px;"
//          },
//          grid: {
//             left: "3%",
//             right: "4%",
//             bottom: "3%",
//             top: "10%",
//             containLabel: true
//          },
//          xAxis: {
//             type: "category",
//             boundaryGap: false,
//             data: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
//             axisLine: {
//                lineStyle: {
//                   color: "#cbd5e0"
//                }
//             },
//             axisLabel: {
//                color: "#718096"
//             }
//          },
//          yAxis: {
//             type: "value",
//             min: 0,
//             max: 100,
//             axisLine: {
//                lineStyle: {
//                   color: "#cbd5e0"
//                }
//             },
//             axisLabel: {
//                color: "#718096",
//                formatter: "{value}%"
//             },
//             splitLine: {
//                lineStyle: {
//                   color: "#f7fafc",
//                   type: "dashed"
//                }
//             }
//          },
//          series: [
//             {
//                name: "Desempeño",
//                type: "line",
//                smooth: true,
//                data: selectedPoint?.performance || [85, 88, 90, 89, 92, 91, 93],
//                lineStyle: {
//                   width: 4,
//                   color: "#6F99CD"
//                },
//                itemStyle: {
//                   color: "#6F99CD"
//                },
//                areaStyle: {
//                   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//                      { offset: 0, color: "rgba(102, 126, 234, 0.5)" },
//                      { offset: 1, color: "rgba(102, 126, 234, 0.1)" }
//                   ])
//                },
//                symbol: "circle",
//                symbolSize: 8
//             }
//          ]
//       };

//       performanceChart.setOption(performanceOption);

//       return () => {
//          performanceChart.dispose();
//       };
//    }, [selectedPoint]);

//    // Filtrar puntos por zona seleccionada
//    const zonePoints = points.filter((point) => point.zone === selectedZone);

//    // Estadísticas generales
//    const totalPoints = points.length;
//    const highPoints = points.filter((p) => p.type === "high").length;
//    const mediumPoints = points.filter((p) => p.type === "medium").length;
//    const lowPoints = points.filter((p) => p.type === "low").length;
//    const coverage = Math.round((points.length / 300) * 100); // Suponiendo 300 como máximo

//    // Función para obtener el color del badge según el tipo
//    const getStatusColor = (type) => {
//       switch (type) {
//          case "high":
//             return "bg-green-100 text-green-800";
//          case "medium":
//             return "bg-yellow-100 text-yellow-800";
//          case "low":
//             return "bg-red-100 text-red-800";
//          case "center":
//             return "bg-blue-100 text-blue-800";
//          default:
//             return "bg-gray-100 text-gray-800";
//       }
//    };

//    // Función para obtener el ícono según el tipo
//    const getStatusIcon = (type) => {
//       switch (type) {
//          case "high":
//             return "fa-chart-line";
//          case "medium":
//             return "fa-chart-bar";
//          case "low":
//             return "fa-chart-area";
//          case "center":
//             return "fa-warehouse";
//          default:
//             return "fa-store";
//       }
//    };

//    // Función para formatear moneda
//    const formatCurrency = (amount) => {
//       if (amount >= 1000) {
//          return `€${(amount / 1000).toFixed(1)}K`;
//       }
//       return `€${amount}`;
//    };

//    return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
//          <div className="max-w-screen-2xl mx-auto">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-xl p-6 mb-6 text-white">
//                <div className="flex justify-between items-center">
//                   <div>
//                      <h1 className="text-3xl font-bold">Sistema de Monitoreo de Distribución</h1>
//                      <p className="text-blue-100 mt-2">Seguimiento en tiempo real de puntos de venta y rutas de distribución</p>
//                   </div>
//                   <div className="bg-white/20 p-3 rounded-xl">
//                      <div className="text-sm">Actualizado</div>
//                      <div className="text-xl font-bold">Justo ahora</div>
//                   </div>
//                </div>

//                {/* Estadísticas del header */}
//                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
//                   <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                      <div className="text-2xl font-bold">{totalPoints}</div>
//                      <div className="text-blue-100">Puntos de venta</div>
//                   </div>
//                   <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                      <div className="text-2xl font-bold">{Object.keys(zonesData).length}</div>
//                      <div className="text-blue-100">Zonas</div>
//                   </div>
//                   <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                      <div className="text-2xl font-bold">{Math.round(points.reduce((sum, p) => sum + p.inventory, 0) / points.length)}%</div>
//                      <div className="text-blue-100">Inventario promedio</div>
//                   </div>
//                   <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                      <div className="text-2xl font-bold">{coverage}%</div>
//                      <div className="text-blue-100">Cobertura</div>
//                   </div>
//                </div>
//             </div>

//             <div className="flex flex-col lg:flex-row gap-6">
//                {/* Mapa - Columna principal */}
//                <div className="lg:w-2/3">
//                   <div className="bg-white rounded-2xl shadow-lg p-6">
//                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//                         <div>
//                            <h2 className="text-2xl font-bold text-gray-800">Mapa de Distribución</h2>
//                            <p className="text-gray-600">Haz clic en cualquier punto para ver detalles</p>
//                         </div>

//                         {/* Filtros */}
//                         <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
//                            <button
//                               onClick={() => setActiveFilter("all")}
//                               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                                  activeFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                               }`}
//                            >
//                               Todos
//                            </button>
//                            <button
//                               onClick={() => setActiveFilter("high")}
//                               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                                  activeFilter === "high" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                               }`}
//                            >
//                               Alto
//                            </button>
//                            <button
//                               onClick={() => setActiveFilter("medium")}
//                               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                                  activeFilter === "medium" ? "bg-yellow-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                               }`}
//                            >
//                               Medio
//                            </button>
//                            <button
//                               onClick={() => setActiveFilter("low")}
//                               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                                  activeFilter === "low" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                               }`}
//                            >
//                               Bajo
//                            </button>
//                         </div>
//                      </div>

//                      {/* Mapa */}
//                      <div className="h-[500px] rounded-xl overflow-hidden border border-gray-200">
//                         <div ref={mapRef} className="w-full h-full" />
//                      </div>

//                      {/* Leyenda */}
//                      <div className="flex flex-wrap gap-6 mt-4 text-sm">
//                         <div className="flex items-center">
//                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
//                            <span className="text-gray-700">Alto Desempeño ({highPoints})</span>
//                         </div>
//                         <div className="flex items-center">
//                            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
//                            <span className="text-gray-700">Desempeño Medio ({mediumPoints})</span>
//                         </div>
//                         <div className="flex items-center">
//                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
//                            <span className="text-gray-700">Bajo Desempeño ({lowPoints})</span>
//                         </div>
//                         <div className="flex items-center">
//                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
//                            <span className="text-gray-700">Centro Distribución</span>
//                         </div>
//                      </div>
//                   </div>
//                </div>

//                {/* Panel lateral */}
//                <div className="lg:w-1/3">
//                   <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
//                      {/* Información de zona */}
//                      <div className="mb-8">
//                         <div className="flex justify-between items-start mb-4">
//                            <div>
//                               <h2 className="text-2xl font-bold text-gray-800">{selectedZone}</h2>
//                               <div className="flex items-center text-gray-600 mt-1">
//                                  <span>Código Postal: {currentZone.postalCodes || "N/A"}</span>
//                                  <span className="mx-2">•</span>
//                                  <span>{currentZone.totalPoints || 0} puntos</span>
//                               </div>
//                            </div>
//                            <div
//                               className={`px-3 py-1 rounded-full text-sm font-medium ${
//                                  currentZone.status === "high"
//                                     ? "bg-green-100 text-green-800"
//                                     : currentZone.status === "medium"
//                                     ? "bg-yellow-100 text-yellow-800"
//                                     : "bg-red-100 text-red-800"
//                               }`}
//                            >
//                               {currentZone.status === "high" ? "Óptimo" : currentZone.status === "medium" ? "Moderado" : "Crítico"}
//                            </div>
//                         </div>

//                         {/* Tarjetas de estadísticas */}
//                         <div className="grid grid-cols-2 gap-4 mb-6">
//                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
//                               <div className="text-2xl font-bold">{currentZone.avgInventory || 0}%</div>
//                               <div className="text-sm opacity-90">Inventario Promedio</div>
//                            </div>
//                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
//                               <div className="text-2xl font-bold">{formatCurrency(currentZone.avgSales || 0)}</div>
//                               <div className="text-sm opacity-90">Ventas Promedio</div>
//                            </div>
//                            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
//                               <div className="text-2xl font-bold">{currentZone.avgRotation || 0}</div>
//                               <div className="text-sm opacity-90">Rotación Stock</div>
//                            </div>
//                            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-white">
//                               <div className="text-2xl font-bold">{currentZone.avgOrders || 0}</div>
//                               <div className="text-sm opacity-90">Pedidos Pendientes</div>
//                            </div>
//                         </div>

//                         {/* Gráfico de desempeño */}
//                         <div className="mb-6">
//                            <div className="flex justify-between items-center mb-3">
//                               <h3 className="font-semibold text-gray-700">Desempeño del Punto Seleccionado</h3>
//                            </div>
//                            <div ref={chartRef} className="h-40" />
//                         </div>
//                      </div>

//                      {/* Lista de puntos de venta */}
//                      <div>
//                         <div className="flex justify-between items-center mb-4">
//                            <h3 className="text-lg font-bold text-gray-800">Puntos en {selectedZone}</h3>
//                            <div className="text-sm text-gray-500">{currentZone.totalPoints || 0} puntos</div>
//                         </div>

//                         <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
//                            {zonePoints.map((point) => (
//                               <div
//                                  key={point.id}
//                                  onClick={() => setSelectedPoint(point)}
//                                  className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
//                                     selectedPoint?.id === point.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"
//                                  }`}
//                               >
//                                  <div className="flex justify-between items-start">
//                                     <div className="flex-1">
//                                        <div className="font-bold text-gray-800">{point.name}</div>
//                                        <div className="text-sm text-gray-600 mt-1">
//                                           <i className="fas fa-calendar-alt mr-2"></i>
//                                           Últ. entrega: {point.lastDelivery}
//                                        </div>

//                                        <div className="grid grid-cols-3 gap-2 mt-3">
//                                           <div className="text-center">
//                                              <div className="text-lg font-bold text-gray-800">{point.inventory}%</div>
//                                              <div className="text-xs text-gray-500">Inventario</div>
//                                           </div>
//                                           <div className="text-center">
//                                              <div className="text-lg font-bold text-gray-800">{formatCurrency(point.sales)}</div>
//                                              <div className="text-xs text-gray-500">Ventas</div>
//                                           </div>
//                                           <div className="text-center">
//                                              <div className="text-lg font-bold text-gray-800">{point.rotation}</div>
//                                              <div className="text-xs text-gray-500">Rotación</div>
//                                           </div>
//                                        </div>
//                                     </div>

//                                     <div className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(point.type)}`}>
//                                        <i className={`fas ${getStatusIcon(point.type)} mr-1`}></i>
//                                        {point.type === "high" ? "Alto" : point.type === "medium" ? "Medio" : point.type === "low" ? "Bajo" : "Centro"}
//                                     </div>
//                                  </div>
//                               </div>
//                            ))}
//                         </div>

//                         {/* Resumen */}
//                         <div className="mt-8 pt-6 border-t border-gray-200">
//                            <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen General</h3>
//                            <div className="grid grid-cols-3 gap-4">
//                               <div className="text-center p-3 bg-gray-50 rounded-xl">
//                                  <div className="text-xl font-bold text-blue-600">{totalPoints}</div>
//                                  <div className="text-sm text-gray-600">Puntos Totales</div>
//                               </div>
//                               <div className="text-center p-3 bg-gray-50 rounded-xl">
//                                  <div className="text-xl font-bold text-green-600">{Math.round((highPoints / totalPoints) * 100)}%</div>
//                                  <div className="text-sm text-gray-600">Alto Desempeño</div>
//                               </div>
//                               <div className="text-center p-3 bg-gray-50 rounded-xl">
//                                  <div className="text-xl font-bold text-purple-600">{coverage}%</div>
//                                  <div className="text-sm text-gray-600">Cobertura</div>
//                               </div>
//                            </div>
//                         </div>
//                      </div>
//                   </div>
//                </div>
//             </div>
//          </div>

//          {/* Estilos adicionales */}
//          <style jsx>{`
//             .echarts-tooltip {
//                background: rgba(255, 255, 255, 0.95) !important;
//                backdrop-filter: blur(10px);
//                border: 1px solid rgba(226, 232, 240, 0.8) !important;
//                border-radius: 8px !important;
//                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
//                padding: 12px 16px !important;
//             }
//          `}</style>

//          {/* Font Awesome CDN */}
//          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
//       </div>
//    );
// };

// export default DistributionMonitoring;
