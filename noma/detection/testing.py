import tensorflow as tf
loaded_model = tf.keras.models.load_model('skin_cancer_detection.h5', compile=False)
loaded_model.compile(optimizer='adam',
              loss='categorical_crossentropy',  
              metrics=['accuracy'])

from PIL import Image
image_path = './melanoma_cancer_dataset/train/malignant/melanoma_5002.jpg'
image = Image.open(image_path)
# Preprocess the image
img = image.resize((224, 224))
img_array = tf.keras.preprocessing.image.img_to_array(img)
img_array = tf.expand_dims(img_array, 0)
# Make predictions
predictions = loaded_model.predict(img_array)
class_labels = ['Benign', 'Malignant']
score = tf.nn.softmax(predictions[0])
print(f"{class_labels[tf.argmax(score)]}")