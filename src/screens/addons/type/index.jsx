import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { tokens } from "../../../theme";
import {
  ButtonGroup,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Typography,
  Toolbar,
  Box,
  Grid,
  Container,
  Button,
  AppBar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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

  useEffect(() => {
    dispatch(getTypes());
  }, [dispatch]);

  let content;
  if (typeStatus === "loading") {
    content = <Loading />;
  } else if (typeStatus === "error") {
    content = <Error>{error}</Error>;
  } else if (typeStatus === "fetchedTypes") {
    const filteredTypes = types?.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    content = (
      <>
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
                    Delete
                  </Button>
                  <Button variant="contained" color="warning">
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
      </>
    );  }
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
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h3" color="inherit" noWrap>
            Mes Type d'ingrediant
          </Typography>
          <Box
            ml={2}
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
          >
            <input
              type="text"
              placeholder="Search"
              className="search-input pl-2"
              style={{ paddingLeft: "10px", width: "300px" }}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            style={{ marginLeft: "auto" }}
            onClick={handleSubmit}
          >
            ajouter une type d'ingrediant
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TableContainer>
                <Table
                  sx={{
                    backgroundColor: isLightMode ? "#F0F0F7" : "inherit",
                  }}
                >
                  <TableHead
                    sx={{
                      backgroundColor: isLightMode
                        ? colors.primary[700]
                        : colors.primary[400],
                    }}
                  >
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{content}</TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Type;
