import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { IconButton, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { tokens } from "../../../theme";

import {
  fetchCategories,
  getCategoriesError,
  getCategoriesStatus,
  selectAllCategories,
} from "../../../features/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/no_data";
import AlertDialog from "../../../components/daialog";

const Category = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const error = useSelector(getCategoriesError);
  const categoryStatus = useSelector(getCategoriesStatus);
  const [search, setSearch] = useState("");
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  let content;
  if (categoryStatus === "loading") {
    content = <Loading />;
  } else if (categoryStatus === "error") {
    content = <Error>{error}</Error>;
  } else if (categoryStatus === "allCategories") {
    const filteredCategories = categories?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    content = (
      <>
        {filteredCategories && filteredCategories.length > 0 ? (
          filteredCategories.map((card) => (
            <ProductCard
              data={card}
              content={card.products.length + " Produit"}
              handleClickOpen={() => setOpen(true)}
            />
          ))
        ) : (
          <NoData />
        )}
        <AlertDialog handleClose={() => setOpen(false)} open={open} name={"produit"}/>
      </>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/addCategory");
  };
  const navigate = useNavigate();
  return (
    <div className="main-application">
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h3" color="inherit" noWrap>
            Mes Categories
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
              onChange={(e) => setSearch(e.target.value)}
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
            ajouter une categorie
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          <Grid container spacing={4}>
            {content}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Category;
