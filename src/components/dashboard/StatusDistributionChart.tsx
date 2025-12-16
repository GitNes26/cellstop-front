// src/components/dashboard/StatusDistributionChart.tsx
import React from "react";
import ChartComponent, { ChartComponentProps } from "../charts/ChartComponent";

interface StatusDistributionChartProps extends Partial<ChartComponentProps> {
   data?: Record<string, number>; // {estatus: cantidad}
   loading?: boolean;
   onStatusClick?: (status: string) => void;
}

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ data = {}, loading = false, onStatusClick, ...props }) => {
   // Convertir datos al formato esperado
   const chartData = Object.entries(data || {}).map(([status, count]) => ({
      name: getStatusLabel(status),
      value: count,
      status: status
   }));

   const handleClick = (params: any) => {
      if (onStatusClick && params.data?.status) {
         onStatusClick(params.data.status);
      }
   };

   // Colores por estatus
   const getStatusColor = (status: string): string => {
      const colors: Record<string, string> = {
         Virgen: "#9e9e9e",
         "Pre-activado": "#ff9800",
         Activado: "#4caf50",
         Portado: "#2196f3",
         Caducado: "#f44336"
      };
      return colors[status] || "#607d8b";
   };

   const colors = chartData.map((item) => getStatusColor(item.status));

   return (
      <ChartComponent
         title="Distribución por Estatus"
         type="pie"
         data={chartData}
         height={300}
         loading={loading}
         onClick={handleClick}
         colors={colors}
         pieRadius={["30%", "70%"]}
         tooltip={{
            formatter: "{b}: {c} ({d}%)"
         }}
         legend={{
            orient: "vertical",
            right: 10,
            top: "center"
         }}
         {...props}
      />
   );
};

const getStatusLabel = (status: string): string => {
   const labels: Record<string, string> = {
      Virgen: "Virgen",
      "Pre-activado": "Pre-activado",
      Activado: "Activado",
      Portado: "Portado",
      Caducado: "Caducado"
   };
   return labels[status] || status;
};

export default StatusDistributionChart;
