import { Box, Button, Typography, Container } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getCarouselMedia,
  selectAllCarousels,
  getCarouselsStatus,
  getCarouselsError,
  getCarouselsLoading,
  updateCarouselOrder,
  updateStatus,
  getCarouselsSuccess,
} from "../../../features/carouselSlice";
import Loading from "../../../components/loading";
import AddCarouselMedia from "../CarouselMedia/addToCarousel";
import { toast } from "react-toastify";

const CarouselManagement = () => {
  const dispatch = useDispatch();
  const carouselItems = useSelector((state) => state.carousel?.items || []);
  const status = useSelector(getCarouselsStatus);
  const loading = useSelector(getCarouselsLoading);
  const error = useSelector(getCarouselsError);
  const success = useSelector(getCarouselsSuccess);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newItems = Array.from(carouselItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
    console.log("newItems", newItems);
    const updatedItems = newItems.map((item, index) => ({
      id: item._id,
      order: index + 1,
    }));

    dispatch(updateCarouselOrder(updatedItems));
  };
  useEffect(() => {
    if (status === "updateSuccess") {
      toast.success(success);
      dispatch(updateStatus());
    } else if (status === "updateError") {
      toast.error(error);
    }
  }, [status, dispatch, error]);
  useEffect(() => {
    dispatch(getCarouselMedia());
    if (status==="fetchData") 
    setItems(carouselItems);
  }, [dispatch,status,carouselItems]);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">Carousel Management</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpen(true)}
        >
          Add Media
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="carousel">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {carouselItems &&
                carouselItems.map((item, index) => (
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
                            cursor: 'grab',
                            '&:active': {
                              cursor: 'grabbing'
                            },
                            userSelect: 'none'
                          }}
                      >
                        {item.mediaType === "image" ? (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${item.fileUrl}`}
                            alt="carousel"
                            style={{ width: "200px", height: "200px", pointerEvents: 'none' }}
                          />
                        ) : (
                          <video
                            src={`${process.env.REACT_APP_API_URL}/${item.fileUrl}`}
                            style={{ width: "200px", height: "200px", pointerEvents: 'none' }}
                            // controls
                            onDragStart={(e) => e.preventDefault()}
                          />
                        )}
                      </Box>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <AddCarouselMedia open={open} handleClose={() => setOpen(false)} />
    </Container>
  );
};

export default CarouselManagement;
