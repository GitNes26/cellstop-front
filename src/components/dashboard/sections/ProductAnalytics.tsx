// components/dashboard/sections/ProductAnalytics.tsx
import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { ChartWidget } from "../widgets/ChartWidget";
import { ProgressWidget } from "../widgets/ProgressWidget";
import { ProductDistributionChart } from "../charts/ProductDistributionChart";
import { InventoryStatusChart } from "../charts/InventoryStatusChart";

export interface ProductAnalyticsProps {
   data: {
      productTypes: Array<{
         name: string;
         count: number;
         percentage: number;
      }>;
      inventoryStatus: Array<{
         location: string;
         count: number;
         total: number;
      }>;
   } | null;
}

export const ProductAnalytics: React.FC<ProductAnalyticsProps> = ({ data }) => {
   const progressItems = data.inventoryStatus.map((item) => ({
      label: item.location,
      value: item.count,
      total: item.total,
      color: "primary" as const,
      description: `${Math.round((item.count / item.total) * 100)}% del total`
   }));

   return (
      <Box sx={{ mb: 4 }}>
         <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
            Análisis de Productos
         </Typography>

         <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
               <ChartWidget
                  title="Distribución por Tipo de Producto"
                  subtitle="Composición del inventario actual"
                  chartOption={ProductDistributionChart.getOption()}
                  height={400}
               />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
               <ChartWidget
                  title="Estado por Ubicación"
                  subtitle="Distribución geográfica del inventario"
                  chartOption={InventoryStatusChart.getLocationStatusOption()}
                  height={400}
               />
            </Grid>

            <Grid size={{ xs: 12 }}>
               <ProgressWidget title="Progreso de Distribución" subtitle="Avance por ubicación objetivo" items={progressItems} height={300} />
            </Grid>
         </Grid>
      </Box>
   );
};
