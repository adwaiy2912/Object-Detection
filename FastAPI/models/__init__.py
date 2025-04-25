from .yoloV8 import YOLOModelV8
from .yoloV5 import YOLOModelV5
from .opencv_face import OpenCVFaceModel
from .mediapipe_face import MediaPipeFaceModel

MODEL_REGISTRY = {
    "yoloV8": YOLOModelV8(),
    "yoloV5": YOLOModelV5(),
    "opencv_face": OpenCVFaceModel(),
    "mediapipe": MediaPipeFaceModel(),
}
