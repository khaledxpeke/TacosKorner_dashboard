import { Grid, Typography } from "@mui/material";

const NoData = () => {
  return (
    <Grid container justifyContent="center" alignItems="center" height="60vh">
      <Grid item>
        <Typography variant="h3" color="textPrimary">
          Aucune donnée disponible
        </Typography>
      </Grid>
    </Grid>
  );
};

export default NoData;
