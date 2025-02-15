# Object Removal Inpainting Tool

# Installation  
Before instal, create an virtual environment  
`python -m venv venv`  
and activate your environment with  
`venv\scripts\activate`  

Now we can begin the installation:  
1. First install the Flask App    
`pip install -r requirements.txt`  
2. Install LaMa - A novel Inpainting Architecture with FastAPI  
`pip install -r .\api\inpainting-requirements.txt`  


[SAM]: https://github.com/facebookresearch/segment-anything
3. (OPTIONAL) If you wanna use the segmentation, install Segment Anything Model (SAM) and download their model from [Here][SAM]  
Download the model `vit_b` which is the lightest (or whatever model you like, just remember change the model in code) and place it in folder `model_ckpt` current directory.
Install SAM with FastAPI  
`pip install -r .\api\segmentation-requirements.txt`  

# Usage  
Run LaMa api with  
`fastapi run .\api\inpaiting.py --port 5958`  
and run the app with  
`python app.py`  
Now you can go to `http://localhost:8000/` and enjoy the tool  
(OPTIONAL) Using the segmentation feature with  
`fastapi run .\api\segmentation.py --port 5959` 

# ToDo  
Docker  
Deploy
