import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
const ProductCard = ({ data, content,handleClickOpen }) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardMedia
          component="div"
          sx={{
            objectFit: "cover",
            height: 0,
            paddingTop: "56.25%",
            backgroundImage: `url(http://localhost:3300/api/${data.image})`,
            backgroundColor: isLightMode ? "#F0F0F7" : "dark",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
          }}
          image={`http://localhost:3300/api/${data.image.replace(/\\/g, "/")}`}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            backgroundColor: isLightMode ? "#F0F0F7" : "dark",
          }}
        >
          <Typography gutterBottom variant="h5" component="h2">
            {data.name}
          </Typography>
          <Typography variant="h7" color="text.secondary">
            {content}
          </Typography>
        </CardContent>
        <CardActions sx={{ backgroundColor: isLightMode ? "#F0F0F7" : "dark" }}>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteForeverIcon />}
            style={{ color: "white" }}
            onClick={handleClickOpen}
          >
            Supprimer
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="small"
            startIcon={<EditIcon />}
            style={{ color: "white" }}
          >
            Modifier
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ProductCard;
