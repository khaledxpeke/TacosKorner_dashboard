import * as React from "react";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  ImageList,
  ImageListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { getCarouselMedia } from "../../../features/carouselSlice";
import { useDispatch, useSelector } from "react-redux";
const apiUrl = process.env.REACT_APP_API_URL;
const CarouselMedia = () => {
  const navigate = useNavigate();
  const handleFullscreen = (src, type) => {
    const fullscreenElement = document.createElement(
      type === "video" ? "video" : "img"
    );
    fullscreenElement.src = src;
    fullscreenElement.style.position = "fixed";
    fullscreenElement.style.top = 0;
    fullscreenElement.style.left = 0;
    fullscreenElement.style.width = "100vw";
    fullscreenElement.style.height = "100vh";
    fullscreenElement.style.objectFit = "contain";
    fullscreenElement.style.backgroundColor = "black";
    fullscreenElement.style.zIndex = 9999;

    if (type === "video") {
      fullscreenElement.controls = true;
      fullscreenElement.autoplay = true;
    }

    document.body.appendChild(fullscreenElement);

    const closeFullscreen = () => {
      fullscreenElement.remove();
    };

    fullscreenElement.onclick = closeFullscreen;
  };

  const dispatch = useDispatch();
  const carouselItems = useSelector((state) => state.carousel?.items || []);
  React.useEffect(() => {
    dispatch(getCarouselMedia());
  }, [dispatch]);

  return (
    <div className="main-application">
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h3" color="inherit" noWrap>
            Carousel
          </Typography>
          <Box style={{ marginLeft: "auto" }}>
            <Button
              variant="contained"
              color="info"
              startIcon={<EditIcon />}
              onClick={() => navigate("/modifyCarousel")}
              style={{ marginRight: 4 }}
            >
              Modifier
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={() => navigate("/addToCarousel")}
            >
              Ajouter
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <main>
        <ImageList variant="masonry" cols={3} gap={8}>
          {carouselItems &&
            carouselItems.map((item, index) => (
              <ImageListItem key={index}>
                {item.mediaType === "image" ? (
                  <img
                    src={`${apiUrl}/${item.fileUrl}?w=248&fit=crop&auto=format`}
                    srcSet={`${apiUrl}/${item.fileUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={index}
                    loading="lazy"
                    onClick={() =>
                      handleFullscreen(`${apiUrl}/${item.fileUrl}`, "image")
                    }
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <video
                    src={`${apiUrl}/${item.fileUrl}`}
                    controls
                    onClick={() =>
                      handleFullscreen(`${apiUrl}/${item.fileUrl}`, "video")
                    }
                    style={{ cursor: "pointer", width: "100%" }}
                  />
                )}
              </ImageListItem>
            ))}
        </ImageList>
      </main>
    </div>
  );
};

export default CarouselMedia;
