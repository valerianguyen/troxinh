import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import losses, Model, Input
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Reshape, Conv2DTranspose, Concatenate, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
import glob
from PIL import Image
import matplotlib.pyplot as plt
import cv2

# Set random seed
np.random.seed(42)
tf.random.set_seed(42)

# Configuration
IMG_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS_INITIAL = 20
EPOCHS_FINE_TUNE = 10
LEARNING_RATE_INITIAL = 1e-4
LEARNING_RATE_FINE_TUNE = 1e-5
LATENT_DIM = 128


# Enhanced image loader with edge detection
def load_images_from_folder(folder_path, is_building=True):
	images = []
	edge_images = []
	labels = []
	valid_exts = { 'jpg', 'jpeg', 'png' }
	
	for img_path in glob.glob(os.path.join(folder_path, '*')):
		try:
			ext = img_path.split('.')[-1].lower()
			if ext not in valid_exts:
				continue
			
			# Load and normalize image
			img = Image.open(img_path).convert('RGB').resize(IMG_SIZE)
			img_array = np.array(img) / 255.0
			
			# Extract edges using Canny edge detection
			img_gray = cv2.cvtColor((img_array * 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)
			edges = cv2.Canny(img_gray, 50, 150)
			edges = edges.astype(np.float32) / 255.0
			edges = np.expand_dims(edges, axis=-1)  # Shape: (224, 224, 1)
			
			if img_array.shape == (*IMG_SIZE, 3):
				images.append(img_array)
				edge_images.append(edges)
				labels.append(1 if is_building else 0)
		except Exception as e:
			print(f"Error loading {img_path}: {e}")
	
	return np.array(images), np.array(edge_images), np.array(labels)


# Function to detect straight lines - useful for building detection
def has_straight_lines(edge_image, threshold=100):
	lines = cv2.HoughLinesP(
		(edge_image * 255).astype(np.uint8),
		rho=1,
		theta=np.pi / 180,
		threshold=threshold,
		minLineLength=100,
		maxLineGap=10
	)
	return lines is not None and len(lines) > 5


# Improved autoencoder with classification branch
def build_improved_model():
	# Input layers
	image_input = Input(shape=(*IMG_SIZE, 3), name='image_input')
	edge_input = Input(shape=(*IMG_SIZE, 1), name='edge_input')
	
	# Base feature extractor
	base_model = MobileNetV2(
		weights='imagenet',
		include_top=False,
		input_shape=(*IMG_SIZE, 3)
	)
	base_model.trainable = False
	
	# Extract features from RGB image
	x = base_model(image_input)
	image_features = GlobalAveragePooling2D()(x)
	
	# Process edge information separately
	edge_reshaped = tf.keras.layers.Conv2D(16, 3, strides=2, activation='relu', padding='same')(edge_input)
	edge_reshaped = tf.keras.layers.MaxPooling2D()(edge_reshaped)
	edge_reshaped = tf.keras.layers.Conv2D(32, 3, strides=2, activation='relu', padding='same')(edge_reshaped)
	edge_reshaped = tf.keras.layers.MaxPooling2D()(edge_reshaped)
	edge_features = GlobalAveragePooling2D()(edge_reshaped)
	
	# Combine features
	combined_features = Concatenate()([image_features, edge_features])
	encoded = Dense(LATENT_DIM, activation='relu')(combined_features)
	
	# Classification branch
	x_class = Dense(64, activation='relu')(encoded)
	x_class = Dropout(0.5)(x_class)
	classification = Dense(1, activation='sigmoid', name='classification')(x_class)
	
	# Decoder branch
	x_decoder = Dense(7 * 7 * 512, activation='relu')(encoded)
	x_decoder = Reshape((7, 7, 512))(x_decoder)
	x_decoder = Conv2DTranspose(256, 3, strides=2, activation='relu', padding='same')(x_decoder)  # 14x14
	x_decoder = Conv2DTranspose(128, 3, strides=2, activation='relu', padding='same')(x_decoder)  # 28x28
	x_decoder = Conv2DTranspose(64, 3, strides=2, activation='relu', padding='same')(x_decoder)  # 56x56
	x_decoder = Conv2DTranspose(32, 3, strides=2, activation='relu', padding='same')(x_decoder)  # 112x112
	x_decoder = Conv2DTranspose(16, 3, strides=2, activation='relu', padding='same')(x_decoder)  # 224x224
	reconstruction = Conv2DTranspose(3, 3, activation='sigmoid', padding='same', name='reconstruction')(x_decoder)
	model = Model(inputs=[image_input, edge_input], outputs=[reconstruction, classification], name='improved_building_detector')
	model.base_model = base_model
	
	return model


# Improved training function
def train_improved_model(X_train, X_edge_train, y_train, X_val, X_edge_val, y_val):
	model = build_improved_model()
	
	# Initial compile with multiple loss functions
	model.compile(
		optimizer=Adam(LEARNING_RATE_INITIAL),
		loss={
			'reconstruction': losses.MeanSquaredError(),
			'classification': losses.BinaryCrossentropy()
		},
		loss_weights={
			'reconstruction': 1.0,
			'classification': 2.0  # Emphasize classification accuracy
		},
		metrics={
			'classification': ['accuracy']
		}
	)
	
	# Callbacks
	callbacks = [
		EarlyStopping(patience=5, restore_best_weights=True, monitor='val_classification_accuracy', mode='max'),
		ModelCheckpoint('best_building_model.h5', save_best_only=True, monitor='val_classification_accuracy', mode='max')
	]
	
	# Create a custom generator that yields both inputs and outputs
	def custom_generator(X_img, X_edge, y, batch_size):
		indices = np.arange(len(X_img))
		while True:
			np.random.shuffle(indices)
			for start_idx in range(0, len(indices), batch_size):
				batch_indices = indices[start_idx:start_idx + batch_size]
				batch_X_img = X_img[batch_indices]
				batch_X_edge = X_edge[batch_indices]
				batch_y = y[batch_indices]
				
				# Apply augmentation to images
				augmented_imgs = []
				for img in batch_X_img:
					# Random transformations
					if np.random.rand() > 0.5:
						img = tf.image.flip_left_right(img).numpy()
					if np.random.rand() > 0.5:
						img = tf.image.random_brightness(img, 0.2).numpy()
					augmented_imgs.append(img)
				
				batch_X_img = np.array(augmented_imgs)
				
				# Return both inputs and outputs
				yield (
					{ 'image_input': batch_X_img, 'edge_input': batch_X_edge },
					{ 'reconstruction': batch_X_img, 'classification': batch_y }
				)
	
	# Initial training
	history = model.fit(
		custom_generator(X_train, X_edge_train, y_train, BATCH_SIZE),
		steps_per_epoch=len(X_train) // BATCH_SIZE,
		validation_data=({
			                 'image_input': X_val,
			                 'edge_input': X_edge_val
		                 }, {
			                 'reconstruction': X_val,
			                 'classification': y_val
		                 }),
		epochs=EPOCHS_INITIAL,
		callbacks=callbacks,
		verbose=1
	)
	
	# Fine-tuning with unfrozen layers
	model.base_model.trainable = True
	for layer in model.base_model.layers[-20:]:
		layer.trainable = True
	
	model.compile(
		optimizer=Adam(LEARNING_RATE_FINE_TUNE),
		loss={
			'reconstruction': losses.MeanSquaredError(),
			'classification': losses.BinaryCrossentropy()
		},
		loss_weights={
			'reconstruction': 1.0,
			'classification': 2.0
		},
		metrics={
			'classification': ['accuracy']
		}
	)
	
	model.fit(
		custom_generator(X_train, X_edge_train, y_train, BATCH_SIZE),
		steps_per_epoch=len(X_train) // BATCH_SIZE,
		validation_data=({
			                 'image_input': X_val,
			                 'edge_input': X_edge_val
		                 }, {
			                 'reconstruction': X_val,
			                 'classification': y_val
		                 }),
		epochs=EPOCHS_FINE_TUNE,
		callbacks=[ModelCheckpoint('final_building_model.h5')],
		verbose=1
	)
	
	return model, history


# Function to detect buildings with confidence score
def is_building(model, image, edge_image, recon_threshold=0.1, line_threshold=100):
	# Get model predictions
	reconstruction, classification = model.predict(
		{
			'image_input': np.expand_dims(image, axis=0),
			'edge_input': np.expand_dims(edge_image, axis=0)
		}
	)
	
	# Calculate reconstruction error
	recon_error = np.mean(np.square(image - reconstruction[0]))
	
	# Check for straight lines in the edge image
	has_lines = has_straight_lines(edge_image.squeeze() * 255, threshold=line_threshold)
	
	# Classification probability
	class_prob = classification[0][0]
	
	# Combined decision
	# High classification probability AND (acceptable reconstruction OR has straight lines)
	is_building_result = class_prob > 0.7 and (recon_error < recon_threshold or has_lines)
	
	return {
		'is_building': is_building_result,
		'confidence': float(class_prob),
		'reconstruction_error': float(recon_error),
		'has_structural_lines': has_lines
	}


# Main execution
if __name__ == "__main__":
	# Load building data
	base_dir = 'C:/Users/ADMIN/Downloads/model_detect_image/dataset/valid'
	building_dir = os.path.join(base_dir, 'building')
	X_buildings, X_edge_buildings, y_buildings = load_images_from_folder(building_dir, is_building=True)
	alley_dir = os.path.join(base_dir, 'alley')
	X_alleys, X_edge_alleys, y_alleys = load_images_from_folder(alley_dir, is_building=True)
	# Load non-building data (you'll need a folder with non-building images)
	# If you don't have this data yet, you'll need to collect some non-building images
	
	non_building_dir = 'C:/Users/ADMIN/Downloads/model_detect_image/dataset/negative'
	if os.path.exists(non_building_dir):
		X_non_buildings, X_edge_non_buildings, y_non_buildings = load_images_from_folder(non_building_dir, is_building=False)
		
		# Combine datasets
		X = np.concatenate([X_buildings,X_alleys, X_non_buildings])
		X_edge = np.concatenate([X_edge_buildings,X_edge_alleys, X_edge_non_buildings])
		y = np.concatenate([y_buildings,y_alleys, y_non_buildings])
	else:
		print("Warning: No negative examples found. Model may not distinguish non-buildings well.")
		X, X_edge, y = np.concatenate([X_buildings, X_alleys]), np.concatenate([X_edge_buildings, X_edge_alleys]), np.concatenate([y_buildings, y_alleys])
	
	# Split data
	indices = np.random.permutation(len(X))
	train_idx, val_idx = train_test_split(indices, test_size=0.2, random_state=42)
	
	X_train, X_edge_train, y_train = X[train_idx], X_edge[train_idx], y[train_idx]
	X_val, X_edge_val, y_val = X[val_idx], X_edge[val_idx], y[val_idx]
	
	# Train and save model
	model, history = train_improved_model(X_train, X_edge_train, y_train, X_val, X_edge_val, y_val)
	model.save('improved_building_detector.h5')
	
	# Test on a few examples
	for i in range(min(5, len(X_val))):
		result = is_building(model, X_val[i], X_edge_val[i])
		print(f"Example {i + 1} - Is Building: {result['is_building']}, Confidence: {result['confidence']:.2f}")
