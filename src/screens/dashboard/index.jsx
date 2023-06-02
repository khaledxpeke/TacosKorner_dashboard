import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import TrafficIcon from "@mui/icons-material/Traffic";
import StatBox from "../../components/statBox";
import ProgressCircle from "../../components/progressCircle";
import { mockTransactions } from "../../data/mockData";
import MyResponsiveLine from "../../components/responsiveLine";
import BarChart from "../../components/barChart";
import { useDispatch, useSelector } from "react-redux";
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {
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
  let content;
  let sales;
  let commands = histories.length;
  let plats=0;
  let importer=0;
  let surPlace=0;
  if (historyStatus === "loading") {
    content = <Loading />;
  } else if (historyStatus === "fetchError") {
    content = <Error>{error}</Error>;
  }
  if (historyStatus === "fetchData") {
    console.log(histories)
    histories.map((history) => {
      sales = histories.reduce(
        (total, history) => total + parseFloat(history.total),
        0
      );
      plats += history.product.length;
      if(history.pack==="Importer"){
        importer+=1
      }else{
        surPlace+=1
      }
      return null;
    });
  }
  let surPlacePercentage = (surPlace / commands) * 100;
  let importerPercentage = (importer / commands) * 100;
  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to Tacos Korner" />
      </Box>
      {content}
      {!content && (
        <>
          <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="20px"
          >
            {/* ROW 1 */}
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
                progress={surPlacePercentage/100}
                increase={surPlacePercentage+" %"}
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
                progress={importerPercentage/100}
                increase={importerPercentage+" %"}
                icon={
                  <TrafficIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            {/* ROW 2 */}
            <Box
              gridColumn="span 8"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
            >
              <Box
                mt="25px"
                p="0 30px"
                display="flex "
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                  >
                    Revenue Generated
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={colors.greenAccent[500]}
                  >
                    $59,342.32
                  </Typography>
                </Box>
                <Box>
                  <IconButton>
                    <DownloadOutlinedIcon
                      sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                    />
                  </IconButton>
                </Box>
              </Box>
              <Box height="250px" m="-20px 0 0 0">
                <MyResponsiveLine />
              </Box>
            </Box>
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
                  Recent Transactions
                </Typography>
              </Box>
              {mockTransactions.map((transaction, i) => (
                <Box
                  key={`${transaction.txId}-${i}`}
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
                      {transaction.txId}
                    </Typography>
                    <Typography color={colors.grey[100]}>
                      {transaction.user}
                    </Typography>
                  </Box>
                  <Box color={colors.grey[100]}>{transaction.date}</Box>
                  <Box
                    backgroundColor={colors.greenAccent[500]}
                    p="5px 10px"
                    borderRadius="4px"
                  >
                    ${transaction.cost}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* ROW 3 */}
            <Box
              gridColumn="span 4"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
              p="30px"
            >
              <Typography variant="h5" fontWeight="600">
                Campaign
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mt="25px"
              >
                <ProgressCircle size="125" />
                <Typography
                  variant="h5"
                  color={colors.greenAccent[500]}
                  sx={{ mt: "15px" }}
                >
                  $48,352 revenue generated
                </Typography>
                <Typography>
                  Includes extra misc expenditures and costs
                </Typography>
              </Box>
            </Box>
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
                Sales Quantity
              </Typography>
              <Box height="250px" mt="-20px">
                <BarChart />
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};
export default Dashboard;
