import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Toast from "../utils/Toast";

const MySwal = withReactContent(Swal);

// Componente para la alerta de duplicados
const DuplicatesAlert = ({ duplicates }) => {
   // console.log("🚀 ~ DuplicatesAlert ~ duplicates:", duplicates);
   const handleCopyList = async () => {
      const textToCopy = duplicates.map((item, index) => `${index + 1}. ${item}`).join("\n");
      const fullText = `ICCIDs DUPLICADOS (${duplicates.length} elementos):\n\n${textToCopy}`;

      try {
         await navigator.clipboard.writeText(fullText);
         Toast.Success("Los ICCIDs duplicados se han copiado al portapapeles");
         // MySwal.fire({
         //    icon: "success",
         //    title: "Listado copiado",
         //    text: "Los ICCIDs duplicados se han copiado al portapapeles",
         //    timer: 2000,
         //    showConfirmButton: false
         // });
      } catch (error) {
         console.error("Error al copiar:", error);
      }
   };

   const handleDownloadExcel = () => {
      const headers = ["Número", "ICCID", "Estado"];
      const csvData = duplicates.map((item, index) => [(index + 1).toString(), `"${item}"`, "DUPLICADO"]);

      const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().split("T")[0];

      link.setAttribute("href", url);
      link.setAttribute("download", `iccds-duplicados-${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      Toast.Success("El listado se ha descargado en formato CSV");
      // MySwal.fire({
      //    icon: "success",
      //    title: "Excel descargado",
      //    text: "El listado se ha descargado en formato CSV",
      //    timer: 2000,
      //    showConfirmButton: false
      // });
   };

   return (
      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", padding: "8px" }}>
         <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #e8e8e8" }}>
            <div
               style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "bold"
               }}
            >
               !
            </div>
            <div>
               <h2 style={{ margin: 0, color: "#2d3748", fontSize: "18px", fontWeight: 600 }}>ICCIDs Duplicados</h2>
               <p style={{ margin: "4px 0 0 0", color: "#718096", fontSize: "14px" }}>Se encontraron {duplicates.length} elementos repetidos</p>
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
               onMouseOver={(e) => (e.target.style.background = "#3182ce")}
               onMouseOut={(e) => (e.target.style.background = "#4299e1")}
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
               onMouseOver={(e) => (e.target.style.background = "#2f855a")}
               onMouseOut={(e) => (e.target.style.background = "#38a169")}
            >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               Descargar Excel
            </button>
         </div>

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
            <ul
               style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "grid",
                  gap: "8px"
               }}
            >
               {duplicates.map((item, index) => (
                  <li
                     key={index}
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
                     onMouseOver={(e) => {
                        e.target.style.background = "#f7fafc";
                        e.target.style.borderColor = "#cbd5e0";
                     }}
                     onMouseOut={(e) => {
                        e.target.style.background = "white";
                        e.target.style.borderColor = "#edf2f7";
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
                  </li>
               ))}
            </ul>
         </div>

         <div
            style={{
               marginTop: "20px",
               padding: "12px 16px",
               background: "#ebf8ff",
               borderRadius: "8px",
               borderLeft: "4px solid #4299e1"
            }}
         >
            <p style={{ margin: 0, color: "#2b6cb0", fontSize: "13px", fontWeight: 500 }}>
               💡 <strong>Sugerencia:</strong> Revise estos elementos antes de continuar
            </p>
         </div>
      </div>
   );
};

// Función para mostrar la alerta
export const showDuplicatesAlert = (duplicates: any) => {
   MySwal.fire({
      html: <DuplicatesAlert duplicates={duplicates} />,
      width: 600,
      padding: "0",
      background: "#fff",
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
         container: "duplicates-alert-container",
         popup: "duplicates-alert-popup"
      }
   });
};
export default showDuplicatesAlert;
