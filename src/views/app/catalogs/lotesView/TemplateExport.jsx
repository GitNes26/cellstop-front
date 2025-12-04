import React, { useState } from "react";
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
   CircularProgress
} from "@mui/material";
import { CloudDownload, Preview, SelectAll, Deselect, Info, FormatColorFill, InsertPhoto } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { utils, writeFile } from "xlsx-js-style";
import { formatDatetime } from "../../../../utils/Formats";

const TemplateExport = ({ open, onClose, data, plantillaBaseUrl }) => {
   // Estados
   const [plantillas, setPlantillas] = useState({
      "PLANTILLA A4": { columnas: 10, filas: 28, nombre: "A4" },
      "PLANTILLA TABLOIDE": { columnas: 14, filas: 40, nombre: "Tabloide" }
   });
   const [tipoPlantilla, setTipoPlantilla] = useState("PLANTILLA A4");
   const [elementos, setElementos] = useState([]);
   const [elementosSeleccionados, setElementosSeleccionados] = useState([]);
   const [configuracion, setConfiguracion] = useState({
      margen: 2,
      espacioEntreFilas: 2,
      espacioEntreColumnas: 1,
      colorFondo: "034AAB", // Azul Material UI primary
      colorTexto: "FFFFFFFF", // Blanco
      tamañoFuente: 11,
      fuente: "Arial"
   });
   const [vistaPreviaGenerada, setVistaPreviaGenerada] = useState(null);
   const [cargando, setCargando] = useState(false);

   // Parsear datos de texto (como la imagen que compartiste)
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

         // Si data es texto plano, parsearlo
         if (typeof data === "string") {
            datosParseados = parsearDatosDesdeTexto(data);
         }

         const elementosData = datosParseados.map((item, index) => ({
            id: item.id || index,
            nombre: item.nombre || `Chip ${index + 1}`,
            celular: item.celular,
            iccid: item.iccid,
            fecha: item.fecha || "S/F",
            seleccionado: true // Por defecto seleccionar todos
         }));

         setElementos(elementosData);
         setElementosSeleccionados(elementosData);
         generarVistaPrevia(elementosData);
      }
   }, [open, data]);

   // Toggle selección de elemento
   const toggleElemento = (id) => {
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

   // Generar vista previa
   const generarVistaPrevia = (elementosSeleccionados) => {
      if (elementosSeleccionados.length === 0) {
         setVistaPreviaGenerada(null);
         return;
      }

      const plantilla = plantillas[tipoPlantilla];
      const columnasPorFila = tipoPlantilla === "PLANTILLA TABLOIDE" ? 7 : 5; // 2 columnas por etiqueta

      // Crear matriz para vista previa
      const matriz = [];

      elementosSeleccionados.forEach((elemento, index) => {
         const filaInicio = Math.floor(index / columnasPorFila) * 4; // 4 filas por etiqueta
         const columnaInicio = (index % columnasPorFila) * 2; // 2 columnas por etiqueta

         // Lado izquierdo (datos)
         matriz[filaInicio] = matriz[filaInicio] || [];
         matriz[filaInicio + 1] = matriz[filaInicio + 1] || [];
         matriz[filaInicio + 2] = matriz[filaInicio + 2] || [];

         // Teléfono
         matriz[filaInicio][columnaInicio] = {
            v: elemento.celular,
            s: {
               font: { name: "Arial", sz: configuracion.tamañoFuente, bold: true },
               alignment: { vertical: "center", horizontal: "center" },
               border: {
                  top: { style: "thin", color: { rgb: "000000" } },
                  bottom: { style: "thin", color: { rgb: "000000" } },
                  left: { style: "thin", color: { rgb: "000000" } },
                  right: { style: "thin", color: { rgb: "000000" } }
               }
            }
         };

         // ICCID
         matriz[filaInicio + 1][columnaInicio] = {
            v: elemento.iccid,
            s: {
               font: { name: "Arial", sz: configuracion.tamañoFuente },
               alignment: { vertical: "center", horizontal: "center" },
               border: {
                  top: { style: "thin", color: { rgb: "000000" } },
                  bottom: { style: "thin", color: { rgb: "000000" } },
                  left: { style: "thin", color: { rgb: "000000" } },
                  right: { style: "thin", color: { rgb: "000000" } }
               }
            }
         };

         // Fecha
         matriz[filaInicio + 2][columnaInicio] = {
            v: `VIG. ${formatDatetime(elemento.fecha, false, "DD MMM YYYY")}`,
            s: {
               font: { name: "Arial", sz: configuracion.tamañoFuente, italic: true },
               alignment: { vertical: "center", horizontal: "center" },
               border: {
                  top: { style: "thin", color: { rgb: "000000" } },
                  bottom: { style: "thin", color: { rgb: "000000" } },
                  left: { style: "thin", color: { rgb: "000000" } },
                  right: { style: "thin", color: { rgb: "000000" } }
               }
            }
         };

         // Lado derecho (ACTIVA CON $50) - Combinar 3 filas
         matriz[filaInicio][columnaInicio + 1] = {
            v: "ACTIVA CON $50",
            s: {
               font: { name: "Arial", sz: configuracion.tamañoFuente, bold: true, color: { rgb: configuracion.colorTexto } },
               fill: { fgColor: { rgb: configuracion.colorFondo } },
               alignment: { vertical: "center", horizontal: "center", wrapText: false },
               border: {
                  top: { style: "thin", color: { rgb: "000000" } },
                  bottom: { style: "thin", color: { rgb: "000000" } },
                  left: { style: "thin", color: { rgb: "000000" } },
                  right: { style: "thin", color: { rgb: "000000" } }
               }
            }
         };

         // Combinar celdas verticalmente
         if (!matriz[filaInicio][columnaInicio + 1].s.merge) {
            matriz[filaInicio][columnaInicio + 1].s.merge = {
               r: 2, // Combinar 3 filas
               c: 0 // Misma columna
            };
         }
      });

      setVistaPreviaGenerada({
         matriz: matriz,
         elementos: elementosSeleccionados.length,
         columnas: tipoPlantilla === "PLANTILLA TABLOIDE" ? 14 : 10
      });
   };

   // Generar Excel con estilos
   const generarExcelConEstilos = () => {
      if (elementosSeleccionados.length === 0) {
         alert("Seleccione al menos un elemento");
         return;
      }

      setCargando(true);

      try {
         const plantilla = plantillas[tipoPlantilla];
         const columnasPorFila = tipoPlantilla === "PLANTILLA TABLOIDE" ? 7 : 5;
         const maxElementosPorPagina = tipoPlantilla === "PLANTILLA TABLOIDE" ? 35 : 20;

         // Crear workbook
         const wb = utils.book_new();

         // Calcular cuántas hojas necesitamos
         const totalHojas = Math.ceil(elementosSeleccionados.length / maxElementosPorPagina);

         for (let hojaNum = 0; hojaNum < totalHojas; hojaNum++) {
            const startIndex = hojaNum * maxElementosPorPagina;
            const endIndex = Math.min(startIndex + maxElementosPorPagina, elementosSeleccionados.length);
            const elementosHoja = elementosSeleccionados.slice(startIndex, endIndex);

            // Crear matriz de datos con estilos
            const wsData = [];
            const merges = [];

            // Definir anchos de columna
            const colWidths = [];
            for (let i = 0; i < plantilla.columnas; i++) {
               colWidths.push({ wch: i % 2 === 0 ? 20 : 15 }); // Columna izquierda más ancha
            }

            elementosHoja.forEach((elemento, index) => {
               const filaInicio = Math.floor(index / columnasPorFila) * 4;
               const columnaInicio = (index % columnasPorFila) * 2;

               // Teléfono
               if (!wsData[filaInicio]) wsData[filaInicio] = [];
               wsData[filaInicio][columnaInicio] = {
                  v: elemento.celular,
                  s: {
                     font: { name: configuracion.fuente, sz: configuracion.tamañoFuente, bold: true },
                     alignment: { vertical: "center", horizontal: "center" },
                     border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } }
                     }
                  }
               };

               // ICCID
               if (!wsData[filaInicio + 1]) wsData[filaInicio + 1] = [];
               wsData[filaInicio + 1][columnaInicio] = {
                  v: elemento.iccid,
                  s: {
                     font: { name: configuracion.fuente, sz: configuracion.tamañoFuente },
                     alignment: { vertical: "center", horizontal: "center" },
                     border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } }
                     }
                  }
               };

               // Fecha
               if (!wsData[filaInicio + 2]) wsData[filaInicio + 2] = [];
               wsData[filaInicio + 2][columnaInicio] = {
                  v: `VIG. ${elemento.fecha}`,
                  s: {
                     font: { name: configuracion.fuente, sz: configuracion.tamañoFuente, italic: true },
                     alignment: { vertical: "center", horizontal: "center" },
                     border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } }
                     }
                  }
               };

               // ACTIVA CON $50 (combinar 3 filas)
               if (!wsData[filaInicio]) wsData[filaInicio] = [];
               wsData[filaInicio][columnaInicio + 1] = {
                  v: "ACTIVA CON $50",
                  s: {
                     font: {
                        name: configuracion.fuente,
                        sz: configuracion.tamañoFuente + 2,
                        bold: true,
                        color: { rgb: configuracion.colorTexto }
                     },
                     fill: { fgColor: { rgb: configuracion.colorFondo } },
                     alignment: {
                        vertical: "center",
                        horizontal: "center",
                        wrapText: true,
                        textRotation: 0 // Texto vertical
                     },
                     border: {
                        top: { style: "medium", color: { rgb: "000000" } },
                        bottom: { style: "medium", color: { rgb: "000000" } },
                        left: { style: "medium", color: { rgb: "000000" } },
                        right: { style: "medium", color: { rgb: "000000" } }
                     }
                  }
               };

               // Agregar merge para las 3 filas
               merges.push({
                  s: { r: filaInicio, c: columnaInicio + 1 },
                  e: { r: filaInicio + 2, c: columnaInicio + 1 }
               });
            });

            // Crear worksheet
            const ws = utils.aoa_to_sheet(wsData);

            // Aplicar merges
            ws["!merges"] = merges;

            // Aplicar anchos de columna
            ws["!cols"] = colWidths;

            // Aplicar altos de fila
            ws["!rows"] = Array(wsData.length)
               .fill()
               .map(() => ({ hpx: 20 }));

            // Agregar margen
            ws["!margin"] = {
               left: configuracion.margen,
               right: configuracion.margen,
               top: configuracion.margen,
               bottom: configuracion.margen
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

   return (
      <Dialog
         open={open}
         onClose={onClose}
         maxWidth="xl"
         fullWidth
         PaperProps={{
            className: "min-h-[90vh] min-w-[90vw]"
         }}
      >
         <DialogTitle className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-gray-50">
            <Box className="flex items-center gap-3">
               <InsertPhoto className="text-blue-600" />
               <Typography variant="h6" className="font-bold">
                  Generar Etiquetas de Chips
               </Typography>
            </Box>
            <Chip label={`${elementosSeleccionados.length} chips seleccionados`} color="primary" size="small" />
         </DialogTitle>

         <DialogContent className="p-0">
            <Grid container className="h-full">
               {/* Panel izquierdo: Selección */}
               <Grid size={{ md: 4, xs: 12 }} className="border-r p-2">
                  <Box className="mb-0">
                     <Typography variant="h6" className="font-bold mb-4 flex items-center gap-2">
                        <FormatColorFill className="text-blue-500" />
                        Formato de Etiqueta
                     </Typography>

                     <FormControl fullWidth className="mb-3">
                        <InputLabel>Plantilla</InputLabel>
                        <Select
                           value={tipoPlantilla}
                           onChange={(e) => {
                              setTipoPlantilla(e.target.value);
                              generarVistaPrevia(elementosSeleccionados);
                           }}
                           label="Plantilla"
                        >
                           {Object.entries(plantillas).map(([nombre, datos]) => (
                              <MenuItem key={nombre} value={nombre}>
                                 {datos.nombre} ({datos.columnas} columnas × {datos.filas} filas)
                              </MenuItem>
                           ))}
                        </Select>
                     </FormControl>

                     <Alert severity="info" className="mb-3">
                        Cada etiqueta ocupa 3 filas × 2 columnas
                     </Alert>

                     <Box className="grid grid-cols-2 gap-3 mb-4">
                        <TextField
                           label="Color fondo"
                           type="color"
                           value={`#${configuracion.colorFondo}`}
                           onChange={(e) => actualizarConfiguracion("colorFondo", e.target.value.replace("#", ""))}
                           InputProps={{
                              startAdornment: <Box className="w-6 h-6 rounded mr-2 border" style={{ backgroundColor: `#${configuracion.colorFondo}` }} />
                           }}
                        />
                        <TextField
                           label="Tamaño fuente"
                           type="number"
                           value={configuracion.tamañoFuente}
                           onChange={(e) => actualizarConfiguracion("tamañoFuente", parseInt(e.target.value))}
                        />
                     </Box>
                  </Box>

                  <Box className="flex justify-between items-center mb-3">
                     <Typography variant="h6" className="font-bold">
                        Chips Disponibles
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

                  <Box className="overflow-auto max-h-[400px] border rounded-lg">
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
                                       <Typography variant="caption" className="text-gray-500">
                                          {elemento.celular}
                                       </Typography>
                                    }
                                 />
                              </ListItemButton>
                           </ListItem>
                        ))}
                     </List>
                  </Box>
               </Grid>

               {/* Panel derecho: Vista previa */}
               <Grid size={{ md: 8, xs: 12 }} className="p-4">
                  <Box className="flex justify-between items-center mb-4">
                     <Typography variant="h5" className="font-bold">
                        Vista Previa - {tipoPlantilla}
                     </Typography>
                     <Button
                        variant="outlined"
                        startIcon={<Preview />}
                        onClick={() => generarVistaPrevia(elementosSeleccionados)}
                        disabled={elementosSeleccionados.length === 0}
                     >
                        Actualizar Vista Previa
                     </Button>
                  </Box>

                  {vistaPreviaGenerada ? (
                     <Box className="border rounded-lg p-4 bg-gray-50">
                        <Box className="overflow-auto max-h-[400px] border bg-white p-2">
                           <table className="border-collapse">
                              <tbody>
                                 {vistaPreviaGenerada.matriz.map((fila, rowIndex) => (
                                    <tr key={rowIndex}>
                                       {Array(vistaPreviaGenerada.columnas)
                                          .fill()
                                          .map((_, colIndex) => {
                                             const celda = fila && fila[colIndex];
                                             const esTextoAzul = celda && celda.v === "ACTIVA CON $50";

                                             return (
                                                <td
                                                   key={`${rowIndex}-${colIndex}`}
                                                   className={`border border-gray-300 p-2 min-w-[80px] h-10 text-center
                                  ${esTextoAzul ? "font-bold text-white" : ""}
                                  ${celda && !esTextoAzul ? "bg-blue-50" : ""}
                                `}
                                                   style={{
                                                      backgroundColor: esTextoAzul ? `#${configuracion.colorFondo}` : undefined,
                                                      transform: esTextoAzul ? "rotate(-90deg)" : undefined,
                                                      whiteSpace: "nowrap",
                                                      height: "120px" // Para texto vertical
                                                   }}
                                                >
                                                   {celda ? celda.v : " "}
                                                </td>
                                             );
                                          })}
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </Box>

                        <Box className="mt-4 grid grid-cols-3 gap-4">
                           <Paper className="p-3">
                              <Typography variant="subtitle2" className="font-bold text-gray-600">
                                 Información
                              </Typography>
                              <Typography variant="body2">Etiquetas: {elementosSeleccionados.length}</Typography>
                              <Typography variant="body2">Columnas: {vistaPreviaGenerada.columnas}</Typography>
                              <Typography variant="body2">Filas usadas: {vistaPreviaGenerada.matriz.length}</Typography>
                           </Paper>

                           <Paper className="p-3">
                              <Typography variant="subtitle2" className="font-bold text-gray-600">
                                 Ejemplo de Etiqueta
                              </Typography>
                              <Box className="border mt-2">
                                 <Box className="p-2 bg-blue-50 border-r">
                                    <Typography variant="caption" className="font-bold block">
                                       8721188764
                                    </Typography>
                                    <Typography variant="caption" className="block">
                                       8952020925230160572
                                    </Typography>
                                    <Typography variant="caption" className="italic block">
                                       VIG. 29 OCT 2026
                                    </Typography>
                                 </Box>
                                 <Box
                                    className="p-2 text-white font-bold flex items-center justify-center"
                                    style={{ backgroundColor: `#${configuracion.colorFondo}` }}
                                 >
                                    <Typography style={{ transform: "rotate(-90deg)" }}>ACTIVA CON $50</Typography>
                                 </Box>
                              </Box>
                           </Paper>

                           <Paper className="p-3">
                              <Typography variant="subtitle2" className="font-bold text-gray-600">
                                 Configuración
                              </Typography>
                              <Typography variant="body2">Color: #{configuracion.colorFondo}</Typography>
                              <Typography variant="body2">
                                 Fuente: {configuracion.fuente} {configuracion.tamañoFuente}pt
                              </Typography>
                           </Paper>
                        </Box>
                     </Box>
                  ) : (
                     <Paper className="p-12 text-center">
                        <Info className="text-gray-400 text-4xl mb-4" />
                        <Typography className="text-gray-500 mb-2">Seleccione chips para generar vista previa</Typography>
                        <Typography variant="body2" className="text-gray-400">
                           Cada etiqueta mostrará: teléfono, ICCID, fecha y "ACTIVA CON $50"
                        </Typography>
                     </Paper>
                  )}
               </Grid>
            </Grid>
         </DialogContent>

         <DialogActions className="p-4 border-t">
            <Button onClick={onClose} color="inherit" disabled={cargando}>
               Cancelar
            </Button>
            <Button
               variant="contained"
               startIcon={cargando ? <CircularProgress size={20} color="inherit" /> : <CloudDownload />}
               onClick={generarExcelConEstilos}
               disabled={elementosSeleccionados.length === 0 || cargando}
               className="bg-green-600 hover:bg-green-700"
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
         <Button
            variant="contained"
            startIcon={<CloudDownload />}
            onClick={() => setDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg"
            size="large"
         >
            Generar Etiquetas Excel
         </Button>

         <TemplateExport open={dialogOpen} onClose={() => setDialogOpen(false)} data={data} />
      </>
   );
};

// Ejemplo de uso con datos parseados
function App() {
   const datosEjemplo = `8721188764  
8952020925230160572  
VIG. 29 OCT 2026  

8721188935  
8952020925230160648  
VIG. 29 OCT 2026`;

   return (
      <div className="p-6">
         <Typography variant="h4" className="font-bold mb-6">
            Generador de Etiquetas para Chips
         </Typography>

         <GeneradorEtiquetasButton data={datosEjemplo} />
      </div>
   );
}

export { GeneradorEtiquetasButton, TemplateExport };
export default GeneradorEtiquetasButton;
