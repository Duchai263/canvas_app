from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image
from io import BytesIO
import numpy as np
import base64
import json

from segment_anything import SamPredictor, sam_model_registry

sam = sam_model_registry["vit_b"](checkpoint="model_ckpt\sam_vit_b_01ec64.pth")
# sam = sam_model_registry["vit_h"](checkpoint="model_ckpt\sam_vit_h_4b8939.pth")
predictor = SamPredictor(sam)

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
    if data['image_data'] is None:
        return None 
    image_data = data['image_data']

    image_data = image_data.replace('data:image/png;base64,', '')
    image_bytes = base64.b64decode(image_data)
    image = Image.open(BytesIO(image_bytes))
    image = image.convert('RGB')
    return image

def get_mask(x, y):
    input_point = np.array([[x, y]])
    input_label = np.array([1])

    masks, scores, logits = predictor.predict(
        point_coords=input_point,
        point_labels=input_label,
        multimask_output=True,
    )
    #get largest mask
    sum_mask = np.add(masks[0],masks[1])
    sum_mask = np.add(sum_mask,masks[2])

    return sum_mask


@app.post('/setImage/')
async def setImage(request: Request):
    img = await read_image_from_request(request)
    img = np.asarray(img)
    print(img.shape)
    predictor.set_image(img)
    # try:
    #     predictor.set_image(img)
    # except:
    #     return {"eror": "cant set image"}
    return {"size": img.shape}
    return {"message": "message"}

@app.get("/click/")
async def click(x, y):
    mask = get_mask(x,y)
    return {"mask": json.dumps(mask.tolist())}
    return {"cor" : [x,y]}