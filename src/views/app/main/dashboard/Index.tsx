// components/dashboard/Dashboard.tsx
import React, { useState, useRef } from "react";
import { Box } from "@mui/material";
import { DashboardLayout } from "../../../../components/dashboard/layouts/DashboardLayout";
import { HeaderStats } from "../../../../components/dashboard/sections/HeaderStats";
import { ProductAnalytics } from "../../../../components/dashboard/sections/ProductAnalytics";
import { SalesPerformance } from "../../../../components/dashboard/sections/SalesPerformance";
import { GeographicDistribution } from "../../../../components/dashboard/sections/GeographicDistribution";
import { NavigationSidebar } from "../../../../components/dashboard/sections/NavigationSidebar";

// Mock data actualizado
const mockData = {
   stats: {
      totalProducts: 12540,
      preActivated: 8430,
      assigned: 3120,
      distributed: 1890,
      activated: 760,
      totalSellers: 45,
      activePointsOfSale: 28,
      inTransit: 990
   },
   pointsOfSale: [
      { id: 1, name: "Punto Centro", latitude: 19.4326, longitude: -99.1332, salesCount: 150, productsCount: 45, type: "high", region: "Centro" },
      { id: 2, name: "Punto Norte", latitude: 19.4902, longitude: -99.1235, salesCount: 85, productsCount: 32, type: "medium", region: "Norte" },
      { id: 3, name: "Punto Sur", latitude: 19.3556, longitude: -99.1619, salesCount: 45, productsCount: 18, type: "low", region: "Sur" },
      { id: 4, name: "Punto Este", latitude: 19.42, longitude: -99.05, salesCount: 120, productsCount: 38, type: "high", region: "Este" },
      { id: 5, name: "Punto Oeste", latitude: 19.39, longitude: -99.2, salesCount: 65, productsCount: 25, type: "medium", region: "Oeste" }
   ],
   regionalData: [
      { region: "Centro", totalProducts: 4500, distributed: 850, activated: 320, target: 1000 },
      { region: "Norte", totalProducts: 3200, distributed: 420, activated: 180, target: 600 },
      { region: "Sur", totalProducts: 2800, distributed: 280, activated: 120, target: 500 },
      { region: "Este", totalProducts: 1500, distributed: 220, activated: 90, target: 300 },
      { region: "Oeste", totalProducts: 540, distributed: 120, activated: 50, target: 200 }
   ],
   productAnalytics: {
      productTypes: [
         { name: "SIM Físico", count: 6540, percentage: 52 },
         { name: "E-SIM", count: 3210, percentage: 26 },
         { name: "Dispositivos", count: 1980, percentage: 16 },
         { name: "Accesorios", count: 650, percentage: 5 },
         { name: "Otros", count: 160, percentage: 1 }
      ],
      inventoryStatus: [
         { location: "Stock Central", count: 6540, total: 12540 },
         { location: "Zona Norte", count: 2200, total: 3200 },
         { location: "Zona Sur", count: 1800, total: 2800 },
         { location: "Zona Este", count: 1200, total: 1500 },
         { location: "Zona Oeste", count: 480, total: 540 }
      ]
   },
   salesPerformance: {
      topSellers: [
         { id: 1, name: "Juan Pérez", activations: 145, distributed: 320, efficiency: 45, region: "Centro" },
         { id: 2, name: "María García", activations: 132, distributed: 280, efficiency: 47, region: "Norte" },
         { id: 3, name: "Carlos López", activations: 101, distributed: 240, efficiency: 42, region: "Sur" },
         { id: 4, name: "Ana Martínez", activations: 98, distributed: 210, efficiency: 47, region: "Este" },
         { id: 5, name: "Pedro Rodríguez", activations: 76, distributed: 180, efficiency: 42, region: "Oeste" }
      ],
      recentSales: [
         { id: 1, product: "SIM Físico", seller: "Juan Pérez", pointOfSale: "Punto Centro", date: "2024-01-15", status: "Activado" },
         { id: 2, product: "E-SIM", seller: "María García", pointOfSale: "Punto Norte", date: "2024-01-15", status: "Distribuido" },
         { id: 3, product: "Dispositivo", seller: "Carlos López", pointOfSale: "Punto Sur", date: "2024-01-14", status: "Activado" },
         { id: 4, product: "SIM Físico", seller: "Ana Martínez", pointOfSale: "Punto Este", date: "2024-01-14", status: "Distribuido" },
         { id: 5, product: "E-SIM", seller: "Pedro Rodríguez", pointOfSale: "Punto Oeste", date: "2024-01-13", status: "Activado" }
      ]
   }
};

const IndexDashboard: React.FC = () => {
   const [activeSection, setActiveSection] = useState("stats");

   const statsRef = useRef<HTMLDivElement>(null);
   const productsRef = useRef<HTMLDivElement>(null);
   const salesRef = useRef<HTMLDivElement>(null);
   const geographyRef = useRef<HTMLDivElement>(null);

   const handleStatClick = (statKey: string) => {
      console.log(`Stat clicked: ${statKey}`);
      // Aquí puedes implementar navegación o filtros
   };

   const handleSectionChange = (section: string) => {
      setActiveSection(section);
   };

   return (
      <DashboardLayout navigation={<NavigationSidebar onSectionChange={handleSectionChange} activeSection={activeSection} />}>
         {/* Header Stats */}
         <Box id="stats" ref={statsRef} sx={{ mb: 6 }}>
            <HeaderStats stats={mockData.stats} onStatClick={handleStatClick} />
         </Box>

         {/* Product Analytics */}
         <Box id="products" ref={productsRef} sx={{ mb: 6 }}>
            <ProductAnalytics data={mockData.productAnalytics} />
         </Box>

         {/* Sales Performance */}
         <Box id="sales" ref={salesRef} sx={{ mb: 6 }}>
            <SalesPerformance data={mockData.salesPerformance} />
         </Box>

         {/* Geographic Distribution */}
         <Box id="geography" ref={geographyRef} sx={{ mb: 6 }}>
            <GeographicDistribution pointsOfSale={mockData.pointsOfSale} regionalData={mockData.regionalData} />
         </Box>
      </DashboardLayout>
   );
};

export default IndexDashboard;
