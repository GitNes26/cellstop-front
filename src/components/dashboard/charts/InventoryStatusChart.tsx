// components/dashboard/charts/InventoryStatusChart.tsx
import * as echarts from "echarts";

export class InventoryStatusChart {
   static getOption(): echarts.EChartsOption {
      return {
         tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
         },
         legend: {
            bottom: "5%",
            left: "center",
            data: ["Stock Central", "Asignado Vendedores", "Distribuido Puntos", "En Tránsito"]
         },
         series: [
            {
               name: "Ubicación Inventario",
               type: "pie",
               radius: ["30%", "60%"],
               center: ["50%", "45%"],
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
                  { value: 6540, name: "Stock Central", itemStyle: { color: "#6F99CD" } },
                  { value: 3120, name: "Asignado Vendedores", itemStyle: { color: "#d69e2e" } },
                  { value: 1890, name: "Distribuido Puntos", itemStyle: { color: "#38a169" } },
                  { value: 990, name: "En Tránsito", itemStyle: { color: "#e53e3e" } }
               ]
            }
         ]
      };
   }

   static getLocationStatusOption(): echarts.EChartsOption {
      return {
         tooltip: {
            trigger: "axis",
            axisPointer: {
               type: "shadow"
            }
         },
         legend: {
            data: ["SIM Físico", "E-SIM", "Dispositivos"]
         },
         grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
         },
         xAxis: {
            type: "value"
         },
         yAxis: {
            type: "category",
            data: ["Stock Central", "Zona Norte", "Zona Sur", "Zona Este", "Zona Oeste", "Centro"]
         },
         series: [
            {
               name: "SIM Físico",
               type: "bar",
               stack: "total",
               label: {
                  show: true
               },
               emphasis: {
                  focus: "series"
               },
               data: [3200, 800, 600, 450, 300, 190],
               itemStyle: { color: "#6F99CD" }
            },
            {
               name: "E-SIM",
               type: "bar",
               stack: "total",
               label: {
                  show: true
               },
               emphasis: {
                  focus: "series"
               },
               data: [1800, 400, 350, 280, 180, 100],
               itemStyle: { color: "#764ba2" }
            },
            {
               name: "Dispositivos",
               type: "bar",
               stack: "total",
               label: {
                  show: true
               },
               emphasis: {
                  focus: "series"
               },
               data: [1200, 300, 250, 200, 120, 80],
               itemStyle: { color: "#38a169" }
            }
         ]
      };
   }
}
