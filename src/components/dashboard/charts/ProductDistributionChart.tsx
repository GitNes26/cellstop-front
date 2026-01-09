// components/dashboard/charts/ProductDistributionChart.tsx
import * as echarts from "echarts";

export class ProductDistributionChart {
   static getOption(): echarts.EChartsOption {
      return {
         tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
         },
         legend: {
            orient: "vertical",
            right: 10,
            top: "center",
            data: ["SIM Físico", "E-SIM", "Dispositivos", "Accesorios", "Otros"]
         },
         series: [
            {
               name: "Distribución por Tipo",
               type: "pie",
               radius: ["40%", "70%"],
               avoidLabelOverlap: false,
               itemStyle: {
                  borderRadius: 10,
                  borderColor: "#fff",
                  borderWidth: 2
               },
               label: {
                  show: false,
                  position: "center"
               },
               emphasis: {
                  label: {
                     show: true,
                     fontSize: 18,
                     fontWeight: "bold"
                  }
               },
               labelLine: {
                  show: false
               },
               data: [
                  { value: 6540, name: "SIM Físico", itemStyle: { color: "#6F99CD" } },
                  { value: 3210, name: "E-SIM", itemStyle: { color: "#764ba2" } },
                  { value: 1980, name: "Dispositivos", itemStyle: { color: "#38a169" } },
                  { value: 650, name: "Accesorios", itemStyle: { color: "#d69e2e" } },
                  { value: 160, name: "Otros", itemStyle: { color: "#e53e3e" } }
               ]
            }
         ]
      };
   }

   static getStatusOption(): echarts.EChartsOption {
      return {
         tooltip: {
            trigger: "axis",
            axisPointer: {
               type: "shadow"
            }
         },
         legend: {
            data: ["Stock", "Pre-Activado", "Asignado", "Distribuido", "Activado"]
         },
         grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
         },
         xAxis: {
            type: "category" as const,
            data: ["SIM Físico", "E-SIM", "Dispositivos", "Accesorios"]
         },
         yAxis: {
            type: "value"
         },
         series: [
            {
               name: "Stock",
               type: "bar",
               stack: "total",
               emphasis: { focus: "series" },
               data: [3200, 1800, 1200, 400],
               itemStyle: { color: "#cbd5e0" }
            },
            {
               name: "Pre-Activado",
               type: "bar",
               stack: "total",
               emphasis: { focus: "series" },
               data: [2000, 800, 500, 200],
               itemStyle: { color: "#4299e1" }
            },
            {
               name: "Asignado",
               type: "bar",
               stack: "total",
               emphasis: { focus: "series" },
               data: [800, 400, 200, 100],
               itemStyle: { color: "#d69e2e" }
            },
            {
               name: "Distribuido",
               type: "bar",
               stack: "total",
               emphasis: { focus: "series" },
               data: [400, 200, 80, 30],
               itemStyle: { color: "#38a169" }
            },
            {
               name: "Activado",
               type: "bar",
               stack: "total",
               emphasis: { focus: "series" },
               data: [140, 60, 20, 10],
               itemStyle: { color: "#e53e3e" }
            }
         ]
      };
   }
}
