import mediapipe as mp
import numpy as np
from PIL import Image
from .base import BaseModel

class MediaPipeFaceModel(BaseModel):
    def __init__(self):
        self.detector = mp.solutions.face_detection.FaceDetection(model_selection=0, min_detection_confidence=0.5)

    def predict(self, image: Image.Image):
        results = self.detector.process(np.array(image))
        detections = []
        if results.detections:
            width, height = image.size
            for det in results.detections:
                box = det.location_data.relative_bounding_box
                x1 = int(box.xmin * width)
                y1 = int(box.ymin * height)
                x2 = int((box.xmin + box.width) * width)
                y2 = int((box.ymin + box.height) * height)
                detections.append((x1, y1, x2, y2, "face", det.score[0]))
        return detections
