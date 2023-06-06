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
import NoData from "../../../components/no_data";
import AlertDialog from "../../../components/dialog";
import AppBarSearch from "../../../global/appBarSearch";
import { toast } from "react-toastify";

const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectAllCategories);
  const error = useSelector(getCategoriesError);
  const success = useSelector(getCategoriesSuccess);
  const categoryStatus = useSelector(getCategoriesStatus);
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
  const handleViewProduct = (id) => {
    navigate("/viewProduct", { state: { categoryId: id } });
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  let content;
  if (categoryStatus === "loading") {
    content = <Loading />;
  } else if (categoryStatus === "fetchError") {
    content = <Error>{error}</Error>;
  } else if (categoryStatus === "fetchData") {
    const filteredCategories = categories?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    content = (
      <>
        {filteredCategories && filteredCategories.length > 0 ? (
          filteredCategories.map((card) => (
            <ProductCard
              key={card._id}
              data={card}
              handleModify={() => handleModify(card)}
              content={card.products.length + " Produit"}
              handleClickOpen={() => handleClickOpen(card._id)}
              viewProduct={() => handleViewProduct(card._id)}
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
    );
  }
  useEffect(() => {
    if (categoryStatus === "deleteSuccess") {
      toast.success(success);
      dispatch(fetchCategories());
      dispatch(updateStatus());
    } else if (categoryStatus === "deleteError") {
      toast.error(error);
    }
  }, [categoryStatus, error, success, dispatch]);

  return (
    <div className="main-application">
      <CssBaseline />
      <AppBarSearch
        handleSubmit={handleSubmit}
        handleSearch={(e) => setSearch(e.target.value)}
        title={"Mes categories"}
        buttonTitle={"Ajouter un categorie"}
      />
      <main>
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          <Grid
            container
            spacing={4}
            sx={{ gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))" }}
          >
            {content}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Category;
