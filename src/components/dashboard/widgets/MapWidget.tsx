// components/dashboard/widgets/MapWidget.tsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
   iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

export interface PointOfSale {
   id: number;
   name: string;
   latitude: number;
   longitude: number;
   salesCount: number;
   productsCount: number;
   type: "high" | "medium" | "low";
}

export interface MapWidgetProps {
   title: string;
   pointsOfSale: PointOfSale[];
   center?: [number, number];
   zoom?: number;
   height?: number;
}

export const MapWidget: React.FC<MapWidgetProps> = ({
   title,
   pointsOfSale,
   center = [19.4326, -99.1332], // Default to Mexico City
   zoom = 11,
   height = 400
}) => {
   const getCircleColor = (type: string) => {
      switch (type) {
         case "high":
            return "#e53e3e";
         case "medium":
            return "#d69e2e";
         case "low":
            return "#38a169";
         default:
            return "#4299e1";
      }
   };

   const getCircleRadius = (salesCount: number) => {
      return Math.min(Math.max(salesCount * 50, 500), 2000);
   };

   return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
         <Card
            sx={{
               height: "100%",
               background: "rgba(255, 255, 255, 0.9)",
               backdropFilter: "blur(10px)"
            }}
         >
            <CardContent sx={{ p: 0, height: "100%" }}>
               {/* Header */}
               <Box sx={{ p: 3, pb: 2 }}>
                  <Typography variant="h6" fontWeight="700" gutterBottom>
                     {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Distribución geográfica de puntos de venta
                  </Typography>
               </Box>

               {/* Map */}
               <Box sx={{ height: `${height}px`, borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
                  <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
                     <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                     />

                     {pointsOfSale.map((point) => (
                        <React.Fragment key={point.id}>
                           <Circle
                              center={[point.latitude, point.longitude]}
                              radius={getCircleRadius(point.salesCount)}
                              pathOptions={{
                                 fillColor: getCircleColor(point.type),
                                 fillOpacity: 0.1,
                                 color: getCircleColor(point.type),
                                 opacity: 0.3,
                                 weight: 2
                              }}
                           />
                           <Marker position={[point.latitude, point.longitude]}>
                              <Popup>
                                 <Box sx={{ p: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="600">
                                       {point.name}
                                    </Typography>
                                    <Typography variant="body2">Ventas: {point.salesCount}</Typography>
                                    <Typography variant="body2">Productos: {point.productsCount}</Typography>
                                 </Box>
                              </Popup>
                           </Marker>
                        </React.Fragment>
                     ))}
                  </MapContainer>
               </Box>

               {/* Legend */}
               <Box sx={{ p: 2, display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                     <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#e53e3e" }} />
                     <Typography variant="body2">Alto movimiento</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                     <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#d69e2e" }} />
                     <Typography variant="body2">Medio movimiento</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                     <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#38a169" }} />
                     <Typography variant="body2">Bajo movimiento</Typography>
                  </Box>
               </Box>
            </CardContent>
         </Card>
      </motion.div>
   );
};
