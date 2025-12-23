// components/PointsOfSaleMap.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Box, Typography, Chip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
   iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

interface PointOfSale {
   id: number;
   name: string;
   lat: number;
   lng: number;
   address: string;
   inventory_count: number;
   activated_count: number;
   portado_count: number;
   last_visit: string | null;
   last_seller: string | null;
   seller_color: string;
   visits: number;
}

interface PointsOfSaleMapProps {
   points: PointOfSale[];
   onPointClick: (point: PointOfSale) => void;
}

const PointsOfSaleMap: React.FC<PointsOfSaleMapProps> = ({ points, onPointClick }) => {
   const center = points.length > 0 ? [points[0].lat, points[0].lng] : [19.4326, -99.1332]; // CDMX como fallback

   const getMarkerColor = (point: PointOfSale) => {
      if (point.portado_count > 10) return "#ef4444"; // rojo
      if (point.activated_count > 5) return "#f59e0b"; // amarillo
      return "#10b981"; // verde
   };

   return (
      <Box sx={{ height: "500px", width: "100%", position: "relative" }}>
         <MapContainer center={center as [number, number]} zoom={10} style={{ height: "100%", width: "100%", borderRadius: "8px" }}>
            <TileLayer
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {points.map((point) => (
               <CircleMarker
                  key={point.id}
                  center={[point.lat, point.lng]}
                  radius={15 + point.inventory_count / 10}
                  pathOptions={{
                     fillColor: point.seller_color || getMarkerColor(point),
                     color: "#000",
                     weight: 1,
                     opacity: 0.8,
                     fillOpacity: 0.6
                  }}
                  eventHandlers={{
                     click: () => onPointClick(point)
                  }}
               >
                  <Popup>
                     <Box sx={{ p: 1, minWidth: "200px" }}>
                        <Typography variant="h6" gutterBottom>
                           <LocationOnIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                           {point.name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                           {point.address}
                        </Typography>

                        <Box sx={{ mt: 2 }}>
                           <Chip label={`Inventario: ${point.inventory_count}`} size="small" sx={{ mr: 1, mb: 1 }} />
                           <Chip label={`Activados: ${point.activated_count}`} color="success" size="small" sx={{ mr: 1, mb: 1 }} />
                           <Chip label={`Portados: ${point.portado_count}`} color="warning" size="small" sx={{ mr: 1, mb: 1 }} />
                        </Box>

                        <Typography variant="body2" sx={{ mt: 2 }}>
                           <strong>Última visita:</strong> {point.last_visit ? new Date(point.last_visit).toLocaleDateString() : "N/A"}
                        </Typography>
                        <Typography variant="body2">
                           <strong>Vendedor:</strong> {point.last_seller || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                           <strong>Total visitas:</strong> {point.visits}
                        </Typography>
                     </Box>
                  </Popup>
               </CircleMarker>
            ))}
         </MapContainer>
      </Box>
   );
};

export default PointsOfSaleMap;
