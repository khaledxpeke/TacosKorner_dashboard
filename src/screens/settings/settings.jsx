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
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [cardId, setCardId] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleClickOpen = (currency) => {
    setOpen(true);
    setCardId(currency);
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
                            color="error"
                            onClick={() => handleClickOpen(currency)}
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
            <h2 style={{ margin: 0, color: colors.primary[700] }}>
              TVA : {settings.tva}%
            </h2>
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
      <AlertDialog
        open={open}
        handleClose={() => setOpen(false)}
        name="settings"
        cardId={cardId}
        deleteData={() => dispatch(deleteSettings({currency:cardId}))}
      />
    </div>
  );
};

export default SettingsManagement;
