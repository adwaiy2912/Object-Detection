import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Button } from "react-bootstrap";
import axios from "axios";

const Upload = ({ onFilesSelected, width, height, selectedModel }) => {
   const [image, setImage] = useState(null);
   const [imagePreview, setImagePreview] = useState(null);

   const handleFileChange = (event) => {
      const selectedFiles = event.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
         const selectedImage = selectedFiles[0];
         setImage(selectedImage);
         generateImagePreview(selectedImage);
      }
   };

   const handleDrop = (event) => {
      event.preventDefault();
      const droppedFiles = event.dataTransfer.files;
      if (droppedFiles.length > 0) {
         const droppedImage = droppedFiles[0];
         setImage(droppedImage);
         generateImagePreview(droppedImage);
      }
   };

   const handleRemoveImage = () => {
      setImage(null);
      setImagePreview(null);
   };

   const generateImagePreview = (imageFile) => {
      const reader = new FileReader();
      reader.onload = (e) => {
         setImagePreview(e.target.result);
      };
      reader.readAsDataURL(imageFile);
   };

   const handleInference = async () => {
      if (!image) return;

      const formData = new FormData();
      formData.append("file", image);
      formData.append("model", selectedModel);

      try {
         const response = await axios.post(
            "http://127.0.0.1:8000/annot/",
            formData,
            {
               responseType: "blob", // Important to handle binary data
               headers: {
                  "Content-Type": "multipart/form-data",
               },
            }
         );

         // Create a URL for the image and trigger a download
         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", "annotated_image.png"); // Name of the file to download
         document.body.appendChild(link);
         link.click();
         link.remove();
      } catch (error) {
         console.error("Error during inference:", error);
      }
   };

   useEffect(() => {
      onFilesSelected(image ? [image] : []);
   }, [image, onFilesSelected]);

   return (
      <section className="drag-drop" style={{ width, height }}>
         <div
            className={`document-uploader text-center ${
               image ? "upload-box active" : "upload-box"
            } border border-dark border-dashed`}
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
            style={{
               width,
               borderStyle: "dotted",
               height: "100%",
            }}
         >
            {!image && (
               <>
                  <div className="d-flex flex-column align-items-center justify-content-center h-100">
                     <AiOutlineCloudUpload size={40} />
                     <div>
                        <p>Drag and drop your image here</p>
                        <p>Supported files: .PNG, .JPG, .JPEG</p>
                     </div>
                  </div>
                  <input
                     type="file"
                     hidden
                     id="browse"
                     onChange={handleFileChange}
                     accept=".png,.jpg,.jpeg"
                  />
                  <h5>OR</h5>
                  <Button
                     htmlFor="browse"
                     variant="primary"
                     onClick={() => document.getElementById("browse").click()}
                  >
                     Browse image
                  </Button>
               </>
            )}

            {image && (
               <div className="file-preview">
                  {imagePreview ? (
                     <img
                        src={imagePreview}
                        alt="Preview"
                        width="100%"
                        onClick={handleRemoveImage}
                     />
                  ) : (
                     <p>Loading preview...</p>
                  )}

                  <Button
                     className="m-3"
                     variant="primary"
                     onClick={handleInference}
                  >
                     Inference
                  </Button>
               </div>
            )}
         </div>
      </section>
   );
};

export default Upload;
