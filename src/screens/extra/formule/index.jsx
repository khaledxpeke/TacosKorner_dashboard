import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Container } from "@mui/material";
import {
  deletePack,
  getPack,
  getPackError,
  getPackStatus,
  getPackSuccess,
  selectAllPack,
  updateStatus,
} from "../../../features/packSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/no_data";
import AppBarSearch from "../../../global/appBarSearch";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";

const Pack = () => {
  const dispatch = useDispatch();
  const packStatus = useSelector(getPackStatus);
  const error = useSelector(getPackError);
  const packs = useSelector(selectAllPack);
  const success = useSelector(getPackSuccess);
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
    navigate("/addFormule");
  };
  const handleModify = (data) => {
    navigate("/modifyPack", { state: { pack: data } });
  };
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
              key={card._id}
              data={card}
              handleModify={() => handleModify(card)}
              content={card.price + " " + card.currency}
              handleClickOpen={() => handleClickOpen(card._id)}
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
          deleteData={deletePack(cardId)}
        />
      </>
    );
  }
  useEffect(() => {
    if (packStatus === "deleteSuccess") {
      toast.success(success);
      dispatch(getPack());
      dispatch(updateStatus());
    } else if (packStatus === "deleteError") {
      toast.error(error);
    }
  }, [packStatus, error, success, dispatch]);
  return (
    <div className="main-application">
      <CssBaseline />
      <AppBarSearch
        handleSubmit={handleSubmit}
        handleSearch={(e) => setSearch(e.target.value)}
        title={"Mes formules"}
        buttonTitle={"Ajouter un formule"}
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

export default Pack;
