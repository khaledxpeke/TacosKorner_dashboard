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
import { useTheme } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../../actions/productActions";

const Product = () => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/addProduct");
  };
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  return (
    <div className="main-application">
      <CssBaseline />
      <AppBar position="relative" >
        <Toolbar>
          <Typography variant="h3" color="inherit" noWrap>
            Mes Produits
          </Typography>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            style={{ marginLeft: "auto" }}
            onClick={handleSubmit}
          >
            Ajouter un Produit
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Grid container spacing={4}>
            {products.length === 0 ? (
              <Typography variant="h6">No products available</Typography>
            ) : (
              products.map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="div" // Revert this line to "div"
                      sx={{
                        objectFit: "cover",
                        height: 0,
                        paddingTop: "56.25%",
                        backgroundImage: `url(http://localhost:3300/api/${product.image})`,
                        backgroundColor: isLightMode ? "#F0F0F7" : "dark",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                      }}
                      image={`http://localhost:3300/api/${product.image.replace(
                        /\\/g,
                        "/"
                      )}`}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        backgroundColor: isLightMode ? "#F0F0F7" : "dark",
                      }}
                    >
                      <Typography gutterBottom variant="h5" component="h2">
                        {product.name}
                      </Typography>
                      <Typography variant="h7" color="text.secondary">
                        {product.price} {product.currency}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{
                        backgroundColor: isLightMode ? "#F0F0F7" : "dark",
                      }}
                    >
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
            )}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      {/* <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box> */}
      {/* End footer */}
    </div>
  );
};

export default Product;
