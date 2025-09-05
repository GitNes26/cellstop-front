import * as React from "react";
import Box from "@mui/material/Box";
import {
   DataGrid,
   DEFAULT_GRID_AUTOSIZE_OPTIONS,
   GridColDef,
   useGridApiRef,
   QuickFilter,
   QuickFilterControl,
   QuickFilterClear,
   QuickFilterTrigger,
   ToolbarButton,
   Toolbar,
   ColumnsPanelTrigger,
   GridViewColumnIcon,
   FilterPanelTrigger,
   GridFilterListIcon,
   ExportPrint,
   ExportCsv,
   GridSearchIcon
} from "@mui/x-data-grid";
// import { QuickFilter } from "@mui/x-data-grid/components";
import {
   Badge,
   Button,
   Checkbox,
   Divider,
   FormControlLabel,
   IconButton,
   InputAdornment,
   Menu,
   MenuItem,
   Popover,
   Stack,
   styled,
   TextField,
   Tooltip,
   Typography
} from "@mui/material";
import { esES } from "@mui/x-data-grid/locales";
import { useGlobalContext } from "../context/GlobalContext";
import Toast from "../utils/Toast";
import * as MuiIcons from "@mui/icons-material";

const rows = [
   { id: 1, lastName: new Date("2025/01/01"), firstName: "Jon", age: 14 },
   { id: 2, lastName: new Date("2025/01/01"), firstName: "Cersei", age: 31 },
   { id: 3, lastName: new Date("2025/01/01"), firstName: "Jaime", age: 31 },
   { id: 4, lastName: new Date("2025/01/01"), firstName: "Arya", age: 11 },
   { id: 5, lastName: new Date("2025/01/01"), firstName: "Daenerys", age: null },
   { id: 6, lastName: new Date("2025/01/01"), firstName: null, age: 150 },
   { id: 7, lastName: new Date("2025/01/01"), firstName: "Ferrara", age: 44 },
   { id: 8, lastName: new Date("2025/01/01"), firstName: "Rossini", age: 36 },
   { id: 9, lastName: new Date("2025/01/01"), firstName: "Harvey", age: 65 }
];

const StyledGridOverlay = styled("div")(({ theme }) => ({
   display: "flex",
   flexDirection: "column",
   alignItems: "center",
   justifyContent: "center",
   height: "100%",
   "& .no-rows-primary": {
      fill: "#3D4751",
      ...theme.applyStyles("light", {
         fill: "#3D424A"
      })
   },
   "& .no-rows-secondary": {
      fill: "#1D2126",
      ...theme.applyStyles("light", {
         fill: "#AEB8C2"
      })
   }
}));
function CustomNoRowsOverlay() {
   return (
      <StyledGridOverlay>
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={96} viewBox="0 0 452 257" aria-hidden focusable="false">
            <path
               className="no-rows-primary"
               d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
            />
            <path
               className="no-rows-primary"
               d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
            />
            <path
               className="no-rows-primary"
               d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
            />
            <path
               className="no-rows-secondary"
               d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
            />
         </svg>
         <Typography variant="body2" sx={{ mt: 2 }}>
            Sin Resultados
         </Typography>
      </StyledGridOverlay>
   );
}

// function renderRating(params) {
//    return <Rating readOnly value={params.value} />;
// }

// function useData(length) {
//    return React.useMemo(() => {
//       const names = ["Nike", "Adidas", "Puma", "Reebok", "Fila", "Lululemon Athletica Clothing", "Varley"];

//       const rows = Array.from({ length }).map((_, id) => ({
//          id,
//          brand: names[id % names.length],
//          rep: randomTraderName(),
//          rating: randomRating()
//       }));

//       const columns = [
//          { field: "id", headerName: "Brand ID" },
//          { field: "brand", headerName: "Brand name" },
//          { field: "rep", headerName: "Representative" },
//          {
//             field: "rating",
//             headerName: "Rating",
//             renderCell: renderRating,
//             display: "flex"
//          }
//       ];

//       return { rows, columns };
//    }, [length]);
// }
// import { GridData } from 'docsx/data/data-grid/virtualization/ColumnVirtualizationGrid';

function getFakeData(length: number): Promise<{ rows: any }> {
   return new Promise((resolve) => {
      setTimeout(() => {
         const names = ["Nike", "Adidas", "Puma", "Reebok", "Fila", "Lululemon Athletica Clothing", "Varley", "John", "Veny", "otro", "el Diez", "hola"];
         const rows = Array.from({ length }).map((_, id) => ({
            id,
            firstName: `Name ${names[id]}`,
            lastName: new Date(`2025/01/${id}`),
            age: names[id]
         }));
         console.log("🚀 ~ rows ~ rows:", rows);

         resolve({ rows });
      }, 1000);
   });
}

function sleep(ms: number) {
   return new Promise((resolve) => {
      setTimeout(resolve, ms);
   });
}
import * as ReactDOM from "react-dom";
import { updateManyRows } from "../helpers/updateManyRows";
import { GridPinnedColumnFields } from "@mui/x-data-grid/internals";
import { AddCircle, Cancel, ExpandRounded, FileDownload, MoreVertRounded, Search, SyncTwoTone } from "@mui/icons-material";
import { JSX } from "react/jsx-runtime";

type OwnerState = {
   expanded: boolean;
};

const StyledQuickFilter = styled(QuickFilter)({
   display: "grid",
   alignItems: "center"
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(({ theme, ownerState }) => ({
   gridArea: "1 / 1",
   width: "min-content",
   height: "min-content",
   zIndex: 1,
   opacity: ownerState.expanded ? 0 : 1,
   pointerEvents: ownerState.expanded ? "none" : "auto",
   transition: theme.transitions.create(["opacity"])
}));

const StyledTextField = styled(TextField)<{
   ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
   gridArea: "1 / 1",
   overflowX: "clip",
   width: ownerState.expanded ? 260 : "var(--trigger-width)",
   opacity: ownerState.expanded ? 1 : 0,
   transition: theme.transitions.create(["width", "opacity"])
}));

function CustomToolbar(fetchData: React.MouseEventHandler<HTMLButtonElement> | undefined, handleClickAdd: any, StackColumnsAdjust: () => JSX.Element) {
   const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
   const exportMenuTriggerRef = React.useRef<HTMLButtonElement>(null);

   const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

   const handleClickColumnAdjust = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const open = Boolean(anchorEl);
   const id = open ? "simple-popover" : undefined;

   return (
      <Toolbar style={{}}>
         <Tooltip title="Refrescar información">
            <IconButton color="info" size="small" sx={{}} onClick={fetchData}>
               <SyncTwoTone />
            </IconButton>
         </Tooltip>

         <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

         <Tooltip title="Ajustar Columnas">
            <IconButton aria-describedby={id} onClick={handleClickColumnAdjust}>
               <ExpandRounded rotate={"90deg"} fontSize="small" />
            </IconButton>
         </Tooltip>
         <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            disableRestoreFocus
            disableEscapeKeyDown={true}
            anchorOrigin={{
               vertical: "bottom",
               horizontal: "right"
            }}
            transformOrigin={{
               vertical: "top",
               horizontal: "right"
            }}
         >
            <StackColumnsAdjust />
         </Popover>

         <Tooltip title="Columnas">
            <ColumnsPanelTrigger render={<ToolbarButton />}>
               <GridViewColumnIcon fontSize="small" />
            </ColumnsPanelTrigger>
         </Tooltip>

         <Tooltip title="Filtros">
            <FilterPanelTrigger
               render={(props, state) => (
                  <ToolbarButton {...props} color="default">
                     <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                        <GridFilterListIcon fontSize="small" />
                     </Badge>
                  </ToolbarButton>
               )}
            />
         </Tooltip>

         <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

         <Tooltip title="Exportar">
            <ToolbarButton
               ref={exportMenuTriggerRef}
               id="export-menu-trigger"
               aria-controls="export-menu"
               aria-haspopup="true"
               aria-expanded={exportMenuOpen ? "true" : undefined}
               onClick={() => setExportMenuOpen(true)}
            >
               <FileDownload fontSize="small" />
            </ToolbarButton>
         </Tooltip>

         <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

         <Menu
            id="export-menu"
            anchorEl={exportMenuTriggerRef.current}
            open={exportMenuOpen}
            onClose={() => setExportMenuOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
               list: {
                  "aria-labelledby": "export-menu-trigger"
               }
            }}
         >
            <ExportPrint render={<MenuItem />} onClick={() => setExportMenuOpen(false)}>
               Imprimir
            </ExportPrint>
            <ExportCsv render={<MenuItem />} onClick={() => setExportMenuOpen(false)}>
               Descargar como CSV
            </ExportCsv>
            {/* Available to MUI X Premium users */}
            {/* <ExportExcel render={<MenuItem />}>
          Download as Excel
        </ExportExcel> */}
         </Menu>

         <StyledQuickFilter>
            <QuickFilterTrigger
               render={(triggerProps, state) => (
                  <Tooltip title="Buscar" enterDelay={0}>
                     <StyledToolbarButton {...triggerProps} ownerState={{ expanded: state.expanded }} color="default" aria-disabled={state.expanded}>
                        <GridSearchIcon fontSize="small" />
                     </StyledToolbarButton>
                  </Tooltip>
               )}
            />
            <QuickFilterControl
               render={({ ref, ...controlProps }, state) => (
                  <StyledTextField
                     {...controlProps}
                     ownerState={{ expanded: state.expanded }}
                     inputRef={ref}
                     aria-label="Buscar"
                     placeholder="Buscar..."
                     size="small"
                     slotProps={{
                        input: {
                           startAdornment: (
                              <InputAdornment position="start">
                                 <Search fontSize="small" />
                              </InputAdornment>
                           ),
                           endAdornment: state.value ? (
                              <InputAdornment position="end">
                                 <QuickFilterClear edge="end" size="small" aria-label="Clear search" material={{ sx: { marginRight: -0.75 } }}>
                                    <Cancel fontSize="small" />
                                 </QuickFilterClear>
                              </InputAdornment>
                           ) : null,
                           ...controlProps.slotProps?.input
                        },
                        ...controlProps.slotProps
                     }}
                  />
               )}
            />
         </StyledQuickFilter>

         <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

         <Tooltip title="Agregar Registro">
            <IconButton color="success" size="small" sx={{}} onClick={handleClickAdd}>
               <AddCircle />
            </IconButton>
         </Tooltip>
      </Toolbar>
   );
}

// import { makeStyles } from '@mui/styles';
// const useStyles = makeStyles({
//    pinnedColumn: {
//       position: "sticky",
//       left: 0,
//       backgroundColor: "#fff", // Fondo blanco para evitar transparencias
//       zIndex: 1,
//       boxShadow: "2px 0 5px -2px rgba(0,0,0,0.1)" // Sombra para separación visual
//    }
// });

const RowActions = ({ params }) => {
   console.log("🚀 ~ RowActions ~ params:", params);
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);

   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation(); // Evita que se seleccione la fila al hacer clic
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const MenuItemComponent = ({ label, iconName, handleOnClick }) => {
      const IconComponent = MuiIcons[iconName];

      return (
         <MenuItem
            onClick={() => {
               handleOnClick();
               handleClose();
            }}
         >
            {IconComponent && <IconComponent fontSize="small" sx={{ mr: 1 }} />}
            {label}
         </MenuItem>
      );
   };

   return (
      <div>
         <IconButton aria-label="acciones" onClick={handleClick} size="small">
            <MoreVertRounded />
         </IconButton>
         <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={(e) => e.stopPropagation()} // Evita cierre accidental
         >
            <Typography px={2}>{params.row.firstName}</Typography>
            <Divider sx={{ mb: 2 }} />
            <MenuItemComponent
               label="Editar"
               iconName="Edit"
               handleOnClick={() => {
                  alert(`Editar ${params.id}`);
               }}
            />
            <MenuItemComponent
               label="Eliminar"
               iconName="Delete"
               handleOnClick={() => {
                  alert(`Eliminar ${params.id}`);
               }}
            />
         </Menu>
      </div>
   );
};

interface DataTableComponentProps {
   dataColumns: GridColDef[];
   data: any[];
   handleClickAdd: any;
   scrollHeight?: number | string;
}
const DataTableComponent = ({ dataColumns = [], data, handleClickAdd, scrollHeight = 720 }: DataTableComponentProps) => {
   const { setLoading } = useGlobalContext();
   const apiRef = useGridApiRef();
   const [anchorElActions, setAnchorElActions] = React.useState<HTMLButtonElement | null>(null);
   const openActions = Boolean(anchorElActions);
   const idActions = openActions ? "simple-popover" : undefined;

   // const classes = useStyles();
   // const data = useData(100);

   const [pinnedColumns, setPinnedColumns] = React.useState<GridPinnedColumnFields>({
      left: ["actions"]
   });
   const [includeHeaders, setIncludeHeaders] = React.useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.includeHeaders);
   const [includeOutliers, setExcludeOutliers] = React.useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.includeOutliers);
   const [outliersFactor, setOutliersFactor] = React.useState(String(DEFAULT_GRID_AUTOSIZE_OPTIONS.outliersFactor));
   const [expand, setExpand] = React.useState((DEFAULT_GRID_AUTOSIZE_OPTIONS.expand = true));
   const [isLoading, setIsLoading] = React.useState(false);

   const handleClickButtonsAction = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElActions(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorElActions(null);
   };

   const columns: GridColDef[] = React.useMemo(
      () => [
         ...dataColumns,
         {
            field: "actions",
            headerName: "Acciones",
            type: "actions",
            width: 100,
            pinnable: false,
            style: {
               position: "sticky",
               left: 0,
               backgroundColor: "#fff", // Fondo blanco para evitar transparencias
               zIndex: 1,
               boxShadow: "2px 0 5px -2px rgba(0,0,0,0.1)" // Sombra para separación visual
            },

            // cellClassName: {
            //    position: "sticky",
            //    left: 0,
            //    backgroundColor: "#fff", // Fondo blanco para evitar transparencias
            //    zIndex: 1,
            //    boxShadow: "2px 0 5px -2px rgba(0,0,0,0.1)" // Sombra para separación visual
            // },
            //classes.pinnedColumn, // Fija esta columna

            getActions: (params) => [<RowActions params={params} key={params.id} />],
            // Estilos para columna fija (opcional)
            cellClassName: "pinned-column",
            headerClassName: "pinned-column"
         }
      ],
      []
   );

   const autosizeOptions = {
      includeHeaders,
      includeOutliers,
      outliersFactor: Number.isNaN(parseFloat(outliersFactor)) ? 1 : parseFloat(outliersFactor),
      expand
   };

   const StackColumnsAdjust = () => {
      return (
         <Stack spacing={1} direction="column" alignItems="center" sx={{ p: 1 }} useFlexGap flexWrap="wrap">
            <FormControlLabel
               sx={{ ml: 0 }}
               control={<Checkbox checked={includeHeaders} onChange={(ev) => setIncludeHeaders(ev.target.checked)} />}
               label="Incluir Titulos"
            />
            <FormControlLabel
               sx={{ ml: 0 }}
               control={<Checkbox checked={includeOutliers} onChange={(event) => setExcludeOutliers(event.target.checked)} />}
               label="Incluir valor de factor"
            />
            <TextField size="small" label="Valor de factor" value={outliersFactor} onChange={(ev) => setOutliersFactor(ev.target.value)} sx={{ width: "12ch" }} />
            <FormControlLabel sx={{ ml: 0 }} control={<Checkbox checked={expand} onChange={(ev) => setExpand(ev.target.checked)} />} label="Expandir" />

            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

            <Button variant="outlined" onClick={() => apiRef.current?.autosizeColumns(autosizeOptions)}>
               Ajustar Columnas
            </Button>
         </Stack>
      );
   };

   const fetchData = React.useCallback(async () => {
      setIsLoading(true);
      await ReactDOM.flushSync(() => {
         setIsLoading(false);
         updateManyRows(apiRef, data); // aquí 'data' es el array que recibes por parámetro
      });
      apiRef.current?.autosizeColumns(autosizeOptions);
      //    getFakeData(10)
      //       .then((data) => {
      //          ReactDOM.flushSync(() => {
      //             setIsLoading(false);
      //             console.log("data.rows", data.rows);
      //             updateManyRows(apiRef, data.rows);
      //             // apiRef.current?.updateRows(data.rows);
      //          });
      //       })
      //       // `sleep`/`setTimeout` is required because `.updateRows` is an
      //       // async function throttled to avoid choking on frequent changes.
      //       .then(() => sleep(0))
      //       .then(() => apiRef.current?.autosizeColumns(autosizeOptions));
   }, [apiRef, data, autosizeOptions]);

   // React.useEffect(() => {
   //    fetchData();
   // }, [fetchData]);

   const handleClickRefresh = async () => {
      try {
         setLoading(true);
         if (refreshTable) await refreshTable();
         setLoading(false);
         Toast.Success("Tabla Actualizada");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   return (
      <Box sx={{ height: scrollHeight, width: "100%" }}>
         <DataGrid
            sx={{ border: 1, backgroundColor: "" }}
            apiRef={apiRef}
            autosizeOptions={autosizeOptions}
            // scrollbarSize={1}
            showToolbar
            style={{
               backgroundColor: "#00000010"
            }}
            rows={data}
            columns={columns}
            // pinnedColumns={pinnedColumns}
            // columnVisibilityModel={{
            //    id: false
            // }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            initialState={{
               columns: { columnVisibilityModel: { id: false } }
               // pinnedColumns: { left: ["firstName"], right: ["actions"] },
            }}
            loading={isLoading}
            density="comfortable"
            getRowHeight={() => "auto"}
            autoPageSize={false}
            pageSizeOptions={[5, 10, 100, { value: -1, label: "Todos" }]}
            rowSelection={true}
            checkboxSelection //Muestra la columna de checks
            editMode={"row"}
            onCellEditStart={(e) => console.log("onRowEditStart", e)}
            onCellEditStop={(e) => console.log("onRowEditStop", e)}
            disableRowSelectionOnClick // Evita que al darle clic en cualquier parte del row se seleccione
            slots={{
               noRowsOverlay: CustomNoRowsOverlay,
               noResultsOverlay: CustomNoRowsOverlay,
               toolbar: () => CustomToolbar(fetchData, handleClickAdd, StackColumnsAdjust)
            }}
         />
      </Box>
   );
};
export default DataTableComponent;

// import React, { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// // import "primereact/resources/primereact.min.css"; // PrimeReact CSS
// // import "primereact/resources/themes/lara-dark-indigo/theme.css";
// // import "primeicons/primeicons.css";
// // import "../../assets/styles/styles-dt-headers-filters.css";
// // import { Button as Btn } from "primereact/button";

// // import { DataTable } from "primereact/datatable";
// // import { Column, ColumnBodyOptions } from "primereact/column";
// // import { InputText } from "primereact/inputtext";
// // import { InputNumber } from "primereact/inputnumber";
// // import { Dropdown } from "primereact/dropdown";
// // import { Tag } from "primereact/tag";
// // import { Button, ButtonGroup, Card, IconButton, Tooltip } from "@mui/material";
// // import { IconEdit, IconFile, IconFileSpreadsheet, IconPlus, IconSearch } from "@tabler/icons";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// // import { FilterMatchMode, FilterOperator } from "primereact/api";
// import { Box } from "@mui/system";
// import { AddCircleOutlineOutlined } from "@mui/icons-material";

// // import withReactContent from "sweetalert2-react-content";
// // import Swal from "sweetalert2";
// // import { QuestionAlertConfig } from "../utils/sAlert";
// import Toast from "../../utils/Toast";
// // import IconDelete from "./icons/IconDelete";
// // import { Toolbar } from "primereact/toolbar";
// // import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// import * as XLSX from "xlsx";
// import { isMobile } from "react-device-detect";
// import Button from "./Button";
// import { Card, IconButton, Tooltip } from "@mui/material";
// import icons from "../../constant/icons";
// import { useParams } from "react-router-dom";
// import { useGlobalContext } from "../../context/GlobalContext";
// import { getKeys } from "../../utils/Formats";
// import { bool } from "@techstark/opencv-js";

// /* COMO IMPROTAR
// *    dataColumns={columns}
//          data={data}
//          globalFilterFields={globalFilterFields}
//          headerFilters={false}
//          handleClickAdd={handleClickAdd}
//          refreshTable={getUsers}
//          btnAdd={true}
//          showGridlines={false}
//          btnsExport={true}
//          rowEdit={false}
//          // handleClickDeleteContinue={handleClickDeleteContinue}
//          // ELIMINAR MULTIPLES REGISTROS
//          btnDeleteMultiple={false}
//          // handleClickDeleteMultipleContinue={handleClickDeleteMultipleContinue}
//          // PARA HACER FORMULARIO EN LA TABLA
//          // AGREGAR
//          // createData={createUser}
//          // newRow={newRow}
//          // EDITAR
//          // setData={setUsers}
//          // updateData={updateUser}
//       />
// */

// /* FUNCIONES DE COMPLEMENTO
// *  FUNCION PARA ELIMINAR MULTIPLES REGISTROS
//    const handleClickDeleteContinue = async (selectedData) => {
//       try {
//          let ids = selectedData.map((d) => d.id);
//          if (ids.length < 1) console.log("no hay registros");
//          let msg = `¿Estas seguro de eliminar `;
//          if (selectedData.length === 1) msg += `al familiar registrado como tu ${selectedData[0].relationship}?`;
//          else if (selectedData.length > 1) msg += `a los familiares registrados como tu ${selectedData.map((d) => d.relationship)}?`;
//          mySwal.fire(QuestionAlertConfig(msg)).then(async (result) => {
//             if (result.isConfirmed) {
//                setLoadingAction(true);
//                const axiosResponse = await deleteFamily(ids);
//                setLoadingAction(false);
//                Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
//             }
//          });
//       } catch (error) {
//          console.log(error);
//          Toast.Error(error);
//       }
//    };
// */

// interface DataTableComponentProps {
//    idName?: string;
//    columns: Array<{
//       filterField: string | undefined;
//       body: ReactNode | ((data: any, options: ColumnBodyOptions) => ReactNode);
//       field: string;
//       header: string;
//       sortable?: boolean;
//       filter?: boolean;
//       functionEdit?: Function;
//       width?: string;
//    }>;
//    globalFilterFields: string[];
//    defaultGlobalFilter?: string;
//    data: any[];
//    setData: (data: any[]) => void;
//    headerFilters?: boolean;
//    rowEdit?: boolean;
//    handleClickAdd?: () => void;
//    createData?: (newData: any, folio?: any) => Promise<any>;
//    onRowEditCompleteContinue?: (newData: any) => void;
//    toolBar?: boolean;
//    toolbarContentStart?: JSX.Element;
//    toolbarContentCenter?: JSX.Element;
//    toolbarContentEnd?: JSX.Element;
//    updateData?: (newData: any, folio?: any) => Promise<any>;
//    refreshTable?: () => Promise<void>;
//    btnAdd?: boolean;
//    titleBtnAdd?: string;
//    newRow?: any;
//    btnsExport?: boolean;
//    fileNameExport?: string;
//    showGridlines?: boolean;
//    btnDeleteMultiple?: boolean;
//    handleClickDeleteMultipleContinue?: (selectedData: any[]) => Promise<void>;
//    scrollHeight?: string;
//    showLoading?: boolean;
// }

// /**
//  * DataTableComponent
//  *
//  * Componente que muestra una tabla con funcionalidades avanzadas como edición en línea, exportación de datos, filtros globales y herramientas de barra.
//  *
//  * @param {string} [idName='table'] - El ID del componente de tabla.
//  * @param {Array} columns - Definición de columnas, incluyendo los campos y encabezados.
//  * @param {Array} globalFilterFields - Campos a los que aplica el filtro global.
//  * @param {Array} data - Datos a mostrar en la tabla.
//  * @param {function} setData - Función para actualizar los datos de la tabla.
//  * @param {boolean} [headerFilters=true] - Indica si los filtros se muestran en la cabecera.
//  * @param {boolean} [rowEdit=false] - Define si el modo de edición es por fila.
//  * @param {function} handleClickAdd - Acción para añadir nuevas filas.
//  * @param {function} createData - Función para crear nuevos registros.
//  * @param {function} onRowEditCompleteContinue - Acción a ejecutar tras completar la edición de una fila.
//  * @param {boolean} [toolBar=false] - Indica si se muestra la barra de herramientas.
//  * @param {JSX.Element} toolbarContentStart - Contenido inicial de la barra de herramientas.
//  * @param {JSX.Element} toolbarContentCenter - Contenido central de la barra de herramientas.
//  * @param {JSX.Element} toolbarContentEnd - Contenido final de la barra de herramientas.
//  * @param {function} updateData - Función para actualizar registros existentes.
//  * @param {function} refreshTable - Función para refrescar los datos de la tabla.
//  * @param {boolean} [btnAdd=true] - Indica si se muestra el botón de añadir.
//  * @param {string} titleBtnAdd - Título del botón de añadir.
//  * @param {any} newRow - Objeto que representa una nueva fila para añadir.
//  * @param {boolean} [btnsExport=true] - Indica si se muestran los botones de exportación.
//  * @param {string} [fileNameExport="datos"] - Indica el nombre del archivo a exportar (NO incluir extensión de arhcivo).
//  * @param {boolean} [showGridlines=false] - Define si se muestran las líneas de la cuadrícula.
//  * @param {boolean} [btnDeleteMultiple=false] - Indica si se muestra la opción de eliminar múltiples registros.
//  * @param {function} handleClickDeleteMultipleContinue - Acción a ejecutar al eliminar múltiples registros.
//  * @param {string} [scrollHeight='65vh'] - Altura de scroll para la tabla.
//  * @param {boolean} [showLoading=false] - Mostrar un cargando desde una propiedad.
//  */

// export const DataTableComponent: React.FC<DataTableComponentProps> = ({
//    idName = "table",
//    columns,
//    globalFilterFields,
//    defaultGlobalFilter = null,
//    data,
//    setData,
//    headerFilters = true,
//    rowEdit = false,
//    handleClickAdd,
//    createData,
//    onRowEditCompleteContinue = null,
//    toolBar = false,
//    toolbarContentStart,
//    toolbarContentCenter,
//    toolbarContentEnd,
//    updateData,
//    refreshTable,
//    btnAdd = true,
//    titleBtnAdd = null,
//    newRow = null,
//    btnsExport = true,
//    showGridlines = false,
//    btnDeleteMultiple = false,
//    handleClickDeleteMultipleContinue,
//    scrollHeight = "65vh",
//    fileNameExport = "datos",
//    showLoading = false
// }) => {
//    const { folio } = useParams();
//    // const { setLoadingAction, setOpenDialog } = useGlobalContext();
//    const [selectedData, setSelectedData] = useState<any[]>([]);
//    const [updating, setUpdating] = useState(false);
//    const [updatingIndex, setUpdatingIndex] = useState(null);
//    const [selectedProduct, setSelectedProduct] = useState(null);
//    // const [theme, setTheme] = useState(localStorage.getItem("theme"));
//    // const [themeColor, setThemeColor] = useState({ bg: theme == "dif" ? "#E9ECEF" : "#141B24", text: theme == "dif" ? "dark" : "whitesmoke" });
//    // const colorHeader = { bg: theme == "dif" ? "#E9ECEF" : "#141B24", text: theme == "dif" ? "dark" : "whitesmoke" };
//    const { colorTableHeader, setColorTableHeader } = useGlobalContext();

//    const [showModal, setShowModal] = useState(false);
//    const [selectedCols, setSelectedCols] = useState<string[]>([]);
//    const [customLabels, setCustomLabels] = useState<{ [key: string]: string }>({});
//    const [titleFileExport, setTitleFileExport] = useState(fileNameExport);
//    const [dataColumns, setDataColumns] = useState(data);

//    const dt: any = useRef(null);
//    // columns.unshift({ id: 0, label: "Selecciona una opción..." });

//    // FILTROS
//    let filtersColumns: any;
//    filtersColumns = columns.map((c) => [c.field, { value: null, matchMode: FilterMatchMode.CONTAINS }]);
//    filtersColumns = Object.fromEntries(filtersColumns);
//    filtersColumns.global = { value: defaultGlobalFilter, matchMode: FilterMatchMode.CONTAINS };
//    const [filters, setFilters] = useState(filtersColumns);
//    const [loading, setLoading] = useState(false);
//    const [globalFilterValue, setGlobalFilterValue] = useState("");
//    // FILTROS

//    const getSeverity = (value: any) => {
//       switch (value) {
//          case "INSTOCK":
//             return "success";

//          case "LOWSTOCK":
//             return "warning";

//          case "OUTOFSTOCK":
//             return "danger";

//          default:
//             return null;
//       }
//    };
//    const [updateTrigger, setUpdateTrigger] = useState(0);

//    const forceUpdate = () => {
//       console.log("🚀 ~ forceUpdate ~ forceUpdate:");
//       setUpdateTrigger((prev) => prev + 1);
//    };
//    const addRow = () => {
//       // console.log("data", data);
//       // console.log("newRow", newRow);

//       if (!newRow) {
//          console.error("newRow no está definido");
//          return;
//       }

//       let _data = [...data];
//       _data.unshift(newRow); // Agregar la nueva fila al principio
//       setData(_data);
//       // forceUpdate();
//       // setData((prevData: any) => [...prevData, newRow]); // Cambia la referencia del array
//       // setData((prev: any) => [...prev, newRow]);

//       // forceUpdate();
//       // Intentar seleccionar y editar la primera celda
//       setTimeout(() => {
//          const tbody: any = document.querySelector(`#${idName} tbody`);
//          console.log("🚀 ~ setTimeout ~ tbody:", tbody);
//          if (tbody && tbody.childNodes.length > 0) {
//             const firstRow = tbody.childNodes[0];
//             firstRow.querySelector("button")?.click();
//          }
//       }, 500);
//    };
//    // useEffect(() => {
//    //    console.log("🚀 DataTable ~ data:", data);
//    // }, [data, setData]);

//    const handleOnRowEditIinit = (e: any) => {
//       console.log("🚀 ~ handleOnRowEditIinit ~ handleOnRowEditIinit: inicia la edicion?");
//       setUpdating(true);
//       setUpdatingIndex(e.index);
//       const firtsColumn = e.originalEvent.target.closest("tr").childNodes[1];
//       firtsColumn.querySelector(".p-inputtext");
//    };
//    const handleOnRowEditCancel = (e: any) => {
//       setUpdating(false);
//       setUpdatingIndex(null);
//       const dataSelected = e.data;
//       if (dataSelected.relationship == "" && dataSelected.age == "" && dataSelected.occupation == "" && dataSelected.monthly_income == null) {
//          let _data = data.filter((val) => val.id !== dataSelected.id);
//          setData(_data);
//       }
//    };

//    const onRowEditComplete = async (e: any) => {
//       try {
//          // console.log(e);
//          // console.log(data);
//          let _data = [...data];
//          let { newData, index } = e;

//          _data[index] = newData;

//          setData(_data);
//          // onRowEditCompleteContinue(newData);
//          const newNewData = newData;
//          delete newNewData.actions;
//          let ajaxResponse: any;
//          if (newNewData.id > 0) {
//             if (updateData) ajaxResponse = await updateData(newNewData, folio);
//          } else {
//             if (createData) ajaxResponse = await createData(newNewData, folio);
//          }
//          Toast.Customizable(ajaxResponse.alert_text, ajaxResponse.alert_icon);
//          setUpdating(false);
//          setUpdatingIndex(null);
//       } catch (error) {
//          console.log(error);
//          Toast.Error(error);
//          setUpdating(false);
//          setUpdatingIndex(null);
//       }
//    };

//    // const textEditor = (options) => {
//    //    return <InputText type="text" value={options.value} onChange={(e:any) => options.editorCallback(e.target.value)} />;
//    // };

//    // const statusEditor = (options) => {
//    //    return (
//    //       <Dropdown
//    //          value={options.value}
//    //          options={statuses}
//    //          onChange={(e:any) => options.editorCallback(e.value)}
//    //          placeholder="Select a Status"
//    //          itemTemplate={(option) => {
//    //             return <Tag value={option} severity={getSeverity(option)}></Tag>;
//    //          }}
//    //       />
//    //    );
//    // };

//    // const priceEditor = (options) => {
//    //    return <InputNumber value={options.value} onValueChange={(e:any) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" />;
//    // };

//    //#region EXPORTAR
//    const exportColumns = columns.map((col) => {
//       if (col.field !== "actions") return { title: col.header, dataKey: col.field };
//    });

//    // const exportCSV = (selectionOnly: any) => {
//    //    if (dt.current) dt.current.exportCSV({ selectionOnly });
//    // };

//    const exportPdf = async () => {
//       import("jspdf").then((jsPDF) => {
//          import("jspdf-autotable").then(() => {
//          import Loading from './Loading';
// const doc = new jsPDF.default("portrait", "px");

//             doc.autoTable(exportColumns, data);
//             doc.save("data.pdf");
//          });
//       });
//    };

//    const handleClickOpenModalExport = () => {
//       if (data.length === 0) {
//          Toast.Info("No hay datos para exportar.");
//          return;
//       }

//       const { actions, ...newDataByColumns } = data[0];
//       setDataColumns(getKeys(newDataByColumns));

//       setShowModal(true);
//    };
//    const handleClickExportData = (e: any) => {
//       // console.log("🚀 ~ onGlobalFilterChange ~ globalFilterFields:", globalFilterFields);
//       // console.log("🚀 ~ onGlobalFilterChange ~ filtersColumns:", filtersColumns);
//       // console.log("🚀 ~ onGlobalFilterChange ~ filters:", filters);
//       // // Obtener los datos filtrados aplicando los filtros actuales
//       // const filteredData = data.filter((rowData) => {
//       //    return Object.keys(filters).every((key) => {
//       //       const filterValue = filters[key].value;
//       //       if (!filterValue) return true;

//       //       const rowValue = rowData[key];
//       //       return rowValue?.toString().toLowerCase().includes(filterValue.toLowerCase());
//       //    });
//       // });
//       // console.log("🚀 ~ filteredData ~ filteredData:", filteredData);

//       // if (filteredData.length === 0) {
//       //    Toast.Info("No hay datos filtrados para exportar.");
//       //    return;
//       // }

//       // delete data[0].actions;
//       // console.log("🚀 ~ exportExcel ~ data:", data[0]);

//       if (selectedCols.length === 0) {
//          Toast.Info("Selecciona al menos una columna para exportar.");
//          return;
//       }

//       const exportData = data.map((row) => {
//          const filtered: { [key: string]: any } = {};
//          selectedCols.forEach((col) => {
//             let [prop, subprop] = col.split(".");
//             const label = customLabels[col] || col;
//             filtered[label] = subprop === undefined ? row[prop] : row[prop]?.[subprop];
//          });
//          return filtered;
//       });

//       const worksheet = XLSX.utils.json_to_sheet(exportData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja 1");
//       XLSX.writeFile(workbook, `${titleFileExport}.xlsx`);

//       setShowModal(false);
//    };

//    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
//       if (e.target.checked) {
//          setSelectedCols([...selectedCols, key]);
//       } else {
//          setSelectedCols(selectedCols.filter((col) => col !== key));
//       }
//    };
//    //#endregion EXPORTAR

//    const onGlobalFilterChange = (e: any) => {
//       try {
//          let value = e.target.value;
//          // console.log("buscador", value);
//          if (value === undefined || value === null) value = "";
//          let _filters = { ...filters };

//          _filters["global"].value = value;

//          setFilters(_filters);
//          setGlobalFilterValue(value);
//       } catch (error) {
//          console.log(error);
//          Toast.Error(error);
//       }
//    };

//    const handleClickRefresh = async () => {
//       try {
//          setLoading(true);
//          if (refreshTable) await refreshTable();
//          setLoading(false);
//          Toast.Success("Tabla Actualizada");
//       } catch (error) {
//          console.log(error);
//          Toast.Error(error);
//       }
//    };
//    const confirmDeleteSelected = () => {
//       console.log("click en confirmSelecteds");
//       // setDeleteDataDialog(true);
//    };
//    const leftToolbarTemplate = () => {
//       return (
//          <div className="flex flex-wrap gap-2">
//             {/* <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} /> */}
//             <Button
//                // variant="contained"
//                color="error"
//                startIcon={<i className="pi pi-trash"></i>}
//                onClick={confirmDeleteSelected} /* disabled={!selectedData || !selectedData.length} */
//             >
//                Eliminar Seleccionados
//             </Button>
//          </div>
//       );
//    };

//    const handleClickDeleteMultiple = async () => {
//       // console.log(selectedData);
//       if (handleClickDeleteMultipleContinue) await handleClickDeleteMultipleContinue(selectedData);
//       setSelectedData([]);
//    };

//    const header = (
//       <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", alignItems: "center" }}>
//          {btnDeleteMultiple && (
//             <Tooltip title="Eliminar Seleccionados" placement="top">
//                <span>
//                   <IconButton
//                      type="button"
//                      color="error"
//                      onClick={handleClickDeleteMultiple}
//                      disabled={!selectedData || !selectedData.length}
//                      sx={{ borderRadius: "12px", mr: 1 }}
//                   >
//                      <i className="pi pi-trash"></i>
//                   </IconButton>
//                </span>
//             </Tooltip>
//          )}

//          {btnsExport && (
//             <>
//                <Tooltip title="Exportar a Excel" placement="top">
//                   <IconButton type="button" color="success" sx={{ borderRadius: "12px", mr: 1 }} onClick={handleClickOpenModalExport}>
//                      {<icons.Tb.TbFileSpreadsheet />}
//                   </IconButton>
//                </Tooltip>

//                {/* <Tooltip title="Exportar a PDF" placement="top">
//                   <IconButton type="button" variant="text" color="error" sx={{ borderRadius: "12px", mr: 1 }} onClick={exportPdf}>
//                      <PictureAsPdfIcon />
//                   </IconButton>
//                </Tooltip> */}
//             </>
//          )}

//          <Tooltip title="Refrescar Tabla" placement="top">
//             <IconButton
//                type="button"
//                color="secondary"
//                sx={{ borderRadius: "12px", mr: 1 }}
//                onClick={handleClickRefresh}
//                className="duration-500 rotate-0 active:rotate-180 active:transition-all"
//             >
//                <icons.Ri.RiRefreshLine />
//                {/* <i className="pi pi-refetch"></i> */}
//             </IconButton>
//          </Tooltip>
//          <span className="p-input-icon-left">
//             <i className="pi pi-search" />
//             <InputText value={globalFilterValue} type="search" onChange={onGlobalFilterChange} placeholder="Buscador General" />
//          </span>
//          {btnAdd && (
//             <Tooltip title={titleBtnAdd ? `AGREGAR ${titleBtnAdd}` : "AGREGAR"} placement="top">
//                {isMobile ? (
//                   <IconButton
//                      color="secondary"
//                      /* sx={{ backgroundColor: colorPrimaryMain }} */ disabled={updating}
//                      onClick={() => (rowEdit ? addRow() : handleClickAdd ? handleClickAdd() : null)}
//                   >
//                      {<icons.Tb.TbPlus />}
//                   </IconButton>
//                ) : (
//                   <div className="">
//                      <Button
//                         variant="solid"
//                         // className={`w-[250px]`}
//                         startIcon={<AddCircleOutlineOutlined sx={{ mr: 0.2, mb: -1.5 }} />}
//                         size="md"
//                         disabled={updating}
//                         onClick={() => (rowEdit ? addRow() : handleClickAdd ? handleClickAdd() : null)}
//                      >
//                         {titleBtnAdd ? titleBtnAdd : "AGREGAR"}
//                      </Button>
//                   </div>
//                )}
//             </Tooltip>
//          )}
//       </Box>
//    );

//    useEffect(() => {
//       // setLoading(true);
//       // console.log(data);
//       // if (data.length > 0) setGlobalFilterFields(Object.keys(data[0]));
//       // setLoading(false);
//    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

//    useEffect(() => {
//       // console.log("🚀 ~ useEffect ~ window.innerWidth:", window.innerWidth);
//    }, [window]);
//    // let rowIndex = 0;

//    return (
//       <div className="card p-fluid card-table-container">
//          {/* <Tooltip target=".export-buttons>button" position="bottom" /> */}
//          <Card sx={{ borderRadius: 3 }}>
//             {toolBar && (
//                <Toolbar
//                   className="mb-4"
//                   start={toolbarContentStart}
//                   center={toolbarContentCenter}
//                   end={toolbarContentEnd}
//                   style={{ marginBottom: "1px", paddingBlock: "10px", zIndex: 10 }}
//                ></Toolbar>
//             )}

//             <DataTable
//                id={idName}
//                name={idName}
//                ref={dt}
//                style={{ borderRadius: "20px", zIndex: 10 }}
//                stripedRows
//                onLoadedDataCapture={() => console.log("onLoadedDataCapture")}
//                onLoad={() => console.log("onLoad")}
//                onLoadStart={() => console.log("onLoadStart")}
//                onLoadedData={() => console.log("onLoadedData")}
//                onEnded={() => console.log("onEnded")}
//                // rowHover
//                showGridlines={showGridlines}
//                removableSort
//                size="small"
//                value={data}
//                editMode="row"
//                header={header}
//                dataKey="key"
//                paginator
//                rowsPerPageOptions={[5, 10, 50, 100, 1000]}
//                rows={10}
//                loading={showLoading || loading}
//                filters={filters}
//                scrollable={true}
//                scrollHeight={scrollHeight}
//                globalFilter={globalFilterValue}
//                globalFilterFields={globalFilterFields}
//                filterDisplay={headerFilters ? "row" : "menu"}
//                tableStyle={{ minWidth: "5rem" }}
//                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
//                emptyMessage="No se encontraron registros."
//                currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} registros"
//                // selectionMode="single"
//                selection={selectedData}
//                onSelectionChange={(e: any) => setSelectedData(e.value)}
//                onRowEditComplete={onRowEditComplete}
//                onRowEditInit={handleOnRowEditIinit}
//                onRowEditCancel={handleOnRowEditCancel}
//                metaKeySelection={true}
//                className="z-[10] hover:bg-slate-500"
//             >
//                {btnDeleteMultiple && <Column selectionMode="multiple" exportable={false}></Column>}
//                {columns.map((col, index) => {
//                   // console.log("🚀 ~ rowIndex:", rowIndex);
//                   // const textMuted = ["", null, undefined].includes(data[rowIndex]?.id);
//                   // console.log("🚀 ~ textMuted:", textMuted);
//                   // if (col.field == "id") rowIndex++;
//                   // console.log("🚀 ~ {columns.map ~ col:", col);
//                   // console.log("🚀 ~ {columns.map ~ data:", data[rowIndex]);
//                   return (
//                      <Column
//                         key={index}
//                         field={col.field}
//                         header={col.header}
//                         headerStyle={{ /*backgroundColor: colorTableHeader.bg, color: colorTableHeader.text,*/ textAlign: "center" }}
//                         headerClassName="text-center"
//                         filter={col.filter && headerFilters}
//                         filterField={col.filterField}
//                         filterHeaderStyle={
//                            {
//                               /*backgroundColor: colorTableHeader.bg, color: colorTableHeader.text,*/
//                            }
//                         }
//                         filterHeaderClassName="custom-filter-header"
//                         editor={(options) => {
//                            if (col.functionEdit) return col.functionEdit(options);
//                         }}
//                         sortable={col.sortable}
//                         body={col.body}
//                         style={{ minWidth: col.width ? col.width : col.filter ? "12rem" : "auto" }}
//                         // bodyClassName={["", null, undefined].includes(col["field"]) && !updating && "text-slate-700"}
//                         footerStyle={
//                            {
//                               /*backgroundColor: colorTableHeader.bg, color: colorTableHeader.text,*/
//                            }
//                         }
//                      ></Column>
//                   );
//                })}
//                {rowEdit ? (
//                   <Column
//                      rowEditor
//                      // headerStyle={{ width: "10%", minWidth: "8rem" }}
//                      headerStyle={{ backgroundColor: colorTableHeader.bg, color: colorTableHeader.text, textAlign: "center" }}
//                      headerClassName="text-center"
//                      filter={false}
//                      filterHeaderStyle={
//                         {
//                            /*backgroundColor: colorTableHeader.bg, color: colorTableHeader.text,*/
//                         }
//                      }
//                      bodyStyle={{ textAlign: "center" }}
//                   ></Column>
//                ) : (
//                   <Column
//                      // key={`key-${index}`}
//                      field={"actions"}
//                      header={"Acciones"}
//                      headerClassName="text-center"
//                      headerStyle={{ /*backgroundColor: colorTableHeader.bg, color: colorTableHeader.text,*/ textAlign: "center" }}
//                      filterHeaderStyle={
//                         {
//                            /*backgroundColor: colorTableHeader.bg, color: colorTableHeader.text,*/
//                         }
//                      }
//                      // // editor={(options) => col.functionEdit(options)}
//                      // // body={col.body}
//                      sortable={false}
//                      bodyStyle={{ textAlign: "center" }}
//                      filter={false}
//                      style={{ width: "auto" }}
//                      footerStyle={
//                         {
//                            /*backgroundColor: colorTableHeader.bg, color: colorTableHeader.text,*/
//                         }
//                      }
//                      alignFrozen="right"
//                      frozen={window.innerWidth > 900 ? true : false}
//                   ></Column>
//                )}
//             </DataTable>
//          </Card>

//          {/* Modal Seleccionar columnas */}
//          {showModal && (
//             <>
//                <input type="checkbox" id="modal-export" className="modal-toggle" checked={showModal} onChange={() => setShowModal(!showModal)} />
//                <div className="modal">
//                   <div className="w-11/12 max-w-5xl modal-box">
//                      <label className="flex items-center gap-2 mb-2 input input-bordered">
//                         <b>Titulo del Archivo:</b>
//                         <input
//                            type="text"
//                            className="grow"
//                            placeholder={"Escribe el nombre del archivo"}
//                            value={titleFileExport || ""}
//                            onChange={(e) => setTitleFileExport(e.currentTarget.value)}
//                         />
//                      </label>
//                      <h3 className="text-lg font-bold">Seleccionar columnas para exportar</h3>
//                      <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3 max-h-[65vh] overflow-auto p-2">
//                         {dataColumns.map((key) => (
//                            <label key={key} className="flex items-center gap-2">
//                               <input
//                                  type="checkbox"
//                                  className="checkbox checkbox-sm"
//                                  checked={selectedCols.includes(key)}
//                                  onChange={(e) => handleCheckboxChange(e, key)}
//                               />
//                               <input
//                                  type="text"
//                                  className="w-full input input-bordered input-sm"
//                                  placeholder={key}
//                                  value={customLabels[key] || ""}
//                                  onChange={(e) => setCustomLabels({ ...customLabels, [key]: e.target.value })}
//                                  disabled={!selectedCols.includes(key)}
//                               />
//                            </label>
//                         ))}
//                      </div>

//                      <div className="modal-action">
//                         <button className="btn btn-outline" onClick={() => setShowModal(false)}>
//                            Cancelar
//                         </button>
//                         <button className="btn btn-success" onClick={handleClickExportData}>
//                            Exportar
//                         </button>
//                      </div>
//                   </div>
//                </div>
//             </>
//          )}
//       </div>
//    );
// };
// export default DataTableComponent;
