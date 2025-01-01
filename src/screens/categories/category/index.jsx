import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";

import {
  deleteCategory,
  fetchCategories,
  getCategoriesError,
  getCategoriesStatus,
  getCategoriesSuccess,
  selectAllCategories,
  updateStatus,
} from "../../../features/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/noData";
import AlertDialog from "../../../components/dialog";
import AppBarSearch from "../../../global/appBarSearch";
import { toast } from "react-toastify";

const Category = () => {
  const [filteredCategories, setFilteredCategories] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectAllCategories);
  const error = useSelector(getCategoriesError);
  const success = useSelector(getCategoriesSuccess);
  const status = useSelector(getCategoriesStatus);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [cardId, setCardId] = useState(null);
  const handleClickOpen = (cardId) => {
    setOpen(true);
    setCardId(cardId);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/addCategory");
  };
  const handleModify = (data) => {
    navigate("/modifyCategory", { state: { category: data } });
  };
  const handleViewProduct = (id, name) => {
    navigate("/product", { state: { categoryId: id, categoryName: name } });
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (status === "fetchData") {
      setFilteredCategories(
        categories?.filter((dish) =>
          dish.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [status, categories, search]);

  useEffect(() => {
    if (status === "deleteSuccess") {
      toast.success(success);
      setFilteredCategories((prev) =>
        prev.filter((item) => item._id !== cardId)
      );
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
        title={"Mes catégories"}
        buttonTitle={"Ajouter une catégorie"}
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
                {filteredCategories && filteredCategories.length > 0 ? (
                  filteredCategories.map((card) => (
                    <ProductCard
                      key={card._id}
                      data={card}
                      handleModify={() => handleModify(card)}
                      content={card.products.length + " Produit"}
                      handleClickOpen={() => handleClickOpen(card._id)}
                      viewProduct={() => handleViewProduct(card._id, card.name)}
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
                  deleteData={deleteCategory(cardId)}
                />
              </>
            )}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Category;
