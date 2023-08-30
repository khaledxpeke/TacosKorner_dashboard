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
import { Container, Grid } from "@mui/material";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";

const Drink = () => {
  const dispatch = useDispatch();
  const drinkStatus = useSelector(getDrinksStatus);
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

  let content;
  if (drinkStatus === "loading") {
    content = <Loading />;
  } else if (drinkStatus === "fetchError") {
    content = <Error>{error}</Error>;
  } else if (drinkStatus === "fetchData") {
    const filteredDrinks = drinks?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    content = (
      <>
        {filteredDrinks && filteredDrinks.length > 0 ? (
          filteredDrinks.map((card) => (
            <ProductCard
              key={card._id}
              data={card}
              handleModify={() => handleModify(card)}
              handleClickOpen={() => handleClickOpen(card._id)}
              content={card.price}
            />
          ))
        ) : (
          <NoData />
        )}
        <AlertDialog
          handleClose={() => setOpen(false)}
          open={open}
          name={"produit"}
          cardId={cardId}
          deleteData={deleteDrink(cardId)}
        />
      </>
    );
  }
  useEffect(() => {
    if (drinkStatus === "deleteSuccess") {
      toast.success(success);
      dispatch(getDrinks());
      dispatch(updateStatus());
    } else if (drinkStatus === "deleteError") {
      toast.error(error);
    }
  }, [drinkStatus, error, success, dispatch]);
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
            {content}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Drink;
