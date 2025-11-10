// components/dashboard/widgets/TableWidget.tsx
import React, { useState } from "react";
import {
   Card,
   CardContent,
   Typography,
   Box,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   TablePagination,
   Chip,
   IconButton,
   TextField,
   InputAdornment
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import { motion } from "framer-motion";

export interface TableColumn {
   key: string;
   label: string;
   align?: "left" | "center" | "right";
   render?: (value: any, row: any) => React.ReactNode;
}

export interface TableWidgetProps {
   title: string;
   subtitle?: string;
   columns: TableColumn[];
   data: any[];
   height?: number;
   searchable?: boolean;
   pagination?: boolean;
   rowsPerPageOptions?: number[];
}

export const TableWidget: React.FC<TableWidgetProps> = ({
   title,
   subtitle,
   columns,
   data,
   height = 400,
   searchable = true,
   pagination = true,
   rowsPerPageOptions = [5, 10, 25]
}) => {
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
   const [searchTerm, setSearchTerm] = useState("");

   const filteredData = data.filter((row) =>
      columns.some((column) => {
         const value = row[column.key];
         return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
   );

   const paginatedData = pagination ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : filteredData;

   const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
         <Card
            sx={{
               height: "100%",
               background: "rgba(255, 255, 255, 0.9)",
               backdropFilter: "blur(10px)"
            }}
         >
            <CardContent sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column" }}>
               {/* Header */}
               <Box sx={{ p: 3, pb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                     <Box>
                        <Typography variant="h6" fontWeight="700" gutterBottom>
                           {title}
                        </Typography>
                        {subtitle && (
                           <Typography variant="body2" color="text.secondary">
                              {subtitle}
                           </Typography>
                        )}
                     </Box>
                     <IconButton size="small">
                        <FilterList />
                     </IconButton>
                  </Box>

                  {searchable && (
                     <TextField
                        fullWidth
                        size="small"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                           startAdornment: (
                              <InputAdornment position="start">
                                 <Search sx={{ color: "text.secondary" }} />
                              </InputAdornment>
                           )
                        }}
                        sx={{ mb: 2 }}
                     />
                  )}
               </Box>

               {/* Table */}
               <Box sx={{ flex: 1, overflow: "auto" }}>
                  <TableContainer sx={{ maxHeight: height }}>
                     <Table stickyHeader>
                        <TableHead>
                           <TableRow>
                              {columns.map((column) => (
                                 <TableCell
                                    key={column.key}
                                    align={column.align}
                                    sx={{
                                       backgroundColor: "background.paper",
                                       fontWeight: "700",
                                       borderBottom: "2px solid",
                                       borderBottomColor: "divider"
                                    }}
                                 >
                                    {column.label}
                                 </TableCell>
                              ))}
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {paginatedData.map((row, index) => (
                              <TableRow
                                 key={index}
                                 sx={{
                                    "&:last-child td, &:last-child th": { border: 0 },
                                    "&:hover": { backgroundColor: "action.hover" }
                                 }}
                              >
                                 {columns.map((column) => (
                                    <TableCell key={column.key} align={column.align}>
                                       {column.render ? column.render(row[column.key], row) : row[column.key]}
                                    </TableCell>
                                 ))}
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </TableContainer>
               </Box>

               {/* Pagination */}
               {pagination && (
                  <TablePagination
                     rowsPerPageOptions={rowsPerPageOptions}
                     component="div"
                     count={filteredData.length}
                     rowsPerPage={rowsPerPage}
                     page={page}
                     onPageChange={handleChangePage}
                     onRowsPerPageChange={handleChangeRowsPerPage}
                     labelRowsPerPage="Filas por página:"
                     labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                  />
               )}
            </CardContent>
         </Card>
      </motion.div>
   );
};
