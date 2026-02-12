import * as React from "react";
import {
   DataGrid,
   DEFAULT_GRID_AUTOSIZE_OPTIONS,
   GridColDef,
   GridSelectionModel,
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
   Box,
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
   Switch,
   TextField,
   Tooltip,
   Typography,
   useColorScheme,
   Grid,
   LinearProgress,
   CircularProgress
} from "@mui/material";
import { esES } from "@mui/x-data-grid/locales";
import { useAuthContext } from "../context/AuthContext";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../context/GlobalContext";
import Toast from "../utils/Toast";
import * as MuiIcons from "@mui/icons-material";

// const rows = [
//    { id: 1, lastName: new Date("2025/01/01"), firstName: "Jon", age: 14 },
//    { id: 2, lastName: new Date("2025/01/01"), firstName: "Cersei", age: 31 },
//    { id: 3, lastName: new Date("2025/01/01"), firstName: "Jaime", age: 31 },
//    { id: 4, lastName: new Date("2025/01/01"), firstName: "Arya", age: 11 },
//    { id: 5, lastName: new Date("2025/01/01"), firstName: "Daenerys", age: null },
//    { id: 6, lastName: new Date("2025/01/01"), firstName: null, age: 150 },
//    { id: 7, lastName: new Date("2025/01/01"), firstName: "Ferrara", age: 44 },
//    { id: 8, lastName: new Date("2025/01/01"), firstName: "Rossini", age: 36 },
//    { id: 9, lastName: new Date("2025/01/01"), firstName: "Harvey", age: 65 }
// ];

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

function CustomLoadingOverlay() {
   return <LinearProgress />;
}

import * as ReactDOM from "react-dom";
import { updateManyRows } from "../helpers/updateManyRows";
import { GridPinnedColumnFields } from "@mui/x-data-grid/internals";
import { AddCircle, Cancel, ExpandRounded, FileDownload, MoreVertRounded, Search, SyncTwoTone } from "@mui/icons-material";
import { JSX } from "react/jsx-runtime";
import { permission } from "process";

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

function CustomToolbar(
   btnAdd: boolean,
   handleClickAdd: any,
   handleClickRefresh: () => Promise<void>,
   StackColumnsAdjust: () => JSX.Element,
   selectedCount: GridSelectionModel,
   onDeleteSelected: () => void
) {
   // console.log("🚀 ~ CustomToolbar ~ selectedCount:", selectedCount);
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
         <Grid container width={"100%"} alignItems="center" justifyContent="space-between">
            <Grid size={{ xs: 2 }}>
               {/* {selectedCount > 0 && ( */}
               <Tooltip title={`Eliminar ${selectedCount?.ids?.size ?? 0} seleccionados`}>
                  <Button
                     hidden
                     color="error"
                     size="small"
                     sx={{ mr: 1 }}
                     onClick={onDeleteSelected}
                     startIcon={<MuiIcons.Delete fontSize="small" />}
                     disabled={selectedCount?.type === "include" ? selectedCount?.ids?.size === 0 : selectedCount?.ids?.size === "exclude" ? false : true}
                  >
                     Eliminar ({selectedCount?.ids?.size ?? 0})
                  </Button>
               </Tooltip>
               {/* )} */}
            </Grid>

            <Grid container justifyContent="flex-end" alignItems="center">
               <Tooltip title="Refrescar información">
                  <IconButton color="info" size="small" sx={{}} onClick={handleClickRefresh}>
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

               {btnAdd && (
                  <Tooltip title="Agregar Registro">
                     <IconButton color="success" size="small" sx={{}} onClick={handleClickAdd}>
                        <AddCircle />
                     </IconButton>
                  </Tooltip>
               )}
            </Grid>
         </Grid>
      </Toolbar>
   );
}
interface CustomToolbarWithSearchProps {
   btnAdd: boolean;
   handleClickAdd: any;
   handleClickRefresh: () => Promise<void>;
   StackColumnsAdjust: () => JSX.Element;
   selectedCount: GridSelectionModel;
   onDeleteSelected: () => void;
   isSearching: boolean;
   onSearch: (searchTerm: string) => void;
   onPageChange?: (page: number) => void;
   isServerPagination?: boolean;
   debounceTimeout?: number;
}

const CustomToolbarWithSearch: React.FC<CustomToolbarWithSearchProps> = ({
   btnAdd,
   handleClickAdd,
   handleClickRefresh,
   StackColumnsAdjust,
   selectedCount,
   onDeleteSelected,
   isSearching,
   onSearch,
   onPageChange,
   isServerPagination = false,
   debounceTimeout = 500
}) => {
   const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
   const exportMenuTriggerRef = React.useRef<HTMLButtonElement>(null);
   const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
   const [searchValue, setSearchValue] = React.useState("");
   const searchTimeoutRef = React.useRef<NodeJS.Timeout>(null);
   const handleClickColumnAdjust = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };
   const open = Boolean(anchorEl);
   const id = open ? "simple-popover" : undefined;

   // Estado para el término de búsqueda
   const [searchTerm, setSearchTerm] = React.useState("");

   // Timer para debounce
   // const searchTimeoutRef = React.useRef<NodeJS.Timeout>(null);

   // Función para manejar cambios en la búsqueda
   // const handleSearchChange = (value: string) => {
   //    setSearchTerm(value);
   //    setIsSearching(true);

   //    // Limpiar timeout anterior
   //    if (searchTimeoutRef.current) {
   //       clearTimeout(searchTimeoutRef.current);
   //    }

   //    // Configurar nuevo timeout para debounce (500ms)
   //    searchTimeoutRef.current = setTimeout(() => {
   //       if (onSearch) {
   //          // Cuando hay búsqueda, debería volver a página 1
   //          if (value.trim() !== "" && onPageChange) {
   //             onPageChange(1); // Ir a primera página
   //          }
   //          onSearch(value);
   //       }
   //       setIsSearching(false);
   //    }, 500);
   // };
   const handleSearchChange = (value: string) => {
      setSearchTerm(value);

      // Limpiar timeout anterior
      if (searchTimeoutRef.current) {
         clearTimeout(searchTimeoutRef.current);
      }

      // Configurar nuevo timeout para debounce
      searchTimeoutRef.current = setTimeout(() => {
         onSearch(value);
      }, debounceTimeout);
   };
   // const handleSearchChange = React.useCallback(
   //    (searchTerm: string) => {
   //       if (isServerPagination) {
   //          // Llamar a onSearch si existe
   //          if (onSearch) {
   //             onSearch(searchTerm);
   //          }
   //       } else {
   //          setClientSideSearchTerm(searchTerm);
   //       }
   //    },
   //    [isServerPagination, onSearch]
   // );
   const handleClearSearch = React.useCallback(() => {
      onSearch("");
      if (onPageChange && !isServerPagination) {
         onPageChange(1);
      }
   }, [isServerPagination, onSearch, onPageChange]);

   // Limpiar timeout al desmontar
   React.useEffect(() => {
      return () => {
         if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
         }
      };
   }, []);

   return (
      <Toolbar style={{}}>
         <Grid container width={"100%"} alignItems="center" justifyContent="space-between">
            <Grid size={{ xs: 2 }}>
               <Tooltip title={`Eliminar ${selectedCount?.ids?.size ?? 0} seleccionados`}>
                  <Button
                     hidden
                     color="error"
                     size="small"
                     sx={{ mr: 1 }}
                     onClick={onDeleteSelected}
                     startIcon={<MuiIcons.Delete fontSize="small" />}
                     disabled={selectedCount?.type === "include" ? selectedCount?.ids?.size === 0 : selectedCount?.ids?.size === "exclude" ? false : true}
                  >
                     Eliminar ({selectedCount?.ids?.size ?? 0})
                  </Button>
               </Tooltip>
            </Grid>

            <Grid container justifyContent="flex-end" alignItems="center">
               <Tooltip title="Refrescar información">
                  <IconButton color="info" size="small" sx={{}} onClick={handleClickRefresh}>
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
               </Menu>

               {/* Búsqueda personalizada que llama al servidor */}
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
                           value={searchValue}
                           onChange={(e) => handleSearchChange(e.target.value)}
                           slotProps={{
                              input: {
                                 startAdornment: (
                                    <InputAdornment position="start">
                                       <Search fontSize="small" />
                                    </InputAdornment>
                                 ),
                                 endAdornment: (
                                    <InputAdornment position="end">
                                       {isSearching ? (
                                          <CircularProgress size={16} />
                                       ) : searchTerm ? (
                                          <QuickFilterClear
                                             edge="end"
                                             size="small"
                                             aria-label="Clear search"
                                             material={{ sx: { marginRight: -0.75 } }}
                                             onClick={() => {
                                                handleSearchChange("");
                                                if (state.value && onSearch) {
                                                   onSearch("");
                                                }
                                             }}
                                          >
                                             <Cancel fontSize="small" />
                                          </QuickFilterClear>
                                       ) : null}
                                    </InputAdornment>
                                 ),
                                 ...controlProps.slotProps?.input
                              },
                              ...controlProps.slotProps
                           }}
                        />
                     )}
                  />
               </StyledQuickFilter>

               <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

               {btnAdd && (
                  <Tooltip title="Agregar Registro">
                     <IconButton color="success" size="small" sx={{}} onClick={handleClickAdd}>
                        <AddCircle />
                     </IconButton>
                  </Tooltip>
               )}
            </Grid>
         </Grid>
      </Toolbar>
   );
};

const RowActions = ({ params, singularName, indexColumnName = 2, handleClickDisEnable }) => {
   // console.log("🚀 ~ RowActions ~ params:", params.row);
   // console.log("🚀 ~ RowActions ~ params.columns:", params.columns);
   // console.log("🚀 ~ RowActions ~ params.columns[indexColumnName].field:", params.columns[indexColumnName].field);
   const { auth } = useAuthContext();

   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);
   const objName = params.columns[indexColumnName + 1].field;
   const id = params.row.id;
   const active = params.row.active;
   // console.log("🚀 ~ RowActions ~ objName:", objName);
   // console.log("🚀 ~ RowActions ~ active:", active)
   const actions = params.row.actions || [];

   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation(); // Evita que se seleccione la fila al hacer clic
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   interface MenuItemComponentProps {
      iconName: string;
      label: string;
      tooltip?: string;
      color?: string;
      permission: boolean;
      handleOnClick: () => void;
   }

   const MenuItemComponent: React.FC<MenuItemComponentProps> = ({ iconName, label, tooltip, handleOnClick, color, permission }) => {
      if (!permission) return;

      const IconComponent = MuiIcons[iconName as keyof typeof MuiIcons];

      return (
         <Tooltip title={tooltip} placement="right" arrow>
            <MenuItem
               onClick={() => {
                  handleOnClick();
                  handleClose();
               }}
               sx={{ color: color || "inherit" }}
            >
               {IconComponent && <IconComponent fontSize="small" sx={{ mr: 1 }} />}
               {label}
            </MenuItem>
         </Tooltip>
      );
   };

   return (
      <div className="">
         {auth.role_id === ROLE_SUPER_ADMIN && (
            <Tooltip title={active ? "Desactivar" : "Reactivar"} placement="left" arrow>
               <Button color="primary" onClick={() => handleClickDisEnable(id, objName, active)} sx={{ p: 0 }}>
                  <Switch checked={Boolean(active)} />
               </Button>
            </Tooltip>
         )}
         <IconButton aria-label="acciones" onClick={handleClick} size="small" hidden={actions.length === 0}>
            <MoreVertRounded />
         </IconButton>
         <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={(e) => e.stopPropagation()} // Evita cierre accidental
         >
            <Tooltip title={params.row[objName]} placement="top" arrow>
               <Typography px={2} fontWeight={"bold"}>
                  {singularName}: {String(params.row[objName]).length > 15 ? `${String(params.row[objName]).substring(0, 15)}...` : String(params.row[objName])}
               </Typography>
            </Tooltip>
            <Divider sx={{ mb: 2 }} />
            {actions.map((action: { label: string; iconName: string; tooltip: string; permission: boolean; handleOnClick: () => void; color: string }) => (
               <MenuItemComponent
                  key={action.label}
                  label={action.label || ""}
                  iconName={action.iconName}
                  tooltip={action.tooltip}
                  handleOnClick={action.handleOnClick}
                  color={action.color}
                  permission={action.permission}
               />
            ))}
         </Menu>
      </div>
   );
};

interface PaginationModel {
   page: number;
   pageSize: number;
}

interface PaginationInfo {
   current_page: number;
   total: number;
   per_page: number;
   last_page: number;
}

const mode = localStorage.getItem("mui-mode") || "light";
interface DataTableComponentProps {
   dataColumns: GridColDef[];
   data: any[];
   btnAdd?: boolean;
   handleClickAdd: any;
   handleClickEdit?: (params: any) => void;
   handleClickDisEnable?: (params: any) => void;
   refreshTable?: () => Promise<void>;
   singularName?: string;
   indexColumnName?: number;
   scrollHeight?: number | string;
   handleClickDeleteMultipleContinue?: (selectedIds: any[]) => Promise<void>;

   // Nuevas props para paginación
   pagination?: PaginationInfo;
   onPageChange?: (page: number) => void;
   onPageSizeChange?: (pageSize: number) => void;
   loading?: boolean;

   // Nueva prop para búsqueda en servidor
   onSearch?: (searchTerm: string) => void;
}
const DataTableComponent = ({
   dataColumns = [],
   data = [],
   btnAdd = false,
   handleClickAdd,
   handleClickEdit,
   handleClickDisEnable,
   refreshTable,
   singularName,
   indexColumnName,
   scrollHeight = 720,
   handleClickDeleteMultipleContinue,

   // Nuevas props
   pagination,
   onPageChange,
   onPageSizeChange,
   loading = false,

   // Props de búsqueda
   onSearch
}: DataTableComponentProps) => {
   // const { mode, setMode } = useColorScheme();
   const { setLoading } = useGlobalContext();
   const apiRef = useGridApiRef();
   const [anchorElActions, setAnchorElActions] = React.useState<HTMLButtonElement | null>(null);
   const openActions = Boolean(anchorElActions);
   const idActions = openActions ? "simple-popover" : undefined;

   const [isSearching, setIsSearching] = React.useState(false);

   // Nuevo para paginacion
   const [paginationModel, setPaginationModel] = React.useState<PaginationModel>({
      page: pagination?.current_page ? pagination.current_page - 1 : 0, // MUI usa base 0
      pageSize: pagination?.per_page || 100
   });

   // Efecto para sincronizar paginación externa
   React.useEffect(() => {
      if (pagination) {
         setPaginationModel({
            page: pagination.current_page - 1, // Convertir de base 1 a base 0
            pageSize: pagination.per_page
         });
      }
   }, [pagination]);

   const handlePaginationModelChange = (newModel: PaginationModel) => {
      setPaginationModel(newModel);

      if (isServerPagination) {
         // Modo servidor: notificar cambios
         if (onPageChange && newModel.page !== paginationModel.page) {
            onPageChange(newModel.page + 1); // Convertir a base 1
         }
         if (onPageSizeChange && newModel.pageSize !== paginationModel.pageSize) {
            onPageSizeChange(newModel.pageSize);
         }
      }
      // Modo local: no se necesita notificar, el DataGrid maneja la paginación automáticamente
   };

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
   const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

   const handleClickButtonsAction = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElActions(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorElActions(null);
   };

   const columns: GridColDef[] = React.useMemo(
      () => [
         {
            field: "actions",
            headerName: "Acciones",
            type: "actions",
            width: 100,
            pinnable: false,
            // cellClassName: "sticky-col",
            // headerClassName: "sticky-col-header",
            // renderCell: (params) => <div style={{ position: "sticky", left: 0, background: "white", zIndex: 1 }}>{params.value}</div>,
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

            getActions: (params) => [
               <RowActions params={params} key={params.id} indexColumnName={indexColumnName} handleClickDisEnable={handleClickDisEnable} singularName={singularName} />
            ],
            // Estilos para columna fija (opcional)
            cellClassName: `pinned-column px-0 ${mode == "light" ? "bg-[#f8fafc]/98" : "bg-[#0f172a]"}`,
            headerClassName: "pinned-column"
         },
         ...dataColumns
      ],
      []
   );

   const autosizeOptions = {
      includeHeaders,
      includeOutliers,
      outliersFactor: Number.isNaN(parseFloat(outliersFactor)) ? 1 : parseFloat(outliersFactor),
      expand
   };

   const isServerPagination = Boolean(pagination && onPageChange);
   const [internalSearching, setInternalSearching] = React.useState(false);
   const [clientSideSearchTerm, setClientSideSearchTerm] = React.useState("");
   const [localSearchTerm, setLocalSearchTerm] = React.useState("");
   const [filteredData, setFilteredData] = React.useState<any[]>(
      React.useMemo(() => {
         if (!isServerPagination && clientSideSearchTerm) {
            return data.filter((row) =>
               columns.some((column) => {
                  if (!column.field) return false;
                  const value = row[column.field];
                  if (value == null) return false;
                  return value.toString().toLowerCase().includes(clientSideSearchTerm.toLowerCase());
               })
            );
         }
         return data;
      }, [data, clientSideSearchTerm, isServerPagination, columns])
   );

   const debounceTimeout = isServerPagination ? 500 : 0;
   const actualIsSearching = isServerPagination ? isSearching : false;

   const StackColumnsAdjust = () => {
      return (
         <Stack spacing={1} direction="column" alignItems="center" sx={{ p: 1 }} useFlexGap flexWrap="wrap">
            <FormControlLabel
               sx={{ ml: 0 }}
               onClick={(event) => event.stopPropagation()}
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

   const handleClickRefresh = async () => {
      try {
         setIsLoading(true);
         if (refreshTable) await refreshTable();
         setIsLoading(false);
         apiRef.current?.autosizeColumns(autosizeOptions);
         Toast.Success("Tabla Actualizada");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleDeleteSelected = async () => {
      try {
         const ids = (selectionModel || []).map((id: any) => id);
         if (!ids || ids.length === 0) {
            Toast.Error("No hay registros seleccionados");
            return;
         }
         if (!handleClickDeleteMultipleContinue) {
            // Si no hay callback, solo mostrar ids en consola
            console.log("Selected IDs:", ids);
            return;
         }
         setIsLoading(true);
         await handleClickDeleteMultipleContinue(ids);
         setSelectionModel([]);
         setIsLoading(false);
         if (refreshTable) await refreshTable();
         Toast.Success("Acción aplicada a registros seleccionados");
      } catch (error) {
         console.log(error);
         setIsLoading(false);
         Toast.Error(error);
      }
   };

   // En la llamada a CustomToolbarWithSearch, pasamos diferentes callbacks según el modo
   // const handleSearch = isServerPagination && onSearch ? onSearch : setClientSideSearchTerm;
   const handleSearch = (searchTerm: string) => {
      if (onSearch) {
         // Búsqueda del servidor
         setInternalSearching(true);
         onSearch(searchTerm);
         setTimeout(() => setInternalSearching(false), 500);
      } else {
         // Búsqueda local
         setLocalSearchTerm(searchTerm);
         // Volver a la primera página cuando se busca
         setPaginationModel((prev) => ({ ...prev, page: 0 }));
      }
   };

   // TAL VEZ HAYA CAMBIOS AQUI....
   // React.useEffect(() => {
   //    setIsLoading(true);
   //    if (data.length > 0) {
   //       (async () => {
   //          setIsLoading(true);
   //          await Promise.resolve().then(() => {
   //             ReactDOM.flushSync(() => {
   //                updateManyRows(apiRef, data);
   //                setIsLoading(false);
   //             });
   //          });
   //          // await ReactDOM.flushSync(() => {
   //          //    updateManyRows(apiRef, data);
   //          //    setIsLoading(false);
   //          // });
   //          apiRef.current?.autosizeColumns(autosizeOptions);
   //       })();
   //    } else {
   //       setIsLoading(false);
   //    }
   // }, [data]); //[data, apiRef, autosizeOptions]);
   React.useEffect(() => {
      setIsLoading(true);
      if (filteredData.length > 0) {
         (async () => {
            await Promise.resolve().then(() => {
               ReactDOM.flushSync(() => {
                  updateManyRows(apiRef, filteredData);
                  setIsLoading(false);
               });
            });
            apiRef.current?.autosizeColumns(autosizeOptions);
         })();
      } else {
         setIsLoading(false);
      }
   }, [filteredData]);

   // Sincronizar paginación externa cuando está disponible
   React.useEffect(() => {
      if (pagination) {
         setPaginationModel({
            page: pagination.current_page - 1, // Convertir de base 1 a base 0
            pageSize: pagination.per_page
         });
      }
   }, [pagination]);
   // Filtrar datos localmente cuando no hay búsqueda del servidor
   React.useEffect(() => {
      if (!onSearch) {
         // Si no hay búsqueda del servidor, filtrar localmente
         if (localSearchTerm.trim() === "") {
            setFilteredData(data);
         } else {
            const filtered = data.filter((row) => Object.values(row).some((value) => value?.toString().toLowerCase().includes(localSearchTerm.toLowerCase())));
            setFilteredData(filtered);
         }
      } else {
         // Si hay búsqueda del servidor, usar los datos tal cual
         setFilteredData(data);
      }
   }, [data, localSearchTerm, onSearch]);

   React.useEffect(() => {
      // console.log("mode en la DT", mode);
   }, [mode]);

   return (
      <Box sx={{ height: scrollHeight, width: "100%" }}>
         <DataGrid
            sx={(theme) => ({
               border: 1,
               backgroundColor: "",
               "& .row-advertencia": {
                  backgroundColor: theme.palette.warning.light + " !important"
               },
               "& .row-peligro": {
                  backgroundColor: theme.palette.warning.dark + " !important",
                  color: theme.palette.getContrastText(theme.palette.warning.dark) + " !important"
               }
            })}
            apiRef={apiRef}
            getRowClassName={(params) => {
               try {
                  const val = String(params.row?.evaluations_rejected || "").toLowerCase();
                  if (val.includes("peligro")) return "row-peligro";
                  if (val.includes("advertencia")) return "row-advertencia";
               } catch (e) {
                  // ignore
               }
               return "";
            }}
            autosizeOptions={autosizeOptions}
            // scrollbarSize={1}
            showToolbar
            style={{
               backgroundColor: "#00000010"
               // border: "20px solid #000"
            }}
            rows={filteredData}
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
            // loading={isLoading}
            density="comfortable"
            getRowHeight={() => "auto"}
            autoPageSize={false}
            rowSelection={true}
            checkboxSelection
            selectionModel={selectionModel}
            onRowSelectionModelChange={(newModel) => setSelectionModel(newModel)}
            editMode={"row"}
            onCellEditStart={(e) => console.log("onRowEditStart", e)}
            onCellEditStop={(e) => console.log("onRowEditStop", e)}
            disableRowSelectionOnClick // Evita que al darle clic en cualquier parte del row se seleccione
            // Props de paginación
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            // pageSizeOptions={[5, 10, 100, { value: -1, label: "Todos" }]}
            pageSizeOptions={[5, 10, 25, 50, 100, 500]}
            // rowCount={pagination?.total || 0}
            rowCount={isServerPagination ? pagination?.total || 0 : filteredData.length}
            // paginationMode="server"
            paginationMode={isServerPagination ? "server" : "client"}
            loading={loading || isLoading || isSearching}
            //             btnAdd: boolean,
            // handleClickAdd: any,
            // handleClickRefresh: () => Promise<void>,
            // StackColumnsAdjust: () => JSX.Element,
            // selectedCount: GridSelectionModel,
            // onDeleteSelected: () => void,
            // isSearching: boolean,
            // setIsSearching: React.Dispatch<React.SetStateAction<boolean>>,
            // onSearchChange: (searchTerm: string) => void,
            // onPageChange?: (page: number) => void,
            // isServerPagination?: boolean,
            // debounceTimeout?: number
            slots={{
               noRowsOverlay: CustomNoRowsOverlay,
               noResultsOverlay: CustomNoRowsOverlay,
               // toolbar: () =>
               //    CustomToolbarWithSearch(
               //       btnAdd,
               //       handleClickAdd,
               //       handleClickRefresh,
               //       StackColumnsAdjust,
               //       selectionModel,
               //       handleDeleteSelected,
               //       isSearching,
               //       setIsSearching,
               //       onSear
               //       onSearch,
               //       onPageChange
               //    ),
               toolbar: () => (
                  <CustomToolbarWithSearch
                     btnAdd={btnAdd}
                     handleClickAdd={handleClickAdd}
                     handleClickRefresh={handleClickRefresh}
                     StackColumnsAdjust={StackColumnsAdjust}
                     selectedCount={selectionModel}
                     onDeleteSelected={handleDeleteSelected}
                     isSearching={internalSearching || isSearching}
                     onSearch={handleSearch}
                     onPageChange={onPageChange}
                     isServerPagination={isServerPagination}
                     debounceTimeout={debounceTimeout}
                  />
               ),

               // Agregar loading overlay personalizado si quieres
               loadingOverlay: CustomLoadingOverlay
            }}
            slotProps={{
               loadingOverlay: {
                  // variant: "indeterminate",
                  color: "primary"
               }
            }}
            // IMPORTANTE: Deshabilitar el quickFilter nativo cuando usamos paginación del servidor
            // porque solo busca en la página actual
            // quickFilterProps={{
            //    quickFilterParser: (searchInput: string) =>
            //       searchInput
            //          .split(" ")
            //          .filter((word) => word !== "")
            //          .map((word) => `"${word}"`)
            // }}
         />
      </Box>
   );
};
export default DataTableComponent;
