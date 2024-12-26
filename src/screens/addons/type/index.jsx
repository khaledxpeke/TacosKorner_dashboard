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
  const [filteredTypes, setFilteredTypes] = useState([]);
  const dispatch = useDispatch();
  const status = useSelector(getTypesStatus);
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
        handleSubmit={handleSubmit}
        handleSearch={(e) => setSearch(e.target.value)}
        title={"Mes options"}
        buttonTitle={"Ajouter une option"}
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
                          <TableCell>Message</TableCell>
                          <TableCell>Max</TableCell>
                          <TableCell>Min</TableCell>
                          <TableCell>Payant</TableCell>
                          <TableCell>Type</TableCell>
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
                              <TableCell>{card.min}</TableCell>
                              <TableCell>
                                {card.payment ? "Oui" : "Non"}
                              </TableCell>
                              <TableCell>
                                {card.selection ? "Multiple" : "Seul"}
                              </TableCell>
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
                          name={"option"}
                          cardId={cardId}
                          deleteData={deleteType(cardId)}
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

export default Type;
