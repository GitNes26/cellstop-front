import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import * as MuiIcons from "@mui/icons-material";
import { useGlobalContext } from "../context/GlobalContext";
import env from "../constant/env";
import { Avatar, Box, Collapse, Skeleton, Tooltip, Slide, Fade } from "@mui/material";
import { useAuthContext } from "../context/AuthContext";
import { Fragment, useEffect, useState } from "react";
import { useMenuContext } from "../context/MenuContext";
import ExpandCircleDownRoundedIcon from "@mui/icons-material/ExpandCircleDownRounded";
import { Link, useNavigate } from "react-router-dom";
import { to } from "await-to-js";
import { images } from "../constant";

const drawerWidth = 240;

const openedMixin = (theme) => ({
   width: drawerWidth,
   transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
   }),
   overflowX: "hidden"
});

const closedMixin = (theme) => ({
   transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
   }),
   overflowX: "hidden",
   width: `calc(${theme.spacing(7)} + 1px)`,
   [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`
   }
});

const DrawerHeader = styled("div")(({ theme }) => ({
   display: "flex",
   alignItems: "center",
   justifyContent: "flex-end",
   padding: theme.spacing(0, 1),
   // necessary for content to be below app bar
   ...theme.mixins.toolbar
}));

const Drawer = styled(MuiDrawer, {
   shouldForwardProp: (prop) => prop !== "open"
})(({ theme }) => ({
   width: drawerWidth,
   flexShrink: 0,
   whiteSpace: "nowrap",
   boxSizing: "border-box",
   variants: [
      {
         props: ({ open }) => open,
         style: {
            ...openedMixin(theme),
            "& .MuiDrawer-paper": openedMixin(theme)
         }
      },
      {
         props: ({ open }) => !open,
         style: {
            ...closedMixin(theme),
            "& .MuiDrawer-paper": closedMixin(theme)
         }
      }
   ]
}));

const CollapseListItems = ({ menus, openDrawerSidebar }) => {
   // Estado para cada item abierto, usando el id del menú
   const navigate = useNavigate();
   const [openItems, setOpenItems] = useState({});
   const handleToggle = (id) => {
      setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
   };
   // Función para renderizar el icono por nombre
   const renderMuiIcon = (iconName, type) => {
      if (!iconName) return type === "group" ? <MuiIcons.TokenRounded /> : <MuiIcons.BlurOnRounded />;
      const IconComponent = MuiIcons[iconName];
      return IconComponent != undefined ? <IconComponent /> : type === "group" ? <MuiIcons.TokenRounded /> : <MuiIcons.BlurOnRounded />;
   };

   const handleClickMenu = (url) => () => {
      if (url) {
         navigate(url);
      }
   };

   return (
      <List sx={{ maxHeight: "77vh", overflowY: "scroll", overflowX: "hidden" }}>
         {menus.map((menu) => (
            <Fragment key={`key-fragment-${menu.id}`}>
               <ListItem disablePadding sx={{ display: "block" }} key={`listItem-${menu.id}`}>
                  <Tooltip title={menu.title} placement="right" arrow disableInteractive>
                     <ListItemButton
                        onClick={() => handleToggle(menu.id)}
                        sx={[
                           { minHeight: 48, px: 1, fontWeight: "bold" },
                           openDrawerSidebar ? { justifyContent: "initial" } : { justifyContent: "center" },
                           { py: openDrawerSidebar ? 0 : 2 }
                        ]}
                     >
                        <ListItemIcon
                           sx={[{ transition: "all 0.6s ease" }, { minWidth: 0, justifyContent: "center" }, openDrawerSidebar ? { mr: 3 } : { mr: "auto" }]}
                        >
                           {renderMuiIcon(menu.icon, menu.type)}
                        </ListItemIcon>
                        <ListItemText
                           primary={menu.title}
                           secondary={menu.caption}
                           sx={{ transition: "all 0.6s ease", display: openDrawerSidebar ? "block" : "none", textWrap: "wrap" }}
                        />
                        <ListItemIcon sx={[{ transition: "all 0.6s ease" }, { minWidth: 0, justifyContent: "right" }, openDrawerSidebar ? { mr: 0 } : { ml: 0 }]}>
                           <ExpandCircleDownRoundedIcon sx={{ transition: "all 0.3s ease", transform: openItems[menu.id] ? "rotate(180deg)" : "rotate(0deg)" }} />
                        </ListItemIcon>
                     </ListItemButton>
                  </Tooltip>
                  <Collapse sx={{ transition: "all 0.6s ease" }} in={!!openItems[menu.id]} timeout="auto" unmountOnExit>
                     <List component="div" disablePadding>
                        {menu.children.map((child) => (
                           <Tooltip key={`tooltip-${child.id}`} title={child.title} placement="right" arrow disableInteractive>
                              <ListItemButton key={child.id} sx={{ pl: 4, textWrap: "wrap", fontStyle: "italic" }} onClick={handleClickMenu(child.url)}>
                                 <ListItemIcon sx={[{ transition: "all 0.6s ease" }, openDrawerSidebar ? { mr: 0 } : { ml: -3 }]}>
                                    {renderMuiIcon(child.icon, child.type)}
                                 </ListItemIcon>
                                 <ListItemText primary={child.title} sx={{ display: openDrawerSidebar ? "block" : "none", fontSize: "0.3rem" }} />
                              </ListItemButton>
                           </Tooltip>
                        ))}
                     </List>
                  </Collapse>
               </ListItem>
               <Divider key={`key-divider-${menu.id}`} />
            </Fragment>
         ))}
      </List>
   );
};

const SidebarSkeleton = ({ openDrawerSidebar, items = 3, childrenPerItem = 2 }) => (
   <List>
      {[...Array(items)].map((_, i) => (
         <Fragment key={`skeleton-fragment-${i}`}>
            <ListItem key={`skeleton-item-${i}`} disablePadding sx={{ display: "block" }}>
               <ListItemButton sx={[{ minHeight: 48, px: 1 }, openDrawerSidebar ? { justifyContent: "initial" } : { justifyContent: "center" }]}>
                  <ListItemIcon sx={[{ minWidth: 0, justifyContent: "center" }, openDrawerSidebar ? { mr: 3 } : { mr: "auto" }]}>
                     <Skeleton variant="circular" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText primary={<Skeleton width={100} />} secondary={<Skeleton width={60} />} sx={[openDrawerSidebar ? { opacity: 1 } : { opacity: 0 }]} />
                  <Skeleton variant="circular" width={24} height={24} />
               </ListItemButton>
               <Collapse in={false} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                     {[...Array(childrenPerItem)].map((_, j) => (
                        <ListItemButton key={`skeleton-child-${j}`} sx={{ pl: 4 }}>
                           <ListItemIcon>
                              <Skeleton variant="circular" width={24} height={24} />
                           </ListItemIcon>
                           <Skeleton width={80} />
                        </ListItemButton>
                     ))}
                  </List>
               </Collapse>
            </ListItem>
            <Divider />
         </Fragment>
      ))}
   </List>
);

export default function Sidebar() {
   const { openDrawerSidebar, setOpenDrawerSidebar, setIsLoading } = useGlobalContext();
   const { auth, validateAccessPage } = useAuthContext();
   const { getMenusByRole } = useMenuContext();
   const [menus, setMenus] = useState([]);
   const [loadingMenus, setLoadingMenus] = useState(true);

   const handleDrawerClose = () => {
      setOpenDrawerSidebar(false);
   };

   validateAccessPage();

   useEffect(() => {
      setLoadingMenus(true);
      (async () => {
         const res = await getMenusByRole();
         if (!res) {
            setIsLoading(false);
            setLoadingMenus(false);
            return;
         }
         if (res.errors) {
            setIsLoading(false);
            Object.values(res.errors).forEach((errors) => {
               errors.map((error) => Toast.Warning(error));
            });
            return;
         } else if (res.status_code !== 200) {
            setIsLoading(false);
            setLoadingMenus(false);
            return Toast.Customizable(res.alert_text, res.alert_icon);
         }
         if (res.alert_text) Toast.Success(res.alert_text);
         const menus = res.result;
         const HeaderMenus = menus.filter((menu) => menu.belongs_to == 0);
         const items = [];
         HeaderMenus.map((hm) => {
            const item = {
               id: hm.id,
               title: hm.menu,
               caption: hm.caption,
               type: hm.type,
               icon: hm.icon,
               children: []
            };
            const childrenMenus = menus.filter((chm) => chm.belongs_to == hm.id);
            childrenMenus.map((iCh) => {
               const child = {
                  id: iCh.id,
                  title: iCh.menu,
                  type: iCh.type,
                  url: iCh.url,
                  show_counter: iCh.show_counter,
                  counter_name: iCh.counter_name,
                  icon: iCh.icon
               };
               item.children.push(child);
            });
            items.push(item);
         });
         setMenus(items);
         setLoadingMenus(false);
      })();
   }, []);

   return (
      <Drawer variant="permanent" open={openDrawerSidebar} sx={{ transition: env.TRANSITION_TIME, maxHeight: "100vh" }}>
         <DrawerHeader sx={{ position: "sticky", top: 0, display: "flex", flexDirection: "column", zIndex: 10, backgroundColor: "inherit" }}>
            <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
               <Typography variant="span" fontSize={12} sx={{ fontStyle: "italic" }}>
                  {env.VERSION}
               </Typography>
               <IconButton onClick={handleDrawerClose}>{env.THEME.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", py: 4, justifyItems: "center", alignItems: "center", gap: 0.5 }}>
               <img src={images.logo} className={`transition-all ${openDrawerSidebar ? "max-w-[200px] w-[100%]" : "max-w-[50px] w-[100%]"}`} />
               <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  href="/app"
                  sx={{
                     mr: 2,
                     flexGrow: 1,
                     transition: "all 0.3s ease",
                     display: openDrawerSidebar ? "block" : "none",
                     fontFamily: "monospace",
                     fontWeight: 700,
                     letterSpacing: ".3rem",
                     color: "inherit",
                     textDecoration: "none"
                  }}
               >
                  {env.NAME_SYSTEM}
               </Typography>
               {/* <Avatar>{auth.username.slice(0, 2).toUpperCase()}</Avatar> */}
               {/* <Typography fontSize={12}>{auth.username}</Typography>
               <Typography fontSize={12}>{auth.email}</Typography> */}
            </Box>
         </DrawerHeader>
         <Divider sx={{ display: loadingMenus ? "none" : "block", borderBottom: "2px solid rgba(0,0,0,0.12)" }} />

         {/* Animación de transición entre Skeleton y Menú real */}
         <Fade in={loadingMenus} timeout={400} unmountOnExit>
            <div>
               <SidebarSkeleton openDrawerSidebar={openDrawerSidebar} />
            </div>
         </Fade>
         <Collapse in={!loadingMenus} timeout={2000} mountOnEnter unmountOnExit>
            <div>
               <CollapseListItems menus={menus} openDrawerSidebar={openDrawerSidebar} />
            </div>
         </Collapse>
      </Drawer>
   );
}
