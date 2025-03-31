import { useState } from 'react';

import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import UserApi from '@/api/user.api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { login } from '@/lib/features/user/userSlice';
import { config } from '@/utils';

export function UpdateAvatar() {
	const [image, setImage] = useState(null);
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const submit = async () => {
		const formData = new FormData();
		formData.append("file", image.file);
		formData.append("upload_preset", config.VITE_CLOUD_UPLOAD_PRESET);
		setLoading(true);
		const resCloudinary = await axios.post(
			`https://api.cloudinary.com/v1_1/${config.VITE_CLOUD_NAME}/image/upload`,
			formData,
		);
		const { secure_url, _ } = resCloudinary.data;
		const res = await UserApi.updateUser({
			usr_avatar: secure_url,
		});

		if (res?.status === 200) {
			toast.success("Update avatar success",{
				duration: 1000,
			});
			dispatch(
				login({
					usr_avatar: secure_url,
				}),
			);
		}
		setLoading(false);
		setOpen(false);
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="w-9/12 bg-gray-400 hover:bg-gray-300 hover:text-black">
					Thay avatar
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>Upload Avatar</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex items-center justify-center w-full">
						<label
							htmlFor="dropzone-file"
							className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
						>
							{image?.blobUrl ? (
								<img
									src={image?.blobUrl}
									alt="avatar"
									className="w-full h-full object-cover rounded-lg"
								/>
							) : (
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									<svg
										className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 20 16"
									>
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
										/>
									</svg>
									<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
										<span className="font-semibold">Click to upload</span> or drag and drop
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
								</div>
							)}
							<input
								id="dropzone-file"
								type="file"
								className="hidden"
								accept="image/*"
								onChange={(event) =>
									setImage({
										blobUrl: URL.createObjectURL(event.target.files[0]),
										file: event.target.files[0],
									})
								}
							/>
						</label>
					</div>
				</div>
				<DialogFooter>
					{loading ? (
						<>
							<Button disabled>
								<Loader2 className="animate-spin" />
								Please wait
							</Button>
						</>
					) : (
						<Button type="submit" onClick={submit}>
							Upload
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
