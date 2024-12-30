import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Container, Typography, Stack, Chip } from "@mui/material";
import {
  deleteDesert,
  getDeserts,
  getDesertsError,
  getDesertsStatus,
  getDesertsSuccess,
  selectAllDeserts,
  updateStatus,
} from "../../../features/desertSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/noData";
import AppBarSearch from "../../../global/appBarSearch";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";

const Desert = () => {
  const [filteredDeserts, setFilteredDeserts] = useState([]);
  const dispatch = useDispatch();
  const status = useSelector(getDesertsStatus);
  const error = useSelector(getDesertsError);
  const deserts = useSelector(selectAllDeserts);
  const success = useSelector(getDesertsSuccess);
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
    navigate("/addDesert");
  };
  const handleModify = (data) => {
    navigate("/modifyDesert", { state: { desert: data } });
  };
  useEffect(() => {
    dispatch(getDeserts());
  }, [dispatch]);

  useEffect(() => {
    if (status === "fetchData") {
      setFilteredDeserts(
        deserts?.filter((dish) =>
          dish.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [deserts, search, status]);

  useEffect(() => {
    if (status === "deleteSuccess") {
      toast.success(success);
      setFilteredDeserts((prev) => prev.filter((item) => item._id !== cardId));
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
        title={"Mes desserts"}
        buttonTitle={"Ajouter un dessert"}
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
                {filteredDeserts && filteredDeserts.length > 0 ? (
                  filteredDeserts.map((card) => (
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
                  name={"dessert"}
                  cardId={cardId}
                  deleteData={deleteDesert(cardId)}
                />
              </>
            )}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Desert;
