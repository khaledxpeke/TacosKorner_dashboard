import { Box } from "@mui/material";
import Loader from "react-spinners/ClockLoader";

const Loading = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Loader color={"#E9313C"} />
    </Box>
  );
};

export default Loading;
