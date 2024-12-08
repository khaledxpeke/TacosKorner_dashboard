import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { toast } from "react-toastify";
import NoData from "../../components/no_data";
import AlertDialog from "../../components/dialog";
import AppBarSearch from "../../global/appBarSearch";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import {
  getSettings,
  getSettingsError,
  getSettingsStatus,
  getSettingsSuccess,
  updateStatus,
  deleteSettings,
  updateCurrency,
  selectAllSettings,
  updateCurrencyOrTva,
} from "../../features/settingSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Loading from "../../components/loading";
import Error from "../../components/Error";

const SettingsManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const settings = useSelector(selectAllSettings);
  const error = useSelector(getSettingsError);
  const success = useSelector(getSettingsSuccess);
  const settingStatus = useSelector(getSettingsStatus);
  const [oldCurrency, setOldCurrency] = useState("");
  const [newCurrency, setNewCurrency] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [editType, setEditType] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [cardId, setCardId] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleClickOpen = (type, value) => {
    setEditType(type);
    if (type === "currency") {
      setOldCurrency(value);
    } else if (type === "tva") {
      setNewCurrency(value);
    }
    setOpen(true);
  };
  const handleDeleteOpen = (currency) => {
    setCardId(currency);
    setOpenDelete(true);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  const handleClose = () => {
    setOpen(false);
    setOldCurrency("");
    setNewCurrency("");
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/addSettings");
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleUpdate = (currency) => {
    dispatch(updateCurrency({ defaultCurrency: currency }));
  };
  const handleUpdateCurrency = () => {
    if (!newCurrency.trim()) {
      toast.error("New currency name cannot be empty!");
      return;
    }
    dispatch(updateCurrencyOrTva({ oldCurrency, newCurrency }));
    setOpen(false);
  };
  const handleUpdateTva = () => {
    if (!newCurrency.trim() || isNaN(newCurrency) || Number(newCurrency) < 0) {
      toast.error("Please enter a valid TVA value.");
      return;
    }
    dispatch(updateCurrencyOrTva({ tva: newCurrency }));
    setOpen(false);
  };

  useEffect(() => {
    if (settingStatus === "modifySuccess") {
      toast.success("Settings updated successfully!");
      dispatch(getSettings());
      dispatch(updateStatus());
    } else if (settingStatus === "modifyError") {
      toast.error(error || "Failed to update currency.");
      dispatch(updateStatus());
    }
  }, [settingStatus, error, dispatch]);
  useEffect(() => {
    if (settingStatus === "updateSuccess") {
      dispatch(getSettings());
      dispatch(updateStatus());
      toast.success(success);
    }
  }, [settingStatus, dispatch, success]);

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);
  let content;
  if (settingStatus === "loading") {
    content = <Loading />;
  } else if (settingStatus === "fetchError") {
    content = <Error>{error}</Error>;
  } else if (settingStatus === "fetchData") {
    console.log(settings);
    const filteredSettings = settings?.currencies?.filter(
      (currency) =>
        currency.toLowerCase().includes(search?.toLowerCase()) ||
        settings?.defaultCurrency?.toLowerCase().includes(search?.toLowerCase())
    );
    content = (
      <>
        <Grid item xs={6}>
          <TableContainer>
            <Table sx={{ backgroundColor: colors.primary[400] }}>
              <TableHead sx={{ backgroundColor: colors.primary[700] }}>
                <TableRow>
                  <TableCell>Devise</TableCell>
                  <TableCell align="center">Action</TableCell>
                  <TableCell align="center">
                    <Button
                      type="submit"
                      color="secondary"
                      variant="contained"
                      onClick={handleSubmit}
                    >
                      Ajouter
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSettings.length > 0 ? (
                  filteredSettings.map((currency, index) => (
                    <TableRow key={index}>
                      <TableCell>{currency} </TableCell>
                      <TableCell align="right">
                        <ButtonGroup
                          variant="contained"
                          aria-label="outlined primary button group"
                        >
                          <Button
                            variant="contained"
                            color={
                              currency === settings.defaultCurrency
                                ? "success"
                                : "info"
                            }
                            onClick={() => handleUpdate(currency)}
                          >
                            Défaut
                          </Button>
                          <Button
                            variant="contained"
                            color="warning"
                            onClick={() =>
                              handleClickOpen("currency", currency)
                            }
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                              setCardId(currency);
                              handleDeleteOpen(currency);
                            }}
                          >
                            Supprimer
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <NoData />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "1rem",
              backgroundColor: colors.primary[400],
              borderRadius: "8px",
            }}
          >
            <h2 style={{ margin: 0, color: colors.primary[100] }}>
              TVA : {settings.tva}%
            </h2>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => handleClickOpen("tva", settings.tva)}
              style={{ marginTop: "0.5rem" }}
            >
              Modifier
            </Button>
          </div>
        </Grid>
      </>
    );
  }
  useEffect(() => {
    if (settingStatus === "deleteSuccess") {
      toast.success(success);
      dispatch(getSettings());
      dispatch(updateStatus());
    } else if (settingStatus === "deleteError") {
      toast.error(error);
    }
  }, [settingStatus, error, success, dispatch]);

  return (
    <div className="main-application">
      <AppBarSearch
        handleSearch={handleSearch}
        title="Gestion des devises"
        buttonTitle="Ajouter une devise"
        handleSubmit={handleSubmit}
      />

      <main>
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          <Grid container spacing={4}>
            {content}
          </Grid>
        </Container>
      </main>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editType === "currency" ? "Modifier la Devise" : "Modifier la TVA"}
        </DialogTitle>
        <DialogContent>
          {editType === "currency" ? (
            <>
              <TextField
                label="Ancienne Devise"
                fullWidth
                margin="normal"
                value={oldCurrency}
                disabled
              />
              <TextField
                label="Nouvelle Devise"
                fullWidth
                margin="normal"
                value={newCurrency}
                onChange={(e) => setNewCurrency(e.target.value)}
              />
            </>
          ) : (
            <TextField
              label="Nouvelle TVA"
              fullWidth
              margin="normal"
              type="number"
              value={newCurrency}
              onChange={(e) => setNewCurrency(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Annuler
          </Button>
          <Button
            onClick={() => {
              if (editType === "currency") {
                handleUpdateCurrency();
              } else if (editType === "tva") {
                handleUpdateTva(); // Function to update TVA
              }
            }}
            color="secondary"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      <AlertDialog
        open={openDelete}
        handleClose={handleDeleteClose}
        name="settings"
        cardId={cardId}
        deleteData={() => {
          dispatch(deleteSettings({ currency: cardId }));
          setOpenDelete(false); // Close dialog after deletion
        }}
      />
    </div>
  );
};

export default SettingsManagement;
