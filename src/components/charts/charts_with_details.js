import Highcharts from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import exportingInit from "highcharts/modules/exporting"; // Importa el módulo de exportación de Highcharts
import { setPrueba } from "./Chart";
import { getKeys } from "../../utils/Formats";

export const createChart = (id, chart, title, causas, conteos, enable3D, key = null, data = null, showDetails) => {
   console.log("🚀 ~ createChart ~ id", id);
   console.log("🚀 ~ createChart ~ chart", chart);
   console.log("🚀 ~ createChart ~ title", title);
   console.log("🚀 ~ createChart ~ causas", causas);
   console.log("🚀 ~ createChart ~ conteos", conteos);
   console.log("🚀 ~ createChart ~ enable3D", enable3D);
   console.log("🚀 ~ createChart ~ key", key);
   console.log("🚀 ~ createChart ~ data", data);
   console.log("🚀 ~ createChart ~ showDetails", showDetails);

   Highcharts3D(Highcharts);
   exportingInit(Highcharts);
   const finalChartConfig = [];

   finalChartConfig.push(configChart(chart));
   finalChartConfig.push(configLegend());
   finalChartConfig.push(configTitle(chart, title, conteos));
   configPlotOptions(chart, id, conteos, causas, title, causas, key, data);
   finalChartConfig.push(configPlotOptions(chart, id, conteos, causas, title, causas, key, data));
   finalChartConfig.push(configXaxis(chart, causas));
   finalChartConfig.push(configYaxis());
   finalChartConfig.push(configData(chart, causas, conteos));
   finalChartConfig.push({
      exporting: {
         enabled: true,
         buttons: {
            // Aquí puedes agregar tus botones personalizados
            contextButton: {
               menuItems: [
                  {
                     text: "Imprimir Gráfico", // Texto personalizado para el botón de impresión
                     onclick: function () {
                        this.print();
                     }
                  }
                  // {
                  //     text: 'Zoom', // Texto personalizado para el botón de impresión
                  //     onclick: function () {
                  //         this.zoomType();
                  //     }
                  // },
                  // {
                  //     text: 'Exponer Tabla', // Texto del botón personalizado
                  //     onclick: function () {

                  //     }
                  // },
               ]
            }
         }
      }
   });
   Highcharts.chart(id, Object.assign({}, ...finalChartConfig));
};
const configChart = (chart) => {
   switch (chart) {
      case "column":
      case "bar":
         return {
            chart: {
               type: `${chart}`,
               animation: false,
               options3d: {
                  enabled: true,
                  alpha: 10,
                  beta: 20,
                  depth: 100,
                  viewDistance: 25
               }
            }
         };
      case "pie":
         return {
            chart: {
               type: `${chart}`,
               options3d: {
                  enabled: true,
                  alpha: 45,
                  beta: 0
               }
            }
         };
      default:
         return {}; // Devuelve un objeto vacío si el tipo de gráfico no es reconocido
   }
};

const configLegend = () => {
   return {
      legend: {
         enabled: false

         // bubbleLegend: {
         //   enabled: true,
         //   minSize: 20,
         //   maxSize: 60,
         //   ranges: [
         //     {
         //       value: 14,
         //     },
         //     {
         //       value: 89,
         //     },
         //   ],
         // },
      }
   };
};

const configTitle = (chart, title, conteos) => {
   const total = conteos.reduce((total, numero) => total + numero, 0);

   switch (chart) {
      case "bar":
      case "column":
      case "line":
         return {
            title: {
               text: title
            },
            subtitle: {
               text: `total de registros: ${total}`
            }
         };
      case "pie":
      case "area":
         return {
            title: {
               text: title
            },
            subtitle: {
               text: `total de registros: ${total}`
            },
            accessibility: {
               point: {
                  valueSuffix: "%"
               }
            },
            tooltip: {
               pointFormat: `{series.name}: <b>{point.percentage:.1f}% de ${total} registros</b>`
            }
         };
   }
};

const configPlotOptions = (chart, id, conteos, causa, title, causasUnicas, key, data) => {
   const total = conteos.reduce((total, numero) => total + numero, 0);

   const transformData = (select, point) => {
      console.log("🚀 ~ transformData ~ point:", point);
      const result = {};
      let [prop, subprop] = key.split(".");
      console.log("key", key);
      // Filtrar los objetos que tengan el valor deseado en la clave rfc
      // const filteredData = data.filter((obj) => obj[key] === point);
      const filteredData = data.filter((obj) => (subprop === undefined ? obj[key] == point : obj[prop]?.[subprop] == point));
      console.log("🚀 ~ transformData ~ data:", data);
      console.log("🚀 ~ transformData ~ filteredData:", filteredData);

      getKeys(filteredData[0]).forEach((item, index) => {
         // console.log("🚀 ~ Object.keys ~ item !== key:", item, key, item !== key);
         if (item !== key) {
            // let [prop, subprop] = item.split(".");
            const values = filteredData.map((obj) => (subprop === undefined ? obj[item] : obj[prop]?.[subprop]));
            // const values = groupBy(data, item, false);
            // console.log("🚀 ~ getKeys ~ values:", values);
            const frequencies = {};
            values.forEach((value) => {
               frequencies[value] = (frequencies[value] || 0) + 1;
            });
            // console.log("🚀 ~ values.forEach ~ frequencies:", frequencies);
            const chartKey = `chart${index + 1}`;
            result[chartKey] = {
               key: item,
               title: Object.keys(frequencies),
               value: Object.keys(frequencies).map((title) => frequencies[title])
            };
         }
      });
            console.log("🚀 ~ getKeys ~ result:", result)
      // Object.keys(filteredData[0]).forEach((item, index) => {
      //    if (item !== key) {
      //       console.log("aqui");
      //       const values = filteredData.map((obj) => obj[item]);
      //       const frequencies = {};
      //       values.forEach((value) => {
      //          frequencies[value] = (frequencies[value] || 0) + 1;
      //       });
      //       const chartKey = `chart${index + 1}`;
      //       console.log(
      //          Object.keys(frequencies),
      //          Object.keys(frequencies).map((title) => frequencies[title])
      //       );
      //       result[chartKey] = {
      //          key: item,
      //          title: Object.keys(frequencies),
      //          value: Object.keys(frequencies).map((title) => frequencies[title])
      //       };
      //    }
      // });

      return result;
   };
   switch (chart) {
      case "bar":
      case "column":
         return {
            plotOptions: {
               series: {
                  point: {
                     events: {
                        click: function (event) {
                           setPrueba(transformData("", event.point.series.name));
                        }
                     }
                  }
               },
               column: {
                  pointPadding: 0.5,
                  // Ajusta este valor para cambiar el espaciado entre columnas
                  cursor: "pointer",
                  dataLabels: {
                     enabled: true,
                     format: "{point.y:.0f}", // Mostrar solo números enteros
                     distance: 150, // Ajusta este valor según sea necesario
                     style: {
                        color: "black",
                        fontSize: "12px",
                        fontWeight: "bold"
                     }
                  },
                  depth: 150,

                  colorByPoint: true,
                  allowPointSelect: false
               }
            }
         };
      case "pie":
      case "area":
         return {
            plotOptions: {
               series: {
                  point: {
                     events: {
                        click: function (event) {
                           transformData(id, event.point.name);
                           // Verifica qué datos contiene this.getCharts[1].data
                           // Filtra los datos
                           // Si no encuentras nada, revisa las condiciones del filtro y los datos originales
                        }
                     }
                  }
               },
               pie: {
                  cursor: "pointer",
                  allowPointSelect: true,
                  depth: 35,
                  slicedOffset: 20,
                  dataLabels: {
                     enabled: true,
                     format: `<b>{point.name}</b>: {point.y} de ${total} registros`, // Incluye {point.y} en el formato
                     // format: `<b>{point.name}</b>: {point.percentage:.1f} % de un total de registros`, // Formato para mostrar el nombre y el porcentaje
                     distance: 30, // Ajusta la distancia para que las etiquetas estén encima las porciones
                     // Cambia la alineación para que las etiquetas estén encima de las porciones
                     alignTo: "plotEdges",
                     // Utiliza el conector para unir las etiquetas con las porciones
                     connectorPadding: 5
                  }
               }
            }
         };
   }
};

const configXaxis = (chart, titles) => {
   switch (chart) {
      case "line":
      case "area":
         return {
            xAxis: {
               type: "category",
               categories: ["", ...titles],
               title: {
                  text: "total",
                  align: "middle"
               },
               labels: {
                  autoRotation: [-45, -90],
                  style: {
                     fontSize: "13px",
                     fontFamily: "Verdana, sans-serif"
                  }
               }
            }
         };
      default:
         return {
            xAxis: {
               type: "category",
               categories: ["", ...titles],
               crosshair: true,
               accessibility: {
                  description: "Countries"
               }
               // title: {
               //     text: "total",
               //     align: "middle"
               // },
               // labels: {
               //     autoRotation: [-45, -90],
               //     style: {
               //         fontSize: '13px',
               //         fontFamily: 'Verdana, sans-serif'
               //     }
               // }
            }
         };
   }
};
const configYaxis = () => {
   return {
      yAxis: {
         title: {
            text: "total",
            align: "middle"
         }
      }
   };
};

const configData = (chart, causas, conteos) => {
   switch (chart) {
      case "bar":
      case "column":
         return {
            series: causas.map((name, index) => ({
               name: name,
               type: chart,
               data: [{ y: conteos[index], color: "#" + Math.floor(Math.random() * 16777215).toString(16) }],

               dataLabels: {
                  enabled: true,
                  align: "top",
                  rotation: 0,
                  margin: "1rem",
                  color: "#FFFFFF",
                  verticalAlign: "top", // Alinea el texto en la parte superior
                  // format: '{point.name}: {point.y:.1f}', // Mostrar el nombre y el valor
                  y: -40,
                  shadow: true,
                  format: "{point.y:.0f}", // Mostrar solo números enteros
                  distance: 150, // Ajusta este valor según sea necesario
                  style: {
                     color: "black",
                     fontSize: "17px",
                     fontWeight: "bold"
                  },
                  crop: false, // No recortar etiquetas fuera del área de la gráfica
                  overflow: "none", // Mostrar etiquetas fuera del área de la gráfica
                  inside: true // Coloca las etiquetas dentro de las barras o columnas
                  // formatter: function() { // Formateador personalizado para visibilidad
                  //   if (this.y < 5) { // Ajusta este valor según tus necesidades
                  //     return ''; // No mostrar etiquetas para valores muy pequeños
                  //   }
                  //   return this.point.name + ': ' + this.y;
                  // }
               }
            }))
         };
      case "pie":
      case "area":
         return {
            series: [
               {
                  type: chart,
                  name: "Porcentaje obtenido",
                  data: causas.map((value, index) => ({
                     name: value,
                     y: conteos[index],
                     sliced: index === 2,
                     selected: index === 2
                  }))
               }
            ]
         };

      case "line":
         return {
            series: [
               {
                  data: conteos.map((value, index) => ({
                     y: value, // El valor del punto en la serie
                     x: index + 1 // El índice del punto más 1 (para empezar desde 1)
                  }))
               }
            ]
         };
   }
};
