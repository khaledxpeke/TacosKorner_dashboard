import { Grid } from "@mui/material";
import Loader from "react-spinners/PulseLoader";

const Loading = ({ message = "Loading..." }) => {
  return (
    <Grid container justifyContent="center" alignItems="center" height="60vh">
      <Loader color={"#E9313C"} size={20}/>
    </Grid>
  );
};

export default Loading;
