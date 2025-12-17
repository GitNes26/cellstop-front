// src/pages/DashboardView.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
   Box,
   Container,
   Grid,
   Paper,
   CircularProgress,
   Alert,
   Button,
   Typography,
   Snackbar,
   Chip,
   Stack,
   IconButton,
   Tooltip,
   Drawer,
   Divider,
   useMediaQuery,
   Theme,
   AppBar,
   Toolbar
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
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
import ChartComponent from "../../../../components/charts/ChartComponent";
// import ChartComponent from "../../../../components/dashboard/charts/ChartComponent";
// import PortedNumbersTable from "../../../../components/dashboard/PortedNumbersTable";

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

// Ancho del drawer de filtros
const FILTERS_DRAWER_WIDTH = 320;

const DashboardView: React.FC = () => {
   const { auth } = useAuthContext();
   const { setIsLoading, setOpenDialog } = useGlobalContext();
   const { usersSelect, setUsersSelect, getSelectIndexUsersByRole } = useUserContext();
   const { refetch: refetchSeller } = useFetch(() => getSelectIndexUsersByRole(3), setUsersSelect);

   // Estados
   const [activeSection, setActiveSection] = useState("stats");
   const [mobileOpen, setMobileOpen] = useState(false);
   const [activeFiltersCount, setActiveFiltersCount] = useState(0);
   const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success" as "success" | "error" | "info" | "warning"
   });

   // Responsive
   const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

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

   // Cargar tipos de producto
   useEffect(() => {
      const loadProductTypes = async () => {
         try {
            const typesRes = await axios.get("/api/product-types");
            setProductTypes(Array.isArray(typesRes.data) ? typesRes.data : []);
         } catch (error) {
            console.error("Error loading product types:", error);
         }
      };
      loadProductTypes();
   }, []);

   // Actualizar sellers cuando usersSelect cambie
   useEffect(() => {
      if (usersSelect && usersSelect.length > 0) {
         setSellers(usersSelect);
      }
   }, [usersSelect]);

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
   const handleFilterChange = useCallback(
      (newFilters: Partial<DashboardFilters>) => {
         setFilters((prev) => ({ ...prev, ...newFilters }));

         // Mostrar mensaje si se aplicó un filtro importante
         if (newFilters.activationStatus === "Portado" || newFilters.sellerIds?.length) {
            setSnackbar({
               open: true,
               message: "Filtros aplicados correctamente",
               severity: "success"
            });
         }

         // En móvil, cerrar el drawer después de aplicar filtros
         if (isMobile) {
            setMobileOpen(false);
         }
      },
      [isMobile]
   );

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
   const handleExport = async (type: "excel" | "pdf") => {
      try {
         await exportData(type);
         setSnackbar({
            open: true,
            message: `Exportado como ${type.toUpperCase()}`,
            severity: "success"
         });
      } catch (error) {
         setSnackbar({
            open: true,
            message: "Error al exportar",
            severity: "error"
         });
      }
   };

   // Cerrar snackbar
   const handleCloseSnackbar = () => {
      setSnackbar((prev) => ({ ...prev, open: false }));
   };

   // Toggle drawer móvil
   const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
   };

   useEffect(() => {
      document.title = "Dashboard CellStop";
      setIsLoading(false);
   }, []);

   // Preparar datos para gráficos
   const preparePortabilityChartData = () => {
      if (!data?.portability_by_month) return [];

      return Object.entries(data.portability_by_month).map(([month, count]) => ({
         name: month,
         value: count
      }));
   };

   const prepareTopSellersData = () => {
      if (!data?.top_sellers) return [];

      return data.top_sellers.map((seller) => ({
         name: seller.name,
         value: seller.port_count,
         sellerId: seller.id,
         color: seller.color
      }));
   };

   const prepareStatusDistributionData = () => {
      if (!data?.status_distribution) return [];

      return Object.entries(data.status_distribution).map(([status, count]) => ({
         name: status,
         value: count
      }));
   };

   // Dibujar de filtros
   const filtersDrawer = (
      // <Box sx={{ width: FILTERS_DRAWER_WIDTH, height: "100vh", overflow: "auto" }}>
      <Box sx={{ p: 1 }}>
         <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight="bold">
               🎛️ Filtros
            </Typography>
            {isMobile && (
               <IconButton onClick={handleDrawerToggle}>
                  <CloseIcon />
               </IconButton>
            )}
         </Box>

         <FiltersPanel filters={filters} onFilterChange={handleFilterChange} sellers={sellers} productTypes={productTypes} onClearFilters={handleClearFilters} />

         <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="body2" color="text.secondary">
               <strong>Filtros activos:</strong> {activeFiltersCount}
            </Typography>
            <Button fullWidth variant="contained" onClick={handleRefresh} disabled={loading} sx={{ mt: 2 }} startIcon={<RefreshIcon />}>
               {loading ? "Actualizando..." : "Aplicar Filtros"}
            </Button>
         </Box>
      </Box>
      // </Box>
   );

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

   return (
      <DashboardLayout>
         {/* AppBar para móvil */}
         {isMobile && (
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
               <Toolbar>
                  <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                     <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                     Dashboard CellStop
                  </Typography>
                  {activeFiltersCount > 0 && <Chip label={`${activeFiltersCount}`} color="secondary" size="small" sx={{ color: "white", mr: 1 }} />}
                  <IconButton color="inherit" onClick={handleRefresh}>
                     <RefreshIcon />
                  </IconButton>
               </Toolbar>
            </AppBar>
         )}
         <Grid container spacing={2} maxHeight={"90%"} sx={{ mt: isMobile ? 8 : 0 }}>
            {/* Drawer de filtros */}
            <Grid size={{ xs: 3 /* md: FILTERS_DRAWER_WIDTH */ }}>
               <Paper
                  // variant={isMobile ? "temporary" : "permanent"}
                  // open={isMobile ? mobileOpen : true}
                  // onClose={handleDrawerToggle}
                  // ModalProps={{ keepMounted: true }}
                  sx={{
                     // width: FILTERS_DRAWER_WIDTH,
                     flexShrink: 0
                     // "& .MuiDrawer-paper": {
                     //    width: FILTERS_DRAWER_WIDTH,
                     //    boxSizing: "border-box",
                     //    borderRight: isMobile ? "none" : "1px solid rgba(0, 0, 0, 0.12)",
                     //    backgroundColor: "background.paper"
                     // }
                  }}
               >
                  {filtersDrawer}
               </Paper>
            </Grid>

            {/* Contenido principal */}
            <Grid size={{ xs: 9 /* md: `calc(100% - ${FILTERS_DRAWER_WIDTH}px)` */ }} sx={{ maxHeight: "100%" }}>
               <Box
                  component="main"
                  sx={{
                     flexGrow: 1,
                     p: 2,
                     // width: { md: `calc(100% - ${FILTERS_DRAWER_WIDTH}px)` },
                     ml: 0, //{ md: `${FILTERS_DRAWER_WIDTH}px` },
                     // pt: isMobile ? 8 : 3
                     maxHeight: "50%",
                     overflowY: "auto"
                  }}
               >
                  {/* Snackbar para notificaciones */}
                  <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                     <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                        {snackbar.message}
                     </Alert>
                  </Snackbar>

                  {/* Header del Dashboard */}
                  <Box sx={{ mb: 4 }}>
                     {!isMobile && (
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                           <Box>
                              <Typography variant="h4" fontWeight="bold">
                                 📊 Dashboard CellStop
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                 Monitoreo de portabilidad y ventas en tiempo real
                              </Typography>
                           </Box>

                           <Stack direction="row" spacing={2} alignItems="center">
                              {activeFiltersCount > 0 && (
                                 <Chip label={`${activeFiltersCount} filtro(s) activo(s)`} color="primary" size="small" onDelete={handleClearFilters} />
                              )}

                              <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => handleExport("excel")}>
                                 Exportar
                              </Button>

                              <Button variant="contained" startIcon={<RefreshIcon />} onClick={handleRefresh} disabled={loading}>
                                 {loading ? "Actualizando..." : "Actualizar"}
                              </Button>
                           </Stack>
                        </Box>
                     )}
                  </Box>

                  {/* Estadísticas Principales */}
                  <Box id="stats" ref={statsRef} sx={{ mb: 6 }}>
                     <HeaderStats
                        stats={data?.stats}
                        // loading={loading}
                        onStatClick={(statKey) => {
                           if (statKey === "total_portados") {
                              handleFilterChange({ activationStatus: "Portado" });
                           } else if (statKey === "total_activated") {
                              handleFilterChange({ activationStatus: "Activado" });
                           }
                        }}
                     />
                  </Box>

                  {/* Sección de Gráficos */}
                  <Box id="charts" ref={chartsRef} sx={{ mb: 6 }}>
                     <Typography variant="h5" sx={{ mb: 3, display: "flex", alignItems: "center" }}>
                        📈 Análisis de Portabilidad
                     </Typography>

                     <Grid container spacing={3}>
                        {/* Gráfico de Portabilidad por Mes */}
                        <Grid size={{ xs: 12, md: 6 }}>
                           <ChartComponent
                              title="Portabilidad por Mes"
                              subtitle="Números portados por mes"
                              type="line"
                              data={preparePortabilityChartData()}
                              height={350}
                              loading={loading}
                              colors={["#1976d2"]}
                              smooth={true}
                              xAxis={{
                                 type: "category",
                                 data: Object.keys(data?.portability_by_month || {}),
                                 axisLabel: { rotate: 45 }
                              }}
                              yAxis={{
                                 type: "value",
                                 name: "Cantidad"
                              }}
                              tooltip={{
                                 formatter: "{b}: {c} portaciones"
                              }}
                           />
                        </Grid>

                        {/* Gráfico de Top Vendedores */}
                        <Grid size={{ xs: 12, md: 6 }}>
                           <ChartComponent
                              title="Top 10 Vendedores"
                              subtitle="Por cantidad de portaciones"
                              type="bar"
                              data={prepareTopSellersData()}
                              height={350}
                              loading={loading}
                              xAxis={{
                                 type: "category",
                                 data: prepareTopSellersData().map((item) => item.name),
                                 axisLabel: { rotate: 45 }
                              }}
                              yAxis={{
                                 type: "value",
                                 name: "Portaciones"
                              }}
                              tooltip={{
                                 formatter: "{b}: {c} portaciones"
                              }}
                              onClick={(params: any) => {
                                 if (params.data?.sellerId) {
                                    handleFilterChange({ sellerIds: [params.data.sellerId] });
                                 }
                              }}
                           />
                        </Grid>

                        {/* Gráfico de Distribución por Estatus */}
                        <Grid size={{ xs: 12, md: 4 }}>
                           <ChartComponent
                              title="Distribución por Estatus"
                              type="pie"
                              data={prepareStatusDistributionData()}
                              height={300}
                              loading={loading}
                              pieRadius={["40%", "70%"]}
                              colors={["#9e9e9e", "#ff9800", "#4caf50", "#2196f3", "#f44336"]}
                              tooltip={{
                                 formatter: "{b}: {c} ({d}%)"
                              }}
                              onClick={(params: any) => {
                                 if (params.name) {
                                    handleFilterChange({ activationStatus: params.name });
                                 }
                              }}
                           />
                        </Grid>

                        {/* Gráfico de Productos Más Portados */}
                        <Grid size={{ xs: 12, md: 8 }}>
                           {data?.top_products && data.top_products.length > 0 && (
                              <ChartComponent
                                 title="Productos Más Portados"
                                 type="bar"
                                 data={data.top_products.map((p) => ({ name: p.producto, value: p.count }))}
                                 height={300}
                                 loading={loading}
                                 colors={["#673ab7"]}
                                 xAxis={{
                                    type: "category",
                                    data: data.top_products.map((p) => p.producto),
                                    axisLabel: { rotate: 45 }
                                 }}
                                 yAxis={{
                                    type: "value",
                                    name: "Cantidad"
                                 }}
                                 tooltip={{
                                    formatter: "{b}: {c} portaciones"
                                 }}
                              />
                           )}
                        </Grid>
                     </Grid>
                  </Box>

                  {/* Mapa de Puntos de Venta */}
                  {data?.points_of_sale && data.points_of_sale.length > 0 && (
                     <Box id="map" ref={mapRef} sx={{ mb: 6 }}>
                        <Typography variant="h5" sx={{ mb: 3 }}>
                           🗺️ Distribución Geográfica ({data.points_of_sale.length} puntos)
                        </Typography>

                        <PointsOfSaleMap
                           points={data.points_of_sale}
                           //   loading={loading}
                           onPointClick={(point) => {
                              console.log("Punto clickeado:", point);
                              setSnackbar({
                                 open: true,
                                 message: `${point.name}: ${point.inventory_count || 0} chips`,
                                 // message: `${point.name}: ${point?.inventory?.total_products || 0} chips`,
                                 severity: "info"
                              });
                           }}
                        />
                     </Box>
                  )}

                  {/* Tabla de Números Portados */}
                  {data?.ported_numbers && data.ported_numbers.length > 0 && (
                     <Box id="table" ref={tableRef} sx={{ mb: 6 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                           <Typography variant="h5">📋 Números Portados ({data.ported_numbers.length})</Typography>
                           <Button size="small" onClick={() => handleExport("excel")} startIcon={<DownloadIcon />}>
                              Exportar lista
                           </Button>
                        </Box>

                        {/* <PortedNumbersTable
              data={data.ported_numbers}
              loading={loading}
              onRowClick={(row) => {
                console.log('Fila clickeada:', row);
                setSnackbar({
                  open: true,
                  message: `Ver detalles de ${row.celular}`,
                  severity: 'info'
                });
              }}
            /> */}
                     </Box>
                  )}

                  {/* Información de Rendimiento de Vendedores */}
                  {data?.sellers_performance && data.sellers_performance.length > 0 && (
                     <Box sx={{ mb: 6 }}>
                        <Typography variant="h5" sx={{ mb: 3 }}>
                           👥 Rendimiento de Vendedores
                        </Typography>

                        <Grid container spacing={3}>
                           {data.sellers_performance.slice(0, 3).map((seller, index) => (
                              <Grid size={{ xs: 12, md: 4 }} key={seller.seller_id}>
                                 <Paper sx={{ p: 3, borderRadius: 2 }}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                       <Box
                                          sx={{
                                             width: 40,
                                             height: 40,
                                             borderRadius: "50%",
                                             backgroundColor: seller.seller_info?.color || "#ccc",
                                             display: "flex",
                                             alignItems: "center",
                                             justifyContent: "center",
                                             mr: 2,
                                             color: "white",
                                             fontWeight: "bold"
                                          }}
                                       >
                                          {seller.seller_info?.name?.charAt(0) || "V"}
                                       </Box>
                                       <Box>
                                          <Typography variant="h6">{seller.seller_info?.name}</Typography>
                                          <Typography variant="body2" color="text.secondary">
                                             Portabilidad: {seller.products_stats?.portability_rate || 0}%
                                          </Typography>
                                       </Box>
                                    </Box>

                                    <Grid container spacing={1}>
                                       <Grid size={{ xs: 6 }}>
                                          <Typography variant="body2" color="text.secondary">
                                             Asignados:
                                          </Typography>
                                          <Typography variant="h6">{seller.products_stats?.total_assigned || 0}</Typography>
                                       </Grid>
                                       <Grid size={{ xs: 6 }}>
                                          <Typography variant="body2" color="text.secondary">
                                             Portados:
                                          </Typography>
                                          <Typography variant="h6" color="primary">
                                             {seller.products_stats?.total_ported || 0}
                                          </Typography>
                                       </Grid>
                                       <Grid size={{ xs: 6 }}>
                                          <Typography variant="body2" color="text.secondary">
                                             Puntos:
                                          </Typography>
                                          <Typography variant="h6">{seller.points_of_sale?.total || 0}</Typography>
                                       </Grid>
                                       <Grid size={{ xs: 6 }}>
                                          <Typography variant="body2" color="text.secondary">
                                             Visitas:
                                          </Typography>
                                          <Typography variant="h6">{seller.visits?.total || 0}</Typography>
                                       </Grid>
                                    </Grid>
                                 </Paper>
                              </Grid>
                           ))}
                        </Grid>
                     </Box>
                  )}

                  {/* Resumen de Visitas */}
                  {data?.visits_summary && Object.keys(data.visits_summary).length > 0 && (
                     <Box sx={{ mb: 6 }}>
                        <Typography variant="h5" sx={{ mb: 3 }}>
                           📋 Resumen de Visitas
                        </Typography>

                        <Grid container spacing={3}>
                           {Object.entries(data.visits_summary).map(([type, stats]) => (
                              <Grid size={{ xs: 12, md: 6 }} key={type}>
                                 <Paper sx={{ p: 3, borderRadius: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                       {type === "Distribución" ? "🚚 Distribución" : "👀 Monitoreo"}
                                    </Typography>

                                    <Grid container spacing={2}>
                                       <Grid size={{ xs: 4 }}>
                                          <Typography variant="body2" color="text.secondary">
                                             Visitas
                                          </Typography>
                                          <Typography variant="h5">{stats.total_visits || 0}</Typography>
                                       </Grid>
                                       <Grid size={{ xs: 4 }}>
                                          <Typography variant="body2" color="text.secondary">
                                             Entregados
                                          </Typography>
                                          <Typography variant="h5">{stats.total_delivered || 0}</Typography>
                                       </Grid>
                                       <Grid size={{ xs: 4 }}>
                                          <Typography variant="body2" color="text.secondary">
                                             Vendidos
                                          </Typography>
                                          <Typography variant="h5" color="success.main">
                                             {stats.total_sold || 0}
                                          </Typography>
                                       </Grid>
                                       <Grid size={{ xs: 12 }}>
                                          <Typography variant="body2" color="text.secondary">
                                             Tasa de Conversión
                                          </Typography>
                                          <Typography variant="h6" color="primary">
                                             {stats.conversion_rate || 0}%
                                          </Typography>
                                       </Grid>
                                    </Grid>
                                 </Paper>
                              </Grid>
                           ))}
                        </Grid>
                     </Box>
                  )}

                  {/* Pie de página */}
                  <Box sx={{ mt: 6, pt: 3, borderTop: 1, borderColor: "divider" }}>
                     <Typography variant="body2" color="text.secondary" align="center">
                        Última actualización: {new Date().toLocaleString()} | Total productos en sistema: {data?.stats?.total_products || 0} | Vendedores activos:{" "}
                        {data?.stats?.active_sellers || 0} | Datos sujetos a actualización en tiempo real
                     </Typography>
                  </Box>
               </Box>
            </Grid>
         </Grid>
      </DashboardLayout>
   );
};

export default DashboardView;
