import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UploadForm = () => {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("No file chosen");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload image.");
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 400, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom align="center">
        Upload Image
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Enter your name"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input type="file" id="file-input" hidden onChange={handleFileChange} required />
        <label htmlFor="file-input">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              '&:hover': {
                backgroundColor: "#1565c0"
              }
            }}
          >
            {fileName === "No file chosen" ? "Choose File" : fileName}
          </Button>
        </label>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Upload
        </Button>
      </Box>
      {message && (
        <Typography variant="body1" color="secondary" align="center" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Paper>
  );
};

export default UploadForm;