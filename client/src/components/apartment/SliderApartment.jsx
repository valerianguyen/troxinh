// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Navigation,
  Pagination,
} from 'swiper/modules';
import {
  Swiper,
  SwiperSlide,
} from 'swiper/react';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const SliderApartment = ({ apartImages ,className}) => {
	const [thumbImage, setThumbImage] = useState(apartImages[0]?.img_url);
	const [swiper, setSwiper] = useState(null);
	const [key, setKey] = useState(0);
	const [activeIndex, setActiveIndex] = useState(0);

	const handlePrev = () => {
		swiper.slidePrev();
		if (activeIndex === 0) return;
		setThumbImage(apartImages[activeIndex - 1]?.img_url);
		setActiveIndex(activeIndex - 1);
	};

	const handleNext = () => {
		swiper.slideNext();
		if (activeIndex === apartImages.length - 1) return;
		setThumbImage(apartImages[activeIndex + 1]?.img_url);
		setActiveIndex(activeIndex + 1);
	};

	if (!apartImages?.length) {
		return null;
	}

	useEffect(() => {
		setThumbImage(apartImages[0]?.img_url);
		setKey((prevKey) => prevKey + 1);
	}, [apartImages]);
	return (
		<div className={cn("flex flex-col overflow-hidden select-none", className)}>
			{/* Main Image Display */}
			<div className="relative overflow-hidden border-2 border-gray-400 rounded-md w-full h-[500px] xl:h-[600px]">
				<Dialog>
					<DialogTrigger asChild>
						<img
							src={thumbImage}
							alt="Selected apartment view"
							className="w-full h-full object-cover"
						/>
					</DialogTrigger>
					<DialogContent
						className="max-w-none bg-transparent border-none outline-none h-[90%]"
						classNameClose="size-10 flex-center rounded-full bg-white top-0 focus:ring-0"
					>
						<div className="h-full absolute w-full p-5">
							<img
								src={thumbImage}
								alt="Selected apartment view"
								className="w-full h-full object-contain"
							/>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{/* Thumbnail Slider */}
			<div className="relative mt-4">
				<Swiper
					onSwiper={setSwiper}
					key={key}
					slidesPerView={2}
					spaceBetween={10}
					modules={[Navigation, Pagination]}
					className="h-[100px]"
					breakpoints={{
						540: { slidesPerView: 3 },
						1024: { slidesPerView: Math.min(apartImages.length, 4) },
					}}
				>
					{apartImages.map((image, index) => (
						<SwiperSlide
							key={index}
							className={`overflow-hidden rounded-md cursor-pointer max-w-52 ${
								thumbImage === image.img_url ? "border-red-400 border-2" : ""
							}`}
							onClick={() => {
								setThumbImage(image.img_url);
							}}
						>
							<img
								src={image.img_url}
								alt={`Apartment view ${index + 1}`}
								loading="lazy"
								className="w-full h-full object-cover"
							/>
						</SwiperSlide>
					))}
				</Swiper>

				{/* Navigation Buttons */}
				<button
					onClick={handlePrev}
					className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-400 hover:bg-gray-300 shadow-md transition-all"
				>
					<ChevronLeft className="w-5 h-5" />
				</button>
				<button
					onClick={handleNext}
					className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-400 hover:bg-gray-300 shadow-md transition-all"
				>
					<ChevronRight className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
};

export default SliderApartment;
