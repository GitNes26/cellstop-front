// components/dashboard/charts/SalesTrendChart.tsx
import * as echarts from "echarts";

export class SalesTrendChart {
   static getOption(): echarts.EChartsOption {
      const dates = [];
      for (let i = 30; i >= 0; i--) {
         const date = new Date();
         date.setDate(date.getDate() - i);
         dates.push(date.toLocaleDateString("es-MX", { month: "short", day: "numeric" }));
      }

      return {
         tooltip: {
            trigger: "axis",
            axisPointer: {
               type: "cross",
               label: {
                  backgroundColor: "#6a7985"
               }
            }
         },
         legend: {
            data: ["Activaciones", "Distribuciones", "Pre-Activaciones"]
         },
         grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
         },
         xAxis: [
            {
               type: "category",
               boundaryGap: false,
               data: dates
            }
         ],
         yAxis: [
            {
               type: "value"
            }
         ],
         series: [
            {
               name: "Activaciones",
               type: "line",
               stack: "Total",
               smooth: true,
               lineStyle: {
                  width: 3
               },
               showSymbol: false,
               areaStyle: {
                  opacity: 0.1,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                     { offset: 0, color: "#e53e3e" },
                     { offset: 1, color: "#e53e3e00" }
                  ])
               },
               emphasis: {
                  focus: "series"
               },
               data: this.generateRandomData(31, 50, 200)
            },
            {
               name: "Distribuciones",
               type: "line",
               stack: "Total",
               smooth: true,
               lineStyle: {
                  width: 3
               },
               showSymbol: false,
               areaStyle: {
                  opacity: 0.1,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                     { offset: 0, color: "#38a169" },
                     { offset: 1, color: "#38a16900" }
                  ])
               },
               emphasis: {
                  focus: "series"
               },
               data: this.generateRandomData(31, 100, 400)
            },
            {
               name: "Pre-Activaciones",
               type: "line",
               stack: "Total",
               smooth: true,
               lineStyle: {
                  width: 3
               },
               showSymbol: false,
               areaStyle: {
                  opacity: 0.1,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                     { offset: 0, color: "#4299e1" },
                     { offset: 1, color: "#4299e100" }
                  ])
               },
               emphasis: {
                  focus: "series"
               },
               data: this.generateRandomData(31, 200, 600)
            }
         ]
      };
   }

   private static generateRandomData(count: number, min: number, max: number): number[] {
      return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
   }

   static getSellerPerformanceOption(): echarts.EChartsOption {
      return {
         tooltip: {
            trigger: "axis",
            axisPointer: {
               type: "shadow"
            }
         },
         grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
         },
         xAxis: {
            type: "value" as const
         },
         yAxis: {
            type: "category",
            data: ["Juan Pérez", "María García", "Carlos López", "Ana Martínez", "Pedro Rodríguez", "Laura Hernández"]
         },
         series: [
            {
               name: "Activaciones",
               type: "bar",
               data: [145, 132, 101, 98, 76, 65],
               itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                     { offset: 0, color: "#6F99CD" },
                     { offset: 1, color: "#764ba2" }
                  ])
               },
               label: {
                  show: true,
                  position: "right",
                  formatter: "{c}"
               }
            }
         ]
      };
   }
}
