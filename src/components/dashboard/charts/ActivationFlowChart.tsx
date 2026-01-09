// components/dashboard/charts/ActivationFlowChart.tsx
import * as echarts from "echarts";

export class ActivationFlowChart {
   static getOption(stats: any): echarts.EChartsOption {
      return {
         tooltip: {
            trigger: "axis",
            axisPointer: {
               type: "shadow"
            }
         },
         legend: {
            data: ["Cantidad", "Porcentaje"]
         },
         grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
         },
         xAxis: {
            type: "category",
            data: ["Stock Virgen", "Pre-Activados", "Asignados", "Distribuidos", "Activados"]
         },
         yAxis: [
            {
               type: "value",
               name: "Cantidad",
               position: "left"
            },
            {
               type: "value",
               name: "Porcentaje",
               position: "right",
               max: 100,
               axisLabel: {
                  formatter: "{value}%"
               }
            }
         ],
         series: [
            {
               name: "Cantidad",
               type: "bar",
               data: [stats.products, stats.activated, stats.assigned, stats.distributed, stats.activated],
               itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                     { offset: 0, color: "#6F99CD" },
                     { offset: 1, color: "#764ba2" }
                  ])
               }
            },
            {
               name: "Porcentaje",
               type: "line",
               yAxisIndex: 1,
               data: [
                  100,
                  Math.round((stats.activated / stats.products) * 100),
                  Math.round((stats.assigned / stats.products) * 100),
                  Math.round((stats.distributed / stats.products) * 100),
                  Math.round((stats.activated / stats.products) * 100)
               ],
               symbol: "circle",
               symbolSize: 8,
               lineStyle: {
                  color: "#e53e3e"
               },
               itemStyle: {
                  color: "#e53e3e"
               }
            }
         ]
      };
   }
}
