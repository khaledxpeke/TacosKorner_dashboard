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
import NoData from "../../../components/noData";
import AppBarSearch from "../../../global/appBarSearch";
import { Box, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";
import { getSettings, selectAllSettings } from "../../../features/settingSlice";

const Ingrediant = () => {
  const [filteredIngrediants, setFilteredIngrediants] = useState([]);
  const dispatch = useDispatch();
  const status = useSelector(getIngrediantsStatus);
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

  useEffect(() => {
    if (status === "fetchData") {
      setFilteredIngrediants(
        ingrediants?.filter((dish) =>
          dish.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [ingrediants, search, status]);

  useEffect(() => {
    if (status === "deleteSuccess") {
      toast.success(success);
      setFilteredIngrediants((prev) =>
        prev.filter((item) => item._id !== cardId)
      );
      dispatch(updateStatus());
    } else if (status === "deleteError") {
      toast.error(error);
    }
  }, [cardId, dispatch, error, status, success]);
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
            {status === "loading" ? (
              <Loading />
            ) : status === "fetchError" ? (
              <Error>{error}</Error>
            ) : (
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
                            Prix: {card.price ?? 0}
                            {" " + settings.defaultCurrency}
                          </Typography>
                          <Typography variant="h4" color="inherit">
                            Prix supplémentaire: {card.suppPrice ?? 0}
                            {" " + settings.defaultCurrency}
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
                    />
                  ))
                ) : (
                  <NoData />
                )}
                <AlertDialog
                  handleClose={() => setOpen(false)}
                  open={open}
                  name={"ingrédient"}
                  cardId={cardId}
                  deleteData={deleteIngrediant(cardId)}
                />
              </>
            )}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Ingrediant;
