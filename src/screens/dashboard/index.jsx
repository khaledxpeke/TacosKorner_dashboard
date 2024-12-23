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
import { useLayoutEffect, useState } from "react";
import Loading from "../../components/loading";
import { debounce } from "lodash";
import { useResponsive } from "../../hooks/uiHook";
const Dashboard = () => {
  const { isSmallScreen } = useResponsive();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const histories = useSelector(selectAllHistory);
  const error = useSelector(getHistoryError);
  const historyStatus = useSelector(getHistoryStatus);

  const recents = useSelector(selectRecentHistory);
  const recentsError = useSelector(getRecentHistoryError);
  const recentsStatus = useSelector(getRecentHistoryStatus);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const categoryCounts = {};
  let content;
  let content2;
  let sales = 0;
  let commands = histories.length;
  let plats = 0;
  let importer = 0;
  let surPlace = 0;
  if (historyStatus === "loading") {
    content = <Loading />;
  } else if (historyStatus === "fetchError") {
    content = <Error>{error}</Error>;
  }
  if (historyStatus === "fetchData") {
    sales = 0;
    plats = 0;
    importer = 0;
    surPlace = 0;
    histories.forEach((history) => {
      sales += parseFloat(history.total);
      plats += history.product.length;
      history.product.forEach((prod) => {
        if (prod.plat) {
          const category = prod.plat.category.name.toLowerCase();
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      });
      if (history.pack === "Importer") {
        importer += 1;
      } else {
        surPlace += 1;
      }
    });
  }

  let surPlacePercentage = (surPlace / commands) * 100;
  let importerPercentage = (importer / commands) * 100;
  useLayoutEffect(() => {
    dispatch(fetchHistory());
    dispatch(fetchRecentHistories());
  }, [dispatch]);
  useLayoutEffect(() => {
    const handleResize = debounce(() => {
      setWindowSize(window.innerWidth);
    }, 300); // Adjust debounce interval as needed

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowSize]);
  if (recentsStatus === "loading") {
    content2 = <Loading />;
  } else if (recentsStatus === "fetchRecentsError") {
    content2 = <Error>{recentsError}</Error>;
  }
  if (recentsStatus === "fetchRecentsData") {
  }
  return (
    <Box m="20px" className="main-application">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Bienvenue au Tacos Korner" />
      </Box>
      {content}

      <Box
        display="grid"
        gridTemplateColumns={isSmallScreen ? "1fr" : "repeat(12, 1fr)"}
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        {!content && (
          <>
            <Box
              gridColumn={isSmallScreen ? "span 10" : "span 2"}
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
              gridColumn={isSmallScreen ? "span 10" : "span 3"}
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
              gridColumn={isSmallScreen ? "span 10" : "span 2"}
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
              gridColumn={isSmallScreen ? "span 10" : "span 3"}
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={surPlace}
                subtitle=" Sur place"
                progress={surPlacePercentage / 100}
                increase={surPlacePercentage.toFixed(2) + " %"}
                icon={
                  <TrafficIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn={isSmallScreen ? "span 10" : "span 2"}
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={importer}
                subtitle="Impoter"
                progress={importerPercentage / 100}
                increase={importerPercentage.toFixed(2) + " %"}
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
              gridColumn={isSmallScreen ? "span 10" : "span 8"}
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
            >
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{ padding: "10px" }}
              >
                Quantité de vente
              </Typography>
              <Box height="250px" >
                <BarChart
                  data={Object.keys(categoryCounts).map((category) => ({
                    category:
                      category.charAt(0).toUpperCase() + category.slice(1),
                    quantity: categoryCounts[category],
                  }))}
                />
              </Box>
            </Box>
          </>
        )}
        {!content2 && (
          <>
            <Box
              gridColumn={isSmallScreen ? "span 10" : "span 4"}
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
