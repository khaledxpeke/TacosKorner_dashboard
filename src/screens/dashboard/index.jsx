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
// import { data } from "react-router-dom";
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
  const [monthlyStats, setMonthlyStats] = useState({
    currentMonth: { sales: 0, commands: 0, plats: 0, surPlace: 0, importer: 0 },
    previousMonth: {
      sales: 0,
      commands: 0,
      plats: 0,
      surPlace: 0,
      importer: 0,
    },
  });
  const categoryCounts = {};
  let content;
  let content2;
  let sales = 0;
  let commands = histories.length;
  let plats = 0;
  let importer = 0;
  let surPlace = 0;
  useLayoutEffect(() => {
    if (historyStatus === "fetchData" && histories.length > 0) {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
      const currentMonthData = histories.filter((history) => {
        const date = new Date(history.boughtAt);
        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      });

      const previousMonthData = histories.filter((history) => {
        const date = new Date(history.boughtAt);
        return (
          date.getMonth() === previousMonth &&
        date.getFullYear() === previousYear
        );
      });

      const currentStats = {
        sales: currentMonthData.reduce(
          (sum, history) => sum + parseFloat(history.total),
          0
        ),
        commands: currentMonthData.length,
        plats: currentMonthData.reduce(
          (sum, history) => sum + history.product.length,
          0
        ),
        surPlace: currentMonthData.filter((h) => h.pack !== "Importer").length,
        importer: currentMonthData.filter((h) => h.pack === "Importer").length,
      };

      const previousStats = {
        sales: previousMonthData.reduce(
          (sum, history) => sum + parseFloat(history.total),
          0
        ),
        commands: previousMonthData.length,
        plats: previousMonthData.reduce(
          (sum, history) => sum + history.product.length,
          0
        ),
        surPlace: previousMonthData.filter((h) => h.pack !== "Importer").length,
        importer: previousMonthData.filter((h) => h.pack === "Importer").length,
      };

      setMonthlyStats({
        currentMonth: currentStats,
        previousMonth: previousStats,
      });
    }
  }, [historyStatus, histories]);
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

  // let surPlacePercentage = (surPlace / commands) * 100;
  // let importerPercentage = (importer / commands) * 100;
  useLayoutEffect(() => {
    dispatch(fetchHistory());
    dispatch(fetchRecentHistories());
  }, [dispatch]);
  useLayoutEffect(() => {
    const handleResize = debounce(() => {
      setWindowSize(window.innerWidth);
    }, 300);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowSize]);
  if (recentsStatus === "loading") {
    content2 = <Loading />;
  } else if (recentsStatus === "fetchRecentsError") {
    content2 = <Error>{recentsError}</Error>;
  }
  return (
    <Box m="20px" className="main-application">
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
                progress={monthlyStats.currentMonth.sales === 0 ? "0.00" : (
                  monthlyStats.currentMonth.sales /
                  (monthlyStats.previousMonth.sales || 1)
                ).toFixed(2)}
                increase={monthlyStats.currentMonth.sales === 0 ? "0%" : 
                  `${monthlyStats.currentMonth.sales >= monthlyStats.previousMonth.sales ? "+" : ""}${(
                    ((monthlyStats.currentMonth.sales - monthlyStats.previousMonth.sales) /
                    (monthlyStats.previousMonth.sales || 1)) *
                    100
                  ).toFixed(1)}%`
                }
                icon={
                  <PointOfSaleIcon
                    sx={{ color:  monthlyStats.currentMonth.sales >= monthlyStats.previousMonth.sales 
                      ? colors.greenAccent[600] 
                      : colors.redAccent[600], fontSize: "26px" }}
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
                title={commands + " Commandes"}
                subtitle="Nombre de commandes"
                progress={monthlyStats.currentMonth.commands === 0 ? "0.00" : (
                  monthlyStats.currentMonth.commands /
                  (monthlyStats.previousMonth.commands || 1)
                ).toFixed(2)}
                increase={monthlyStats.currentMonth.commands === 0 ? "0%" : 
                  `${monthlyStats.currentMonth.commands >= monthlyStats.previousMonth.commands ? "+" : ""}${(
                    ((monthlyStats.currentMonth.commands - monthlyStats.previousMonth.commands) /
                    (monthlyStats.previousMonth.commands || 1)) *
                    100
                  ).toFixed(1)}%`
                }
                icon={
                  <LocalShippingIcon
                  sx={{ 
                    color: monthlyStats.currentMonth.commands >= monthlyStats.previousMonth.commands 
                      ? colors.greenAccent[600] 
                      : colors.redAccent[600],
                    fontSize: "26px" 
                  }}
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
                progress={monthlyStats.currentMonth.plats === 0 ? "0.00" : (
                  monthlyStats.currentMonth.plats /
                  (monthlyStats.previousMonth.plats || 1)
                ).toFixed(2)}
                increase={monthlyStats.currentMonth.plats === 0 ? "0%" : 
                  `${monthlyStats.currentMonth.plats >= monthlyStats.previousMonth.plats ? "+" : ""}${(
                    ((monthlyStats.currentMonth.plats - monthlyStats.previousMonth.plats) /
                    (monthlyStats.previousMonth.plats || 1)) *
                    100
                  ).toFixed(1)}%`
                }
                icon={
                  <RamenDiningIcon
                  sx={{ 
                    color: monthlyStats.currentMonth.plats >= monthlyStats.previousMonth.plats 
                      ? colors.greenAccent[600] 
                      : colors.redAccent[600],
                    fontSize: "26px" 
                  }}
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
                progress={monthlyStats.currentMonth.surPlace === 0 ? "0.00" : (
                  monthlyStats.currentMonth.surPlace /
                  (monthlyStats.previousMonth.surPlace || 1)
                ).toFixed(2)}
                increase={monthlyStats.currentMonth.surPlace === 0 ? "0%" : 
                  `${monthlyStats.currentMonth.surPlace >= monthlyStats.previousMonth.surPlace ? "+" : ""}${(
                    ((monthlyStats.currentMonth.surPlace - monthlyStats.previousMonth.surPlace) /
                    (monthlyStats.previousMonth.surPlace || 1)) *
                    100
                  ).toFixed(1)}%`
                }
                icon={
                  <TrafficIcon
                  sx={{ 
                    color: monthlyStats.currentMonth.surPlace >= monthlyStats.previousMonth.surPlace 
                      ? colors.greenAccent[600] 
                      : colors.redAccent[600],
                    fontSize: "26px" 
                  }}
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
                progress={monthlyStats.currentMonth.importer === 0 ? "0.00" : (
                  monthlyStats.currentMonth.importer /
                  (monthlyStats.previousMonth.importer || 1)
                ).toFixed(2)}
                increase={monthlyStats.currentMonth.importer === 0 ? "0%" : 
                  `${monthlyStats.currentMonth.importer >= monthlyStats.previousMonth.importer ? "+" : ""}${(
                    ((monthlyStats.currentMonth.importer - monthlyStats.previousMonth.importer) /
                    (monthlyStats.previousMonth.importer || 1)) *
                    100
                  ).toFixed(1)}%`
                }
                icon={
                  <TrafficIcon
                    sx={{  color: monthlyStats.currentMonth.importer >= monthlyStats.previousMonth.importer 
                      ? colors.greenAccent[600] 
                      : colors.redAccent[600],
                    fontSize: "26px"  }}
                  />
                }
              />
            </Box>
          </>
        )}
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
              <Box height="250px">
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
              {recents.map((recent) => {
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
