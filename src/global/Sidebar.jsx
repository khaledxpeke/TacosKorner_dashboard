import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import KebabDiningIcon from "@mui/icons-material/KebabDining";
import SoupKitchenIcon from "@mui/icons-material/SoupKitchen";
import ChecklistIcon from "@mui/icons-material/Checklist";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import IcecreamIcon from "@mui/icons-material/Icecream";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import jwtDecode from "jwt-decode";
import LiquorIcon from "@mui/icons-material/Liquor";
import { useResponsive } from "../hooks/uiHook";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const { isSmallScreen } = useResponsive();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(isSmallScreen);
  useEffect(() => {
    setIsCollapsed(isSmallScreen);
    
  }, [isSmallScreen]);
  const [selected, setSelected] = useState("Dashboard");
  const [sidebarHeight, setSidebarHeight] = useState("100vh");
  const output = window.localStorage.getItem("token");
  const token = output ? JSON.parse(output) : null;
  const decodedToken = token ? jwtDecode(token) : null;
  const user = decodedToken.user || null;
  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      setSidebarHeight(windowHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
      className="sidebar"
    >
      <Box
        sx={{
          // ... existing styles ...
          height: sidebarHeight,
        }}
      >
        <Box>
          <ProSidebar collapsed={isCollapsed}>
            <Menu iconShape="square">
              {/* LOGO AND MENU ICON */}
              <MenuItem
                onClick={() =>
                  setIsCollapsed(isSmallScreen ? true : !isCollapsed)
                }
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{
                  margin: "10px 0 20px 0",
                  color: colors.grey[100],
                }}
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="15px"
                  >
                    <Typography variant="h3" color={colors.grey[100]}>
                      DASHBOARD
                    </Typography>
                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>

              {!isCollapsed && user && (
                <Box mb="25px">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      alt="profile-user"
                      width="100px"
                      height="100px"
                      src="../../assets/user.png"
                      style={{ cursor: "pointer", borderRadius: "50%" }}
                    />
                  </Box>
                  <Box textAlign="center">
                    <Typography
                      variant="h2"
                      color={colors.grey[100]}
                      fontWeight="bold"
                      sx={{ m: "10px 0 0 0" }}
                    >
                      {user.fullName ? user.fullName : "Admin name"}
                    </Typography>
                    <Typography variant="h5" color={colors.greenAccent[500]}>
                      Admin
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                <Item
                  title="Accueil"
                  to="/"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Catégories
                </Typography>
                <Item
                  title="Catégorie"
                  to="/category"
                  icon={<CategoryIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Produit"
                  to="/product"
                  icon={<DinnerDiningIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Addons
                </Typography>
                <Item
                  title="Ingrediants"
                  to="/ingrediants"
                  icon={<KebabDiningIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Supplements"
                  to="/supplements"
                  icon={<SoupKitchenIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Etapes"
                  to="/type"
                  icon={<ChecklistIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Extra
                </Typography>
                <Item
                  title="Extras"
                  to="/extra"
                  icon={<FastfoodIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Boissons"
                  to="/drink"
                  icon={<LiquorIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Désert"
                  to="/desert"
                  icon={<IcecreamIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  History
                </Typography>
                <Item
                  title="History"
                  to="/history"
                  icon={<ManageSearchIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>
            </Menu>
          </ProSidebar>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
