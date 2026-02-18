import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
// import "datatables.net-select-dt/css/select.dataTables.css";
// import "datatables.net-select";
import "datatables.net-buttons";
import DataTable from "datatables.net-dt";
import Select from "datatables.net-select";

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

const DataTableComponent: React.FC<DataTableProps> = ({ data = [], columns = [], serverSide = false, ajaxUrl, onRowSelect, onActionClick }) => {
   const tableRef = useRef<HTMLTableElement>(null);

   useEffect(() => {
      if (!tableRef.current) return;

      const dt = $(tableRef.current).DataTable({
         data: serverSide ? undefined : data,
         ajax: serverSide ? ajaxUrl : undefined,
         columns: [
            {
               title: "",
               data: null,
               defaultContent: "",
               orderable: false,
               className: "select-checkbox"
            },
            ...columns,
            {
               title: "Acciones",
               data: null,
               orderable: false,
               render: (data, type, row) => {
                  return `<button class="btn-action">Editar</button>`;
               }
            }
         ],
         dom: '<"flex justify-between items-center mb-4"lfB>rtip',
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
         }

         // language: {
         //    search: "Buscar:",
         //    lengthMenu: "Mostrar _MENU_ registros",
         //    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
         //    paginate: {
         //       previous: "Anterior",
         //       next: "Siguiente",
         //       first: "",
         //       last: ""
         //    }
         // }
      });

      // Evento selección múltiple
      dt.on("select deselect", () => {
         const selectedData = dt.rows({ selected: true }).data().toArray();
         if (onRowSelect) onRowSelect(selectedData);
      });

      // Evento click en acciones
      $(tableRef.current).on("click", ".btn-action", function () {
         const rowData = dt.row($(this).closest("tr")).data();
         if (onActionClick) onActionClick(rowData);
      });

      // return () => {
      //    dt.destroy(true);
      // };
      return () => {
         if ($.fn.DataTable.isDataTable(tableRef.current)) {
            dt.destroy();
         }
      };
   }, [data, serverSide, ajaxUrl]);

   return (
      <div className="w-full">
         {/* Toolbar superior */}
         <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
               <button className="bg-blue-500 text-white px-3 py-1 rounded">Filtro extra</button>
               <button className="bg-gray-500 text-white px-3 py-1 rounded">Otro botón</button>
            </div>
            <input type="text" placeholder="Filtro global..." className="border px-2 py-1 rounded" />
         </div>

         <table ref={tableRef} className="display w-full"></table>
      </div>
   );
};

export default DataTableComponent;
