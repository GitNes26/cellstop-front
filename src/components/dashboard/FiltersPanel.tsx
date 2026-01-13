import React from "react";
import {
   Box,
   Paper,
   TextField,
   MenuItem,
   FormControl,
   InputLabel,
   Select,
   Chip,
   OutlinedInput,
   Button,
   IconButton,
   Stack,
   Typography,
   Divider,
   Autocomplete,
   Grid,
   CircularProgress
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { es } from "date-fns/locale";
import { ImportName, ProductType, Seller } from "../../views/app/main/dashboard/Index";
import useDebounce from "../../hooks/useDebounce";

interface FiltersPanelProps {
   filters: {
      startDate: Date | null;
      endDate: Date | null;
      folio: string | null; // NUEVO
      startDatePreActivation: Date | null; // NUEVO
      endDatePreActivation: Date | null; // NUEVO
      sellerIds: number[];
      importName?: ImportName[]; // NUEVO
      locationStatus: string | null;
      activationStatus: string | null;
      productTypeId: number | null;
      searchText: string;
      startDateInSystem: Date | null; // NUEVO
      endDateInSystem: Date | null; // NUEVO
   };
   onFilterChange: (newFilters: any) => void;
   sellers?: Seller[]; // Hacer opcional
   productTypes?: ProductType[]; // Hacer opcional
   onClearFilters: () => void;
   loading?: boolean; // Nuevo prop para loading
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
   filters,
   onFilterChange,
   sellers = [], // Valor por defecto
   productTypes = [], // Valor por defecto
   onClearFilters,
   loading = false
}) => {
   // Asegurar que siempre sean arrays
   const safeSellers = Array.isArray(sellers) ? sellers : [];
   const safeProductTypes = Array.isArray(productTypes) ? productTypes : [];

   // Hook para debounce
   const debouncedFilterChange = useDebounce(onFilterChange, 1000);

   // Opciones para los selects
   const locationStatusOptions = [
      { value: null, label: "Todos" },
      { value: "Stock", label: "En Stock" },
      { value: "Asignado", label: "Asignado" },
      { value: "Distribuido", label: "Distribuido" }
   ];

   const activationStatusOptions = [
      { value: null, label: "Todos" },
      // { value: "Virgen", label: "Virgen" },
      { value: "Pre-activado", label: "Pre-activado" },
      { value: "Activado", label: "Activado" },
      { value: "Portado", label: "Portado" }
      // { value: "Caducado", label: "Caducado" }
   ];

   const handleSellerChange = (event: any, newValue: Seller[]) => {
      const sellerIds = newValue.map((seller) => seller.id);
      onFilterChange({ sellerIds });
   };

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      debouncedFilterChange({ searchText: event.target.value });
   };

   const handleFolioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      debouncedFilterChange({ folio: event.target.value });
   };

   const handleSearchSubmit = () => {
      console.log("Buscando:", filters.searchText);
   };

   // Obtener vendedores seleccionados
   const getSelectedSellers = () => {
      return safeSellers.filter((seller) => filters.sellerIds.includes(seller.id));
   };

   return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
         <Box display="flex" alignItems="center" mb={1}>
            {/* <SearchIcon sx={{ mr: 1, color: "primary.main" }} /> */}
            {/* <Typography variant="h6" fontWeight="bold">
                  Filtros Avanzados
               </Typography> */}
            <Typography variant="h6" fontWeight="bold">
               🎛️ Filtros
            </Typography>
            <Button size="small" onClick={onClearFilters} sx={{ ml: "auto" }} startIcon={<ClearIcon />} variant="outlined" color="secondary">
               Limpiar Todo
            </Button>
         </Box>

         <Divider sx={{ mb: 1 }} />
         <Box sx={{ height: "58vh", overflowY: "auto" }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
               <Grid size={{ xs: 12, md: 12 }}>
                  <Divider sx={{ mb: 1 }}>
                     <Typography variant="subtitle2">Fecha de Ejecución</Typography>
                  </Divider>
                  <DatePicker
                     label="Fecha inicio"
                     value={filters.startDate}
                     onChange={(date) => onFilterChange({ startDate: date })}
                     slotProps={{
                        textField: {
                           fullWidth: true,
                           size: "small",
                           variant: "outlined"
                        }
                     }}
                     format="dd/MM/yyyy"
                  />
               </Grid>

               <Grid size={{ xs: 12, md: 12 }}>
                  <DatePicker
                     label="Fecha fin"
                     value={filters.endDate}
                     onChange={(date) => onFilterChange({ endDate: date })}
                     slotProps={{
                        textField: {
                           fullWidth: true,
                           size: "small",
                           variant: "outlined"
                        }
                     }}
                     format="dd/MM/yyyy"
                  />
               </Grid>

               <Grid size={{ xs: 12, md: 12 }}>
                  <Divider sx={{ mb: 1 }}>
                     <Typography variant="subtitle2">Busqueda Especifica</Typography>
                  </Divider>
                  <TextField
                     fullWidth
                     size="small"
                     type="search"
                     variant="outlined"
                     label="Número, ICCID o IMEI"
                     value={filters.searchText}
                     onChange={handleSearchChange}
                     sx={{ mb: 1 }}
                     slotProps={{
                        input: {
                           endAdornment: (
                              <IconButton>
                                 <SearchIcon />
                              </IconButton>
                           )
                        }
                     }}
                     placeholder="Ej: 5512345678 o 8914800000000000000"
                  />
                  <TextField
                     fullWidth
                     size="small"
                     type="search"
                     variant="outlined"
                     label="Folio"
                     value={filters.folio}
                     onChange={handleFolioChange}
                     slotProps={{
                        input: {
                           endAdornment: (
                              <IconButton>
                                 <SearchIcon />
                              </IconButton>
                           )
                        }
                     }}
                     placeholder="Ej: 20261026"
                  />
               </Grid>

               <Grid size={{ xs: 12, md: 12 }}>
                  <Divider sx={{ mb: 1 }}>
                     <Typography variant="subtitle2">Fecha de Pre-Activación</Typography>
                  </Divider>
                  <DatePicker
                     label="Fecha inicio"
                     value={filters.startDatePreActivation}
                     onChange={(date) => onFilterChange({ startDatePreActivation: date })}
                     slotProps={{
                        textField: {
                           fullWidth: true,
                           size: "small",
                           variant: "outlined"
                        }
                     }}
                     format="dd/MM/yyyy"
                  />
               </Grid>

               <Grid size={{ xs: 12, md: 12 }}>
                  <DatePicker
                     label="Fecha fin"
                     value={filters.endDatePreActivation}
                     onChange={(date) => onFilterChange({ endDatePreActivation: date })}
                     slotProps={{
                        textField: {
                           fullWidth: true,
                           size: "small",
                           variant: "outlined"
                        }
                     }}
                     format="dd/MM/yyyy"
                  />
               </Grid>
            </Grid>

            <Grid container spacing={2} mb={3}>
               <Grid size={{ xs: 12, md: 12 }}>
                  <Divider sx={{ mb: 1 }}>
                     <Typography variant="subtitle2">Selectores</Typography>
                  </Divider>
                  <FormControl fullWidth size="small" variant="outlined">
                     <InputLabel>Vendedores</InputLabel>
                     {loading ? (
                        <Box display="flex" alignItems="center" p={2}>
                           <CircularProgress size={20} sx={{ mr: 1 }} />
                           <Typography variant="body2">Cargando vendedores...</Typography>
                        </Box>
                     ) : (
                        <Autocomplete
                           multiple
                           options={safeSellers}
                           getOptionLabel={(option) => option.label || ""}
                           value={getSelectedSellers()}
                           onChange={handleSellerChange}
                           loading={loading}
                           renderInput={(params) => <TextField {...params} label="Vendedores" variant="outlined" size="small" />}
                           renderOption={(props, option) => (
                              <li {...props}>
                                 <Box display="flex" alignItems="center">
                                    <Box
                                       sx={{
                                          width: 12,
                                          height: 12,
                                          borderRadius: "50%",
                                          backgroundColor: option.color || "#ccc",
                                          mr: 1
                                       }}
                                    />
                                    {option.label}
                                 </Box>
                              </li>
                           )}
                           renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                 <Chip
                                    {...getTagProps({ index })}
                                    key={option.id}
                                    label={option.label}
                                    size="small"
                                    sx={{
                                       backgroundColor: `${option.color || "#ccc"}20`,
                                       border: `1px solid ${option.color || "#ccc"}`,
                                       mr: 0.5,
                                       mb: 0.5
                                    }}
                                 />
                              ))
                           }
                        />
                     )}
                  </FormControl>
               </Grid>

               <Grid size={{ xs: 12, md: 12 }}>
                  <FormControl fullWidth size="small" variant="outlined">
                     <InputLabel>Locación</InputLabel>
                     <Select value={filters.locationStatus || ""} onChange={(e) => onFilterChange({ locationStatus: e.target.value || null })} label="Locación">
                        {locationStatusOptions.map((option) => (
                           <MenuItem key={option.value || "all"} value={option.value || ""}>
                              {option.label}
                           </MenuItem>
                        ))}
                     </Select>
                  </FormControl>
               </Grid>

               <Grid size={{ xs: 12, md: 12 }}>
                  <FormControl fullWidth size="small" variant="outlined">
                     <InputLabel>Estatus Activación</InputLabel>
                     <Select
                        value={filters.activationStatus || ""}
                        onChange={(e) => onFilterChange({ activationStatus: e.target.value || null })}
                        label="Estatus Activación"
                     >
                        {activationStatusOptions.map((option) => (
                           <MenuItem key={option.value || "all"} value={option.value || ""}>
                              {option.label}
                           </MenuItem>
                        ))}
                     </Select>
                  </FormControl>
               </Grid>

               <Grid size={{ xs: 12, md: 12 }}>
                  <FormControl fullWidth size="small" variant="outlined">
                     <InputLabel>Tipo Producto</InputLabel>
                     <Select value={filters.productTypeId || ""} onChange={(e) => onFilterChange({ productTypeId: e.target.value || null })} label="Tipo Producto">
                        <MenuItem value="">Todos</MenuItem>
                        {safeProductTypes.map((type) => (
                           <MenuItem key={type.id} value={type.id}>
                              {type.label}
                           </MenuItem>
                        ))}
                     </Select>
                  </FormControl>
               </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
               <Divider sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">Fecha en Sistema</Typography>
               </Divider>
               <DatePicker
                  label="Fecha inicio"
                  value={filters.startDateInSystem}
                  onChange={(date) => onFilterChange({ startDateInSystem: date })}
                  slotProps={{
                     textField: {
                        fullWidth: true,
                        size: "small",
                        variant: "outlined"
                     }
                  }}
                  format="dd/MM/yyyy"
                  sx={{ mb: 2 }}
               />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
               <DatePicker
                  label="Fecha fin"
                  value={filters.endDateInSystem}
                  onChange={(date) => onFilterChange({ endDateInSystem: date })}
                  slotProps={{
                     textField: {
                        fullWidth: true,
                        size: "small",
                        variant: "outlined"
                     }
                  }}
                  format="dd/MM/yyyy"
               />
            </Grid>

            {/* <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
               <Typography variant="body2" color="text.secondary" gutterBottom>
                  Filtros rápidos:
               </Typography>
               <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                     label="Portados"
                     size="small"
                     color={filters.activationStatus === "Portado" ? "primary" : "default"}
                     onClick={() =>
                        onFilterChange({
                           activationStatus: filters.activationStatus === "Portado" ? null : "Portado"
                        })
                     }
                     variant={filters.activationStatus === "Portado" ? "filled" : "outlined"}
                  />
                  <Chip
                     label="Activados"
                     size="small"
                     color={filters.activationStatus === "Activado" ? "success" : "default"}
                     onClick={() =>
                        onFilterChange({
                           activationStatus: filters.activationStatus === "Activado" ? null : "Activado"
                        })
                     }
                     variant={filters.activationStatus === "Activado" ? "filled" : "outlined"}
                  />
                  <Chip
                     label="Distribuidos"
                     size="small"
                     color={filters.locationStatus === "Distribuido" ? "secondary" : "default"}
                     onClick={() =>
                        onFilterChange({
                           locationStatus: filters.locationStatus === "Distribuido" ? null : "Distribuido"
                        })
                     }
                     variant={filters.locationStatus === "Distribuido" ? "filled" : "outlined"}
                  />
                  <Chip
                     label="Últimos 7 días"
                     size="small"
                     onClick={() => {
                        const endDate = new Date();
                        const startDate = new Date();
                        startDate.setDate(endDate.getDate() - 7);
                        onFilterChange({ startDate, endDate });
                     }}
                     variant="outlined"
                  />
                  <Chip
                     label="Este mes"
                     size="small"
                     onClick={() => {
                        const endDate = new Date();
                        const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
                        onFilterChange({ startDate, endDate });
                     }}
                     variant="outlined"
                  />
               </Stack>
            </Box> */}
         </Box>
      </LocalizationProvider>
   );
};

export default FiltersPanel;
