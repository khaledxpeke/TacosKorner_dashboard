import React, { useEffect, useState } from "react";
import axios from "axios";
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
import NoData from "../components/no_data";
import AlertDialog from "../components/dialog";
import AppBarSearch from "./appBarSearch";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";

const apiUrl = process.env.REACT_APP_API_URL;

const SettingsManagement = () => {
  const [currencies, setCurrencies] = useState([]);
  const [defaultCurrency, setDefaultCurrency] = useState("");
  const [tva, setTva] = useState(0);
  const [search, setSearch] = useState("");
  //   const [newCurrency, setNewCurrency] = useState("");
  const [open, setOpen] = useState(false);
  const [cardId, setCardId] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    axios
      .get(`${apiUrl}/settings`, {
        headers: {
          Authorization: `Bearer ${localStorage
            .getItem("token")
            .replace(/^"|"$/g, "")}`,
        },
      })
      .then((response) => {
        setCurrencies(response.data.currencies);
        setDefaultCurrency(response.data.defaultCurrency);
        setTva(response.data.tva);
      })
      .catch((error) => {
        console.error("Error fetching currencies:", error);
      });
  }, []);

  //   const handleAddCurrency = () => {
  //     if (!newCurrency) {
  //       toast.error("Currency name cannot be empty!");
  //       return;
  //     }
  //     axios
  //       .post(`${apiUrl}/currency/add`, { name: newCurrency }, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       })
  //       .then((response) => {
  //         setNewCurrency(""); // Reset input field
  //         toast.success("Currency added successfully");
  //         setCurrencies([...currencies, response.data]);
  //       })
  //       .catch((error) => {
  //         console.error("Error adding currency:", error);
  //         toast.error("Error adding currency");
  //       });
  //   };

  const handleDeleteCurrency = (currencyId) => {
    axios
      .delete(`${apiUrl}/settings/${currencyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        toast.success("Currency deleted successfully");
        setCurrencies(
          currencies.filter((currency) => currency._id !== currencyId)
        );
      })
      .catch((error) => {
        console.error("Error deleting currency:", error);
        toast.error("Error deleting currency");
      });
  };
  const handleUpdate = (currency) => {
    axios
      .put(
        `${apiUrl}/settings/currency/update`,
        { defaultCurrency: currency },
        {
          headers: {
            Authorization: `Bearer ${localStorage
              .getItem("token")
              .replace(/^"|"$/g, "")}`,
          },
        }
      )
      .then((response) => {
        toast.success("Currency updated successfully");
        setDefaultCurrency(response.data.defaultCurrency);
      })
      .catch((error) => {
        console.error("Error updating currency:", error);
        toast.error("Error updating currency");
      });
  };

  const handleClickOpen = (currencyId) => {
    setOpen(true);
    setCardId(currencyId);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const filteredCurrencies = currencies.filter((currency) => {
    if (!search) {
      return true;
    }
    return (
      currency.toLowerCase().includes(search?.toLowerCase()) ||
      currency?.defaultCurrency?.toLowerCase().includes(search?.toLowerCase())
    );
  });

  console.log(currencies);

  return (
    <div className="main-application">
      <AppBarSearch
        handleSearch={handleSearch}
        title="Gestion des devises"
        buttonTitle="Ajouter une devise"
        handleSubmit={() => {}}
      />

      <main>
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <TableContainer>
                <Table sx={{ backgroundColor: colors.primary[400] }}>
                  <TableHead sx={{ backgroundColor: colors.primary[700] }}>
                    <TableRow>
                      <TableCell>Devise</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCurrencies.length > 0 ? (
                      filteredCurrencies.map((currency, index) => (
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
                                  currency === defaultCurrency
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
                                onClick={() => handleClickOpen(currency._id)}
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
              <h2 style={{ margin: 0, color: colors.primary[700] }}>TVA :</h2>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  margin: 0,
                  color: colors.primary[900],
                }}
              >
                {tva}%
              </p>
            </div>
          </Grid>
          </Grid>
        </Container>
      </main>
      <AlertDialog
        open={open}
        handleClose={() => setOpen(false)}
        name="settings"
        cardId={cardId}
        deleteData={() => handleDeleteCurrency(cardId)}
      />
    </div>
  );
};

export default SettingsManagement;
