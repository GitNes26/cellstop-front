// import * as React from "react";
import React, { useEffect, useRef, useState } from "react";

import { useFormikContext, FormikValues } from "formik";
import {
   Grid,
   Card,
   CardHeader,
   List,
   ListItemButton,
   ListItemText,
   ListItemIcon,
   Checkbox,
   Button,
   Divider,
   SxProps,
   Box,
   TextField,
   InputAdornment
} from "@mui/material";
import { Theme } from "@emotion/react";
import { KeyboardArrowLeftRounded, KeyboardArrowRightRounded, Search } from "@mui/icons-material";

interface ChipItem {
   id: number;
   label: string;
   location_status: string;
   folio: number;
}
interface TransferListProps {
   xsOffset?: number | null;
   col: number;
   sizeCols?: { xs: number; sm: number; md: number };
   idNameLeft: string;
   idNameRight: string;
   labelLeft: string;
   labelRight: string;
   heightList: number | string | null;
   sx?: SxProps<Theme>;
   disabled?: boolean;
   data: ChipItem[];
   handleClickLeft?: () => void | null;
   handleClickRight?: () => void | null;
}

function not(a: readonly number[], b: readonly number[]) {
   return a.filter((value) => !b.includes(value));
}

function intersection(a: readonly number[], b: readonly number[]) {
   return a.filter((value) => b.includes(value));
}

function union(a: readonly number[], b: readonly number[]) {
   return [...a, ...not(b, a)];
}

const TransferList: React.FC<TransferListProps> = ({
   xsOffset = null,
   col,
   sizeCols = { xs: 12, sm: 12, md: col },
   idNameLeft,
   idNameRight,
   labelLeft,
   labelRight,
   heightList = 430,
   sx,
   disabled = false,
   data = [],
   handleClickLeft = null,
   handleClickRight = null
}) => {
   const formik = useFormikContext<FormikValues>();
   const [checked, setChecked] = React.useState<readonly number[]>([]);
   // Inicialmente vacíos; se sincronizan con Formik/data en useEffect
   const [left, setLeft] = React.useState<readonly number[]>([]);
   const [right, setRight] = React.useState<readonly number[]>([]);
   const [searchLeft, setSearchLeft] = useState("");
   const [searchRight, setSearchRight] = useState("");

   const leftChecked = intersection(checked, left);
   const rightChecked = intersection(checked, right);

   const handleToggle = (value: number) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
      currentIndex === -1 ? newChecked.push(value) : newChecked.splice(currentIndex, 1);
      setChecked(newChecked);
   };

   const numberOfChecked = (items: readonly number[]) => intersection(checked, items).length;

   const handleToggleAll = (items: readonly number[]) => () => {
      numberOfChecked(items) === items.length ? setChecked(not(checked, items)) : setChecked(union(checked, items));
   };

   const handleCheckedRight = () => {
      const newRight = right.concat(leftChecked);
      const newLeft = not(left, leftChecked);
      setRight(newRight);
      setLeft(newLeft);
      setChecked(not(checked, leftChecked));
      formik.setFieldValue(idNameLeft, newLeft);
      formik.setFieldValue(idNameRight, newRight);
      if (handleClickRight) handleClickRight();
   };

   const handleCheckedLeft = () => {
      const newLeft = left.concat(rightChecked);
      const newRight = not(right, rightChecked);
      setLeft(newLeft);
      setRight(newRight);
      setChecked(not(checked, rightChecked));
      formik.setFieldValue(idNameLeft, newLeft);
      formik.setFieldValue(idNameRight, newRight);
      if (handleClickLeft) handleClickLeft();
   };

   const filterChips = (chips: ChipItem[], search: string) => {
      // console.log("🚀 ~ filterChips ~ search:", search);
      // console.log("🚀 ~ filterChips ~ chips:", chips);
      if (!search) return chips;
      return chips.filter((chip) => chip.label.toLowerCase().includes(search.toLowerCase()) || chip.location_status?.toLowerCase().includes(search.toLowerCase()));
   };

   useEffect(() => {
      const availableIds = data.map((d) => d.id);
      const formLeft = (formik.values[idNameLeft] || availableIds) as number[];
      const formRight = (formik.values[idNameRight] || []) as number[];

      setLeft(formLeft.filter((id) => availableIds.includes(id)));
      setRight(formRight.filter((id) => availableIds.includes(id)));

      if (!formik.values[idNameLeft]) formik.setFieldValue(idNameLeft, formLeft);
      if (!formik.values[idNameRight]) formik.setFieldValue(idNameRight, formRight);
   }, [formik.values, data]);

   const customList = (title: string, items: readonly number[], search: string, setSearch: (value: string) => void) => {
      // console.log("🚀 ~ customList ~ items:", items);
      const dataItems: ChipItem[] = data.filter((d) => items.includes(d.id));
      // console.log("🚀 ~ customList ~ dataItems:", dataItems);
      const filteredItems = filterChips(dataItems, search);
      // console.log("🚀 ~ customList ~ filteredItems:", filteredItems);

      return (
         <Card sx={{ width: "100%", ...sx }}>
            <CardHeader
               sx={{ px: 2, py: 1 }}
               avatar={
                  <Checkbox
                     onClick={handleToggleAll(items)}
                     checked={numberOfChecked(items) === items.length && items.length !== 0}
                     indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                     disabled={items.length === 0 || disabled}
                     inputProps={{ "aria-label": "todos los artículos seleccionados" }}
                  />
               }
               title={title}
               subheader={`${numberOfChecked(items)}/${items.length} seleccionado(s)`}
            />
            <Box sx={{ px: 2, pt: 0, pb: 1 }}>
               <TextField
                  fullWidth
                  size="small"
                  placeholder="Buscar chips..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={disabled}
                  slotProps={{
                     input: {
                        startAdornment: (
                           <InputAdornment position="start">
                              <Search fontSize="small" />
                           </InputAdornment>
                        )
                     }
                  }}
               />
            </Box>
            <Divider />
            <List sx={{ width: "100%", height: heightList, bgcolor: "background.paper", overflow: "auto" }} dense component="div" role="list">
               {items.map((value) => (
                  <ListItemButton key={value} role="listitem" onClick={handleToggle(value)} disabled={disabled}>
                     <ListItemIcon>
                        <Checkbox checked={checked.includes(value)} tabIndex={-1} disableRipple />
                     </ListItemIcon>
                     <ListItemText primary={data.find((d) => d.id === value)?.label || `Item ${value}`} />
                  </ListItemButton>
               ))}
            </List>
         </Card>
      );
   };

   return (
      <Grid container size={sizeCols} spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
         <Grid size={{ md: 5.5 }} offset={{ xs: xsOffset }} sx={{}}>
            {customList(labelLeft, left, searchLeft, setSearchLeft)}
         </Grid>

         <Grid>
            <Grid container direction="column" sx={{ alignItems: "center" }}>
               <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedRight} disabled={leftChecked.length === 0 || disabled}>
                  <KeyboardArrowRightRounded />
               </Button>
               <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedLeft} disabled={rightChecked.length === 0 || disabled}>
                  <KeyboardArrowLeftRounded />
               </Button>
            </Grid>
         </Grid>

         <Grid size={{ md: 5.5 }}>{customList(labelRight, right, searchRight, setSearchRight)}</Grid>
      </Grid>
   );
};

export default TransferList;
