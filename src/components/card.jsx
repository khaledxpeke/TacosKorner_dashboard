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
import { useNavigate } from "react-router-dom";
const ProductCard = ({ data, content,handleClickOpen }) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const navigate = useNavigate();
  const handleModify = () => {
    navigate("/modifyCategory", { state: { category: data } });
  };
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
          component="div"
          sx={{
            objectFit: "cover",
            height: 0,
            paddingTop: "56.25%",
            backgroundImage: `url(http://localhost:3300/api/${data.image})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
          }}
          image={`http://localhost:3300/api/${data.image.replace(/\\/g, "/")}`}
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
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ProductCard;
