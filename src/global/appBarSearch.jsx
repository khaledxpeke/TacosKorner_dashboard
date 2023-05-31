import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { tokens } from "../theme";
import { useTheme } from "@emotion/react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const AppBarSearch = ({ handleSubmit, handleSearch ,title,buttonTitle}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <AppBar position="relative">
      <Toolbar>
        <Typography variant="h3" color="inherit" noWrap>
          {title}
        </Typography>
        <Box
          ml={2}
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
        >
          <input
            type="text"
            placeholder="Search"
            className="search-input pl-2"
            style={{ paddingLeft: "10px", width: "300px" }}
            onChange={handleSearch}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          style={{ marginLeft: "auto" }}
          onClick={handleSubmit}
        >
          {buttonTitle}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarSearch;
