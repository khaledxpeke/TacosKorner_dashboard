import React from "react";
import upload from "../assets/upload.png";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

const ImageInput = ({
  previewImage,
  setPreviewImage,
  displayLabel,
  setDisplayLabel,
}) => {
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setDisplayLabel(false);
      };
      reader.readAsDataURL(file);
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
        <IconButton type="button" onClick={handleCancelImage} sx={{ ml: 30 }}>
          <CloseIcon />
        </IconButton>
      )}
      <label htmlFor="imageInput">
        <img
          src={previewImage || upload}
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
          Click to choose an image
        </label>
      )}
    </div>
  );
};

export default ImageInput;
