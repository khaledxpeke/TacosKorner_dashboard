import { Box, Button, IconButton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import ImageVideoInput from "../../../components/imageVideoInput";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getCarouselsError,
  getCarouselsStatus,
  getCarouselsSuccess,
  addCarouselMedia,
  updateStatus,
} from "../../../features/carouselSlice";
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;

const AddToCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(getCarouselsStatus);
  const error = useSelector(getCarouselsError);
  const success = useSelector(getCarouselsSuccess);
  const handleSubmit = () => {
    if (list.length > 0) {
      const formData = new FormData();
      list.forEach((file) => {
        formData.append("files", file);
      });
      list.forEach((file) => {
        formData.append(
          "mediaType",
          file.type === "video/mp4" ? "video" : "image"
        );
      });
      dispatch(addCarouselMedia(formData));
    }
  };

  useEffect(() => {
    if (status === "addSuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/carousel");
    } else if (status === "addError") {
      toast.error(error);
    }
  }, [status, error, success, dispatch, navigate]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [list, setList] = useState([]);

  const handleImageAdd = (item) => {
    setList((prevList) => [item, ...prevList]);
  };

  const handleRemoveImage = (index) => {
    setList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const renderMedia = (item) => {
    const isVideo =
      item instanceof File ? item.type === "video/mp4" : item.endsWith(".mp4");
    const src =
      item instanceof File ? URL.createObjectURL(item) : `${apiUrl}/${item}`;

    return isVideo ? (
      <video
        src={src}
        style={{
          maxWidth: "200px",
          maxHeight: "200px",
          cursor: "pointer",
        }}
        controls
      />
    ) : (
      <img
        src={src}
        alt="Uploaded"
        style={{
          maxWidth: "200px",
          maxHeight: "200px",
          cursor: "pointer",
        }}
      />
    );
  };

  return (
    <Box m="20px" className="main-application">
      <Header title="AJOUTER MEDIA" subtitle="Créer un nouveau média" />
      <Box display="flex" alignItems="center" gap="10px" mb="20px">
        <ImageVideoInput previewImage={null} setPreviewImage={handleImageAdd} />
        <Button
          sx={{ height: 30 }}
          type="submit"
          color="secondary"
          variant="contained"
          onClick={() => handleSubmit()}
        >
          Soumettre
        </Button>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        {list.map((item, index) => (
          <Box key={index} position="relative" className="item-container">
            <IconButton
              type="button"
              onClick={() => handleRemoveImage(index)}
              sx={{
                position: "absolute",
                top: "-8px",
                zIndex: 10,
              }}
            >
              <CloseIcon
                sx={{ color: "red", fontSize: "30px", fontWeight: "bold" }}
              />
            </IconButton>
            {renderMedia(item)}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AddToCarousel;
