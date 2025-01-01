import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Container, Chip, Stack, Typography } from "@mui/material";
import {
  deleteProduct,
  getProductsError,
  getProductsStatus,
  selectAllProducts,
  getProductsSuccess,
  updateStatus,
  getProductByCategoryId,
} from "../../../features/productSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/noData";
import AppBarSearch from "../../../global/appBarSearch";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";
import { getSettings, selectAllSettings } from "../../../features/settingSlice";

const Formule = () => {
  const location = useLocation();
  const categoryId = location.state.categoryId;
  const categoryName = location.state.categoryName;
  const [filteredProducts, setFilteredProducts] = useState([]);
  const dispatch = useDispatch();
  const status = useSelector(getProductsStatus);
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
    navigate("/modifyProduct", {
      state: {
        product: data,
        categoryId: categoryId,
        categoryName: categoryName,
      },
    });
  };

  const truncateText = (text, limit = 30) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit).trim() + "...";
  };

  useEffect(() => {
    dispatch(getProductByCategoryId(categoryId));
    dispatch(getSettings());
  }, [categoryId, dispatch]);
  useEffect(() => {
    if (status === "fetchDataByCategory") {
      setFilteredProducts(
        products?.filter((dish) =>
          dish.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [products, search, status]);

  useEffect(() => {
    if (status === "deleteSuccess") {
      toast.success(success);
      setFilteredProducts((prev) => prev.filter((item) => item._id !== cardId));
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
        title={categoryName + " > Mes produits"}
        buttonTitle={"Ajouter un produit"}
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
                {filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((card) => (
                    <ProductCard
                      key={card._id}
                      data={card}
                      handleModify={() => handleModify(card)}
                      content={
                        <>
                          <Typography variant="h4" color="inherit">
                            Prix:{" "}
                            {card?.price ?? 0 + " " + settings.defaultCurrency}
                          </Typography>
                          {card.type && card.description !== "" && (
                            <Typography
                              variant="h4"
                              color="inherit"
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              Options:{" "}
                              {truncateText(
                                card.type
                                  ?.map((type) => type.name)
                                  .join(", ") || ""
                              )}
                            </Typography>
                          )}
                          {card.description && card.description !== "" && (
                            <Typography variant="h4" color="inherit">
                              Description: {card?.description}
                            </Typography>
                          )}
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
                  name={"produit"}
                  cardId={cardId}
                  deleteData={deleteProduct(cardId)}
                />
              </>
            )}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Formule;
