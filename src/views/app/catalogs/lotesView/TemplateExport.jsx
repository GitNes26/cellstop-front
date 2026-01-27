import React, { useRef, useState } from "react";
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
   Checkbox,
   List,
   ListItem,
   ListItemButton,
   ListItemIcon,
   ListItemText,
   Box,
   Paper,
   Typography,
   Chip,
   IconButton,
   Tooltip,
   TextField,
   Grid,
   Alert,
   CircularProgress,
   Divider
} from "@mui/material";
import { CloudDownload, Preview, SelectAll, Deselect, Info, FormatColorFill, InsertPhoto, TextFields, BorderAll, AspectRatio, Receipt } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { utils, writeFile } from "xlsx-js-style";
import { useBarcodeScanner } from "../../../../hooks/useBarcodeScanner";
import dayjs from "dayjs";

const TemplateExport = ({ open, onClose, data }) => {
   // Estados
   const [plantillas, setPlantillas] = useState({
      "PLANTILLA A4": { columnas: 10, filas: 28, nombre: "A4", etiquetasPorHoja: 500 },
      "PLANTILLA TABLOIDE": { columnas: 14, filas: 40, nombre: "Tabloide", etiquetasPorHoja: 500 }
   });
   const [tipoPlantilla, setTipoPlantilla] = useState("PLANTILLA A4");
   const [elementos, setElementos] = useState([]);
   const [elementosSeleccionados, setElementosSeleccionados] = useState([]);
   const [configuracion, setConfiguracion] = useState({
      colorFondo: "034AAB",
      colorTexto: "FFFFFF",
      mostrarBordes: true
   });
   const [vistaPreviaGenerada, setVistaPreviaGenerada] = useState(null);
   const [cargando, setCargando] = useState(false);

   // Medidas exactas en puntos (1 punto = 1/72 pulgada)
   // Medidas exactas en puntos (1 punto = 1/72 pulgada)
   const medidas = {
      izquierda: {
         ancho: 19.57, // puntos
         altoTelefono: 23.25,
         altoIccid: 13.5,
         altoFecha: 13.5,
         fuenteTelefono: 18,
         fuenteIccid: 10,
         fuenteFecha: 10
      },
      derecha: {
         ancho: 9, // puntos
         altoTotal: 50.25, // 23.25 + 13.5 + 13.5
         fuenteActiva: 8,
         fuenteCincuenta: 20
      }
   };

   // Parsear datos de texto
   const parsearDatosDesdeTexto = (texto) => {
      const lineas = texto.split("\n").filter((line) => line.trim() !== "");
      const datos = [];

      for (let i = 0; i < lineas.length; i += 3) {
         if (i + 2 < lineas.length) {
            datos.push({
               id: datos.length + 1,
               celular: lineas[i].trim(),
               iccid: lineas[i + 1].trim(),
               fecha: lineas[i + 2].replace("VIG. ", "").trim(),
               nombre: `Chip ${datos.length + 1}`
            });
         }
      }

      return datos;
   };

   // Inicializar datos
   React.useEffect(() => {
      if (open && data) {
         let datosParseados = data;
         console.log("🚀 ~ TemplateExport ~ data:", data)

         // Si data es texto plano, parsearlo
         if (typeof data === "string") {
            datosParseados = parsearDatosDesdeTexto(data);
         }

         const elementosData = datosParseados.map((item, index) => ({
            id: item.id || index,
            nombre: item.nombre || `Chip ${index + 1}`,
            celular: item.celular,
            iccid: item.iccid,
            fecha: dayjs(item.fecha).add(1, "year").format("DD MMM YYYY").toString() || "S/F",
            seleccionado: true
         }));

         setElementos(elementosData);
         setElementosSeleccionados(elementosData);
         generarVistaPrevia(elementosData);
      }
   }, [open, data]);

   // Toggle selección de elemento
   const toggleElemento = (id) => {
      // setElementos((prev) => prev.map((el) => (el.id === id ? { ...el, seleccionado: !el.seleccionado } : el)));

      const nuevosElementos = elementos.map((el) => (el.id === id ? { ...el, seleccionado: !el.seleccionado } : el));
      setElementos(nuevosElementos);
      const seleccionados = nuevosElementos.filter((el) => el.seleccionado);
      setElementosSeleccionados(seleccionados);
      generarVistaPrevia(seleccionados);
   };

   // Seleccionar todos
   const seleccionarTodos = () => {
      const todosSeleccionados = elementos.map((el) => ({ ...el, seleccionado: true }));
      setElementos(todosSeleccionados);
      setElementosSeleccionados(todosSeleccionados);
      generarVistaPrevia(todosSeleccionados);
   };

   // Deseleccionar todos
   const deseleccionarTodos = () => {
      const todosDeseleccionados = elementos.map((el) => ({ ...el, seleccionado: false }));
      setElementos(todosDeseleccionados);
      setElementosSeleccionados([]);
      setVistaPreviaGenerada(null);
   };

   // Estilos para Excel
   const obtenerEstilosCelda = (tipo, valor) => {
      const bordesNegros = {
         top: { style: "medium", color: { rgb: "000000" } },
         bottom: { style: "medium", color: { rgb: "000000" } },
         left: { style: "medium", color: { rgb: "000000" } },
         right: { style: "medium", color: { rgb: "000000" } }
      };

      switch (tipo) {
         case "telefono":
            return {
               font: { name: "Arial", sz: medidas.izquierda.fuenteTelefono, bold: true },
               alignment: { vertical: "center", horizontal: "center" },
               border: configuracion.mostrarBordes
                  ? {
                       top: { style: "medium", color: { rgb: "000000" } },
                       left: { style: "medium", color: { rgb: "000000" } },
                       right: { style: "medium", color: { rgb: "000000" } }
                    }
                  : {}
            };
         case "iccid":
            return {
               font: { name: "Arial", sz: medidas.izquierda.fuenteIccid },
               alignment: { vertical: "center", horizontal: "center" },
               border: configuracion.mostrarBordes
                  ? {
                       left: { style: "medium", color: { rgb: "000000" } },
                       right: { style: "medium", color: { rgb: "000000" } }
                    }
                  : {}
            };
         case "fecha":
            return {
               font: { name: "Arial", sz: medidas.izquierda.fuenteFecha, bold: true },
               alignment: { vertical: "center", horizontal: "center" },
               border: configuracion.mostrarBordes
                  ? {
                       left: { style: "medium", color: { rgb: "000000" } },
                       bottom: { style: "medium", color: { rgb: "000000" } },
                       right: { style: "medium", color: { rgb: "000000" } }
                    }
                  : {}
            };
         case "activa":
            // Texto con dos tamaños diferentes
            const lines = valor.split(" CON ");
            return {
               font: { name: "Arial", bold: true, color: { rgb: configuracion.colorTexto } },
               fill: { fgColor: { rgb: configuracion.colorFondo } },
               alignment: {
                  vertical: "center",
                  horizontal: "center",
                  wrapText: true
               },
               border: configuracion.mostrarBordes
                  ? {
                       top: { style: "medium", color: { rgb: "000000" } },
                       left: { style: "medium", color: { rgb: "000000" } },
                       right: { style: "medium", color: { rgb: "000000" } },
                       bottom: { style: "medium", color: { rgb: "000000" } }
                    }
                  : {}
            };
         default:
            return {};
      }
   };

   // Generar vista previa mejorada
   const generarVistaPrevia = (elementosSeleccionados) => {
      if (elementosSeleccionados.length === 0) {
         setVistaPreviaGenerada(null);
         return;
      }

      const plantilla = plantillas[tipoPlantilla];
      const etiquetasPorFila = tipoPlantilla === "PLANTILLA TABLOIDE" ? 7 : 5;
      const matrizVistaPrevia = [];

      elementosSeleccionados.slice(0, 6).forEach((elemento, index) => {
         const filaBase = Math.floor(index / etiquetasPorFila) * 3;
         const columnaBase = (index % etiquetasPorFila) * 2;

         // Teléfono
         if (!matrizVistaPrevia[filaBase]) matrizVistaPrevia[filaBase] = [];
         matrizVistaPrevia[filaBase][columnaBase] = {
            valor: elemento.celular,
            tipo: "telefono",
            altura: medidas.izquierda.altoTelefono
         };

         // ICCID
         if (!matrizVistaPrevia[filaBase + 1]) matrizVistaPrevia[filaBase + 1] = [];
         matrizVistaPrevia[filaBase + 1][columnaBase] = {
            valor: elemento.iccid,
            tipo: "iccid",
            altura: medidas.izquierda.altoIccid
         };

         // Fecha
         if (!matrizVistaPrevia[filaBase + 2]) matrizVistaPrevia[filaBase + 2] = [];
         matrizVistaPrevia[filaBase + 2][columnaBase] = {
            valor: `VIG. ${elemento.fecha}`,
            tipo: "fecha",
            altura: medidas.izquierda.altoFecha
         };

         // ACTIVA CON $50 (celda combinada)
         matrizVistaPrevia[filaBase][columnaBase + 1] = {
            valor: "ACTIVA CON $50",
            tipo: "activa",
            altura: medidas.derecha.altoTotal,
            esCombinada: true,
            filaInicio: filaBase,
            filaFin: filaBase + 2,
            columnaInicio: columnaBase + 1
         };
      });

      setVistaPreviaGenerada({
         matriz: matrizVistaPrevia,
         elementos: elementosSeleccionados.length,
         columnasTotales: plantilla.columnas,
         filasUsadas: matrizVistaPrevia.length,
         etiquetasPorFila: etiquetasPorFila
      });
   };

   // Generar Excel con medidas exactas
   const generarExcelConEstilos = () => {
      if (elementosSeleccionados.length === 0) {
         alert("Seleccione al menos un elemento");
         return;
      }

      setCargando(true);

      try {
         const plantilla = plantillas[tipoPlantilla];
         const etiquetasPorFila = tipoPlantilla === "PLANTILLA TABLOIDE" ? 7 : 5;
         const maxElementosPorHoja = plantilla.etiquetasPorHoja;
         const totalHojas = Math.ceil(elementosSeleccionados.length / maxElementosPorHoja);

         const wb = utils.book_new();

         for (let hojaNum = 0; hojaNum < totalHojas; hojaNum++) {
            const startIndex = hojaNum * maxElementosPorHoja;
            const endIndex = Math.min(startIndex + maxElementosPorHoja, elementosSeleccionados.length);
            const elementosHoja = elementosSeleccionados.slice(startIndex, endIndex);

            const wsData = [];
            const merges = [];
            const colWidths = [];
            const rowHeights = [];

            // Configurar anchos de columna
            for (let col = 0; col < plantilla.columnas; col++) {
               colWidths.push({
                  wch:
                     col % 2 === 0
                        ? medidas.izquierda.ancho /* * 0.75 */ // Conversión aproximada puntos a píxeles
                        : medidas.derecha.ancho /* * 0.75 */
               });
            }

            elementosHoja.forEach((elemento, index) => {
               const filaBase = Math.floor(index / etiquetasPorFila) * 3;
               const columnaBase = (index % etiquetasPorFila) * 2;

               // Configurar altos de fila
               rowHeights[filaBase] = { hch: medidas.izquierda.altoTelefono /* * 0.75 */ };
               rowHeights[filaBase + 1] = { hch: medidas.izquierda.altoIccid /* * 0.75 */ };
               rowHeights[filaBase + 2] = { hch: medidas.izquierda.altoFecha /* * 0.75 */ };

               // Teléfono
               if (!wsData[filaBase]) wsData[filaBase] = [];
               wsData[filaBase][columnaBase] = {
                  v: elemento.celular,
                  s: obtenerEstilosCelda("telefono", elemento.celular)
               };

               // ICCID
               if (!wsData[filaBase + 1]) wsData[filaBase + 1] = [];
               wsData[filaBase + 1][columnaBase] = {
                  v: elemento.iccid,
                  s: obtenerEstilosCelda("iccid", elemento.iccid)
               };

               // Fecha
               if (!wsData[filaBase + 2]) wsData[filaBase + 2] = [];
               wsData[filaBase + 2][columnaBase] = {
                  v: `VIG. ${elemento.fecha}`,
                  s: obtenerEstilosCelda("fecha", elemento.fecha)
               };

               // ACTIVA CON $50
               if (!wsData[filaBase]) wsData[filaBase] = [];
               wsData[filaBase][columnaBase + 1] = {
                  v: "ACTIVA CON $50",
                  s: {
                     font: {
                        name: "Arial",
                        bold: true,
                        color: { rgb: configuracion.colorTexto },
                        sz: medidas.derecha.fuenteActiva
                     },
                     fill: { fgColor: { rgb: configuracion.colorFondo } },
                     alignment: {
                        vertical: "center",
                        horizontal: "center",
                        wrapText: true
                     },
                     border: configuracion.mostrarBordes
                        ? {
                             top: { style: "medium", color: { rgb: "000000" } },
                             bottom: { style: "medium", color: { rgb: "000000" } },
                             left: { style: "medium", color: { rgb: "000000" } },
                             right: { style: "medium", color: { rgb: "000000" } }
                          }
                        : {}
                  }
               };

               // Merge para celda derecha (3 filas)
               merges.push({
                  s: { r: filaBase, c: columnaBase + 1 },
                  e: { r: filaBase + 2, c: columnaBase + 1 }
               });
            });

            // Crear worksheet
            const ws = utils.aoa_to_sheet(wsData);

            // Aplicar configuraciones
            ws["!merges"] = merges;
            ws["!cols"] = colWidths;
            ws["!rows"] = rowHeights;

            // 🖨️ CONFIGURACIONES DE IMPRESIÓN
            ws["!pageSetup"] = {
               orientation: "landscape", // 👉 Horizontal | "portrait" Vertical
               scale: 95, // 👉 95% de escala
               fitToWidth: 1, // Ajusta al ancho (opcional)
               fitToHeight: 0
            };

            // 📏 MÁRGENES EN 0
            ws["!margins"] = {
               left: 0,
               right: 0,
               top: 0,
               bottom: 0,
               header: 0,
               footer: 0
            };

            // Nombre de la hoja
            const sheetName = totalHojas > 1 ? `Etiquetas ${hojaNum + 1}` : "Etiquetas";
            utils.book_append_sheet(wb, ws, sheetName);
         }

         // Descargar archivo
         const fecha = new Date().toISOString().split("T")[0];
         writeFile(wb, `Etiquetas_Chips_${fecha}.xlsx`);

         setCargando(false);
         onClose();
      } catch (error) {
         console.error("Error al generar Excel:", error);
         alert("Error al generar el archivo Excel");
         setCargando(false);
      }
   };

   // Actualizar configuración
   const actualizarConfiguracion = (campo, valor) => {
      setConfiguracion((prev) => ({
         ...prev,
         [campo]: valor
      }));
   };

   // Componente de vista previa mejorada
   const VistaPreviaMejorada = () => {
      if (!vistaPreviaGenerada) return null;

      return (
         <Box className="border rounded-lg p-4 bg-white">
            <Box className="flex justify-between items-center mb-4">
               {/* <Typography variant="h6" className="font-bold flex items-center gap-2">
                  <AspectRatio className="text-blue-500" />
                  Vista Previa de Etiquetas
               </Typography> */}
               <Typography variant="h6" className="font-bold flex items-center gap-2">
                  <Receipt className="text-blue-500" />
                  Detalles de la etiqueta
               </Typography>

               <Chip label={`${vistaPreviaGenerada.elementos} etiquetas`} color="primary" size="small" />
            </Box>
            {/* Grid de vista previa */}
            <Box
               sx={{
                  overflow: "auto",
                  maxHeight: "500px",
                  border: "2px solid #d1d5db",
                  p: 2,
                  bgcolor: "#f9fafb",
                  borderRadius: "12px",
                  display: "none"
               }}
            >
               <Grid container component="div" display="inline-block">
                  {vistaPreviaGenerada.matriz.map((fila, rowIndex) => (
                     <Grid container key={rowIndex} direction="row" wrap="nowrap" sx={{ width: "auto" }}>
                        {Array(vistaPreviaGenerada.columnasTotales)
                           .fill(null)
                           .map((_, colIndex) => {
                              const celda = fila && fila[colIndex];
                              const esIzquierda = colIndex % 2 === 0;
                              const esActiva = celda?.tipo === "activa";
                              const altura = celda?.altura || 22;

                              const widthValue = esIzquierda ? 120 : 55;

                              // CELDA VACÍA
                              if (!celda) {
                                 return (
                                    <Grid
                                       item
                                       key={`${rowIndex}-${colIndex}`}
                                       sx={{
                                          width: `${widthValue}px`,
                                          height: "20px",
                                          border: "1px solid #e5e7eb"
                                       }}
                                    />
                                 );
                              }

                              // CELDA CON CONTENIDO
                              return (
                                 <Grid
                                    item
                                    key={`${rowIndex}-${colIndex}`}
                                    sx={{
                                       width: `${widthValue}px`,
                                       height: `${altura}px`,
                                       border: "2px solid black",
                                       display: "flex",
                                       alignItems: "center",
                                       justifyContent: "center",
                                       bgcolor: esActiva ? `#${configuracion.colorFondo}` : esIzquierda ? "rgb(239 246 255)" : "transparent",
                                       color: esActiva ? "white" : "inherit",
                                       fontWeight: esActiva ? "bold" : "normal"
                                    }}
                                 >
                                    {/* CONTENIDO DE CELDA */}
                                    {esActiva ? (
                                       <Grid textAlign="center" lineHeight={1} rowSpacing={3}>
                                          <Typography fontSize="0.5rem" fontWeight="bold">
                                             ACTIVA CON
                                          </Typography>
                                          <Typography fontSize="1.25rem" fontWeight="bold">
                                             $50
                                          </Typography>
                                       </Grid>
                                    ) : (
                                       <Grid rowSpacing={2} textAlign="center" px={0.5}>
                                          <Typography
                                             sx={{
                                                fontWeight: celda.tipo === "telefono" ? "bold" : undefined,
                                                fontSize:
                                                   celda.tipo === "telefono"
                                                      ? "1rem"
                                                      : celda.tipo === "iccid"
                                                      ? "0.55rem"
                                                      : celda.tipo === "fecha"
                                                      ? "0.7rem"
                                                      : "0.75rem",
                                                fontStyle: celda.tipo === "fecha" ? "italic" : "normal"
                                             }}
                                          >
                                             {celda.valor}
                                          </Typography>
                                       </Grid>
                                    )}
                                 </Grid>
                              );
                           })}
                     </Grid>
                  ))}
               </Grid>
            </Box>
            {/* Información detallada */}
            <Box className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <Paper className="p-4">
                  <Typography variant="subtitle2" className="font-bold text-gray-600 mb-2 flex items-center gap-2">
                     <TextFields className="text-blue-500" />
                     Medidas
                  </Typography>
                  <div className="space-y-1 text-sm">
                     <div className="flex justify-between">
                        <span className="text-gray-600">Teléfono:</span>
                        <span className="font-medium">
                           {medidas.izquierda.ancho} × {medidas.izquierda.altoTelefono} pt
                        </span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">ICCID:</span>
                        <span className="font-medium">
                           {medidas.izquierda.ancho} × {medidas.izquierda.altoIccid} pt
                        </span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">Fecha:</span>
                        <span className="font-medium">
                           {medidas.izquierda.ancho} × {medidas.izquierda.altoFecha} pt
                        </span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">ACTIVA CON $50:</span>
                        <span className="font-medium">
                           {medidas.derecha.ancho} × {medidas.derecha.altoTotal} pt
                        </span>
                     </div>
                  </div>
               </Paper>

               <Paper className="p-4">
                  <Typography variant="subtitle2" className="font-bold text-gray-600 mb-2 flex items-center gap-2">
                     <FormatColorFill className="text-blue-500" />
                     Fuentes
                  </Typography>
                  <div className="space-y-1 text-sm">
                     <div className="flex justify-between">
                        <span className="text-gray-600">Teléfono:</span>
                        <span className="font-medium">Arial {medidas.izquierda.fuenteTelefono}pt Bold</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">ICCID:</span>
                        <span className="font-medium">Arial {medidas.izquierda.fuenteIccid}pt</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">Fecha:</span>
                        <span className="font-medium">Arial {medidas.izquierda.fuenteFecha}pt Bold</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">ACTIVA CON:</span>
                        <span className="font-medium">Arial {medidas.derecha.fuenteActiva}pt Bold</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">$50:</span>
                        <span className="font-medium">Arial {medidas.derecha.fuenteCincuenta}pt Bold</span>
                     </div>
                  </div>
               </Paper>

               <Paper className="p-4">
                  <Typography variant="subtitle2" className="font-bold text-gray-600 mb-2 flex items-center gap-2">
                     <BorderAll className="text-blue-500" />
                     Bordes
                  </Typography>
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-gray-600">Mostrar bordes:</span>
                        <Checkbox checked={configuracion.mostrarBordes} onChange={(e) => actualizarConfiguracion("mostrarBordes", e.target.checked)} size="small" />
                     </div>
                     <div className="border-2 border-black p-2 text-center">
                        <Typography variant="caption" className="font-bold">
                           Borde grueso negro
                        </Typography>
                     </div>
                  </div>
               </Paper>

               <Paper className="p-4">
                  <Typography variant="subtitle2" className="font-bold text-gray-600 mb-2">
                     Estadísticas
                  </Typography>
                  <div className="space-y-1 text-sm">
                     <div className="flex justify-between">
                        <span className="text-gray-600">Plantilla:</span>
                        <span className="font-medium">{plantillas[tipoPlantilla].nombre}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">Etiquetas/fila:</span>
                        <span className="font-medium">{vistaPreviaGenerada.etiquetasPorFila}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">Etiquetas/hoja:</span>
                        <span className="font-medium">{plantillas[tipoPlantilla].etiquetasPorHoja}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">Hojas necesarias:</span>
                        <span className="font-medium">{Math.ceil(elementosSeleccionados.length / plantillas[tipoPlantilla].etiquetasPorHoja)}</span>
                     </div>
                  </div>
               </Paper>
            </Box>
            {/* Ejemplo de etiqueta individual */}
            <Box className="mt-3">
               <Typography variant="subtitle1" className="font-bold mb-3">
                  Ejemplo de Etiqueta Individual
               </Typography>
               <Grid className="flex max-w-md mx-auto">
                  {/* Lado izquierdo */}
                  <Grid className="border-black border-2 p-1 h-full">
                     <Box className="flex items-center justify-center bg-blue-50" style={{ height: `${medidas.izquierda.altoTelefono}px` }}>
                        <Typography fontSize={medidas.izquierda.fuenteTelefono} fontWeight={"bold"}>
                           8721188764
                        </Typography>
                     </Box>
                     <Box className=" flex items-center justify-center bg-blue-50" style={{ height: `${medidas.izquierda.altoIccid}px` }}>
                        <Typography fontSize={medidas.izquierda.fuenteIccid}>8952020925230160572</Typography>
                     </Box>
                     <Box className="flex items-center justify-center bg-blue-50" style={{ height: `${medidas.izquierda.altoFecha}px` }}>
                        <Typography fontSize={medidas.izquierda.fuenteIccid} fontWeight={"bold"}>
                           VIG. 29 OCT 2026
                        </Typography>
                     </Box>
                  </Grid>

                  {/* Lado derecho */}
                  <Grid
                     className="border-black border-2 border-l-0 p-1 flex items-center justify-center text-white"
                     style={{
                        backgroundColor: `#${configuracion.colorFondo}`
                        // height: `${medidas.derecha.altoTotal}px`
                     }}
                  >
                     <div className="text-center leading-tight">
                        <div className="text-xs font-bold">ACTIVA CON</div>
                        <div className="text-2xl font-bold">$50</div>
                     </div>
                  </Grid>
               </Grid>
            </Box>
         </Box>
      );
   };

   //#region buscador y lista de Elementos
   const [search, setSearch] = useState("");
   const listRef = useRef(null);

   // integrar hook
   const { inputRef } = useBarcodeScanner({
      onScan: (code) => handleScan(code)
   });

   // const toggleElemento = (id) => {
   //    setElementos((prev) => prev.map((el) => (el.id === id ? { ...el, seleccionado: !el.seleccionado } : el)));
   // };

   // selección por scanner
   const handleScan = (code) => {
      const item = elementos.find((el) => el.id.toString() === code || el.iccid === code || el.celular === code);

      if (!item) return "not_found";
      if (item.seleccionado) return "duplicate";

      toggleElemento(item.id);
      scrollToItem(item.id);

      return "ok";
   };

   const scrollToItem = (id) => {
      const container = listRef.current;
      if (!container) return;

      const el = container.querySelector(`#item-${id}`);
      if (el)
         if (container) {
            container.scrollTop = el.offsetTop - 40;
         }
   };

   const elementosFiltrados = elementos.filter((e) => `${e.id} ${e.nombre} ${e.iccid} ${e.celular}`.toLowerCase().includes(search.toLowerCase()));
   //#endregion

   return (
      <Dialog
         open={open}
         onClose={onClose}
         maxWidth="xl"
         fullWidth
         PaperProps={{
            className: "min-h-[95vh] min-w-[95vw]"
         }}
      >
         <DialogTitle className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-gray-50">
            <Box className="flex items-center gap-3">
               <InsertPhoto className="text-blue-600" />
               <div>
                  <Typography variant="h6" className="font-bold">
                     Generador de Etiquetas para Chips
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                     Formato exacto con medidas precisas para impresión
                  </Typography>
               </div>
            </Box>
            <Chip label={`${elementosSeleccionados.length} chips seleccionados`} color="primary" size="small" />
         </DialogTitle>

         <Divider />

         <DialogContent className="p-0">
            <Grid container className="h-full" paddingTop={0} marginTop={0}>
               {/* Panel izquierdo: Configuración y selección */}
               <Grid size={{ xs: 12, md: 4 }} className="border-r p-0 px-2">
                  <Box className="space-y-6">
                     {/* Selector de plantilla */}
                     <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography variant="subtitle1" className="font-bold mb-4 flex items-center gap-2">
                           <AspectRatio className="text-blue-500" />
                           Plantilla de Impresión
                        </Typography>
                        <FormControl fullWidth>
                           <InputLabel>Formato de papel</InputLabel>
                           <Select
                              value={tipoPlantilla}
                              onChange={(e) => {
                                 setTipoPlantilla(e.target.value);
                                 generarVistaPrevia(elementosSeleccionados);
                              }}
                              label="Formato de papel"
                           >
                              {Object.entries(plantillas).map(([nombre, datos]) => (
                                 <MenuItem key={nombre} value={nombre}>
                                    <Box className="flex flex-col">
                                       <span className="font-medium">{datos.nombre}</span>
                                       <span className="text-xs text-gray-500">
                                          {datos.columnas} columnas × {datos.filas} filas
                                       </span>
                                       <span className="text-xs text-gray-500">{datos.etiquetasPorHoja} etiquetas por hoja</span>
                                    </Box>
                                 </MenuItem>
                              ))}
                           </Select>
                        </FormControl>
                        <Alert severity="info" sx={{ fontSize: 12 }}>
                           Cada etiqueta ocupa 3 filas × 2 columnas
                        </Alert>
                     </Box>

                     {/* Configuración de colores */}
                     <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography variant="subtitle1" className="font-bold flex items-center gap-2">
                           <FormatColorFill className="text-blue-500" />
                           Color de Fondo
                        </Typography>
                        <Box className="flex items-center gap-4">
                           <TextField
                              type="color"
                              value={`#${configuracion.colorFondo}`}
                              onChange={(e) => actualizarConfiguracion("colorFondo", e.target.value.replace("#", ""))}
                              className="flex-1"
                           />
                           <Box className="w-12 h-12 rounded border" style={{ backgroundColor: `#${configuracion.colorFondo}` }} />
                        </Box>
                        <Typography variant="caption" className="text-gray-500 mt-2 block">
                           Color del panel "ACTIVA CON $50"
                        </Typography>
                     </Box>

                     {/* Lista de chips */}
                     {/* <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box className="flex justify-between items-center">
                           <Typography variant="subtitle1" className="font-bold">
                              Selección de Chips
                           </Typography>
                           <Box className="space-x-1">
                              <Tooltip title="Seleccionar todos">
                                 <IconButton size="small" onClick={seleccionarTodos}>
                                    <SelectAll fontSize="small" />
                                 </IconButton>
                              </Tooltip>
                              <Tooltip title="Deseleccionar todos">
                                 <IconButton size="small" onClick={deseleccionarTodos}>
                                    <Deselect fontSize="small" />
                                 </IconButton>
                              </Tooltip>
                           </Box>
                        </Box>

                        <Box className="overflow-auto max-h-[280px] border rounded-lg">
                           <List dense>
                              {elementos.map((elemento) => (
                                 <ListItem
                                    key={elemento.id}
                                    disablePadding
                                    secondaryAction={<Checkbox edge="end" checked={elemento.seleccionado} onChange={() => toggleElemento(elemento.id)} size="small" />}
                                 >
                                    <ListItemButton onClick={() => toggleElemento(elemento.id)} className="py-2">
                                       <ListItemIcon>
                                          <Box className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                             <Typography variant="caption" className="font-bold text-blue-600">
                                                {elemento.id}
                                             </Typography>
                                          </Box>
                                       </ListItemIcon>
                                       <ListItemText
                                          primary={
                                             <Typography variant="body2" className="font-medium">
                                                {elemento.nombre}
                                             </Typography>
                                          }
                                          secondary={
                                             <Box>
                                                <Typography variant="caption" className="text-gray-500 block">
                                                   {elemento.celular}
                                                </Typography>
                                                <Typography variant="caption" className="text-gray-400 block">
                                                   {elemento.iccid}
                                                </Typography>
                                             </Box>
                                          }
                                       />
                                    </ListItemButton>
                                 </ListItem>
                              ))}
                           </List>
                        </Box>
                     </Box> */}
                     <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {/* SEARCH */}
                        <input
                           ref={inputRef}
                           type="text"
                           className="border border-gray-400 p-2 rounded-xl w-full"
                           placeholder="Buscar o escanear código..."
                           onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* LISTA */}
                        <Box className="overflow-auto max-h-[260px] border border-gray-400 rounded-lg" ref={listRef}>
                           <List dense>
                              {elementosFiltrados.map((elemento) => (
                                 <ListItem
                                    id={`item-${elemento.id}`}
                                    key={elemento.id}
                                    disablePadding
                                    secondaryAction={<Checkbox edge="end" checked={elemento.seleccionado} onChange={() => toggleElemento(elemento.id)} size="small" />}
                                 >
                                    <ListItemButton onClick={() => toggleElemento(elemento.id)} className="py-2">
                                       <ListItemIcon>
                                          <Box className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                             <Typography variant="caption" className="font-bold text-blue-600">
                                                {elemento.id}
                                             </Typography>
                                          </Box>
                                       </ListItemIcon>
                                       <ListItemText
                                          primary={<Typography className="font-medium">{elemento.nombre}</Typography>}
                                          secondary={
                                             <Box>
                                                <Typography variant="caption">{elemento.celular}</Typography>
                                                <Typography variant="caption" className="block text-gray-500">
                                                   {elemento.iccid}
                                                </Typography>
                                             </Box>
                                          }
                                       />
                                    </ListItemButton>
                                 </ListItem>
                              ))}
                           </List>
                        </Box>
                     </Box>
                  </Box>
               </Grid>

               {/* Panel derecho: Vista previa */}
               <Grid size={{ xs: 12, md: 8 }} className="p-4">
                  <Box className="h-full flex flex-col">
                     {/* <Box className="flex justify-between items-center mb-4">
                        <Typography variant="h5" className="font-bold">
                           Vista Previa - {plantillas[tipoPlantilla]?.nombre}
                        </Typography>
                        <Button
                           variant="outlined"
                           startIcon={<Preview />}
                           onClick={() => generarVistaPrevia(elementosSeleccionados)}
                           disabled={elementosSeleccionados.length === 0}
                        >
                           Actualizar Vista
                        </Button>
                     </Box> */}

                     {vistaPreviaGenerada ? (
                        <>
                           <VistaPreviaMejorada />
                           {/* BADGES */}
                           <Box sx={{ border: 1, borderRadius: 1, p: 2, mt: 1, maxHeight: 300, overflow: "auto" }}>
                              <Box className="flex flex-wrap gap-1">
                                 {elementos
                                    .filter((el) => el.seleccionado)
                                    .map((el) => (
                                       <Chip key={el.id} label={el.celular} color="primary" size="small" onDelete={() => toggleElemento(el.id)} />
                                    ))}
                              </Box>
                           </Box>
                        </>
                     ) : (
                        <Paper className="p-12 text-center flex-1 flex flex-col items-center justify-center">
                           <Info className="text-gray-400 text-6xl mb-4" />
                           <Typography className="text-gray-500 mb-2 text-lg">Seleccione chips para generar vista previa</Typography>
                           <Typography variant="body2" className="text-gray-400 max-w-md">
                              Cada etiqueta mostrará el teléfono, ICCID, fecha de vigencia y el panel "ACTIVA CON $50" con las medidas y formatos especificados para
                              impresión profesional.
                           </Typography>
                        </Paper>
                     )}
                  </Box>
               </Grid>
            </Grid>
         </DialogContent>

         <Divider />

         <DialogActions className="p-4">
            <Button onClick={onClose} color="inherit" disabled={cargando}>
               Cancelar
            </Button>
            <Button
               variant="contained"
               startIcon={cargando ? <CircularProgress size={20} color="inherit" /> : <CloudDownload />}
               onClick={generarExcelConEstilos}
               disabled={elementosSeleccionados.length === 0 || cargando}
               size="large"
            >
               {cargando ? "Generando Excel..." : `Exportar ${elementosSeleccionados.length} etiquetas`}
            </Button>
         </DialogActions>
      </Dialog>
   );
};

// Componente principal con botón
const GeneradorEtiquetasButton = ({ data }) => {
   const [dialogOpen, setDialogOpen] = useState(false);

   return (
      <>
         <Button variant="contained" startIcon={<CloudDownload />} onClick={() => setDialogOpen(true)} size="large">
            Generar Etiquetas Excel
         </Button>

         <TemplateExport open={dialogOpen} onClose={() => setDialogOpen(false)} data={data} />
      </>
   );
};

export { GeneradorEtiquetasButton, TemplateExport };
// export default GeneradorEtiquetasButton;
