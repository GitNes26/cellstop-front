// ChipEditor.tsx
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import ChipsTemplate from "./ChipsTemplate";
import { ChipData, TemplateType, ViewMode } from "../../../../types/types";
import { Button, TextField, Box, Typography, IconButton, Badge } from "@mui/material";
import { Add, Delete, GridOn, Search } from "@mui/icons-material";
import { useGlobalContext } from "../../../../context/GlobalContext";

/**
 * Recomendado: ajustar imports y rutas según tu estructura.
 * Este componente está hecho para Vite + React y carga plantilla desde:
 * /public/plantillas/plantillas_impresion_chip.xlsx
 */

const PLANTILLA_PATH = "/plantillas/plantillas_impresion_chip.xlsx";

const configMap = {
   A4: { columns: 5, rows: 8 },
   TABLOIDE: { columns: 7, rows: 12 }
};

const ChipEditor: React.FC = () => {
   const { setIsLoading } = useGlobalContext();

   // -- State principal
   const [chips, setChips] = useState<ChipData[]>([]);
   const [viewMode, setViewMode] = useState<ViewMode>("selection"); // "edit" | "preview" | "selection"
   const [query, setQuery] = useState("");
   const [templateType, setTemplateType] = useState<TemplateType>("A4");
   const scanBuffer = useRef<string>("");
   const scanTimer = useRef<number | null>(null);

   // -- Cargar datos de ejemplo (reemplaza por fetch a backend cuando corresponda)
   useEffect(() => {
      const initial: ChipData[] = Array.from({ length: 40 }, (_, i) => ({
         id: `chip-${i + 1}`,
         iccid: `89520200245338597${(i + 1).toString().padStart(2, "0")}`,
         phoneNumber: `+52 55 000${(1000 + i).toString()}`,
         preActivationDate: "2025-11-11",
         status: "Pendiente",
         amount: "50",
         selected: false
      }));
      setChips(initial);
      setIsLoading(false);
   }, []);

   // ------------------------
   // Sonido (beep) simple
   // ------------------------
   const playBeep = (success = true) => {
      try {
         const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
         const ctx = new AudioContext();
         const o = ctx.createOscillator();
         const g = ctx.createGain();
         o.type = "sine";
         o.frequency.value = success ? 1200 : 320; // tonos
         g.gain.value = 0.07;
         o.connect(g);
         g.connect(ctx.destination);
         o.start();
         setTimeout(() => {
            o.stop();
            ctx.close();
         }, 120);
      } catch (e) {
         // fallback silencioso si no está disponible
         console.warn("AudioContext no disponible", e);
      }
   };

   // ------------------------
   // Escucha global del lector (simula teclado)
   // ------------------------
   useEffect(() => {
      const resetBuffer = () => {
         scanBuffer.current = "";
         if (scanTimer.current) {
            window.clearTimeout(scanTimer.current);
            scanTimer.current = null;
         }
      };

      const onKeyDown = (e: KeyboardEvent) => {
         // ignorar teclas de modificador
         if (e.key === "Shift" || e.key === "Alt" || e.key === "Control" || e.key === "Meta") return;

         // Enter -> final de lectura
         if (e.key === "Enter") {
            const scanned = scanBuffer.current.trim();
            resetBuffer();
            if (scanned) handleScannedICCID(scanned);
            return;
         }

         // Si es tecla de una sola longitud, agregar al buffer
         if (e.key.length === 1) {
            scanBuffer.current += e.key;
         }

         // Si hay una pausa larga entre teclas, limpiamos buffer (evita mezclar con tipeo manual)
         if (scanTimer.current) window.clearTimeout(scanTimer.current);
         scanTimer.current = window.setTimeout(() => {
            scanBuffer.current = "";
            scanTimer.current = null;
         }, 250); // 250ms pausa tolerada entre pulsaciones del lector
      };

      window.addEventListener("keydown", onKeyDown);
      return () => {
         window.removeEventListener("keydown", onKeyDown);
         if (scanTimer.current) window.clearTimeout(scanTimer.current);
      };
   }, [chips]);

   // ------------------------
   // Manejo de una lectura (iccid)
   // ------------------------
   const handleScannedICCID = (rawCode: string) => {
      const code = rawCode.replace(/\s+/g, ""); // quitar espacios
      // buscar por iccid (ignorando mayúsculas)
      const idx = chips.findIndex((c) => (c.iccid || "").toLowerCase() === code.toLowerCase());
      if (idx === -1) {
         playBeep(false);
         // opcional: notificar con Swal ligero
         // Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: `ICCID ${code} no encontrado`, timer: 1500, showConfirmButton: false });
         return;
      }

      setChips((prev) => {
         const found = prev[idx];
         if (found.selected) {
            // ignorar si ya seleccionado
            playBeep(true);
            return prev;
         }
         const copy = [...prev];
         copy[idx] = { ...found, selected: true };
         playBeep(true);
         return copy;
      });
   };

   // ------------------------
   // Selección manual / toggle (por mouse)
   // ------------------------
   const toggleSelectById = (id: string) => {
      setChips((prev) => prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)));
   };

   const selectAllVisible = (selected: boolean) => {
      // aplica selección solo a los filtrados por búsqueda
      setChips((prev) =>
         prev.map((c) => {
            if (matchesQuery(c, query)) return { ...c, selected };
            return c;
         })
      );
   };

   // ------------------------
   // Buscador
   // ------------------------
   const matchesQuery = (chip: ChipData, q: string) => {
      if (!q) return true;
      return (chip.iccid || "").toLowerCase().includes(q.toLowerCase());
   };

   const filtered = chips.filter((c) => matchesQuery(c, query));

   // ------------------------
   // Export: carga plantilla, sobrescribe la hoja elegida con nuestra distribución y descarga directa
   // ------------------------
   const handleExport = async () => {
      // pedir confirmación formato con SweetAlert2
      const { value: sheetChoice } = await Swal.fire({
         title: "Selecciona el formato de impresión",
         icon: "question",
         showCancelButton: true,
         confirmButtonText: "A4",
         cancelButtonText: "Tabloide",
         showDenyButton: true,
         denyButtonText: "Cancelar",
         allowOutsideClick: false,
         // Note: usaremos confirm -> A4, cancel -> TABLOIDE, deny -> cancelar
         didOpen: () => {
            // ajustar botones: confirm = A4, deny = Cancel, cancel = Tabloide
         }
      });

      // El comportamiento por defecto de sweetalert aquí no da ambas opciones con confirm/cancel de forma ideal,
      // así que usaremos un diálogo custom con botones A4 / Tabloide:
      const result = await Swal.fire({
         title: "Elige hoja",
         text: "¿Qué hoja de la plantilla quieres usar?",
         showCancelButton: true,
         showDenyButton: true,
         confirmButtonText: "A4",
         denyButtonText: "Tabloide",
         cancelButtonText: "Cancelar",
         reverseButtons: true
      });

      if (result.isDismissed || result.isDenied) {
         // si canceló
         return;
      }

      const chosen: TemplateType = result.isConfirmed ? "A4" : "TABLOIDE";

      const seleccionados = chips.filter((c) => c.selected);
      if (seleccionados.length === 0) {
         Swal.fire({ icon: "warning", title: "No hay chips seleccionados", toast: true, timer: 1500, position: "top-end", showConfirmButton: false });
         return;
      }

      try {
         // 1) fetch plantilla desde public
         const resp = await fetch(PLANTILLA_PATH);
         if (!resp.ok) throw new Error("No se pudo cargar la plantilla desde /public/plantillas/");
         const arrayBuffer = await resp.arrayBuffer();

         // 2) leer workbook (tipo array)
         const workbook = XLSX.read(arrayBuffer, { type: "array" });

         // 3) construir datos (AOA) con la misma distribución que usas para impresión
         const sheetName = chosen === "A4" ? "A4" : "TABLOIDE";
         const aoa = buildTemplateAOA(seleccionados, chosen);

         // 4) crear hoja desde AOArray y reemplazar hoja en workbook
         const newSheet = XLSX.utils.aoa_to_sheet(aoa);

         // Si la hoja existe en la plantilla, reemplazar. Si no, añadir.
         if (workbook.SheetNames.includes(sheetName)) {
            workbook.Sheets[sheetName] = newSheet;
         } else {
            workbook.SheetNames.push(sheetName);
            workbook.Sheets[sheetName] = newSheet;
         }

         // 5) (opcional) añadir hoja "Datos" con la lista cruda
         const datos = seleccionados.map((chip, idx) => ({
            "#": idx + 1,
            ICCID: chip.iccid,
            Teléfono: chip.phoneNumber,
            Fecha: chip.preActivationDate,
            Estado: chip.status,
            Monto: `$${chip.amount}`
         }));
         const datosSheet = XLSX.utils.json_to_sheet(datos);
         if (workbook.SheetNames.includes("Datos")) {
            workbook.Sheets["Datos"] = datosSheet;
         } else {
            workbook.SheetNames.push("Datos");
            workbook.Sheets["Datos"] = datosSheet;
         }

         // 6) descarga directa
         XLSX.writeFile(workbook, `plantilla_impresion_chip_${chosen}_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.xlsx`);
         Swal.fire({
            icon: "success",
            title: `Descarga lista (${seleccionados.length} chips)`,
            toast: true,
            position: "top-end",
            timer: 1600,
            showConfirmButton: false
         });
      } catch (err) {
         console.error("Error exportando plantilla:", err);
         Swal.fire({ icon: "error", title: "No fue posible generar el archivo", text: String(err) });
      }
   };

   // Genera AOAs (matriz) con bloques: [header row -> amount row -> empty row] por cada fila
   const buildTemplateAOA = (chipsToExport: ChipData[], chosenTemplate: TemplateType) => {
      const cfg = configMap[chosenTemplate];
      const { columns, rows } = cfg;
      const totalSlots = columns * rows;

      // rellenar hasta totalSlots con chipsToExport o nulls
      const padded = Array.from({ length: totalSlots }, (_, i) => chipsToExport[i] ?? null);

      const data: any[][] = [];
      for (let r = 0; r < rows; r++) {
         // fila de "ACTIVA CON $..."
         const headerRow: any[] = [];
         for (let c = 0; c < columns; c++) {
            const index = r * columns + c;
            const chip = padded[index];
            headerRow.push(chip ? `ACTIVA CON $${chip.amount}` : "ACTIVA CON $50");
         }
         data.push(headerRow);

         // fila de información del chip
         const infoRow: any[] = [];
         for (let c = 0; c < columns; c++) {
            const index = r * columns + c;
            const chip = padded[index];
            if (chip) {
               // usar saltos de línea para que al imprimir quede en la celda
               const text = `ICCID: ${chip.iccid}\nTEL: ${chip.phoneNumber}\nFECHA: ${chip.preActivationDate}\nEST: ${chip.status}`;
               infoRow.push(text);
            } else {
               infoRow.push("");
            }
         }
         data.push(infoRow);

         // fila separadora (vacía)
         const emptyRow = Array(columns).fill("");
         data.push(emptyRow);
      }
      return data;
   };

   // ------------------------
   // UI: lista simple + buscador + botones
   // ------------------------
   return (
      <Box className="p-4">
         <Box className="flex items-center justify-between mb-4">
            <Typography variant="h5" className="font-bold">
               Editor / Impresión de Chips
            </Typography>

            <Box className="flex items-center gap-2">
               <TextField
                  size="small"
                  placeholder="Buscar ICCID..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  InputProps={{
                     startAdornment: <Search fontSize="small" />
                  }}
               />

               <Badge badgeContent={chips.filter((c) => c.selected).length} color="primary" showZero={false}>
                  <Button variant="outlined" startIcon={<GridOn />} onClick={() => setViewMode(viewMode === "selection" ? "edit" : "selection")}>
                     {viewMode === "selection" ? "Ver lista" : "Modo Selección"}
                  </Button>
               </Badge>

               <Button variant="contained" color="primary" onClick={handleExport}>
                  Exportar (Descarga)
               </Button>
            </Box>
         </Box>

         <Box className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Plantilla preview (usa ChipsTemplate) */}
            <Box className="lg:col-span-2">
               <ChipsTemplate
                  data={chips}
                  templateType={templateType}
                  viewMode={viewMode}
                  onChipToggle={(id) => {
                     // onChipToggle recibe id y boolean selected
                     // pero aquí en el preview lo llamamos al hacer click (ChipsTemplate lo maneja)
                     // para consistencia: asumimos toggle manual por switch en template llama a onChipToggle
                  }}
                  onSelectAll={(sel) => selectAllVisible(sel)}
               />
            </Box>

            {/* Right: Lista filtrada y controls */}
            <Box className="lg:col-span-1">
               <Box className="mb-2 flex items-center justify-between">
                  <Typography variant="subtitle1" className="font-semibold">
                     Lista de Chips ({filtered.length})
                  </Typography>
                  <Button size="small" variant="outlined" color="error" onClick={() => setChips([])} startIcon={<Delete />}>
                     Limpiar
                  </Button>
               </Box>

               <Box className="overflow-auto max-h-[480px] p-2 border rounded">
                  {filtered.map((c) => (
                     <Box key={c.id} className={`p-2 mb-2 rounded border ${c.selected ? "bg-blue-50 border-blue-400" : "bg-white border-gray-200"}`}>
                        <Box className="flex items-center justify-between">
                           <Box>
                              <Typography variant="caption" className="font-bold block">
                                 {c.iccid}
                              </Typography>
                              <Typography variant="caption" className="text-gray-600 block">
                                 {c.phoneNumber}
                              </Typography>
                              <Typography variant="caption" className="text-gray-500 block">
                                 {c.preActivationDate} • {c.status}
                              </Typography>
                           </Box>

                           <Box className="flex flex-col items-end gap-2">
                              <input type="checkbox" checked={!!c.selected} onChange={() => toggleSelectById(c.id)} />
                              <Typography variant="caption" className="text-xs">
                                 {c.selected ? "Seleccionado" : ""}
                              </Typography>
                           </Box>
                        </Box>
                     </Box>
                  ))}
               </Box>
            </Box>
         </Box>
      </Box>
   );
};

export default ChipEditor;
