// exportUtils.ts
import { utils, writeFile, WorkBook, WorkSheet } from "xlsx";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ChipData, TemplateType } from "./types";

// Instalar: npm install xlsx-js-style
import { styleSheet } from "xlsx-js-style";

// Exportar a Excel con diseño
export const exportToExcel = (chips: ChipData[], templateType: TemplateType) => {
   const workbook = utils.book_new();

   // Crear hoja con el diseño de plantilla
   const templateData = createStyledTemplate(chips, templateType);
   const worksheet = utils.aoa_to_sheet(templateData.data);

   // Aplicar estilos a las celdas
   applyStylesToWorksheet(worksheet, templateData.styles, templateData.merges);

   utils.book_append_sheet(workbook, worksheet, `Plantilla ${templateType}`);

   // Hoja adicional con datos crudos
   const dataWorksheet = utils.json_to_sheet(
      chips.map((chip, index) => ({
         "#": index + 1,
         ICCID: chip.iccid,
         "Número de Teléfono": chip.phoneNumber,
         "Fecha de Pre-activación": chip.preActivationDate,
         Estado: chip.status,
         Monto: `$${chip.amount}`
      }))
   );
   utils.book_append_sheet(workbook, dataWorksheet, "Datos");

   writeFile(workbook, `plantilla_chips_${templateType}_${new Date().getTime()}.xlsx`);
};

const createStyledTemplate = (chips: ChipData[], templateType: TemplateType) => {
   const config = {
      A4: { columns: 5, rows: 8, cellWidth: 25, cellHeight: 60 },
      TABLOIDE: { columns: 7, rows: 12, cellWidth: 20, cellHeight: 50 }
   };

   const { columns, rows, cellWidth, cellHeight } = config[templateType];
   const data: any[][] = [];
   const styles: { [key: string]: any } = {};
   const merges: { s: { r: number; c: number }; e: { r: number; c: number } }[] = [];

   let rowIndex = 0;

   for (let row = 0; row < rows; row++) {
      // Fila de encabezado (ACTIVA CON $50)
      const headerRow: any[] = [];
      for (let col = 0; col < columns; col++) {
         const chipIndex = row * columns + col;
         const chip = chips[chipIndex];
         headerRow.push(chip ? `ACTIVA CON $${chip.amount}` : "ACTIVA CON $50");

         // Estilo para celda de encabezado
         const cellAddress = utils.encode_cell({ r: rowIndex, c: col });
         styles[cellAddress] = {
            font: { bold: true, color: { rgb: "FF0000" }, sz: 12 },
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            fill: { fgColor: { rgb: "FFFFFF" } },
            border: {
               top: { style: "thin", color: { rgb: "000000" } },
               left: { style: "thin", color: { rgb: "000000" } },
               bottom: { style: "thin", color: { rgb: "000000" } },
               right: { style: "thin", color: { rgb: "000000" } }
            },
            height: 20
         };
      }
      data.push(headerRow);
      rowIndex++;

      // Fila de datos (información del chip)
      const dataRow: any[] = [];
      for (let col = 0; col < columns; col++) {
         const chipIndex = row * columns + col;
         const chip = chips[chipIndex];

         if (chip) {
            const chipText = `ICCID: ${chip.iccid}\nTEL: ${chip.phoneNumber}\nFECHA: ${chip.preActivationDate}\nEST: ${chip.status}`;
            dataRow.push(chipText);

            const cellAddress = utils.encode_cell({ r: rowIndex, c: col });
            styles[cellAddress] = {
               font: { sz: 8, color: { rgb: "000000" } },
               alignment: { horizontal: "left", vertical: "top", wrapText: true },
               fill: { fgColor: { rgb: "FFFFFF" } },
               border: {
                  top: { style: "thin", color: { rgb: "000000" } },
                  left: { style: "thin", color: { rgb: "000000" } },
                  bottom: { style: "thin", color: { rgb: "000000" } },
                  right: { style: "thin", color: { rgb: "000000" } }
               }
            };
         } else {
            dataRow.push("");
            const cellAddress = utils.encode_cell({ r: rowIndex, c: col });
            styles[cellAddress] = {
               fill: { fgColor: { rgb: "F0F0F0" } },
               border: {
                  top: { style: "thin", color: { rgb: "CCCCCC" } },
                  left: { style: "thin", color: { rgb: "CCCCCC" } },
                  bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                  right: { style: "thin", color: { rgb: "CCCCCC" } }
               }
            };
         }
      }
      data.push(dataRow);
      rowIndex++;

      // Fila vacía para separación
      const emptyRow: any[] = Array(columns).fill("");
      data.push(emptyRow);

      // Estilo para fila vacía
      for (let col = 0; col < columns; col++) {
         const cellAddress = utils.encode_cell({ r: rowIndex, c: col });
         styles[cellAddress] = {
            fill: { fgColor: { rgb: "FFFFFF" } },
            height: 5
         };
      }
      rowIndex++;
   }

   // Configurar anchos de columna
   if (!worksheet["!cols"]) worksheet["!cols"] = [];
   for (let i = 0; i < columns; i++) {
      worksheet["!cols"][i] = { width: cellWidth };
   }

   return { data, styles, merges };
};

const applyStylesToWorksheet = (worksheet: WorkSheet, styles: { [key: string]: any }, merges: any[]) => {
   // Aplicar estilos a cada celda
   Object.keys(styles).forEach((cellAddress) => {
      if (!worksheet[cellAddress]) {
         worksheet[cellAddress] = { v: "", t: "s" };
      }
      worksheet[cellAddress].s = styles[cellAddress];
   });

   // Aplicar merges si los hay
   if (merges.length > 0) {
      worksheet["!merges"] = merges;
   }
};

// Versión alternativa usando xlsx-js-style (más robusta para estilos)
// export const exportToExcelWithStyle = (chips: ChipData[], templateType: TemplateType) => {
//    const { data, styles } = createStyledTemplateV2(chips, templateType);

//    const workbook = styleSheet?.utils?.book_new() || utils.book_new();
//    const worksheet = styleSheet?.utils?.aoa_to_sheet(data) || utils.aoa_to_sheet(data);

//    // Aplicar estilos usando xlsx-js-style
//    if (styleSheet && styleSheet.utils) {
//       Object.keys(styles).forEach((address) => {
//          const cell = worksheet[address];
//          if (cell) {
//             cell.s = styles[address];
//          }
//       });
//    }

//    utils.book_append_sheet(workbook, worksheet, `Plantilla ${templateType}`);
//    writeFile(workbook, `plantilla_chips_${templateType}_${new Date().getTime()}.xlsx`);
// };
export const exportToExcelWithStyle = (chips: ChipData[], templateType: TemplateType) => {
   const { data, styles } = createStyledTemplateV2(chips, templateType);

   const workbook = XLSX.utils.book_new();
   const worksheet = XLSX.utils.aoa_to_sheet(data);

   Object.keys(styles).forEach((addr) => {
      if (worksheet[addr]) worksheet[addr].s = styles[addr];
   });

   XLSX.utils.book_append_sheet(workbook, worksheet, `Plantilla ${templateType}`);
   XLSX.writeFile(workbook, `plantilla_${templateType}.xlsx`);
};

// const createStyledTemplateV2 = (chips: ChipData[], templateType: TemplateType) => {
//    const config = {
//       A4: { columns: 5, rows: 8 },
//       TABLOIDE: { columns: 7, rows: 12 }
//    };

//    const { columns, rows } = config[templateType];
//    const data: any[][] = [];
//    const styles: { [key: string]: any } = {};

//    // Estilos base
//    const baseStyle = {
//       border: {
//          top: { style: "thin", color: { rgb: "000000" } },
//          left: { style: "thin", color: { rgb: "000000" } },
//          bottom: { style: "thin", color: { rgb: "000000" } },
//          right: { style: "thin", color: { rgb: "000000" } }
//       },
//       alignment: { vertical: "center", wrapText: true }
//    };

//    const headerStyle = {
//       ...baseStyle,
//       font: { bold: true, color: { rgb: "FF0000" }, sz: 11 },
//       alignment: { ...baseStyle.alignment, horizontal: "center" },
//       fill: { fgColor: { rgb: "FFFFFF" } }
//    };

//    const dataStyle = {
//       ...baseStyle,
//       font: { sz: 8, color: { rgb: "000000" } },
//       alignment: { ...baseStyle.alignment, horizontal: "left", vertical: "top" },
//       fill: { fgColor: { rgb: "FFFFFF" } }
//    };

//    const emptyStyle = {
//       ...baseStyle,
//       fill: { fgColor: { rgb: "F8F9FA" } },
//       border: {
//          top: { style: "thin", color: { rgb: "E0E0E0" } },
//          left: { style: "thin", color: { rgb: "E0E0E0" } },
//          bottom: { style: "thin", color: { rgb: "E0E0E0" } },
//          right: { style: "thin", color: { rgb: "E0E0E0" } }
//       }
//    };

//    let absoluteRow = 0;

//    for (let blockRow = 0; blockRow < rows; blockRow++) {
//       // Fila de título
//       const titleRow: any[] = [];
//       for (let col = 0; col < columns; col++) {
//          const chipIndex = blockRow * columns + col;
//          const chip = chips[chipIndex];
//          titleRow.push(chip ? `ACTIVA CON $${chip.amount}` : "ACTIVA CON $50");

//          const cellAddress = utils.encode_cell({ r: absoluteRow, c: col });
//          styles[cellAddress] = headerStyle;
//       }
//       data.push(titleRow);
//       absoluteRow++;

//       // Fila de datos
//       const dataRow: any[] = [];
//       for (let col = 0; col < columns; col++) {
//          const chipIndex = blockRow * columns + col;
//          const chip = chips[chipIndex];

//          if (chip) {
//             const chipText = `ICCID: ${chip.iccid}\nTEL: ${chip.phoneNumber}\nFECHA: ${chip.preActivationDate}\nEST: ${getStatusText(chip.status)}`;
//             dataRow.push(chipText);

//             const cellAddress = utils.encode_cell({ r: absoluteRow, c: col });
//             styles[cellAddress] = {
//                ...dataStyle,
//                fill: { fgColor: { rgb: getStatusColor(chip.status) } }
//             };
//          } else {
//             dataRow.push("");
//             const cellAddress = utils.encode_cell({ r: absoluteRow, c: col });
//             styles[cellAddress] = emptyStyle;
//          }
//       }
//       data.push(dataRow);
//       absoluteRow++;

//       // Fila de separación
//       if (blockRow < rows - 1) {
//          const separatorRow: any[] = Array(columns).fill("");
//          data.push(separatorRow);

//          for (let col = 0; col < columns; col++) {
//             const cellAddress = utils.encode_cell({ r: absoluteRow, c: col });
//             styles[cellAddress] = {
//                fill: { fgColor: { rgb: "FFFFFF" } }
//             };
//          }
//          absoluteRow++;
//       }
//    }

//    return { data, styles };
// };
import XLSX from "xlsx-js-style";

const createStyledTemplateV2 = (chips: ChipData[], templateType: TemplateType) => {
   const config = {
      A4: { columns: 7, rows: 12 },
      TABLOIDE: { columns: 8, rows: 15 }
   };

   const { columns, rows } = config[templateType];
   const data: any[][] = [];
   const styles: { [key: string]: any } = {};

   const blue = "00B0F0"; // color celeste del ejemplo
   const black = "000000";
   const white = "FFFFFF";

   const border = {
      top: { style: "thin", color: { rgb: black } },
      left: { style: "thin", color: { rgb: black } },
      bottom: { style: "thin", color: { rgb: black } },
      right: { style: "thin", color: { rgb: black } }
   };

   const headerStyle = {
      font: { bold: true, color: { rgb: white }, sz: 11 },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: blue } },
      border
   };

   const emptyStyle = {
      fill: { fgColor: { rgb: white } },
      border
   };

   let rowIndex = 0;

   for (let r = 0; r < rows; r++) {
      // Fila del texto “ACTIVA CON”
      const headerRow: any[] = [];
      for (let c = 0; c < columns; c++) {
         headerRow.push("ACTIVA CON");
         const addr = XLSX.utils.encode_cell({ r: rowIndex, c });
         styles[addr] = headerStyle;
      }
      data.push(headerRow);
      rowIndex++;

      // Fila del monto $50
      const amountRow: any[] = [];
      for (let c = 0; c < columns; c++) {
         amountRow.push("$50");
         const addr = XLSX.utils.encode_cell({ r: rowIndex, c });
         styles[addr] = headerStyle;
      }
      data.push(amountRow);
      rowIndex++;

      // Fila vacía (separación)
      const emptyRow: any[] = Array(columns).fill("");
      data.push(emptyRow);
      for (let c = 0; c < columns; c++) {
         const addr = XLSX.utils.encode_cell({ r: rowIndex, c });
         styles[addr] = emptyStyle;
      }
      rowIndex++;
   }

   return { data, styles };
};

const getStatusColor = (status: string): string => {
   switch (status) {
      case "Pre-activado":
         return "FFF3CD";
      case "Activado":
         return "D1ECF1";
      case "Pendiente":
         return "F8D7DA";
      default:
         return "FFFFFF";
   }
};

const getStatusText = (status: string): string => {
   switch (status) {
      case "Pre-activado":
         return "PRE-ACTIVADO";
      case "Activado":
         return "ACTIVADO";
      case "Pendiente":
         return "PENDIENTE";
      default:
         return status;
   }
};

// Exportar a PDF
export const exportToPDF = async (element: HTMLElement, templateType: TemplateType) => {
   try {
      const canvas = await html2canvas(element, {
         scale: 2,
         useCORS: true,
         logging: false,
         backgroundColor: "#ffffff",
         removeContainer: true
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
         orientation: templateType === "A4" ? "portrait" : "landscape",
         unit: "mm",
         format: templateType === "A4" ? "a4" : [432, 279]
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`plantilla_chips_${templateType}_${new Date().getTime()}.pdf`);
   } catch (error) {
      console.error("Error al exportar PDF:", error);
      throw new Error("No se pudo generar el PDF");
   }
};

// Función mejorada para exportar a Excel que prueba ambos métodos
export const exportToExcelWithDesign = (chips: ChipData[], templateType: TemplateType) => {
   try {
      // Intentar con xlsx-js-style si está disponible
      if (typeof styleSheet !== "undefined") {
         exportToExcelWithStyle(chips, templateType);
      } else {
         // Fallback a la versión básica
         exportToExcel(chips, templateType);
      }
   } catch (error) {
      console.error("Error en exportación Excel:", error);
      // Último fallback - exportación básica de datos
      const workbook = utils.book_new();
      const worksheet = utils.json_to_sheet(
         chips.map((chip, index) => ({
            "#": index + 1,
            ICCID: chip.iccid,
            Teléfono: chip.phoneNumber,
            Fecha: chip.preActivationDate,
            Estado: chip.status,
            Monto: `$${chip.amount}`,
            Plantilla: `ACTIVA CON $${chip.amount}`
         }))
      );
      utils.book_append_sheet(workbook, worksheet, "Datos de Chips");
      writeFile(workbook, `chips_${new Date().getTime()}.xlsx`);
   }
};
