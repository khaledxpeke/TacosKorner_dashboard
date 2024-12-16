import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteIngrediant,
  getIngrediants,
  getIngrediantsError,
  getIngrediantsStatus,
  selectAllIngrediants,
  getIngrediantsSuccess,
  updateStatus,
} from "../../../features/ingrediantSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import ProductCard from "../../../components/card";
import NoData from "../../../components/no_data";
import AppBarSearch from "../../../global/appBarSearch";
import { Container, Grid } from "@mui/material";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";
import InventoryIcon from '@mui/icons-material/Inventory';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

const Ingrediant = () => {
  const dispatch = useDispatch();
  const ingrediantStatus = useSelector(getIngrediantsStatus);
  const error = useSelector(getIngrediantsError);
  const ingrediants = useSelector(selectAllIngrediants);
  const success = useSelector(getIngrediantsSuccess);
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
    navigate("/addIngrediant");
  };
  const truncateText = (text, limit = 30) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit).trim() + "...";
  };
  const handleModify = (data) => {
    navigate("/modifyIngrediant", { state: { ingrediant: data } });
  };
  useEffect(() => {
    dispatch(getIngrediants());
  }, [dispatch]);

  let content;
  if (ingrediantStatus === "loading") {
    content = <Loading />;
  } else if (ingrediantStatus === "fetchError") {
    content = <Error>{error}</Error>;
  } else if (ingrediantStatus === "fetchData") {
    const filteredIngrediants = ingrediants?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    content = (
      <>
        {filteredIngrediants && filteredIngrediants.length > 0 ? (
          filteredIngrediants.map((card) => (
            <ProductCard
              key={card._id}
              data={card}
              handleModify={() => handleModify(card)}
              handleClickOpen={() => handleClickOpen(card._id)}
              content={
                <>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "200px", // adjust width as needed
                    }}
                  >
                    Options:{" "}
                    {truncateText(
                      card.types?.map((type) => type.name).join(", ")
                    )}{" "}
                    <br />
                  </div>
                  {card.price ? `Prix: ${card.price}` : null} <br />
                  {card.suppPrice
                    ? `Prix Supplementaire: ${card.suppPrice}`
                    : null}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      color: card.inStock ? "#4caf50" : "#f44336",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {card.inStock ? (
                      <>
                        <InventoryIcon sx={{ fontSize: 20 }} />
                        <span>En stock</span>
                      </>
                    ) : (
                      <>
                        <RemoveShoppingCartIcon sx={{ fontSize: 20 }} />
                        <span>Rupture de stock</span>
                      </>
                    )}
                  </div>
                </>
              }
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
          deleteData={deleteIngrediant(cardId)}
        />
      </>
    );
  }
  useEffect(() => {
    if (ingrediantStatus === "deleteSuccess") {
      toast.success(success);
      dispatch(getIngrediants());
      dispatch(updateStatus());
    } else if (ingrediantStatus === "deleteError") {
      toast.error(error);
    }
  }, [ingrediantStatus, error, success, dispatch]);
  return (
    <div className="main-application">
      <CssBaseline />
      <AppBarSearch
        handleSubmit={handleSubmit}
        handleSearch={(e) => setSearch(e.target.value)}
        title={"Mes ingrédiants"}
        buttonTitle={"Ajouter un ingrédiant"}
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

export default Ingrediant;
