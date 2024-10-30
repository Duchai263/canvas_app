import os
from flask import Flask, render_template, request, redirect, url_for, send_from_directory,jsonify
import base64

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return redirect(request.url)
    file = request.files['image']
    if file.filename == '':
        return redirect(request.url)

    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        return render_template('index.html', filename=file.filename)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/save_canvas', methods=['POST'])
def save_canvas():
    data = request.get_json()
    image_data = data['image'].split(",")[1]  # Get base64-encoded image data
    filename = 'canvas_image.png'
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    # Decode and save the image
    with open(file_path, "wb") as fh:
        fh.write(base64.b64decode(image_data))

    return jsonify({"filename": filename})

if __name__ == '__main__':
    app.run(debug=True, port=6969)
