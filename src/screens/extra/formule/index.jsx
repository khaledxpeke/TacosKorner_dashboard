import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { tokens } from "../../../theme";
import { IconButton, useTheme,Box,Toolbar,Grid,Container,Typography,Button,AppBar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
getPack,
getPackError,
getPackStatus,
selectAllPack
} from "../../../features/packSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/no_data";

const Pack = () => {
  const dispatch = useDispatch();
  const packStatus = useSelector(getPackStatus);
  const error = useSelector(getPackError);
  const packs = useSelector(selectAllPack);
  const navigate = useNavigate();
  const theme = useTheme();
  const [search, setSearch] = useState("");
  useEffect(() => {
    dispatch(getPack());
  }, [dispatch]);

  let content;
  if (packStatus === "loading") {
    content = <Loading />;
  } else if (packStatus === "error") {
    content = <Error>{error}</Error>;
  } else if (packStatus === "fetchedPack") {
    const filteredPacks = packs?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    content = (
      <>
        {filteredPacks && filteredPacks.length > 0 ? (
          filteredPacks.map((card) => (
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
      navigate("/addFormule");
    };
    return (
      <div className="main-application">
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h3" color="inherit" noWrap>
              Mes Formules
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
              ajouter une formule
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

export default Pack;
