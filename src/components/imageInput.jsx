import React from "react";
import upload from "../assets/upload.png";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

const ImageInput = ({
  previewImage,
  setPreviewImage,
  displayLabel,
  setDisplayLabel,
  image,
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
    <div className="position-relative text-center">
      {previewImage && (
        <IconButton type="button" onClick={handleCancelImage} sx={{ ml: 22 }}>
          <CloseIcon />
        </IconButton>
      )}
      <label htmlFor="imageInput">
        <img
          src={
            previewImage
              ? URL.createObjectURL(previewImage)
              : image
              ? `http://localhost:3300/api/${image}`
              : upload
          }
          alt="Upload"
          style={{ maxWidth: "200px", maxHeight: "200px", cursor: "pointer" }}
        />
        <input
          type="file"
          id="imageInput"
          accept=".jpg,.jpeg,.png"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </label>
      <br />
      {displayLabel && (
        <label htmlFor="imageInput" className="mt-2 d-block">
          {image ? "Modifier une image" : "Cliquez pour choisir une image"}
        </label>
      )}
    </div>
  );
};

export default ImageInput;
