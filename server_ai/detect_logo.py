import cv2
import numpy as np
from PIL import Image
from io import BytesIO
import requests
from urllib.parse import urlparse
from skimage import feature


def enhanced_watermark_detection(img_gray, edges, threshold=0.15):
	"""Improved watermark detection using multi-scale frequency analysis"""
	# Multi-scale Fourier analysis
	rows, cols = img_gray.shape
	scales = [
		(10, 30),  # Small-scale patterns
		(30, 60),  # Medium-scale patterns
		(60, 100)  # Large-scale patterns
	]
	
	watermark_scores = []
	for r_in, r_out in scales:
		dft = cv2.dft(np.float32(img_gray), flags=cv2.DFT_COMPLEX_OUTPUT)
		dft_shift = np.fft.fftshift(dft)
		
		center_x, center_y = cols // 2, rows // 2
		mask = np.zeros((rows, cols, 2), np.uint8)
		
		Y, X = np.ogrid[:rows, :cols]
		dist_from_center = np.sqrt((X - center_x) ** 2 + (Y - center_y) ** 2)
		mask[(dist_from_center > r_in) & (dist_from_center < r_out)] = 1
		
		filtered_dft = dft_shift * mask
		dft_ishift = np.fft.ifftshift(filtered_dft)
		img_back = cv2.idft(dft_ishift)
		img_back = cv2.magnitude(img_back[:, :, 0], img_back[:, :, 1])
		
		magnitude_normalized = cv2.normalize(img_back, None, 0, 1, cv2.NORM_MINMAX)
		score = np.sum(magnitude_normalized > 0.95) / magnitude_normalized.size
		watermark_scores.append(score)
	
	# Combine scores with edge consistency check
	edge_consistency = np.mean(edges) * np.std(edges)
	return max(watermark_scores) > threshold or edge_consistency > 0.05


def improved_logo_detection(img_rgb, min_area=200, texture_threshold=0.2):
	"""Enhanced logo detection using texture analysis"""
	# Convert to LAB color space
	lab = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2LAB)
	l_channel = lab[:, :, 0]
	
	# Calculate texture features
	glcm = feature.graycomatrix(
		l_channel.astype(np.uint8),
		distances=[2],
		angles=[0],
		symmetric=True,
		normed=True
	)
	contrast = feature.graycoprops(glcm, 'contrast')[0, 0]
	homogeneity = feature.graycoprops(glcm, 'homogeneity')[0, 0]
	
	# Find high-contrast regions
	edges = feature.canny(l_channel, sigma=1.5)
	contours, _ = cv2.findContours(
		edges.astype(np.uint8),
		cv2.RETR_EXTERNAL,
		cv2.CHAIN_APPROX_SIMPLE
	)
	
	logo_detected = False
	for cnt in contours:
		area = cv2.contourArea(cnt)
		if area < min_area:
			continue
		
		x, y, w, h = cv2.boundingRect(cnt)
		region = lab[y:y + h, x:x + w]
		
		# Check color consistency
		color_std = np.std(region, axis=(0, 1))
		if np.mean(color_std) < 15:  # Low color variation
			logo_detected = True
			break
	
	# Combine texture and shape features
	return logo_detected or (contrast > 500 and homogeneity < texture_threshold)


def analyze_image(image_url):
	try:
		# Load and preprocess image
		response = requests.get(image_url)
		img = Image.open(BytesIO(response.content)).convert('RGB')
		img = img.resize((512, 512))  # Higher resolution for better analysis
		img_rgb = np.array(img)
		img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
		edges = cv2.Canny(img_gray, 30, 100)
		
		# Enhanced detections
		watermark = enhanced_watermark_detection(img_gray, edges)
		logo = improved_logo_detection(img_rgb)
		
		return {
			'has_watermark': watermark,
			'has_logo': logo,
		}
	
	except Exception as e:
		print('error', str(e))
		return { 'error': str(e) }


# Test with your image
result = analyze_image(
	"https://cdn.chotot.com/tDdCr9yIppgO3lAIGbCQ1s7IpQKPtxpRPTjN7dQSyKw/preset:view/plain/2a326c31c3f05c92fbe710131d8aede2-2811059312926766230.jpg"
)

print("Detection Results:")
print(f"Watermark Detected: {result['has_watermark']}")
print(f"Logo Detected: {result['has_logo']}")