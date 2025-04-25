from ultralytics import YOLO
from PIL import Image
from .base import BaseModel

class YOLOModelV8(BaseModel):
    def __init__(self):
        self.model = YOLO("yolov8n.pt")

    def predict(self, image: Image.Image):
        results = self.model(image)
        detections = []
        for result in results:
            boxes = result.boxes.xyxy
            labels = result.boxes.cls
            confs = result.boxes.conf
            for box, label, conf in zip(boxes, labels, confs):
                x1, y1, x2, y2 = map(int, box[:4])
                name = self.model.names[int(label)]
                detections.append((x1, y1, x2, y2, name, conf.item()))
        return detections
