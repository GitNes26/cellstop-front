import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
// import "datatables.net-dt/css/dataTables.dataTables.css";
// import "datatables.net-buttons-dt/css/buttons.dataTables.css";
// import "datatables.net-select-dt/css/select.dataTables.css";
import "datatables.net-select";
import "datatables.net-buttons";
import DataTable from "datatables.net-dt";
import Select from "datatables.net-select";
import { IconButton } from "@mui/material";

DataTable.use(Select);

interface Column {
   title: string;
   data: string;
   searchable?: boolean;
   orderable?: boolean;
}

interface DataTableProps {
   data?: any[];
   columns: Column[];
   serverSide?: boolean;
   ajaxUrl?: string; // si usamos paginado de Laravel
   onRowSelect?: (rows: any[]) => void;
   onActionClick?: (row: any) => void;
}

//#region /* DataTables */
/* const DT_CONFIG = {
   // responsive: true,
   language: {
      url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/es-mx.json"
   },
   columnDefs: [
      {
         className: "dt-center",
         targets: "_all"
      }
   ],
   buttons: [
      {
         extend: "excelHtml5",
         text: '<b><i class="fa-solid fa-file-excel"></i>&nbsp; Exportar a Excel</b>',
         className: "btn btn-success" // color verde estilo Bootstrap
      }
   ],
   dom: '<"row mb-2"B><"row"<"col-md-6 "lr> <"col-md-6"f> > rt <"row"<"col-md-6 "i> <"col-md-6"p> >',
   lengthMenu: [
      [5, 10, 50, 100, -1],
      [5, 10, 50, 100, "Todos"]
   ],
   pageLength: 10,
   deferRender: true,
   aaSorting: [] //deshabilitar ordenado automatico
};
$("table thead tr").clone(true).addClass("filters").appendTo("table thead");
DT_CONFIG.orderCellsTop = true;
DT_CONFIG.fixedHeader = true;
DT_CONFIG.initComplete = function () {
   var api = this.api();

   // For each column
   api.columns()
      .eq(0)
      .each(function (colIdx) {
         // Set the header cell to contain the input element
         var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
         var title = $(cell).text();
         $(cell).addClass("bb-primary");
         $(cell).html('<input type="search" class="form-control" placeholder="' + title + '" />');

         // On every keypress in this input
         var cursorPosition;
         $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
            .off("keyup change")
            .on("change", function (e) {
               // Get the search value
               $(this).attr("title", $(this).val());
               var regexr = "({search})"; //$(this).parents('th').find('select').val();

               cursorPosition = this.selectionStart;
               // Search the column for that value
               api.column(colIdx)
                  .search(this.value != "" ? regexr.replace("{search}", "(((" + this.value + ")))") : "", this.value != "", this.value == "")
                  .draw();
            })
            .on("keyup", function (e) {
               e.stopPropagation();

               $(this).trigger("change");
               $(this).focus()[0].setSelectionRange(cursorPosition, cursorPosition);
            });
      });
}; */

const DataTableComponent: React.FC<DataTableProps> = ({ data = [], columns = [], serverSide = false, ajaxUrl, onRowSelect, onActionClick }) => {
   const tableRef = useRef<HTMLTableElement>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      setLoading(true);

      if (!tableRef.current) return setLoading(false);

      if ($.fn.DataTable.isDataTable(tableRef.current)) {
         const dt = $(tableRef.current).DataTable();
         dt.clear();
         dt.rows.add(data);
         dt.draw();
         setLoading(false);
         return;
      }

      const dt = $(tableRef.current).DataTable({
         data: serverSide ? undefined : data,
         ajax: serverSide ? ajaxUrl : undefined,
         columns: [
            {
               title: "",
               data: null,
               defaultContent: "",
               orderable: false,
               className: "select-checkbox text-center"
            },
            ...columns,
            {
               title: "Acciones",
               data: null,
               orderable: false,
               className: "sticky right-0 bg-white shadow-sm",
               render: (data, type, row) => {
                  return `<div class="flex gap-2 justify-center">
                     <button class="px-2 py-1 bg-blue-500 text-white rounded btn-edit">Editar</button>
                     <button class="px-2 py-1 bg-red-500 text-white rounded btn-delete">Eliminar</button>
                  </div>`;
               }
            }
         ],
         // dom: '<"flex justify-between items-center mb-4"lfB>rtip',
         // dom: '<"row mb-2"B><"row"<"col-md-6 "lr> <"col-md-6"f> > rt <"row"<"col-md-6 "i> <"col-md-6"p> >',
         dom: `
            <"flex justify-between items-center mb-4"B>
               <"flex justify-between items-center mb-4"
                  <"flex-1"lr><"flex-1 text-right"f>
               >
               rt
               <"flex justify-between items-center mt-4"
                  <"flex-1"i><"flex-1 text-right"p>
               >
            `,
         select: {
            style: "multi",
            selector: "td:first-child"
         },
         buttons: [
            {
               extend: "excel",
               text: "Exportar Excel",
               className: "bg-green-500 text-white px-3 py-1 rounded"
            }
         ],
         responsive: true,
         language: {
            url: "https://cdn.datatables.net/plug-ins/2.3.7/i18n/es-MX.json"
         },
         initComplete: () => {
            setLoading(false);
         }
      });

      // Evento de cargando
      dt.on("processing.dt", (e, settings, processing) => {
         setLoading(processing);
      });

      // Evento selección múltiple
      dt.on("select deselect", () => {
         const selectedData = dt.rows({ selected: true }).data().toArray();
         if (onRowSelect) onRowSelect(selectedData);
      });

      // Evento click en acciones
      $(tableRef.current).on("click", ".btn-edit", function () {
         const rowData = dt.row($(this).closest("tr")).data();
         if (onActionClick) onActionClick(rowData);
      });

      $(tableRef.current).on("click", ".btn-delete", function () {
         const rowData = dt.row($(this).closest("tr")).data();
         if (onActionClick) onActionClick(rowData);
      });

      return () => {
         if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
         }
      };
   }, [data, serverSide, ajaxUrl]);

   return (
      <div className="w-full relative">
         {/* Toolbar superior */}
         <div className="flex justify-between items-center mb-4 border-2 shadow-md p-4 rounded-xl">
            <IconButton color="primary" onClick={() => alert("Agregar nuevo registro")}>
               <span className="material-icons">add</span>
            </IconButton>
            <button className="btn bg-green-600 px-4 py-2 rounded">+ Agregar registro</button>
            <input type="text" placeholder="Buscar..." className="border px-3 py-2 rounded w-1/3" />
            <div className="flex gap-2">
               <button
                  className="bg-gray-500 text-white px-3 py-2 rounded"
                  onClick={() => {
                     if ($.fn.DataTable.isDataTable(tableRef.current)) {
                        const dt = $(tableRef.current).DataTable();
                        serverSide ? dt.ajax.reload() : dt.clear().rows.add(data).draw();
                     }
                  }}
               >
                  Refrescar
               </button>
               <button className="bg-green-500 text-white px-3 py-2 rounded">Exportar</button>
            </div>
         </div>
         {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
               <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mb-2"></div>
                  <span className="text-blue-600 font-medium">Cargando datos...</span>
               </div>
            </div>
         )}
         <div className="overflow-x-auto relative">
            <table ref={tableRef} className="display w-full"></table>
         </div>
      </div>
   );
};

export default DataTableComponent;
