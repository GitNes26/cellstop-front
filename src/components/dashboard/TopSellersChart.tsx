// src/components/dashboard/TopSellersChart.tsx
import React from "react";
import ChartComponent, { ChartComponentProps } from "../charts/ChartComponent";

interface SellerData {
   id: number;
   name: string;
   port_count: number;
   color?: string;
}

interface TopSellersChartProps extends Partial<ChartComponentProps> {
   data?: SellerData[];
   loading?: boolean;
   onSellerClick?: (sellerId: number) => void;
}

const TopSellersChart: React.FC<TopSellersChartProps> = ({ data = [], loading = false, onSellerClick, ...props }) => {
   // Ordenar por cantidad y limitar a top 10
   const sortedData = [...data].sort((a, b) => b.port_count - a.port_count).slice(0, 10);

   const chartData = sortedData.map((seller) => ({
      name: seller.name,
      value: seller.port_count,
      sellerId: seller.id,
      color: seller.color
   }));

   const handleClick = (params: any) => {
      if (onSellerClick && params.data?.sellerId) {
         onSellerClick(params.data.sellerId);
      }
   };

   const colors = chartData.map((item) => item.color || "#1976d2");

   return (
      <ChartComponent
         title="Top 10 Vendedores"
         subtitle="Por cantidad de portaciones"
         type="bar"
         data={chartData}
         height={350}
         loading={loading}
         onClick={handleClick}
         colors={colors}
         xAxis={{
            type: "category",
            data: chartData.map((item) => item.name),
            axisLabel: {
               interval: 0,
               rotate: 45
            }
         }}
         yAxis={{
            type: "value",
            name: "Portaciones"
         }}
         tooltip={{
            formatter: "{b}: {c} portaciones"
         }}
         showLegend={false}
         {...props}
      />
   );
};

export default TopSellersChart;
