import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Container } from "@mui/material";
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
import NoData from "../../../components/no_data";
import AppBarSearch from "../../../global/appBarSearch";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";

const Desert = () => {
  const dispatch = useDispatch();
  const desertStatus = useSelector(getDesertsStatus);
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

  let content;
  if (desertStatus === "loading") {
    content = <Loading />;
  } else if (desertStatus === "fetchError") {
    content = <Error>{error}</Error>;
  } else if (desertStatus === "fetchData") {
    const filteredDeserts = deserts?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    content = (
      <>
        {filteredDeserts && filteredDeserts.length > 0 ? (
          filteredDeserts.map((card) => (
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
          name={"dessert"}
          cardId={cardId}
          deleteData={deleteDesert(cardId)}
        />
      </>
    );
  }
  useEffect(() => {
    if (desertStatus === "deleteSuccess") {
      toast.success(success);
      dispatch(getDeserts());
      dispatch(updateStatus());
    } else if (desertStatus === "deleteError") {
      toast.error(error);
    }
  }, [desertStatus, error, success, dispatch]);
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
            {content}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Desert;
