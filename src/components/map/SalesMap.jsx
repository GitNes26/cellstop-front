// src/components/map/SalesMap.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function SalesMap({ points }) {
   return (
      <MapContainer center={[23.6345, -102.5528]} zoom={5} style={{ height: 480 }}>
         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
         {points.map((p) => (
            <Marker key={p.id} position={[p.latitude, p.longitude]}>
               <Popup>
                  <div>
                     <strong>{p.seller_name}</strong>
                     <br />
                     {p.buyer_name}
                     <br />
                     <img src={p.evidence_url} className="w-32 mt-2" alt="evidencia" />
                  </div>
               </Popup>
            </Marker>
         ))}
      </MapContainer>
   );
}
