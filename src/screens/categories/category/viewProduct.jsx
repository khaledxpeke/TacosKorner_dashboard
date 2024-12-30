import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Container,
  IconButton,
  Box,
  Typography,
  Toolbar,
  AppBar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";
import { tokens } from "../../../theme";
import { useTheme } from "@emotion/react";
import { getSettings, selectAllSettings } from "../../../features/settingSlice";

const ViewProduct = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();
  const categoryId = location.state.categoryId;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const status = useSelector(getProductsStatus);
  const error = useSelector(getProductsError);
  const products = useSelector(selectAllProducts);
  const settings = useSelector(selectAllSettings);
  const success = useSelector(getProductsSuccess);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [cardId, setCardId] = useState(null);
  const handleClickOpen = (cardId) => {
    setOpen(true);
    setCardId(cardId);
  };

  useEffect(() => {
    dispatch(getProductByCategoryId(categoryId));
    dispatch(getSettings());
  }, [dispatch, categoryId]);

  useEffect(() => {
    if (status === "fetchDataByCategory") {
      setFilteredProducts(
        products?.filter((dish) =>
          dish.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [status, products, search]);

  useEffect(() => {
    const statusHandlers = {
      deleteSuccess: () => {
        toast.success(success);
        setFilteredProducts((prev) =>
          prev.filter((item) => item._id !== cardId)
        );
        dispatch(updateStatus());
      },
      deleteError: () => toast.error(error),
    };
    if (status in statusHandlers) {
      statusHandlers[status]();
    }
  }, [status, error, success, dispatch, cardId]);

  return (
    <div className="main-application">
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h3" color="inherit" noWrap>
            Mes produits
          </Typography>
          <Box
            ml={2}
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
          >
            <input
              type="text"
              placeholder="Search"
              className="search-input pl-2"
              style={{ paddingLeft: "10px", width: "300px" }}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
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
                      content={card.price + " " + settings.defaultCurrency}
                      handleClickOpen={() => handleClickOpen(card._id)}
                      noModify={true}
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

export default ViewProduct;
