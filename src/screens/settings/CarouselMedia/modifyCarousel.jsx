import { Box, Button } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getCarouselMedia,
  getCarouselsStatus,
  getCarouselsError,
  updateCarouselOrder,
  updateStatus,
  getCarouselsSuccess,
  deleteCarouselMedia,
} from "../../../features/carouselSlice";
import { toast } from "react-toastify";
import Header from "../../../components/Header";
import AlertDialog from "../../../components/dialog";

const ModifyCarousel = () => {
  const dispatch = useDispatch();
  const carouselItems = useSelector((state) => state.carousel?.items || []);
  const status = useSelector(getCarouselsStatus);
  const error = useSelector(getCarouselsError);
  const success = useSelector(getCarouselsSuccess);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [mediaId, setMediaId] = useState("");
  const handleOpen = (id) => {
    setOpen(true);
    setMediaId(id);
  };
  const handleDelete = (id) => {
    dispatch(deleteCarouselMedia(id));
    setOpen(false);
  };
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(carouselItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
    const updatedItems = newItems.map((item, index) => ({
      id: item._id,
      order: index + 1,
    }));
    dispatch(updateCarouselOrder(updatedItems));
  };
  useEffect(() => {
    if (status === "deleteSuccess") {
      const updatedItems = items.filter((item) => item._id !== mediaId);
      setItems(updatedItems);
      setMediaId("");
      toast.success(success);
      dispatch(updateStatus());
    } else if (status === "deleteError") {
      setMediaId("");
      toast.error(error);
    }
  }, [status, dispatch, error, success, items, mediaId]);
  useEffect(() => {
    if (status === "updateSuccess") {
      toast.success(success);
      dispatch(updateStatus());
    } else if (status === "updateError") {
      toast.error(error);
    }
  }, [status, dispatch, error, success]);
  useEffect(() => {
    if (status === "fetchData") {
      setItems(carouselItems);
    }
  }, [status, carouselItems]);

  useEffect(() => {
    if (status === "idle" && items.length === 0) {
      dispatch(getCarouselMedia());
    }
  }, [dispatch, status, items.length]);

  return (
    <div className="main-application">
      <Header
        title="MODIFIER OU SUPPRIMER MEDIA"
        subtitle="Modifier le positionnement ou supprimer des médias"
      />
      <main>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="carousel">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {items &&
                  items.map((item, index) => (
                    <Draggable
                      key={item._id}
                      draggableId={item._id}
                      index={index}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "grab",
                            "&:active": {
                              cursor: "grabbing",
                            },
                            userSelect: "none",
                            marginBottom: 2,
                            gap: 2,
                          }}
                        >
                          {item.mediaType === "image" ? (
                            <img
                              src={`${process.env.REACT_APP_API_URL}/${item.fileUrl}`}
                              alt="carousel"
                              style={{
                                width: "200px",
                                height: "200px",
                                pointerEvents: "none",
                              }}
                            />
                          ) : (
                            <video
                              src={`${process.env.REACT_APP_API_URL}/${item.fileUrl}`}
                              style={{
                                width: "200px",
                                height: "200px",
                                pointerEvents: "none",
                              }}
                              onDragStart={(e) => e.preventDefault()}
                            />
                          )}
                          <Button
                            type="submit"
                            color="error"
                            variant="contained"
                            onClick={() => handleOpen(item._id)}
                          >
                            Supprimer
                          </Button>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        <AlertDialog
          handleClose={() => setOpen(false)}
          open={open}
          name={"produit"}
          cardId={mediaId}
          deleteData={() => handleDelete(mediaId)}
        />
      </main>
    </div>
  );
};

export default ModifyCarousel;
