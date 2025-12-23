// components/dashboard/sections/HeaderStats.tsx
import React from "react";
import { Grid } from "@mui/material";
import { StatCard, StatCardGrid } from "../widgets/StatCard";
import { Inventory2, PointOfSale, People, TrendingUp, QrCode2, Assignment, SimCardRounded, AssignmentIndRounded } from "@mui/icons-material";

export interface HeaderStatsProps {
   stats: {
      activation_rate: number;
      points_of_sale: number;
      sellers: number;
      avg_products_per_seller: number;
      portability_rate: number;
      distributed: number;
      portados: number;
      products: number;
      inStock: number;
      preActivated: number;
      activated: number;
      visits: number;
      assigned: number;

      in_transit?: number;
      [key: string]: number | undefined;
   };

   onStatClick?: (statKey: string) => void;
   loading?: boolean;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({ stats, onStatClick, loading }) => {
   console.log("🚀 ~ HeaderStats ~ stats:", stats);
   const handleStatClick = (statKey: string) => {
      onStatClick?.(statKey);
   };

   return (
      <>
         {/* <StatCardGrid columns={{ xs: 2, sm: 3, md: 4, lg: 6 }} gap={2}>
            <StatCard
               title="Chips Totales"
               value={stats?.products.toLocaleString()}
               subtitle="En inventario"
               color="primary"
               size="compact"
               trend={{ value: 12, isPositive: true }}
            />
            <StatCard
               title="Pre-activados"
               value={stats?.activated.toLocaleString()}
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
         </StatCardGrid> */}
         <Grid container spacing={3}>
            <StatCardGrid columns={{ xs: 1, sm: 2, md: 4, lg: 4 }} gap={2}>
               <Grid>
                  <StatCard
                     title="Total Productos"
                     value={stats?.products.toLocaleString()}
                     subtitle="Total de registros cargados"
                     icon={<SimCardRounded />}
                     color="primary"
                     // trend={{ value: 12, isPositive: true }}
                     onClick={() => handleStatClick("products")}
                  />
               </Grid>

               <Grid>
                  <StatCard
                     title="Pre-Activados / En Stock"
                     value={`${stats?.preActivated.toLocaleString()} / ${stats?.inStock.toLocaleString()}`}
                     subtitle="Listos para asignar"
                     icon={<Inventory2 />}
                     color="info"
                     // size="compact"
                     progress={Math.round((stats?.preActivated / stats?.products) * 100)}
                     onClick={() => handleStatClick("preActivated")}
                  />
                  {/* <StatCard
                     title="En Stock"
                     value={stats?.inStock.toLocaleString()}
                     subtitle="Listos para asignar y Algunos ya asignados"
                     icon={<Inventory2 />}
                     color="info"
                     size="compact"
                     progress={Math.round((stats?.inStock / stats?.products) * 100)}
                     onClick={() => handleStatClick("inStock")}
                  /> */}
               </Grid>

               <Grid>
                  <StatCard
                     title="Asignados"
                     value={stats?.assigned.toLocaleString()}
                     subtitle="Con vendedores"
                     icon={<AssignmentIndRounded />}
                     color="warning"
                     progress={Math.round((stats?.assigned / stats?.products) * 100)}
                     onClick={() => handleStatClick("assigned")}
                  />
               </Grid>

               <Grid>
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
            </StatCardGrid>

            <Grid container sx={{ width: "100%" }} spacing={2}>
               <Grid size={{ md: 6 }}>
                  <StatCard
                     title="Activados"
                     value={stats?.activated.toLocaleString()}
                     subtitle="Primera recarga"
                     icon={<TrendingUp />}
                     color="success"
                     progress={Math.round((stats?.activated / stats?.products) * 100)}
                     onClick={() => handleStatClick("activated")}
                  />
               </Grid>
               <Grid size={{ md: 6 }}>
                  <StatCard
                     title="Portados"
                     value={stats?.portados.toLocaleString()}
                     subtitle="Primera recarga"
                     icon={<TrendingUp />}
                     color="error"
                     progress={Math.round((stats?.portados / stats?.products) * 100)}
                     onClick={() => handleStatClick("portados")}
                  />
               </Grid>
            </Grid>
            <Grid container sx={{ width: "100%" }} spacing={2}>
               <Grid size={{ md: 6 }}>
                  <StatCard title="Vendedores" value={stats?.sellers} subtitle="Activos" icon={<People />} color="info" onClick={() => handleStatClick("sellers")} />
               </Grid>

               <Grid size={{ md: 6 }}>
                  <StatCard
                     title="Puntos de Venta"
                     value={stats?.points_of_sale}
                     subtitle="Activos"
                     icon={<PointOfSale />}
                     color="success"
                     onClick={() => handleStatClick("points_of_sale")}
                  />
               </Grid>
            </Grid>
         </Grid>
      </>
   );
};
