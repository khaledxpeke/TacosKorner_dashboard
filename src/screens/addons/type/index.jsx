import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { tokens } from "../../../theme";
import {
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Grid,
  Container,
  Button,
} from "@mui/material";
import {
  deleteType,
  getTypes,
  getTypesError,
  getTypesStatus,
  selectAllTypes,
  updateStatus,
  getTypesSuccess,
} from "../../../features/typeSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import NoData from "../../../components/no_data";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";
import AppBarSearch from "../../../global/appBarSearch";
const Type = () => {
  const dispatch = useDispatch();
  const typeStatus = useSelector(getTypesStatus);
  const error = useSelector(getTypesError);
  const types = useSelector(selectAllTypes);
  const success = useSelector(getTypesSuccess);
  const navigate = useNavigate();
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const isLightMode = theme.palette.mode === "light";
  const [open, setOpen] = useState(false);
  const [cardId, setCardId] = useState(null);
  const handleClickOpen = (cardId) => {
    setOpen(true);
    setCardId(cardId);
  };
  const colors = tokens(theme.palette.mode);
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/addType");
  };
  const handleModify = (data) => {
    navigate("/modifyType", { state: { type: data } });
  };
  useEffect(() => {
    dispatch(getTypes());
  }, [dispatch]);

  let content;
  if (typeStatus === "loading") {
    content = <Loading />;
  } else if (typeStatus === "fetchError") {
    content = <Error>{error}</Error>;
  } else if (typeStatus === "fetchData") {
    const filteredTypes = types?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    content = (
      <Grid item xs={12}>
        <TableContainer>
          <Table
            sx={{
              backgroundColor: isLightMode ? "#F0F0F7" : colors.primary[400],
            }}
          >
            <TableHead
              sx={{
                backgroundColor: colors.primary[700],
              }}
            >
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Maximum Ingrédient</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTypes && filteredTypes.length > 0 ? (
                filteredTypes.map((card) => (
                  <TableRow key={card._id}>
                    <TableCell>{card.name}</TableCell>
                    <TableCell>{card.message}</TableCell>
                    <TableCell>{card.max}</TableCell>
                    <TableCell align="right">
                      <ButtonGroup
                        variant="contained"
                        aria-label="outlined primary button group"
                      >
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleClickOpen(card._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => handleModify(card)}
                        >
                          Edit
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <NoData />
              )}
              <AlertDialog
                handleClose={() => setOpen(false)}
                open={open}
                name={"produit"}
                cardId={cardId}
                deleteData={deleteType(cardId)}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    );
  }
  useEffect(() => {
    if (typeStatus === "deleteSuccess") {
      toast.success(success);
      dispatch(getTypes());
      dispatch(updateStatus());
    } else if (typeStatus === "deleteError") {
      toast.error(error);
    }
  }, [typeStatus, error, success, dispatch]);
  return (
    <div className="main-application">
      <CssBaseline />
      <AppBarSearch
        handleSubmit={handleSubmit}
        handleSearch={(e) => setSearch(e.target.value)}
        title={"Mes types"}
        buttonTitle={"Ajouter un type d'ingrédiants"}
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

export default Type;
