{
   /* <Chart 
chart="area" 
name="valores"   
titles={["Título 1", "Título 2", "Título 3"]} 
values={[10, 20, 30]}  
inCard={true} 
width={5}/> */
}

import React, { useState, useEffect, useRef } from "react";
import { createChart } from "./charts";
// import { createChart } from "./charts_with_details";
// import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./Charts.css";
import Grid from "@mui/material/Grid";

import { v4 as uuidv4 } from "uuid";

import { Card } from "primereact/card";
import { Paper } from "@mui/material";
import { Button } from "../basics";

let prueba = null;
export function setPrueba(pr) {
   prueba = pr;
   document.getElementById("graficasPrevisualizadasComenzando").click();
}
function getPrueba() {
   return prueba;
}
const Chart = (props) => {
   const [isLoading, setIsLoading] = useState(true);
   const id = uuidv4();
   const [card, setCard] = useState(props.inCard);
   const widthClass = `width-${props.width || 10}`;
   const [showTable, SetTable] = useState(false);
   const [charts, setCharts] = useState(null);
   const [dictionary, setDictionary] = useState();
   const [dictionaryKeys, setDictionaryKeys] = useState([]);
   const [subChartsDatas, setSubChartsDatas] = useState([]);
   const subchartRefs = useRef({}); // useRef para mantener las referencias de los subchart divs
   const [historyCharts, setHistoryCharts] = useState([props.dictionary[0].history]);
   console.log("🚀 ~ Chart ~ historyCharts:", historyCharts);

   useEffect(() => {
      setDictionary(props.dictionary);
      const dictionaryKeys = props.dictionary.map((item) => item.key);
      setDictionaryKeys(dictionaryKeys);
   }, []);
   useEffect(() => {
      // console.log("🚀 ~ useEffect ~ props.searchKey:", props.searchKey);
      createChart(id, props.chart, props.name, props.titles, props.values, props.enable3D, props.searchKey, props.data, props.showDetails, dictionaryKeys);

      // Establecer isLoading después de la renderización de los gráficos
      setIsLoading(false);
   }, [props.chart, props.name, props.titles, props.values, props.inCard, props.width, props.searchKey, props.data, props.hiddens]);

   const createSubCharts = async () => {
      setSubChartsDatas([]);
      if (charts) {
         const subCharts = [];
         await Object.keys(charts).forEach(async (key, index) => {
            const chart = charts[key];
            // const dictionaryKeys = props.dictionary.map((item) => item.key);
            if (!dictionaryKeys.includes(chart.key)) return;
            if (!props.hiddens.includes(chart.key)) {
               console.log("🚀 ~ Object.keys ~ chart:", chart);
               // console.log(props.hiddens.includes(chart.key),props.hiddens,chart.key)
               let [prop, subprop] = chart.key.split(".");

               // const name = dictionary.filter((dic) => (subprop === undefined ? dic.key === chart.key : dic[prop]?.[subprop] === chart.key))[0]?.value;
               const name = dictionary.filter((dic) => dic.key === chart.key)[0]?.value;
               const history = dictionary.filter((dic) => dic.key === chart.key)[0]?.history;
               console.log("🚀 ~ Object.keys ~ name:", name, chart.title, chart.value);

               const causasContador = {};

               // dictionaryKeys.map((dicKey) => {
               //    console.log("🚀 ~ dictionaryKeys.map ~ dicKey === key:", dicKey, key);
               //    if (dicKey === key) return;
               //    console.log("🚀 ~ filteredData.forEach ~ dicKey:", dicKey);
               chart.filteredData.forEach((reg) => {
                  console.log("🚀 ~ subCharts.forEach ~ reg:", reg);
                  const causa = subprop === undefined ? reg[chart.key] : reg[prop]?.[subprop];
                  console.log("🚀 ~ charts.forEach ~ causa:", causa);
                  if (!causasContador[causa]) {
                     causasContador[causa] = 1;
                  } else {
                     causasContador[causa]++;
                  }
               });
               // });

               console.warn("cont", causasContador);

               const causasUnicas = Object.keys(causasContador);
               const conteosCausas = causasUnicas.map((causa) => causasContador[causa]);
               const suma = conteosCausas.reduce((total, numero) => total + numero, 0);

               console.log("🚀 ~ awaitObject.keys ~ dictionary:", dictionary);
               console.log("🚀 ~ awaitObject.keys ~ chart.key:", chart.key);
               name &&
                  subCharts.push({
                     indice: `subchart-${index}`,
                     key: chart.key,
                     name,
                     filteredData: chart.filteredData,
                     titles: causasUnicas.length == 0 ? [] : causasUnicas,
                     values: conteosCausas.length == 0 ? [] : conteosCausas,
                     history: history
                  });
            }
         });
         setSubChartsDatas(subCharts);
      }
   };

   useEffect(() => {
      createSubCharts();

      // Llamar a la función para crear las subcharts cuando se actualice charts
   }, [charts]);
   useEffect(() => {
      subChartsDatas.map((subchart) => {
         // console.log("🚀 ~ subChartsDatas.map ~ subchart:", subchart);
         createChart(subchart.indice, "pie", subchart.name, subchart.titles, subchart.values, props.enable3D, subchart.key, null, true, dictionaryKeys);
      });
   }, [subChartsDatas]);
   const selectSubChart = (index) => {
      setHistoryCharts((prev) => [...prev, subChartsDatas[index].history]);
      const { name, titles, values, key, filteredData } = subChartsDatas[index];
      // console.log("🚀 ~ selectSubChart ~ subChartsDatas[index]:", subChartsDatas[index]);
      createChart(id, "column", name, titles, values, props.enable3D, key, filteredData, true, dictionaryKeys);
      setCharts(null);
   };
   const reset = () => {
      setCharts(null);
      setHistoryCharts([props.dictionary[0].history]);
      createChart(id, props.chart, props.name, props.titles, props.values, props.enable3D, props.searchKey, props.data, true, dictionaryKeys);
   };

   return (
      <>
         <Card style={{ padding: props.inCard ? "0.5rem" : "0px", margin: props.inCard ? "0.5rem" : "0px" }}>
            <Grid container>
               <Grid item size={{ xs: 12 }}>
                  <div className="text-sm breadcrumbs">
                     <ul>
                        <b>{"Historial -->"}&nbsp;</b>
                        {historyCharts.map((history) => (
                           <li key={`key-history-${history}`}>{history}</li>
                        ))}
                     </ul>
                  </div>
               </Grid>
               {/* Condición para renderizar según la variable 'charts' */}
               {charts && subChartsDatas.length > 0 && dictionaryKeys.length > 0 && (
                  <Grid item size={{ xs: 12, lg: 6 }} style={{ height: `calc(${props.height} + 100px)`, overflow: "auto", paddingTop: ".2rem" }}>
                     {subChartsDatas.length > 0 &&
                        subChartsDatas.map((item, i) => (
                           <Paper elevation={12} key={`subchart-key${i}`} title={item.name} className={widthClass} style={{ marginBottom: "2rem", padding: 0 }}>
                              <div id={item.indice} style={{ height: props.height }}></div>
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

               <Grid item size={{ xs: 12, lg: charts ? 6 : 12 }} pl={3}>
                  {props.inCard ? (
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
         <br />
         {/* {card ? (
            <Card title={props.title} className={widthClass} sx={{ margin: 1 }}>
               <div id={id}></div>
            </Card>
         ) : (
            <div className={widthClass}>
               <div id={id} />
            </div>
         )} */}
      </>
   );
};

export default Chart;
