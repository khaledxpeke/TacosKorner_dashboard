import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Box,
  Collapse,
  CssBaseline,
  IconButton,
  TablePagination,
  Toolbar,
  Typography,
} from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@emotion/react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHistory,
  getHistoryError,
  getHistoryStatus,
  selectAllHistory,
} from "../../features/historySlice";
import { useEffect } from "react";
import NoData from "../../components/no_data";
import Loading from "../../components/loading";
import Error from "../../components/Error";

function createData(
  product,
  pack,
  commandNumber,
  name,
  total,
  currency,
  boughtAt
) {
  return {
    product,
    pack,
    commandNumber,
    name,
    total,
    currency,
    boughtAt,
  };
}

function Row(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [addonsOpen, setAddonsOpen] = React.useState(false);
  const isLightMode = theme.palette.mode === "light";

  const handleOpenAddons = () => {
    setAddonsOpen(!addonsOpen);
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          backgroundColor: isLightMode ? "#F0F0F7" : colors.primary[400],
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.pack}
        </TableCell>
        <TableCell>{row.commandNumber}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell align="right">{row.total + " " + row.currency}</TableCell>
        <TableCell align="right">{row.boughtAt.substring(0, 10)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: colors.primary[700] }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Plat
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {" "}
                      Plus d'information{" "}
                    </TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell align="right">Prix ({row?.currency})</TableCell>
                    <TableCell align="right">Total ({row?.currency})</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.product.map((productRow) => (
                    <React.Fragment key={productRow.plat?.name}>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <IconButton
                            aria-label="expand addons"
                            size="small"
                            onClick={handleOpenAddons}
                          >
                            {addonsOpen ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {productRow.plat?.name}
                        </TableCell>
                        <TableCell align="right">
                          {productRow.plat?.price}
                        </TableCell>
                        <TableCell align="right">{productRow?.total}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={4}
                        >
                          <Collapse
                            in={addonsOpen}
                            timeout="auto"
                            unmountOnExit
                            component="div"
                          >
                            {productRow.addons.length > 0 && (
                              <Box sx={{ margin: 1 }}>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  Addons
                                </Typography>
                                <Table size="small" aria-label="addons">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Name</TableCell>
                                      <TableCell>
                                        Prix unitaire(
                                        {row?.currency})
                                      </TableCell>
                                      <TableCell align="right">
                                        Total ({row?.currency})
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {productRow.addons.map((addonRow) => {
                                      return (
                                        <TableRow key={addonRow.name}>
                                          <TableCell component="th" scope="row">
                                            X{addonRow.count} {addonRow.name}
                                          </TableCell>
                                          <TableCell>
                                            {addonRow.total
                                              ? addonRow.pu
                                              : "Gratuit"}
                                          </TableCell>
                                          <TableCell align="right">
                                            {addonRow.total
                                              ? addonRow.total
                                              : "Gratuit"}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </Box>
                            )}
                          </Collapse>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={4}
                        >
                          <Collapse
                            in={addonsOpen}
                            timeout="auto"
                            unmountOnExit
                            component="div"
                          >
                            {productRow.extras.length > 0 && (
                              <Box sx={{ margin: 1 }}>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  Extras
                                </Typography>
                                <Table size="small" aria-label="extras">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Name</TableCell>
                                      <TableCell>
                                        Prix unitaire(
                                        {row?.currency})
                                      </TableCell>
                                      <TableCell align="right">
                                        Total ({row?.currency})
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {productRow.extras.map((extraRow) => {
                                      return (
                                        <TableRow key={extraRow.name}>
                                          <TableCell component="th" scope="row">
                                            X{extraRow.count} {extraRow.name}
                                          </TableCell>
                                          <TableCell>
                                            {extraRow.pu
                                              ? extraRow.pu
                                              : "Gratuit"}
                                          </TableCell>
                                          <TableCell align="right">
                                            {extraRow.total
                                              ? extraRow.total
                                              : "Gratuit"}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </Box>
                            )}
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const History = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const histories = useSelector(selectAllHistory);
  const error = useSelector(getHistoryError);
  const historyStatus = useSelector(getHistoryStatus);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const isLightMode = theme.palette.mode === "light";

  let content;
  let filteredHistory = [];
  if (historyStatus === "loading") {
    content = <Loading />;
  } else if (historyStatus === "fetchError") {
    content = <Error>{error}</Error>;
  }
  if (historyStatus === "fetchData") {
    const rows = histories.map((history) =>
      createData(
        history.product,
        history.pack,
        history.commandNumber,
        history.name,
        history.total,
        history.currency,
        history.boughtAt
      )
    );
    filteredHistory = rows?.filter((history) =>
      history.boughtAt.includes(search.toLowerCase())
    );
  }
  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="main-application">
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h3" color="inherit" noWrap>
            Mes Historie
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
              style={{ paddingLeft: "10px", maxWidth: "300px" }}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <main>
        <Paper sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table aria-label="sticky table">
              <TableHead
                style={{
                  backgroundColor: isLightMode
                    ? colors.primary[700]
                    : colors.primary[700],
                }}
              >
                <TableRow>
                  <TableCell sx={{ fontSize: "17px", fontWeight: "bold" }}>
                    {" "}
                    Plus d'information{" "}
                  </TableCell>
                  <TableCell sx={{ fontSize: "17px", fontWeight: "bold" }}>
                    Pack
                  </TableCell>
                  <TableCell sx={{ fontSize: "17px", fontWeight: "bold" }}>
                    Numéro de commande
                  </TableCell>
                  <TableCell sx={{ fontSize: "17px", fontWeight: "bold" }}>
                    Nom du client
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: "17px", fontWeight: "bold" }}
                  >
                    Total
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: "17px", fontWeight: "bold" }}
                  >
                    Acheté à
                  </TableCell>
                </TableRow>
              </TableHead>
              {!content && (
                <>
                  {filteredHistory && filteredHistory.length > 0 ? (
                    filteredHistory
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return <Row key={row.pack} row={row} />;
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5}>
                        {historyStatus === "loading" ? (
                          <Loading />
                        ) : historyStatus === "fetchError" ? (
                          <Error>{error}</Error>
                        ) : (
                          <NoData />
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            sx={{
              backgroundColor: isLightMode ? "#F0F0F7" : colors.primary[400],
            }}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredHistory.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </main>
    </div>
  );
};

export default History;
