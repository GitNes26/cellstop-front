import React from "react";
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { DialogComponent } from "../../../../components";
import { title } from "process";
import { Tooltip } from "react-leaflet";

// Interfaz para los datos de cada línea
interface ProcessedLine {
   id: string | number;
   telefono?: string;
   iccid?: string;
   estatusPago?: "PAGADA" | "RECHAZADA" | string; // PAGADA, RECHAZADA u otros valores
   montoCom?: number;
   evaluacion?: string | number;
   fechaActiv?: string;
}

// Interfaz para las props del componente
interface TableDetailsProps {
   keyName: string;
   processedData: ProcessedLine[];
   showAllColumns?: boolean; // Prop opcional para mostrar todas las columnas
   maxHeight: number;
}

// Configuración de columnas personalizable
interface ColumnConfig {
   key: keyof ProcessedLine;
   label: string;
   width?: string | number;
   align?: "left" | "center" | "right" | "inherit" | "justify";
   format?: (value: any) => string;
   colorCondition?: (value: any) => string;
}

export const TableDetails: React.FC<TableDetailsProps> = ({ keyName, processedData, showAllColumns = false, maxHeight = 350 }) => {
   // Configuración de columnas base
   const baseColumns: ColumnConfig[] = [
      {
         key: "telefono",
         label: "Teléfono",
         width: "15%"
      },
      {
         key: "iccid",
         label: "ICCID",
         width: "20%"
      },
      {
         key: "estatusPago",
         label: "Estatus Pago",
         width: "15%",
         align: "center",
         colorCondition: (value: string) => {
            if (!value) return "text.primary";
            const upperValue = value.toUpperCase();
            if (upperValue.includes("PAGADA")) return "success.main";
            if (upperValue.includes("RECHAZADA")) return "error.main";
            return "warning.main";
         }
      },
      {
         key: "montoCom",
         label: "Monto",
         width: "12%",
         align: "right",
         format: (value: number) => (value ? `$${value.toFixed(2)}` : "$0.00")
      },
      {
         key: "evaluacion",
         label: "Evaluación",
         width: "10%",
         align: "center"
      },
      {
         key: "fechaActiv",
         label: "Fecha Activación",
         width: "18%"
      }
   ];

   // Columnas adicionales si se necesita mostrar todo
   const additionalColumns: ColumnConfig[] = [
      {
         key: "filtro" as keyof ProcessedLine,
         label: "Filtro",
         width: "15%"
      },
      {
         key: "imei" as keyof ProcessedLine,
         label: "IMEI",
         width: "15%"
      },
      {
         key: "estatusLin" as keyof ProcessedLine,
         label: "Estatus Línea",
         width: "12%"
      },
      {
         key: "movimiento" as keyof ProcessedLine,
         label: "Movimiento",
         width: "12%"
      }
   ];

   // Determinar qué columnas mostrar
   const columns = showAllColumns ? [...baseColumns, ...additionalColumns] : baseColumns;

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
   const getFormattedValue = (row: ProcessedLine, column: ColumnConfig) => {
      const value = row[column.key];

      if (column.format && value !== undefined && value !== null) {
         return column.format(value);
      }

      // Formateo por defecto para fechas
      if (column.key === "fechaActiv" && value) {
         return new Date(value).toLocaleDateString("es-MX");
      }

      return value ?? "-";
   };

   return (
      <TableContainer
         component={Paper}
         key={`table-${keyName}`}
         sx={{
            maxHeight: maxHeight,
            mb: 2,
            "& .MuiTableCell-root": {
               py: 1,
               px: 1.5
            }
         }}
      >
         <Table stickyHeader size="small">
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
                           color: "primary.contrastText"
                        }}
                     >
                        {column.label}
                     </TableCell>
                  ))}
               </TableRow>
            </TableHead>
            <TableBody>
               {processedData.map((row, index) => (
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
                        const value = getFormattedValue(row, column);
                        const cellKey = `${row.id}-${column.key}`;

                        // Para columna de estatusPago con color condicional
                        if (column.key === "estatusPago" && column.colorCondition) {
                           const color = column.colorCondition(row.estatusPago);

                           return (
                              <TableCell key={cellKey} align={column.align || "left"}>
                                 <Typography
                                    variant="body2"
                                    color={color}
                                    sx={{
                                       fontWeight: row.estatusPago?.toUpperCase() === "PAGADA" ? 600 : 400,
                                       textTransform: "uppercase",
                                       fontSize: "0.75rem"
                                    }}
                                 >
                                    {value}
                                 </Typography>
                              </TableCell>
                           );
                        }

                        // Para columna de monto con formato monetario
                        if (column.key === "montoCom") {
                           const numericValue = row.montoCom || 0;
                           const isPositive = numericValue > 0;

                           return (
                              <TableCell key={cellKey} align={column.align || "right"}>
                                 <Typography
                                    variant="body2"
                                    color={isPositive ? "success.main" : "text.secondary"}
                                    sx={{
                                       fontWeight: isPositive ? 600 : 400,
                                       fontFamily: "monospace"
                                    }}
                                 >
                                    {value}
                                 </Typography>
                              </TableCell>
                           );
                        }

                        // Para otras columnas
                        return (
                           <TableCell
                              key={cellKey}
                              align={column.align || "left"}
                              sx={{
                                 fontSize: "0.8125rem"
                              }}
                           >
                              {value}
                           </TableCell>
                        );
                     })}
                  </TableRow>
               ))}
            </TableBody>
         </Table>

         {/* Pie de tabla con estadísticas */}
         <Paper
            component="div"
            sx={{
               p: 1,
               display: "flex",
               justifyContent: "space-between",
               borderTop: 1,
               borderColor: "divider"
            }}
         >
            <Typography variant="caption" color="text.secondary">
               Total registros: {processedData.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
               Pagados: {processedData.filter((d) => d.estatusPago?.toUpperCase() === "PAGADA").length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
               Total monto: ${processedData.reduce((sum, d) => sum + (d.montoCom || 0), 0).toFixed(2)}
            </Typography>
         </Paper>
      </TableContainer>
   );
};

interface ModalTableDetailsProps {
   openDialog: boolean;
   setOpenDialog: (open: boolean) => void;
   processedData: ProcessedLine[];
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
         maxWidth="xl"
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

// Versión alternativa más simple si prefieres mantener la estructura original
export const SimpleTableDetails: React.FC<TableDetailsProps> = ({ keyName, processedData, maxHeight = 350 }) => {
   // Si no hay datos, mostrar mensaje
   if (!processedData || processedData.length === 0) {
      return (
         <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
            No hay datos disponibles
         </Typography>
      );
   }

   return (
      <TableContainer component={Paper} key={`simple-table-${keyName}`} sx={{ maxHeight: maxHeight, mb: 2 }}>
         <Table stickyHeader size="small">
            <TableHead>
               <TableRow>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>ICCID</TableCell>
                  <TableCell>Estatus Pago</TableCell>
                  <TableCell align="right">Monto</TableCell>
                  <TableCell>Evaluación</TableCell>
                  <TableCell>Fecha Activación</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {processedData.map((line) => {
                  const isPagada = line.estatusPago?.toUpperCase() === "PAGADA";
                  const isRechazada = line.estatusPago?.toUpperCase() === "RECHAZADA";

                  return (
                     <TableRow key={line.id}>
                        <TableCell>{line.telefono || "-"}</TableCell>
                        <TableCell>{line.iccid || "-"}</TableCell>
                        <TableCell>
                           <Typography
                              variant="body2"
                              color={isPagada ? "success.main" : isRechazada ? "error.main" : "warning.main"}
                              sx={{
                                 fontWeight: isPagada ? 600 : 400,
                                 textTransform: "uppercase"
                              }}
                           >
                              {line.estatusPago || "N/A"}
                           </Typography>
                        </TableCell>
                        <TableCell align="right">
                           <Typography variant="body2" color={line.montoCom && line.montoCom > 0 ? "success.main" : "text.secondary"} sx={{ fontFamily: "monospace" }}>
                              ${(line.montoCom || 0).toFixed(2)}
                           </Typography>
                        </TableCell>
                        <TableCell>{line.evaluacion || "-"}</TableCell>
                        <TableCell>{line.fechaActiv ? new Date(line.fechaActiv).toLocaleDateString("es-MX") : "-"}</TableCell>
                     </TableRow>
                  );
               })}
            </TableBody>
         </Table>
      </TableContainer>
   );
};
