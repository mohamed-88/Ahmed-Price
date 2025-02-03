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
      setImages(images.filter((img) => img.id !== id));
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };


  const handleEditUsername = async (id, currentUsername) => {
    const newUsername = prompt("Enter new name:", currentUsername);
    if (newUsername !== null) {
      try {
        await axios.put(`http://localhost:3000/images/update-username/${id}`, { username: newUsername });
        setImages(images.map((img) => (img.id === id ? { ...img, username: newUsername } : img)));
      } catch (err) {
        console.error("Error updating username:", err);
      }
    }
  };
  

  return (
    <div className="image-gallery">
    <h2>Uploaded Images</h2>
    <div className="gallery">
      {images.map((img) => (
        <div key={img.id} className="image-card">
          <button onClick={() => handleEditUsername(img.id, img.username || "")}>
            Edit Name
          </button>
          <button onClick={() => handleDelete(img.id)}>Delete</button>
          <img src={`http://localhost:3000${img.image_path}`} alt="Uploaded" />
          <p>{img.caption}</p>
          <p><strong>Name:</strong> {img.username || "Enter your name"}</p>
        </div>
      ))}
    </div>
  </div>
  );
};

export default ImageGallery;