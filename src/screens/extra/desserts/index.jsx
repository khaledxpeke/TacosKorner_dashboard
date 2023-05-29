import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { tokens } from "../../../theme";
import { IconButton, useTheme,Box,Toolbar,Grid,Container,Typography,Button,AppBar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
getDeserts,
getDesertsError,
getDesertsStatus,
selectAllDeserts
} from "../../../features/desertSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/no_data";

const Desert = () => {
  const dispatch = useDispatch();
  const desertStatus = useSelector(getDesertsStatus);
  const error = useSelector(getDesertsError);
  const deserts = useSelector(selectAllDeserts);
  const navigate = useNavigate();
  const theme = useTheme();
  const [search, setSearch] = useState("");
  useEffect(() => {
    dispatch(getDeserts());
  }, [dispatch]);

  let content;
  if (desertStatus === "loading") {
    content = <Loading />;
  } else if (desertStatus === "error") {
    content = <Error>{error}</Error>;
  } else if (desertStatus === "fetchedDeserts") {
    const filteredDeserts = deserts?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    content = (
      <>
        {filteredDeserts && filteredDeserts.length > 0 ? (
          filteredDeserts.map((card) => (
            <ProductCard
              data={card}
              content={card.price + " " + card.currency}
            />
          ))
        ) : (
          <NoData />
        )}
      </>
    );

    const colors = tokens(theme.palette.mode);
    const handleSubmit = (event) => {
      event.preventDefault();
      navigate("/addDesert");
    };
    return (
      <div className="main-application">
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h3" color="inherit" noWrap>
              Mes Desserts
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
              ajouter un dessert
            </Button>
          </Toolbar>
        </AppBar>
        <main>
          <Container maxWidth="lg" sx={{ mt: 2,mb:2 }}>
            <Grid container spacing={4}>
              {content}
            </Grid>
          </Container>
        </main>
      </div>
    );
  }
};

export default Desert;
