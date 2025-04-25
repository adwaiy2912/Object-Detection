from PIL import Image
from typing import List, Tuple

class BaseModel:
    def predict(self, image: Image.Image) -> List[Tuple[int, int, int, int, str, float]]:
        """Should return a list of (x1, y1, x2, y2, label, confidence)."""
        raise NotImplementedError
