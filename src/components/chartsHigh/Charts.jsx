{
   /* <Chart 
chart="area" 
name="valores"   
titles={["Título 1", "Título 2", "Título 3"]} 
values={[10, 20, 30]}  
card={true} 
width={5}/> */
}

import Highcharts from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import HighchartsReact from "highcharts-react-official";
import React, { useState, useEffect, useRef } from "react";
import { createChart } from "./charts/charts";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./Charts.css";

import { v4 as uuidv4 } from "uuid";

import { Card } from "primereact/card";
import { Box, Grid, Paper, Button } from "@mui/material";
import { Ngif } from "../conditionals/Ngif";
let prueba = null;
export function setPrueba(pr) {
   prueba = pr;
   document.getElementById("graficasPrevisualizadasComenzando").click();
}
function getPrueba() {
   return prueba;
}
export const Chart = (props) => {
   const [isLoading, setIsLoading] = useState(true);
   const id = uuidv4();
   const [card, setCard] = useState(props.card);
   const widthClass = `width-${props.width || 10}`;
   const [showTable, SetTable] = useState(false);
   const [charts, setCharts] = useState(null);
   const [dictionary, setDictionary] = useState();
   const [subChartsDatas, setSubChartsDatas] = useState([]);
   const subchartRefs = useRef({}); // useRef para mantener las referencias de los subchart divs
   useEffect(() => {
      createChart(id, props.chart, props.name, props.titles, props.values, props.searchKey, props.data);
      setIsLoading(false);
   }, [props.chart, props.name, props.titles, props.values, props.card, props.width, props.searchKey, props.data, props.hiddens]);
   useEffect(() => {
      setDictionary(props.dictionary);
   }, []);
   const createSubCharts = () => {
      setSubChartsDatas([]);
      if (charts) {
         Object.keys(charts).forEach((key, index) => {
            const chart = charts[key];
            // console.log(props.hiddens.includes(chart.key),props.hiddens,chart.key)
            if (!props.hiddens.includes(chart.key)) {
               const name = dictionary.filter((dic) => dic.key === chart.key)[0]?.value;
               setSubChartsDatas((prevData) => [...prevData, { indice: `subchart-${index}`, key: chart.key, name, titles: chart.title, values: chart.value }]);
               name && createChart(`subchart-${index}`, "pie", name, chart.title, chart.value);
            }
            // createChart(refKey, "column", chart.name, chart.title, chart.value);
         });
      }
   };

   useEffect(() => {
      createSubCharts();

      // Llamar a la función para crear las subcharts cuando se actualice charts
   }, [charts]);
   const selectSubChart = (index) => {
      const { name, titles, values, key } = subChartsDatas[index];
      createChart(id, "column", name, titles, values, key, props.data);
      setCharts(null);
   };
   const reset = () => {
      setCharts(null);
      createChart(id, props.chart, props.name, props.titles, props.values, props.searchKey, props.data);
   };
   return (
      <Card style={{ padding: "1rem" }}>
         <Grid container>
            <Grid item xs={12}></Grid>
            {/* Condición para renderizar según la variable 'charts' */}
            {charts && (
               <Grid item xs={12} lg={6} style={{ height: `calc(${props.height} + 100px)`, overflow: "auto", paddingTop: ".2rem" }}>
                  {props.data[0] &&
                     Object.keys(props.data[0])
                        .slice(props.hiddens.length)
                        .map((item, i) => (
                           <Paper elevation={12} key={`subchart-key${i}`} title={props.title} className={widthClass} style={{ marginBottom: "2rem" }}>
                              <div id={`subchart-${i}`} style={{ height: props.height }}></div>
                              <Button
                                 onClick={() => {
                                    selectSubChart(i);
                                 }}
                                 fullWidth
                                 variant="outlined"
                                 color="secondary"
                              >
                                 Seleccionar
                              </Button>
                           </Paper>
                        ))}
               </Grid>
            )}

            <Grid item xs={12} lg={charts ? 6 : 12} pl={3}>
               {props.card ? (
                  <Paper elevation={12} title={props.title} style={{ height: `calc(${props.height} + 100px)` }} className={widthClass}>
                     {charts && (
                        <Button
                           sx={{ paddingTop: "1rem", paddingLeft: "1rem", paddingRight: "1rem" }}
                           onClick={() => {
                              reset();
                           }}
                           fullWidth
                           variant="outlined"
                           color="secondary"
                        >
                           Restaurar
                        </Button>
                     )}
                     <div id={id} style={{ height: props.height }}></div>

                     {/* <Button variant="text" color="default">
                    Seleccionar
                  </Button> */}
                  </Paper>
               ) : (
                  <div className={widthClass} style={{ height: props.height }}>
                     <div id={id} style={{ height: props.height }}></div>
                  </div>
               )}
            </Grid>

            {/* Botón oculto para actualizar 'charts' */}
            <button
               style={{ visibility: "hidden", width: 0, height: 0 }}
               id="graficasPrevisualizadasComenzando"
               onClick={() => {
                  setCharts(getPrueba());
               }}
            >
               Actualizar Gráficas
            </button>
         </Grid>
      </Card>
   );
};
