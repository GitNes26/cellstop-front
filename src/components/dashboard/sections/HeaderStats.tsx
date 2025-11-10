// components/dashboard/sections/HeaderStats.tsx
import React from "react";
import { Grid } from "@mui/material";
import { StatCard } from "../widgets/StatCard";
import { Inventory2, PointOfSale, People, TrendingUp, QrCode2, Assignment } from "@mui/icons-material";

export interface HeaderStatsProps {
   stats: {
      totalProducts: number;
      preActivated: number;
      assigned: number;
      distributed: number;
      activated: number;
      totalSellers: number;
      activePointsOfSale: number;
      inTransit: number;
   };
   onStatClick?: (statKey: string) => void;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({ stats, onStatClick }) => {
   const handleStatClick = (statKey: string) => {
      onStatClick?.(statKey);
   };

   return (
      <Grid container spacing={3}>
         <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
               title="Total Productos"
               value={stats.totalProducts.toLocaleString()}
               subtitle="En inventario"
               icon={<Inventory2 />}
               color="primary"
               trend={{ value: 12, isPositive: true }}
               onClick={() => handleStatClick("totalProducts")}
            />
         </Grid>

         <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
               title="Pre-Activados"
               value={stats.preActivated.toLocaleString()}
               subtitle="Listos para asignar"
               icon={<QrCode2 />}
               color="info"
               progress={Math.round((stats.preActivated / stats.totalProducts) * 100)}
               onClick={() => handleStatClick("preActivated")}
            />
         </Grid>

         <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
               title="Asignados"
               value={stats.assigned.toLocaleString()}
               subtitle="A vendedores"
               icon={<Assignment />}
               color="warning"
               progress={Math.round((stats.assigned / stats.totalProducts) * 100)}
               onClick={() => handleStatClick("assigned")}
            />
         </Grid>

         <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
               title="Distribuidos"
               value={stats.distributed.toLocaleString()}
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
               value={stats.activated.toLocaleString()}
               subtitle="Primera recarga"
               icon={<TrendingUp />}
               color="error"
               progress={Math.round((stats.activated / stats.totalProducts) * 100)}
               onClick={() => handleStatClick("activated")}
            />
         </Grid>

         <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
               title="En Tránsito"
               value={stats.inTransit.toLocaleString()}
               subtitle="En movimiento"
               icon={<Inventory2 />}
               color="secondary"
               onClick={() => handleStatClick("inTransit")}
            />
         </Grid>

         <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
               title="Vendedores"
               value={stats.totalSellers}
               subtitle="Activos"
               icon={<People />}
               color="info"
               onClick={() => handleStatClick("totalSellers")}
            />
         </Grid>

         <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
               title="Puntos de Venta"
               value={stats.activePointsOfSale}
               subtitle="Activos"
               icon={<PointOfSale />}
               color="success"
               onClick={() => handleStatClick("activePointsOfSale")}
            />
         </Grid>
      </Grid>
   );
};
