import React, { useState, useEffect } from "react";
import axios from "axios";

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:3000/images");
        setImages(response.data);
      } catch (err) {
        console.error("Error fetching images:", err);
      }
    };

    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/images/${id}`);
      setImages(images.filter((img) => img.id !== id)); // سڕینەوەی وێنە لە لیستەکە
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  const handleEdit = async (id, newCaption) => {
    try {
      await axios.put(`http://localhost:3000/images/${id}`, { caption: newCaption });
      setImages(images.map((img) => (img.id === id ? { ...img, caption: newCaption } : img)));
    } catch (err) {
      console.error("Error updating caption:", err);
    }
  };

  return (
    <div className="image-gallery">
      <h2>Uploaded Images</h2>
      <div className="gallery">
        {images.map((img) => (
          <div key={img.id} className="image-card">
            <p>{img.username}</p>
            <img src={`http://localhost:3000${img.image_path}`} alt="Uploaded" />
            <p>{img.caption}</p>
            <button onClick={() => handleDelete(img.id)}>Delete</button>
            <button onClick={() => handleEdit(img.id, prompt("Enter new caption:", img.caption))}>
              Edit Caption
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
