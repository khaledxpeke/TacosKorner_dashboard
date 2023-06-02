import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteSupplement,
  getSupplements,
  getSupplementsError,
  getSupplementsStatus,
  getSupplementsSuccess,
  selectAllSupplements,
  updateStatus,
} from "../../../features/supplementSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/no_data";
import AppBarSearch from "../../../global/appBarSearch";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";
const Supplement = () => {
  const dispatch = useDispatch();
  const supplementStatus = useSelector(getSupplementsStatus);
  const error = useSelector(getSupplementsError);
  const supplements = useSelector(selectAllSupplements);
  const success = useSelector(getSupplementsSuccess);
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
    navigate("/addSupplement");
  };
  const handleModify = (data) => {
    navigate("/modifySupplement", { state: { supplement: data } });
  };
  useEffect(() => {
    dispatch(getSupplements());
  }, [dispatch]);

  let content;
  if (supplementStatus === "loading") {
    content = <Loading />;
  } else if (supplementStatus === "fetchError") {
    content = <Error>{error}</Error>;
  } else if (supplementStatus === "fetchData") {
    const filteredSupplements = supplements?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    console.log(filteredSupplements)
    content = (
      <>
        {filteredSupplements && filteredSupplements.length > 0 ? (
          filteredSupplements.map((card) => (
            <ProductCard
              data={card}
              key={card._id}
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
          deleteData={deleteSupplement(cardId)}
        />
      </>
    );
        }
  useEffect(() => {
    if (supplementStatus === "deleteSuccess") {
      toast.success(success);
      dispatch(getSupplements());
      dispatch(updateStatus());
    } else if (supplementStatus === "deleteError") {
      supplementStatus.error(error);
    }
  }, [supplementStatus, error, success, dispatch]);
    return (
      <div className="main-application">
        <CssBaseline />
        <AppBarSearch
          handleSubmit={handleSubmit}
          handleSearch={(e) => setSearch(e.target.value)}
          title={"Mes supplements"}
          buttonTitle={"Ajouter un supplement"}
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

export default Supplement;
