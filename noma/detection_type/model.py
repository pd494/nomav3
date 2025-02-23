import os
import numpy as np
import pandas as pd
import tensorflow as tf
from PIL import Image
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from tensorflow.keras.applications import DenseNet201
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten, Dropout
from tensorflow.keras.optimizers import SGD
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import ReduceLROnPlateau

# Define dataset paths
train_dir = "Skin cancer ISIC The International Skin Imaging Collaboration/Train"
test_dir = "Skin cancer ISIC The International Skin Imaging Collaboration/Test"


def create_dataframe(data_dir):
    data = [
        {"image_path": os.path.join(data_dir, dir_name, fname), "label": label}
        for label, dir_name in enumerate(os.listdir(data_dir))
        for fname in os.listdir(os.path.join(data_dir, dir_name))
    ]
    return pd.DataFrame(data)

# Create dataframe
df = pd.concat([create_dataframe(train_dir), create_dataframe(test_dir)], ignore_index=True)

# Create label map
label_map = {i: label for i, label in enumerate(os.listdir(train_dir))}
num_classes = len(label_map)

def resize_image(image_path):
    return np.asarray(Image.open(image_path).resize((100, 75)))

df['image'] = df['image_path'].apply(resize_image)

# Data augmentation
datagen = ImageDataGenerator(
    rotation_range=25,
    width_shift_range=0.5,
    height_shift_range=0.25,
    shear_range=0.25,
    zoom_range=0.25,
    horizontal_flip=True,
    fill_mode='nearest'
)

# Train-test split
X = df.drop(columns=['label', 'image_path'], axis=1)
y = df['label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, shuffle=True)

X_train = np.asarray(X_train['image'].tolist())
X_test = np.asarray(X_test['image'].tolist())
X_train_mean, X_train_std = X_train.mean(), X_train.std()
X_test_mean, X_test_std = X_test.mean(), X_test.std()
X_train = (X_train - X_train_mean) / X_train_std
X_test = (X_test - X_test_mean) / X_test_std

y_train = to_categorical(y_train, num_classes=num_classes)
y_test = to_categorical(y_test, num_classes=num_classes)

X_train, X_validate, y_train, y_validate = train_test_split(X_train, y_train, test_size=0.2, shuffle=True)
X_train = X_train.reshape(X_train.shape[0], 75, 100, 3)
X_test = X_test.reshape(X_test.shape[0], 75, 100, 3)
X_validate = X_validate.reshape(X_validate.shape[0], 75, 100, 3)
y_train = y_train.astype(int)
y_validate = y_validate.astype(int)

# Model definition
model = Sequential([
    DenseNet201(include_top=False, weights='imagenet', input_shape=(75, 100, 3)),
    Flatten(),
    Dropout(0.5),
    Dense(512, activation='relu'),
    Dense(num_classes, activation='softmax')
])

# Compile model
opt = SGD(learning_rate=0.001, momentum=0.9)
model.compile(optimizer=opt, loss='categorical_crossentropy', metrics=['accuracy'])

# Learning rate scheduler
learning_rate_reduction = ReduceLROnPlateau(
    monitor='val_accuracy',
    patience=3,
    verbose=1,
    factor=0.5,
    min_lr=0.00001
)

# Train model
history = model.fit(
    X_train, y_train,
    epochs=50, batch_size=32,
    validation_data=(X_validate, y_validate),
    callbacks=[learning_rate_reduction]
)

# Save model
model.save('skin_disease_model.h5')
