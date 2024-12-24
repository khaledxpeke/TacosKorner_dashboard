import React from "react";
import upload from "../assets/upload.png";

const ImageVideoInput = ({ setPreviewImage }) => {
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(file);
    }
  };

  return (
    <div className="position-relative text-center">
      <label htmlFor="imageInput">
        <img
          src={upload}
          alt="Upload"
          style={{ maxWidth: "200px", maxHeight: "200px", cursor: "pointer" }}
        />
        <input
          type="file"
          id="imageInput"
          accept=".jpg,.jpeg,.png,.mp4"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <br />
        <label htmlFor="imageInput" className="mt-2 d-block">
          Choisissez des images/videos
        </label>
      </label>
    </div>
  );
};

export default ImageVideoInput;
