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
  IconButton,
  Typography,
  Box,
  Toolbar,
  AppBar,
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
  updateCurrencyOrTva,
  modifySettings,
} from "../../features/settingSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Loading from "../../components/loading";
import Error from "../../components/Error";
import SearchIcon from "@mui/icons-material/Search";

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
        maxExtras: settings.maxExtras
      } 
    });
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
  const handleAddCurrency = () => {
    dispatch(modifySettings({ currency: newCurrency }));
    setOpen(false);
  };

  useEffect(() => {
    if (settingStatus === "addSuccess" ) {
      toast.success("Currency added successfully!");
      dispatch(getSettings());
      dispatch(updateStatus());
    } else if (settingStatus === "addError") {
      toast.error(error || "Failed to add currency.");
      dispatch(updateStatus());
    }else if (settingStatus === "modifySuccess") {
      toast.success("Currency updated successfully!");
      dispatch(getSettings());
      dispatch(updateStatus());
    }else if (settingStatus === "modifyError") {
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
              TVA : {settings.tva}%
            </Typography>
            <Typography variant="h2" sx={{ mt: 2 }} color="inherit">
              Nombre max d'extras : {settings.maxExtras}
            </Typography>
            <Typography variant="h2" sx={{ mt: 2 }} color="inherit">
              Nombre max de boissons : {settings.maxDrink}
            </Typography>
            <Typography variant="h2" sx={{ mt: 2 }} color="inherit">
              Nombre max de désserts : {settings.maxDessert}
            </Typography>
            <Button
              sx={{ mt: 2 }}
              size="small"
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              Modifier
            </Button>
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
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h3" color="inherit" noWrap>
            Gestion des devises
          </Typography>
          <Box
            ml={2}
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
          >
            <input
              type="text"
              placeholder="Rechercher..."
              className="search-input pl-2"
              style={{ paddingLeft: "10px", maxWidth: "300px" }}
              onChange={handleSearch}
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
            {content}
          </Grid>
        </Container>
      </main>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editType === "currency" ? "Modifier la Devise" : "Ajouter une nouvelle devise"}
        </DialogTitle>
        <DialogContent>
          {editType === "currency" ? (
            <>
              {/* <TextField
                label="Ancienne Devise"
                fullWidth
                margin="normal"
                value={oldCurrency}
                disabled
              /> */}
              <TextField
                label="Devise"
                fullWidth
                margin="normal"
                value={newCurrency || oldCurrency}
                onChange={(e) => setNewCurrency(e.target.value)}
              />
            </>
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
          setOpenDelete(false); // Close dialog after deletion
        }}
      />
    </div>
  );
};

export default SettingsManagement;
