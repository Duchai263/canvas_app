import os
from flask import Flask, render_template, request, redirect, url_for, send_from_directory,jsonify
import base64
from PIL import Image
from io import BytesIO

img_uploaded = {'name':''}
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['RESULT_FOLDER'] = 'static/results'

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload_img', methods=['POST'])
async def upload_image():
    data = request.get_json()
    if 'upload_img' not in data:
        return render_template('index.html')
    image_data = data['upload_img']
    # print (image_data)
    image_data = image_data.replace('data:image/png;base64,', '')

    # Decode base64 data
    image_bytes = base64.b64decode(image_data)

    # Convert the image data to a PIL Image object
    image = Image.open(BytesIO(image_bytes))
    # Save the image to a file

    path_img_name = os.path.join(app.config['UPLOAD_FOLDER'],data['name'])
    print (path_img_name)
    image.save(path_img_name , 'PNG')


    return jsonify({'message': 'oke'})
                    # 'img_name':path_img_name})

    return render_template('index.html', filename=file.filename)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/download_canvas', methods=['POST'])
async def upload_canvas():
    data = request.get_json()
    if 'image_data' not in data:
        return redirect(request.url)
    image_data = data['image_data']
    # if image_data.filename == '':
    #     return redirect(request.url)
    # print (image_data)
    # if image_data:
    #     file_path = os.path.join(app.config['UPLOAD_FOLDER'], "img_mask.png")
    #     image_data.save(file_path)
    # Xử lý image_data ở đây, ví dụ lưu hình ảnh xuống ổ đĩa
    # Ví dụ: 
    # Remove the prefix 'data:image/png;base64,' from the base64 data
    image_data = image_data.replace('data:image/png;base64,', '')

    # Decode base64 data
    image_bytes = base64.b64decode(image_data)

    # Convert the image data to a PIL Image object
    image = Image.open(BytesIO(image_bytes))
    # Save the image to a file

    masked_name = data['name'][:-4] + "_mask.png" 
    path_masked_name = os.path.join(app.config['RESULT_FOLDER'],masked_name)
    print (path_masked_name)
    image.save(path_masked_name , 'PNG')


    return jsonify({'message': 'oke',
                    'img_name':path_masked_name})


# @app.route('/hook', methods=['POST'])
# def save_canvas():
#     image_data = re.sub('^data:image/.+;base64,', '', request.form['imageBase64'])
#     im = Image.open(BytesIO(base64.b64decode(image_data)))
#     # im.save('canvas.png')
#     return json.dumps({'result': 'success'}), 200, {'ContentType': 'application/json'}

if __name__ == '__main__':
    app.run(debug=False, host="0.0.0.0", port=8000)
