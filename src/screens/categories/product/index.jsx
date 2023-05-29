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
import { useSelector, useDispatch } from "react-redux";
import { tokens } from "../../../theme";
import { IconButton, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  getProducts,
  getProductsError,
  getProductsStatus,
  selectAllProducts,
} from "../../../features/productSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/no_data";

const Formule = () => {
  const dispatch = useDispatch();
  const productStatus = useSelector(getProductsStatus);
  const error = useSelector(getProductsError);
  const products = useSelector(selectAllProducts);
  const navigate = useNavigate();
  const theme = useTheme();
  const [search, setSearch] = useState("");
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  let content;
  if (productStatus === "loading") {
    content = <Loading />;
  } else if (productStatus === "error") {
    content = <Error>{error}</Error>;
  } else if (productStatus === "fetchedProducts") {
    const filteredProducts = products?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    content = (
      <>
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((card) => <ProductCard data={card} content={card.price + " " + card.currency}/>)
        ) : (
          <NoData />
        )}
      </>
    );

    const colors = tokens(theme.palette.mode);
    const handleSubmit = (event) => {
      event.preventDefault();
      navigate("/addProduct");
    };
    return (
      <div className="main-application">
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h3" color="inherit" noWrap>
            Mes produits
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
  }
};

export default Formule;
