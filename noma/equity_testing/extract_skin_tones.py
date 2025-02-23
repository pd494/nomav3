import cv2
import numpy as np
import os
from sklearn.cluster import KMeans

def detect_skin(image):
    """Detects skin in an image using HSV color filtering."""
    img_hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Define lower and upper bounds for skin color in HSV
    lower = np.array([0, 20, 70], dtype=np.uint8)  
    upper = np.array([20, 255, 255], dtype=np.uint8)

    # Create skin mask
    skin_mask = cv2.inRange(img_hsv, lower, upper)

    # Apply mask to get only skin pixels
    skin = cv2.bitwise_and(image, image, mask=skin_mask)

    return skin, skin_mask

# Test on one image
# test_img = cv2.imread("/Users/shivanibelambe/cancer/melanomAI/equity_testing/Melanoma on dark skin/images (1).jpg")
# skin_only, skin_mask = detect_skin(test_img)

# # Show the result
# cv2.imshow("Original", test_img)
# cv2.imshow("Detected Skin", skin_only)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

def extract_skin_colors(image_paths, num_colors=5):
    all_skin_pixels = []

    for img_path in image_paths:
        img = cv2.imread(img_path)
        skin, skin_mask = detect_skin(img)

        # Convert skin pixels to LAB for better color analysis
        skin_lab = cv2.cvtColor(skin, cv2.COLOR_BGR2LAB)
        mask = skin_mask > 0  # Get only skin pixels
        skin_pixels = skin_lab[mask]  

        if len(skin_pixels) > 0:
            all_skin_pixels.append(skin_pixels)

    if not all_skin_pixels:
        return None
    
    all_skin_pixels = np.vstack(all_skin_pixels)  # Stack all pixels together
    kmeans = KMeans(n_clusters=num_colors, random_state=42, n_init=10)
    kmeans.fit(all_skin_pixels)
    
    return kmeans.cluster_centers_  # Return key skin tones

# Load images from Melanoma/
image_paths = [os.path.join("Melanoma on dark skin", f) for f in os.listdir("Melanoma on dark skin") if f.endswith(".jpg")]

dominant_skin_colors = extract_skin_colors(image_paths, num_colors=5)
print("Extracted Skin Tones (LAB):", dominant_skin_colors)

# count the number of images in the folder
def count_matching_images(image_paths, reference_colors, threshold=15):
    count = 0

    for img_path in image_paths:
        img = cv2.imread(img_path)
        skin, skin_mask = detect_skin(img)

        skin_lab = cv2.cvtColor(skin, cv2.COLOR_BGR2LAB)
        mask = skin_mask > 0
        skin_pixels = skin_lab[mask]

        if len(skin_pixels) > 0:
            for ref_color in reference_colors:
                distances = np.linalg.norm(skin_pixels - ref_color, axis=1)
                
                if np.any(distances < threshold):  # Check for color match
                    count += 1
                    break  

    return count

# Define paths for both datasets
dark_skin_path = "Melanoma on dark skin"
main_dataset_path = "../detection/melanoma_cancer_dataset"

# Load images from dark skin dataset
dark_skin_image_paths = [
    os.path.join(dark_skin_path, f) for f in os.listdir(dark_skin_path) if f.endswith(".jpg")
]

# Load images from the main dataset
main_dataset_paths = [
    os.path.join(main_dataset_path, f) for f in os.listdir(main_dataset_path) if f.endswith(".jpg")
]

matching_count = count_matching_images(main_dataset_paths, dominant_skin_colors)

print("Number of images with darker skin tones:", matching_count)
