import React, { useMemo } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Chip, Avatar, Grid, Divider } from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, TimelineOppositeContent } from "@mui/lab";
import { Person, Timeline as TimelineIcon, ArrowRightAlt, CheckCircle, Error, Warning, Info, History, AssignmentIndRounded } from "@mui/icons-material";
import { DialogComponent } from "../../../../components";
import { formatDatetime } from "../../../../utils/Formats";

// Interfaz para los datos de movimiento
interface ProductMovement {
   id: number;
   product_id: number;
   action: string;
   description: string;
   origin: string;
   destination: string;
   executed_at: string;
   executed_by: number;
   active: boolean;
   created_at: string;
   updated_at: string;
   deleted_at: string | null;
   executer: {
      id: number;
      username: string;
      email: string;
      email_verified_at: string | null;
      role_id: number;
      employee_id: number | null;
      active: number;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
   };
}

// Configuración de columnas
interface ColumnConfig {
   key: keyof ProductMovement;
   label: string;
   width?: string | number;
   align?: "left" | "center" | "right" | "inherit" | "justify";
   format?: (value: any, row?: ProductMovement) => string | React.ReactNode;
   colorCondition?: (value: any, row?: ProductMovement) => string;
   visibleByDefault?: boolean;
   tooltip?: string;
}

// Props del componente
interface TableMovementsProps {
   movements: ProductMovement[];
   productInfo?: {
      iccid?: string;
      imei?: string;
      phone?: string;
   };
   compactMode?: boolean;
   maxHeight?: number | null;
   viewMode?: "table" | "timeline" | "both";
}

const getBageColor = (action: string): string => {
   const actionLower = action.toLowerCase();
   if (actionLower.includes("portado")) return "error";
   if (actionLower.includes("activ")) return "success";
   if (actionLower.includes("alert")) return "warning";
   if (actionLower.includes("asig")) return "info";
   if (actionLower.includes("import")) return "primary";
   if (actionLower.includes("error") || actionLower.includes("fallo")) return "error";
   if (actionLower.includes("cancel")) return "info";
   return "grey.600";
};

// Componente para el timeline
const MovementTimeline: React.FC<{ movements: ProductMovement[] }> = ({ movements }) => {
   const getActionColor = (action: string): string => {
      const actionLower = action.toLowerCase();
      if (actionLower.includes("portado")) return "error.main";
      if (actionLower.includes("activ")) return "success.main";
      if (actionLower.includes("alert")) return "warning.main";
      if (actionLower.includes("asig")) return "info.main";
      if (actionLower.includes("import")) return "primary.main";
      if (actionLower.includes("error") || actionLower.includes("fallo")) return "error.main";
      if (actionLower.includes("cancel")) return "info.main";
      return "grey.600";
   };

   const getActionIcon = (action: string): React.ReactNode => {
      const actionLower = action.toLowerCase();
      if (actionLower.includes("portado")) return <ArrowRightAlt fontSize="small" />;
      if (actionLower.includes("activ")) return <CheckCircle fontSize="small" />;
      if (actionLower.includes("alert")) return <Warning fontSize="small" />;
      if (actionLower.includes("asig")) return <AssignmentIndRounded fontSize="small" />;
      if (actionLower.includes("import")) return <History fontSize="small" />;
      if (actionLower.includes("error")) return <Error fontSize="small" />;
      if (actionLower.includes("cancel")) return <Warning fontSize="small" />;
      return <Info fontSize="small" />;
   };

   return (
      <Box sx={{ py: 2 }}>
         <Timeline position="alternate">
            {movements.map((movement, index) => (
               <TimelineItem key={movement.id}>
                  <TimelineOppositeContent sx={{ m: "auto 0" }} align="right" variant="body2" color="text.secondary">
                     {formatDatetime(movement.executed_at, null, "DD/MM/YYYY HH:mm")}
                     <Typography variant="caption" display="block">
                        por: {movement.executer.username}
                     </Typography>
                  </TimelineOppositeContent>

                  <TimelineSeparator>
                     <TimelineDot sx={{ bgcolor: getActionColor(movement.action) }}>{getActionIcon(movement.action)}</TimelineDot>
                     {index < movements.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>

                  <TimelineContent sx={{ py: "12px", px: 2 }}>
                     <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                           {movement.action}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                           {movement.description}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                           <Chip label={movement.origin} size="small" color="default" variant="outlined" />
                           <ArrowRightAlt fontSize="small" color="action" />
                           <Chip label={movement.destination} size="small" color="primary" />
                        </Box>
                     </Paper>
                  </TimelineContent>
               </TimelineItem>
            ))}
         </Timeline>
      </Box>
   );
};

// Componente principal de tabla de movimientos
export const TableMovements: React.FC<TableMovementsProps> = ({ movements, productInfo, compactMode = false, maxHeight = 400, viewMode = "table" }) => {
   console.log("🚀 ~ TableMovements ~ movements:", movements);
   // Configuración de columnas
   const allColumns: ColumnConfig[] = [
      {
         key: "action",
         label: "Acción",
         width: "15%",
         visibleByDefault: true,
         format: (value: string, row?: ProductMovement) => (
            <Chip
               label={value}
               size="small"
               sx={{
                  fontWeight: 600,
                  backgroundColor: (() => {
                     const actionLower = value.toLowerCase();
                     if (actionLower.includes("portado")) return "danger.light";
                     if (actionLower.includes("activ")) return "success.light";
                     if (actionLower.includes("alert")) return "warning.light";
                     if (actionLower.includes("asig")) return "info.light";
                     if (actionLower.includes("import")) return "primary.light";
                     if (actionLower.includes("error")) return "error.light";
                     if (actionLower.includes("cancel")) return "warning.light";
                     return "grey.300";
                  })(),
                  color: (() => {
                     const actionLower = value.toLowerCase();
                     if (actionLower.includes("portado")) return "danger.dark";
                     if (actionLower.includes("activ")) return "success.dark";
                     if (actionLower.includes("alert")) return "warning.dark";
                     if (actionLower.includes("asig")) return "info.dark";
                     if (actionLower.includes("import")) return "primary.dark";
                     if (actionLower.includes("error")) return "error.dark";
                     if (actionLower.includes("cancel")) return "warning.dark";
                     return "grey.800";
                  })()
               }}
            />
         )
      },
      {
         key: "description",
         label: "Descripción",
         width: "25%",
         visibleByDefault: true,
         format: (value: string) => (
            <Typography
               variant="body2"
               sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "300px"
               }}
               title={value}
            >
               {value}
            </Typography>
         )
      },
      {
         key: "origin",
         label: "Origen",
         width: "10%",
         align: "center",
         visibleByDefault: true,
         format: (value: string, row?: ProductMovement) => (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
               <Chip
                  label={value}
                  size="small"
                  variant="outlined"
                  sx={{
                     borderColor: "primary.main",
                     color: "primary.dark",
                     fontWeight: 500
                  }}
               />
            </Box>
         )
      },
      {
         key: "destination",
         label: "Destino",
         width: "10%",
         align: "center",
         visibleByDefault: true,
         format: (value: string, row?: ProductMovement) => (
            <Chip
               label={value}
               size="small"
               color="primary"
               sx={{
                  fontWeight: 600
               }}
            />
         )
      },
      {
         key: "executed_at",
         label: "Fecha/Hora",
         width: "15%",
         visibleByDefault: true,
         format: (value: string) => {
            try {
               return formatDatetime(value, "DD/MM/YYYY HH:mm:ss");
            } catch {
               return value;
            }
         }
      },
      {
         key: "executer",
         label: "Ejecutado por",
         width: "15%",
         visibleByDefault: true,
         format: (value: any) => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
               <Avatar sx={{ width: 24, height: 24, bgcolor: "primary.main" }}>
                  <Person fontSize="small" />
               </Avatar>
               <Typography variant="body2">{value?.username || "N/A"}</Typography>
            </Box>
         )
      },
      {
         key: "created_at",
         label: "Registrado",
         width: "12%",
         visibleByDefault: false,
         format: (value: string) => {
            try {
               return formatDatetime(value, "DD/MM/YYYY");
            } catch {
               return value;
            }
         }
      }
   ];

   // Determinar columnas visibles
   const getVisibleColumns = (): ColumnConfig[] => {
      if (compactMode) {
         return allColumns.filter((col) => ["action", "description", "executed_at"].includes(col.key));
      }
      return allColumns.filter((col) => col.visibleByDefault);
   };

   const columns = getVisibleColumns();

   // Estadísticas
   const stats = useMemo(() => {
      return {
         total: movements.length,
         byAction: movements.reduce(
            (acc, movement) => {
               acc[movement.action] = (acc[movement.action] || 0) + 1;
               return acc;
            },
            {} as Record<string, number>
         ),
         lastMovement: movements.length > 0 ? movements[0] : null,
         firstMovement: movements.length > 0 ? movements[movements.length - 1] : null
      };
   }, [movements]);

   // Si no hay datos
   if (!movements || movements.length === 0) {
      return (
         <Paper sx={{ p: 4, textAlign: "center" }}>
            <TimelineIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
               No hay movimientos registrados
            </Typography>
            <Typography variant="body2" color="text.secondary">
               Este producto aún no tiene historial de movimientos
            </Typography>
         </Paper>
      );
   }

   // Ordenar movimientos por fecha (más reciente primero)
   const sortedMovements = [...movements].sort((a, b) => new Date(b.executed_at).getTime() - new Date(a.executed_at).getTime());

   return (
      <Box sx={{ width: "100%" }}>
         {/* Encabezado con información del producto */}
         {productInfo && (
            <Paper sx={{ p: 2, mb: 2, backgroundColor: "primary.50" }}>
               <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 4 }}>
                     <Typography variant="subtitle2" color="text.secondary">
                        ICCID
                     </Typography>
                     <Typography variant="body1" fontWeight="bold" fontFamily="monospace">
                        {productInfo.iccid || "N/A"}
                     </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                     <Typography variant="subtitle2" color="text.secondary">
                        IMEI
                     </Typography>
                     <Typography variant="body1" fontWeight="bold" fontFamily="monospace">
                        {productInfo.imei || "N/A"}
                     </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                     <Typography variant="subtitle2" color="text.secondary">
                        Teléfono
                     </Typography>
                     <Typography variant="body1" fontWeight="bold">
                        {productInfo.phone || "N/A"}
                     </Typography>
                  </Grid>
               </Grid>
            </Paper>
         )}

         {/* Estadísticas rápidas */}
         <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
               <Grid size={{ xs: 6, md: 3 }}>
                  <Box textAlign="center">
                     <Typography variant="h4" color="primary.main" fontWeight="bold">
                        {stats.total}
                     </Typography>
                     <Typography variant="caption" color="text.secondary">
                        Movimientos totales
                     </Typography>
                  </Box>
               </Grid>
               {Object.entries(stats.byAction).map(([action, count]) => (
                  <Grid size={{ xs: 6, md: 3 }} key={action}>
                     <Box textAlign="center">
                        <Typography variant="h4" color="secondary.main" fontWeight="bold">
                           {count}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                           {action}
                        </Typography>
                     </Box>
                  </Grid>
               ))}
            </Grid>
         </Paper>

         {/* Selector de vista */}
         {(viewMode === "both" || viewMode === "timeline") && (
            <Box sx={{ mb: 3 }}>
               <Typography variant="h6" gutterBottom>
                  <TimelineIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Línea de Tiempo
               </Typography>
               <MovementTimeline movements={sortedMovements} />
               <Divider sx={{ my: 3 }} />
            </Box>
         )}

         {/* Tabla de movimientos */}
         {(viewMode === "both" || viewMode === "table") && (
            <>
               <Typography variant="h6" gutterBottom>
                  <History sx={{ verticalAlign: "middle", mr: 1 }} />
                  Registro Detallado
               </Typography>

               <TableContainer
                  component={Paper}
                  sx={{
                     maxHeight: maxHeight || 400,
                     mb: 2,
                     "& .MuiTableCell-root": {
                        py: compactMode ? 0.5 : 1,
                        px: compactMode ? 1 : 1.5,
                        fontSize: compactMode ? "0.75rem" : "0.8125rem"
                     }
                  }}
               >
                  <Table stickyHeader size={compactMode ? "small" : "medium"}>
                     <TableHead>
                        <TableRow>
                           {columns.map((column) => (
                              <TableCell
                                 key={column.key}
                                 align={column.align || "left"}
                                 sx={{
                                    width: column.width,
                                    fontWeight: 600,
                                    backgroundColor: "primary.light",
                                    color: "primary.contrastText",
                                    fontSize: compactMode ? "0.75rem" : "0.875rem"
                                 }}
                              >
                                 {column.label}
                              </TableCell>
                           ))}
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {sortedMovements.map((movement) => (
                           <TableRow
                              key={movement.id}
                              sx={{
                                 "&:nth-of-type(odd)": {
                                    backgroundColor: "action.hover"
                                 },
                                 "&:hover": {
                                    backgroundColor: "action.selected"
                                 }
                              }}
                           >
                              {columns.map((column) => {
                                 const cellKey = `${movement.id}-${column.key}`;
                                 const value = movement[column.key];

                                 if (column.format) {
                                    return (
                                       <TableCell key={cellKey} align={column.align || "left"}>
                                          {column.format(value, movement)}
                                       </TableCell>
                                    );
                                 }

                                 if (column.colorCondition && typeof value === "string") {
                                    const color = column.colorCondition(value, movement);
                                    return (
                                       <TableCell key={cellKey} align={column.align || "left"}>
                                          <Typography variant="body2" color={color}>
                                             {value}
                                          </Typography>
                                       </TableCell>
                                    );
                                 }

                                 return (
                                    <TableCell key={cellKey} align={column.align || "left"}>
                                       {value || "-"}
                                    </TableCell>
                                 );
                              })}
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>

               {/* Pie de tabla */}
               {!compactMode && (
                  <Paper
                     sx={{
                        p: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "grey.50",
                        borderTop: 1,
                        borderColor: "divider"
                     }}
                  >
                     <Typography variant="caption" color="text.secondary">
                        Primer movimiento: <strong>{stats.firstMovement ? formatDatetime(stats.firstMovement.executed_at, "DD/MM/YYYY") : "N/A"}</strong>
                     </Typography>

                     <Typography variant="caption" color="text.secondary">
                        Último movimiento: <strong>{stats.lastMovement ? formatDatetime(stats.lastMovement.executed_at, "DD/MM/YYYY HH:mm") : "N/A"}</strong>
                     </Typography>

                     <Typography variant="caption" color="text.secondary">
                        Total: <strong>{stats.total} registros</strong>
                     </Typography>
                  </Paper>
               )}
            </>
         )}

         {/* Resumen de estado actual */}
         {stats.lastMovement && (
            <Paper sx={{ p: 2, mt: 2, backgroundColor: "info.50" }}>
               <Typography variant="subtitle1" fontWeight="bold" gap={2} gutterBottom>
                  Estado Actual &nbsp;
                  <Chip label={sortedMovements[0].destination} color={getBageColor(sortedMovements[0].destination)} size="small" sx={{ mr: 1 }} />
               </Typography>
               <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                     <Typography variant="body2" color="text.secondary">
                        Última acción:
                     </Typography>
                     <Typography variant="body1" fontWeight="bold">
                        {stats.lastMovement.action}
                     </Typography>
                     <Typography variant="caption" color="text.secondary">
                        {stats.lastMovement.description}
                     </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                     <Typography variant="body2" color="text.secondary">
                        Ubicación actual:
                     </Typography>
                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                        <Chip label={stats.lastMovement.destination} color="primary" size="small" />
                        <Typography variant="caption" color="text.secondary">
                           (desde {stats.lastMovement.origin})
                        </Typography>
                     </Box>
                  </Grid>
               </Grid>
            </Paper>
         )}
      </Box>
   );
};

// Componente Modal para mostrar movimientos
interface ProductMovementsModalProps {
   open: boolean;
   onClose: () => void;
   movements: ProductMovement[];
   productInfo?: {
      iccid?: string;
      imei?: string;
      phone?: string;
      [key: string]: any;
   };
   title?: string;
   maxHeight?: number;
   fullScreen?: boolean;
}

export const ProductMovementsModal: React.FC<ProductMovementsModalProps> = ({ open, onClose, movements, productInfo, title, maxHeight = 600, fullScreen = false }) => {
   return (
      // Asumiendo que tienes un DialogComponent similar al ejemplo
      // Reemplaza con tu componente Dialog real
      <DialogComponent
         open={open}
         setOpen={onClose}
         modalTitle={
            <Grid container alignItems="center" spacing={1}>
               <Grid>
                  <History />
               </Grid>
               <Grid>
                  <Typography variant="h6" fontWeight="bold">
                     {title || `Historial de Movimientos`}
                  </Typography>
               </Grid>
               {productInfo?.iccid && (
                  <Grid>
                     <Typography variant="h4" color="text.primary">
                        ICCID: {productInfo.iccid}
                     </Typography>
                  </Grid>
               )}
            </Grid>
         }
         maxWidth="lg"
         fullScreen={fullScreen}
         height={maxHeight}
         formikRef={undefined}
         textBtnSubmit={undefined}
      >
         <TableMovements movements={movements} productInfo={productInfo} viewMode="both" maxHeight={maxHeight - 100} />
      </DialogComponent>
   );
};

// Hook para normalizar datos
export function useNormalizeMovements(data: any[]): ProductMovement[] {
   return useMemo(() => {
      if (!data || !Array.isArray(data)) return [];
      return data.map((item) => {
         return {
            ...item,
            executed_at: item.executed_at || item.created_at,
            executer: item.executer || { username: "Sistema" }
         };
      });
   }, [data]);
}

export default TableMovements;
