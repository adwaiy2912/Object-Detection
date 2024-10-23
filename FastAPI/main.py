from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from io import BytesIO
import os
import imghdr
from ultralytics import YOLO
from PIL import Image
import cv2
import numpy as np

# Load the YOLO model
dir = os.path.dirname(__file__)
model_path = os.path.join(dir, "./others/yolov8n.pt")
model = YOLO(model_path)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/annot/")
async def create_upload_file(file: UploadFile = File(...)):
    # Check MIME type to ensure the file is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image")

    # Read the file content
    data = await file.read()

    # Additional check to verify it's a valid image file
    image_format = imghdr.what(None, h=data)
    if image_format not in ['jpeg', 'jpg', 'png']:
        raise HTTPException(status_code=400, detail="Unsupported image format")

    # Use BytesIO to process the image in memory without saving it to disk
    image_file = BytesIO(data)
    image = Image.open(image_file)

    # Run inference with YOLO
    results = model(image)

    # Process results and draw bounding boxes on the image
    for result in results:
        boxes = result.boxes.xyxy  # get bounding box coordinates
        for box in boxes:
            # Draw the bounding boxes
            x1, y1, x2, y2 = map(int, box[:4])  # get coordinates
            image = draw_box(image, (x1, y1, x2, y2))

    # Save the modified image to a BytesIO object
    output_image = BytesIO()
    image.save(output_image, format="PNG")
    output_image.seek(0)

    # Return the modified image
    return StreamingResponse(output_image, media_type="image/png")

def draw_box(image: Image, box: tuple) -> Image:
    """Draw bounding box on the image."""

    # Convert the image to a format compatible with OpenCV
    cv_image = np.array(image)
    cv_image = cv2.cvtColor(cv_image, cv2.COLOR_RGB2BGR)

    # Draw the rectangle on the image
    x1, y1, x2, y2 = box
    cv2.rectangle(cv_image, (x1, y1), (x2, y2), (255, 0, 0), 2)

    # Convert back to PIL image
    return Image.fromarray(cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB))
