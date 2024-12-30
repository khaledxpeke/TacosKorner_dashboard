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
  DialogActions,
} from "@mui/material";
import {
  addVariation,
  modifyVariation,
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
import { Formik } from "formik";
import * as yup from "yup";
import TextFieldCompnent from "../../../components/textFieldComponent";
const Variantion = () => {
  const schema = yup.object().shape({
    name: yup.string().required("Nom est requis"),
  });
  const [filteredVariations, setFilteredVariations] = useState([]);
  const dispatch = useDispatch();
  const status = useSelector(getVariationStatus);
  const error = useSelector(getVariationError);
  const variations = useSelector(selectAllVariations);
  const success = useSelector(getVariationSuccess);
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const isLightMode = theme.palette.mode === "light";
  const [open, setOpen] = useState(false);
  const [addOrModify, setAddOrModify] = useState("");
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
      setCardId(cardId);
      setAddOrModify("Modifier variation");
    }
    setAddModifyOpen(true);
  };
  const handleClose = () => {
    setAddModifyOpen(false);
  };
  const colors = tokens(theme.palette.mode);
  useEffect(() => {
    dispatch(getVariations());
  }, [dispatch]);

  useEffect(() => {
    if (status === "fetchData") {
      setFilteredVariations(
        variations?.filter((dish) =>
          dish.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [variations, search, status]);

  useEffect(() => {
    if (status === "deleteSuccess") {
      toast.success(success);
      setFilteredVariations((prev) => prev.filter((item) => item._id !== cardId));
      dispatch(updateStatus());
    } else if (status === "deleteError") {
      toast.error(error);
    }
  }, [cardId, dispatch, error, status, success]);

  const handleFormSubmit = (values) => {
    if (addOrModify === "Ajouter variation") {
      dispatch(addVariation({ name: values.name }));
    } else {
      dispatch(
        modifyVariation({ body: { name: values.name }, variationId: cardId })
      );
    }
    setAddModifyOpen(false);
  };

  useEffect(() => {
    if (status === "addSuccess") {
      toast.success(success);
      dispatch(getVariations());
      dispatch(updateStatus());
    } else if (status === "addError") {
      toast.error(error);
      dispatch(updateStatus());
    } else if (status === "modifySuccess") {
      setCardId("");
      toast.success(success);
      dispatch(getVariations());
      dispatch(updateStatus());
    } else if (status === "modifyError") {
      toast.error(error);
      console.log(error);
      dispatch(updateStatus());
    }
  }, [status, error, dispatch, success]);
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
                        {filteredVariations && filteredVariations.length > 0 ? (
                          filteredVariations.map((card) => (
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
                          <Formik
                            onSubmit={handleFormSubmit}
                            initialValues={{
                              name:
                                addOrModify === "Modifier variation"
                                  ? filteredVariations.find(
                                      (item) => item._id === cardId
                                    )?.name
                                  : "",
                            }}
                            validationSchema={schema}
                          >
                            {({
                              values,
                              errors,
                              touched,
                              handleBlur,
                              handleChange,
                              handleSubmit,
                            }) => (
                              <form onSubmit={handleSubmit}>
                                <DialogTitle>{addOrModify}</DialogTitle>
                                <DialogContent>
                                  <TextFieldCompnent
                                    type="text"
                                    label="Nom"
                                    change={handleChange}
                                    value={values.name}
                                    name="name"
                                    blur={handleBlur}
                                    touched={touched.name}
                                    error={errors.name}
                                  />
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={handleClose} color="error">
                                    Annuler
                                  </Button>
                                  <Button type="submit" color="secondary">
                                    Confirmer
                                  </Button>
                                </DialogActions>
                              </form>
                            )}
                          </Formik>
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
