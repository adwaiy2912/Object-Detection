import cv2
import numpy as np
from PIL import Image
from .base import BaseModel

class OpenCVFaceModel(BaseModel):
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

    def predict(self, image: Image.Image):
        gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
        detections = [(x, y, x+w, y+h, "face", 1.0) for (x, y, w, h) in faces]
        return detections
