import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteIngrediant,
  getIngrediants,
  getIngrediantsError,
  getIngrediantsStatus,
  selectAllIngrediants,
  getIngrediantsSuccess,
  updateStatus,
} from "../../../features/ingrediantSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/no_data";
import AppBarSearch from "../../../global/appBarSearch";
import { Box, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";
import { getSettings, selectAllSettings } from "../../../features/settingSlice";

const Ingrediant = () => {
  const dispatch = useDispatch();
  const ingrediantStatus = useSelector(getIngrediantsStatus);
  const error = useSelector(getIngrediantsError);
  const ingrediants = useSelector(selectAllIngrediants);
  const success = useSelector(getIngrediantsSuccess);
  const settings = useSelector(selectAllSettings);
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
    navigate("/addIngrediant");
  };
  const truncateText = (text, limit = 30) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit).trim() + "...";
  };
  const handleModify = (data) => {
    navigate("/modifyIngrediant", { state: { ingrediant: data } });
  };
  useEffect(() => {
    dispatch(getIngrediants());
    dispatch(getSettings());
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
          filteredIngrediants.map((card) => (
            <ProductCard
              key={card._id}
              data={card}
              handleModify={() => handleModify(card)}
              handleClickOpen={() => handleClickOpen(card._id)}
              content={
                <>
                  <Box
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "200px",
                    }}
                  >
                    Options:{" "}
                    {truncateText(
                      card.types?.map((type) => type.name).join(", ")
                    )}
                  </Box>
                  <Typography variant="h4" color="inherit">
                    Prix: {card.price ?? 0} {" " + settings.defaultCurrency}
                  </Typography>
                  <Typography variant="h4" color="inherit">
                    Prix supplémentaire: {card.suppPrice ?? 0}
                    {" " + settings.defaultCurrency}
                  </Typography>
                  <Stack direction="row" sx={{ mt: 1 }}>
                    <Chip
                      variant="outlined"
                      label={card.outOfStock ? "Rupture de stock" : "En stock"}
                      color={card.outOfStock ? "error" : "success"}
                    />
                  </Stack>
                </>
              }
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
          deleteData={deleteIngrediant(cardId)}
        />
      </>
    );
  }
  useEffect(() => {
    if (ingrediantStatus === "deleteSuccess") {
      toast.success(success);
      dispatch(getIngrediants());
      dispatch(updateStatus());
    } else if (ingrediantStatus === "deleteError") {
      toast.error(error);
    }
  }, [ingrediantStatus, error, success, dispatch]);
  return (
    <div className="main-application">
      <CssBaseline />
      <AppBarSearch
        handleSubmit={handleSubmit}
        handleSearch={(e) => setSearch(e.target.value)}
        title={"Mes ingrédiants"}
        buttonTitle={"Ajouter un ingrédiant"}
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

export default Ingrediant;
