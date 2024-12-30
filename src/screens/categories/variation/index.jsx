import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import {
  deleteVariation,
  getVariations,
  getVariationError,
  getVariationStatus,
  selectAllVariations,
  updateStatus,
  getVariationSuccess,
} from "../../../features/variationSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import AlertDialog from "../../../components/dialog";
import { toast } from "react-toastify";
import AppBarSearch from "../../../global/appBarSearch";
import NoDataTable from "../../../components/noDataTable";
const Variantion = () => {
  const [filteredTypes, setFilteredTypes] = useState([]);
  const dispatch = useDispatch();
  const status = useSelector(getVariationStatus);
  const error = useSelector(getVariationError);
  const types = useSelector(selectAllVariations);
  const success = useSelector(getVariationSuccess);
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const isLightMode = theme.palette.mode === "light";
  const [open, setOpen] = useState(false);
  const [addOrModify, setAddOrModify] = useState("");
  const [variationName, setVariationName] = useState("");
  const [addModifyOpen, setAddModifyOpen] = useState(false);
  const [cardId, setCardId] = useState(null);
  const handleClickOpen = (cardId) => {
    setOpen(true);
    setCardId(cardId);
  };
  const handleAddOpen = (cardId, type, name) => {
    if (type === "Ajouter variation") {
      setCardId("");
      setAddOrModify("Ajouter variation");
    } else {
      setVariationName(name);
      setAddOrModify("Modifier variation");
    }
    setAddModifyOpen(true);
    setCardId(cardId);
  };
  const handleClose = () => {
    setCardId("");
    setVariationName("");
    setAddModifyOpen(false);
  };
  const colors = tokens(theme.palette.mode);
  useEffect(() => {
    dispatch(getVariations());
  }, [dispatch]);

  useEffect(() => {
    if (status === "fetchData") {
      setFilteredTypes(
        types?.filter((dish) =>
          dish.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [types, search, status]);

  useEffect(() => {
    if (status === "deleteSuccess") {
      toast.success(success);
      setFilteredTypes((prev) => prev.filter((item) => item._id !== cardId));
      dispatch(updateStatus());
    } else if (status === "deleteError") {
      toast.error(error);
    }
  }, [cardId, dispatch, error, status, success]);
  return (
    <div className="main-application">
      <CssBaseline />
      <AppBarSearch
        handleSubmit={() => handleAddOpen("", "Ajouter variation", "")}
        handleSearch={(e) => setSearch(e.target.value)}
        title={"Mes variations"}
        buttonTitle={"Ajouter une variation"}
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
                <Grid item xs={12}>
                  <TableContainer>
                    <Table
                      sx={{
                        backgroundColor: isLightMode
                          ? "#F0F0F7"
                          : colors.primary[400],
                      }}
                    >
                      <TableHead
                        sx={{
                          backgroundColor: colors.primary[700],
                        }}
                      >
                        <TableRow>
                          <TableCell>Nom</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredTypes && filteredTypes.length > 0 ? (
                          filteredTypes.map((card) => (
                            <TableRow key={card._id}>
                              <TableCell>{card.name}</TableCell>
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
                                    Supprimer
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() =>
                                      handleAddOpen(
                                        card._id,
                                        "Modifier variation",
                                        card.name
                                      )
                                    }
                                  >
                                    Modifier
                                  </Button>
                                </ButtonGroup>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <NoDataTable cols={2} />
                        )}
                        <Dialog open={addModifyOpen} onClose={handleClose}>
                          <DialogTitle>{addOrModify}</DialogTitle>
                          <DialogContent>
                            <TextField
                              label="Nom"
                              fullWidth
                              margin="normal"
                              value={variationName}
                              onChange={(e) => setVariationName(e.target.value)}
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose} color="error">
                              Annuler
                            </Button>
                            <Button
                              onClick={() => {
                                if (addOrModify === "Ajouter variation") {
                                  //   handleUpdateCurrency();
                                } else {
                                  //   handleAddCurrency();
                                }
                              }}
                              color="secondary"
                            >
                              Confirmer
                            </Button>
                          </DialogActions>
                        </Dialog>
                        <AlertDialog
                          handleClose={() => setOpen(false)}
                          open={open}
                          name={"variation"}
                          cardId={cardId}
                          deleteData={deleteVariation(cardId)}
                        />
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            )}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Variantion;
