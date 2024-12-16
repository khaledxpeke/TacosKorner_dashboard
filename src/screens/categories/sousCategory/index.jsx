import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Container } from "@mui/material";
import {
  deleteProduct,
  getProducts,
  getProductsError,
  getProductsStatus,
  selectAllProducts,
  getProductsSuccess,
  updateStatus,
} from "../../../features/productSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/no_data";
import AppBarSearch from "../../../global/appBarSearch";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";
import { getSettings, selectAllSettings } from "../../../features/settingSlice";

const SousCategory = () => {
  const dispatch = useDispatch();
  const productStatus = useSelector(getProductsStatus);
  const error = useSelector(getProductsError);
  const products = useSelector(selectAllProducts);
  const settings = useSelector(selectAllSettings);
  const success = useSelector(getProductsSuccess);
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
    navigate("/addProduct");
  };
  const handleModify = (data) => {
    navigate("/modifyProduct", { state: { product: data } });
  };
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getSettings());
  }, [dispatch]);
  let content;
  if (productStatus === "loading") {
    content = <Loading />;
  } else if (productStatus === "fetchError") {
    content = <Error>{error}</Error>;
  } else if (productStatus === "fetchData") {
    const filteredProducts = products?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    content = (
      <>
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((card) => (
            <ProductCard
              key={card._id}
              data={card}
              handleModify={() => handleModify(card)}
              content={card.price + " " + settings.defaultCurrency}
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
          deleteData={deleteProduct(cardId)}
        />
      </>
    );
  }
  useEffect(() => {
    if (productStatus === "deleteSuccess") {
      toast.success(success);
      dispatch(getProducts());
      dispatch(updateStatus());
    } else if (productStatus === "deleteError") {
      toast.error(error);
    }
  }, [productStatus, error, success, dispatch]);
  return (
    <div className="main-application">
      <CssBaseline />
      <AppBarSearch
        handleSubmit={handleSubmit}
        handleSearch={(e) => setSearch(e.target.value)}
        title={"Mes produits"}
        buttonTitle={"Ajouter un produit"}
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

export default SousCategory;
