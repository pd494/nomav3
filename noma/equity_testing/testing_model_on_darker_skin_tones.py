import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

model = tf.keras.models.load_model("../detection/skin_cancer_detection.h5")

def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))  
    img_array = image.img_to_array(img)  
    img_array = np.expand_dims(img_array, axis=0)  
    img_array = img_array / 255.0  
    return img_array

img_path = "Melanoma on dark skin/images (1).jpg"
img_array = preprocess_image(img_path)

predictions = model.predict(img_array)

print("Raw Predictions:", predictions)

class_labels = ["Benign", "Malignant"]  
predicted_class = class_labels[np.argmax(predictions)]
print("Predicted Class:", predicted_class)
