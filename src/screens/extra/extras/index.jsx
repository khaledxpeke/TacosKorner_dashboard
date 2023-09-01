import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Container } from "@mui/material";
import {
getExtra,getExtraError,getExtraStatus,getExtraSuccess,deleteExtra,selectAllExtra,updateStatus
} from "../../../features/extraSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/no_data";
import AppBarSearch from "../../../global/appBarSearch";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";

const Extra = () => {
  const dispatch = useDispatch();
  const extraStatus = useSelector(getExtraStatus);
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

  let content;
  if (extraStatus === "loading") {
    content = <Loading />;
  } else if (extraStatus === "fetchError") {
    content = <Error>{error}</Error>;
  } else if (extraStatus === "fetchData") {
    const filteredExtras = extras?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    content = (
      <>
        {filteredExtras && filteredExtras.length > 0 ? (
          filteredExtras.map((card) => (
            <ProductCard
              key={card._id}
              data={card}
              handleModify={() => handleModify(card)}
              content={card.price}
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
          deleteData={deleteExtra(cardId)}
        />
      </>
    );
  }
  useEffect(() => {
    if (extraStatus === "deleteSuccess") {
      toast.success(success);
      dispatch(getExtra());
      dispatch(updateStatus());
    } else if (extraStatus === "deleteError") {
      toast.error(error);
    }
  }, [extraStatus, error, success, dispatch]);
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
            {content}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Extra;