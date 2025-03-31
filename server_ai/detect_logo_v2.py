import os

import cv2
import numpy as np
from PIL import Image
import requests
from io import BytesIO
from urllib.parse import urlparse

# Kích thước ảnh chuẩn hóa
IMG_SIZE = (640, 640)


def load_and_preprocess_image(image_path):
	"""
	Tải và tiền xử lý ảnh: thay đổi kích thước và chuyển đổi định dạng.

	Args:
		image_path (str): Đường dẫn ảnh (local hoặc URL)

	Returns:
		tuple: (ảnh BGR, ảnh grayscale) hoặc (None, None) nếu lỗi
	"""
	try:
		# Kiểm tra nếu là URL
		if urlparse(image_path).scheme in ('http', 'https'):
			response = requests.get(image_path, timeout=10)
			response.raise_for_status()
			img = Image.open(BytesIO(response.content)).convert('RGB')
		else:
			img = Image.open(image_path).convert('RGB')
		
		# Thay đổi kích thước
		img = img.resize(IMG_SIZE)
		img_array = np.array(img)
		# Chuyển từ RGB sang BGR (phù hợp với OpenCV)
		img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
		img_gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
		return img_bgr, img_gray,img_array
	except Exception as e:
		print(f"Lỗi khi tải ảnh: {str(e)}")
		return None, None


def detect_watermark(img_gray):
	"""Enhanced watermark detection with more flexible criteria"""
	# Use adaptive thresholding
	thresh = cv2.adaptiveThreshold(
		img_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
		cv2.THRESH_BINARY, 11, 2
		)
	
	# Find contours with less restrictive criteria
	contours, _ = cv2.findContours(thresh, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
	
	for contour in contours:
		area = cv2.contourArea(contour)
		x, y, w, h = cv2.boundingRect(contour)
		
		# More lenient area check
		if 100 < area < (IMG_SIZE[0] * IMG_SIZE[1] * 0.3):
			# Check aspect ratio and position
			aspect_ratio = w / float(h)
			is_in_interesting_region = (
					(x < IMG_SIZE[0] * 0.2 or x > IMG_SIZE[0] * 0.8) or
					(y < IMG_SIZE[1] * 0.2 or y > IMG_SIZE[1] * 0.8)
			)
			
			if is_in_interesting_region and (0.2 < aspect_ratio < 5):
				return True
	return False


def detect_logo(img_bgr):
	"""Enhanced logo detection with multiple strategies"""
	# Convert to grayscale for edge detection
	gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
	
	# Use Canny edge detection
	edges = cv2.Canny(gray, 50, 150)
	
	# Find contours
	contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
	
	for contour in contours:
		area = cv2.contourArea(contour)
		
		# More flexible area check
		if 100 < area < (IMG_SIZE[0] * IMG_SIZE[1] * 0.2):
			peri = cv2.arcLength(contour, True)
			approx = cv2.approxPolyDP(contour, 0.02 * peri, True)
			
			# Check for simple geometric shapes
			if 3 <= len(approx) <= 15:
				# Additional checks can be added here
				return True
	
	return False


def analyze_image(image_path):
	"""
	Phân tích ảnh để phát hiện watermark và logo.

	Args:
		image_path (str): Đường dẫn ảnh

	Returns:
		dict: Kết quả với 'is_has_watermark' và 'is_has_logo'
	"""
	img_bgr, img_gray,img_array = load_and_preprocess_image(image_path)
	if img_bgr is None:
		return { "is_has_watermark": False, "is_has_logo": False }
	
	has_watermark = detect_watermark(img_gray)
	has_logo = detect_logo(img_bgr)
	
	return { "is_has_watermark": has_watermark, "is_has_logo": has_logo }


def main():
	"""
	Hàm chính để chạy thử code.
	"""
	base_dir = r"C:/Users/ADMIN/Downloads/model_detect_image/dataset/has_logo"
	# Thay đổi đường dẫn ảnh theo nhu cầu
	for image in os.listdir(base_dir):
		image_path = os.path.join(base_dir, image)
		result_with = analyze_image(image_path)
		print(f"Ảnh {image_path}: {result_with}")
	image_without_watermark = r"C:/Users/ADMIN/Downloads/model_detect_image/dataset/test/test8.jpg"
	print(f"Ảnh {image_without_watermark}: {analyze_image(image_without_watermark)}")


if __name__ == "__main__":
	main()

	