import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import WebcamCapture from "../Webcam/Webcam";
import Upload from "../Upload/Upload";
import "./homeStyles.css";

function Home({ selectedModel }) {
   const [file, setFile] = React.useState(null);

   return (
      <Container className="d-flex justify-content-center align-items-center home-container m-0">
         <Row className="d-flex justify-content-center align-items-center container">
            <Col md={6}>
               <div className="d-flex justify-content-center align-items-center webcam-container">
                  <WebcamCapture selectedModel={selectedModel} />
               </div>
            </Col>
            <Col md={6}>
               <div className="d-flex justify-content-center align-items-center upload-container">
                  <Upload
                     onFilesSelected={setFile}
                     width="300px"
                     height="300px"
                     selectedModel={selectedModel}
                  />
               </div>
            </Col>
         </Row>
      </Container>
   );
}

export default Home;
