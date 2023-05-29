import { Grid } from "@mui/material";
import Loader from "react-spinners/ClockLoader";

const Loading = () => {
  return (
    <Grid container justifyContent="center" alignItems="center" height="60vh">
      <Loader color={"#E9313C"} size={80}/>
    </Grid>
  );
};

export default Loading;
