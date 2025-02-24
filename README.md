# noma - Skin Cancer Detection System

## Overview
Noma is a skin cancer detection system designed to identify skin cancer and classify the type of skin disease. It leverages machine learning models to assist in early diagnosis and medical decision-making.

## Technologies Used
### Frontend
* React Native: Framework for building mobile app with Typescript and React
* Expo: Manage development and build process
* Supabase: Backend and database services. Supabase provides a real-time database, authentication, and storage solutions.

### Backend
* Tensorflow: open-source machine learning framework, for building, training, and deploying machine learning models
* Pretrained Image Classification Models: leverages pretrained models like DenseNet and MobileVNet
* Convolutional Neural Networks (CNNs): deep learning architectures known for their effectiveness in image-related tasks
* SQL: backend is built with PostgreSQL via Supabase

## Model Workflow

Model Workflow
* Skin Cancer Detection Model: The detection model utilizes a CNN architecture, potentially using DenseNet or MobileVNet, pretrained on large image datasets like ISIC (International Skin Imaging Collaboration) to detect melanoma and other types of skin diseases.
* Skin Disease Classification: A secondary model classifies detected skin lesions into various categories, such as benign, malignant, or other skin conditions, based on the features extracted by the CNNs.


## How to run

### Downloading the models
Google Drive Link: https://drive.google.com/drive/folders/13rtqvS7fyH1eBN8EwS0q_eR_c6mpInCh?usp=sharing 

To run the model and create your own .h5 file
1. Download 'melanoma_cancer_dataset' and drag to the detection folder
2. Download 'Skin cancer ISIC The International Skin Imaging Collaboration' and drag to backend_type folder

To just run the frontend
1. Download the models for detecting skin cancer place skin_detection_model.hs into the detection folder
2. Download the model for detecting the type of skin disesase and place skin_disease_model.h5 into backend_type folder


## Set up for frontend - Downloading packages (Expo)
1. Install Expo CLI
```
npm install -g expo-cli
```
2. Navigate to Frontend Directory
```
cd noma/noma/melanoma_frontend
```
3. Install Dependencies
```
npm install
```
4. Install Expo CLI Locally
```
npx expo install expo-cli
```
5. Open a new terminal to start Supabase database
```
cd ../server/
```
6. Start database
```
python3 app.py
```
5. Move back to other terminal and start the Application
```
npx expo start
```
