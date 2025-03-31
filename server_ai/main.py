# main.py
import re
from io import BytesIO
from typing import Union
from urllib.parse import urlparse

import cv2
import numpy as np
import requests
import tensorflow as tf
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
from pydantic import BaseModel
from pytesseract import pytesseract

app = FastAPI(debug=True)

# Configuration
IMG_SIZE = (224, 224)
BLUR_THRESHOLD = 100
CONTENT_CONFIDENCE_THRESHOLD = 0.6
TEXT_CONFIDENCE_THRESHOLD = 0.5

ELECTRONIC_LOGO_EDGE_THRESHOLD = 0.25  # 0-1 scale
WATERMARK_PATTERN_THRESHOLD = 15  # Lower = more sensitive
CORNER_DENSITY_THRESHOLD = 0.3


class ImageRequestURL(BaseModel):
	image_url: str


class ImageRequestMultiple(BaseModel):
	image_urls: list[str]


class Config:
	# Threshold adjustments for original vs added logos
	EDGE_DENSITY_THRESH = 0.20
	TEXTURE_VARIATION_THRESH = 400
	COLOR_CONSISTENCY_THRESH = 30
	CORNER_DENSITY_THRESH = 0.25


class DetectionResult(BaseModel):
	is_building: bool
	confidence: float
	reconstruction_error: float
	has_structural_lines: bool
	quality_check: dict
	brand_markings: dict
	text_check: dict


class BuildingDetector:
	def __init__(self, model_path: str):
		self.model = tf.keras.models.load_model(model_path)
		self.phone_pattern = re.compile(r'(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}')
		self.url_pattern = re.compile(r'(https?://)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/\S*)?')
		self.config = Config()
	
	def _load_image(self, image_source: Union[str, bytes]) -> Image.Image:
		if isinstance(image_source, str) and urlparse(image_source).scheme in ('http', 'https'):
			response = requests.get(image_source)
			response.raise_for_status()
			image = Image.open(BytesIO(response.content)).convert('RGB')
		else:
			if isinstance(image_source, bytes):
				image = Image.open(BytesIO(image_source)).convert('RGB')
			else:
				image = Image.open(image_source).convert('RGB')
		return image
	
	def _preprocess_image(self, image: Image.Image) -> tuple:
		# Resize and convert to array
		image_224 = image.resize(IMG_SIZE)
		image_512 = image.resize((512, 512))
		img_array_224 = np.array(image_224) / 255.0
		img_array_512 = np.array(image_512) / 255.0
		# Extract edges
		img_gray_224 = cv2.cvtColor((img_array_224 * 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)
		img_gray_512 = cv2.cvtColor((img_array_512 * 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)
		# Corrected line: use img_gray_224 (uint8) instead of img_array_224 (float)
		edges = cv2.Canny(img_gray_224, 50, 150)  # This line is fixed
		edges = edges.astype(np.float32) / 255.0
		edges = np.expand_dims(edges, axis=-1)
		
		return img_array_224, img_gray_224, edges, img_array_512, img_gray_512
	
	def check_image_quality(self, img_array: np.ndarray) -> dict:
		img_uint8 = (img_array * 255).astype(np.uint8)
		img_rgb = cv2.cvtColor(img_uint8, cv2.COLOR_BGR2RGB)
		gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY) if len(img_rgb.shape) == 3 else img_rgb
		variance = cv2.Laplacian(gray, cv2.CV_64F).var()
		return bool(variance >= BLUR_THRESHOLD)
	
	def detect_text_and_contact_info(self, img_array: np.ndarray) -> dict:
		try:
			if img_array.dtype == np.float32 or img_array.dtype == np.float64:
				img_uint8 = (img_array * 255).astype(np.uint8)
			else:
				img_uint8 = img_array.astype(np.uint8)
			pil_img = Image.fromarray(img_uint8)
			pil_img = pil_img.convert('L')  # Grayscale
			pil_img = pil_img.point(lambda x: 0 if x < 128 else 255)
			extracted_text = pytesseract.image_to_string(pil_img)
			print("extracted text: ", extracted_text)
			return {
				"has_phone": bool(self.phone_pattern.search(extracted_text)),
				"has_url": bool(self.url_pattern.search(extracted_text)),
				"extracted_text": extracted_text,
			}
		except Exception as e:
			return { "has_phone": False, "has_url": False, "message": str(e) }
	
	def detect_text_based_logo(self, extracted_text: str) -> bool:
		"""Detect if the extracted text likely contains brand/company names"""
		# Common business identifiers
		business_keywords = ['ltd', 'llc', 'inc', 'store', 'shop', 'company', 'bán', 'cửa hàng', 'cafe', 'restaurant']
		
		# Check for business keywords
		has_business_term = any(keyword in extracted_text.lower() for keyword in business_keywords)
		
		# Check for capitalized text groups (often brand names)
		capitalized_groups = re.findall(r'\b[A-Z][A-Za-z]*(?:\s+[A-Z][A-Za-z]*)+\b', extracted_text)
		
		return bool(has_business_term or capitalized_groups)
	
	def detect_electronic_logo(self, img_rgb: np.ndarray) -> bool:
		# Convert image to proper
		img_uint8 = self._normalize_image(img_rgb)
		
		# Enhanced texture analysis
		texture_score = self._calculate_texture_consistency(img_uint8)
		# Improved edge analysis
		edge_analysis = self._analyze_edges(img_uint8)
		# Color space analysis
		color_consistency = self._check_color_consistency(img_uint8)
		# Position analysis
		position_score = self._check_logo_position(img_uint8)
		
		# Modified decision logic - using "or" to make detection more flexible
		is_electronic = (
				(edge_analysis['density'] > self.config.EDGE_DENSITY_THRESH) or
				(texture_score < self.config.TEXTURE_VARIATION_THRESH and
				 color_consistency['saturation_std'] < self.config.COLOR_CONSISTENCY_THRESH) or
				(position_score > self.config.CORNER_DENSITY_THRESH)
		)
		
		return bool(is_electronic)
	
	def _normalize_image(self, img_rgb: np.ndarray) -> np.ndarray:
		"""Normalize image to 8-bit format"""
		if img_rgb.dtype in [np.float32, np.float64]:
			return (img_rgb * 255).astype(np.uint8)
		return img_rgb.astype(np.uint8)
	
	def _calculate_texture_consistency(self, img_uint8: np.ndarray) -> float:
		"""Calculate texture variation using GLCM"""
		gray = cv2.cvtColor(img_uint8, cv2.COLOR_RGB2GRAY)
		from skimage import feature
		glcm = feature.graycomatrix(gray, distances=[2], angles=[0], symmetric=True, normed=True)
		return float(feature.graycoprops(glcm, 'contrast')[0, 0])
	
	def _analyze_edges(self, img_uint8: np.ndarray) -> dict:
		"""Perform multiscale edge analysis"""
		lab = cv2.cvtColor(img_uint8, cv2.COLOR_RGB2LAB)
		edges = cv2.Canny(lab[:, :, 0], 50, 150)
		return {
			'density': float(np.mean(edges) / 255),
			'sharpness': float(cv2.Laplacian(lab[:, :, 0], cv2.CV_64F).var())
		}
	
	def _check_color_consistency(self, img_uint8: np.ndarray) -> dict:
		"""Analyze color characteristics in HSV space"""
		hsv = cv2.cvtColor(img_uint8, cv2.COLOR_RGB2HSV)
		return {
			'saturation_std': float(np.std(hsv[:, :, 1])),
			'value_std': float(np.std(hsv[:, :, 2]))
		}
	
	def _check_logo_position(self, img_uint8: np.ndarray) -> float:
		"""Check for edge concentration in image periphery"""
		edges = cv2.Canny(cv2.cvtColor(img_uint8, cv2.COLOR_RGB2GRAY), 50, 150)
		border_mask = np.zeros_like(edges)
		border_size = int(min(edges.shape) * 0.1)  # 10% of image size
		border_mask[:border_size, :] = 1  # Top
		border_mask[-border_size:, :] = 1  # Bottom
		border_mask[:, :border_size] = 1  # Left
		border_mask[:, -border_size:] = 1  # Right
		return float(np.mean(edges[border_mask == 1]) / 255)
	
	def detect_digital_watermark(self, img_gray: np.ndarray, edges, threshold=0.25) -> bool:
		"""Detect digital translucent watermarks using frequency domain analysis"""
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
		
		return bool(max(watermark_scores) > threshold or edge_consistency > 0.05)
	
	# Update the detect_brand_markings method
	def detect_brand_markings(self, img_array: np.ndarray, img_gray: np.ndarray, extracted_text: str = "") -> bool:
		edges = cv2.Canny(img_gray, 50, 150)
		edges = edges.astype(np.float32) / 255.0  # Proper normalization
		edges = np.expand_dims(edges, axis=-1)
		watermark_result = self.detect_digital_watermark(img_gray, edges)
		electronic_logo_result = self.detect_electronic_logo(img_array)
		text_logo_detected = self.detect_text_based_logo(extracted_text)
		
		return bool(watermark_result or electronic_logo_result or text_logo_detected)
	
	def detect_building(self, image_source: Union[str, bytes]) -> dict:
		try:
			image = self._load_image(image_source)
			img_array, img_gray_224, edges, img_array_512, img_gray_512 = self._preprocess_image(image)
			
			# Perform quality checks
			quality_check = self.check_image_quality(img_array_512)
			text_check = self.detect_text_and_contact_info(img_array_512)
			extracted_text = text_check.get("extracted_text", "")
			brand_analysis = self.detect_brand_markings(img_array_512, img_gray_512, extracted_text)
			# Model prediction
			img_input = np.expand_dims(img_array, axis=0)
			edge_input = np.expand_dims(edges, axis=0)
			
			reconstruction, classification = self.model.predict(
				{
					'image_input': img_input,
					'edge_input': edge_input
				}, verbose=0
			)
			recon_error = np.mean(np.square(img_array - reconstruction[0]))
			has_lines = self._has_straight_lines(edges)
			
			return {
				"is_valid": bool(classification[0][0] > 0.7 and recon_error < 0.1 ),
				"is_quality_ok": quality_check,
				"is_has_logo_or_watermark": brand_analysis,
				"text_check": text_check
			}
		except Exception as e:
			return { "error": str(e) }
	
	def _has_straight_lines(self, edge_image: np.ndarray) -> bool:
		lines = cv2.HoughLinesP(
			(edge_image * 255).astype(np.uint8),
			rho=1,
			theta=np.pi / 180,
			threshold=100,
			minLineLength=100,
			maxLineGap=10
		)
		return bool(lines is not None and len(lines) > 5)


# Initialize detector
detector = BuildingDetector("improved_building_detector.h5")


def is_url(path: str) -> bool:
	return urlparse(path).scheme in ('http', 'https')


@app.post("/detect/url")
async def detect_from_url(request: ImageRequestURL):
	try:
		if not is_url(request.image_url):
			raise Exception("Invalid image URL")
		result = detector.detect_building(request.image_url)
		print(result)
		if "error" in result:
			raise HTTPException(status_code=400, detail=result["error"])
		return JSONResponse(content=result)
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))


@app.post("/detect/multiple/url")
async def detect_from_multiple_url(request: ImageRequestMultiple):
	try:
		result = []
		errors = []
		for url in request.image_urls:
			if not is_url(url):
				errors.append("Invalid image URL")
				break
			detect = detector.detect_building(url)
			result.append(detect)
			if "error" in detect:
				errors.append(detect["error"])
		if len(errors) > 0:
			raise HTTPException(status_code=400, detail=errors)
		return JSONResponse(content=result)
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))


@app.post("/detect/upload")
async def detect_from_upload(file: UploadFile = File(...)):
	try:
		contents = await file.read()
		result = detector.detect_building(contents)
		if "error" in result:
			raise HTTPException(status_code=400, detail=result["error"])
		return JSONResponse(content=result)
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))
	finally:
		await file.close()


if __name__ == "__main__":
	import uvicorn
	
	uvicorn.run(app, host="0.0.0.0", port=8000)
