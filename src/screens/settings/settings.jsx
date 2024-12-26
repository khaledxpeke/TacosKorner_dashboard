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
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";
import NoData from "../../components/no_data";
import AlertDialog from "../../components/dialog";
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
  updateSetting,
  modifySettings,
} from "../../features/settingSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Loading from "../../components/loading";
import Error from "../../components/Error";
import EditIcon from "@mui/icons-material/Edit";
import AppBarSearch from "../../global/appBarSearch";
const apiUrl = process.env.REACT_APP_API_URL;
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
      setNewCurrency(value);
    } else if (type === "newCurrency") {
      setNewCurrency("");
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
    navigate("/modifySettings", {
      state: {
        tva: settings.tva,
        maxDrink: settings.maxDrink,
        maxDessert: settings.maxDessert,
        maxExtras: settings.maxExtras,
        logo: settings.logo,
        banner: settings.banner,
      },
    });
  };
  const handleUpdate = (currency) => {
    dispatch(updateCurrency({ defaultCurrency: currency }));
  };
  const handleUpdateCurrency = () => {
    if (!newCurrency.trim()) {
      toast.error("New currency name cannot be empty!");
      return;
    }
    dispatch(updateSetting({ oldCurrency, newCurrency }));
    setOpen(false);
  };
  const handleAddCurrency = () => {
    dispatch(modifySettings({ currency: newCurrency }));
    setOpen(false);
  };

  useEffect(() => {
    if (settingStatus === "addSuccess") {
      toast.success("Currency added successfully!");
      dispatch(getSettings());
      dispatch(updateStatus());
    } else if (settingStatus === "addError") {
      toast.error(error || "Failed to add currency.");
      dispatch(updateStatus());
    } else if (settingStatus === "modifySuccess") {
      toast.success("Currency updated successfully!");
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
        <Grid item xs={4}>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h2" sx={{ mb: 2 }} color="inherit">
              Logo
            </Typography>
            <img
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "200px",
                maxHeight: "200px",
              }}
              srcSet={`${apiUrl}/${settings.logo}`}
              src={`${apiUrl}/${settings.logo}`}
              alt="Logo"
              loading="lazy"
            />
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h2" sx={{ mb: 2 }} color="inherit">
              Banner
            </Typography>
            <img
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "600px",
                maxHeight: "200px",
              }}
              srcSet={`${apiUrl}/${settings.banner}`}
              src={`${apiUrl}/${settings.banner}`}
              alt="Banner"
              loading="lazy"
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <TableContainer>
            <Table sx={{ backgroundColor: colors.primary[400] }}>
              <TableHead sx={{ backgroundColor: colors.primary[700] }}>
                <TableRow>
                  <TableCell>Devise</TableCell>
                  <TableCell align="right">
                    Action
                    <Button
                      sx={{ ml: 2 }}
                      type="submit"
                      color="secondary"
                      variant="contained"
                      onClick={() => handleClickOpen("newCurrency")}
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
          xs={6}
          sx={{
            display: "flex",
            alignItems: "start",
          }}
        >
          <Box
            style={{
              padding: "1rem",
              backgroundColor: colors.primary[400],
              borderRadius: "8px",
            }}
          >
            <Typography variant="h2" color="inherit">
              TVA : {settings?.tva || 0}%
            </Typography>
            <Typography variant="h2" sx={{ mt: 2 }} color="inherit">
              Nombre max d'extras : {settings?.maxExtras || 0}
            </Typography>
            <Typography variant="h2" sx={{ mt: 2 }} color="inherit">
              Nombre max de boissons : {settings?.maxDrink || 0}
            </Typography>
            <Typography variant="h2" sx={{ mt: 2 }} color="inherit">
              Nombre max de désserts : {settings?.maxDessert || 0}
            </Typography>
            <Typography variant="h2" sx={{ mt: 2 }} color="inherit">
              Paiement en carte : {settings?.method[0]?.label || "Carte"}{" "}
              <Chip
                variant="outlined"
                label={
                  settings?.method[0]?.isActive !== undefined
                    ? settings.method[0].isActive
                      ? "Oui"
                      : "Non"
                    : "Oui"
                }
                color={
                  settings?.method[0]?.isActive !== undefined
                    ? settings.method[0].isActive
                      ? "secondary"
                      : "error"
                    : "secondary"
                }
                sx={{ ml: 1 }}
              />
            </Typography>
            <Typography
              variant="h2"
              sx={{ mt: 2, display: "flex", alignItems: "center" }}
              color="inherit"
            >
              Paiement en espèces : {settings?.method[1]?.label || "Espèces"}{" "}
              <Chip
                variant="outlined"
                label={
                  settings?.method[1]?.isActive !== undefined
                    ? settings.method[1].isActive
                      ? "Oui"
                      : "Non"
                    : "Oui"
                }
                color={
                  settings?.method[1]?.isActive !== undefined
                    ? settings.method[1].isActive
                      ? "secondary"
                      : "error"
                    : "secondary"
                }
                sx={{ ml: 1 }}
              />
            </Typography>
          </Box>
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
        handleSubmit={handleSubmit}
        handleSearch={(e) => setSearch(e.target.value)}
        title={"Gestion des paramètres"}
        buttonTitle={"modifier les paramètres"}
        buttonColor={"info"}
        buttonIcon={<EditIcon />}
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
          {editType === "currency"
            ? "Modifier la Devise"
            : "Ajouter une nouvelle devise"}
        </DialogTitle>
        <DialogContent>
          {editType === "currency" ? (
            <TextField
              label="Devise"
              fullWidth
              margin="normal"
              value={newCurrency || oldCurrency}
              onChange={(e) => setNewCurrency(e.target.value)}
            />
          ) : (
            <TextField
              label="Nouvelle Devise"
              fullWidth
              margin="normal"
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
              } else if (editType === "newCurrency") {
                handleAddCurrency();
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
          setOpenDelete(false);
        }}
      />
    </div>
  );
};

export default SettingsManagement;
