import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import AddIcon from "@mui/icons-material/Add";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector, useDispatch } from "react-redux";
import { tokens } from "../../../theme";
import { IconButton, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import {
  getProducts,
  getProductsError,
  getProductsStatus,
  selectAllProducts,
} from "../../../features/productSlice";
import Loading from "../../../components/loading";

const Product = () => {
  const dispatch = useDispatch();
  const productStatus = useSelector(getProductsStatus);
  const error = useSelector(getProductsError);
  const products = useSelector(selectAllProducts);
  const navigate = useNavigate();
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  let content;
  if (productStatus === "loading") {
    content = <Loading />;
  } else if (productStatus === "error") {
    content = <div>{error}</div>;
  } else if (productStatus === "fetchedProducts") {
    content = (  <>
      {products && products.length > 0 ? (
        products.map((card) => (
          <Grid item key={card._id} xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="div"
                 sx={{
                      objectFit: "cover",
                      height: 0,
                      paddingTop: "56.25%",
                      backgroundImage: `url(http://localhost:3300/api/${card.image})`,
                      backgroundColor: isLightMode ? "#F0F0F7" : "dark",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "contain",
                    }}
                image={`http://localhost:3300/api/${card.image.replace("\\", "/")}`}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.name}
                </Typography>
                <Typography variant="h7" color="text.secondary">
                  {card.price} {card.currency}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<DeleteForeverIcon />}
                  style={{ color: "white" }}
                >
                  Supprimer
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  startIcon={<EditIcon />}
                  style={{ color: "white" }}
                >
                  Modifier
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))
      ) : (
        <Box>No data available</Box>
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
            Mes Produits
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
            ajouter une produit
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Grid container spacing={4}>
           {content}
          </Grid>
        </Container>
      </main>
    </div>
  );
};}

export default Product;
