import React, { useState } from "react";
import { Button, CircularProgress, Grid, Typography, SxProps } from "@mui/material";
import { MyLocation } from "@mui/icons-material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Theme } from "@mui/system";
import { useFormikContext, FormikValues } from "formik";

// Ícono personalizado para Leaflet (evita el bug de íconos rotos)
const markerIcon = new L.Icon({
   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
   iconSize: [25, 41],
   iconAnchor: [12, 41]
});

interface LocationButtonProps {
   xsOffset?: number | null;
   col?: number;
   sizeCols?: {
      xs: number;
      sm: number;
      md: number;
   };
   idNameLat: string;
   idNameLng: string;
   idNameUbi: string;
   label?: string;
   size?: "small" | "medium";
   color?: string;
   className?: string;
   sx?: SxProps<Theme> | undefined;
   hidden?: boolean;
   mb?: number;
   fullWidth?: boolean;
   variant?: "outlined" | "contained";
}

const LocationButton: React.FC<LocationButtonProps> = ({
   xsOffset = null,
   col = 12,
   sizeCols = { xs: 12, sm: 12, md: col },
   color,
   idNameLat,
   idNameLng,
   idNameUbi,
   label = "Obtener ubicación",
   size = "medium",
   className = "",
   sx,
   hidden = false,
   mb = 0,
   fullWidth = true,
   variant = "outlined"
}) => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   // const error = formik.touched[idName] && formik.errors[idName] ? formik.errors[idName].toString() : null;
   const isError = Boolean(error);
   const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
   const formik = useFormikContext<FormikValues>();

   const handleGetLocation = () => {
      if (!navigator.geolocation) {
         setError("La geolocalización no es soportada por este navegador.");
         return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
         (position) => {
            const coords = {
               lat: position.coords.latitude,
               lng: position.coords.longitude
            };
            setLocation(coords);

            // Guardar en Formik (irá a BD)
            formik?.setFieldValue(idNameLat, coords.lat);
            formik?.setFieldValue(idNameLng, coords.lng);
            formik?.setFieldValue(idNameUbi, `https://www.google.com/maps?q=${location.lat},${location.lng}`);

            setLoading(false);
         },
         () => {
            setError("No se pudo obtener la ubicación. Verifica los permisos del navegador.");
            setLoading(false);
         },
         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
   };

   return (
      <Grid size={sizeCols} offset={{ xs: xsOffset }} hidden={hidden} mb={mb} sx={sx}>
         <div className={`flex flex-col w-full items-start  border border-gray-400  rounded-xl shadow-sm p-4 ${className}`}>
            <Typography
               mb={0}
               sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
               component={"label"}
               // htmlFor={idName}
               variant="caption"
               // color={color}
            >
               <span className={`text-sm text-${color} ${isError && "text-error"}`}>{label}</span>
               {/* <span className={`${isError ? "text-error" : "text-gray-400"}`}>{required ? "Requerido" : "Opcional"}</span> */}
            </Typography>

            <Button
               variant={variant}
               color="primary"
               startIcon={!loading && <MyLocation />}
               onClick={handleGetLocation}
               disabled={loading}
               size={size}
               fullWidth={fullWidth}
               className="rounded-xl font-semibold"
            >
               {loading ? <CircularProgress size={22} color="inherit" /> : "Obtener ubicación"}
            </Button>

            {error && (
               <Typography variant="body2" className="text-red-600 mt-2">
                  {error}
               </Typography>
            )}

            {location && (
               <div className="mt-3 w-full text-sm">
                  <div className="flex justify-around">
                     <span>
                        <strong>Latitud:</strong> {location.lat.toFixed(6)}
                     </span>
                     <span>
                        <strong>Longitud:</strong> {location.lng.toFixed(6)}
                     </span>
                  </div>

                  <div className="mt-3 mb-2 w-full h-64 overflow-hidden rounded-lg border border-gray-300">
                     <MapContainer center={[location.lat, location.lng]} zoom={16} scrollWheelZoom={true} className="w-full h-full">
                        <TileLayer
                           attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[location.lat, location.lng]} icon={markerIcon}>
                           <Popup>Ubicación actual</Popup>
                        </Marker>
                     </MapContainer>
                  </div>

                  <Button
                     variant={"contained"}
                     color="primary"
                     // startIcon={!loading && <MyLocation />}
                     disabled={loading}
                     size={"small"}
                     // fullWidth={fullWidth}
                     className="rounded-xl font-semibold"
                  >
                     <a href={`https://www.google.com/maps?q=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer" className="">
                        Abrir en Google Maps
                     </a>
                  </Button>
               </div>
            )}
         </div>
      </Grid>
   );
};

export default LocationButton;
