// ChipEditor.tsx (actualizado)
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
   Box,
   Button,
   Select,
   MenuItem,
   FormControl,
   InputLabel,
   Typography,
   Card,
   IconButton,
   Chip as MuiChip,
   Alert,
   Snackbar,
   Paper,
   Divider,
   Tooltip,
   ToggleButton,
   ToggleButtonGroup,
   Badge,
   Switch
} from "@mui/material";
import { Add, Delete, Visibility, Edit, FileUpload, Download, Print, ContentCopy, PictureAsPdf, GridOn, CheckBox, SelectAll } from "@mui/icons-material";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { ChipData, TemplateType, ViewMode } from "../../../../types/types";
import ChipsTemplate from "./ChipsTemplate";
import { exportToExcelWithDesign, exportToPDF } from "./exportUtils";

const ChipEditor: React.FC = () => {
   const { setIsLoading } = useGlobalContext();
   const [chips, setChips] = useState<ChipData[]>([]);
   const [templateType, setTemplateType] = useState<TemplateType>("A4");
   const [viewMode, setViewMode] = useState<ViewMode>("edit");
   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
   const templateRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const initialData: ChipData[] = Array.from({ length: 40 }, (_, index) => ({
         id: `chip-${index + 1}`,
         iccid: `8931040610123456789${index.toString().padStart(2, "0")}`,
         phoneNumber: `+1 555-01${index.toString().padStart(2, "0")}`,
         preActivationDate: "2024-01-15",
         status: "Pre-activado",
         amount: "50",
         selected: false
      }));
      setChips(initialData);
      setIsLoading(false);
   }, []);

   const handleChipEdit = (id: string, field: keyof ChipData, value: string) => {
      setChips((prev) => prev.map((chip) => (chip.id === id ? { ...chip, [field]: value } : chip)));
   };

   const handleChipToggle = (id: string, selected: boolean) => {
      setChips((prev) => prev.map((chip) => (chip.id === id ? { ...chip, selected } : chip)));
   };

   const handleSelectAll = (selected: boolean) => {
      setChips((prev) => prev.map((chip) => ({ ...chip, selected })));
   };

   const addChip = () => {
      const newChip: ChipData = {
         id: `chip-${Date.now()}`,
         iccid: "",
         phoneNumber: "",
         preActivationDate: new Date().toISOString().split("T")[0],
         status: "Pendiente",
         amount: "50",
         selected: false
      };
      setChips((prev) => [...prev, newChip]);
      showSnackbar("Chip agregado correctamente", "success");
   };

   const removeChip = (id: string) => {
      setChips((prev) => prev.filter((chip) => chip.id !== id));
      showSnackbar("Chip eliminado", "success");
   };

   const removeSelectedChips = () => {
      setChips((prev) => prev.filter((chip) => !chip.selected));
      showSnackbar("Chips seleccionados eliminados", "success");
   };

   const duplicateChip = (chip: ChipData) => {
      const duplicatedChip: ChipData = {
         ...chip,
         id: `chip-${Date.now()}`,
         phoneNumber: `${chip.phoneNumber}-copy`,
         selected: false
      };
      setChips((prev) => [...prev, duplicatedChip]);
      showSnackbar("Chip duplicado", "success");
   };

   const handleExportExcel = () => {
      const chipsToExport = viewMode === "selection" ? chips.filter((chip) => chip.selected) : chips;

      if (chipsToExport.length === 0) {
         showSnackbar("No hay chips seleccionados para exportar", "error");
         return;
      }

      exportToExcelWithDesign(chipsToExport, templateType);
      showSnackbar(`Plantilla exportada a Excel (${chipsToExport.length} chips)`, "success");
   };

   const handleExportPDF = () => {
      const chipsToExport = viewMode === "selection" ? chips.filter((chip) => chip.selected) : chips;

      if (chipsToExport.length === 0) {
         showSnackbar("No hay chips seleccionados para exportar", "error");
         return;
      }

      if (templateRef.current) {
         exportToPDF(templateRef.current, templateType);
         showSnackbar(`Plantilla exportada a PDF (${chipsToExport.length} chips)`, "success");
      }
   };

   const clearAll = () => {
      setChips([]);
      showSnackbar("Todos los chips han sido eliminados", "success");
   };

   const showSnackbar = (message: string, severity: "success" | "error") => {
      setSnackbar({ open: true, message, severity });
   };

   const selectedCount = chips.filter((chip) => chip.selected).length;
   const totalCount = chips.length;

   return (
      <Box className="min-h-screen bg-gray-50 p-4">
         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Typography variant="h4" className="text-center font-bold text-gray-800 mb-2">
               📱 Editor de Plantillas de Chips
            </Typography>
            <Typography variant="subtitle1" className="text-center text-gray-600 mb-6">
               Diseña y exporta tus plantillas para impresión
            </Typography>
         </motion.div>

         {/* Controles principales */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Card className="p-4 mb-4 rounded-xl shadow-md">
               <Box className="flex flex-wrap gap-3 items-center justify-between">
                  <Box className="flex flex-wrap gap-3 items-center">
                     <FormControl size="small" className="min-w-28">
                        <InputLabel>Plantilla</InputLabel>
                        <Select value={templateType} label="Plantilla" onChange={(e) => setTemplateType(e.target.value as TemplateType)}>
                           <MenuItem value="A4">A4</MenuItem>
                           <MenuItem value="TABLOIDE">Tabloide</MenuItem>
                        </Select>
                     </FormControl>

                     <ToggleButtonGroup value={viewMode} exclusive onChange={(_, newMode) => newMode && setViewMode(newMode)} size="small">
                        <Tooltip title="Modo edición">
                           <ToggleButton value="edit">
                              <Edit className="mr-1" fontSize="small" />
                              Editar
                           </ToggleButton>
                        </Tooltip>
                        <Tooltip title="Vista previa">
                           <ToggleButton value="preview">
                              <Visibility className="mr-1" fontSize="small" />
                              Vista Previa
                           </ToggleButton>
                        </Tooltip>
                        <Tooltip title="Seleccionar chips">
                           <Badge badgeContent={selectedCount} color="primary" showZero={false}>
                              <ToggleButton value="selection">
                                 <CheckBox className="mr-1" fontSize="small" />
                                 Seleccionar
                              </ToggleButton>
                           </Badge>
                        </Tooltip>
                     </ToggleButtonGroup>
                  </Box>

                  <Box className="flex flex-wrap gap-2">
                     <Tooltip title="Agregar nuevo chip">
                        <Button variant="contained" startIcon={<Add />} onClick={addChip} size="small" className="bg-green-600 hover:bg-green-700">
                           Agregar
                        </Button>
                     </Tooltip>

                     {viewMode === "selection" && selectedCount > 0 && (
                        <Tooltip title="Eliminar chips seleccionados">
                           <Button variant="outlined" color="error" startIcon={<Delete />} onClick={removeSelectedChips} size="small">
                              Eliminar ({selectedCount})
                           </Button>
                        </Tooltip>
                     )}

                     <Tooltip title="Eliminar todos los chips">
                        <Button variant="outlined" color="error" startIcon={<Delete />} onClick={clearAll} size="small">
                           Limpiar
                        </Button>
                     </Tooltip>
                  </Box>
               </Box>

               <Divider className="my-3" />

               <Box className="flex flex-wrap gap-2 justify-center items-center">
                  {viewMode === "selection" && (
                     <Typography variant="body2" className="text-blue-600 font-semibold mr-2">
                        {selectedCount} chips seleccionados
                     </Typography>
                  )}

                  <Tooltip title="Exportar a Excel">
                     <Button
                        variant="outlined"
                        startIcon={<GridOn />}
                        onClick={handleExportExcel}
                        size="small"
                        className="text-green-600 border-green-600"
                        disabled={viewMode === "selection" && selectedCount === 0}
                     >
                        Excel {viewMode === "selection" && selectedCount > 0 && `(${selectedCount})`}
                     </Button>
                  </Tooltip>

                  <Tooltip title="Exportar a PDF">
                     <Button
                        variant="outlined"
                        startIcon={<PictureAsPdf />}
                        onClick={handleExportPDF}
                        size="small"
                        className="text-red-600 border-red-600"
                        disabled={viewMode === "selection" && selectedCount === 0}
                     >
                        PDF {viewMode === "selection" && selectedCount > 0 && `(${selectedCount})`}
                     </Button>
                  </Tooltip>

                  <Tooltip title="Imprimir plantilla">
                     <Button variant="contained" startIcon={<Print />} onClick={() => window.print()} size="small" className="bg-blue-600 hover:bg-blue-700">
                        Imprimir
                     </Button>
                  </Tooltip>
               </Box>
            </Card>

            {/* Contenido principal */}
            <Box className="grid grid-cols-1 xl:grid-cols-4 gap-4">
               {/* Preview de plantilla */}
               <Box className="xl:col-span-3">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                     <Card className="p-2 rounded-xl shadow-md" ref={templateRef}>
                        <ChipsTemplate
                           data={chips}
                           templateType={templateType}
                           viewMode={viewMode}
                           onChipEdit={viewMode === "edit" ? handleChipEdit : undefined}
                           onChipToggle={viewMode === "selection" ? handleChipToggle : undefined}
                           onSelectAll={viewMode === "selection" ? handleSelectAll : undefined}
                        />
                     </Card>
                  </motion.div>
               </Box>

               {/* Lista de chips */}
               {(viewMode === "edit" || viewMode === "selection") && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="xl:col-span-1">
                     <Card className="p-3 rounded-xl shadow-md h-[500px] flex flex-col">
                        <Typography variant="h6" className="font-bold text-gray-700 mb-3">
                           Chips ({chips.length}){viewMode === "selection" && <span className="text-blue-600 ml-2">({selectedCount} seleccionados)</span>}
                        </Typography>

                        <Box className="flex-1 overflow-y-auto space-y-2">
                           <AnimatePresence>
                              {chips.map((chip, index) => (
                                 <motion.div
                                    key={chip.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                 >
                                    <Paper
                                       className={`p-2 rounded-lg hover:shadow-md transition-all duration-200 ${
                                          chip.selected ? "border-2 border-blue-500 bg-blue-50" : ""
                                       }`}
                                    >
                                       <Box className="flex items-start justify-between mb-1">
                                          <MuiChip label={`#${index + 1}`} size="small" color={chip.selected ? "primary" : "default"} />
                                          <Box className="flex gap-0.5">
                                             <Tooltip title="Duplicar">
                                                <IconButton size="small" onClick={() => duplicateChip(chip)} className="text-blue-600">
                                                   <ContentCopy fontSize="small" />
                                                </IconButton>
                                             </Tooltip>
                                             <Tooltip title="Eliminar">
                                                <IconButton size="small" onClick={() => removeChip(chip.id)} className="text-red-600">
                                                   <Delete fontSize="small" />
                                                </IconButton>
                                             </Tooltip>
                                          </Box>
                                       </Box>

                                       <Typography variant="caption" className="block text-gray-600 font-medium text-xs">
                                          {chip.iccid || "Sin ICCID"}
                                       </Typography>
                                       <Typography variant="caption" className="block text-gray-500 text-xs">
                                          {chip.phoneNumber || "Sin teléfono"}
                                       </Typography>

                                       {viewMode === "selection" && (
                                          <Box className="mt-2 flex items-center">
                                             <Switch
                                                size="small"
                                                checked={chip.selected || false}
                                                onChange={(e) => handleChipToggle(chip.id, e.target.checked)}
                                                color="primary"
                                             />
                                             {/* <Checkbox
                                                size="small"
                                                checked={chip.selected || false}
                                                onChange={(e) => handleChipToggle(chip.id, e.target.checked)}
                                                color="primary"
                                             /> */}
                                             <Typography variant="caption" className="text-gray-600">
                                                Seleccionar
                                             </Typography>
                                          </Box>
                                       )}
                                    </Paper>
                                 </motion.div>
                              ))}
                           </AnimatePresence>
                        </Box>
                     </Card>
                  </motion.div>
               )}
            </Box>
         </motion.div>

         <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
         >
            <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
               {snackbar.message}
            </Alert>
         </Snackbar>
      </Box>
   );
};

export default ChipEditor;

// // TemplateEditorView.tsx
// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//    Box,
//    Button,
//    Select,
//    MenuItem,
//    FormControl,
//    InputLabel,
//    Typography,
//    Card,
//    IconButton,
//    Chip as MuiChip,
//    Alert,
//    Snackbar,
//    Paper,
//    Divider,
//    Tooltip
// } from "@mui/material";
// import { Add, Delete, Visibility, Edit, FileUpload, Download, Print, ContentCopy, PictureAsPdf, GridOn } from "@mui/icons-material";
// import { ChipData, TemplateType } from "./types";
// import ChipsTemplate from "./ChipsTemplate";
// import { exportToExcel, exportToPDF } from "./exportUtils";
// import { useGlobalContext } from "../../../../context/GlobalContext";
// import { exportToExcelWithDesign } from "./exportUtils";

// const TemplateEditorView: React.FC = () => {
//    const { setIsLoading } = useGlobalContext();
//    const [chips, setChips] = useState<ChipData[]>([]);
//    const [templateType, setTemplateType] = useState<TemplateType>("A4");
//    const [editable, setEditable] = useState(true);
//    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
//    const templateRef = useRef<HTMLDivElement>(null);

//    useEffect(() => {
//       const initialData: ChipData[] = Array.from({ length: 40 }, (_, index) => ({
//          id: `chip-${index + 1}`,
//          iccid: `8931040610123456789${index.toString().padStart(2, "0")}`,
//          phoneNumber: `+1 555-01${index.toString().padStart(2, "0")}`,
//          preActivationDate: "2024-01-15",
//          status: "Pre-activado",
//          amount: "50"
//       }));
//       setChips(initialData);
//       setIsLoading(false);
//    }, []);

//    const handleChipEdit = (id: string, field: keyof ChipData, value: string) => {
//       setChips((prev) => prev.map((chip) => (chip.id === id ? { ...chip, [field]: value } : chip)));
//    };

//    const addChip = () => {
//       const newChip: ChipData = {
//          id: `chip-${Date.now()}`,
//          iccid: "",
//          phoneNumber: "",
//          preActivationDate: new Date().toISOString().split("T")[0],
//          status: "Pendiente",
//          amount: "50"
//       };
//       setChips((prev) => [...prev, newChip]);
//       showSnackbar("Chip agregado correctamente", "success");
//    };

//    const removeChip = (id: string) => {
//       setChips((prev) => prev.filter((chip) => chip.id !== id));
//       showSnackbar("Chip eliminado", "success");
//    };

//    const duplicateChip = (chip: ChipData) => {
//       const duplicatedChip: ChipData = {
//          ...chip,
//          id: `chip-${Date.now()}`,
//          phoneNumber: `${chip.phoneNumber}-copy`
//       };
//       setChips((prev) => [...prev, duplicatedChip]);
//       showSnackbar("Chip duplicado", "success");
//    };

//    const handleExportExcel = () => {
//       // exportToExcel(chips, templateType);
//       // showSnackbar("Plantilla exportada a Excel", "success");
//       exportToExcelWithDesign(chips, templateType);
//       showSnackbar("Plantilla exportada a Excel con diseño", "success");
//    };

//    const handleExportPDF = () => {
//       if (templateRef.current) {
//          exportToPDF(templateRef.current, templateType);
//          showSnackbar("Plantilla exportada a PDF", "success");
//       }
//    };

//    const clearAll = () => {
//       setChips([]);
//       showSnackbar("Todos los chips han sido eliminados", "success");
//    };

//    const showSnackbar = (message: string, severity: "success" | "error") => {
//       setSnackbar({ open: true, message, severity });
//    };

//    return (
//       <Box className="min-h-screen bg-gray-50 p-4">
//          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
//             <Typography variant="h4" className="text-center font-bold text-gray-800 mb-2">
//                📱 Editor de Plantillas de Chips
//             </Typography>
//             <Typography variant="subtitle1" className="text-center text-gray-600 mb-6">
//                Diseña y exporta tus plantillas para impresión
//             </Typography>
//          </motion.div>

//          {/* Controles principales */}
//          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
//             <Card className="p-4 mb-4 rounded-xl shadow-md">
//                <Box className="flex flex-wrap gap-3 items-center justify-between">
//                   <Box className="flex flex-wrap gap-3 items-center">
//                      <FormControl size="small" className="min-w-28">
//                         <InputLabel>Plantilla</InputLabel>
//                         <Select value={templateType} label="Plantilla" onChange={(e) => setTemplateType(e.target.value as TemplateType)}>
//                            <MenuItem value="A4">A4</MenuItem>
//                            <MenuItem value="TABLOIDE">Tabloide</MenuItem>
//                         </Select>
//                      </FormControl>

//                      <Button variant={editable ? "contained" : "outlined"} startIcon={<Edit />} onClick={() => setEditable(true)} size="small">
//                         Editar
//                      </Button>

//                      <Button variant={!editable ? "contained" : "outlined"} startIcon={<Visibility />} onClick={() => setEditable(false)} size="small">
//                         Vista Previa
//                      </Button>
//                   </Box>

//                   <Box className="flex flex-wrap gap-2">
//                      <Tooltip title="Agregar nuevo chip">
//                         <Button variant="contained" startIcon={<Add />} onClick={addChip} size="small" className="bg-green-600 hover:bg-green-700">
//                            Agregar
//                         </Button>
//                      </Tooltip>

//                      <Tooltip title="Eliminar todos los chips">
//                         <Button variant="outlined" color="error" startIcon={<Delete />} onClick={clearAll} size="small">
//                            Limpiar
//                         </Button>
//                      </Tooltip>
//                   </Box>
//                </Box>

//                <Divider className="my-3" />

//                <Box className="flex flex-wrap gap-2 justify-center">
//                   <Tooltip title="Exportar a Excel">
//                      <Button variant="outlined" startIcon={<GridOn />} onClick={handleExportExcel} size="small" className="text-green-600 border-green-600">
//                         Excel
//                      </Button>
//                   </Tooltip>

//                   <Tooltip title="Exportar a PDF">
//                      <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={handleExportPDF} size="small" className="text-red-600 border-red-600">
//                         PDF
//                      </Button>
//                   </Tooltip>

//                   <Tooltip title="Imprimir plantilla">
//                      <Button variant="contained" startIcon={<Print />} onClick={() => window.print()} size="small" className="bg-blue-600 hover:bg-blue-700">
//                         Imprimir
//                      </Button>
//                   </Tooltip>
//                </Box>
//             </Card>

//             {/* Contenido principal */}
//             <Box className="grid grid-cols-1 xl:grid-cols-4 gap-4">
//                {/* Preview de plantilla */}
//                <Box className="xl:col-span-3">
//                   <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
//                      <Card className="p-2 rounded-xl shadow-md" ref={templateRef}>
//                         <ChipsTemplate data={chips} templateType={templateType} onChipEdit={editable ? handleChipEdit : undefined} editable={editable} />
//                      </Card>
//                   </motion.div>
//                </Box>

//                {/* Lista de chips */}
//                {editable && (
//                   <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="xl:col-span-1">
//                      <Card className="p-3 rounded-xl shadow-md h-[500px] flex flex-col">
//                         <Typography variant="h6" className="font-bold text-gray-700 mb-3">
//                            Chips ({chips.length})
//                         </Typography>

//                         <Box className="flex-1 overflow-y-auto space-y-2">
//                            <AnimatePresence>
//                               {chips.map((chip, index) => (
//                                  <motion.div
//                                     key={chip.id}
//                                     layout
//                                     initial={{ opacity: 0, scale: 0.9 }}
//                                     animate={{ opacity: 1, scale: 1 }}
//                                     exit={{ opacity: 0, scale: 0.9 }}
//                                     transition={{ duration: 0.2 }}
//                                  >
//                                     <Paper className="p-2 rounded-lg hover:shadow-md transition-all duration-200">
//                                        <Box className="flex items-start justify-between mb-1">
//                                           <MuiChip label={`#${index + 1}`} size="small" color="primary" />
//                                           <Box className="flex gap-0.5">
//                                              <Tooltip title="Duplicar">
//                                                 <IconButton size="small" onClick={() => duplicateChip(chip)} className="text-blue-600">
//                                                    <ContentCopy fontSize="small" />
//                                                 </IconButton>
//                                              </Tooltip>
//                                              <Tooltip title="Eliminar">
//                                                 <IconButton size="small" onClick={() => removeChip(chip.id)} className="text-red-600">
//                                                    <Delete fontSize="small" />
//                                                 </IconButton>
//                                              </Tooltip>
//                                           </Box>
//                                        </Box>

//                                        <Typography variant="caption" className="block text-gray-600 font-medium text-xs">
//                                           {chip.iccid || "Sin ICCID"}
//                                        </Typography>
//                                        <Typography variant="caption" className="block text-gray-500 text-xs">
//                                           {chip.phoneNumber || "Sin teléfono"}
//                                        </Typography>
//                                     </Paper>
//                                  </motion.div>
//                               ))}
//                            </AnimatePresence>
//                         </Box>
//                      </Card>
//                   </motion.div>
//                )}
//             </Box>
//          </motion.div>

//          <Snackbar
//             open={snackbar.open}
//             autoHideDuration={3000}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//          >
//             <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
//                {snackbar.message}
//             </Alert>
//          </Snackbar>
//       </Box>
//    );
// };

// export default TemplateEditorView;
