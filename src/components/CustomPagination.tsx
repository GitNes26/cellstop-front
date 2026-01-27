// CustomPagination.tsx
import { Pagination, Stack, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const CustomPagination = ({ currentPage, totalPages, totalItems, pageSize, onPageChange, onPageSizeChange }) => {
   return (
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ p: 2 }}>
         <Typography variant="body2">
            Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} de {totalItems} registros
         </Typography>

         <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
               <InputLabel>Por página</InputLabel>
               <Select value={pageSize} label="Por página" onChange={(e) => onPageSizeChange(Number(e.target.value))}>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
               </Select>
            </FormControl>

            <Pagination count={totalPages} page={currentPage} onChange={(_, page) => onPageChange(page)} color="primary" showFirstButton showLastButton />
         </Stack>
      </Stack>
   );
};
