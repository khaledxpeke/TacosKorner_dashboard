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
const apiUrl=process.env.REACT_APP_API_URL
const ProductCard = ({
  data,
  content,
  handleClickOpen,
  handleModify,
  viewProduct,
  noModify
}) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          paddingTop: "14px",
          backgroundColor: isLightMode ? "#F0F0F7" : "dark",
        }}
      >
        <CardMedia
          onClick={viewProduct}
          component="div"
          sx={{
            cursor: viewProduct ? "pointer" : "default",
            objectFit: "cover",
            height: 0,
            paddingTop: "56.25%",
            backgroundImage: `url(${apiUrl}/${data.image})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
          }}
          image={`${apiUrl}/${data.image.replace(/\\/g, "/")}`}
        />
        <CardContent
          sx={{
            flexGrow: 1,
          }}
        >
          <Typography gutterBottom variant="h5" component="h2">
            {data.name}
          </Typography>
          <Typography variant="h7" color="text.secondary">
            {content}
          </Typography>
        </CardContent>
        <CardActions>
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
          {!noModify && (
            <Button
              variant="contained"
              color="warning"
              size="small"
              startIcon={<EditIcon />}
              style={{ color: "white" }}
              onClick={handleModify}
            >
              Modifier
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ProductCard;
