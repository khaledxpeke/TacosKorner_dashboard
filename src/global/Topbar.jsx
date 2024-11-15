import { Box, IconButton, useTheme, Typography } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LanguageIcon from "@mui/icons-material/Language";
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
  const handleLogout = (e) => {
    e.preventDefault();
      dispatch(logOut());
      navigate("/signin");
  };
  const handleCurrency = (e) => {
    e.preventDefault();
      navigate("/currency");
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
          <IconButton  onClick={handleCurrency}>
            <LanguageIcon />
          </IconButton>

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
