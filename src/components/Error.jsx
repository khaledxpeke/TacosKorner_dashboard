import { Grid, Typography } from "@mui/material";

const Error = ({ children = "An error occurred" }) => {
  return (
    <Grid container justifyContent="center" alignItems="center" height="60vh">
      <Grid item>
        <Typography variant="h1" color="error">
          {children}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Error;
