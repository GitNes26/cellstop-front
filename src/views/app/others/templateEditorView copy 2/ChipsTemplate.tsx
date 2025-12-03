// ChipsTemplate.tsx (actualizado)
import React from "react";
import { motion } from "framer-motion";
import { Box, TextField, MenuItem, Typography, useTheme, useMediaQuery, Checkbox, Tooltip } from "@mui/material";
import { ChipData, TemplateType, ViewMode } from "../../../../types/types";

interface ChipsTemplateProps {
   data: ChipData[];
   templateType: TemplateType;
   viewMode: ViewMode;
   onChipEdit?: (id: string, field: keyof ChipData, value: string) => void;
   onChipToggle?: (id: string, selected: boolean) => void;
   onSelectAll?: (selected: boolean) => void;
}

const ChipsTemplate: React.FC<ChipsTemplateProps> = ({ data, templateType, viewMode, onChipEdit, onChipToggle, onSelectAll }) => {
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

   const config = {
      A4: { columns: 5, rows: 8, className: "a4" },
      TABLOIDE: { columns: 7, rows: 12, className: "tabloide" }
   };

   const currentConfig = config[templateType];
   const totalSlots = currentConfig.columns * currentConfig.rows;
   const selectedChips = data.filter((chip) => chip.selected);
   const allSelected = selectedChips.length === data.length && data.length > 0;

   const handleInputChange = (id: string, field: keyof ChipData, value: string) => {
      if (onChipEdit) {
         onChipEdit(id, field, value);
      }
   };

   const handleToggle = (id: string, selected: boolean) => {
      if (onChipToggle) {
         onChipToggle(id, selected);
      }
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case "Pre-activado":
            return "#f59e0b";
         case "Activado":
            return "#10b981";
         case "Pendiente":
            return "#ef4444";
         default:
            return "#6b7280";
      }
   };

   return (
      <Box className="w-full bg-white p-2 print:p-0">
         {/* Header con contador de seleccionados */}
         {viewMode === "selection" && (
            <Box className="flex items-center justify-between mb-3 p-2 bg-blue-50 rounded-lg">
               <Typography variant="subtitle2" className="font-semibold text-blue-800">
                  {selectedChips.length} de {data.length} chips seleccionados
               </Typography>
               <Tooltip title={allSelected ? "Deseleccionar todos" : "Seleccionar todos"}>
                  <Checkbox
                     checked={allSelected}
                     indeterminate={selectedChips.length > 0 && !allSelected}
                     onChange={(e) => onSelectAll?.(e.target.checked)}
                     color="primary"
                  />
               </Tooltip>
            </Box>
         )}

         <Box
            className="grid gap-1 print:gap-0"
            style={{
               gridTemplateColumns: `repeat(${currentConfig.columns}, 1fr)`,
               gridTemplateRows: `repeat(${currentConfig.rows}, 1fr)`
            }}
         >
            {Array.from({ length: totalSlots }).map((_, index) => {
               const chipData = data[index];

               return (
                  <motion.div
                     key={chipData?.id || `empty-${index}`}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.2, delay: index * 0.01 }}
                  >
                     <Box
                        className={`
                  border-2 relative
                  ${chipData ? (chipData.selected ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-300 bg-white") : "border-dashed border-gray-300 bg-gray-50"} 
                  p-1 print:p-0.5 
                  min-h-[80px] print:min-h-[70px]
                  flex flex-col justify-between
                  transition-all duration-200
                  ${viewMode === "selection" && chipData ? "cursor-pointer hover:border-blue-300" : ""}
                `}
                        onClick={() => {
                           if (viewMode === "selection" && chipData) {
                              handleToggle(chipData.id, !chipData.selected);
                           }
                        }}
                     >
                        {/* Checkbox de selección */}
                        {viewMode === "selection" && chipData && (
                           <Box className="absolute -top-2 -left-2 z-10">
                              <Checkbox
                                 size="small"
                                 checked={chipData.selected || false}
                                 onChange={(e) => {
                                    e.stopPropagation();
                                    handleToggle(chipData.id, e.target.checked);
                                 }}
                                 onClick={(e) => e.stopPropagation()}
                                 color="primary"
                                 sx={{
                                    color: "primary.main",
                                    "&.Mui-checked": {
                                       color: "primary.main"
                                    },
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                    padding: "2px"
                                 }}
                              />
                           </Box>
                        )}

                        {chipData ? (
                           <>
                              <Typography variant="caption" className="text-center font-bold text-red-600 block text-[10px] print:text-[8px]">
                                 ACTIVA CON ${chipData.amount}
                              </Typography>

                              <Box className="space-y-0.5">
                                 <Box className="flex items-start">
                                    <Typography variant="caption" className="font-semibold text-gray-600 text-[8px] print:text-[6px] min-w-8">
                                       ICCID:
                                    </Typography>
                                    {viewMode === "edit" ? (
                                       <TextField
                                          size="small"
                                          value={chipData.iccid}
                                          onChange={(e) => handleInputChange(chipData.id, "iccid", e.target.value)}
                                          className="flex-1"
                                          inputProps={{
                                             className: "text-[8px] print:text-[6px] p-1 h-6",
                                             style: { fontSize: "8px", height: "20px" }
                                          }}
                                          sx={{
                                             "& .MuiInputBase-root": { height: "20px" },
                                             "& .MuiInputBase-input": { padding: "2px 4px", fontSize: "8px" }
                                          }}
                                       />
                                    ) : (
                                       <Typography variant="caption" className="text-gray-800 text-[8px] print:text-[6px] break-all">
                                          {chipData.iccid}
                                       </Typography>
                                    )}
                                 </Box>

                                 <Box className="flex items-start">
                                    <Typography variant="caption" className="font-semibold text-gray-600 text-[8px] print:text-[6px] min-w-8">
                                       TEL:
                                    </Typography>
                                    {viewMode === "edit" ? (
                                       <TextField
                                          size="small"
                                          value={chipData.phoneNumber}
                                          onChange={(e) => handleInputChange(chipData.id, "phoneNumber", e.target.value)}
                                          className="flex-1"
                                          inputProps={{
                                             className: "text-[8px] print:text-[6px] p-1 h-6",
                                             style: { fontSize: "8px", height: "20px" }
                                          }}
                                          sx={{
                                             "& .MuiInputBase-root": { height: "20px" },
                                             "& .MuiInputBase-input": { padding: "2px 4px", fontSize: "8px" }
                                          }}
                                       />
                                    ) : (
                                       <Typography variant="caption" className="text-gray-800 text-[8px] print:text-[6px]">
                                          {chipData.phoneNumber}
                                       </Typography>
                                    )}
                                 </Box>

                                 <Box className="flex items-start">
                                    <Typography variant="caption" className="font-semibold text-gray-600 text-[8px] print:text-[6px] min-w-8">
                                       FECHA:
                                    </Typography>
                                    {viewMode === "edit" ? (
                                       <TextField
                                          type="date"
                                          size="small"
                                          value={chipData.preActivationDate}
                                          onChange={(e) => handleInputChange(chipData.id, "preActivationDate", e.target.value)}
                                          className="flex-1"
                                          inputProps={{
                                             className: "text-[8px] print:text-[6px] p-1 h-6",
                                             style: { fontSize: "8px", height: "20px" }
                                          }}
                                          sx={{
                                             "& .MuiInputBase-root": { height: "20px" },
                                             "& .MuiInputBase-input": { padding: "2px 4px", fontSize: "8px" }
                                          }}
                                       />
                                    ) : (
                                       <Typography variant="caption" className="text-gray-800 text-[8px] print:text-[6px]">
                                          {chipData.preActivationDate}
                                       </Typography>
                                    )}
                                 </Box>

                                 <Box className="flex items-center">
                                    <Typography variant="caption" className="font-semibold text-gray-600 text-[8px] print:text-[6px] min-w-8">
                                       EST:
                                    </Typography>
                                    {viewMode === "edit" ? (
                                       <TextField
                                          select
                                          size="small"
                                          value={chipData.status}
                                          onChange={(e) => handleInputChange(chipData.id, "status", e.target.value)}
                                          className="flex-1"
                                          sx={{
                                             "& .MuiInputBase-root": { height: "20px" },
                                             "& .MuiSelect-select": { padding: "2px 4px", fontSize: "8px" }
                                          }}
                                       >
                                          <MenuItem value="Pre-activado" sx={{ fontSize: "8px" }}>
                                             Pre-activado
                                          </MenuItem>
                                          <MenuItem value="Activado" sx={{ fontSize: "8px" }}>
                                             Activado
                                          </MenuItem>
                                          <MenuItem value="Pendiente" sx={{ fontSize: "8px" }}>
                                             Pendiente
                                          </MenuItem>
                                       </TextField>
                                    ) : (
                                       <Box
                                          className="px-1 py-0.5 rounded text-[8px] print:text-[6px] font-medium"
                                          style={{ backgroundColor: `${getStatusColor(chipData.status)}20`, color: getStatusColor(chipData.status) }}
                                       >
                                          {chipData.status}
                                       </Box>
                                    )}
                                 </Box>
                              </Box>
                           </>
                        ) : (
                           <Box className="h-full flex flex-col items-center justify-center text-gray-400">
                              <Typography variant="caption" className="italic text-[10px] print:text-[8px] text-center">
                                 ACTIVA CON $50
                              </Typography>
                              <Typography variant="caption" className="text-gray-500 text-[8px] print:text-[6px]">
                                 {index + 1}
                              </Typography>
                           </Box>
                        )}
                     </Box>
                  </motion.div>
               );
            })}
         </Box>
      </Box>
   );
};

export default ChipsTemplate;

// // ChipsTemplate.tsx
// import React from "react";
// import { motion } from "framer-motion";
// import { Box, TextField, MenuItem, Typography, useTheme, useMediaQuery } from "@mui/material";
// import { ChipData, TemplateType } from "./types";

// interface ChipsTemplateProps {
//    data: ChipData[];
//    templateType: TemplateType;
//    onChipEdit?: (id: string, field: keyof ChipData, value: string) => void;
//    editable?: boolean;
// }

// const ChipsTemplate: React.FC<ChipsTemplateProps> = ({ data, templateType, onChipEdit, editable = false }) => {
//    const theme = useTheme();
//    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//    const config = {
//       A4: { columns: 5, rows: 8, className: "a4" },
//       TABLOIDE: { columns: 7, rows: 12, className: "tabloide" }
//    };

//    const currentConfig = config[templateType];
//    const totalSlots = currentConfig.columns * currentConfig.rows;

//    const handleInputChange = (id: string, field: keyof ChipData, value: string) => {
//       if (onChipEdit) {
//          onChipEdit(id, field, value);
//       }
//    };

//    const getStatusColor = (status: string) => {
//       switch (status) {
//          case "Pre-activado":
//             return "#f59e0b";
//          case "Activado":
//             return "#10b981";
//          case "Pendiente":
//             return "#ef4444";
//          default:
//             return "#6b7280";
//       }
//    };

//    return (
//       <Box className="w-full bg-white p-2 print:p-0">
//          <Box
//             className="grid gap-1 print:gap-0"
//             style={{
//                gridTemplateColumns: `repeat(${currentConfig.columns}, 1fr)`,
//                gridTemplateRows: `repeat(${currentConfig.rows}, 1fr)`
//             }}
//          >
//             {Array.from({ length: totalSlots }).map((_, index) => {
//                const chipData = data[index];

//                return (
//                   <motion.div
//                      key={chipData?.id || `empty-${index}`}
//                      initial={{ opacity: 0, scale: 0.9 }}
//                      animate={{ opacity: 1, scale: 1 }}
//                      transition={{ duration: 0.2, delay: index * 0.01 }}
//                   >
//                      <Box
//                         className={`
//                   border border-gray-300 p-1 print:p-0.5
//                   ${chipData ? "bg-white" : "bg-gray-50"}
//                   min-h-[80px] print:min-h-[70px]
//                   flex flex-col justify-between
//                 `}
//                      >
//                         {chipData ? (
//                            <>
//                               <Typography variant="caption" className="text-center font-bold text-red-600 block text-[10px] print:text-[8px]">
//                                  ACTIVA CON ${chipData.amount}
//                               </Typography>

//                               <Box className="space-y-0.5">
//                                  <Box className="flex items-start">
//                                     <Typography variant="caption" className="font-semibold text-gray-600 text-[8px] print:text-[6px] min-w-8">
//                                        ICCID:
//                                     </Typography>
//                                     {editable ? (
//                                        <TextField
//                                           size="small"
//                                           value={chipData.iccid}
//                                           onChange={(e) => handleInputChange(chipData.id, "iccid", e.target.value)}
//                                           className="flex-1"
//                                           inputProps={{
//                                              className: "text-[8px] print:text-[6px] p-1 h-6",
//                                              style: { fontSize: "8px", height: "20px" }
//                                           }}
//                                           sx={{
//                                              "& .MuiInputBase-root": { height: "20px" },
//                                              "& .MuiInputBase-input": { padding: "2px 4px", fontSize: "8px" }
//                                           }}
//                                        />
//                                     ) : (
//                                        <Typography variant="caption" className="text-gray-800 text-[8px] print:text-[6px] break-all">
//                                           {chipData.iccid}
//                                        </Typography>
//                                     )}
//                                  </Box>

//                                  <Box className="flex items-start">
//                                     <Typography variant="caption" className="font-semibold text-gray-600 text-[8px] print:text-[6px] min-w-8">
//                                        TEL:
//                                     </Typography>
//                                     {editable ? (
//                                        <TextField
//                                           size="small"
//                                           value={chipData.phoneNumber}
//                                           onChange={(e) => handleInputChange(chipData.id, "phoneNumber", e.target.value)}
//                                           className="flex-1"
//                                           inputProps={{
//                                              className: "text-[8px] print:text-[6px] p-1 h-6",
//                                              style: { fontSize: "8px", height: "20px" }
//                                           }}
//                                           sx={{
//                                              "& .MuiInputBase-root": { height: "20px" },
//                                              "& .MuiInputBase-input": { padding: "2px 4px", fontSize: "8px" }
//                                           }}
//                                        />
//                                     ) : (
//                                        <Typography variant="caption" className="text-gray-800 text-[8px] print:text-[6px]">
//                                           {chipData.phoneNumber}
//                                        </Typography>
//                                     )}
//                                  </Box>

//                                  <Box className="flex items-start">
//                                     <Typography variant="caption" className="font-semibold text-gray-600 text-[8px] print:text-[6px] min-w-8">
//                                        FECHA:
//                                     </Typography>
//                                     {editable ? (
//                                        <TextField
//                                           type="date"
//                                           size="small"
//                                           value={chipData.preActivationDate}
//                                           onChange={(e) => handleInputChange(chipData.id, "preActivationDate", e.target.value)}
//                                           className="flex-1"
//                                           inputProps={{
//                                              className: "text-[8px] print:text-[6px] p-1 h-6",
//                                              style: { fontSize: "8px", height: "20px" }
//                                           }}
//                                           sx={{
//                                              "& .MuiInputBase-root": { height: "20px" },
//                                              "& .MuiInputBase-input": { padding: "2px 4px", fontSize: "8px" }
//                                           }}
//                                        />
//                                     ) : (
//                                        <Typography variant="caption" className="text-gray-800 text-[8px] print:text-[6px]">
//                                           {chipData.preActivationDate}
//                                        </Typography>
//                                     )}
//                                  </Box>

//                                  <Box className="flex items-center">
//                                     <Typography variant="caption" className="font-semibold text-gray-600 text-[8px] print:text-[6px] min-w-8">
//                                        EST:
//                                     </Typography>
//                                     {editable ? (
//                                        <TextField
//                                           select
//                                           size="small"
//                                           value={chipData.status}
//                                           onChange={(e) => handleInputChange(chipData.id, "status", e.target.value)}
//                                           className="flex-1"
//                                           sx={{
//                                              "& .MuiInputBase-root": { height: "20px" },
//                                              "& .MuiSelect-select": { padding: "2px 4px", fontSize: "8px" }
//                                           }}
//                                        >
//                                           <MenuItem value="Pre-activado" sx={{ fontSize: "8px" }}>
//                                              Pre-activado
//                                           </MenuItem>
//                                           <MenuItem value="Activado" sx={{ fontSize: "8px" }}>
//                                              Activado
//                                           </MenuItem>
//                                           <MenuItem value="Pendiente" sx={{ fontSize: "8px" }}>
//                                              Pendiente
//                                           </MenuItem>
//                                        </TextField>
//                                     ) : (
//                                        <Box
//                                           className="px-1 py-0.5 rounded text-[8px] print:text-[6px] font-medium"
//                                           style={{ backgroundColor: `${getStatusColor(chipData.status)}20`, color: getStatusColor(chipData.status) }}
//                                        >
//                                           {chipData.status}
//                                        </Box>
//                                     )}
//                                  </Box>
//                               </Box>
//                            </>
//                         ) : (
//                            <Box className="h-full flex flex-col items-center justify-center text-gray-400">
//                               <Typography variant="caption" className="italic text-[10px] print:text-[8px] text-center">
//                                  ACTIVA CON $50
//                               </Typography>
//                               <Typography variant="caption" className="text-gray-500 text-[8px] print:text-[6px]">
//                                  {index + 1}
//                               </Typography>
//                            </Box>
//                         )}
//                      </Box>
//                   </motion.div>
//                );
//             })}
//          </Box>
//       </Box>
//    );
// };

// export default ChipsTemplate;
