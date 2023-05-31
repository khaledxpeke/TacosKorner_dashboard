import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getIngrediants,
  getIngrediantsError,
  getIngrediantsStatus,
  selectAllIngrediants,
} from "../../../features/ingrediantSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/no_data";
import AppBarSearch from "../../../global/appBarSearch";
import { Container, Grid } from "@mui/material";

const Ingrediant = () => {
  const dispatch = useDispatch();
  const ingrediantStatus = useSelector(getIngrediantsStatus);
  const error = useSelector(getIngrediantsError);
  const ingrediants = useSelector(selectAllIngrediants);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  useEffect(() => {
    dispatch(getIngrediants());
  }, [dispatch]);

  let content;
  if (ingrediantStatus === "loading") {
    content = <Loading />;
  } else if (ingrediantStatus === "fetchError") {
    content = <Error>{error}</Error>;
  } else if (ingrediantStatus === "fetchData") {
    const filteredIngrediants = ingrediants?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    content = (
      <>
        {filteredIngrediants && filteredIngrediants.length > 0 ? (
          filteredIngrediants.map((card) => <ProductCard data={card} />)
        ) : (
          <NoData />
        )}
      </>
    );
    const handleSubmit = (event) => {
      event.preventDefault();
      navigate("/addIngrediant");
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

export default Ingrediant;
