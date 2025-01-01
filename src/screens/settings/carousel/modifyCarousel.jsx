import { Box, Button } from "@mui/material";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        ...style,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        marginBottom: 2,
        gap: 2,
      }}
    >
      {children}
    </Box>
  );
};

const ModifyCarousel = () => {
  const dispatch = useDispatch();
  const carouselItems = useSelector((state) => state.carousel?.items || []);
  const status = useSelector(getCarouselsStatus);
  const error = useSelector(getCarouselsError);
  const success = useSelector(getCarouselsSuccess);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [mediaId, setMediaId] = useState("");

  const sensors = useSensors(useSensor(PointerSensor));

  const handleOpen = (id) => {
    setOpen(true);
    setMediaId(id);
  };

  const handleDelete = (id) => {
    dispatch(deleteCarouselMedia(id));
    setOpen(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      setItems(newOrder);

      const updatedItems = newOrder.map((item, index) => ({
        id: item._id,
        order: index + 1,
      }));
      dispatch(updateCarouselOrder(updatedItems));
    }
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item._id)}
            strategy={verticalListSortingStrategy}
          >
            <Box>
              {items &&
                items.map((item) => (
                  <SortableItem key={item._id} id={item._id}>
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
                  </SortableItem>
                ))}
            </Box>
          </SortableContext>
        </DndContext>
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
