from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import io
from PIL import Image
import logging

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Load ML Model
try:
    model = tf.keras.models.load_model('/Users/prasanthdendukuri/Downloads/project4/skin_cancer_detection.h5', compile=False)
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    logging.info("Model loaded successfully!")
except Exception as e:
    logging.error(f"Error loading model: {e}")
    raise

# Image Preprocessing for ML Model
def preprocess_image(image_bytes):
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img = img.convert('RGB').resize((224, 224))
        img_array = np.array(img) / 255.0
        return np.expand_dims(img_array, axis=0)
    except Exception as e:
        logging.error(f"Error preprocessing image: {e}")
        raise

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    try:
        # Read image from request
        image = request.files['image']
        image_bytes = image.read()
        processed_image = preprocess_image(image_bytes)

        prediction = model.predict(processed_image)
        predicted_class = int(np.argmax(prediction[0]))
        confidence = float(prediction[0][predicted_class])
        class_labels = ['Malignant', 'Benign']  # Swapped the order of labels

        return jsonify({
            'prediction': class_labels[predicted_class],
            'confidence': confidence,
            'isCancerous': predicted_class == 0  # Changed to check for 0 (Malignant)
        })

    except Exception as e:
        logging.error(f"Error processing request: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500

# Run Flask Server
if __name__ == "__main__":
    app.run(host='0.0.0000', port=8083, debug=True)