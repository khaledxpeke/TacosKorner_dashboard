import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getSupplements,
  getSupplementsError,
  getSupplementsStatus,
  selectAllSupplements,
} from "../../../features/supplementSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/no_data";
import AppBarSearch from "../../../global/appBarSearch";

const Supplement = () => {
  const dispatch = useDispatch();
  const supplementStatus = useSelector(getSupplementsStatus);
  const error = useSelector(getSupplementsError);
  const supplements = useSelector(selectAllSupplements);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  useEffect(() => {
    dispatch(getSupplements());
  }, [dispatch]);

  let content;
  if (supplementStatus === "loading") {
    content = <Loading />;
  } else if (supplementStatus === "fetchError") {
    content = <Error>{error}</Error>;
  } else if (supplementStatus === "fetchData") {
    const filteredSupplements = supplements?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    content = (
      <>
        {filteredSupplements && filteredSupplements.length > 0 ? (
          filteredSupplements.map((card) => (
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
      navigate("/addSupplement");
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

export default Supplement;
