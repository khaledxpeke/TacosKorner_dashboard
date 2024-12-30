import {
  Box,
  IconButton,
  useTheme,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ButtonBase,
  ListItemIcon,
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import TuneIcon from "@mui/icons-material/Tune";
import CollectionsIcon from "@mui/icons-material/Collections";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useDispatch } from "react-redux";
import { logOut } from "../features/authSlice";

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const colors = tokens(theme.palette.mode);
  const [isParameterListOpen, setIsParameterListOpen] = useState(false);
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logOut());
    navigate("/signin");
  };

  const toggleParameterList = () => {
    setIsParameterListOpen((prev) => !prev);
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2} className="topbar">
      {/* SEARCH BAR */}
      <Box display="flex" alignItems="center">
        <img src={logo} alt="logo" height={50} />
        <Typography variant="h2" sx={{ marginLeft: "8px", fontWeight: "bold" }}>
          Tacos Korner
        </Typography>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <Box display="flex" justifyContent="center" alignItems="center">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          <Box position="relative" zIndex={4}>
            <IconButton onClick={toggleParameterList}>
              <SettingsIcon />
            </IconButton>
            <Collapse
              in={isParameterListOpen}
              timeout="auto"
              unmountOnExit
              sx={{
                position: "absolute",
                right: 0,
                top: "40px",
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "4px",
                boxShadow: theme.shadows[3],
              }}
            >
              <List>
                <ButtonBase
                  component="div"
                  onClick={() => {
                    navigate("/settings");
                    toggleParameterList();
                  }}
                  style={{ width: "100%" }}
                  sx={{
                    "&:hover": {
                      backgroundColor: colors.primary[400],
                    },
                    textAlign: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ListItem>
                    <ListItemIcon>
                      <TuneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Paramètres" />
                  </ListItem>
                </ButtonBase>
                <ButtonBase
                  component="div"
                  onClick={() => {
                    navigate("/carousel");
                    toggleParameterList();
                  }}
                  style={{ width: "100%" }}
                  sx={{
                    "&:hover": {
                      backgroundColor: colors.primary[400],
                    },
                    textAlign: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ListItem>
                    <ListItemIcon>
                      <CollectionsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Carousel" />
                  </ListItem>
                </ButtonBase>
              </List>
            </Collapse>
          </Box>

          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Logout
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
