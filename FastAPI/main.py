from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from io import BytesIO
import os
import imghdr
from ultralytics import YOLO
from PIL import Image, ImageDraw, ImageFont, ImageOps
import cv2
import numpy as np
import logging
from models import MODEL_REGISTRY

# Set up logging
logging.basicConfig(level=logging.INFO)

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/annot/")
async def create_upload_file(file: UploadFile = File(...), model: str = "yoloV8"):
    if model not in MODEL_REGISTRY:
        raise HTTPException(status_code=400, detail="Unsupported model name")

    model = MODEL_REGISTRY[model]

    # Image loading and verification (same as before)...
    data = await file.read()
    image_format = imghdr.what(None, h=data)
    if image_format not in ['jpeg', 'jpg', 'png']:
        raise HTTPException(status_code=400, detail="Unsupported image format")

    image = Image.open(BytesIO(data)).convert("RGB")
    image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)

    detections = model.predict(image)

    for x1, y1, x2, y2, label, conf in detections:
        image = draw_box(image, (x1, y1, x2, y2), label, conf)

    output_image = BytesIO()
    image.save(output_image, format="PNG")
    output_image.seek(0)
    return StreamingResponse(output_image, media_type="image/png")

def draw_box(image: Image, box: tuple, label: str, conf: float) -> Image:
    """Draw bounding box with label and confidence on the image."""
    cv_image = np.array(image)
    cv_image = cv2.cvtColor(cv_image, cv2.COLOR_RGB2BGR)
    x1, y1, x2, y2 = box
    cv2.rectangle(cv_image, (x1, y1), (x2, y2), (255, 0, 0), 2)
    text = f"{label} {conf:.2f}"
    # Calculate text size
    (text_width, text_height), baseline = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)
    # Draw filled rectangle for text background
    cv2.rectangle(cv_image, (x1, y1 - text_height - 10), (x1 + text_width, y1), (255, 0, 0), thickness=cv2.FILLED)
    # Put text on top of the rectangle
    cv2.putText(cv_image, text, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    return Image.fromarray(cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB))
