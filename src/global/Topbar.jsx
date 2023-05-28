import {
  Box,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../theme";
import { InputBase } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
const Topbar = ({ userLoggedIn }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear user session or reset state
    // For example, reset userLoggedIn and userImage
    // Set userLoggedIn and userImage to initial values
    // or clear them based on your implementation
    // For example:
    // setUserLoggedIn(false);
    // setUserImage('');

    // Redirect to the sign-in page after logout
    navigate("/signin");
  };
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2} className="topbar">
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <input type="text" placeholder="Search" className="search-input" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex" >
        <Box display="flex" justifyContent="center" alignItems="center">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          <IconButton>
            <LanguageIcon />
          </IconButton>

          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
          <Typography
            variant="body1"
            sx={{ marginLeft: "8px", fontWeight: "bold" }}
          >
            Logout
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
