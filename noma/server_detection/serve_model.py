from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import tensorflow as tf
import numpy as np
import io
from PIL import Image
import logging
import sys
import os

# ✅ Ensure Flask can find `auth.py`
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "server")))

from auth import auth  # ✅ Import the auth Blueprint

# ✅ Initialize Flask app
app = Flask(__name__)

# ✅ Set up CORS
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization", "Accept"]}})

# ✅ Set up JWT Authentication
app.config["JWT_SECRET_KEY"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaGhxdmFrYWFqZXZ3d3N2bnJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDI2MzU4OSwiZXhwIjoyMDU1ODM5NTg5fQ.enipHVUtabwB3b9_LPTEP_gzXzFmnukMXbkh5a034k8"  # Replace with a secure secret

jwt = JWTManager(app)

# ✅ Register auth Blueprint
app.register_blueprint(auth, url_prefix="/auth")

# ✅ Load model
try:
    model = tf.keras.models.load_model('/Users/Varun/noma/noma/detection/skin_cancer_detection.h5', compile=False)
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    logging.info("✅ Model loaded successfully!")
except Exception as e:
    logging.error(f"❌ Error loading model: {e}")
    raise

def preprocess_image(image_bytes):
    try:
        img = Image.open(io.BytesIO(image_bytes))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0  # Normalize
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        logging.error(f"❌ Error preprocessing image: {e}")
        raise

@app.route('/predict', methods=['POST'])
@jwt_required()  # ✅ Require authentication token
def predict():
    current_user = get_jwt_identity()  # ✅ Get authenticated user
    logging.info(f"📊 Prediction request from user: {current_user}")

    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    try:
        image_bytes = request.files['image'].read()
        processed_image = preprocess_image(image_bytes)
        prediction = model.predict(processed_image)
        predicted_class = int(np.argmax(prediction[0]))
        confidence = float(prediction[0][predicted_class])
        class_labels = ['Benign', 'Malignant']

        return jsonify({
            'prediction': class_labels[predicted_class],
            'confidence': confidence,
            'isCancerous': predicted_class == 1
        })
        
    except Exception as e:
        logging.error(f"❌ Error processing request: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081, debug=True)
