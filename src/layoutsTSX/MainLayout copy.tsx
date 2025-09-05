import { MouseEvent, useState } from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem, { ListItemProps } from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import AdbIcon from "@mui/icons-material/Adb";
import {
   Link as RouterLink,
   Avatar,
   Button,
   createTheme,
   FormControlLabel,
   Menu,
   MenuItem,
   Select,
   Switch,
   ThemeProvider,
   Tooltip,
   useColorScheme,
   Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore, Logout, Settings } from "@mui/icons-material";
import env from "../constant/env";

const drawerWidth = 240;
const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const openedMixin = (theme: Theme): CSSObject => ({
   width: drawerWidth,
   transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
   }),
   overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
   transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
   }),
   overflowX: "hidden",
   width: `calc(${theme.spacing(7)} + 1px)`,
   [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
   },
});

const DrawerHeader = styled("div")(({ theme }) => ({
   display: "flex",
   alignItems: "center",
   justifyContent: "flex-end",
   padding: theme.spacing(0, 1),
   // necessary for content to be below app bar
   ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
   open?: boolean;
}

const AppBar = styled(MuiAppBar, {
   shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
   zIndex: theme.zIndex.drawer + 1,
   transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
   }),
   variants: [
      {
         props: ({ open }) => open,
         style: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
               easing: theme.transitions.easing.sharp,
               duration: theme.transitions.duration.enteringScreen,
            }),
         },
      },
   ],
}));

const theme = createTheme({
   cssVariables: {
      colorSchemeSelector: "data-color-scheme",
   },
   colorSchemes: {
      light: {
         palette: {
            background: {
               default: "#eeeeee",
               paper: "#f5f5f5",
            },
            primary: {
               main: "#4DA8DA",
            },
         },
      },
      dark: {
         palette: {
            background: {
               default: "#333446", //"#424242",
               paper: "#F2F2F2", //"#212121",
            },
            primary: {
               main: "#000",
            },
         },
      },
   },

   breakpoints: {
      values: {
         xs: 0,
         sm: 600,
         md: 600,
         lg: 1200,
         xl: 1536,
      },
   },
   //  transitions: {
   //     duration: {
   //        shortest: 1500,
   //        shorter: 2000,
   //        short: 2500,
   //        standard: 3000, // 300ms por defecto
   //        complex: 3750,
   //        enteringScreen: 2250,
   //        leavingScreen: 1950,
   //     },
   //  },
});

const Drawer = styled(MuiDrawer, {
   shouldForwardProp: (prop) => prop !== "open",
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
            "& .MuiDrawer-paper": openedMixin(theme),
         },
      },
      {
         props: ({ open }) => !open,
         style: {
            ...closedMixin(theme),
            "& .MuiDrawer-paper": closedMixin(theme),
         },
      },
   ],
}));

interface ListItemLinkProps extends ListItemProps {
   to: string;
   open?: boolean;
}

const breadcrumbNameMap: { [key: string]: string } = {
   "/inbox": "Inbox",
   "/inbox/important": "Important",
   "/trash": "Trash",
   "/spam": "Spam",
   "/drafts": "Drafts",
};
function ListItemLink(props: ListItemLinkProps) {
   const { to, open, ...other } = props;
   const primary = breadcrumbNameMap[to];

   let icon = null;
   if (open != null) {
      icon = open ? <ExpandLess /> : <ExpandMore />;
   }

   return (
      <li>
         <ListItemButton component={RouterLink as any} to={to} {...other}>
            <ListItemText primary={primary} />
            {icon}
         </ListItemButton>
      </li>
   );
}

export default function MainLayout() {
   // const theme = useTheme();
   const [disableTransition, setDisableTransition] = useState(false);
   function ModeSwitcher() {
      const { mode, setMode } = useColorScheme();
      if (!mode) {
         return null;
      }
      return (
         <>
            <Select
               size="small"
               value={mode}
               onChange={(event) =>
                  setMode(event.target.value as "system" | "light" | "dark")
               }
               sx={{ minWidth: 120, ml: 2 }}>
               <MenuItem value="system">Sistema</MenuItem>
               <MenuItem value="light">Claro</MenuItem>
               <MenuItem value="dark">Oscuro</MenuItem>
            </Select>
            <FormControlLabel
               hidden
               control={
                  <Switch
                     checked={disableTransition}
                     onChange={(event) =>
                        setDisableTransition(event.target.checked)
                     }
                  />
               }
               label="Disable transition"
            />
         </>
      );
   }
   const [open, setOpen] = useState(false);

   const handleDrawerOpen = () => {
      setOpen(true);
   };

   const handleDrawerClose = () => {
      setOpen(false);
   };

   const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
   const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

   const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
      setAnchorElNav(event.currentTarget);
   };
   const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
   };

   const handleCloseNavMenu = () => {
      setAnchorElNav(null);
   };

   const handleCloseUserMenu = () => {
      setAnchorElUser(null);
   };

   return (
      <ThemeProvider theme={theme}>
         <Box sx={{ display: "flex", transition: env.TRANSITION_TIME }}>
            <CssBaseline />
            {/* Navbar */}
            <AppBar
               position="fixed"
               open={open}
               sx={{ transition: env.TRANSITION_TIME }}>
               <Toolbar>
                  {/* Icono de Menu */}
                  <IconButton
                     color="inherit"
                     aria-label="open drawer"
                     onClick={handleDrawerOpen}
                     edge="start"
                     sx={[
                        {
                           marginRight: 5,
                        },
                        open && { display: "none" },
                     ]}>
                     <MenuIcon />
                  </IconButton>
                  {/* Logo */}
                  <AdbIcon
                     sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                  />
                  <Typography
                     variant="h6"
                     noWrap
                     component="a"
                     href="#app-bar-with-responsive-menu"
                     sx={{
                        mr: 2,
                        display: { xs: "none", md: "flex" },
                        fontFamily: "monospace",
                        fontWeight: 700,
                        letterSpacing: ".3rem",
                        color: "inherit",
                        textDecoration: "none",
                     }}>
                     LOGO
                  </Typography>
                  {/* Resto de la barra */}
                  <Box
                     sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                     <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit">
                        <MenuIcon />
                     </IconButton>
                     <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                           vertical: "bottom",
                           horizontal: "left",
                        }}
                        keepMounted
                        transformOrigin={{
                           vertical: "top",
                           horizontal: "left",
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{ display: { xs: "block", md: "none" } }}>
                        {pages.map((page) => (
                           <MenuItem key={page} onClick={handleCloseNavMenu}>
                              <Typography sx={{ textAlign: "center" }}>
                                 {page}
                              </Typography>
                           </MenuItem>
                        ))}
                     </Menu>
                  </Box>
                  <AdbIcon
                     sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                  />
                  <Typography
                     variant="h5"
                     noWrap
                     component="a"
                     href="#app-bar-with-responsive-menu"
                     sx={{
                        mr: 2,
                        display: { xs: "flex", md: "none" },
                        flexGrow: 1,
                        fontFamily: "monospace",
                        fontWeight: 700,
                        letterSpacing: ".3rem",
                        color: "inherit",
                        textDecoration: "none",
                     }}>
                     LOGO
                  </Typography>
                  <Box
                     sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                     {/* {pages.map((page) => (
                     <Button
                        key={page}
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: "white", display: "block" }}>
                        {page}
                     </Button>
                  ))} */}
                  </Box>
                  {/* Area de BtnUser */}
                  <Box sx={{ flexGrow: 0 }}>
                     <Tooltip title="Abrir Opciones">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                           <Avatar
                              alt="Remy Sharp"
                              src="/static/images/avatar/2.jpg"
                           />
                        </IconButton>
                     </Tooltip>
                     <Menu
                        anchorEl={anchorElUser}
                        id="menu-appbar"
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        onClick={handleCloseUserMenu}
                        slotProps={{
                           paper: {
                              elevation: 0,
                              sx: {
                                 overflow: "visible",
                                 filter:
                                    "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                 mt: 1.5,
                                 "& .MuiAvatar-root": {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                 },
                                 "&::before": {
                                    content: '""',
                                    display: "block",
                                    position: "absolute",
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: "background.paper",
                                    transform: "translateY(-50%) rotate(45deg)",
                                    zIndex: 0,
                                 },
                              },
                           },
                        }}
                        transformOrigin={{
                           horizontal: "right",
                           vertical: "top",
                        }}
                        anchorOrigin={{
                           horizontal: "right",
                           vertical: "bottom",
                        }}>
                        <MenuItem onClick={handleCloseUserMenu}>
                           <Avatar /> Profile
                        </MenuItem>
                        <MenuItem onClick={handleCloseUserMenu}>
                           <Avatar /> My account
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleCloseUserMenu}>
                           <ListItemIcon>
                              <Settings fontSize="small" />
                           </ListItemIcon>
                           Settingssssssssss
                        </MenuItem>
                        <MenuItem onClick={handleCloseUserMenu}>
                           <ListItemIcon>
                              <Logout fontSize="small" />
                           </ListItemIcon>
                           Logout
                        </MenuItem>
                     </Menu>
                     {/* <Menu
                        sx={{ mt: "45px" }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                           vertical: "top",
                           horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                           vertical: "top",
                           horizontal: "right",
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}>
                        {settings.map((setting) => (
                           <MenuItem
                              key={setting}
                              onClick={handleCloseUserMenu}>
                              <Typography sx={{ textAlign: "center" }}>
                                 {setting}
                              </Typography>
                           </MenuItem>
                        ))}
                     </Menu> */}
                     <ModeSwitcher />
                  </Box>
               </Toolbar>
            </AppBar>
            {/* Sidebar */}
            <Drawer
               variant="permanent"
               open={open}
               sx={{ transition: env.TRANSITION_TIME }}>
               <DrawerHeader>
                  <IconButton onClick={handleDrawerClose}>
                     {theme.direction === "rtl" ? (
                        <ChevronRightIcon />
                     ) : (
                        <ChevronLeftIcon />
                     )}
                  </IconButton>
               </DrawerHeader>
               <Divider />
               <List>
                  {["Inbox", "Starred", "Send email", "Drafts"].map(
                     (text, index) => (
                        <ListItem
                           key={text}
                           disablePadding
                           sx={{ display: "block" }}>
                           <ListItemButton
                              sx={[
                                 {
                                    minHeight: 48,
                                    px: 2.5,
                                 },
                                 open
                                    ? {
                                         justifyContent: "initial",
                                      }
                                    : {
                                         justifyContent: "center",
                                      },
                              ]}>
                              <ListItemIcon
                                 sx={[
                                    {
                                       minWidth: 0,
                                       justifyContent: "center",
                                    },
                                    open
                                       ? {
                                            mr: 3,
                                         }
                                       : {
                                            mr: "auto",
                                         },
                                 ]}>
                                 {index % 2 === 0 ? (
                                    <InboxIcon />
                                 ) : (
                                    <MailIcon />
                                 )}
                              </ListItemIcon>
                              <ListItemText
                                 primary={text}
                                 sx={[
                                    open
                                       ? {
                                            opacity: 1,
                                         }
                                       : {
                                            opacity: 0,
                                         },
                                 ]}
                              />
                           </ListItemButton>
                        </ListItem>
                     ),
                  )}
               </List>
               {/* <List>
                  <ListItemLink to="/inbox" open={open} onClick={handleClick} />
                  <Collapse
                     component="li"
                     in={open}
                     timeout="auto"
                     unmountOnExit>
                     <List disablePadding>
                        <ListItemLink sx={{ pl: 4 }} to="/inbox/important" />
                     </List>import default from './../../node_modules/tslib/tslib.es6';

                  </Collapse>
                  <ListItemLink to="/trash" />
                  <ListItemLink to="/spam" />
               </List> */}
               <Divider />
               <List>
                  {["All mail", "Trash", "Spam"].map((text, index) => (
                     <ListItem
                        key={text}
                        disablePadding
                        sx={{ display: "block" }}>
                        <ListItemButton
                           sx={[
                              {
                                 minHeight: 48,
                                 px: 2.5,
                              },
                              open
                                 ? {
                                      justifyContent: "initial",
                                   }
                                 : {
                                      justifyContent: "center",
                                   },
                           ]}>
                           <ListItemIcon
                              sx={[
                                 {
                                    minWidth: 0,
                                    justifyContent: "center",
                                 },
                                 open
                                    ? {
                                         mr: 3,
                                      }
                                    : {
                                         mr: "auto",
                                      },
                              ]}>
                              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                           </ListItemIcon>
                           <ListItemText
                              primary={text}
                              sx={[
                                 open
                                    ? {
                                         opacity: 1,
                                      }
                                    : {
                                         opacity: 0,
                                      },
                              ]}
                           />
                        </ListItemButton>
                     </ListItem>
                  ))}
               </List>
            </Drawer>
            {/* Contenido */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
               <DrawerHeader />
               <Typography sx={{ marginBottom: 2 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Rhoncus dolor purus non enim praesent elementum facilisis leo
                  vel. Risus at ultrices mi tempus imperdiet. Semper risus in
                  hendrerit gravida rutrum quisque non tellus. Convallis
                  convallis tellus id interdum velit laoreet id donec ultrices.
                  Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl
                  suscipit adipiscing bibendum est ultricies integer quis.
                  Cursus euismod quis viverra nibh cras. Metus vulputate eu
                  scelerisque felis imperdiet proin fermentum leo. Mauris
                  commodo quis imperdiet massa tincidunt. Cras tincidunt
                  lobortis feugiat vivamus at augue. At augue eget arcu dictum
                  varius duis at consectetur lorem. Velit sed ullamcorper morbi
                  tincidunt. Lorem donec massa sapien faucibus et molestie ac.
               </Typography>
               <Typography sx={{ marginBottom: 2 }}>
                  Consequat mauris nunc congue nisi vitae suscipit. Fringilla
                  est ullamcorper eget nulla facilisi etiam dignissim diam.
                  Pulvinar elementum integer enim neque volutpat ac tincidunt.
                  Ornare suspendisse sed nisi lacus sed viverra tellus. Purus
                  sit amet volutpat consequat mauris. Elementum eu facilisis sed
                  odio morbi. Euismod lacinia at quis risus sed vulputate odio.
                  Morbi tincidunt ornare massa eget egestas purus viverra
                  accumsan in. In hendrerit gravida rutrum quisque non tellus
                  orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
                  morbi tristique senectus et. Adipiscing elit duis tristique
                  sollicitudin nibh sit. Ornare aenean euismod elementum nisi
                  quis eleifend. Commodo viverra maecenas accumsan lacus vel
                  facilisis. Nulla posuere sollicitudin aliquam ultrices
                  sagittis orci a.
               </Typography>
            </Box>
         </Box>
      </ThemeProvider>
   );
}
