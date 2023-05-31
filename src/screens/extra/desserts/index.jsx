import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Grid,Container } from "@mui/material";
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
import AppBarSearch from "../../../global/appBarSearch";

const Desert = () => {
  const dispatch = useDispatch();
  const desertStatus = useSelector(getDesertsStatus);
  const error = useSelector(getDesertsError);
  const deserts = useSelector(selectAllDeserts);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  useEffect(() => {
    dispatch(getDeserts());
  }, [dispatch]);

  let content;
  if (desertStatus === "loading") {
    content = <Loading />;
  } else if (desertStatus === "fetchError") {
    content = <Error>{error}</Error>;
  } else if (desertStatus === "fetchData") {
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
    const handleSubmit = (event) => {
      event.preventDefault();
      navigate("/addDesert");
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

export default Desert;
