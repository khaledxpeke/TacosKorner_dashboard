import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Grid, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ButtonGroup } from "@mui/material";
import { toast } from "react-toastify";
import NoData from "../components/no_data";
import AlertDialog from "../components/dialog";
import AppBarSearch from "../global/appBarSearch";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";

const apiUrl = process.env.REACT_APP_API_URL;

const CurrencyManagement = () => {
  const [currencies, setCurrencies] = useState([]);
  const [defaultCurrency, setDefaultCurrency] = useState("");
  const [search, setSearch] = useState("");
//   const [newCurrency, setNewCurrency] = useState("");
  const [open, setOpen] = useState(false);
  const [cardId, setCardId] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    axios
      .get(`${apiUrl}/currency`, {
        headers: {
            Authorization: `Bearer ${localStorage
                .getItem("token")
                .replace(/^"|"$/g, "")}`,
        },
      })
      .then((response) => {
        setCurrencies(response.data.currencies);
        setDefaultCurrency(response.data.defaultCurrency);
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
      .delete(`${apiUrl}/currency/${currencyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        toast.success("Currency deleted successfully");
        setCurrencies(currencies.filter((currency) => currency._id !== currencyId));
      })
      .catch((error) => {
        console.error("Error deleting currency:", error);
        toast.error("Error deleting currency");
      });
  };
  const handleUpdate = (currency) => {
    axios
      .put(`${apiUrl}/currency/update`, { defaultCurrency: currency },{
        headers: {
            Authorization: `Bearer ${localStorage
                .getItem("token")
                .replace(/^"|"$/g, "")}`,
        },
      })
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
    return currency.currencies?.some(curr => curr?.toLowerCase().includes(search?.toLowerCase())) || 
         currency?.defaultCurrency?.toLowerCase().includes(search?.toLowerCase());
});

  console.log(filteredCurrencies);

  return (
    <div className="main-application">
      <AppBarSearch
        handleSearch={handleSearch}
        title="Currency Management"
        buttonTitle="Add Currency"
        handleSubmit={() => {}}
      />

      <main>
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TableContainer>
                <Table sx={{ backgroundColor: colors.primary[400] }}>
                  <TableHead sx={{ backgroundColor: colors.primary[700] }}>
                    <TableRow>
                      <TableCell>Currency</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCurrencies.length > 0 ? (
                      filteredCurrencies.map((currency,index) => (
                        <TableRow key={index}>
                          <TableCell>{currency} </TableCell>
                          <TableCell align="right">
                            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                            <Button
                                variant="contained"
                                color={currency === defaultCurrency ? "success" : "info" }
                                onClick={() => handleUpdate(currency)}
                              >
                                Default
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleClickOpen(currency._id)}
                              >
                                Delete
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
          </Grid>
        </Container>
      </main>

      {/* Dialog for Delete Confirmation */}
      <AlertDialog
        open={open}
        handleClose={() => setOpen(false)}
        name="currency"
        cardId={cardId}
        deleteData={() => handleDeleteCurrency(cardId)}
      />
    </div>
  );
};

export default CurrencyManagement;
