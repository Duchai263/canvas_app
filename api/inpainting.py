from simple_lama_inpainting import SimpleLama
from PIL import Image

from fastapi import FastAPI,Request, Response
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image
from io import BytesIO
import numpy as np
import base64
import json
import cv2

simple_lama = SimpleLama()

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def read_image_from_request(request: Request):
    data = await request.json()
    if data['image'] is None or data['mask'] is None:
        return None 
    image_data = data['image']
    image_data = image_data.replace('data:image/png;base64,', '')
    image_bytes = base64.b64decode(image_data)
    image = Image.open(BytesIO(image_bytes))
    image = image.convert('RGB')

    mask_data = data['mask']
    mask_data = mask_data.replace('data:image/png;base64,', '')
    mask_bytes = base64.b64decode(mask_data)
    mask = Image.open(BytesIO(mask_bytes))
    mask = mask.convert('L')
    mask = mask.point( lambda p: 255 if p > 0 else 0 )
    print(np.unique(mask))

    return [image, mask]

def image_to_bytes(image):
    imgByteArr = BytesIO()
    image.save(imgByteArr,format='png')
    imgByteArr = imgByteArr.getvalue()
    return imgByteArr

def refine_mask(mask):
    mask_np = np.asarray(mask)

    kernel = np.ones((3,3), np.uint8)
    expanded_mask = cv2.dilate(mask_np, kernel=kernel,iterations=3)

    expanded_mask = Image.fromarray(expanded_mask)
    expanded_mask = expanded_mask.convert('L')
    expanded_mask = expanded_mask.point( lambda p: 255 if p > 0 else 0 )

    return expanded_mask

@app.post('/inpainting/')
async def inpainting(request: Request):
    image, mask = await read_image_from_request(request)
    image.save("image.png")
    mask.save("mask.png")

    mask = refine_mask(mask)

    print(image.size, mask.size)


    result = simple_lama(image, mask)
    result.save("inpainted.png")
    result_bytes = image_to_bytes(result)
    return Response(content=result_bytes,media_type=f"image/{result.format}")
    return {"message": "removed"}

