import React from "react";
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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';


const cards = [1, 2, 3, 4, 5 , 6 , 7, 8 , 9 , 10 , 11 , 12 , 13];

const Category = () => {
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
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={3}>
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
                      paddingTop: "56.25%",
                    }}
                    image="https://source.unsplash.com/random?wallpapers"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Burger 
                    </Typography>
                    <Typography variant="h7" color="text.secondary">
                        5 produits
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
            ))}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Category;
