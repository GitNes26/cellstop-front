import { Backdrop, Box, Card, Checkbox, CircularProgress, FormControlLabel, Typography, useColorScheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Masonry } from "@mui/lab";
import Toast from "../../../../utils/Toast";
import { useMenuContext } from "../../../../context/MenuContext";
import { useRoleContext } from "../../../../context/RoleContext";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../../context/GlobalContext";
import { useAuthContext } from "../../../../context/AuthContext";

// let checkTheme = localStorage.getItem("theme");

const CardMenu = ({ id = 0, title = "", others_permissions = [], checkMenus, handleCheckboxChange, isChecked, readOnly }) => {
   const { mode, setMode } = useColorScheme();

   // console.log("🚀 ~ CardMenu ~ checkMenus:", checkMenus);
   // const classes = useStyles();
   // console.log("others_permissions", others_permissions);
   // console.log("isChecked", isChecked);
   return (
      <Card className="border-2 rounded-lg card border-black">
         <Box textAlign={"center"}>
            <FormControlLabel
               value={`${id}@page`}
               id={`${id}@page`}
               control={
                  <Checkbox checked={isChecked} style={{ color: mode === "dark" ? "whitesmoke" : "inherit" }} onChange={(e) => handleCheckboxChange(e.target, id)} />
               }
               label={
                  <Typography variant="h6" className={"text-base-content"}>
                     {title}
                  </Typography>
               }
               labelPlacement="start"
            />
         </Box>
         <Masonry columns={3} spacing={2} sx={{ backgroundColor: "white", p: 0, m: 0, textAlign: "center" }}>
            <FormControlLabel
               value={`${id}@read`}
               id={`${id}@read`}
               control={
                  <Checkbox
                     checked={checkMenus.some((check) => check.id === id && check.permissions.read)}
                     style={{ color: mode === "dark" ? "inherit" : "inherit" }}
                     onChange={(e) => handleCheckboxChange(e.target, id)}
                  />
               }
               sx={{ color: "black" }}
               label="Ver"
               labelPlacement="bottom"
            />
            {!readOnly && (
               <>
                  <FormControlLabel
                     value={`${id}@create`}
                     id={`${id}@create`}
                     control={
                        <Checkbox
                           checked={checkMenus.some((check) => check.id === id && check.permissions.create)}
                           style={{ color: mode === "dark" ? "inherit" : "inherit" }}
                           onChange={(e) => handleCheckboxChange(e.target, id)}
                        />
                     }
                     sx={{ color: "black" }}
                     label="Crear"
                     labelPlacement="bottom"
                  />
                  <FormControlLabel
                     value={`${id}@update`}
                     id={`${id}@update`}
                     control={
                        <Checkbox
                           checked={checkMenus.some((check) => check.id === id && check.permissions.update)}
                           style={{ color: mode === "dark" ? "inherit" : "inherit" }}
                           onChange={(e) => handleCheckboxChange(e.target, id)}
                        />
                     }
                     sx={{ color: "black" }}
                     label="Editar"
                     labelPlacement="bottom"
                  />
                  <FormControlLabel
                     value={`${id}@delete`}
                     id={`${id}@delete`}
                     className="text-base-content"
                     control={
                        <Checkbox
                           checked={checkMenus.some((check) => check.id === id && check.permissions.delete)}
                           style={{ color: mode === "dark" ? "inherit" : "inherit" }}
                           onChange={(e) => handleCheckboxChange(e.target, id)}
                        />
                     }
                     sx={{ color: "black" }}
                     label="Eliminar"
                     labelPlacement="bottom"
                  />
               </>
            )}
            {others_permissions.map((op, opIndex) => (
               <FormControlLabel
                  key={`COP_${id}_${opIndex}`}
                  value={`${op}`}
                  id={`${op}`}
                  control={
                     <Checkbox
                        checked={checkMenus.some(
                           // (check) => check.id === id && (check.others_permissions.includes(`${op}`) || check.others_permissions.includes("todas"))
                           (check) => check.id === id && (check.permissions.more_permissions.includes(`${op}`) || check.permissions.more_permissions.includes("todas"))
                           // (check) => check.id === id && includesInArray([op, "todas"], check.permissions.more_permissions)
                        )}
                        onChange={(e) => handleCheckboxChange(e.target, id)}
                        style={{ color: "goldenrod" }}
                     />
                  }
                  sx={{ color: "black" }}
                  label={op.includes("@") ? op.split("@")[1] : op}
                  labelPlacement="bottom"
               />
            ))}
         </Masonry>
      </Card>
   );
};

const CardHeaderMenu = ({ id = 0, title = "", children = [], checkMenus, handleCheckboxChange, isChecked }) => {
   const { auth } = useAuthContext();
   const { mode, setMode } = useColorScheme();

   // console.log("🚀 ~ CardHeaderMenu ~ children:", children);
   // const classes = useStyles();
   // const _checksModules = [...checksModules];
   // console.log(_checksModules);
   // setChecksModules(_checksModules);

   useEffect(() => {
      // console.log("🚀 ~ CardHeaderMenu ~ mode:", mode);
   }, [mode]);

   return (
      <Card /* sx={classes.cardHeader} */ className="border-2 rounded-lg shadow-sm border-base-300">
         <Box textAlign={"center"} mb={1} sx={{ backgroundColor: "primary.main" }}>
            <FormControlLabel
               value={`${id}@menu`}
               id={`${id}@menu`}
               control={
                  <Checkbox checked={isChecked} style={{ color: mode === "dark" ? "whitesmoke" : "inherit" }} onChange={(e) => handleCheckboxChange(e.target, id)} />
               }
               label={
                  <Typography variant="h5" className="text-base-content" fontWeight={"medium"}>
                     {title.toUpperCase()}
                  </Typography>
               }
               labelPlacement="start"
            />
         </Box>

         <Masonry
            columns={children.length == 1 ? 1 : 2}
            spacing={2}
            sx={{ backgroundColor: "white", p: 0, m: 0, borderBottomRightRadius: 5, borderBottomLeftRadius: 5 }}
         >
            {children.map((m) => {
               if (auth.role_id !== ROLE_SUPER_ADMIN && m.title === "Menus") return;

               return (
                  <CardMenu
                     key={`CMC_${m.id}`}
                     id={m.id}
                     title={m.title}
                     others_permissions={m.others_permissions}
                     checkMenus={checkMenus}
                     handleCheckboxChange={handleCheckboxChange}
                     isChecked={checkMenus.some((check) => check.id === m.id && check.isChecked)}
                     readOnly={m.readOnly}
                  />
               );
            })}
         </Masonry>
      </Card>
   );
};

const MenuCards = ({ loadPermissions, setLoadPermissions }) => {
   const { allMenus } = useMenuContext();
   const { menusItems, setMenusItems, checkMaster, setCheckMaster, checkMenus, setCheckMenus } = useRoleContext();

   // const [headersMenus, setHeadersMenus] = useState([]);
   // const [childrenMenus, setChildrenMenus] = useState([]);
   // const [checksModules, setChecksModules] = useState([]);
   // const [checksPages, setChecksPages] = useState([]);
   // const [checksPermissions, setChecksPermissions] = useState([]);
   // // const [checks, setChecks] = useState([]);

   const handleChangeCheckMaster = (e) => {
      // console.log("cambio", e.target.checked);
      const isChecked = e.target.checked;
      const _checkMenus = checkMenus.map((check) => {
         check.isChecked = isChecked;
         check.permissions = isChecked
            ? { read: true, create: true, update: true, delete: true, more_permissions: ["todas"] }
            : { read: false, create: false, update: false, delete: false, more_permissions: [] };
         // check.permissions = isChecked ? ["todas"] : [];
         return check;
      });
      setCheckMaster(!checkMaster);
      setCheckMenus(_checkMenus);
      // console.log("checkMaster", checkMaster);
   };

   const handleCheckboxChange = (target, idMenu) => {
      // console.log("🚀 ~ handleCheckboxChange ~ target:", target);
      // console.log("🚀 ~ handleCheckboxChange ~ idMenu:", idMenu);
      try {
         // let allOtherPermissions = checkMenus.filter((check) => check.others_permissions.length > 0);
         // allOtherPermissions = allOtherPermissions.map((op) => op.others_permissions);
         // allOtherPermissions = allOtherPermissions.flat(1);
         // console.log("🚀 ~ handleCheckboxChange ~ allOtherPermissions:", allOtherPermissions);

         let id = idMenu;
         let value = target.value;
         if (target.value.includes("@")) {
            id = target.value.split("@")[0];
            value = target.value.split("@")[1];
         }
         if (!["menu", "page", "read", "create", "update", "delete"].includes(value)) value = target.value;
         const isChecked = target.checked;
         // console.log("handleCheckboxChange()->id", id);
         // console.log("handleCheckboxChange()->value", value);
         // console.log("handleCheckboxChange()->isChecked", isChecked);
         let _checkMenus = [...checkMenus];
         // console.log("_checkMenus", _checkMenus);
         _checkMenus = _checkMenus.map((check) => {
            // console.log("🚀 ~ _checkMenus=_checkMenus.map ~ check:", check);
            let matchCheckWithPermission = false;
            if (target.value.includes("@")) {
               matchCheckWithPermission = Number(check.id) === Number(id);
            } else {
               // console.log("🚀 ~ _checkMenus=_checkMenus.map ~ check.others_permissions:", check.others_permissions);
               matchCheckWithPermission = check.others_permissions.includes(value);
            }
            if (matchCheckWithPermission) {
               // console.log(value);
               if (["menu", "page"].includes(value)) check.isChecked = isChecked;
               // console.log("value", value);
               // if (!["menu"].includes(value)) {
               // if (!check.permissions.includes(value)) check.permissions.push(value);
               if (value === "menu") check.permissions.read = isChecked;
               if (value === "page") check.permissions.read = isChecked;
               if (value === "read") check.permissions.read = isChecked;
               if (value === "create") check.permissions.create = isChecked;
               if (value === "update") check.permissions.update = isChecked;
               if (value === "delete") check.permissions.delete = isChecked;
               // }
               if (!["menu", "page"].includes(value)) {
                  if (!["read", "create", "update", "delete"].includes(value)) {
                     // console.log("permiso:", value);
                     // console.log("check.permissions.more_permissions", check.permissions.more_permissions);
                     // if (check.permissions.more_permissions.length > 1 && check.permissions.more_permissions.includes("todas")) {
                     //    console.log("tengo más de un permiso e incluye 'todas'");
                     //    // check.permissions.more_permissions = [];
                     //    const new_more_permissions = check.permissions.more_permissions.filter((permission) => permission !== "todas");
                     //    check.permissions.more_permissions = new_more_permissions;
                     // }
                     if (isChecked) {
                        // console.log("se Chequeo la casilla de " + isChecked);
                        if (!check.permissions.more_permissions.includes(value)) check.permissions.more_permissions.push(value);
                        // if (check.permissions.more_permissions.length == allOtherPermissions.length) check.permissions.more_permissions[0] = "todas";
                     } else {
                        // console.log("se Deshequeo la casilla de " + isChecked);
                        // // console.log("quitar permiso:", value);
                        // // console.log("check.permissions.more_permissions", check.permissions.more_permissions);
                        // if (check.permissions.more_permissions.length == 1 && check.permissions.more_permissions[0] == "todas") {
                        //    console.log("tiene todas");
                        //    check.permissions.more_permissions = allOtherPermissions;
                        // }
                        const new_more_permissions = check.permissions.more_permissions.filter((permission) => permission !== value);
                        check.permissions.more_permissions = new_more_permissions;
                     }
                     // console.log("🚀 ~ _checkMenus=_checkMenus.map ~ check.permissions.more_permissions:", check.permissions.more_permissions);
                  }
               }
            }
            return check;
         });
         // console.log("_checkMenus", _checkMenus);
         setCheckMenus(_checkMenus);
      } catch (error) {
         console.log("🚀 ~ handleCheckboxChange ~ error:", error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      setLoadPermissions(true);
      (async () => {
         if (allMenus.length > 0) {
            // console.log("Menus cargados");
            setLoadPermissions(false);
            const HeaderMenus = allMenus.filter((menu) => menu.belongs_to == 0);
            // console.log("HeaderMenus", HeaderMenus);
            const items = [];
            let _checkMenus = []; // #permisos
            HeaderMenus.map((hm) => {
               const item = {
                  id: hm.id,
                  title: hm.menu,
                  caption: hm.caption,
                  type: hm.type,
                  children: []
               };

               // #permisos
               _checkMenus.push({
                  id: hm.id,
                  isChecked: false,
                  others_permissions: [],
                  permissions: {
                     read: false,
                     create: false,
                     update: false,
                     delete: false,
                     more_permissions: []
                  }
               });
               // #permisos

               const childrenMenus = allMenus.filter((chm) => chm.belongs_to == hm.id);
               // console.log("childrenMenus", childrenMenus);
               childrenMenus.map((iCh) => {
                  let others_permissions = iCh.others_permissions == null ? [] : iCh.others_permissions.split(",");
                  others_permissions = others_permissions.map((op) => op.trim());

                  const child = {
                     id: iCh.id,
                     title: iCh.menu,
                     type: iCh.type,
                     url: iCh.url,
                     others_permissions: others_permissions,
                     show_counter: iCh.show_counter,
                     counter_name: iCh.counter_name,
                     readOnly: Boolean(iCh.read_only)
                     // icon: tablerIcons[`${iCh.icon}`]
                  };
                  item.children.push(child);

                  // #permisos
                  _checkMenus.push({
                     id: iCh.id,
                     isChecked: false,
                     others_permissions: others_permissions,
                     permissions: {
                        read: false,
                        create: false,
                        update: false,
                        delete: false,
                        more_permissions: []
                     },
                     readOnly: false
                  });
                  // #permisos
               });

               items.push(item);
            });
            // console.log("items", items);
            setMenusItems(items);
            // console.log("🚀 ~ _checkMenus:", _checkMenus);
            setCheckMenus(_checkMenus);
         }
      })();
      // console.log("allMenus para permisos", allMenus);
      // console.log("checks para permisos", checkMenus);
      // console.log(allMenus);
   }, [allMenus]);

   return (
      <>
         <Box textAlign={"center"} mt={2} mb={1}>
            <Typography variant="h2" fontWeight={400} className="mb-2 text-center">
               {"MENUS"}
            </Typography>
            {/* <FormControlLabel
               value={`todas`}
               control={<Checkbox checked={checkMaster} onChange={handleChangeCheckMaster} />}
               label={
                  <Typography variant="h1" className={classes.title}>
                     {"MENUS"}
                  </Typography>
               }
               labelPlacement="start"
            /> */}
         </Box>
         <Box sx={{ width: "100%", height: "59vh", overflowY: loadPermissions ? "hidden" : "auto", position: "relative" }}>
            <Masonry columns={menusItems.length > 3 ? 3 : menusItems.length} spacing={1}>
               {menusItems.map((m) => (
                  <CardHeaderMenu
                     key={`CM_${m.id}`}
                     id={m.id}
                     title={m.title}
                     children={m.children}
                     // isChecked={checks.map((check) => index == m.id && !check)}
                     checkMenus={checkMenus}
                     handleCheckboxChange={handleCheckboxChange}
                     isChecked={checkMenus.some((check) => check.id === m.id && check.isChecked)}
                  />
               ))}
            </Masonry>
            {true && (
               // <Box sx={{ position: "absolute", top: 0, left: 0, backgroundColor: "#000000c0", width: "100%", height: "1000%", overflowY: "hidden", ":disabled": false }}
               <Backdrop
                  sx={{ color: "#fff", position: "absolute", height: "auto", /* zIndex: (theme) => theme.zIndex.drawer + 1000000, */ backgroundColor: "#000000c0" }}
                  open={loadPermissions}
               >
                  <CircularProgress disableShrink size={150} sx={{ position: "fixed", top: "50%", left: "53%", zIndex: 10 }} />
               </Backdrop>
            )}
         </Box>
      </>
   );
};

export default MenuCards;
