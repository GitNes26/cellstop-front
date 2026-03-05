import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Checkbox, TextField, IconButton, Typography, Paper, Button, Stack, InputAdornment } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

interface ColumnSelectorProps {
   columns: string[]; // Nombres originales (snake_case)
   selectedColumns: string[]; // Columnas seleccionadas
   onSelectionChange: (selected: string[]) => void;
   customLabels: Record<string, string>; // Etiquetas personalizadas
   onLabelsChange: (labels: Record<string, string>) => void;
   onOrderChange?: (orderedColumns: string[]) => void; // Nuevo orden
   title?: string;
   onTitleChange?: (title: string) => void;
}

// Componente individual para cada columna
const SortableColumnItem: React.FC<{
   column: string;
   selected: boolean;
   onToggle: (column: string, checked: boolean) => void;
   label: string;
   onLabelChange: (column: string, newLabel: string) => void;
   disabled: boolean;
}> = ({ column, selected, onToggle, label, onLabelChange, disabled }) => {
   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column });

   const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1
   };

   return (
      <Box
         ref={setNodeRef}
         style={style}
         {...attributes}
         sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "background.paper",
            p: 1,
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            "&:hover": { bgcolor: "action.hover" },
            cursor: isDragging ? "grabbing" : "default"
         }}
      >
         {/* Ícono de arrastre con los listeners */}
         <IconButton size="small" {...listeners} sx={{ cursor: "grab" }}>
            <DragIndicatorIcon />
         </IconButton>
         <Checkbox size="small" checked={selected} onChange={(e) => onToggle(column, e.target.checked)} />
         <TextField
            size="small"
            fullWidth
            placeholder={column}
            value={label}
            onChange={(e) => onLabelChange(column, e.target.value)}
            disabled={disabled}
            variant="outlined"
            InputProps={{ style: { fontSize: "0.9rem" } }}
         />
      </Box>
   );
};

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
   columns,
   selectedColumns,
   onSelectionChange,
   customLabels,
   onLabelsChange,
   onOrderChange,
   title,
   onTitleChange
}) => {
   const [orderedColumns, setOrderedColumns] = useState<string[]>(columns);

   // Sincronizar cuando cambien las columnas originales
   useEffect(() => {
      setOrderedColumns(columns);
   }, [columns]);

   // Sensores para detectar arrastre
   const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
         coordinateGetter: sortableKeyboardCoordinates
      })
   );

   // Manejar fin de arrastre
   const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
         setOrderedColumns((items) => {
            const oldIndex = items.indexOf(active.id as string);
            const newIndex = items.indexOf(over?.id as string);
            const newOrder = arrayMove(items, oldIndex, newIndex);
            onOrderChange?.(newOrder);
            return newOrder;
         });
      }
   };

   // Seleccionar todas
   const handleSelectAll = () => {
      onSelectionChange([...columns]);
   };

   // Deseleccionar todas
   const handleDeselectAll = () => {
      onSelectionChange([]);
   };

   // Alternar una columna
   const handleToggleColumn = (column: string, checked: boolean) => {
      if (checked) {
         onSelectionChange([...selectedColumns, column]);
      } else {
         onSelectionChange(selectedColumns.filter((c) => c !== column));
      }
   };

   // Cambiar etiqueta personalizada
   const handleLabelChange = (column: string, newLabel: string) => {
      onLabelsChange({ ...customLabels, [column]: newLabel });
   };

   // Restablecer nombres a formato legible (snake_case -> Título Con Espacios)
   const resetLabelsToDefault = () => {
      const defaultLabels: Record<string, string> = {};
      columns.forEach((col) => {
         defaultLabels[col] = col
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
      });
      onLabelsChange(defaultLabels);
   };

   return (
      <Box>
         {/* Campo para título del archivo */}
         {onTitleChange && (
            <TextField
               fullWidth
               label="Título del archivo"
               value={title || ""}
               onChange={(e) => onTitleChange(e.target.value)}
               margin="normal"
               size="small"
               variant="outlined"
               placeholder="Ej: Reporte de ventas"
               slotProps={{
                  input: {
                     endAdornment: <InputAdornment position="start">.xlsx</InputAdornment>
                  }
               }}
            />
         )}

         {/* Acciones globales */}
         <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }} flexWrap="wrap">
            <Button variant="outlined" size="small" onClick={handleSelectAll}>
               Seleccionar todos
            </Button>
            <Button variant="outlined" size="small" onClick={handleDeselectAll}>
               Deseleccionar todos
            </Button>
            <Button variant="outlined" size="small" onClick={resetLabelsToDefault}>
               Restablecer nombres
            </Button>
         </Stack>

         {/* Contador de selección */}
         <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {selectedColumns.length} de {columns.length} columnas seleccionadas
         </Typography>

         {/* Grid ordenable */}
         <Paper variant="outlined" sx={{ p: 2, maxHeight: "50vh", overflow: "auto" }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
               <SortableContext items={orderedColumns} strategy={rectSortingStrategy}>
                  <Box
                     sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 2
                     }}
                  >
                     {orderedColumns.map((column) => (
                        <SortableColumnItem
                           key={column}
                           column={column}
                           selected={selectedColumns.includes(column)}
                           onToggle={handleToggleColumn}
                           label={customLabels[column] || ""}
                           onLabelChange={handleLabelChange}
                           disabled={!selectedColumns.includes(column)}
                        />
                     ))}
                  </Box>
               </SortableContext>
            </DndContext>
         </Paper>
      </Box>
   );
};

export default ColumnSelector;
