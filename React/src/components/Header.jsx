import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Header({ selectedModel, setSelectedModel }) {
   const handleSelectModel = (selectedModel) => {
      setSelectedModel(selectedModel); // Update the selected model in App
   };

   return (
      <Navbar collapseOnSelect expand="lg" className="bg-body">
         <Container>
            <img
               src="DL_logo.png"
               alt="Logo"
               className="d-inline-block align-top me-2 bg-dark rounded-circle"
               style={{ width: "50px", height: "50px" }}
            />
            <Navbar.Brand href="/" className="text-dark">
               Object Detection Project
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
               <Nav className="me-auto">
                  <Nav.Link href="#webcam" className="text-dark">
                     Web Cam
                  </Nav.Link>
                  <Nav.Link href="#image" className="text-dark">
                     Image
                  </Nav.Link>
                  <NavDropdown
                     title="Select Model"
                     id="collapsible-nav-dropdown"
                     className="text-dark"
                     onSelect={handleSelectModel} // Handle model selection
                  >
                     <NavDropdown.Item eventKey="yoloV8">
                        Yolo-V8
                     </NavDropdown.Item>
                     <NavDropdown.Item eventKey="yoloV5">
                        Yolo-V5
                     </NavDropdown.Item>
                     <NavDropdown.Item eventKey="opencv_face">
                        OpenCV Haar Face Detector
                     </NavDropdown.Item>
                     <NavDropdown.Item eventKey="mediapipe">
                        MediaPipe Face Detection
                     </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="#model" className="text-dark ms-2">
                     {selectedModel}
                  </Nav.Link>
               </Nav>
               <Nav>
                  <Nav.Link href="#about" className="text-dark">
                     About
                  </Nav.Link>
                  <Nav.Link href="#" className="text-primary">
                     By - Adwaiy Singh
                  </Nav.Link>
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
}

export default Header;
