from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

# Load the trained model
model = load_model("skin_cancer_model.h5")

# Function to preprocess a single image
def preprocess_single_image(image_path, size=(75, 100)):
    img = image.load_img(image_path, target_size=size)
    img_array = image.img_to_array(img) / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

# Define test image path
test_image_path = "Skin cancer ISIC The International Skin Imaging Collaboration/Test/melanoma/ISIC_0000015.jpg"

# Preprocess and predict
img_array = preprocess_single_image(test_image_path)
prediction = model.predict(img_array)
predicted_class = np.argmax(prediction, axis=1)[0]

# Map label index back to category
label_map_inv = {v: k for k, v in label_map.items()}
predicted_label = label_map_inv[predicted_class]

print(f"Predicted Class: {predicted_label}")
