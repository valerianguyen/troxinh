import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { uploadImage } from '@/utils/uploadImage';

export function useImageUpload({ onUpload }) {
	const previewRef = useRef(null);
	const fileInputRef = useRef(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [fileName, setFileName] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState(null);

	// Dummy upload function that simulates a delay and returns the local preview URL
	const dummyUpload = async (file, localUrl) => {
		try {
			setUploading(true);
			const formData = new FormData();
			formData.append("file", file);
			const result = await uploadImage(formData);
			if (result.status === 200) {
				setError(null);
				return result.data.secure_url;
			} else {
				throw new Error("Upload failed");
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Upload failed";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setUploading(false);
		}
	};

	const handleThumbnailClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleFileChange = useCallback(
		async (event) => {
			const file = event.target.files?.[0];
			if (file) {
				setFileName(file.name);
				const localUrl = URL.createObjectURL(file);
				setPreviewUrl(localUrl);
				previewRef.current = localUrl;

				try {
					const uploadedUrl = await dummyUpload(file, localUrl);
					onUpload?.(uploadedUrl);
				} catch (err) {
					URL.revokeObjectURL(localUrl);
					setPreviewUrl(null);
					setFileName(null);
					return console.error(err);
				}
			}
		},
		[onUpload],
	);

	const handleRemove = useCallback(() => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		setPreviewUrl(null);
		setFileName(null);
		previewRef.current = null;
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		setError(null);
	}, [previewUrl]);

	useEffect(() => {
		return () => {
			if (previewRef.current) {
				URL.revokeObjectURL(previewRef.current);
			}
		};
	}, []);

	return {
		previewUrl,
		fileName,
		fileInputRef,
		handleThumbnailClick,
		handleFileChange,
		handleRemove,
		uploading,
		error,
	};
}
