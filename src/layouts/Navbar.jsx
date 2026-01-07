import { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import AdbIcon from "@mui/icons-material/Adb";
import { Avatar, Menu, MenuItem, Select, Tooltip, useColorScheme } from "@mui/material";
import { Logout, PasswordRounded, Settings } from "@mui/icons-material";
import { useGlobalContext } from "../context/GlobalContext";
import { useAuthContext } from "../context/AuthContext";
import env from "../constant/env";
import ThemeCharger from "./../components/ThemeCharger";
import { useNavigate } from "react-router-dom";
import Toast from "../utils/Toast";
import ChangePasswordForm from "./ChangePasswordForm";
import { images } from "../constant";
import { stringAvatar } from "../utils/Formats";

const drawerWidth = 240;
const pages = ["Products", "Pricing", "Blog"];
// const settings = ["Profile", "Account", "Dashboard", "Logout"];

const AppBar = styled(MuiAppBar, {
   shouldForwardProp: (prop) => prop !== "open"
})(({ theme }) => ({
   zIndex: theme.zIndex.drawer + 1,
   transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
   }),
   variants: [
      {
         props: ({ open }) => open,
         style: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
               easing: theme.transitions.easing.sharp,
               duration: theme.transitions.duration.enteringScreen
            })
         }
      }
   ]
}));

// const transitionTime = "1s";

export default function Navbar() {
   const navigate = useNavigate();
   // const [open, openDrawerSidebar] = useState(false);
   const { setIsLoading, openDrawerSidebar, setOpenDrawerSidebar } = useGlobalContext();
   const { auth, logout, openModalChangePassword, setOpenModalChangePassword } = useAuthContext();

   const handleDrawerOpen = () => {
      setOpenDrawerSidebar(true);
   };

   const [anchorElNav, setAnchorElNav] = useState(null);
   const [anchorElUser, setAnchorElUser] = useState(null);

   const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
   };
   const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
   };

   const handleCloseNavMenu = () => {
      setAnchorElNav(null);
   };

   const handleCloseUserMenu = () => {
      setAnchorElUser(null);
   };
   const handleClickLogout = async () => {
      setIsLoading(true);
      setAnchorElUser(null);
      const res = await logout();
      // console.log("🚀 ~ handleClickLogout ~ res:", res);
      if (!res) return setIsLoading(false);
      if (res.errors) {
         setIsLoading(false);
         Object.values(res.errors).forEach((errors) => {
            errors.map((error) => Toast.Warning(error));
         });
         return;
      } else if (res.status_code !== 200) {
         setIsLoading(false);
         return Toast.Customizable(res.alert_text, res.alert_icon);
      }

      // await removeAuth();
      if (res.alert_text) Toast.Success(res.alert_text);
      setIsLoading(false);
   };

   const handleClickChangePassword = () => {
      try {
         setAnchorElUser(null);
         setOpenModalChangePassword(true);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   return (
      <AppBar position="fixed" open={openDrawerSidebar} sx={{ transition: env.TRANSITION_TIME }}>
         <Toolbar>
            {/* Icono de Menu */}
            <IconButton
               color="inherit"
               aria-label="open drawer"
               onClick={handleDrawerOpen}
               edge="start"
               sx={[
                  {
                     marginRight: 5
                  },
                  openDrawerSidebar && { display: "none" }
               ]}
            >
               <MenuIcon />
            </IconButton>
            {/* Logo */}
            {/* <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
               <img src={images.logo} className="w-8" />
            </Box>
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
                  textDecoration: "none"
               }}
            >
               {env.NAME_SYSTEM}
            </Typography> */}
            {/* Resto de la barra */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
               {/* <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
               >
                  <MenuIcon />
               </IconButton>
               <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                     vertical: "bottom",
                     horizontal: "left"
                  }}
                  keepMounted
                  transformOrigin={{
                     vertical: "top",
                     horizontal: "left"
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: "block", md: "none" } }}
               >
                  {pages.map((page) => (
                     <MenuItem key={page} onClick={handleCloseNavMenu}>
                        <Typography sx={{ textAlign: "center" }}>{page}</Typography>
                     </MenuItem>
                  ))}
               </Menu> */}
               {/* <img src={images.logo} className="w-12" onClick={() => (window.location.hash = "/app")} /> */}
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}></Box>
            {/* <Typography
               variant="h5"
               noWrap
               component="a"
               href="/app"
               sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none"
               }}
            >
               {env.NAME_SYSTEM}
            </Typography> */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
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
                     <Avatar src={auth.avatar && `${env.API_URL_IMG}/${auth.avatar}`} {...stringAvatar(`${auth.username}`)} />
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
                           filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                           mt: 1.5,
                           "& .MuiAvatar-root": {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1
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
                              zIndex: 0
                           }
                        }
                     }
                  }}
                  transformOrigin={{
                     horizontal: "right",
                     vertical: "top"
                  }}
                  anchorOrigin={{
                     horizontal: "right",
                     vertical: "bottom"
                  }}
               >
                  <MenuItem onClick={handleCloseUserMenu}>
                     <Avatar /> Mi Perfil:&nbsp; <span className="font-black">{auth.username}</span>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClickChangePassword}>
                     <ListItemIcon>
                        <PasswordRounded fontSize="small" />
                     </ListItemIcon>
                     Cambiar Contraseña
                  </MenuItem>
                  <MenuItem onClick={handleClickLogout}>
                     <ListItemIcon>
                        <Logout fontSize="small" />
                     </ListItemIcon>
                     Cerrar Sesión
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
               <ThemeCharger />
            </Box>
         </Toolbar>
         <ChangePasswordForm openDialog={openModalChangePassword} setOpenDialog={setOpenModalChangePassword} container="modal" />
      </AppBar>
   );
}
