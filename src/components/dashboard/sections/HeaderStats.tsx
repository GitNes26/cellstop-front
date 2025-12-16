// components/dashboard/sections/HeaderStats.tsx
import React from "react";
import { Grid } from "@mui/material";
import { StatCard, StatCardGrid } from "../widgets/StatCard";
import { Inventory2, PointOfSale, People, TrendingUp, QrCode2, Assignment } from "@mui/icons-material";

export interface HeaderStatsProps {
   stats: {
      total_products: number;
      total_activated: number;
      assigned: number;
      distributed: number;
      activated: number;
      total_sellers: number;
      total_points_of_sale: number;
      in_transit: number;
      total_portados: number;
      portability_rate: number;
   };

   onStatClick?: (statKey: string) => void;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({ stats, onStatClick }) => {
   const handleStatClick = (statKey: string) => {
      onStatClick?.(statKey);
   };

   return (
      <>
         <StatCardGrid columns={{ xs: 2, sm: 3, md: 4, lg: 6 }} gap={2}>
            <StatCard
               title="Chips Totales"
               value={stats?.total_products.toLocaleString()}
               subtitle="En inventario"
               color="primary"
               size="compact"
               trend={{ value: 12, isPositive: true }}
            />
            <StatCard
               title="Pre-activados"
               value={stats?.total_activated.toLocaleString()}
               subtitle="Listos para asignar"
               color="success"
               size="small"
               progress={67}
               priority="medium"
            />
            <StatCard
               title="Distribuidos"
               value={stats?.distributed.toLocaleString()}
               subtitle="En puntos de venta"
               color="info"
               size="medium"
               trend={{ value: 8, isPositive: true }}
               variant="elevated"
            />
            <StatCard title="Pre-activados" value="8,430" subtitle="Listos para asignar" color="warning" size="large" progress={67} priority="critical" />
         </StatCardGrid>
         <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
               <StatCard
                  title="Total Productos"
                  value={stats?.total_products.toLocaleString()}
                  subtitle="En inventario"
                  icon={<Inventory2 />}
                  color="primary"
                  trend={{ value: 12, isPositive: true }}
                  onClick={() => handleStatClick("total_products")}
               />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
               <StatCard
                  title="Pre-Activados"
                  value={stats?.total_activated.toLocaleString()}
                  subtitle="Listos para asignar"
                  icon={<QrCode2 />}
                  color="info"
                  progress={Math.round((stats?.total_activated / stats?.total_products) * 100)}
                  onClick={() => handleStatClick("total_activated")}
               />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
               <StatCard
                  title="Asignados"
                  value={stats?.assigned.toLocaleString()}
                  subtitle="A vendedores"
                  icon={<Assignment />}
                  color="warning"
                  progress={Math.round((stats?.assigned / stats?.total_products) * 100)}
                  onClick={() => handleStatClick("assigned")}
               />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
               <StatCard
                  title="Distribuidos"
                  value={stats?.distributed.toLocaleString()}
                  subtitle="En puntos de venta"
                  icon={<PointOfSale />}
                  color="success"
                  trend={{ value: 8, isPositive: true }}
                  onClick={() => handleStatClick("distributed")}
               />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
               <StatCard
                  title="Activados"
                  value={stats?.activated.toLocaleString()}
                  subtitle="Primera recarga"
                  icon={<TrendingUp />}
                  color="error"
                  progress={Math.round((stats?.activated / stats?.total_products) * 100)}
                  onClick={() => handleStatClick("activated")}
               />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
               <StatCard
                  title="En Tránsito"
                  value={stats?.in_transit.toLocaleString()}
                  subtitle="En movimiento"
                  icon={<Inventory2 />}
                  color="secondary"
                  onClick={() => handleStatClick("in_transit")}
               />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
               <StatCard
                  title="Vendedores"
                  value={stats?.total_sellers}
                  subtitle="Activos"
                  icon={<People />}
                  color="info"
                  onClick={() => handleStatClick("total_sellers")}
               />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
               <StatCard
                  title="Puntos de Venta"
                  value={stats?.total_points_of_sale}
                  subtitle="Activos"
                  icon={<PointOfSale />}
                  color="success"
                  onClick={() => handleStatClick("total_points_of_sale")}
               />
            </Grid>
         </Grid>
      </>
   );
};
