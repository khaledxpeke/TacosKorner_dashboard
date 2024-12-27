import React from "react";
import upload from "../assets/upload.png";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

const apiUrl = process.env.REACT_APP_API_URL;

const ImageInput = ({
  previewImage,
  setPreviewImage,
  displayLabel,
  setDisplayLabel,
  image,
  row,
  inputId = "imageInput"
}) => {
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(file);
      setDisplayLabel(false);
    } else {
      setPreviewImage(null);
      setDisplayLabel(true);
    }
  };

  const handleCancelImage = () => {
    setPreviewImage(null);
    setDisplayLabel(true);
  };
  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridRow: row,
      }}
    >
      {previewImage && (
        <IconButton
          type="button"
          onClick={handleCancelImage}
          sx={
            {
              position: "absolute",
              top: "-8px",
              zIndex: 10,
            }
          }
        >
          <CloseIcon
            sx={{ color: "red", fontSize: "30px", fontWeight: "bold" }}
          />
        </IconButton>
      )}
      <label htmlFor={inputId}>
        <img
          src={
            previewImage
              ? URL.createObjectURL(previewImage)
              : image
              ? `${apiUrl}/${image.replace(/\\/g, '/')}`
              : upload
          }
          alt="Upload"
          style={{
            width: "200px",
            height: "200px",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />
        <input
          type="file"
          id={inputId}
          accept=".jpg,.jpeg,.png"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </label>
      <br />
      {displayLabel && (
        <label htmlFor={inputId} className="mt-2 d-block">
          {image ? "Modifier cette image" : "Choisissez une image"}
        </label>
      )}
    </div>
  );
};

export default ImageInput;
