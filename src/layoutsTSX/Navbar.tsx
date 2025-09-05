import { MouseEvent, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import AdbIcon from "@mui/icons-material/Adb";
import {
   Avatar,
   Menu,
   MenuItem,
   Select,
   Tooltip,
   useColorScheme,
} from "@mui/material";
import { Logout, Settings } from "@mui/icons-material";
import { useGlobalContext } from "../context/GlobalContext";
import env from "../constant/env";

const drawerWidth = 240;
const pages = ["Products", "Pricing", "Blog"];
// const settings = ["Profile", "Account", "Dashboard", "Logout"];

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

// const transitionTime = "1s";

export default function Navbar() {
   // const theme = useTheme();
   // const [disableTransition, setDisableTransition] = useState(false);
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
            {/* <FormControlLabel
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
            /> */}
         </>
      );
   }
   // const [open, setOpenDrawerSidebar] = useState(false);
   const { openDrawerSidebar, setOpenDrawerSidebar } = useGlobalContext();

   const handleDrawerOpen = () => {
      setOpenDrawerSidebar(true);
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
      <AppBar
         position="fixed"
         open={openDrawerSidebar}
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
                  openDrawerSidebar && { display: "none" },
               ]}>
               <MenuIcon />
            </IconButton>
            {/* Logo */}
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
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
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
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
                           filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
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
   );
}
