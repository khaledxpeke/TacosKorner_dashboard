import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Container } from "@mui/material";
import {
  getPack,
  getPackError,
  getPackStatus,
  selectAllPack,
} from "../../../features/packSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/no_data";
import AppBarSearch from "../../../global/appBarSearch";

const Pack = () => {
  const dispatch = useDispatch();
  const packStatus = useSelector(getPackStatus);
  const error = useSelector(getPackError);
  const packs = useSelector(selectAllPack);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  useEffect(() => {
    dispatch(getPack());
  }, [dispatch]);

  let content;
  if (packStatus === "loading") {
    content = <Loading />;
  } else if (packStatus === "fetchError") {
    content = <Error>{error}</Error>;
  } else if (packStatus === "fetchData") {
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
    const handleSubmit = (event) => {
      event.preventDefault();
      navigate("/addFormule");
    };
    return (
      <div className="main-application">
        <CssBaseline />
        <AppBarSearch
          handleSubmit={handleSubmit}
          handleSearch={(e) => setSearch(e.target.value)}
        />
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

export default Pack;
