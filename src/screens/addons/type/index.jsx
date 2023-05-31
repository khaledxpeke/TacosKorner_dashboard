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
  getTypes,
  getTypesError,
  getTypesStatus,
  selectAllTypes,
} from "../../../features/typeSlice";
import Loading from "../../../components/loading";
import Error from "../../../components/Error";
import NoData from "../../../components/no_data";
import AppBarSearch from "../../../global/appBarSearch";

const Type = () => {
  const dispatch = useDispatch();
  const typeStatus = useSelector(getTypesStatus);
  const error = useSelector(getTypesError);
  const types = useSelector(selectAllTypes);
  const navigate = useNavigate();
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const isLightMode = theme.palette.mode === "light";
  useEffect(() => {
    dispatch(getTypes());
  }, [dispatch]);

  let content;
  if (typeStatus === "loading") {
    content = <Loading />;
  } else if (typeStatus === "fetchError") {
    content = <Error>{error}</Error>;
  } else if (typeStatus === "fetchData") {
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
                  <Button variant="contained" color="error">
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
      </>
    );

    const colors = tokens(theme.palette.mode);
    const handleSubmit = (event) => {
      event.preventDefault();
      navigate("/addType");
    };
    return (
      <div className="main-application">
        <CssBaseline />
        <AppBarSearch
          handleSubmit={handleSubmit}
          handleSearch={(e) => setSearch(e.target.value)}
        />
        <main>
          <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
            <Grid container spacing={4}>
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
                        backgroundColor: colors.primary[700]
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
  }
};

export default Type;
