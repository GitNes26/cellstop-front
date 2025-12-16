import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([BarChart, LineChart, PieChart, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer]);

export default function EChartCard({ option, height = 280 }) {
   const ref = useRef(null);
   useEffect(() => {
      const chart = echarts.init(ref.current);
      chart.setOption(option);
      window.addEventListener("resize", chart.resize);
      return () => {
         window.removeEventListener("resize", chart.resize);
         chart.dispose();
      };
   }, [option]);

   return <div ref={ref} style={{ height }} className="rounded-md shadow-sm" />;
}
