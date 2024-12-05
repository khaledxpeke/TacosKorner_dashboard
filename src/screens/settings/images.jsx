import * as React from "react";
import {
  AppBar,
  CssBaseline,
  ImageList,
  ImageListItem,
  Toolbar,
  Typography,
} from "@mui/material";

const CarouselMedia = () => {
  const itemData = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrTPjHOG0LBJKLlx35kYcK4hpx5xRdGNQ4tQ&s",
    "https://www.w3schools.com/html/mov_bbb.mp4",
  ];

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

  return (
    <div className="main-application">
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h3" color="inherit" noWrap>
            Carousel
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <ImageList variant="masonry" cols={3} gap={8}>
          {itemData.map((item, index) => (
            <ImageListItem key={index}>
              {item.slice(-4) !== ".mp4" ? (
                <img
                  src={`${item}?w=248&fit=crop&auto=format`}
                  srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={index}
                  loading="lazy"
                  onClick={() => handleFullscreen(item, "image")}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <video
                  src={item}
                  controls
                  onClick={() => handleFullscreen(item, "video")}
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
