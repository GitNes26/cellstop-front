import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
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
   ListItemIcon,
   ListItemText,
   Typography,
   CircularProgress,
   Box
} from "@mui/material";

const TemplateExport = ({ data, plantillaUrl }) => {
   const [open, setOpen] = useState(false);
   const [workbook, setWorkbook] = useState(null);
   const [hojas, setHojas] = useState([]);
   const [hojaSeleccionada, setHojaSeleccionada] = useState("");
   const [elementosSeleccionados, setElementosSeleccionados] = useState([]);
   const [cargando, setCargando] = useState(false);

   // Al abrir el modal, cargar el archivo Excel
   useEffect(() => {
      if (open && plantillaUrl) {
         cargarPlantilla();
      }
   }, [open, plantillaUrl]);

   const cargarPlantilla = async () => {
      setCargando(true);
      try {
         const respuesta = await fetch(plantillaUrl);
         const arrayBuffer = await respuesta.arrayBuffer();
         const wb = XLSX.read(arrayBuffer, { type: "array" });
         setWorkbook(wb);
         setHojas(wb.SheetNames);
         if (wb.SheetNames.length > 0) {
            setHojaSeleccionada(wb.SheetNames[0]);
         }
      } catch (error) {
         console.error("Error al cargar la plantilla:", error);
      } finally {
         setCargando(false);
      }
   };

   const handleToggleElemento = (elemento) => () => {
      const selectedIndex = elementosSeleccionados.findIndex((el) => el.id === elemento.id);
      let newSelected = [];

      if (selectedIndex === -1) {
         newSelected = newSelected.concat(elementosSeleccionados, elemento);
      } else if (selectedIndex === 0) {
         newSelected = newSelected.concat(elementosSeleccionados.slice(1));
      } else if (selectedIndex === elementosSeleccionados.length - 1) {
         newSelected = newSelected.concat(elementosSeleccionados.slice(0, -1));
      } else if (selectedIndex > 0) {
         newSelected = newSelected.concat(elementosSeleccionados.slice(0, selectedIndex), elementosSeleccionados.slice(selectedIndex + 1));
      }

      setElementosSeleccionados(newSelected);
   };

   const generarPlantilla = () => {
      if (!workbook || !hojaSeleccionada || elementosSeleccionados.length === 0) return;

      const worksheet = workbook.Sheets[hojaSeleccionada];
      const range = XLSX.utils.decode_range(worksheet["!ref"]);

      let datoIndex = 0;
      for (let row = range.s.r; row <= range.e.r; row++) {
         for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const cell = worksheet[cellAddress];
            if (cell && cell.v === "ACTIVA CON $50") {
               if (datoIndex < elementosSeleccionados.length) {
                  cell.v = elementosSeleccionados[datoIndex].texto; // Ajusta según tu estructura de datos
                  datoIndex++;
               } else {
                  cell.v = "";
               }
            }
         }
      }

      const nuevoWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(nuevoWorkbook, worksheet, hojaSeleccionada);
      const nuevoArrayBuffer = XLSX.write(nuevoWorkbook, { type: "array", bookType: "xlsx" });

      // Descargar
      const blob = new Blob([nuevoArrayBuffer], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `plantilla_${hojaSeleccionada}_generada.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      // Cerrar el modal
      setOpen(false);
   };

   return (
      <>
         <Button variant="contained" onClick={() => setOpen(true)}>
            Exportar a plantilla
         </Button>
         <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
            <DialogTitle>Exportar a plantilla</DialogTitle>
            <DialogContent dividers>
               {cargando ? (
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                     <CircularProgress />
                  </Box>
               ) : (
                  <Box display="flex" flexDirection="row" gap={2}>
                     {/* Panel de selección de plantilla y datos */}
                     <Box flex={1}>
                        <Typography variant="h6">Seleccionar plantilla</Typography>
                        <FormControl fullWidth margin="normal">
                           <InputLabel>Plantilla</InputLabel>
                           <Select value={hojaSeleccionada} onChange={(e) => setHojaSeleccionada(e.target.value)} label="Plantilla">
                              {hojas.map((hoja) => (
                                 <MenuItem key={hoja} value={hoja}>
                                    {hoja}
                                 </MenuItem>
                              ))}
                           </Select>
                        </FormControl>
                        <Typography variant="h6" style={{ marginTop: 20 }}>
                           Seleccionar elementos
                        </Typography>
                        <List>
                           {/* {JSON.stringify(data)} */}
                           {data.map((elemento) => (
                              <ListItem key={elemento.id} button onClick={handleToggleElemento(elemento)}>
                                 <ListItemIcon>
                                    <Checkbox
                                       edge="start"
                                       checked={elementosSeleccionados.findIndex((el) => el.id === elemento.id) !== -1}
                                       tabIndex={-1}
                                       disableRipple
                                    />
                                 </ListItemIcon>
                                 <ListItemText primary={elemento.iccid} />
                              </ListItem>
                           ))}
                        </List>
                     </Box>
                     {/* Vista previa de la plantilla (solo muestra los marcadores) */}
                     <Box flex={1}>
                        <Typography variant="h6">Vista previa de la plantilla</Typography>
                        {hojaSeleccionada && workbook && (
                           <Box overflow="auto" maxHeight="400px">
                              <Typography variant="body2" color="textSecondary">
                                 Esta plantilla tiene{" "}
                                 {workbook.Sheets[hojaSeleccionada]["!ref"] ? XLSX.utils.decode_range(workbook.Sheets[hojaSeleccionada]["!ref"]).e.r + 1 : 0} filas y{" "}
                                 {workbook.Sheets[hojaSeleccionada]["!ref"] ? XLSX.utils.decode_range(workbook.Sheets[hojaSeleccionada]["!ref"]).e.c + 1 : 0} columnas.
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                 Los marcadores "ACTIVA CON $50" serán reemplazados por los elementos seleccionados en orden.
                              </Typography>
                           </Box>
                        )}
                     </Box>
                  </Box>
               )}
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setOpen(false)}>Cancelar</Button>
               <Button onClick={generarPlantilla} variant="contained" disabled={elementosSeleccionados.length === 0 || !hojaSeleccionada}>
                  Generar
               </Button>
            </DialogActions>
         </Dialog>
      </>
   );
};

export default TemplateExport;
