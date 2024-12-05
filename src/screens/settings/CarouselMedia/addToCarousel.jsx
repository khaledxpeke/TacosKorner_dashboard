import { Box, Button, IconButton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import ImageVideoInput from "../../../components/imageVideoInput";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Add";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const apiUrl = process.env.REACT_APP_API_URL;

const AddToCarousel = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [list, setImages] = useState([]);

  const handleImageAdd = (item) => {
    setImages([item, ...list]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = list.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return; // Dropped outside the list

    const reorderedList = Array.from(list);
    const [movedItem] = reorderedList.splice(source.index, 1);
    reorderedList.splice(destination.index, 0, movedItem);

    setImages(reorderedList);
  };
  console.log(list);

  return (
    <Box m="20px" className="main-application">
      <Header title="AJOUTER DESSERT" subtitle="Créer une nouvelle dessert" />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="image-list" direction="vertical">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {list.map((item, index) => (
                <Draggable
                  key={index}
                  draggableId={String(index)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="item-item"
                    >
                      <IconButton
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        sx={{ ml: 22 }}
                      >
                        <CloseIcon />
                      </IconButton>
                      {item instanceof File ? (
                        // If it's a File instance, check its type for video files
                        item.type === "video/mp4" ? (
                          <video
                            src={URL.createObjectURL(item)}
                            // controls
                            style={{
                              maxWidth: "200px",
                              maxHeight: "200px",
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <img
                            src={URL.createObjectURL(item)}
                            alt="Uploaded"
                            style={{
                              maxWidth: "200px",
                              maxHeight: "200px",
                              cursor: "pointer",
                            }}
                          />
                        )
                      ) : // If it's a URL or string (not a File), handle it as a path
                      item.slice(-4) === ".mp4" ? (
                        <video
                          src={`${apiUrl}/${item}`}
                        //   controls
                          style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            cursor: "pointer",
                          }}
                        />
                      ) : (
                        <img
                          src={`${apiUrl}/${item}`}
                          alt="Uploaded"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            cursor: "pointer",
                          }}
                        />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <ImageVideoInput
        sx={{ gridColumn: "span 2", gridRow: "2 / span 2" }}
        previewImage={null}
        setPreviewImage={handleImageAdd}
      />
      <Box display="flex" justifyContent="end" mt="20px">
        <Button type="submit" color="secondary" variant="contained">
          Soumettre
        </Button>
      </Box>
    </Box>
  );
};

export default AddToCarousel;
