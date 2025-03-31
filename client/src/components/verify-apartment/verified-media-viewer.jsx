import {
  useEffect,
  useState,
} from 'react';

import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { config } from '@/utils';

export default function VerifiedMediaViewer({ media = defaultMedia }) {
	const [open, setOpen] = useState(false);
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

	const [currentMedia, setCurrentMedia] = useState();
	const handleNext = () => {
		setCurrentMediaIndex((prev) => (prev + 1) % media.length);
	};

	const handlePrevious = () => {
		setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
	};
	useEffect(() => {
		const fetchMedia = async () => {
			const response = await fetch(
				`${config.VITE_SERVER_URL}upload/files/${media[currentMediaIndex].vam_url}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					crossOrigin: "anonymous",
				},
			);
			const blob = await response.blob();
			console.log(blob);
			setCurrentMedia({
				type: blob.type,
				...media[currentMediaIndex],
			});
		};
		if (media.length > 0) {
			fetchMedia();
		}
	}, [currentMediaIndex]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="flex items-center gap-2 bg-white text-green-600 border-green-600 hover:bg-green-50 my-4"
				>
					<CheckCircle className="h-4 w-4" />
					<span>Tin được xác thực</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[800px] p-4">
				<DialogTitle>Nội dung đã được xác thực bởi Trọ xinh.</DialogTitle>
				<p>Các bằng chứng được cung cấp bởi Trọ xinh</p>
				<div className="relative">
					{media.length > 1 && (
						<div className="absolute top-1/2 left-0 right-0 z-10 flex justify-between px-4 -translate-y-1/2">
							<Button
								variant="outline"
								size="icon"
								className="rounded-full bg-black/30 border-none text-white hover:bg-black/50"
								onClick={handlePrevious}
							>
								&larr;
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="rounded-full bg-black/30 border-none text-white hover:bg-black/50"
								onClick={handleNext}
							>
								&rarr;
							</Button>
						</div>
					)}

					{currentMedia && (
						<>
							<div className="overflow-hidden">
								{currentMedia?.type?.startsWith("image") ? (
									<img
										src={
											`${config.VITE_SERVER_URL}upload/files/${currentMedia?.vam_url}` ||
											"/placeholder.svg"
										}
										alt={currentMedia?.vam_url || "Verified media"}
										crossOrigin="anonymous"
										className="w-full h-auto max-h-[80vh] object-contain"
									/>
								) : (
									<video
										src={`${config.VITE_SERVER_URL}upload/files/${currentMedia.vam_url}`}
										crossOrigin="anonymous"
										controls
										className="w-full h-auto max-h-[80vh]"
										title={currentMedia.vam_url || "Verified media"}
									>
										Your browser does not support the video tag.
									</video>
								)}
							</div>

							{currentMedia?.vam_url && (
								<div className="p-4 bg-white">
									<h3 className="text-lg font-medium">{currentMedia?.vam_url}</h3>
								</div>
							)}
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
