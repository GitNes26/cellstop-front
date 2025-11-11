// components/ChartBuilder/FieldSelector.tsx
import React from "react";
import { motion } from "framer-motion";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Chip, Paper, Tooltip, IconButton } from "@mui/material";
import { Info, SwapHoriz } from "@mui/icons-material";
import { DataField } from "../../types/reporter";

interface FieldSelectorProps {
   fields: DataField[];
   xAxis: string;
   yAxis: string;
   onXAxisChange: (field: string) => void;
   onYAxisChange: (field: string) => void;
   onSwapAxes: () => void;
}

const FieldSelector: React.FC<FieldSelectorProps> = ({ fields, xAxis, yAxis, onXAxisChange, onYAxisChange, onSwapAxes }) => {
   const getFieldTypeColor = (type: string) => {
      switch (type) {
         case "number":
            return "primary";
         case "string":
            return "secondary";
         case "date":
            return "success";
         case "boolean":
            return "warning";
         default:
            return "default";
      }
   };

   return (
      <Paper className="p-4 rounded-2xl shadow-sm border">
         <Box className="flex items-center justify-between mb-4">
            <Typography variant="h6" className="font-semibold text-gray-800">
               Configurar Ejes
            </Typography>
            <Tooltip title="Intercambiar ejes">
               <IconButton onClick={onSwapAxes} className="text-blue-600 hover:bg-blue-50" size="small">
                  <SwapHoriz />
               </IconButton>
            </Tooltip>
         </Box>

         <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Eje X */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
               <FormControl fullWidth size="small">
                  <InputLabel>Eje X (Categorías)</InputLabel>
                  <Select value={xAxis} label="Eje X (Categorías)" onChange={(e) => onXAxisChange(e.target.value)}>
                     {fields.map((field) => (
                        <MenuItem key={field.id} value={field.id}>
                           <Box className="flex items-center justify-between w-full">
                              <Typography variant="body2">{field.displayName}</Typography>
                              <Chip label={field.type} size="small" color={getFieldTypeColor(field.type)} variant="outlined" />
                           </Box>
                        </MenuItem>
                     ))}
                  </Select>
               </FormControl>
               {xAxis && (
                  <Box className="mt-2 flex items-center gap-2">
                     <Info fontSize="small" className="text-gray-500" />
                     <Typography variant="caption" className="text-gray-600">
                        Campos categóricos funcionan mejor en el eje X
                     </Typography>
                  </Box>
               )}
            </motion.div>

            {/* Eje Y */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
               <FormControl fullWidth size="small">
                  <InputLabel>Eje Y (Valores)</InputLabel>
                  <Select value={yAxis} label="Eje Y (Valores)" onChange={(e) => onYAxisChange(e.target.value)}>
                     {fields.map((field) => (
                        <MenuItem key={field.id} value={field.id}>
                           <Box className="flex items-center justify-between w-full">
                              <Typography variant="body2">{field.displayName}</Typography>
                              <Chip label={field.type} size="small" color={getFieldTypeColor(field.type)} variant="outlined" />
                           </Box>
                        </MenuItem>
                     ))}
                  </Select>
               </FormControl>
               {yAxis && (
                  <Box className="mt-2 flex items-center gap-2">
                     <Info fontSize="small" className="text-gray-500" />
                     <Typography variant="caption" className="text-gray-600">
                        Campos numéricos funcionan mejor en el eje Y
                     </Typography>
                  </Box>
               )}
            </motion.div>
         </Box>

         {/* Preview de selección */}
         {(xAxis || yAxis) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
               <Typography variant="subtitle2" className="text-blue-800 font-semibold mb-2">
                  Vista Previa:
               </Typography>
               <Box className="flex items-center gap-2 text-sm text-blue-700">
                  <span className="font-medium">Eje X:</span>
                  <Chip label={fields.find((f) => f.id === xAxis)?.displayName || "No seleccionado"} size="small" color="primary" />
                  <span className="font-medium ml-2">Eje Y:</span>
                  <Chip label={fields.find((f) => f.id === yAxis)?.displayName || "No seleccionado"} size="small" color="secondary" />
               </Box>
            </motion.div>
         )}
      </Paper>
   );
};

export default FieldSelector;
