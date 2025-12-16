// src/components/dashboard/PortabilityChart.tsx
import React from "react";
import ChartComponent, { ChartComponentProps } from "../charts/ChartComponent";

interface PortabilityChartProps extends Partial<ChartComponentProps> {
   data?: Record<number, number>; // {mes: cantidad}
   loading?: boolean;
   onMonthClick?: (month: number) => void;
}

const PortabilityChart: React.FC<PortabilityChartProps> = ({ data = {}, loading = false, onMonthClick, ...props }) => {
   // Convertir datos al formato esperado
   const chartData = Object.entries(data || {}).map(([month, count]) => ({
      name: getMonthName(Number(month)),
      value: count
   }));

   const handleClick = (params: any) => {
      if (onMonthClick && params.dataIndex !== undefined) {
         onMonthClick(params.dataIndex + 1); // +1 porque los meses son 1-indexed
      }
   };

   return (
      <ChartComponent
         title="Portabilidad por Mes"
         subtitle="Números portados por mes"
         type="line"
         data={chartData}
         height={350}
         loading={loading}
         onClick={handleClick}
         colors={["#1976d2", "#dc004e"]}
         smooth={true}
         areaStyle={{ opacity: 0.3 }}
         xAxis={{
            type: "category",
            data: chartData.map((item) => item.name),
            axisLabel: { rotate: 45 }
         }}
         yAxis={{
            type: "value",
            name: "Cantidad",
            nameLocation: "middle",
            nameGap: 30
         }}
         tooltip={{
            trigger: "axis",
            formatter: "{b}: {c} portaciones"
         }}
         showLegend={false}
         {...props}
      />
   );
};

// Helper para nombres de meses
const getMonthName = (month: number): string => {
   const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
   return months[month - 1] || `Mes ${month}`;
};

export default PortabilityChart;
