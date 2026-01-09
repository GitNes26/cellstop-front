// components/dashboard/sections/SalesPerformance.tsx
import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { ChartWidget } from "../widgets/ChartWidget";
import { TableWidget } from "../widgets/TableWidget";
import { SalesTrendChart } from "../charts/SalesTrendChart";

export interface SalesPerformanceProps {
   data: {
      sellers: Array<{
         id: number;
         full_name: string;
         pin_color: string;
         assigned: number;
         distributed: number;
         actived: number;
         ported: number;
         efficiency: number;
         deficiency: number;
         points_of_sale: number;
         visits: number;
         daily: number;
         [key: string]: any;
      }>;
      // topSellers: Array<{
      //    id: number;
      //    name: string;
      //    activations: number;
      //    distributed: number;
      //    efficiency: number;
      //    region: string;
      // }>;
      // recentSales: Array<{
      //    id: number;
      //    product: string;
      //    seller: string;
      //    pointOfSale: string;
      //    date: string;
      //    status: string;
      // }>;
   };
}

export const SalesPerformance: React.FC<SalesPerformanceProps> = ({ data }) => {
   const sellerColumns = [
      { key: "name", label: "Vendedor", align: "left" as const },
      { key: "distributed", label: "Distribuidos", align: "center" as const },
      { key: "actived", label: "Activados", align: "center" as const },
      { key: "activatiportedons", label: "Portados", align: "center" as const },
      {
         key: "efficiency",
         label: "Eficiencia",
         align: "center" as const,
         render: (value: number) => `${value}%`
      },
      {
         key: "deficiency",
         label: "Defiencia",
         align: "center" as const,
         render: (value: number) => `${value}%`
      },
      { key: "points_of_sale", label: "Puntos de venta", align: "center" as const },
      { key: "visits", label: "Visitas", align: "center" as const },
      { key: "daily", label: "Visitas diarias", align: "center" as const },
      { key: "pin_color", label: "Color Pin Mapa", align: "center" as const }
   ];

   const salesColumns = [
      { key: "product", label: "Producto", align: "left" as const },
      { key: "seller", label: "Vendedor", align: "left" as const },
      { key: "pointOfSale", label: "Punto de Venta", align: "left" as const },
      { key: "date", label: "Fecha", align: "center" as const },
      {
         key: "status",
         label: "Estado",
         align: "center" as const,
         render: (value: string) => (
            <Box
               sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  backgroundColor: value === "Activado" ? "#38a16920" : value === "Distribuido" ? "#d69e2e20" : "#4299e120",
                  color: value === "Activado" ? "#38a169" : value === "Distribuido" ? "#d69e2e" : "#4299e1"
               }}
            >
               {value}
            </Box>
         )
      }
   ];

   return (
      <Box sx={{ mb: 4 }}>
         <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
            Rendimiento de Ventas
         </Typography>

         <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }}>
               <ChartWidget title="Tendencia de Actividades" subtitle="Últimos 30 días" chartOption={SalesTrendChart.getOption()} height={400} />
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
               <ChartWidget title="Top Vendedores" subtitle="Por activaciones" chartOption={SalesTrendChart.getSellerPerformanceOption()} height={400} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
               <TableWidget
                  title="Ranking de Vendedores"
                  subtitle="Top 10 por desempeño"
                  columns={sellerColumns}
                  data={data?.sellers}
                  height={300}
                  pagination={false}
               />
            </Grid>

            {/* <Grid size={{ xs: 12, md: 6 }}>
               <TableWidget
                  title="Ranking de Vendedores"
                  subtitle="Top 10 por desempeño"
                  columns={sellerColumns}
                  data={data.topSellers}
                  height={300}
                  pagination={false}
               />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
               <TableWidget
                  title="Ventas Recientes"
                  subtitle="Últimas transacciones"
                  columns={salesColumns}
                  data={data.recentSales}
                  height={300}
                  pagination={false}
                  searchable={true}
               />
            </Grid> */}
         </Grid>
      </Box>
   );
};
