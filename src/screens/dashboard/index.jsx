import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import TrafficIcon from "@mui/icons-material/Traffic";
import StatBox from "../../components/statBox";
import BarChart from "../../components/barChart";
import { useDispatch, useSelector } from "react-redux";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import {
  fetchRecentHistories,
  getRecentHistoryError,
  getRecentHistoryStatus,
  selectRecentHistory,
  fetchHistory,
  getHistoryError,
  getHistoryStatus,
  selectAllHistory,
} from "../../features/historySlice";
import Error from "../../components/Error";
import { useEffect } from "react";
import Loading from "../../components/loading";
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const histories = useSelector(selectAllHistory);
  const error = useSelector(getHistoryError);
  const historyStatus = useSelector(getHistoryStatus);

  const recents = useSelector(selectRecentHistory);
  const recentsError = useSelector(getRecentHistoryError);
  const recentsStatus = useSelector(getRecentHistoryStatus);

  let content;
  let content2;
  let sales=0;
  let commands = histories.length;
  let plats = 0;
  let importer = 0;
  let surPlace = 0;
  let burger = 0;
  let pizza = 0;
  let panini = 0;
  let drinks = 0;
  let chiken = 0;
  let tacos = 0;
  let desert = 0;
  if (historyStatus === "loading") {
    content = <Loading />;
  } else if (historyStatus === "fetchError") {
    content = <Error>{error}</Error>;
  }
  if (historyStatus === "fetchData") {
    histories.map((history) => {
      history.product.map((prod) => {
        if (prod.plat) {
        if (prod.plat.category.name.toLowerCase() === "burgers") {
          burger++;
        } else if (prod.plat.category.name.toLowerCase() === "pizza") {
          pizza++;
        } else if (prod.plat.category.name.toLowerCase() === "panini") {
          panini++;
        } else if (prod.plat.category.name.toLowerCase() === "drinks") {
          drinks++;
        } else if (prod.plat.category.name.toLowerCase() === "chiken") {
          chiken++;
        } else if (prod.plat.category.name.toLowerCase() === "tacos") {
          tacos++;
        } else if (prod.plat.category.name.toLowerCase() === "deserts") {
          desert++;
        }}
        return null;
      });
      sales = histories.reduce(
        (total, history) => total + parseFloat(history.total),
        0
      );
      plats += history.product.length;
      if (history.pack === "Importer") {
        importer += 1;
      } else {
        surPlace += 1;
      }
      return null;
    });
  }
  let surPlacePercentage = (surPlace / commands) * 100;
  let importerPercentage = (importer / commands) * 100;
  useEffect(() => {
    dispatch(fetchHistory());
    dispatch(fetchRecentHistories());
  }, [dispatch]);
  if (recentsStatus === "loading") {
    content2 = <Loading />;
  } else if (recentsStatus === "fetchRecentsError") {
    content2 = <Error>{recentsError}</Error>;
  }
  if (recentsStatus === "fetchRecentsData") {
  }
  return (
    <Box m="20px" className="main-application" >
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Bienvenue au Tacos Korner" />
      </Box>
      {content}

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        {!content && (
          <>
            <Box
              gridColumn="span 2"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={sales + " DT"}
                subtitle="Ventes obtenues"
                progress=".50"
                increase="+50%"
                icon={
                  <PointOfSaleIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={commands + " Commands"}
                subtitle="Nombre de commandes"
                progress="0.21"
                increase="+21%"
                icon={
                  <LocalShippingIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 2"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={plats + " Plats"}
                subtitle="Nombre des plats"
                progress="0.40"
                increase="+40%"
                icon={
                  <RamenDiningIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={surPlace}
                subtitle=" Sur place"
                progress={surPlacePercentage / 100}
                increase={surPlacePercentage + " %"}
                icon={
                  <TrafficIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 2"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={importer}
                subtitle="Impoter"
                progress={importerPercentage / 100}
                increase={importerPercentage + " %"}
                icon={
                  <TrafficIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
          </>
        )}
        {/* ROW 2 */}
        {!content && (
          <>
            <Box
              gridColumn="span 8"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
            >
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{ padding: "30px 30px 0 30px" }}
              >
                Quantité de vente
              </Typography>
              <Box height="250px" mt="-20px">
                <BarChart
                  data={[
                    {
                      category: "Burgers",
                      quantity: burger,
                    },
                    {
                      category: "Tacos",
                      quantity: tacos,
                    },
                    {
                      category: "Panini",
                      quantity: panini,
                    },
                    {
                      category: "Chiken",
                      quantity: chiken,
                    },
                    {
                      category: "Drinks",
                      quantity: drinks,
                    },
                    {
                      category: "Desert",
                      quantity: desert,
                    },
                    {
                      category: "Pizza",
                      quantity: pizza,
                    },
                  ]}
                />
              </Box>
            </Box>
          </>
        )}
        {!content2 && (
          <>
            <Box
              gridColumn="span 4"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
              overflow="auto"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                colors={colors.grey[100]}
                p="15px"
              >
                <Typography
                  color={colors.grey[100]}
                  variant="h5"
                  fontWeight="900"
                >
                  10 derniers historiques
                </Typography>
              </Box>
              {recents.map((recent, index) => {
                let addon = 0;
                let plat = 0;
                recent.product.forEach((prod, i) => {
                  addon += prod.addons.length;
                  plat = i + 1;
                });

                return (
                  <Box
                    key={recent._id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={`4px solid ${colors.primary[500]}`}
                    p="15px"
                  >
                    <Box>
                      <Typography
                        color={colors.greenAccent[500]}
                        variant="h5"
                        fontWeight="600"
                      >
                        {`${plat} Plat`}
                      </Typography>
                      <Typography color={colors.grey[100]}>
                        {`${addon} Addons`}
                      </Typography>
                    </Box>
                    <Box color={colors.grey[100]}>{recent.pack}</Box>
                    <Box color={colors.grey[100]}>
                      {recent.boughtAt.substring(0, 10)}
                    </Box>
                    <Box
                      backgroundColor={colors.greenAccent[500]}
                      p="5px 10px"
                      borderRadius="4px"
                    >
                      {recent.total}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
export default Dashboard;
