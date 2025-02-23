from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.preprocessing import image
import numpy as np
import io
from PIL import Image
import tensorflow as tf
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"]
    }
})

# Load the model
try:
    model = tf.keras.models.load_model('../detection/skin_cancer_detection.h5', 
                                     compile=False)
    model.compile(optimizer='adam',
                 loss='categorical_crossentropy',
                 metrics=['accuracy'])
    logger.info("Model loaded successfully!")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    raise

def preprocess_image(image_bytes):
    try:
        logger.debug(f"Starting image preprocessing, received {len(image_bytes)} bytes")
        
        # Convert bytes to PIL Image
        img = Image.open(io.BytesIO(image_bytes))
        logger.debug(f"Image opened successfully. Size: {img.size}, Mode: {img.mode}")
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
            logger.debug("Converted image to RGB mode")
            
        # Resize to match model's expected input
        img = img.resize((224, 224))
        logger.debug("Resized image to 224x224")
        
        # Convert to array and preprocess
        img_array = image.img_to_array(img)
        img_array = img_array / 255.0  # Normalize
        img_array = np.expand_dims(img_array, axis=0)
        logger.debug(f"Preprocessed image array shape: {img_array.shape}")
        
        return img_array
    except Exception as e:
        logger.error(f"Error preprocessing image: {e}")
        raise

@app.route('/predict', methods=['POST'])
def predict():
    logger.info("Received prediction request")
    logger.debug(f"Request headers: {dict(request.headers)}")
    logger.debug(f"Request files: {request.files}")
    
    if 'image' not in request.files:
        logger.warning("No image found in request")
        return jsonify({'error': 'No image uploaded'}), 400
    
    try:
        # Read the image file
        image_file = request.files['image']
        logger.info(f"Received image: {image_file.filename}")
        image_bytes = image_file.read()
        logger.debug(f"Read {len(image_bytes)} bytes from image file")
        
        # Preprocess the image
        processed_image = preprocess_image(image_bytes)
        logger.info("Image preprocessing completed")
        
        # Make prediction
        logger.debug("Starting prediction")
        prediction = model.predict(processed_image)
        predicted_class = int(np.argmax(prediction[0]))  # Convert to Python int
        confidence = float(prediction[0][predicted_class])  # Convert to Python float
        logger.info(f"Prediction completed. Class: {predicted_class}, Confidence: {confidence}")
        
        # Map prediction to label
        class_labels = ['Benign', 'Malignant']
        result = {
            'prediction': class_labels[predicted_class],
            'confidence': confidence,
            'isCancerous': bool(predicted_class == 1)  # Convert to Python bool
        }
        logger.info(f"Sending response: {result}")
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error processing request: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)