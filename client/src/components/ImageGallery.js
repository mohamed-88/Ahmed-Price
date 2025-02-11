import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Card, CardMedia, CardContent, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleMenuOpen = (event, image) => {
    setAnchorEl(event.currentTarget);
    setSelectedImage(image);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedImage(null);
  };

  const handleDelete = async () => {
    if (!selectedImage) return;
    try {
      await axios.delete(`http://localhost:3000/images/${selectedImage.id}`);
      setImages(images.filter((img) => img.id !== selectedImage.id));
    } catch (err) {
      console.error("Error deleting image:", err);
    }
    handleMenuClose();
  };

  const handleEditUsername = async () => {
    if (!selectedImage) return;
    const newUsername = prompt("Enter new name:", selectedImage.username || "");
    if (newUsername !== null) {
      try {
        await axios.put(`http://localhost:3000/images/update-username/${selectedImage.id}`, { username: newUsername });
        setImages(images.map((img) => (img.id === selectedImage.id ? { ...img, username: newUsername } : img)));
      } catch (err) {
        console.error("Error updating username:", err);
      }
    }
    handleMenuClose();
  };

  return (
    <div style={{ padding: "55px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Uploaded Images
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {images.map((img) => (
          <Grid item key={img.id} xs={12} sm={6} md={4} lg={3}>
            <Card
            sx={{ 
              maxWidth: 345,
              position: "relative",
              boxShadow: 3,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
              }}>
              <IconButton
                sx={{ position: "absolute", top: 5, right: 5 }}
                onClick={(event) => handleMenuOpen(event, img)}
              >
                <MoreVertIcon />
              </IconButton>

              <CardMedia
                component="img"
                sx={{
                  height: 200,
                  objectFit: "contain",
                  padding: "10px",
                }}
                image={`http://localhost:3000${img.image_path}`}
                alt="Uploaded"
              />

              <CardContent>
                <Typography variant="subtitle1">{img.caption}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{fontWeight: 'bold'}}>
                  {img.username || "Enter your name"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditUsername}>
          <EditIcon sx={{ marginRight: 1 }} /> Edit Name
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "red" }}>
          <DeleteIcon sx={{ marginRight: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ImageGallery;