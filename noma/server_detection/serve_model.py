from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.preprocessing import image
import numpy as np
import io
from PIL import Image
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# Load the model using tf.keras
try:
    model = tf.keras.models.load_model('../detection/skin_cancer_detection.h5', 
                                     compile=False,
                                     custom_objects=None)
    model.compile(optimizer='adam',
                 loss='categorical_crossentropy',
                 metrics=['accuracy'])
except Exception as e:
    print(f"Error loading model: {e}")
    raise

def preprocess_image(image_file, size=(224, 224)):
    img = Image.open(io.BytesIO(image_file.read()))
    img = img.resize(size)
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    try:
        file = request.files['image']
        processed_image = preprocess_image(file)
        prediction = model.predict(processed_image)
        predicted_class = np.argmax(prediction[0])
        
        # Map prediction to label (similar to testing.py)
        class_labels = ['Benign', 'Malignant']
        confidence = float(prediction[0][predicted_class])
        
        return jsonify({
            'prediction': class_labels[predicted_class],
            'confidence': confidence,
            'isCancerous': predicted_class == 1
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True) 
