import React, { useState, useRef, useEffect, useMemo } from "react";
import { Map as ReactMap, Marker, Popup, NavigationControl, ScaleControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
// import stylesMap from "../../assets/styles/styles-map.json";
import maplibregl from "maplibre-gl";

// Tipos TypeScript
interface Seller {
   id: number;
   username: string;
   full_name: string;
   pin_color: string | null;
   avatar: string | null;
   position: string;
   department: string;
   cellphone: string;
}

interface InventoryItem {
   id?: number;
   product_name?: string;
   product_type?: string;
   sku?: string;
   quantity?: number;
   status?: "Asignado" | "Distribuido" | "Activado" | "Portado";
}

interface VisitStats {
   total: number;
   by_type: {
      [key: string]: number;
   };
}

interface DistributionInfo {
   date: string;
   executed_by: number;
   quantity: number;
}

interface PointOfSale {
   id: number;
   name: string;
   contact_name: string;
   contact_phone: string;
   address: string;
   lat: number;
   lon: number;
   ubication: string;
   seller: Seller;
   inventory: InventoryItem[];
   visits: VisitStats;
   last_distribution: DistributionInfo;
}

interface MapViewState {
   longitude: number;
   latitude: number;
   zoom: number;
}

interface SalesMapProps {
   pointsOfSale: PointOfSale[];
}

const SalesMap: React.FC<SalesMapProps> = ({ pointsOfSale }) => {
   const [selectedPoint, setSelectedPoint] = useState<PointOfSale | null>(null);
   const [hoveredPoint, setHoveredPoint] = useState<PointOfSale | null>(null);
   const [filterSeller, setFilterSeller] = useState<string>("all");
   const [viewState, setViewState] = useState<MapViewState>({
      longitude: -103.3585,
      latitude: 25.5379,
      zoom: 14
   });
   const [mapLoaded, setMapLoaded] = useState(false);
   const mapRef = useRef<maplibregl.Map>(null);

   // Estadísticas generales
   const stats = useMemo(() => {
      const totalPoints = pointsOfSale.length;
      const totalVisits = pointsOfSale.reduce((sum, point) => sum + point.visits.total, 0);
      const distributionVisits = pointsOfSale.reduce((sum, point) => sum + (point.visits.by_type?.Distribución || 0), 0);
      const monitoringVisits = pointsOfSale.reduce((sum, point) => sum + (point.visits.by_type?.Monitoreo || 0), 0);

      // Agrupar por vendedor
      const sellerStats: { [key: string]: number } = {};
      pointsOfSale.forEach((point) => {
         const sellerName = point.seller.full_name;
         sellerStats[sellerName] = (sellerStats[sellerName] || 0) + 1;
      });

      return {
         totalPoints,
         totalVisits,
         distributionVisits,
         monitoringVisits,
         sellerStats
      };
   }, [pointsOfSale]);

   // Vendedores únicos para filtro
   const sellers = useMemo(() => {
      let uniqueSellers = new Map<number, Seller>();
      pointsOfSale.forEach((point) => {
         if (!uniqueSellers.has(point.seller.id)) {
            uniqueSellers.set(point.seller.id, point.seller);
         }
      });
      return Array.from(uniqueSellers.values());
   }, [pointsOfSale]);

   // Puntos filtrados por vendedor
   const filteredPoints = useMemo(() => {
      if (filterSeller === "all") return pointsOfSale;
      const sellerId = parseInt(filterSeller);
      return pointsOfSale.filter((point) => point.seller.id === sellerId);
   }, [pointsOfSale, filterSeller]);

   // Función para obtener el color del pin
   const getPinColor = (seller: Seller) => {
      return seller.pin_color || "#3B82F6"; // Azul por defecto
   };

   // Función para inicializar el mapa con marcadores clusterizados
   useEffect(() => {
      if (mapLoaded && mapRef.current && pointsOfSale.length > 0) {
         // Ajustar vista para mostrar todos los puntos
         const bounds = new maplibregl.LngLatBounds();
         pointsOfSale.forEach((point) => {
            bounds.extend([point.lon, point.lat]);
         });

         if (bounds.isEmpty()) return;

         mapRef.current.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 350 },
            duration: 1000
         });
      }
   }, [mapLoaded, pointsOfSale]);

   // Renderizar contenido del popup
   const renderPopupContent = (point: PointOfSale) => {
      return (
         <div className="w-auto max-w-xl p-4">
            {/* Header del popup */}
            <div className="flex items-start justify-between mb-3">
               <div>
                  <h3 className="text-lg font-bold text-gray-800">{point.name}</h3>
                  <p className="text-sm text-gray-600">{point.address}</p>
               </div>
               <button onClick={() => window.open(point.ubication, "_blank")} className="p-1 hover:bg-gray-100 rounded" title="Abrir en Google Maps">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
               </button>
            </div>

            {/* Información de contacto */}
            <div className="mb-4">
               <h4 className="font-semibold text-gray-700 mb-2">Contacto</h4>
               <div className="space-y-1">
                  <div className="flex items-center">
                     <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                     </svg>
                     <span className="text-sm text-gray-600">{point.contact_name}</span>
                  </div>
                  <div className="flex items-center">
                     <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                           fillRule="evenodd"
                           d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                           clipRule="evenodd"
                        />
                     </svg>
                     <a href={`tel:${point.contact_phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                        {point.contact_phone}
                     </a>
                  </div>
               </div>
            </div>

            {/* Información del vendedor */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
               <h4 className="font-semibold text-gray-700 mb-2">Vendedor Asignado</h4>
               <div className="flex items-center">
                  {point.seller.avatar ? (
                     <img src={point.seller.avatar} alt={point.seller.full_name} className="w-8 h-8 rounded-full mr-3 object-cover" />
                  ) : (
                     <div
                        className="w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: getPinColor(point.seller) }}
                     >
                        {point.seller.full_name
                           .split(" ")
                           .map((n) => n[0])
                           .join("")
                           .toUpperCase()}
                     </div>
                  )}
                  <div>
                     <div className="font-medium text-gray-800">{point.seller.full_name}</div>
                     <div className="text-xs text-gray-600 flex items-center">
                        <span>{point.seller.position}</span>
                        <span className="mx-1">•</span>
                        <span>{point.seller.department}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-3 mb-4">
               <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">{point.visits.total}</div>
                  <div className="text-xs text-gray-600">Visitas totales</div>
               </div>
               <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">{point.last_distribution.quantity}</div>
                  <div className="text-xs text-gray-600">Última distribución</div>
               </div>
            </div>

            {/* Detalles de visitas */}
            <div className="mb-4">
               <h4 className="font-semibold text-gray-700 mb-2">Tipo de visitas</h4>
               <div className="space-y-2">
                  {Object.entries(point.visits.by_type).map(([type, count]) => (
                     <div key={type} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{type}</span>
                        <span className="font-medium">{count}</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Inventario */}
            {point.inventory && point.inventory.length > 0 && (
               <div className="mb-3">
                  <h4 className="font-semibold text-gray-700 mb-2">Inventario</h4>
                  <div className="max-h-32 overflow-y-auto">
                     {point.inventory.map((item, index) => (
                        <div key={index} className="text-sm text-gray-600 mb-1">
                           {item.product_name} - {item.quantity} unidades
                           {item.status && (
                              <span
                                 className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                    item.status === "Activado"
                                       ? "bg-green-100 text-green-800"
                                       : item.status === "Distribuido"
                                       ? "bg-blue-100 text-blue-800"
                                       : item.status === "Asignado"
                                       ? "bg-yellow-100 text-yellow-800"
                                       : "bg-purple-100 text-purple-800"
                                 }`}
                              >
                                 {item.status}
                              </span>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Última distribución */}
            <div className="text-xs text-gray-500 border-t pt-2">Última visita: {new Date(point.last_distribution.date).toLocaleDateString("es-MX")}</div>
         </div>
      );
   };

   // Renderizar marcador personalizado
   const renderCustomMarker = (point: PointOfSale) => {
      const pinColor = getPinColor(point.seller);
      const isSelected = selectedPoint?.id === point.id;
      const isHovered = hoveredPoint?.id === point.id;

      return (
         <Marker
            key={point.id}
            longitude={point.lon}
            latitude={point.lat}
            anchor="bottom"
            onClick={(e) => {
               e.originalEvent.stopPropagation();
               setSelectedPoint(point);
            }}
            onMouseEnter={() => setHoveredPoint(point)}
            onMouseLeave={() => setHoveredPoint(null)}
         >
            <div className="relative">
               {/* Pin principal */}
               <div
                  className={`relative transition-all duration-200 ${isSelected ? "scale-125" : isHovered ? "scale-110" : "scale-100"}`}
                  style={{
                     filter: `drop-shadow(0 2px 4px ${pinColor}40)`
                  }}
               >
                  <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M16 0C10.477 0 6 4.477 6 10C6 17 16 28 16 28C16 28 26 17 26 10C26 4.477 21.523 0 16 0Z" fill={pinColor} stroke="white" strokeWidth="2" />
                     <circle cx="16" cy="11" r="5" fill="white" />
                     {point.visits.total > 0 && <circle cx="24" cy="4" r="6" fill="#EF4444" stroke="white" strokeWidth="2" />}
                  </svg>

                  {/* Indicador de visitas */}
                  {point.visits.total > 0 && (
                     <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                        {point.visits.total > 9 ? "9+" : point.visits.total}
                     </div>
                  )}
               </div>

               {/* Tooltip al hacer hover */}
               {isHovered && !isSelected && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                     <div className="bg-white rounded-lg shadow-lg p-3 min-w-max">
                        <div className="font-semibold text-gray-800">{point.name}</div>
                        <div className="text-sm text-gray-600">{point.seller.full_name}</div>
                        <div className="text-xs text-gray-500">Visitas: {point.visits.total}</div>
                     </div>
                     <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white mx-auto"></div>
                  </div>
               )}
            </div>
         </Marker>
      );
   };

   // Panel lateral de estadísticas
   const renderSidePanel = () => {
      return (
         <div className="absolute top-4 right-4 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-10">
            {/* Header del panel */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
               <h2 className="text-xl font-bold">Mapa de Puntos de Venta</h2>
               <p className="text-blue-100 text-sm mt-1">
                  {stats.totalPoints} puntos • {stats.totalVisits} visitas
               </p>
            </div>

            {/* Filtro por vendedor */}
            <div className="p-4 border-b">
               <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por vendedor</label>
               <select
                  value={filterSeller}
                  onChange={(e) => setFilterSeller(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               >
                  <option value="all">Todos los vendedores</option>
                  {sellers.map((seller) => (
                     <option key={seller.id} value={seller.id}>
                        {seller.full_name}
                     </option>
                  ))}
               </select>
            </div>

            {/* Estadísticas */}
            <div className="p-4">
               <h3 className="font-semibold text-gray-700 mb-3">Estadísticas</h3>
               <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                     <div className="text-2xl font-bold text-blue-600">{stats.distributionVisits}</div>
                     <div className="text-xs text-gray-600">Visitas de distribución</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                     <div className="text-2xl font-bold text-green-600">{stats.monitoringVisits}</div>
                     <div className="text-xs text-gray-600">Visitas de monitoreo</div>
                  </div>
               </div>

               {/* Distribución por vendedor */}
               <div>
                  <h4 className="font-medium text-gray-700 mb-2">Puntos por vendedor</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                     {Object.entries(stats.sellerStats).map(([sellerName, count]) => {
                        const seller = sellers.find((s) => s.full_name === sellerName);
                        const color = seller?.pin_color || "#3B82F6";

                        return (
                           <div key={sellerName} className="flex items-center justify-between">
                              <div className="flex items-center">
                                 <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                                 <span className="text-sm text-gray-600 truncate">{sellerName}</span>
                              </div>
                              <span className="font-medium">{count}</span>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>

            {/* Indicadores */}
            <div className="p-4 border-t bg-gray-50">
               <h4 className="font-medium text-gray-700 mb-2">Leyenda</h4>
               <div className="space-y-2">
                  <div className="flex items-center">
                     <div className="w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center mr-2">#</div>
                     <span className="text-sm text-gray-600">Número de visitas</span>
                  </div>
                  <div className="flex items-center">
                     <svg width="20" height="25" viewBox="0 0 32 40" className="mr-2">
                        <path
                           d="M16 0C10.477 0 6 4.477 6 10C6 17 16 28 16 28C16 28 26 17 26 10C26 4.477 21.523 0 16 0Z"
                           fill="#3B82F6"
                           stroke="white"
                           strokeWidth="2"
                        />
                     </svg>
                     <span className="text-sm text-gray-600">Color = Vendedor asignado</span>
                  </div>
               </div>
            </div>
         </div>
      );
   };

   return (
      <div className="relative w-full h-screen">
         {/* Mapa */}
         <ReactMap
            // initialViewState={{
            //    longitude: -103.45,
            //    latitude: 25.54,
            //    zoom: 10
            // }}
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            ref={mapRef}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://demotiles.maplibre.org/style.json"
            // mapStyle={stylesMap}
            onLoad={() => setMapLoaded(true)}
         >
            {/* Controles del mapa */}
            <NavigationControl position="top-left" />
            <ScaleControl position="bottom-left" />

            {/* Marcadores */}
            {filteredPoints.map((point) => renderCustomMarker(point))}

            {/* Popup para punto seleccionado */}
            {selectedPoint && (
               <Popup
                  longitude={selectedPoint.lon}
                  latitude={selectedPoint.lat}
                  anchor="top"
                  onClose={() => setSelectedPoint(null)}
                  closeButton={true}
                  closeOnClick={false}
                  className="maplibregl-popup"
               >
                  {renderPopupContent(selectedPoint)}
               </Popup>
            )}
         </ReactMap>

         {/* Panel lateral */}
         {renderSidePanel()}

         {/* Botón de centrar */}
         <button
            onClick={() => {
               if (mapRef.current && pointsOfSale.length > 0) {
                  const bounds = new maplibregl.LngLatBounds();
                  filteredPoints.forEach((point) => {
                     bounds.extend([point.lon, point.lat]);
                  });
                  mapRef.current.fitBounds(bounds, {
                     padding: { top: 50, bottom: 50, left: 50, right: 350 },
                     duration: 1000
                  });
               }
            }}
            className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
            title="Centrar mapa"
         >
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
               <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
               />
            </svg>
         </button>

         {/* Contador de puntos visibles */}
         <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-sm text-gray-600">
               Mostrando <span className="font-bold text-blue-600">{filteredPoints.length}</span> de {pointsOfSale.length} puntos
            </div>
            {filterSeller !== "all" && (
               <div className="text-xs text-gray-500 mt-1">Filtrado por: {sellers.find((s) => s.id === parseInt(filterSeller))?.full_name}</div>
            )}
         </div>

         {/* Estilos personalizados */}
         <style>{`
        .maplibregl-popup .maplibregl-popup-content {
          padding: 0 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
        }
        
        .maplibregl-popup .maplibregl-popup-close-button {
          font-size: 18px !important;
          padding: 6px !important;
          color: #6b7280 !important;
        }
        
        .maplibregl-popup .maplibregl-popup-close-button:hover {
          color: #374151 !important;
          background-color: transparent !important;
        }
        
        .maplibregl-ctrl-top-left {
          top: 80px !important;
          left: 10px !important;
        }
        
        .maplibregl-ctrl-bottom-left {
          left: 10px !important;
        }
      `}</style>
      </div>
   );
};

export default SalesMap;
