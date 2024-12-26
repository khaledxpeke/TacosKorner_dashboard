import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteDrink,
  getDrinks,
  getDrinksError,
  getDrinksStatus,
  selectAllDrinks,
  getDrinksSuccess,
  updateStatus,
} from "../../../features/drinkSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/no_data";
import AppBarSearch from "../../../global/appBarSearch";
import { Chip, Container, Grid, Stack, Typography } from "@mui/material";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";

const Drink = () => {
  const [filteredDrinks, setFilteredDrinks] = useState([]);
  const dispatch = useDispatch();
  const status = useSelector(getDrinksStatus);
  const error = useSelector(getDrinksError);
  const drinks = useSelector(selectAllDrinks);
  const success = useSelector(getDrinksSuccess);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [cardId, setCardId] = useState(null);
  const handleClickOpen = (cardId) => {
    setOpen(true);
    setCardId(cardId);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/addDrink");
  };
  const handleModify = (data) => {
    navigate("/modifyDrink", { state: { drink: data } });
  };
  useEffect(() => {
    dispatch(getDrinks());
  }, [dispatch]);

  useEffect(() => {
    if (status === "fetchData") {
      setFilteredDrinks(
        drinks?.filter((dish) =>
          dish.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [drinks, search, status]);

  useEffect(() => {
    if (status === "deleteSuccess") {
      toast.success(success);
      setFilteredDrinks((prev) => prev.filter((item) => item._id !== cardId));
      dispatch(updateStatus());
    } else if (status === "deleteError") {
      toast.error(error);
    }
  }, [status, error, success, dispatch, cardId]);
  return (
    <div className="main-application">
      <CssBaseline />
      <AppBarSearch
        handleSubmit={handleSubmit}
        handleSearch={(e) => setSearch(e.target.value)}
        title={"Mes boissons"}
        buttonTitle={"Ajouter un boisson"}
      />
      <main>
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          <Grid container spacing={4}>
            {status === "loading" ? (
              <Loading />
            ) : status === "fetchError" ? (
              <Error>{error}</Error>
            ) : (
              <>
                {filteredDrinks && filteredDrinks.length > 0 ? (
                  filteredDrinks.map((card) => (
                    <ProductCard
                      key={card._id}
                      data={card}
                      handleModify={() => handleModify(card)}
                      content={
                        <>
                          <Typography variant="h4" color="inherit">
                            Prix: {card.price ?? 0}
                          </Typography>
                          <Stack
                            justifyContent="space-between"
                            alignItems="center"
                            direction="row"
                            sx={{ mt: 1 }}
                          >
                            <Chip
                              variant="outlined"
                              label={
                                card.outOfStock
                                  ? "Rupture de stock"
                                  : "En stock"
                              }
                              color={card.outOfStock ? "error" : "success"}
                            />
                            <Chip
                              variant="outlined"
                              label={card.visible ? "Visible" : "Caché"}
                              color={card.visible ? "success" : "error"}
                            />
                          </Stack>
                        </>
                      }
                      handleClickOpen={() => handleClickOpen(card._id)}
                    />
                  ))
                ) : (
                  <NoData />
                )}
                <AlertDialog
                  handleClose={() => setOpen(false)}
                  open={open}
                  name={"boisson"}
                  cardId={cardId}
                  deleteData={deleteDrink(cardId)}
                />
              </>
            )}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Drink;
