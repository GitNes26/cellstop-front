import React, { useState, useMemo, useCallback, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import {
   MapPin,
   Store,
   User,
   Calendar,
   Clock,
   Phone,
   Map as MapIcon,
   CheckCircle,
   XCircle,
   AlertCircle,
   TrendingUp,
   TrendingDown,
   ChevronRight,
   Menu,
   X,
   Filter,
   Search,
   Navigation,
   Layers,
   AlertTriangle
} from "lucide-react";
// import { format, isToday } from "date-fns";
import dayjs, { isToday } from "dayjs"; // o dayjs
import { FullscreenExitRounded, FullscreenRounded } from "@mui/icons-material";

// types.ts
export interface Seller {
   id: number;
   full_name: string;
   username: string;
   // ... otros campos
}

export interface Visit {
   id?: number;
   type: "Distribución" | "Monitoreo";
   date: string; // fecha de la visita
   // otros campos si existen
}

export interface PointOfSale {
   id: number;
   name: string;
   contact_name: string;
   contact_phone: string;
   address: string;
   lat: number;
   lon: number;
   ubication: string;
   seller: Seller;
   visits: {
      total: number;
      by_type: Record<string, number>;
      list?: Visit[]; // agregaremos lista si la API la proporciona
   };
   lastVisit?: Visit;
   hasTodayVisit?: boolean;
}

// Asumiendo que los datos vienen así:
// interface PointOfSaleData {
//    id: number;
//    name: string;
//    contact_name: string;
//    contact_phone: string;
//    address: string;
//    lat: number;
//    lon: number;
//    ubication: string;
//    seller: {
//       id: number;
//       full_name: string;
//       username: string;
//       // ...
//    };
//    visits: {
//       total: number;
//       by_type: {
//          Distribución?: number;
//          Monitoreo?: number;
//       };
//       list?: Array<{
//          type: string;
//          date: string;
//          // ...
//       }>;
//    };
// }

interface PointsOfSaleMapProps {
   pointsData?: PointOfSale[];
   onPointSelect?: (point: PointOfSale) => void;
}

const dataFake: PointOfSale[] = [
   {
      id: 1,
      name: "Electro Torreón",
      contact_name: "Jorge Martínez",
      contact_phone: "8711234567",
      address: "Blvd. Independencia 1500, Col. Centro, Torreón",
      lat: 25.5418,
      lon: -103.4498,
      ubication: "https://www.google.com/maps?q=25.5418,-103.4498",
      seller: {
         id: 18,
         full_name: "ALFREDO HERNANDEZ LOPEZ",
         username: "AlfredoHL"
      },
      visits: {
         total: 3,
         by_type: {
            Distribución: 2,
            Monitoreo: 1
         },
         list: [
            { date: "2026-04-06", type: "Distribución" },
            { date: "2026-04-01", type: "Monitoreo" },
            { date: "2026-03-28", type: "Distribución" }
         ]
         // last_visit_date: "2026-04-06"
      }
   },
   {
      id: 2,
      name: "Mega Celulares",
      contact_name: "Luis Ramírez",
      contact_phone: "8717654321",
      address: "Calz. Colón 321, Residencial La Rosita, Torreón",
      lat: 25.5289,
      lon: -103.4621,
      ubication: "https://www.google.com/maps?q=25.5289,-103.4621",
      seller: {
         id: 19,
         full_name: "JUAN PEREZ",
         username: "JuanP"
      },
      visits: {
         total: 1,
         by_type: {
            Distribución: 1,
            Monitoreo: 0
         },
         list: [{ date: "2026-04-06", type: "Distribución" }]
      }
      // last_visit_date: "2026-04-06"
   },
   {
      id: 3,
      name: "Innovación Móvil",
      contact_name: "Ana Torres",
      contact_phone: "8719988776",
      address: "Av. Juárez 789, Fracc. Los Ángeles, Torreón",
      lat: 25.5572,
      lon: -103.4352,
      ubication: "https://www.google.com/maps?q=25.5572,-103.4352",
      seller: {
         id: 20,
         full_name: "MARIA GONZALEZ",
         username: "MariaG"
      },
      visits: {
         total: 2,
         by_type: {
            Distribución: 1,
            Monitoreo: 1
         },
         list: [
            { date: "2026-04-06", type: "Monitoreo" },
            { date: "2026-03-30", type: "Distribución" }
         ]
         // last_visit_date: "2026-04-06"
      }
   },
   {
      id: 4,
      name: "Comunicaciones del Norte",
      contact_name: "Roberto Gómez",
      contact_phone: "8712345678",
      address: "Prol. Matamoros 234, Col. San Isidro, Torreón",
      lat: 25.5134,
      lon: -103.4756,
      ubication: "https://www.google.com/maps?q=25.5134,-103.4756",
      seller: {
         id: 21,
         full_name: "CARLOS RUIZ",
         username: "CarlosR"
      },
      visits: {
         total: 0,
         by_type: {
            Distribución: 0,
            Monitoreo: 0
         },
         list: []
         // last_visit_date: null
      }
   },
   {
      id: 5,
      name: "Chip Express",
      contact_name: "Mónica Flores",
      contact_phone: "8713456789",
      address: "Boulevard Constitución 1200, Col. Nueva Rosita, Torreón",
      lat: 25.5732,
      lon: -103.4189,
      ubication: "https://www.google.com/maps?q=25.5732,-103.4189",
      seller: {
         id: 18,
         full_name: "ALFREDO HERNANDEZ LOPEZ",
         username: "AlfredoHL"
      },
      visits: {
         total: 4,
         by_type: {
            Distribución: 3,
            Monitoreo: 1
         },
         list: [
            { date: "2026-04-06", type: "Distribución" },
            { date: "2026-04-03", type: "Monitoreo" },
            { date: "2026-04-01", type: "Distribución" },
            { date: "2026-03-28", type: "Distribución" }
         ]
         // last_visit_date: "2026-04-06"
      }
   },
   {
      id: 6,
      name: "Tienda Digital",
      contact_name: "Fernanda López",
      contact_phone: "8714567890",
      address: "Calle Ocampo 456, Col. Centro, Torreón",
      lat: 25.5382,
      lon: -103.4545,
      ubication: "https://www.google.com/maps?q=25.5382,-103.4545",
      seller: {
         id: 22,
         full_name: "LAURA MENDOZA",
         username: "LauraM"
      },
      visits: {
         total: 2,
         by_type: {
            Distribución: 0,
            Monitoreo: 2
         },
         list: [
            { date: "2026-04-04", type: "Monitoreo" },
            { date: "2026-03-31", type: "Monitoreo" }
         ]
         // last_visit_date: "2026-04-04"
      }
   },
   {
      id: 7,
      name: "Mundo SIM",
      contact_name: "David Sánchez",
      contact_phone: "8715678901",
      address: "Av. Allende 789, Col. Primero de Mayo, Torreón",
      lat: 25.5485,
      lon: -103.4421,
      ubication: "https://www.google.com/maps?q=25.5485,-103.4421",
      seller: {
         id: 19,
         full_name: "JUAN PEREZ",
         username: "JuanP"
      },
      visits: {
         total: 1,
         by_type: {
            Distribución: 1,
            Monitoreo: 0
         },
         list: [{ date: "2026-04-06", type: "Distribución" }]
         // last_visit_date: "2026-04-06"
      }
   },
   {
      id: 8,
      name: "Conexión Móvil",
      contact_name: "Sofía Vargas",
      contact_phone: "8716789012",
      address: "Blvd. Rodríguez Triana 321, Col. Los Ángeles, Torreón",
      lat: 25.5621,
      lon: -103.4287,
      ubication: "https://www.google.com/maps?q=25.5621,-103.4287",
      seller: {
         id: 20,
         full_name: "MARIA GONZALEZ",
         username: "MariaG"
      },
      visits: {
         total: 0,
         by_type: {
            Distribución: 0,
            Monitoreo: 0
         },
         list: []
         // last_visit_date: null
      }
   },
   {
      id: 9,
      name: "TecnoChip",
      contact_name: "Oscar Herrera",
      contact_phone: "8717890123",
      address: "Calle Morelos 567, Col. Nueva Laguna, Torreón",
      lat: 25.5245,
      lon: -103.4689,
      ubication: "https://www.google.com/maps?q=25.5245,-103.4689",
      seller: {
         id: 21,
         full_name: "CARLOS RUIZ",
         username: "CarlosR"
      },
      visits: {
         total: 3,
         by_type: {
            Distribución: 2,
            Monitoreo: 1
         },
         list: [
            { date: "2026-04-05", type: "Distribución" },
            { date: "2026-04-02", type: "Monitoreo" },
            { date: "2026-03-29", type: "Distribución" }
         ]
         // last_visit_date: "2026-04-05"
      }
   },
   {
      id: 10,
      name: "Global SIM",
      contact_name: "Patricia Navarro",
      contact_phone: "8718901234",
      address: "Av. Hidalgo 890, Col. La Rosita, Torreón",
      lat: 25.5367,
      lon: -103.4598,
      ubication: "https://www.google.com/maps?q=25.5367,-103.4598",
      seller: {
         id: 18,
         full_name: "ALFREDO HERNANDEZ LOPEZ",
         username: "AlfredoHL"
      },
      visits: {
         total: 2,
         by_type: {
            Distribución: 1,
            Monitoreo: 1
         },
         list: [
            { date: "2026-04-06", type: "Monitoreo" },
            { date: "2026-04-01", type: "Distribución" }
         ]
         // last_visit_date: "2026-04-06"
      }
   },
   {
      id: 11,
      name: "SIM Express",
      contact_name: "Alejandro Domínguez",
      contact_phone: "8719012345",
      address: "Calzada de los Deportes 123, Col. Deportiva, Torreón",
      lat: 25.5551,
      lon: -103.4102,
      ubication: "https://www.google.com/maps?q=25.5551,-103.4102",
      seller: {
         id: 22,
         full_name: "LAURA MENDOZA",
         username: "LauraM"
      },
      visits: {
         total: 1,
         by_type: {
            Distribución: 0,
            Monitoreo: 1
         },
         list: [{ date: "2026-04-03", type: "Monitoreo" }]
         // last_visit_date: "2026-04-03"
      }
   },
   {
      id: 12,
      name: "Telecomunicaciones Laguna",
      contact_name: "Verónica Luna",
      contact_phone: "8710123456",
      address: "Blvd. Ejército Mexicano 456, Col. Los Nogales, Torreón",
      lat: 25.5463,
      lon: -103.4476,
      ubication: "https://www.google.com/maps?q=25.5463,-103.4476",
      seller: {
         id: 19,
         full_name: "JUAN PEREZ",
         username: "JuanP"
      },
      visits: {
         total: 0,
         by_type: {
            Distribución: 0,
            Monitoreo: 0
         },
         list: []
         // last_visit_date: null
      }
   },
   {
      id: 13,
      name: "Smartphone Center",
      contact_name: "Ricardo Chávez",
      contact_phone: "8711234560",
      address: "Paseo del Tecnológico 789, Col. Valle Verde, Torreón",
      lat: 25.5832,
      lon: -103.4224,
      ubication: "https://www.google.com/maps?q=25.5832,-103.4224",
      seller: {
         id: 20,
         full_name: "MARIA GONZALEZ",
         username: "MariaG"
      },
      visits: {
         total: 2,
         by_type: {
            Distribución: 2,
            Monitoreo: 0
         },
         list: [
            { date: "2026-04-06", type: "Distribución" },
            { date: "2026-04-02", type: "Distribución" }
         ]
         // last_visit_date: "2026-04-06"
      }
   },
   {
      id: 14,
      name: "DataCell",
      contact_name: "Gabriela Castro",
      contact_phone: "8712345671",
      address: "Calle Francisco I. Madero 321, Col. Obrera, Torreón",
      lat: 25.5312,
      lon: -103.4712,
      ubication: "https://www.google.com/maps?q=25.5312,-103.4712",
      seller: {
         id: 21,
         full_name: "CARLOS RUIZ",
         username: "CarlosR"
      },
      visits: {
         total: 1,
         by_type: {
            Distribución: 1,
            Monitoreo: 0
         },
         list: [{ date: "2026-04-04", type: "Distribución" }]
         // last_visit_date: "2026-04-04"
      }
   },
   {
      id: 15,
      name: "ChipStar",
      contact_name: "Eduardo Fuentes",
      contact_phone: "8713456782",
      address: "Av. Universidad 567, Col. Universidad, Torreón",
      lat: 25.5775,
      lon: -103.4059,
      ubication: "https://www.google.com/maps?q=25.5775,-103.4059",
      seller: {
         id: 18,
         full_name: "ALFREDO HERNANDEZ LOPEZ",
         username: "AlfredoHL"
      },
      visits: {
         total: 3,
         by_type: {
            Distribución: 2,
            Monitoreo: 1
         },
         list: [
            { date: "2026-04-05", type: "Monitoreo" },
            { date: "2026-04-03", type: "Distribución" },
            { date: "2026-03-30", type: "Distribución" }
         ]
         // last_visit_date: "2026-04-05"
      }
   },
   {
      id: 16,
      name: "Red Móvil",
      contact_name: "Silvia Guzmán",
      contact_phone: "8714567893",
      address: "Calzada San Ignacio 321, Col. San Ignacio, Torreón",
      lat: 25.5198,
      lon: -103.4789,
      ubication: "https://www.google.com/maps?q=25.5198,-103.4789",
      seller: {
         id: 22,
         full_name: "LAURA MENDOZA",
         username: "LauraM"
      },
      visits: {
         total: 0,
         by_type: {
            Distribución: 0,
            Monitoreo: 0
         },
         list: []
         // last_visit_date: null
      }
   },
   {
      id: 17,
      name: "Orange Chip",
      contact_name: "Alberto Sandoval",
      contact_phone: "8715678904",
      address: "Prol. Abasolo 987, Col. El Fresno, Torreón",
      lat: 25.5594,
      lon: -103.4382,
      ubication: "https://www.google.com/maps?q=25.5594,-103.4382",
      seller: {
         id: 19,
         full_name: "JUAN PEREZ",
         username: "JuanP"
      },
      visits: {
         total: 2,
         by_type: {
            Distribución: 1,
            Monitoreo: 1
         },
         list: [
            { date: "2026-04-06", type: "Distribución" },
            { date: "2026-03-31", type: "Monitoreo" }
         ]
         // last_visit_date: "2026-04-06"
      }
   },
   {
      id: 18,
      name: "Future Phone",
      contact_name: "Liliana Rangel",
      contact_phone: "8716789015",
      address: "Av. Revolución 456, Col. Revolución, Torreón",
      lat: 25.5442,
      lon: -103.4523,
      ubication: "https://www.google.com/maps?q=25.5442,-103.4523",
      seller: {
         id: 20,
         full_name: "MARIA GONZALEZ",
         username: "MariaG"
      },
      visits: {
         total: 1,
         by_type: {
            Distribución: 0,
            Monitoreo: 1
         },
         list: [{ date: "2026-04-05", type: "Monitoreo" }]
         // last_visit_date: "2026-04-05"
      }
   },
   {
      id: 19,
      name: "SIM Market",
      contact_name: "Rogelio Cárdenas",
      contact_phone: "8717890126",
      address: "Boulevard Laguna 123, Col. Laguna, Torreón",
      lat: 25.5638,
      lon: -103.4147,
      ubication: "https://www.google.com/maps?q=25.5638,-103.4147",
      seller: {
         id: 21,
         full_name: "CARLOS RUIZ",
         username: "CarlosR"
      },
      visits: {
         total: 2,
         by_type: {
            Distribución: 2,
            Monitoreo: 0
         },
         list: [
            { date: "2026-04-04", type: "Distribución" },
            { date: "2026-04-01", type: "Distribución" }
         ]
         // last_visit_date: "2026-04-04"
      }
   },
   {
      id: 20,
      name: "Cellular Pro",
      contact_name: "Martha Ibarra",
      contact_phone: "8718901237",
      address: "Calle Matamoros 890, Col. Centro, Torreón",
      lat: 25.5401,
      lon: -103.4567,
      ubication: "https://www.google.com/maps?q=25.5401,-103.4567",
      seller: {
         id: 18,
         full_name: "ALFREDO HERNANDEZ LOPEZ",
         username: "AlfredoHL"
      },
      visits: {
         total: 1,
         by_type: {
            Distribución: 1,
            Monitoreo: 0
         },
         list: [{ date: "2026-04-06", type: "Distribución" }]
         // last_visit_date: "2026-04-06"
      }
   }
];

const PointsOfSaleMap: React.FC<PointsOfSaleMapProps> = ({ pointsData = dataFake, onPointSelect }) => {
   const [selectedPoint, setSelectedPoint] = useState<PointOfSale | null>(null);
   const [popupVisible, setPopupVisible] = useState(false);
   const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [filterType, setFilterType] = useState<"all" | "withVisitToday" | "withoutVisitToday">("all");
   const [mapViewState, setMapViewState] = useState({
      longitude: -103.4586, // Torreón centro aproximado
      latitude: 25.5442,
      zoom: 12
   });
   const [isMobile, setIsMobile] = useState(false);
   const [isFullscreen, setIsFullscreen] = useState(false);

   // Función para alternar pantalla completa
   const toggleFullscreen = () => {
      setIsFullscreen(!isFullscreen);
   };

   useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 1024);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
   }, []);

   // Procesar datos: calcular si tiene visita hoy y última visita
   const processedPoints = useMemo(() => {
      return pointsData.map((point) => {
         const visitsList = point.visits.list || [];
         const lastVisit = visitsList.length ? visitsList.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())[0] : null;
         const hasTodayVisit = visitsList.some((v) => dayjs(v.date).isToday());
         // const lastVisit = visitsList.length ? viscitsList.sort((a, b) => dayjs(b.date).getTime() - dayjs(a.date).getTime())[0] : null;
         // const hasTodayVisit = visitsList.some((v) => dayjs(v.date).isSame(dayjs(), "day"));
         point.lastVisit = lastVisit;
         point.hasTodayVisit = hasTodayVisit;
         return {
            ...point,
            lastVisit,
            hasTodayVisit
         };
      });
   }, [pointsData]);

   // Filtrar puntos según búsqueda y filtro de visita
   const filteredPoints = useMemo(() => {
      let filtered = processedPoints;
      if (searchTerm) {
         const term = searchTerm.toLowerCase();
         filtered = filtered.filter(
            (p) => p.name.toLowerCase().includes(term) || p.seller.full_name.toLowerCase().includes(term) || p.address.toLowerCase().includes(term)
         );
      }
      if (filterType === "withVisitToday") {
         filtered = filtered.filter((p) => p.hasTodayVisit);
      } else if (filterType === "withoutVisitToday") {
         filtered = filtered.filter((p) => !p.hasTodayVisit);
      }
      return filtered;
   }, [processedPoints, searchTerm, filterType]);

   // Color del marcador según estado de visita hoy
   const getMarkerColor = (point: any) => {
      if (point.hasTodayVisit) return "#10b981"; // verde
      return "#ef4444"; // rojo (pendiente)
   };

   const handleMarkerClick = (point: any) => {
      setSelectedPoint(point);
      setPopupVisible(true);
      // Mover mapa al punto
      setMapViewState({
         longitude: point.lon,
         latitude: point.lat,
         zoom: 14
      });
      if (isMobile) setMobilePanelOpen(false);
      onPointSelect?.(point);
   };

   const handleClosePopup = () => setPopupVisible(false);
   const handleClosePanel = () => {
      setSelectedPoint(null);
      setPopupVisible(false);
      if (isMobile) setMobilePanelOpen(false);
   };

   const openPointDetail = (point: any) => {
      setSelectedPoint(point);
      if (isMobile) setMobilePanelOpen(true);
      else setPopupVisible(true);
      setMapViewState({ longitude: point.lon, latitude: point.lat, zoom: 14 });
   };

   return (
      <div className={`flex flex-col bg-gray-900 ${isFullscreen ? "fixed inset-0 z-50 top-16 left-16" : "h-screen"}`}>
         {/* Header */}
         <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-800 to-indigo-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <button
                  onClick={toggleFullscreen}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                  title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
               >
                  {isFullscreen ? <FullscreenExitRounded className="w-5 h-5 text-blue-200" /> : <FullscreenRounded className="w-5 h-5 text-blue-200" />}
               </button>
               <div className="p-2 bg-white/10 rounded-lg">
                  <Store className="w-6 h-6 text-blue-200" />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-white">Mapa de Puntos de Venta</h2>
                  <p className="text-blue-200 text-sm">
                     {filteredPoints.length} puntos activos • {processedPoints.filter((p) => !p.hasTodayVisit).length} pendientes de visita hoy
                  </p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               {/* Selector de filtro */}
               <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
               >
                  <option className="text-black" value="all">
                     Todos
                  </option>
                  <option className="text-black" value="withVisitToday">
                     Con visita hoy
                  </option>
                  <option className="text-black" value="withoutVisitToday">
                     Sin visita hoy
                  </option>
               </select>
               <div className="relative hidden sm:block">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                     type="text"
                     placeholder="Buscar punto, vendedor..."
                     className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               {isMobile && (
                  <button onClick={() => setMobilePanelOpen(true)} className="p-2 bg-white/10 rounded-lg">
                     <Menu className="w-5 h-5 text-white" />
                  </button>
               )}
            </div>
         </div>

         {/* Búsqueda móvil */}
         {isMobile && (
            <div className="p-3 bg-gray-800 border-b border-gray-700">
               <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                     type="text"
                     placeholder="Buscar..."
                     className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>
         )}

         {/* Contenedor principal */}
         <div className="flex-1 flex flex-col lg:flex-row min-h-0">
            {/* Panel lateral desktop */}
            {!isMobile && (
               <div className="w-96 border-r border-gray-700 bg-gray-950 overflow-y-auto flex-shrink-0">
                  {selectedPoint ? (
                     <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-gray-700 bg-gray-800">
                           <div className="flex justify-between items-start">
                              <div>
                                 <h3 className="font-bold text-lg text-blue-300">{selectedPoint.name}</h3>
                                 <p className="text-gray-400 text-sm">{selectedPoint.address}</p>
                              </div>
                              <button onClick={handleClosePanel} className="text-gray-400 hover:text-white">
                                 <X className="w-5 h-5" />
                              </button>
                           </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                           {/* Información del punto */}
                           <div className="bg-gray-800/50 rounded-lg p-3">
                              <h4 className="font-semibold text-gray-300 mb-2">Información general</h4>
                              <div className="space-y-2 text-sm">
                                 <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-300">Contacto: {selectedPoint.contact_name}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-300">{selectedPoint.contact_phone}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Navigation className="w-4 h-4 text-gray-400" />
                                    <a href={selectedPoint.ubication} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                       Ver en Google Maps
                                    </a>
                                 </div>
                              </div>
                           </div>

                           {/* Vendedor */}
                           <div className="bg-gray-800/50 rounded-lg p-3">
                              <h4 className="font-semibold text-gray-300 mb-2">Vendedor asignado</h4>
                              <div className="flex items-center gap-2">
                                 <User className="w-4 h-4 text-gray-400" />
                                 <span className="text-gray-300">{selectedPoint.seller.full_name}</span>
                              </div>
                           </div>

                           {/* Visitas */}
                           <div className="bg-gray-800/50 rounded-lg p-3">
                              <div className="flex justify-between items-center mb-2">
                                 <h4 className="font-semibold text-gray-300">Visitas</h4>
                                 <span className="text-sm text-gray-400">Total: {selectedPoint.visits.total}</span>
                              </div>
                              <div className="flex gap-3 mb-3">
                                 <div className="flex-1 text-center p-2 bg-blue-500/20 rounded-lg">
                                    <div className="text-lg font-bold text-blue-300">{selectedPoint.visits.by_type.Distribución || 0}</div>
                                    <div className="text-xs text-gray-400">Distribución</div>
                                 </div>
                                 <div className="flex-1 text-center p-2 bg-purple-500/20 rounded-lg">
                                    <div className="text-lg font-bold text-purple-300">{selectedPoint.visits.by_type.Monitoreo || 0}</div>
                                    <div className="text-xs text-gray-400">Monitoreo</div>
                                 </div>
                              </div>
                              {selectedPoint.hasTodayVisit ? (
                                 <div className="flex items-center gap-2 text-green-400 bg-green-500/10 p-2 rounded-lg">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm">Visita registrada hoy</span>
                                 </div>
                              ) : (
                                 <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-2 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">Sin visita hoy - pendiente</span>
                                 </div>
                              )}
                              {selectedPoint.lastVisit && (
                                 <div className="mt-3 pt-3 border-t border-gray-700">
                                    <div className="text-xs text-gray-400">Última visita:</div>
                                    <div className="flex items-center gap-2 text-sm text-gray-100">
                                       <Calendar className="w-3 h-3" />
                                       <span className="">{dayjs(selectedPoint.lastVisit.date).format("DD/MM/YYYY")}</span>
                                       <span className="">|</span>
                                       <span className="">{selectedPoint.lastVisit.type}</span>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  ) : (
                     // <div className="p-6 text-center">
                     //    <Store className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                     //    <p className="text-gray-400">Selecciona un punto en el mapa</p>
                     //    <p className="text-gray-500 text-sm mt-2">Para ver detalles y estado de visitas</p>
                     // </div>
                     // Dentro del bloque donde se muestra el panel vacío (cuando selectedLocation es null)
                     // Reemplaza el <div className="p-6 text-center">...</div> por lo siguiente:

                     <div className="p-6">
                        {/* Tarjeta de bienvenida / resumen */}
                        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl p-5 mb-6">
                           <div className="flex items-center gap-3 mb-3">
                              <Store className="w-8 h-8 text-blue-400" />
                              <h3 className="text-xl font-bold text-white">Red de Puntos de Venta</h3>
                           </div>
                           <p className="text-gray-300 text-sm">
                              Monitoreo de distribución de chips en Torreón, Coahuila. Selecciona un marcador en el mapa para ver detalles completos.
                           </p>
                        </div>

                        {/* Estadísticas rápidas */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                           <div className="bg-gray-800/40 rounded-xl p-3 text-center">
                              <div className="text-2xl font-bold text-blue-400">{filteredPoints.length}</div>
                              <div className="text-xs text-gray-400">Puntos de venta</div>
                           </div>
                           <div className="bg-gray-800/40 rounded-xl p-3 text-center">
                              <div className="text-2xl font-bold text-purple-400">{new Set(pointsData.map((p) => p.seller?.id).filter(Boolean)).size}</div>
                              <div className="text-xs text-gray-400">Vendedores activos</div>
                           </div>
                        </div>

                        {/* Visitas de hoy */}
                        {(() => {
                           const today = new Date().toISOString().slice(0, 10);
                           const visitsToday = pointsData.flatMap(
                              (p) => p.visits.list?.filter((v) => v.date === today).map((v) => ({ ...v, pointName: p.name, pointId: p.id })) || []
                           );
                           const distributionToday = visitsToday.filter((v) => v.type === "Distribución").length;
                           const monitoringToday = visitsToday.filter((v) => v.type === "Monitoreo").length;
                           const pointsWithoutVisit = pointsData.filter((p) => !p.visits.list?.some((v) => v.date === today)).length;

                           return (
                              <div className="bg-gray-800/40 rounded-xl p-4 mb-6">
                                 <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Actividad del día
                                 </h4>
                                 <div className="space-y-2 text-gray-100">
                                    <div className="flex justify-between items-center">
                                       <span className="text-sm text-gray-400">Visitas hoy:</span>
                                       <span className="text-lg font-bold text-white">{visitsToday.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                       <span className="flex items-center gap-1">
                                          <div className="w-2 h-2 rounded-full bg-green-500"></div> Distribución
                                       </span>
                                       <span className="font-semibold text-green-400">{distributionToday}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                       <span className="flex items-center gap-1">
                                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Monitoreo
                                       </span>
                                       <span className="font-semibold text-yellow-400">{monitoringToday}</span>
                                    </div>
                                    <div className="pt-2 mt-2 border-t border-gray-700 flex justify-between items-center">
                                       <span className="text-sm text-gray-400">Puntos pendientes:</span>
                                       <span className={`font-semibold ${pointsWithoutVisit > 0 ? "text-amber-400" : "text-green-400"}`}>{pointsWithoutVisit}</span>
                                    </div>
                                    {/* Barra de progreso */}
                                    <div className="mt-2">
                                       <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                          <div
                                             className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                                             style={{ width: `${(visitsToday.length / filteredPoints.length) * 100}%` }}
                                          />
                                       </div>
                                       <div className="flex justify-between text-xs text-gray-500 mt-1">
                                          <span>Progreso</span>
                                          <span>{Math.round((visitsToday.length / filteredPoints.length) * 100)}%</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           );
                        })()}

                        {/* Últimas visitas recientes */}
                        <div className="bg-gray-800/40 rounded-xl p-4">
                           <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Últimas visitas registradas
                           </h4>
                           <div className="space-y-2 max-h-48 overflow-y-auto">
                              {(() => {
                                 const allVisits = pointsData
                                    .flatMap((p) => (p.visits.list || []).map((v) => ({ ...v, pointName: p.name, seller: p.seller?.full_name || "N/A" })))
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                    .slice(0, 5);

                                 if (allVisits.length === 0) {
                                    return <p className="text-gray-500 text-sm text-center">No hay visitas registradas</p>;
                                 }

                                 return allVisits.map((visit, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                                       <div className="min-w-0 flex-1">
                                          <div className="text-sm font-medium text-white truncate">{visit.pointName}</div>
                                          <div className="text-xs text-gray-400">
                                             {visit.type} • {visit.seller}
                                          </div>
                                       </div>
                                       <div className="text-xs text-gray-400 flex-shrink-0 ml-2">{visit.date}</div>
                                    </div>
                                 ));
                              })()}
                           </div>
                        </div>

                        {/* Consejo rápido */}
                        <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                           <div className="flex items-center gap-2 text-blue-300 text-xs">
                              <AlertTriangle className="w-4 h-4" />
                              <span>Los puntos con anillo pulsante requieren atención – no han recibido visita hoy.</span>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            )}

            {/* Panel móvil overlay */}
            {isMobile && mobilePanelOpen && selectedPoint && (
               <div className="fixed inset-0 z-50 bg-black/70 flex">
                  <div className="w-4/5 max-w-sm bg-gray-900 h-full overflow-y-auto">
                     <div className="p-4 border-b border-gray-700 bg-blue-800 flex justify-between items-center">
                        <h3 className="font-bold text-white">Detalle del punto</h3>
                        <button onClick={() => setMobilePanelOpen(false)} className="text-white">
                           <X className="w-6 h-6" />
                        </button>
                     </div>
                     <div className="p-4 space-y-4">
                        {/* Mismo contenido que panel desktop, simplificado */}
                        <div>
                           <h4 className="font-semibold text-white">{selectedPoint.name}</h4>
                           <p className="text-gray-400 text-sm">{selectedPoint.address}</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-3">
                           <div className="flex items-center gap-2 text-gray-300">
                              <User className="w-4 h-4" />
                              <span>{selectedPoint.contact_name}</span>
                           </div>
                           <div className="flex items-center gap-2 text-gray-300 mt-1">
                              <Phone className="w-4 h-4" />
                              <span>{selectedPoint.contact_phone}</span>
                           </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-3">
                           <div className="flex justify-between">
                              <span className="text-gray-300">Vendedor:</span>
                              <span className="text-white">{selectedPoint.seller.full_name}</span>
                           </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-3">
                           <div className="flex justify-between items-center">
                              <span className="text-gray-300">Visitas hoy:</span>
                              {selectedPoint.hasTodayVisit ? (
                                 <span className="text-green-400 flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Sí
                                 </span>
                              ) : (
                                 <span className="text-red-400 flex items-center gap-1">
                                    <XCircle className="w-4 h-4" /> No
                                 </span>
                              )}
                           </div>
                           <div className="flex justify-between mt-2">
                              <span className="text-gray-300">Total visitas:</span>
                              <span className="text-white">{selectedPoint.visits.total}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex-1" onClick={() => setMobilePanelOpen(false)}></div>
               </div>
            )}

            {/* Mapa */}
            <div className="flex-1 relative min-h-[500px]">
               <Map
                  {...mapViewState}
                  onMove={(evt) => setMapViewState(evt.viewState)}
                  style={{ width: "100%", height: "100%" }}
                  mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
               >
                  {filteredPoints.map((point) => (
                     <Marker key={point.id} longitude={point.lon} latitude={point.lat}>
                        <div className="cursor-pointer transition-all duration-300 hover:scale-125 relative group" onClick={() => handleMarkerClick(point)}>
                           <div
                              className="w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center"
                              style={{
                                 background: `radial-gradient(circle at 30% 30%, ${getMarkerColor(point)} 0%, #1f2937 80%)`,
                                 boxShadow: `0 0 0 2px ${getMarkerColor(point)}40`
                              }}
                           >
                              <Store className="w-4 h-4 text-white" />
                           </div>
                           {!point.hasTodayVisit && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>}
                        </div>
                     </Marker>
                  ))}

                  {popupVisible && selectedPoint && (
                     <Popup
                        longitude={selectedPoint.lon}
                        latitude={selectedPoint.lat}
                        anchor="top"
                        onClose={handleClosePopup}
                        closeButton={true}
                        closeOnClick={false}
                        className="custom-popup !bg-gray-900 !text-white !rounded-xl !shadow-2xl !border !border-gray-700"
                        maxWidth="280px"
                     >
                        <div className="p-3">
                           <h4 className="font-bold text-blue-300 text-sm mb-1">{selectedPoint.name}</h4>
                           <p className="text-gray-400 text-xs truncate">{selectedPoint.address}</p>
                           <div className="mt-2 flex justify-between items-center text-xs">
                              <div className="flex items-center gap-1 text-gray-800">
                                 <User className="w-3 h-3" />
                                 <span>{selectedPoint.seller.full_name}</span>
                              </div>
                              {selectedPoint.hasTodayVisit ? (
                                 <span className="text-green-400 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Visita hoy
                                 </span>
                              ) : (
                                 <span className="text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Pendiente
                                 </span>
                              )}
                           </div>
                           <button
                              onClick={() => openPointDetail(selectedPoint)}
                              className="mt-2 w-full text-center text-blue-400 text-xs hover:cursor-pointer hover:text-blue-300 flex items-center justify-center gap-1"
                           >
                              Ver detalles <ChevronRight className="w-3 h-3" />
                           </button>
                        </div>
                     </Popup>
                  )}
               </Map>

               {/* Botón para centrar en Torreón */}
               <button
                  onClick={() => setMapViewState({ longitude: -103.4586, latitude: 25.5442, zoom: 12 })}
                  className="absolute bottom-4 right-4 bg-gray-800 hover:bg-gray-700 p-2 rounded-lg shadow-lg z-10"
               >
                  <Navigation className="w-5 h-5 text-white" />
               </button>
            </div>
         </div>
      </div>
   );
};

export default PointsOfSaleMap;
