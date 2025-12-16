// components/dashboard/sections/GeographicDistribution.tsx
import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { MapWidget } from "../widgets/MapWidget";
import { ChartWidget } from "../widgets/ChartWidget";
import { ProgressItem, ProgressWidget } from "../widgets/ProgressWidget";

export interface GeographicDistributionProps {
   pointsOfSale: Array<{
      id: number;
      name: string;
      latitude: number;
      longitude: number;
      salesCount: number;
      productsCount: number;
      type: "high" | "medium" | "low";
      region: string;
   }>;
   regionalData: Array<{
      region: string;
      total_products: number;
      distributed: number;
      activated: number;
      target: number;
   }>;
}

export const GeographicDistribution: React.FC<GeographicDistributionProps> = ({ pointsOfSale, regionalData }) => {
   const regionalProgressItems = regionalData.map((region) => ({
      label: region.region,
      value: region.distributed,
      total: region.target,
      color: region.distributed >= region.target ? ("success" as const) : ("warning" as const),
      description: `${region.activated} activados (${Math.round((region.activated / region.distributed) * 100)}% eficiencia)`
   }));

   const regionalChartOption = {
      tooltip: {
         trigger: "axis" as const,
         axisPointer: {
            type: "shadow" as const
         }
      },
      legend: {
         data: ["Productos Totales", "Distribuidos", "Activados", "Meta"]
      },
      grid: {
         left: "3%",
         right: "4%",
         bottom: "3%",
         containLabel: true
      },
      xAxis: {
         type: "category" as const,
         data: regionalData.map((r) => r.region)
      },
      yAxis: {
         type: "value" as const
      },
      series: [
         {
            name: "Productos Totales",
            type: "bar" as const,
            data: regionalData.map((r) => r.total_products),
            itemStyle: { color: "#cbd5e0" }
         },
         {
            name: "Distribuidos",
            type: "bar" as const,
            data: regionalData.map((r) => r.distributed),
            itemStyle: { color: "#4299e1" }
         },
         {
            name: "Activados",
            type: "bar" as const,
            data: regionalData.map((r) => r.activated),
            itemStyle: { color: "#38a169" }
         },
         {
            name: "Meta",
            type: "line" as const,
            data: regionalData.map((r) => r.target),
            symbol: "circle",
            symbolSize: 8,
            lineStyle: {
               color: "#e53e3e",
               type: "dashed"
            },
            itemStyle: {
               color: "#e53e3e"
            }
         }
      ]
   };

   return (
      <Box sx={{ mb: 4 }}>
         <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
            Distribución Geográfica
         </Typography>

         <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }}>
               <MapWidget title="Mapa de Puntos de Venta" pointsOfSale={pointsOfSale} height={500} />
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
               <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                     <ChartWidget title="Desempeño por Región" subtitle="Distribución vs Metas" chartOption={regionalChartOption} height={300} />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                     <ProgressWidget title="Progreso Regional" subtitle="Avance hacia metas de distribución" items={regionalProgressItems} height={300} />
                  </Grid>
               </Grid>
            </Grid>
         </Grid>
      </Box>
   );
};
