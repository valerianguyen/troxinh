import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import losses, Model, Input
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Reshape, Conv2DTranspose
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
import glob
from PIL import Image
import matplotlib.pyplot as plt

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


# Enhanced image loader
def load_images_from_folder(folder_path):
	images = []
	valid_exts = { 'jpg', 'jpeg', 'png' }
	
	for img_path in glob.glob(os.path.join(folder_path, '*')):
		try:
			ext = img_path.split('.')[-1].lower()
			if ext not in valid_exts:
				continue
			
			img = Image.open(img_path).convert('RGB').resize(IMG_SIZE)
			img_array = np.array(img) / 255.0
			if img_array.shape == (*IMG_SIZE, 3):
				images.append(img_array)
		except Exception as e:
			print(f"Error loading {img_path}: {e}")
	return np.array(images)


# Fixed autoencoder architecture
def build_enhanced_autoencoder():
	base_model = MobileNetV2(
		weights='imagenet',
		include_top=False,
		input_shape=(*IMG_SIZE, 3)
	)
	base_model.trainable = False
	
	inputs = Input(shape=(*IMG_SIZE, 3))
	x = base_model(inputs)
	x = GlobalAveragePooling2D()(x)
	encoded = Dense(LATENT_DIM, activation='relu')(x)
	
	# Fixed decoder with proper dimensions
	x = Dense(7 * 7 * 512, activation='relu')(encoded)
	x = Reshape((7, 7, 512))(x)
	x = Conv2DTranspose(256, 3, strides=2, activation='relu', padding='same')(x)  # 14x14
	x = Conv2DTranspose(128, 3, strides=2, activation='relu', padding='same')(x)  # 28x28
	x = Conv2DTranspose(64, 3, strides=2, activation='relu', padding='same')(x)  # 56x56
	x = Conv2DTranspose(32, 3, strides=2, activation='relu', padding='same')(x)  # 112x112
	x = Conv2DTranspose(16, 3, strides=2, activation='relu', padding='same')(x)  # 224x224
	decoded = Conv2DTranspose(3, 3, activation='sigmoid', padding='same')(x)
	
	return Model(inputs, decoded, name='building_autoencoder')


# Training function
def train_model(X_train, X_val):
	model = build_enhanced_autoencoder()
	
	# Initial compile
	model.compile(
		optimizer=Adam(LEARNING_RATE_INITIAL),
		loss=losses.MeanSquaredError()
	)
	
	# Callbacks
	callbacks = [
		EarlyStopping(patience=5, restore_best_weights=True),
		ModelCheckpoint('best_model.h5', save_best_only=True)
	]
	
	# Initial training
	history = model.fit(
		ImageDataGenerator(
			rotation_range=40,
			width_shift_range=0.3,
			height_shift_range=0.3,
			shear_range=0.3,
			zoom_range=0.3,
			horizontal_flip=True,
			vertical_flip=True,
			fill_mode='nearest'
		).flow(X_train, X_train, batch_size=BATCH_SIZE),
		validation_data=(X_val, X_val),
		epochs=EPOCHS_INITIAL,
		callbacks=callbacks,
		verbose=2
	)
	
	# Fine-tuning
	model.layers[1].trainable = True
	for layer in model.layers[1].layers[-20:]:
		layer.trainable = True
	
	model.compile(
		optimizer=Adam(LEARNING_RATE_FINE_TUNE),
		loss=losses.MeanSquaredError()
	)
	
	model.fit(
		ImageDataGenerator().flow(X_train, X_train, batch_size=BATCH_SIZE),
		validation_data=(X_val, X_val),
		epochs=EPOCHS_FINE_TUNE,
		callbacks=[ModelCheckpoint('final_model.h5')],
		verbose=2
	)
	
	return model, history
	

# Main execution
if __name__ == "__main__":
	# Load data
	data_dir = 'C:/Users/ADMIN/Downloads/model_detect_image/dataset/valid'
	X = load_images_from_folder(data_dir)
	X_train, X_val = train_test_split(X, test_size=0.2, random_state=42)
	
	# Train and save
	model, history = train_model(X_train, X_val)
	model.save('building_detector.h5')
	
	# Calculate threshold
	val_recon = model.predict(X_val)
	val_errors = np.mean(np.square(X_val - val_recon), axis=(1, 2, 3))
	threshold = np.percentile(val_errors, 95)
	np.save('threshold.npy', threshold)
	print(f"Detection threshold: {threshold:.4f}")

	