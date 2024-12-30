import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Container, Chip, Stack, Typography } from "@mui/material";
import {
  getExtra,
  getExtraError,
  getExtraStatus,
  getExtraSuccess,
  deleteExtra,
  selectAllExtra,
  updateStatus,
} from "../../../features/extraSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/noData";
import AppBarSearch from "../../../global/appBarSearch";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";

const Extra = () => {
  const [filteredExtras, setFilteredExtras] = useState([]);
  const dispatch = useDispatch();
  const status = useSelector(getExtraStatus);
  const error = useSelector(getExtraError);
  const extras = useSelector(selectAllExtra);
  const success = useSelector(getExtraSuccess);
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
    navigate("/addExtra");
  };
  const handleModify = (data) => {
    navigate("/modifyExtra", { state: { extra: data } });
  };
  useEffect(() => {
    dispatch(getExtra());
  }, [dispatch]);

  useEffect(() => {
    if (status === "fetchData") {
      setFilteredExtras(
        extras?.filter((dish) =>
          dish.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [extras, search, status]);

  useEffect(() => {
    if (status === "deleteSuccess") {
      toast.success(success);
      setFilteredExtras((prev) => prev.filter((item) => item._id !== cardId));
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
        title={"Mes extras"}
        buttonTitle={"Ajouter un extra"}
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
                {filteredExtras && filteredExtras.length > 0 ? (
                  filteredExtras.map((card) => (
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
                  name={"extra"}
                  cardId={cardId}
                  deleteData={deleteExtra(cardId)}
                />
              </>
            )}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Extra;
