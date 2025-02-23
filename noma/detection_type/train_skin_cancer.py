import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import time  # Import time module
from PIL import Image
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten
from tensorflow.keras.applications import DenseNet201
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import ReduceLROnPlateau, Callback

# Define dataset paths
train_dir = "Skin cancer ISIC The International Skin Imaging Collaboration/Train"
test_dir = "Skin cancer ISIC The International Skin Imaging Collaboration/Test"

def create_dataframe(data_dir):
    data = [
        {"image_path": os.path.join(data_dir, dir_name, fname), "label": dir_name}
        for dir_name in os.listdir(data_dir)
        if os.path.isdir(os.path.join(data_dir, dir_name))  # ✅ Ignore .DS_Store
        for fname in os.listdir(os.path.join(data_dir, dir_name))
        if not fname.startswith(".")  # ✅ Ignore hidden files
    ]
    return pd.DataFrame(data)


# Load dataset into a dataframe
df_train = create_dataframe(train_dir)
df_test = create_dataframe(test_dir)

# Assign numerical labels to classes
label_map = {name: i for i, name in enumerate(df_train["label"].unique())}
df_train["label"] = df_train["label"].map(label_map)
df_test["label"] = df_test["label"].map(label_map)

# Function to resize and preprocess images
def preprocess_image(image_path, size=(75, 100)):
    img = Image.open(image_path).resize(size)
    return np.asarray(img) / 255.0  # Normalize pixel values

# Apply preprocessing to all images
df_train["image"] = df_train["image_path"].apply(preprocess_image)
df_test["image"] = df_test["image_path"].apply(preprocess_image)

# Convert to numpy arrays
X_train = np.array(df_train["image"].tolist()).reshape(-1, 75, 100, 3)
X_test = np.array(df_test["image"].tolist()).reshape(-1, 75, 100, 3)

# Convert labels to categorical one-hot encoding
y_train = to_categorical(df_train["label"], num_classes=9)
y_test = to_categorical(df_test["label"], num_classes=9)

# Split training data into train and validation sets
X_train, X_val, y_train, y_val = train_test_split(X_train, y_train, test_size=0.2, random_state=42)

# Data augmentation
datagen = ImageDataGenerator(
    rotation_range=25,
    width_shift_range=0.5,
    height_shift_range=0.25,
    shear_range=0.25,
    zoom_range=0.25,
    horizontal_flip=True,
    fill_mode="nearest"
)
datagen.fit(X_train)

# Define the DenseNet201 model
model = Sequential([
    DenseNet201(include_top=False, weights="imagenet", input_shape=(75, 100, 3)),
    Flatten(),
    Dropout(0.5),
    Dense(512, activation="relu"),
    Dense(9, activation="softmax")
])

# Compile model
model.compile(optimizer=Adam(learning_rate=0.001), loss="categorical_crossentropy", metrics=["accuracy"])

# Learning rate scheduler
reduce_lr = ReduceLROnPlateau(monitor="val_accuracy", patience=3, factor=0.5, min_lr=0.00001, verbose=1)

# **Custom Callback to Track Time**
class TimeHistory(Callback):
    def on_train_begin(self, logs=None):
        self.start_time = time.time()
        self.epoch_times = []

    def on_epoch_begin(self, epoch, logs=None):
        self.epoch_start_time = time.time()

    def on_epoch_end(self, epoch, logs=None):
        epoch_time = time.time() - self.epoch_start_time
        self.epoch_times.append(epoch_time)
        total_elapsed_time = time.time() - self.start_time
        print(f"Epoch {epoch+1} finished in {epoch_time:.2f} seconds. Total elapsed time: {total_elapsed_time:.2f} seconds.")

    def on_train_end(self, logs=None):
        total_time = time.time() - self.start_time
        print(f"Training completed in {total_time:.2f} seconds ({total_time/60:.2f} minutes).")

# Instantiate the time tracking callback
time_callback = TimeHistory()

# Train the model with time tracking
history = model.fit(
    datagen.flow(X_train, y_train, batch_size=32),
    validation_data=(X_val, y_val),
    epochs=50,
    callbacks=[reduce_lr, time_callback]  # Include time tracker callback
)

# Save trained model
model.save("skin_cancer_model.h5")
