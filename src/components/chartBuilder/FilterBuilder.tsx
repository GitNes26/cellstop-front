// components/ChartBuilder/FilterBuilder.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, Paper, Button, FormControl, InputLabel, Select, MenuItem, TextField, IconButton, Chip, Divider } from "@mui/material";
import { Add, Delete, FilterList } from "@mui/icons-material";
import { DataField, FilterCondition, FilterOperator } from "../../types/reporter";

interface FilterBuilderProps {
   fields: DataField[];
   filters: FilterCondition[];
   onFiltersChange: (filters: FilterCondition[]) => void;
}

const operatorOptions: { value: FilterOperator; label: string; types: string[] }[] = [
   { value: "equals", label: "Igual a", types: ["string", "number", "date", "boolean"] },
   { value: "not_equals", label: "No igual a", types: ["string", "number", "date", "boolean"] },
   { value: "contains", label: "Contiene", types: ["string"] },
   { value: "starts_with", label: "Comienza con", types: ["string"] },
   { value: "ends_with", label: "Termina con", types: ["string"] },
   { value: "greater_than", label: "Mayor que", types: ["number", "date"] },
   { value: "less_than", label: "Menor que", types: ["number", "date"] },
   { value: "between", label: "Entre", types: ["number", "date"] },
   { value: "is_empty", label: "Está vacío", types: ["string", "number", "date"] },
   { value: "is_not_empty", label: "No está vacío", types: ["string", "number", "date"] }
];

const FilterBuilder: React.FC<FilterBuilderProps> = ({ fields, filters, onFiltersChange }) => {
   const addFilter = () => {
      const newFilter: FilterCondition = {
         id: `filter-${Date.now()}`,
         field: fields[0]?.id || "",
         operator: "equals",
         value: ""
      };
      onFiltersChange([...filters, newFilter]);
   };

   const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
      onFiltersChange(filters.map((filter) => (filter.id === id ? { ...filter, ...updates } : filter)));
   };

   const removeFilter = (id: string) => {
      onFiltersChange(filters.filter((filter) => filter.id !== id));
   };

   const getFieldType = (fieldId: string) => {
      return fields.find((f) => f.id === fieldId)?.type || "string";
   };

   const getOperatorsForField = (fieldType: string) => {
      return operatorOptions.filter((op) => op.types.includes(fieldType));
   };

   const renderValueInput = (filter: FilterCondition) => {
      const fieldType = getFieldType(filter.field);
      const operator = filter.operator;

      if (operator === "is_empty" || operator === "is_not_empty") {
         return null;
      }

      if (operator === "between") {
         return (
            <Box className="flex gap-2">
               <TextField
                  size="small"
                  type={fieldType === "date" ? "date" : fieldType === "number" ? "number" : "text"}
                  value={filter.value || ""}
                  onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                  placeholder="Desde"
                  fullWidth
               />
               <TextField
                  size="small"
                  type={fieldType === "date" ? "date" : fieldType === "number" ? "number" : "text"}
                  value={filter.value2 || ""}
                  onChange={(e) => updateFilter(filter.id, { value2: e.target.value })}
                  placeholder="Hasta"
                  fullWidth
               />
            </Box>
         );
      }

      if (fieldType === "boolean") {
         return (
            <FormControl fullWidth size="small">
               <Select value={filter.value || ""} onChange={(e) => updateFilter(filter.id, { value: e.target.value })}>
                  <MenuItem value="true">Verdadero</MenuItem>
                  <MenuItem value="false">Falso</MenuItem>
               </Select>
            </FormControl>
         );
      }

      return (
         <TextField
            size="small"
            type={fieldType === "date" ? "date" : fieldType === "number" ? "number" : "text"}
            value={filter.value || ""}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            placeholder="Valor..."
            fullWidth
         />
      );
   };

   return (
      <Paper className="p-4 rounded-2xl shadow-sm border">
         <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center gap-2">
               <FilterList className="text-gray-600" />
               <Typography variant="h6" className="font-semibold text-gray-800">
                  Filtros
               </Typography>
            </Box>
            <Button startIcon={<Add />} onClick={addFilter} variant="outlined" size="small">
               Agregar Filtro
            </Button>
         </Box>

         <AnimatePresence>
            {filters.length === 0 ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8 text-gray-500">
                  <FilterList className="text-4xl mb-2 text-gray-300" />
                  <Typography variant="body2">No hay filtros aplicados</Typography>
                  <Typography variant="caption">Agrega filtros para refinar tus datos</Typography>
               </motion.div>
            ) : (
               <Box className="space-y-3">
                  {filters.map((filter, index) => (
                     <motion.div
                        key={filter.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                     >
                        <Paper className="p-3 border border-gray-200 rounded-lg">
                           <Box className="flex items-start gap-3">
                              <Chip label={`Filtro ${index + 1}`} size="small" color="primary" variant="outlined" />

                              <Box className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                                 {/* Campo */}
                                 <FormControl size="small" className="md:col-span-4">
                                    <InputLabel>Campo</InputLabel>
                                    <Select value={filter.field} label="Campo" onChange={(e) => updateFilter(filter.id, { field: e.target.value })}>
                                       {fields.map((field) => (
                                          <MenuItem key={field.id} value={field.id}>
                                             {field.displayName}
                                          </MenuItem>
                                       ))}
                                    </Select>
                                 </FormControl>

                                 {/* Operador */}
                                 <FormControl size="small" className="md:col-span-3">
                                    <InputLabel>Operador</InputLabel>
                                    <Select
                                       value={filter.operator}
                                       label="Operador"
                                       onChange={(e) => updateFilter(filter.id, { operator: e.target.value as FilterOperator })}
                                    >
                                       {getOperatorsForField(getFieldType(filter.field)).map((op) => (
                                          <MenuItem key={op.value} value={op.value}>
                                             {op.label}
                                          </MenuItem>
                                       ))}
                                    </Select>
                                 </FormControl>

                                 {/* Valor */}
                                 <Box className="md:col-span-4">{renderValueInput(filter)}</Box>

                                 {/* Eliminar */}
                                 <Box className="md:col-span-1 flex justify-center">
                                    <IconButton size="small" onClick={() => removeFilter(filter.id)} className="text-red-600 hover:bg-red-50">
                                       <Delete fontSize="small" />
                                    </IconButton>
                                 </Box>
                              </Box>
                           </Box>
                        </Paper>
                     </motion.div>
                  ))}
               </Box>
            )}
         </AnimatePresence>

         {filters.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.5 }}>
               <Divider className="my-4" />
               <Box className="flex items-center justify-between">
                  <Typography variant="body2" className="text-gray-600">
                     {filters.length} filtro{filters.length !== 1 ? "s" : ""} aplicado{filters.length !== 1 ? "s" : ""}
                  </Typography>
                  <Button onClick={() => onFiltersChange([])} color="error" size="small">
                     Limpiar todos
                  </Button>
               </Box>
            </motion.div>
         )}
      </Paper>
   );
};

export default FilterBuilder;
