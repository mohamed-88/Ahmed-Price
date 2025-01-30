import React from "react";
import "./App.css";
import UploadForm from "./components/UploadForm";
import ImageGallery from "./components/ImageGallery";

const App = () => {
  return (
    <div className="App">
      <h1>React Image Upload</h1>
      
      <UploadForm />
      <ImageGallery />
      
    </div>
  );
};

export default App;
