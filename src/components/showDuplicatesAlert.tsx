import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Toast from "../utils/Toast";

const MySwal = withReactContent(Swal);

// Tipos principales
export type AlertType = "duplicates" | "metrics" | "metrics_custom" | "custom";

export type AlertData = string[] | Record<string, any> | any[];

export interface AlertIcon {
   background: string;
   content: string;
}

export interface AlertConfig {
   title: string;
   subtitle: (data: AlertData) => string;
   icon: AlertIcon;
   itemRenderer: (item: any, key?: string | number, index?: number) => React.ReactNode;
   suggestion?: string;
}

export interface FlexibleAlertProps {
   data: AlertData;
   type?: AlertType;
   title?: string;
   subtitle?: string | ((data: AlertData) => string);
   icon?: AlertIcon;
   itemRenderer?: (item: any, key?: string | number, index?: number) => React.ReactNode;
   suggestion?: string;
   onCopy?: (data: AlertData) => void;
   onDownload?: (data: AlertData) => void;
   copyTextGenerator?: (data: AlertData) => string;
   downloadDataGenerator?: (data: AlertData) => { csvData: any[][]; filename: string };
}

export interface ShowAlertOptions {
   type?: AlertType;
   title?: string;
   subtitle?: string | ((data: AlertData) => string);
   icon?: AlertIcon;
   itemRenderer?: (item: any, key?: string | number, index?: number) => React.ReactNode;
   suggestion?: string;
   onCopy?: (data: AlertData) => void;
   onDownload?: (data: AlertData) => void;
   copyTextGenerator?: (data: AlertData) => string;
   downloadDataGenerator?: (data: AlertData) => { csvData: any[][]; filename: string };
   width?: number;
   showCloseButton?: boolean;
}

// Tipos adicionales que podrías necesitar
export interface MetricsData {
   processed: number;
   errors: any[];
   duplicates: string[];
   products_updated: number;
   products_flagged: number;
   summary: {
      total_records: number;
      successful: number;
      failed: number;
      duplicates_found: number;
      products_to_activate: number;
      products_with_warnings: number;
   };
}

// Tipos de alerta predefinidos
export const ALERT_TYPES: Record<string, AlertType> = {
   DUPLICATES: "duplicates",
   METICS: "metrics",
   METRICS_CUSTOM: "metrics_custom",
   CUSTOM: "custom"
} as const;

// Configuraciones por tipo de alerta
export const ALERT_CONFIGS: Record<AlertType, AlertConfig> = {
   duplicates: {
      title: "ELEMENTOS DUPLICADOS",
      subtitle: (data: AlertData) => `Se encontraron ${(data as string[]).length} elementos repetidos`,
      icon: {
         background: "linear-gradient(135deg, #6F99CD 0%, #764ba2 100%)",
         content: "!"
      },
      itemRenderer: (item: string, index: number) => (
         <div
            style={{
               display: "flex",
               alignItems: "center",
               gap: "12px",
               padding: "12px 16px",
               background: "white",
               borderRadius: "8px",
               border: "1px solid #edf2f7",
               transition: "all 0.2s ease",
               boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
            }}
         >
            <span
               style={{
                  width: "24px",
                  height: "24px",
                  background: "#fed7d7",
                  color: "#c53030",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 600,
                  flexShrink: 0
               }}
            >
               {index + 1}
            </span>
            <span
               style={{
                  color: "#4a5568",
                  fontFamily: "'Monaco', 'Consolas', monospace",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "0.5px"
               }}
            >
               {item}
            </span>
         </div>
      ),
      suggestion: "💡 <strong>Sugerencia:</strong> Revise estos elementos antes de continuar"
   },
   metrics: {
      title: "RESUMEN DEL PROCESO",
      subtitle: () => `Procesamiento completado`,
      icon: {
         background: "linear-gradient(135deg, #4299e1 0%, #38a169 100%)",
         content: "📊"
      },
      itemRenderer: (item: any, key: string) => (
         <div
            style={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "center",
               padding: "10px 16px",
               background: "white",
               borderRadius: "8px",
               border: "1px solid #e2e8f0",
               marginBottom: "8px"
            }}
         >
            <span
               style={{
                  color: "#4a5568",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "capitalize"
               }}
            >
               {key.replace(/_/g, " ")}:
            </span>
            <span
               style={{
                  color: "#2d3748",
                  fontSize: "14px",
                  fontWeight: 600,
                  fontFamily: "'Monaco', 'Consolas', monospace"
               }}
            >
               {item}
            </span>
         </div>
      ),
      suggestion: "💡 <strong>Información:</strong> Revise las métricas del proceso"
   },
   metrics_custom: {
      title: "Resumen del Proceso",
      subtitle: (data: AlertData) => {
         const metrics = typeof data === "object" && !Array.isArray(data) ? (data as Record<string, any>).metrics : undefined;
         if (!metrics) return "Procesamiento completado";
         return `Procesados: ${metrics.summary?.total_records || 0} registros`;
      },
      icon: {
         background: "linear-gradient(135deg, #4299e1 0%, #38a169 100%)",
         content: "📊"
      },
      itemRenderer: (item: any, key: string) => {
         // Si es un objeto de métricas complejo
         if (key === "summary" && typeof item === "object") {
            return (
               <div style={{ marginBottom: "12px" }}>
                  <div
                     style={{
                        color: "#4a5568",
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "8px",
                        textTransform: "capitalize"
                     }}
                  >
                     Resumen:
                  </div>
                  {Object.entries(item).map(([subKey, value]) => (
                     <div
                        key={subKey}
                        style={{
                           display: "flex",
                           justifyContent: "space-between",
                           alignItems: "center",
                           padding: "8px 12px",
                           background: "white",
                           borderRadius: "6px",
                           border: "1px solid #e2e8f0",
                           marginBottom: "6px",
                           fontSize: "13px"
                        }}
                     >
                        <span style={{ color: "#718096", textTransform: "capitalize" }}>{subKey.replace(/_/g, " ")}:</span>
                        <span style={{ color: "#2d3748", fontWeight: 600 }}>{String(value)}</span>
                     </div>
                  ))}
               </div>
            );
         } else if (typeof item === "object") {
            return (
               <div
                  key={`item-${item.key}`}
                  style={{
                     display: "flex",
                     justifyContent: "space-between",
                     alignItems: "center",
                     padding: "8px 12px",
                     background: "white",
                     borderRadius: "6px",
                     border: "1px solid #e2e8f0",
                     marginBottom: "6px",
                     fontSize: "13px"
                  }}
               >
                  <span style={{ color: "#718096", textTransform: "capitalize" }}>{item.key.replace(/_/g, " ")}:</span>
                  <span style={{ color: "#2d3748", fontWeight: 600 }}>{String(item.value)}</span>
               </div>
            );
         }

         // Para otros valores simples
         // return (
         //    <div
         //       style={{
         //          display: "flex",
         //          justifyContent: "space-between",
         //          alignItems: "center",
         //          padding: "10px 16px",
         //          background: "white",
         //          borderRadius: "8px",
         //          border: "1px solid #e2e8f0",
         //          marginBottom: "8px"
         //       }}
         //    >
         //       <span
         //          style={{
         //             color: "#4a5568",
         //             fontSize: "14px",
         //             fontWeight: 500,
         //             textTransform: "capitalize"
         //          }}
         //       >
         //          {key.replace(/_/g, " ")}:
         //       </span>
         //       <span
         //          style={{
         //             color: "#2d3748",
         //             fontSize: "14px",
         //             fontWeight: 600,
         //             fontFamily: "'Monaco', 'Consolas', monospace"
         //          }}
         //       >
         //          {typeof item === "object" ? JSON.stringify(item) : String(item)}
         //       </span>
         //    </div>
         // );
      },
      suggestion: "💡 <strong>Información:</strong> Revise las métricas del proceso"
   },
   custom: {
      title: "Información",
      subtitle: () => "Detalles del proceso",
      icon: {
         background: "linear-gradient(135deg, #718096 0%, #4a5568 100%)",
         content: "ℹ️"
      },
      itemRenderer: (item: any, key: string | number) => (
         <div
            style={{
               padding: "10px 16px",
               background: "white",
               borderRadius: "8px",
               border: "1px solid #e2e8f0",
               marginBottom: "8px"
            }}
         >
            {typeof item === "object" ? JSON.stringify(item) : String(item)}
         </div>
      ),
      suggestion: "💡 <strong>Nota:</strong> Revise la información proporcionada"
   }
};

// Componente principal flexible
const FlexibleAlert: React.FC<FlexibleAlertProps> = ({
   data,
   type = ALERT_TYPES.DUPLICATES,
   title,
   subtitle,
   icon,
   itemRenderer,
   suggestion,
   onCopy,
   onDownload,
   copyTextGenerator,
   downloadDataGenerator
}) => {
   const config = ALERT_CONFIGS[type] || ALERT_CONFIGS[ALERT_TYPES.CUSTOM];

   // Usar configuraciones proporcionadas o las predeterminadas
   const finalTitle = title || config?.title;
   const finalSubtitle = typeof subtitle === "function" ? subtitle(data) : subtitle || config?.subtitle(data);
   const finalIcon = icon || config?.icon;
   const finalItemRenderer = itemRenderer || config?.itemRenderer;
   const finalSuggestion = suggestion || config?.suggestion;

   const handleCopyList = async (): Promise<void> => {
      if (onCopy) {
         onCopy(data);
         return;
      }

      console.log("🚀 ~ handleCopyList ~ type:", type);
      let textToCopy: string;
      if (copyTextGenerator) {
         textToCopy = copyTextGenerator(data);
      } else if (type === ALERT_TYPES.DUPLICATES) {
         const duplicates = data as string[];
         textToCopy = duplicates.map((item, index) => `${index + 1}. ${item}`).join("\n");
         textToCopy = `ELEMENTOS DUPLICADOS (${duplicates.length} elementos):\n\n${textToCopy}`;
      } else if ([ALERT_TYPES.METRICS, ALERT_TYPES.METRICS_CUSTOM].includes(type)) {
         console.log("🚀 ~ handleCopyList ~ type:", type);
         const metrics = data as Record<string, any>;
         textToCopy = Object.entries(metrics)
            .map(([key, value]) => `${key.replace(/_/g, " ").toUpperCase()}: ${value}`)
            .join("\n");
         textToCopy = `RESUMEN DEL PROCESO:\n\n${textToCopy}`;
      } else {
         textToCopy = JSON.stringify(data, null, 2);
      }

      try {
         await navigator.clipboard.writeText(textToCopy);
         Toast.Success("Listado copiado al portapapeles");
      } catch (error) {
         console.error("Error al copiar:", error);
      }
   };

   const handleDownloadExcel = (): void => {
      if (onDownload) {
         onDownload(data);
         return;
      }

      let csvData: any[][];
      let filename: string;

      if (downloadDataGenerator) {
         const result = downloadDataGenerator(data);
         csvData = result.csvData;
         filename = result.filename;
      } else if (type === ALERT_TYPES.DUPLICATES) {
         const duplicates = data as string[];
         const headers = ["Número", "Elemento", "Estado"];
         csvData = duplicates.map((item, index) => [(index + 1).toString(), `"${item}"`, "DUPLICADO"]);
         filename = `elementos-duplicados-${new Date().toISOString().split("T")[0]}`;
      } else if ([ALERT_TYPES.METRICS, ALERT_TYPES.METRICS_CUSTOM].includes(type)) {
         const metrics = data as Record<string, any>;
         const headers = ["Métrica", "Valor"];
         csvData = Object.entries(metrics).map(([key, value]) => [key, value]);
         filename = `metricas-proceso-${new Date().toISOString().split("T")[0]}`;
      } else {
         const headers = ["Campo", "Valor"];
         csvData = Object.entries(data as Record<string, any>).map(([key, value]) => [key, JSON.stringify(value)]);
         filename = `datos-${new Date().toISOString().split("T")[0]}`;
      }

      const headers = csvData.length > 0 ? Array.from({ length: csvData[0].length }, (_, i) => `Columna${i + 1}`) : [];
      const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      Toast.Success("El listado se ha descargado en formato CSV");
   };

   // Determinar qué datos mostrar
   const displayData = [ALERT_TYPES.METRICS, ALERT_TYPES.METRICS_CUSTOM].includes(type) ? Object.entries(data as Record<string, any>) : (data as any[]);

   return (
      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", padding: "8px" }}>
         {/* Header */}
         <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #e8e8e8" }}>
            <div
               style={{
                  width: "40px",
                  height: "40px",
                  background: finalIcon?.background || "bg-primary",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "bold"
               }}
            >
               {finalIcon?.content || ""}
            </div>
            <div>
               <h2 style={{ margin: 0, color: "#2d3748", fontSize: "18px", fontWeight: 600 }}>{finalTitle}</h2>
               <p style={{ margin: "4px 0 0 0", color: "#718096", fontSize: "14px" }}>{finalSubtitle}</p>
            </div>
         </div>

         {/* Botones de acción */}
         <div style={{ display: "flex", gap: "12px", marginBottom: "16px", justifyContent: "flex-end" }}>
            <button
               onClick={handleCopyList}
               style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  background: "#4299e1",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
               }}
               onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.background = "#3182ce")}
               onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.background = "#4299e1")}
            >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
               </svg>
               Copiar Listado
            </button>
            <button
               onClick={handleDownloadExcel}
               style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  background: "#38a169",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
               }}
               onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.background = "#2f855a")}
               onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.background = "#38a169")}
            >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               Descargar Excel
            </button>
         </div>

         {/* Contenido */}
         <div
            style={{
               maxHeight: "300px",
               overflowY: "auto",
               background: "#f8fafc",
               borderRadius: "12px",
               padding: "16px",
               border: "1px solid #e2e8f0"
            }}
         >
            {type === ALERT_TYPES.METRICS_CUSTOM ? (
               <div style={{ display: "grid", gap: "8px" }}>
                  {/* {Object.entries((displayData as unknown as MetricsData) || {}) */}
                  {displayData.map(([key, value], index) => {
                     // Filtrar propiedades si es necesario
                     if (key === "errors" && Array.isArray(value) && value.length === 0) return null;
                     if (key === "duplicates" && Array.isArray(value) && value.length === 0) return null;
                     // console.log("🚀 ~ FlexibleAlert ~ key:", key);
                     // console.log("🚀 ~ FlexibleAlert ~ value:", value);
                     // console.log("🚀 ~ FlexibleAlert ~ index:", index);

                     return <div key={key}>{finalItemRenderer({ key, value }, key, index)}</div>;
                  })}
               </div>
            ) : type === ALERT_TYPES.METRICS ? (
               <div style={{ display: "grid", gap: "8px" }}>
                  {(displayData as [string, any][]).map(([key, value], index) => (
                     <div key={key}>{finalItemRenderer(value, key, index)}</div>
                  ))}
               </div>
            ) : (
               <div
                  style={{
                     margin: 0,
                     padding: 0,
                     listStyle: "none",
                     display: "grid",
                     gap: "8px"
                  }}
               >
                  {(displayData as any[]).map((item, index) => (
                     <div key={index}>{finalItemRenderer(item, index)}</div>
                  ))}
               </div>
            )}
         </div>

         {/* Sugerencia */}
         {finalSuggestion && (
            <div
               style={{
                  marginTop: "20px",
                  padding: "12px 16px",
                  background: "#ebf8ff",
                  borderRadius: "8px",
                  borderLeft: "4px solid #4299e1"
               }}
            >
               <p style={{ margin: 0, color: "#2b6cb0", fontSize: "13px", fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: finalSuggestion }} />
            </div>
         )}
      </div>
   );
};

// Función principal para mostrar la alerta
export const showFlexibleAlert = (data: AlertData, options: ShowAlertOptions = {}): void => {
   const {
      type = ALERT_TYPES.DUPLICATES,
      title,
      subtitle,
      icon,
      itemRenderer,
      suggestion,
      onCopy,
      onDownload,
      copyTextGenerator,
      downloadDataGenerator,
      width = 600,
      showCloseButton = true
   } = options;

   MySwal.fire({
      html: (
         <FlexibleAlert
            data={data}
            type={type}
            title={title}
            subtitle={subtitle}
            icon={icon}
            itemRenderer={itemRenderer}
            suggestion={suggestion}
            onCopy={onCopy}
            onDownload={onDownload}
            copyTextGenerator={copyTextGenerator}
            downloadDataGenerator={downloadDataGenerator}
         />
      ),
      width: width,
      padding: "0",
      background: "#fff",
      showConfirmButton: false,
      showCloseButton: showCloseButton,
      customClass: {
         container: "flexible-alert-container",
         popup: "flexible-alert-popup"
      }
   });
};

// Funciones de conveniencia para casos comunes
export const showDuplicatesAlert = (duplicates: string[]): void => {
   showFlexibleAlert(duplicates, { type: ALERT_TYPES.DUPLICATES });
};

export const showMetricsAlert = (metrics: Record<string, any>): void => {
   showFlexibleAlert(metrics, { type: ALERT_TYPES.METRICS });
};

export const showCustomAlert = (data: AlertData, customOptions: Omit<ShowAlertOptions, "type">): void => {
   showFlexibleAlert(data, { type: ALERT_TYPES.CUSTOM, ...customOptions });
};

// Exportar tipos y configuraciones para uso externo
// export type { AlertType, AlertData, AlertIcon, AlertConfig, FlexibleAlertProps, ShowAlertOptions };

export default showFlexibleAlert;

// import React from "react";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import Toast from "../utils/Toast";

// const MySwal = withReactContent(Swal);

// // Componente para la alerta de duplicados
// const DuplicatesAlert = ({ duplicates }) => {
//    // console.log("🚀 ~ DuplicatesAlert ~ duplicates:", duplicates);
//    const handleCopyList = async () => {
//       const textToCopy = duplicates.map((item, index) => `${index + 1}. ${item}`).join("\n");
//       const fullText = `ICCIDs DUPLICADOS (${duplicates.length} elementos):\n\n${textToCopy}`;

//       try {
//          await navigator.clipboard.writeText(fullText);
//          Toast.Success("Los ICCIDs duplicados se han copiado al portapapeles");
//          // MySwal.fire({
//          //    icon: "success",
//          //    title: "Listado copiado",
//          //    text: "Los ICCIDs duplicados se han copiado al portapapeles",
//          //    timer: 2000,
//          //    showConfirmButton: false
//          // });
//       } catch (error) {
//          console.error("Error al copiar:", error);
//       }
//    };

//    const handleDownloadExcel = () => {
//       const headers = ["Número", "ICCID", "Estado"];
//       const csvData = duplicates.map((item, index) => [(index + 1).toString(), `"${item}"`, "DUPLICADO"]);

//       const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       const timestamp = new Date().toISOString().split("T")[0];

//       link.setAttribute("href", url);
//       link.setAttribute("download", `iccds-duplicados-${timestamp}.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);

//       Toast.Success("El listado se ha descargado en formato CSV");
//       // MySwal.fire({
//       //    icon: "success",
//       //    title: "Excel descargado",
//       //    text: "El listado se ha descargado en formato CSV",
//       //    timer: 2000,
//       //    showConfirmButton: false
//       // });
//    };

//    return (
//       <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", padding: "8px" }}>
//          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #e8e8e8" }}>
//             <div
//                style={{
//                   width: "40px",
//                   height: "40px",
//                   background: "linear-gradient(135deg, #6F99CD 0%, #764ba2 100%)",
//                   borderRadius: "10px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   color: "white",
//                   fontSize: "18px",
//                   fontWeight: "bold"
//                }}
//             >
//                !
//             </div>
//             <div>
//                <h2 style={{ margin: 0, color: "#2d3748", fontSize: "18px", fontWeight: 600 }}>ICCIDs Duplicados</h2>
//                <p style={{ margin: "4px 0 0 0", color: "#718096", fontSize: "14px" }}>Se encontraron {duplicates.length} elementos repetidos</p>
//             </div>
//          </div>

//          {/* Botones de acción */}
//          <div style={{ display: "flex", gap: "12px", marginBottom: "16px", justifyContent: "flex-end" }}>
//             <button
//                onClick={handleCopyList}
//                style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   padding: "10px 16px",
//                   background: "#4299e1",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "8px",
//                   fontSize: "14px",
//                   fontWeight: 500,
//                   cursor: "pointer",
//                   transition: "all 0.2s ease"
//                }}
//                onMouseOver={(e) => (e.target.style.background = "#3182ce")}
//                onMouseOut={(e) => (e.target.style.background = "#4299e1")}
//             >
//                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                </svg>
//                Copiar Listado
//             </button>
//             <button
//                onClick={handleDownloadExcel}
//                style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   padding: "10px 16px",
//                   background: "#38a169",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "8px",
//                   fontSize: "14px",
//                   fontWeight: 500,
//                   cursor: "pointer",
//                   transition: "all 0.2s ease"
//                }}
//                onMouseOver={(e) => (e.target.style.background = "#2f855a")}
//                onMouseOut={(e) => (e.target.style.background = "#38a169")}
//             >
//                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                </svg>
//                Descargar Excel
//             </button>
//          </div>

//          <div
//             style={{
//                maxHeight: "300px",
//                overflowY: "auto",
//                background: "#f8fafc",
//                borderRadius: "12px",
//                padding: "16px",
//                border: "1px solid #e2e8f0"
//             }}
//          >
//             <ul
//                style={{
//                   margin: 0,
//                   padding: 0,
//                   listStyle: "none",
//                   display: "grid",
//                   gap: "8px"
//                }}
//             >
//                {duplicates.map((item, index) => (
//                   <li
//                      key={index}
//                      style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "12px",
//                         padding: "12px 16px",
//                         background: "white",
//                         borderRadius: "8px",
//                         border: "1px solid #edf2f7",
//                         transition: "all 0.2s ease",
//                         boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
//                      }}
//                      onMouseOver={(e) => {
//                         e.target.style.background = "#f7fafc";
//                         e.target.style.borderColor = "#cbd5e0";
//                      }}
//                      onMouseOut={(e) => {
//                         e.target.style.background = "white";
//                         e.target.style.borderColor = "#edf2f7";
//                      }}
//                   >
//                      <span
//                         style={{
//                            width: "24px",
//                            height: "24px",
//                            background: "#fed7d7",
//                            color: "#c53030",
//                            borderRadius: "6px",
//                            display: "flex",
//                            alignItems: "center",
//                            justifyContent: "center",
//                            fontSize: "12px",
//                            fontWeight: 600,
//                            flexShrink: 0
//                         }}
//                      >
//                         {index + 1}
//                      </span>
//                      <span
//                         style={{
//                            color: "#4a5568",
//                            fontFamily: "'Monaco', 'Consolas', monospace",
//                            fontSize: "14px",
//                            fontWeight: 500,
//                            letterSpacing: "0.5px"
//                         }}
//                      >
//                         {item}
//                      </span>
//                   </li>
//                ))}
//             </ul>
//          </div>

//          <div
//             style={{
//                marginTop: "20px",
//                padding: "12px 16px",
//                background: "#ebf8ff",
//                borderRadius: "8px",
//                borderLeft: "4px solid #4299e1"
//             }}
//          >
//             <p style={{ margin: 0, color: "#2b6cb0", fontSize: "13px", fontWeight: 500 }}>
//                💡 <strong>Sugerencia:</strong> Revise estos elementos antes de continuar
//             </p>
//          </div>
//       </div>
//    );
// };

// // Función para mostrar la alerta
// export const showDuplicatesAlert = (duplicates: any) => {
//    MySwal.fire({
//       html: <DuplicatesAlert duplicates={duplicates} />,
//       width: 600,
//       padding: "0",
//       background: "#fff",
//       showConfirmButton: false,
//       showCloseButton: true,
//       customClass: {
//          container: "duplicates-alert-container",
//          popup: "duplicates-alert-popup"
//       }
//    });
// };
// export default showDuplicatesAlert;
