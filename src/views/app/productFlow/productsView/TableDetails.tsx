import React, { useMemo } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Chip, Grid } from "@mui/material";
import { DialogComponent } from "../../../../components";
import { formatCurrency } from "../../../../utils/Formats";

// Interfaz para los datos de cada línea (basada en tu BD)
interface ProductDetail {
   id?: number;
   filtro?: string;
   telefono?: string;
   imei?: string;
   iccid?: string;
   estatus_lin?: string;
   movimiento?: string;
   fecha_activ?: string | Date;
   fecha_prim_llam?: string | Date;
   fecha_dol?: string | Date;
   estatus_pago?: "PAGADA" | "RECHAZADA" | string;
   motivo_estatus?: string;
   monto_com?: number;
   tipo_comision?: string;
   evaluacion?: string | number;
   fza_vta_pago?: string;
   fecha_evaluacion?: string | Date;
   folio_factura?: string;
   fecha_publicacion?: string | Date;
   import_id?: number;
   active?: boolean;
   created_at?: string | Date;
   updated_at?: string | Date;

   // Extra: cuando venga de Excel podría traer campos adicionales
   [key: string]: any;
}

//#region MAPEO PARA NORMALIZAR COLUMNAS EXCEL A BD
/**
 * Mapeo de columnas del Excel a nombres de BD
 */
export const excelToDbMap: Record<string, keyof ProductDetail> = {
   // Mapeo exacto basado en tu ejemplo
   FILTRO: "filtro",
   TELEFONO: "telefono",
   IMEI: "imei",
   ICCID: "iccid",
   "ESTATUS LIN": "estatus_lin",
   MOVIMIENTO: "movimiento",
   FECHA_ACTIV: "fecha_activ",
   FECHA_PRIM_LLAM: "fecha_prim_llam",
   "FECHA DOL": "fecha_dol",
   ESTATUS_PAGO: "estatus_pago",
   MOTIVO_ESTATUS: "motivo_estatus",
   MONTO_COM: "monto_com",
   TIPO_COMISION: "tipo_comision",
   EVALUACION: "evaluacion",
   FZA_VTA_PAGO: "fza_vta_pago",
   "FECHA EVALUACION": "fecha_evaluacion",
   "FOLIO FACTURA": "folio_factura",
   "FECHA PUBLICACION": "fecha_publicacion"

   // Variaciones comunes que podrían aparecer
   // Teléfono: "telefono",
   // "Teléfono:": "telefono",
   // "ICCID:": "iccid",
   // "ICCID ": "iccid",
   // "IMEI:": "imei",
   // Estatus: "estatus_lin",
   // Estatus_Lin: "estatus_lin",
   // "FECHA ACTIV": "fecha_activ",
   // "FECHA ACTIVACIÓN": "fecha_activ",
   // FECHA_PRIM_LLAMADA: "fecha_prim_llam",
   // "FECHA PRIM LLAM": "fecha_prim_llam",
   // FECHA_DOL: "fecha_dol",
   // "FECHA DOL": "fecha_dol",
   // "ESTATUS PAGO": "estatus_pago",
   // ESTATUS: "estatus_pago",
   // MONTO: "monto_com",
   // MONTO_COMISION: "monto_com",
   // COMISION: "monto_com",
   // TIPO: "tipo_comision",
   // EVALUACIÓN: "evaluacion",
   // FUERZA_VENTA: "fza_vta_pago",
   // "FUERZA VENTA": "fza_vta_pago",
   // FOLIO: "folio_factura",
   // FOLIO_FACT: "folio_factura",
   // FECHA_PUB: "fecha_publicacion",
   // PUBLICACION: "fecha_publicacion"
};

export function normalizeDetalleFromExcel(row: Record<string, any>): ProductDetail {
   const normalized: ProductDetail = {};

   // Object.keys(row).forEach((key) => {
   Object.keys(row).forEach((key) => {
      const cleanKey = key.trim().toUpperCase();
      const mappedKey = excelToDbMap[cleanKey];

      if (mappedKey) {
         normalized[mappedKey] = row[key];
      }
   });

   return normalized;
}

export function normalizeDetalle(data: any[]): ProductDetail[] {
   if (!data.length) return [];

   const sample = data[0];

   const isExcel = !!Object.keys(sample).find((k) => excelToDbMap[k.trim().toUpperCase()]);

   // Si viene de BD, ya está normalizado
   if (!isExcel) {
      return data as ProductDetail[];
   }

   // Si viene de Excel, normalizamos todas las filas
   return data.map((item) => normalizeDetalleFromExcel(item));
}

export function useNormalizeDetalleProducto(rawData: any[]) {
   const normalized = useMemo(() => normalizeDetalle(rawData), [rawData]);
   return normalized;
}
//#endregion MAPEO PARA NORMALIZAR COLUMNAS EXCEL A BD

// Interfaz para las props del componente
interface TableDetailsProps {
   keyName: string;
   processedData: ProductDetail[];
   visibleColumns?: string[]; // Columnas visibles específicas
   showAllColumns?: boolean;
   compactMode?: boolean;
   maxHeight: number | null;
}

// Configuración de columnas basada en tu BD
interface ColumnConfig {
   key: keyof ProductDetail;
   label: string;
   width?: string | number;
   align?: "left" | "center" | "right" | "inherit" | "justify";
   format?: (value: any, row?: ProductDetail) => string | React.ReactNode;
   colorCondition?: (value: any, row?: ProductDetail) => string;
   visibleByDefault?: boolean;
   tooltip?: string;
}

export const TableDetails: React.FC<TableDetailsProps> = ({
   keyName,
   processedData,
   visibleColumns,
   showAllColumns = false,
   compactMode = false,
   maxHeight = null
}) => {
   // Configuración completa de columnas basada en tu BD
   const allColumns: ColumnConfig[] = [
      {
         key: "filtro",
         label: "Filtro",
         width: "10%",
         visibleByDefault: false
      },
      {
         key: "telefono",
         label: "Teléfono",
         width: "10%",
         visibleByDefault: true
      },
      {
         key: "imei",
         label: "IMEI",
         width: "12%",
         visibleByDefault: false
      },
      {
         key: "iccid",
         label: "ICCID",
         width: "15%",
         visibleByDefault: true,
         format: (value: string) => (
            <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
               {value}
            </Typography>
         )
      },
      {
         key: "estatus_lin",
         label: "Estatus Línea",
         width: "10%",
         align: "center",
         visibleByDefault: true,
         colorCondition: (value: string) => {
            if (!value) return "text.secondary";
            const upperValue = value.toUpperCase();
            if (["ACT", "ACTIVA", "ACTIVO"].includes(upperValue)) return "success.main";
            if (["INACT", "INACTIVA", "INACTIVO", "CANCELADA"].includes(upperValue)) return "error.main";
            if (["ZB1", "SUSPENDIDA"].includes(upperValue)) return "warning.main";
            return "text.primary";
         }
      },
      {
         key: "movimiento",
         label: "Movimiento",
         width: "10%",
         visibleByDefault: false
      },
      {
         key: "fecha_activ",
         label: "Fecha Activación",
         width: "10%",
         visibleByDefault: true,
         format: (value: string | Date) => {
            if (!value) return "-";
            return new Date(value).toLocaleDateString("es-MX");
         }
      },
      {
         key: "fecha_prim_llam",
         label: "Primera Llamada",
         width: "10%",
         visibleByDefault: false,
         format: (value: string | Date) => {
            if (!value) return "-";
            return new Date(value).toLocaleDateString("es-MX");
         }
      },
      {
         key: "fecha_dol",
         label: "Fecha DOL",
         width: "10%",
         visibleByDefault: false,
         format: (value: string | Date) => {
            if (!value) return "-";
            return new Date(value).toLocaleDateString("es-MX");
         }
      },
      {
         key: "estatus_pago",
         label: "Estatus Pago",
         width: "12%",
         align: "center",
         visibleByDefault: true,
         colorCondition: (value: string) => {
            if (!value) return "text.primary";
            const upperValue = value.toUpperCase();
            if (upperValue.includes("PAGADA")) return "success.main";
            if (upperValue.includes("RECHAZADA")) return "errorlight";
            if (upperValue.includes("PENDIENTE")) return "warning.main";
            return "text.secondary";
         },
         format: (value: string) => {
            const upperValue = value?.toUpperCase() || "";
            return (
               <Chip
                  label={value || "N/A"}
                  size="small"
                  sx={{
                     fontWeight: 600,
                     textTransform: "uppercase",
                     fontSize: "0.7rem",
                     height: "24px",
                     backgroundColor: upperValue.includes("PAGADA") ? "success.light" : upperValue.includes("RECHAZADA") ? "error.light" : "warning.light",
                     color: upperValue.includes("PAGADA") ? "success.dark" : upperValue.includes("RECHAZADA") ? "error.dark" : "warning.dark"
                  }}
               />
            );
         }
      },
      {
         key: "motivo_estatus",
         label: "Motivo",
         width: "15%",
         visibleByDefault: false,
         format: (value: string) => (
            <Typography
               variant="body2"
               sx={{
                  fontSize: "0.75rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px"
               }}
               title={value}
            >
               {value || "-"}
            </Typography>
         )
      },
      {
         key: "monto_com",
         label: "Monto Comisión",
         width: "10%",
         align: "right",
         visibleByDefault: true,
         format: (value: number) => {
            const amount = value || 0;
            return (
               <Typography
                  variant="body2"
                  color={amount > 0 ? "success.main" : "text.secondary"}
                  sx={{
                     fontFamily: "monospace",
                     fontWeight: amount > 0 ? 600 : 400
                  }}
               >
                  {formatCurrency(amount)}
               </Typography>
            );
         }
      },
      {
         key: "tipo_comision",
         label: "Tipo Comisión",
         width: "35%",
         visibleByDefault: false
      },
      {
         key: "evaluacion",
         label: "Evaluación",
         width: "8%",
         align: "center",
         visibleByDefault: true,
         format: (value: string | number) => {
            const numValue = parseInt(value as string) || 0;
            const colors = ["error.main", "warning.main", "info.main", "success.main"];
            const colorIndex = Math.min(numValue - 1, colors.length - 1);

            return (
               <Box sx={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                  <Box
                     sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                        backgroundColor: colors[colorIndex] || "grey.300",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.75rem"
                     }}
                  >
                     {value}
                  </Box>
               </Box>
            );
         }
      },
      {
         key: "fza_vta_pago",
         label: "Fza. Venta",
         width: "10%",
         visibleByDefault: false
      },
      {
         key: "fecha_evaluacion",
         label: "Fecha Evaluación",
         width: "10%",
         visibleByDefault: false,
         format: (value: string | Date) => {
            if (!value) return "-";
            return new Date(value).toLocaleDateString("es-MX");
         }
      },
      {
         key: "folio_factura",
         label: "Folio Factura",
         width: "12%",
         visibleByDefault: false,
         format: (value: string) => (
            <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
               {value || "-"}
            </Typography>
         )
      },
      {
         key: "fecha_publicacion",
         label: "Fecha Publicación",
         width: "10%",
         visibleByDefault: false,
         format: (value: string | Date) => {
            if (!value) return "-";
            return new Date(value).toLocaleDateString("es-MX");
         }
      }
   ];

   // Determinar qué columnas mostrar
   const getVisibleColumns = (): ColumnConfig[] => {
      if (visibleColumns && visibleColumns.length > 0) {
         return allColumns.filter((col) => visibleColumns.includes(col.key as string));
      }

      if (showAllColumns) {
         return allColumns;
      }

      if (compactMode) {
         return allColumns.filter((col) => ["telefono", "iccid", "estatus_pago", "monto_com", "fecha_activ"].includes(col.key as string));
      }

      return allColumns.filter((col) => col.visibleByDefault);
   };

   const columns = getVisibleColumns();

   // Si no hay datos, mostrar mensaje
   if (!processedData || processedData.length === 0) {
      return (
         <Paper sx={{ p: 3, textAlign: "center", mb: 2 }}>
            <Typography variant="body1" color="text.secondary">
               No hay datos para mostrar
            </Typography>
         </Paper>
      );
   }

   // Función para obtener el valor formateado
   // const getFormattedValue = (row: ProductDetail, column: ColumnConfig): React.ReactNode => {
   //    console.log("🚀 ~ getFormattedValue ~ column:", column);
   //    console.log("🚀 ~ getFormattedValue ~ typeof(row):", typeof row);
   //    console.log("🚀 ~ getFormattedValue ~ row:", row);

   //    // Adaptar los datos a formato de BD
   //    // const datosFinales = useNormalizeDetalleProducto(row);

   //    const value = row[column.key];

   //    if (column.format) {
   //       return column.format(value, row);
   //    }

   //    // Formateo por defecto para fechas
   //    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/)) {
   //       return new Date(value).toLocaleDateString("es-MX");
   //    }

   //    return value ?? "-";
   // };
   const getFormattedValue = (row: ProductDetail, column: ColumnConfig): React.ReactNode => {
      // let normalizedRow: ProductDetail = row;
      // console.log("🚀 ~ getFormattedValue ~ normalizedRow:", normalizedRow);

      // Detectar si la fila viene de Excel (tiene claves tipo "FILTRO", "TELEFONO", etc.)
      // const isExcelRow = Object.keys(row).some((key) => excelToDbMap[key.trim().toUpperCase()]);
      // console.log("🚀 ~ getFormattedValue ~ isExcelRow:", isExcelRow);

      // if (isExcelRow) {
      //    normalizedRow = normalizeDetalleFromExcel(row);
      // }
      // console.log("🚀 ~ getFormattedValue ~ normalizedRow:", normalizedRow);
      // const value = normalizedRow[column.key];

      const value = row[column.key];

      // Si la columna tiene formateador personalizado
      if (column.format) {
         return column.format(value, row);
      }

      // Formateo automático para fechas YYYY-MM-DD
      if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/)) {
         return new Date(value).toLocaleDateString("es-MX");
      }

      return value ?? "-";
   };

   return (
      <Box sx={{ width: "100%" }}>
         <TableContainer
            component={Paper}
            key={`table-${keyName}`}
            sx={{
               maxHeight: maxHeight ? maxHeight : compactMode ? 250 : 400,
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
                           key={column.key as string}
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
                  {processedData.map((row, index) => {
                     return (
                        <TableRow
                           key={row.id || index}
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
                              const cellKey = `${row.id}-${column.key as string}`;
                              const formattedValue = getFormattedValue(row, column);

                              // Si la columna tiene colorCondition, aplicarlo al Typography
                              if (column.colorCondition && typeof formattedValue === "string") {
                                 const color = column.colorCondition(row[column.key], row);

                                 return (
                                    <TableCell key={cellKey} align={column.align || "left"}>
                                       <Typography
                                          variant="body2"
                                          color={color}
                                          sx={{
                                             fontSize: compactMode ? "0.75rem" : "0.8125rem"
                                          }}
                                       >
                                          {formattedValue}
                                       </Typography>
                                    </TableCell>
                                 );
                              }

                              // Para celdas con componentes React
                              if (React.isValidElement(formattedValue)) {
                                 return (
                                    <TableCell key={cellKey} align={column.align || "left"}>
                                       {formattedValue}
                                    </TableCell>
                                 );
                              }

                              // Para valores simples
                              return (
                                 <TableCell key={cellKey} align={column.align || "left"}>
                                    {formattedValue}
                                 </TableCell>
                              );
                           })}
                        </TableRow>
                     );
                  })}
               </TableBody>
            </Table>
         </TableContainer>

         {/* Pie de tabla con estadísticas */}
         {!compactMode && (
            <Paper
               component="div"
               sx={{
                  p: 1.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: 1,
                  borderColor: "divider",
                  backgroundColor: "grey.50"
               }}
            >
               <Typography variant="caption" color="text.secondary">
                  Total registros: <strong>{processedData.length}</strong>
               </Typography>

               <Box sx={{ display: "flex", gap: 2 }}>
                  <Typography variant="caption" color="success.main">
                     Pagados: <strong>{processedData.filter((d) => d.estatus_pago?.toUpperCase().includes("PAGADA")).length}</strong>
                  </Typography>
                  <Typography variant="caption" color="error.main">
                     Rechazados: <strong>{processedData.filter((d) => d.estatus_pago?.toUpperCase().includes("RECHAZADA")).length}</strong>
                  </Typography>
                  <Typography variant="caption" color="warning.main">
                     Otros:{" "}
                     <strong>
                        {processedData.filter((d) => !d.estatus_pago?.toUpperCase().includes("PAGADA") && !d.estatus_pago?.toUpperCase().includes("RECHAZADA")).length}
                     </strong>
                  </Typography>
               </Box>

               <Typography variant="caption" color="text.secondary">
                  Total comisiones:{" "}
                  <strong style={{ fontFamily: "monospace" }}>${processedData.reduce((sum, d) => sum + (Number(d.monto_com) || 0), 0).toFixed(2)}</strong>
               </Typography>
            </Paper>
         )}
      </Box>
   );
};

// Exportar también una versión de columnas para usar en otros componentes
export const productHistoryColumns = {
   all: [
      "filtro",
      "telefono",
      "imei",
      "iccid",
      "estatus_lin",
      "movimiento",
      "fecha_activ",
      "fecha_prim_llam",
      "fecha_dol",
      "estatus_pago",
      "motivo_estatus",
      "monto_com",
      "tipo_comision",
      "evaluacion",
      "fza_vta_pago",
      "fecha_evaluacion",
      "folio_factura",
      "fecha_publicacion"
   ] as const,

   default: ["telefono", "iccid", "estatus_lin", "fecha_activ", "estatus_pago", "monto_com", "evaluacion"] as const,

   compact: ["telefono", "iccid", "estatus_pago", "monto_com"] as const,

   financial: ["iccid", "estatus_pago", "monto_com", "tipo_comision", "fecha_activ", "folio_factura"] as const
};

// Tipos para las columnas
export type ProductHistoryColumn = (typeof productHistoryColumns.all)[number];

TableDetails;

interface ModalTableDetailsProps {
   openDialog: boolean;
   setOpenDialog: (open: boolean) => void;
   processedData: ProductDetail[];
   maxHeight: number;
   fullScreen: boolean;
   heightDialog: any;
}

const ModalTableDetails: React.FC<ModalTableDetailsProps> = ({
   openDialog,
   setOpenDialog,
   processedData,
   maxHeight = 500,
   fullScreen = false,
   heightDialog = undefined
}) => {
   return (
      <DialogComponent
         open={openDialog}
         setOpen={setOpenDialog}
         modalTitle={
            <Grid display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
               <Typography className="font-extrabold text-center" variant="h4" fontWeight={"bold"}>
                  {`DETALLES DEL ICCID: ${processedData[0]?.iccid ?? "___"}`}
               </Typography>
            </Grid>
         }
         maxWidth={false}
         fullScreen={fullScreen}
         height={heightDialog}
         formikRef={undefined}
         textBtnSubmit={undefined}
      >
         <TableDetails keyName="details-by-product" processedData={processedData} showAllColumns={true} maxHeight={maxHeight} />
      </DialogComponent>
   );
};
export default ModalTableDetails;




