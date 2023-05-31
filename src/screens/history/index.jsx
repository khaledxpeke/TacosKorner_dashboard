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

function createData(product, pack, total, boughtAt) {
  return {
    product,
    pack,
    total,
    boughtAt,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [addonsOpen, setAddonsOpen] = React.useState(false);

  const handleOpenAddons = () => {
    setAddonsOpen(!addonsOpen);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
        <TableCell align="right">{row.total}</TableCell>
        <TableCell align="right">{row.boughtAt.substring(0, 10)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Plat
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Nom</TableCell>
                    <TableCell align="right">Prix (DT)</TableCell>
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
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={2}
                        >
                          <Collapse
                            in={addonsOpen}
                            timeout="auto"
                            unmountOnExit
                            component="div"
                          >
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
                                    <TableCell align="right">
                                      Price (DT)
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {productRow.addons.map((addonRow) => (
                                    <TableRow key={addonRow?.name}>
                                      <TableCell component="th" scope="row">
                                        {addonRow?.name}
                                      </TableCell>
                                      <TableCell align="right">
                                        {addonRow?.price
                                          ? addonRow.price
                                          : "Free"}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
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
  let content;
  let filteredHistory = [];
  if (historyStatus === "loading") {
    content = <Loading />;
  } else if (historyStatus === "fetchError") {
    content = <Error>{error}</Error>;
  }
  if (historyStatus === "fetchData") {
    const rows = histories.map((history) =>
      createData(history.product, history.pack, history.total, history.boughtAt)
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
              style={{ paddingLeft: "10px", width: "300px" }}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <main>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Pack</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Bought At</TableCell>
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
                      <TableCell colSpan={4}>
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
