import { GridRowModel, GridApiCommon } from "@mui/x-data-grid";

export function updateManyRows(apiRef: React.MutableRefObject<GridApiCommon>, rows: GridRowModel[]) {
   if (!apiRef?.current) return;

   rows.forEach((row) => {
      apiRef.current.updateRows([row]);
   });
}
