import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button, Card } from "react-bootstrap";
import axios from "axios";

const videoConstraints = {
   width: 500,
   height: 400,
   facingMode: "user",
};

export const WebcamCapture = ({ selectedModel }) => {
   const [image, setImage] = useState("");
   const [annotatedImage, setAnnotatedImage] = useState(null);
   const [isWebcamOn, setIsWebcamOn] = useState(false);
   const webcamRef = useRef(null);

   const capture = useCallback(async () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      await sendToYOLO(imageSrc);
      setIsWebcamOn(false);
   }, [webcamRef]);

   const sendToYOLO = async (imageSrc) => {
      const blob = await fetch(imageSrc).then((r) => r.blob());
      const formData = new FormData();
      formData.append("file", blob, "captured_image.jpg");
      formData.append("model", selectedModel);

      try {
         const response = await axios.post(
            "http://127.0.0.1:8000/annot/",
            formData,
            {
               responseType: "blob",
               headers: {
                  "Content-Type": "multipart/form-data",
               },
            }
         );

         const url = window.URL.createObjectURL(new Blob([response.data]));
         setAnnotatedImage(url);
      } catch (error) {
         console.error("Error during YOLO inference:", error);
      }
   };

   const toggleWebcam = () => {
      setIsWebcamOn(!isWebcamOn);
      if (!isWebcamOn) {
         setImage("");
         setAnnotatedImage(null);
      }
   };

   const downloadImage = () => {
      const link = document.createElement("a");
      link.href = annotatedImage;
      link.download = "annotated_image.jpg";
      link.click();
   };

   return (
      <div className="d-grid justify-content-center align-items-center webcam-container">
         <div
            className="webcam-img"
            style={{ width: "500px", height: "400px" }}
         >
            {isWebcamOn ? (
               <Webcam
                  audio={false}
                  height={videoConstraints.height}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={videoConstraints.width}
                  videoConstraints={videoConstraints}
               />
            ) : annotatedImage ? (
               <img
                  src={annotatedImage}
                  alt="Annotated"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
               />
            ) : (
               <Card
                  style={{ width: "500px", height: "400px" }}
                  className="d-flex align-items-center justify-content-center"
               >
                  <Card.Body>
                     <Card.Text className="text-center">
                        Webcam is off. Turn it on to start capturing!
                     </Card.Text>
                  </Card.Body>
               </Card>
            )}
         </div>
         <div className="d-flex justify-content-center align-items-center mt-3">
            {isWebcamOn && (
               <Button onClick={capture} className="me-2" variant="primary">
                  Inference
               </Button>
            )}
            {annotatedImage && (
               <Button
                  onClick={downloadImage}
                  className="me-2"
                  variant="primary"
               >
                  Download
               </Button>
            )}
            <Button
               onClick={toggleWebcam}
               variant={isWebcamOn ? "danger" : "success"}
            >
               {isWebcamOn ? "Turn Off Webcam" : "Turn On Webcam"}
            </Button>
         </div>
      </div>
   );
};

export default WebcamCapture;
