import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization, GlobalAveragePooling2D
from tensorflow.keras.optimizers import Adam, RMSprop, SGD, Adamax
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import itertools

def create_model(dropout_rate=0.5, dense_neurons=512, optimizer=Adam, learning_rate=0.001):
    base_model = tf.keras.applications.MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
    base_model.trainable = False  # Keep MobileNetV2 frozen for feature extraction

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = BatchNormalization()(x)
    x = Dense(dense_neurons, activation='relu')(x)
    x = Dropout(dropout_rate)(x)
    x = Dense(3, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=x)

    opt = optimizer(learning_rate=learning_rate)
    model.compile(optimizer=opt, loss='categorical_crossentropy', metrics=['accuracy'])

    return model

# Hyperparameter grid
param_grid = {
    'dropout_rate': [0.3, 0.5, 0.7],
    'dense_neurons': [256, 512, 1024],
    'optimizer': [Adam, RMSprop, SGD, Adamax],
    'learning_rate': [1e-4, 1e-3, 1e-2],
    'batch_size': [16, 32, 64]
}

# Generate all possible hyperparameter combinations
param_combinations = list(itertools.product(*param_grid.values()))

import numpy as np

best_accuracy = 0
best_params = None

# Data generators for augmentation
train_datagen = ImageDataGenerator(rescale=1./255, horizontal_flip=True, rotation_range=30)
train_generator = train_datagen.flow_from_directory("path_to_train_data", target_size=(224,224), batch_size=32, class_mode='categorical')

val_datagen = ImageDataGenerator(rescale=1./255)
val_generator = val_datagen.flow_from_directory("path_to_val_data", target_size=(224,224), batch_size=32, class_mode='categorical')

for params in param_combinations:
    dropout_rate, dense_neurons, optimizer, learning_rate, batch_size = params

    print(f"Training with params: {params}")

    model = create_model(dropout_rate, dense_neurons, optimizer, learning_rate)

    history = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=5,  # Reduce epochs for quick testing; increase for full tuning
        batch_size=batch_size
    )

    val_acc = np.max(history.history['val_accuracy'])  # Get highest validation accuracy

    if val_acc > best_accuracy:
        best_accuracy = val_acc
        best_params = params

print(f"\nBest Accuracy: {best_accuracy}")
print(f"Best Parameters: {best_params}")

