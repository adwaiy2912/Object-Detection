import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
   return (
      <footer className="bg-body text-dark py-3">
         <Container>
            <Row className="d-flex align-items-start justify-content-center">
               <Col md={6} className="text-start">
                  <div>
                     <h5>Model Object Detection App</h5>
                     <p>
                        A unified interface to test various object detection
                        models like YOLOv5, YOLOv8, Haar Cascade, and MediaPipe
                        on webcam or uploaded images.
                     </p>
                  </div>
               </Col>
               <Col md={6} className="d-grid justify-content-end text-end">
                  <p className="px-3">Follow Me</p>
                  <div className="d-flex justify-content-end">
                     <a
                        href="https://www.facebook.com"
                        className="text-dark me-3"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <FaFacebook size={24} />
                     </a>
                     <a
                        href="https://www.twitter.com"
                        className="text-dark me-3"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <FaTwitter size={24} />
                     </a>
                     <a
                        href="https://www.instagram.com"
                        className="text-dark me-3"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <FaInstagram size={24} />
                     </a>
                     <a
                        href="https://www.linkedin.com"
                        className="text-dark me-3"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <FaLinkedin size={24} />
                     </a>
                  </div>
               </Col>
            </Row>
         </Container>
      </footer>
   );
}

export default Footer;
