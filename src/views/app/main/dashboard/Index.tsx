// src/pages/DashboardView.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, Container, Grid, Paper, CircularProgress, Alert, Button, Typography, Snackbar, Chip, Stack, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import axios from "axios";
import { DashboardLayout } from "../../../../components/dashboard/layouts/DashboardLayout";
import { NavigationSidebar } from "../../../../components/dashboard/sections/NavigationSidebar";
import FiltersPanel from "../../../../components/dashboard/FiltersPanel";
import { HeaderStats } from "../../../../components/dashboard/sections/HeaderStats";
import PointsOfSaleMap from "../../../../components/dashboard/PointsOfSaleMap";
import { useDashboardData } from "../../../../hooks/useDashboardData";
import { useAuthContext } from "../../../../context/AuthContext";
import { useGlobalContext } from "../../../../context/GlobalContext";
import PortabilityChart from "../../../../components/dashboard/PortabilityChart";
import TopSellersChart from "../../../../components/dashboard/TopSellersChart";
import StatusDistributionChart from "../../../../components/dashboard/StatusDistributionChart";
import { useUserContext } from "../../../../context/UserContext";
import useFetch from "../../../../hooks/useFetch";

// Interfaces para los tipos
interface DashboardFilters {
   startDate: Date | null;
   endDate: Date | null;
   sellerIds: number[];
   locationStatus: string | null;
   activationStatus: string | null;
   productTypeId: number | null;
   searchText: string;
}

export interface Seller {
   id: number;
   label: string;
   color?: string;
}

export interface ProductType {
   id: number;
   label: string;
}

const DashboardView: React.FC = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();

   const { usersSelect, setUsersSelect, getSelectIndexUsersByRole } = useUserContext();

   const { refetch: refetchSeller } = useFetch(() => getSelectIndexUsersByRole(3), setUsersSelect);

   const [activeSection, setActiveSection] = useState("stats");
   const [showFilters, setShowFilters] = useState(true);
   const [activeFiltersCount, setActiveFiltersCount] = useState(0);
   const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success" as "success" | "error" | "info" | "warning"
   });

   // Estado para datos de filtros
   const [sellers, setSellers] = useState<Seller[]>(usersSelect || []);
   const [productTypes, setProductTypes] = useState<ProductType[]>([]);

   // Filtros iniciales
   const [filters, setFilters] = useState<DashboardFilters>({
      startDate: null,
      endDate: new Date(),
      sellerIds: [],
      locationStatus: null,
      activationStatus: null,
      productTypeId: null,
      searchText: ""
   });

   // Referencias para scroll
   const statsRef = useRef<HTMLDivElement>(null);
   const chartsRef = useRef<HTMLDivElement>(null);
   const mapRef = useRef<HTMLDivElement>(null);
   const tableRef = useRef<HTMLDivElement>(null);

   // Hook para datos del dashboard
   const { data, loading, error, refresh, exportData } = useDashboardData(filters);

   // Cargar datos para filtros
   useEffect(() => {
      const loadFilterData = async () => {
         try {
            // const [sellersRes, typesRes] = await Promise.all([axios.get("/api/employees/sellers"), axios.get("/api/product-types")]);
            // setSellers(sellersRes.data);
            // setProductTypes(typesRes.data);
         } catch (error) {
            console.error("Error loading filter data:", error);
            setSnackbar({
               open: true,
               message: "Error al cargar datos de filtros",
               severity: "error"
            });
         }
      };

      loadFilterData();
   }, []);

   // Calcular cantidad de filtros activos
   useEffect(() => {
      let count = 0;
      if (filters.startDate) count++;
      if (filters.endDate && filters.endDate !== new Date()) count++;
      if (filters.sellerIds.length > 0) count++;
      if (filters.locationStatus) count++;
      if (filters.activationStatus) count++;
      if (filters.productTypeId) count++;
      if (filters.searchText) count++;

      setActiveFiltersCount(count);
   }, [filters]);

   // Manejo de cambio de sección
   const handleSectionChange = (section: string) => {
      setActiveSection(section);
      const refs: Record<string, React.RefObject<HTMLDivElement>> = {
         stats: statsRef,
         charts: chartsRef,
         map: mapRef,
         table: tableRef
      };
      refs[section]?.current?.scrollIntoView({ behavior: "smooth" });
   };

   // Manejo de cambio de filtros
   const handleFilterChange = useCallback((newFilters: Partial<DashboardFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));

      // Mostrar mensaje si se aplicó un filtro importante
      if (newFilters.activationStatus === "Portado" || newFilters.sellerIds?.length) {
         setSnackbar({
            open: true,
            message: "Filtros aplicados correctamente",
            severity: "success"
         });
      }
   }, []);

   // Limpiar todos los filtros
   const handleClearFilters = () => {
      setFilters({
         startDate: null,
         endDate: new Date(),
         sellerIds: [],
         locationStatus: null,
         activationStatus: null,
         productTypeId: null,
         searchText: ""
      });
      setSnackbar({
         open: true,
         message: "Filtros limpiados",
         severity: "info"
      });
   };

   // Refrescar datos
   const handleRefresh = () => {
      refresh();
      setSnackbar({
         open: true,
         message: "Datos actualizados",
         severity: "info"
      });
   };

   // Exportar datos
   // const handleExport = async (type: "excel" | "pdf") => {
   //    try {
   //       await exportData(type);
   //       setSnackbar({
   //          open: true,
   //          message: `Exportado como ${type.toUpperCase()}`,
   //          severity: "success"
   //       });
   //    } catch (error) {
   //       setSnackbar({
   //          open: true,
   //          message: "Error al exportar",
   //          severity: "error"
   //       });
   //    }
   // };

   // Cerrar snackbar
   const handleCloseSnackbar = () => {
      setSnackbar((prev) => ({ ...prev, open: false }));
   };

   if (loading && !data) {
      return (
         <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
               Cargando dashboard...
            </Typography>
         </Box>
      );
   }

   if (error) {
      return (
         <Container>
            <Alert severity="error" sx={{ mt: 4 }}>
               Error al cargar los datos: {error.message}
               <Button sx={{ ml: 2 }} onClick={refresh}>
                  Reintentar
               </Button>
            </Alert>
         </Container>
      );
   }

   useEffect(() => {
      document.title = "Dashboard CellStop";
      setIsLoading(false);
   }, []);

   return (
      <DashboardLayout>
         {/* <DashboardLayout navigation={<NavigationSidebar onSectionChange={handleSectionChange} activeSection={activeSection} />}> */}
         {/* Snackbar para notificaciones */}
         <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
               {snackbar.message}
            </Alert>
         </Snackbar>

         {/* Header del Dashboard */}
         <Box sx={{ mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
               <Stack direction="row" spacing={2}>
                  {/* Contador de filtros activos */}
                  {activeFiltersCount > 0 && <Chip label={`${activeFiltersCount} filtro(s) activo(s)`} color="primary" size="small" onDelete={handleClearFilters} />}

                  <Tooltip title="Mostrar/Ocultar filtros">
                     <IconButton onClick={() => setShowFilters(!showFilters)} color={showFilters ? "primary" : "default"}>
                        <FilterListIcon />
                     </IconButton>
                  </Tooltip>

                  <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => console.log("handleExport excel")}>
                     Exportar
                  </Button>

                  <Button variant="contained" startIcon={<RefreshIcon />} onClick={handleRefresh} disabled={loading}>
                     {loading ? "Actualizando..." : "Actualizar"}
                  </Button>
               </Stack>
            </Box>

            {/* Panel de Filtros */}
            {showFilters && (
               <FiltersPanel filters={filters} onFilterChange={handleFilterChange} sellers={sellers} productTypes={productTypes} onClearFilters={handleClearFilters} />
            )}
         </Box>

         {/* Estadísticas Principales */}
         <Box id="stats" ref={statsRef} sx={{ mb: 6 }}>
            <HeaderStats
               stats={data?.stats}
               loading={loading}
               onStatClick={(statKey) => {
                  // Navegación automática basada en stat clickeado
                  if (statKey === "total_portados") {
                     handleFilterChange({ activationStatus: "Portado" });
                     handleSectionChange("table");
                  } else if (statKey === "total_activated") {
                     handleFilterChange({ activationStatus: "Activado" });
                  } else if (statKey === "portability_rate") {
                     handleSectionChange("charts");
                  }
               }}
            />
         </Box>

         {/* Sección de Gráficos */}
         <Box id="charts" ref={chartsRef} sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 3, display: "flex", alignItems: "center" }}>
               📊 Análisis de Portabilidad (EN ACTUALIZACION)
               {filters.activationStatus === "Portado" && (
                  <Chip label="Filtrado: Portados" size="small" color="primary" sx={{ ml: 2 }} onDelete={() => handleFilterChange({ activationStatus: null })} />
               )}
            </Typography>

            <Grid container spacing={3}>
               {/* <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                     elevation={2}
                     sx={{
                        p: 3,
                        height: "400px",
                        borderRadius: 2,
                        "&:hover": { boxShadow: 4 }
                     }}
                  >
                     <PortabilityChart data={data?.portability_by_month} loading={loading} />
                  </Paper>
               </Grid> */}

               {/* <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                     elevation={2}
                     sx={{
                        p: 3,
                        height: "400px",
                        borderRadius: 2,
                        "&:hover": { boxShadow: 4 }
                     }}
                  >
                     <TopSellersChart
                        data={data?.top_sellers}
                        loading={loading}
                        onSellerClick={(sellerId) => {
                           handleFilterChange({ sellerIds: [sellerId] });
                        }}
                     />
                  </Paper>
               </Grid> */}

               {/* <Grid size={{ xs: 12, md: 4 }}>
                  <Paper
                     elevation={2}
                     sx={{
                        p: 3,
                        height: "350px",
                        borderRadius: 2,
                        "&:hover": { boxShadow: 4 }
                     }}
                  >
                     <StatusDistributionChart
                        data={data?.status_distribution}
                        loading={loading}
                        onStatusClick={(status) => {
                           handleFilterChange({ activationStatus: status });
                        }}
                     />
                  </Paper>
               </Grid> */}

               {/* <Grid size={{ xs: 12, md: 8 }}>
                  <Paper
                     elevation={2}
                     sx={{
                        p: 3,
                        height: "350px",
                        borderRadius: 2,
                        "&:hover": { boxShadow: 4 }
                     }}
                  >
                     <ProductsPortabilityChart
                        data={data?.top_products}
                        loading={loading}
                        onProductClick={(productName) => {
                           // Aquí podrías filtrar por producto si tuvieras el ID
                           setSnackbar({
                              open: true,
                              message: `Producto: ${productName}`,
                              severity: "info"
                           });
                        }}
                     />
                  </Paper>
               </Grid> */}
            </Grid>
         </Box>

         {/* Mapa de Puntos de Venta */}
         <Box id="map" ref={mapRef} sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
               🗺️ Distribución Geográfica
               {filters.locationStatus && (
                  <Chip
                     label={`Locación: ${filters.locationStatus}`}
                     size="small"
                     color="secondary"
                     sx={{ ml: 2 }}
                     onDelete={() => handleFilterChange({ locationStatus: null })}
                  />
               )}
            </Typography>

            <Paper
               elevation={2}
               sx={{
                  p: 3,
                  borderRadius: 2,
                  "&:hover": { boxShadow: 4 }
               }}
            >
               <PointsOfSaleMap
                  points={data?.points_of_sale || []}
                  // loading={loading}
                  onPointClick={(point) => {
                     console.log("Punto clickeado:", point);
                     // Aquí puedes abrir un modal con detalles
                     setSnackbar({
                        open: true,
                        message: `${point.name}: ${point.inventory_count} chips`,
                        severity: "info"
                     });
                  }}
               />
            </Paper>
         </Box>

         {/* Tabla de Números Portados */}
         <Box id="table" ref={tableRef} sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
               📋 Números Portados ({data?.ported_numbers?.length || 0})
               <Button
                  size="small"
                  sx={{ ml: 2 }}
                  onClick={() => {
                     // Exportar solo esta tabla
                     console.log("handleExport excel");
                  }}
               >
                  Exportar lista
               </Button>
            </Typography>

            <Paper
               elevation={2}
               sx={{
                  p: 3,
                  borderRadius: 2,
                  "&:hover": { boxShadow: 4 }
               }}
            >
               {/* <PortedNumbersTable
                  data={data?.ported_numbers || []}
                  loading={loading}
                  sellers={sellers}
                  onRowClick={(row) => {
                     console.log("Fila clickeada:", row);
                     // Navegar a detalles del producto
                     setSnackbar({
                        open: true,
                        message: `Ver detalles de ${row.celular}`,
                        severity: "info"
                     });
                  }}
                  onAssignSeller={(row, sellerId) => {
                     // Lógica para asignar vendedor
                     console.log("Asignar vendedor", row.id, sellerId);
                  }}
               /> */}
            </Paper>
         </Box>

         {/* Pie de página con resumen */}
         <Box sx={{ mt: 6, pt: 3, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="body2" color="text.secondary" align="center">
               Última actualización: {new Date().toLocaleString()} | Total productos en sistema: {data?.stats?.stats.total_products || 0} | Datos sujetos a
               actualización en tiempo real
            </Typography>
         </Box>
      </DashboardLayout>
   );
};

export default DashboardView;
